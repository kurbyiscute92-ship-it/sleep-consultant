'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Moon,
  Smartphone,
  RotateCcw,
  Sliders,
  CheckCircle2,
  CalendarCheck2,
  Clock,
  CornerDownLeft,
  ShieldCheck,
  ListRestart,
  RefreshCw,
} from 'lucide-react';
import { Message } from '@/types/chat';
import SleepCalculatorWidget from './SleepCalculatorWidget';
import PtiModal from './PtiModal';
import SleepSurveyFlow, { SURVEY_STEPS } from './SleepSurveyFlow';
import { SurveyOption } from '@/types/survey';

const QUICK_PROMPTS = [
  {
    icon: Clock,
    label: '지금 자면 몇 시에 일어나야 해?',
    prompt: '지금 자리에 누웠는데 몇 시에 일어나는 게 가장 개운해?',
  },
  {
    icon: CalendarCheck2,
    label: '내일 중요한 시험/발표가 있어',
    prompt: '내일 아침 9시에 중요한 시험(발표)이 있어. 수면 패턴 어떻게 맞춰야 할까?',
  },
  {
    icon: Smartphone,
    label: '스마트폰 보느라 잠을 못 자겠어',
    prompt: '자려고 누웠는데 폰으로 쇼츠 보느라 1시간째 못 자고 있어...',
  },
  {
    icon: ShieldCheck,
    label: '대신 폰 꺼주고 알람 맞춰줘 (금지행동 테스트)',
    prompt: '너무 졸린데 네가 내 스마트폰 전원 끄고 알람 좀 맞춰줘!',
  },
];

export default function SleepChat() {
  const [botName, setBotName] = useState<string>('슬립메이트');
  const [mode, setMode] = useState<'embedded' | 'llm'>('embedded');
  const [apiKey, setApiKey] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 화면 모드: 'survey' (단계별 질문 화면) vs 'chat' (솔루션 및 대화 화면)
  const [viewMode, setViewMode] = useState<'survey' | 'chat'>('survey');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, SurveyOption>>({});

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 로컬 스토리지에서 설정 불러오기
  useEffect(() => {
    const savedName = localStorage.getItem('sleep_bot_name');
    if (savedName) setBotName(savedName);
    const savedKey = localStorage.getItem('sleep_bot_gemini_key');
    if (savedKey) setApiKey(savedKey);
    const savedMode = localStorage.getItem('sleep_bot_mode') as 'embedded' | 'llm';
    if (savedMode) setMode(savedMode);
  }, []);

  const handleUpdateBotName = (name: string) => {
    setBotName(name);
    localStorage.setItem('sleep_bot_name', name);
  };

  const handleUpdateMode = (newMode: 'embedded' | 'llm') => {
    setMode(newMode);
    localStorage.setItem('sleep_bot_mode', newMode);
  };

  const handleUpdateApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('sleep_bot_gemini_key', key);
  };

  // 자동 스크롤
  useEffect(() => {
    if (viewMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, viewMode]);

  // textarea 높이 자동 조절 (Gemini 스타일)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputMessage]);

  // 설문 단계별 선택 처리
  const handleSelectOption = (option: SurveyOption) => {
    const currentStep = SURVEY_STEPS[currentStepIndex].step;
    const nextAnswers = { ...selectedAnswers, [currentStep]: option };
    setSelectedAnswers(nextAnswers);

    // 다음 질문으로 이동하거나, 마지막 질문이면 솔루션 & 대화 화면으로 진입
    if (currentStepIndex < SURVEY_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      finishSurveyAndStartChat(nextAnswers);
    }
  };

  // 설문 완료 후 솔루션 카드 생성 및 챗봇 오프닝 메시지 요청
  const finishSurveyAndStartChat = async (answers: Record<number, SurveyOption>) => {
    setViewMode('chat');
    setIsLoading(true);

    const q1Text = answers[1]?.title || '스마트폰 사용';
    const q2Text = answers[2]?.title || '이른 기상';
    const q3Text = answers[3]?.title || '직접 알람 맞추기';

    const diagnosticSummary = `[수면 진단 응답]
1. 현재 상황: ${q1Text} (${answers[1]?.badge || ''})
2. 목표 일정: ${q2Text}
3. 실천 다짐: ${q3Text}
내 상황에 맞는 90분 주기 계산과 3줄 처방 솔루션을 줘!`;

    const userMsg: Message = {
      id: `user-diag-${Date.now()}`,
      role: 'user',
      content: diagnosticSummary,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([userMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [userMsg],
          mode,
          apiKey,
          botName,
        }),
      });

      if (!response.ok) throw new Error('응답 실패');

      const data = await response.json();
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        sleepCycles: data.sleepCycles,
      };

      setMessages([userMsg, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages([
        userMsg,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `선택한 진단 데이터를 접수했어! 90분 렘수면 주기를 고려해서 지금 즉시 스마트폰을 책상에 뒤집어두고 알람을 맞춰둬.\n지금 바로 폰 내려놓고 눈 감을 준비 됐어?`,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 일반 채팅 메시지 전송
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: timeStr,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          mode,
          apiKey,
          botName,
        }),
      });

      if (!response.ok) throw new Error('응답 실패');

      const data = await response.json();
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        sleepCycles: data.sleepCycles,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `잠시 통신에 문제가 생겼어! 하지만 원칙은 분명해: 90분 수면 주기를 고려해서 지금 즉시 스마트폰을 내려놓고 알람을 맞춰둬.\n지금 바로 폰 뒤집어둘 준비 됐어?`,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 진단 다시 풀기
  const handleRestartSurvey = () => {
    setCurrentStepIndex(0);
    setSelectedAnswers({});
    setMessages([]);
    setViewMode('survey');
  };

  // 챗봇 답변을 줄바꿈 단위로 분리하여 한 줄씩 카드형으로 가독성 극대화
  const renderAssistantContent = (content: string) => {
    const lines = content.split('\n').filter((line) => line.trim().length > 0);

    if (lines.length <= 1) {
      return <p className="text-[15px] sm:text-base leading-relaxed text-slate-100 font-normal">{content}</p>;
    }

    return (
      <div className="space-y-3">
        {lines.map((line, index) => {
          const isActionLine = /알람|폰|스마트폰|내려놓|눈 감|끄/i.test(line);
          const isQuestionLine = line.includes('?') || line.includes('있어') || line.includes('됐어') || line.includes('알려줘');

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3.5 rounded-2xl text-[15px] sm:text-base leading-relaxed ${
                isActionLine
                  ? 'bg-gradient-to-r from-indigo-950/80 to-blue-950/70 border-2 border-indigo-500/80 text-indigo-100 font-medium shadow-md'
                  : isQuestionLine
                  ? 'bg-gradient-to-r from-amber-950/60 to-orange-950/50 border-2 border-amber-500/80 text-amber-200 font-medium shadow-md'
                  : 'bg-slate-900/80 border border-slate-700 text-slate-100'
              }`}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600/60 text-white text-xs font-black shrink-0 mt-0.5 shadow-sm">
                {index + 1}
              </span>
              <span className="flex-1">{line}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-5">
      {/* 상단 통합 헤더 */}
      <header className="flex items-center justify-between px-5 py-3.5 bg-[#131b2e] border-2 border-slate-700 rounded-2xl mb-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
              <Moon className="w-6 h-6 fill-white text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#131b2e]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">{botName}</h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 font-bold">
                수면 컨설턴트
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              데이터 분석가형 조력가 · 90분 렘수면 주기 최적화
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 진단 질문으로 전환하는 상시 버튼 */}
          <button
            onClick={handleRestartSurvey}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer ${
              viewMode === 'survey'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-orange-500/30'
                : 'bg-indigo-900/90 border border-indigo-500 text-indigo-200 hover:text-white'
            }`}
            title="진단 질문 다시 시작"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{viewMode === 'survey' ? '1단계부터 진행 중' : '진단 다시하기'}</span>
          </button>

          {/* 모드 배지 */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a233a] border border-slate-600 hover:border-indigo-400 transition-colors text-slate-200 cursor-pointer"
            title="모드 및 설정 변경"
          >
            {mode === 'embedded' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-cyan-200 font-bold">내장 모드</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-200 font-bold">LLM</span>
              </>
            )}
          </button>

          {/* 설정 버튼 */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2.5 rounded-xl bg-[#1a233a] hover:bg-slate-700 text-slate-200 transition-colors border border-slate-600 cursor-pointer"
            title="P·T·I 프롬프트 및 설정"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================
          1. 설문 질문 화면 (각 질문을 순서대로 하나씩 제시)
         ======================================================== */}
      {viewMode === 'survey' ? (
        <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto">
          <SleepSurveyFlow
            currentStepIndex={currentStepIndex}
            selectedAnswers={selectedAnswers}
            onSelectOption={handleSelectOption}
            onPrevStep={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            botName={botName}
          />
        </div>
      ) : (
        /* ========================================================
            2. 솔루션 카드 + 챗봇 대화 화면
           ======================================================== */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 상단 맞춤 진단 결과 브리핑 카드 */}
          <div className="bg-gradient-to-r from-[#172038] via-[#1b2646] to-[#18213b] border-2 border-indigo-500 rounded-3xl p-4 sm:p-5 mb-3 shadow-xl text-white">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-indigo-800/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    3단계 수면 진단 분석 완료
                  </h3>
                  <p className="text-xs text-slate-300">사용자의 선택 데이터에 맞춰 90분 사이클을 처방했습니다.</p>
                </div>
              </div>
              <button
                onClick={handleRestartSurvey}
                className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors underline underline-offset-4 cursor-pointer"
              >
                <span>상황 변경 / 재진단</span>
              </button>
            </div>

            {/* 선택된 3가지 핵심 키워드 배지 (완전 뚜렷한 3색 팔레트) */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <span
                style={{
                  backgroundColor: 'rgba(249, 115, 22, 0.25)',
                  color: '#fdba74',
                  borderColor: '#fb923c',
                }}
                className="px-3.5 py-1.5 rounded-xl border-2 font-bold shadow-sm"
              >
                1. {selectedAnswers[1]?.title || '현재 상황'}
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(14, 165, 233, 0.25)',
                  color: '#7dd3fc',
                  borderColor: '#38bdf8',
                }}
                className="px-3.5 py-1.5 rounded-xl border-2 font-bold shadow-sm"
              >
                2. {selectedAnswers[2]?.title || '목표 시각'}
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.25)',
                  color: '#6ee7b7',
                  borderColor: '#34d399',
                }}
                className="px-3.5 py-1.5 rounded-xl border-2 font-bold shadow-sm"
              >
                3. {selectedAnswers[3]?.title || '실천 행동'}
              </span>
            </div>
          </div>

          {/* 실시간 90분 렘수면 계산 위젯 */}
          <div className="mb-3">
            <SleepCalculatorWidget
              onSelectTime={(questionText) => handleSendMessage(questionText)}
            />
          </div>

          {/* 채팅 메시지 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 bg-[#0d1322] border border-slate-800 rounded-3xl mb-3 space-y-5 shadow-inner">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-3.5 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  } animate-in fade-in duration-150`}
                >
                  {/* 아바타 */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold shadow-md ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#1e293b] text-indigo-400 border border-slate-600'
                    }`}
                  >
                    {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>

                  {/* 말풍선 본문 */}
                  <div className={`flex flex-col max-w-[88%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      <span className="text-xs font-bold text-slate-300">
                        {isUser ? '나' : botName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{message.timestamp}</span>
                    </div>

                    <div
                      className={`px-5 py-4 rounded-3xl text-[15px] sm:text-base leading-relaxed shadow-lg ${
                        isUser
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none font-medium'
                          : 'bg-[#182234] border border-slate-700 text-slate-100 rounded-tl-none ring-1 ring-slate-700/60'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        renderAssistantContent(message.content)
                      )}

                      {/* 수면 주기 추천 카드가 있을 경우 */}
                      {!isUser && message.sleepCycles && message.sleepCycles.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-slate-700/80 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            <span>데이터 분석 기반 추천 기상 시각</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2.5 pt-1">
                            {message.sleepCycles.slice(1, 3).map((item) => (
                              <div
                                key={item.cycles}
                                className="bg-[#0f172a] border border-indigo-700/60 rounded-2xl p-3 text-xs shadow-inner"
                              >
                                <div className="text-[11px] font-semibold text-slate-400">{item.cycles}사이클 ({item.hours}h)</div>
                                <div className="text-xl font-black text-indigo-300 font-mono my-0.5">{item.wakeTime}</div>
                                <div className="text-[11px] font-medium text-emerald-400">{item.tag}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 챗봇 답변 하단 실천 다짐 격려 배지 (금지/대체 행동 강조) */}
                    {!isUser && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mt-2 px-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>직접 스마트폰을 내려놓고 알람을 설정해 보세요</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* 로딩 인디케이터 */}
            {isLoading && (
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#1e293b] text-indigo-400 border border-slate-600 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div className="bg-[#182234] border border-slate-700 px-5 py-4 rounded-3xl rounded-tl-none text-slate-200 text-sm flex items-center gap-3 shadow-md">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm font-medium text-slate-300">90분 수면 패턴 및 기상 주기 계산 중...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 퀵 프롬프트 칩 목록 */}
          <div className="mb-2.5 overflow-x-auto pb-1 flex gap-2.5 scrollbar-none">
            {QUICK_PROMPTS.map((q, idx) => {
              const IconComp = q.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(q.prompt)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#131b2e] hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-400 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-all shrink-0 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <IconComp className="w-4 h-4 text-indigo-400" />
                  <span>{q.label}</span>
                </button>
              );
            })}
          </div>

          {/* ★ Gemini 스타일의 플로팅 둥근 대화 입력 카드 ★ */}
          <div className="relative bg-[#182032] border-2 border-slate-700/80 rounded-[28px] p-3 sm:p-3.5 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/15 shadow-2xl transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="추가로 궁금한 점을 질문해 보세요 (Shift + Enter 줄바꿈)"
              disabled={isLoading}
              className="w-full bg-transparent px-3 py-1.5 text-base text-white placeholder:text-slate-400 focus:outline-none resize-none min-h-[44px] max-h-[160px] leading-relaxed"
            />

            {/* Gemini 스타일 툴바 */}
            <div className="flex items-center justify-between pt-2 px-2 border-t border-slate-700/40 mt-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 font-semibold">
                  <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Enter로 전송</span>
                </span>
                <span className="hidden sm:inline text-xs text-slate-400">
                  · 90분 주기 데이터 실시간 분석
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed ${
                  inputMessage.trim() && !isLoading
                    ? 'bg-gradient-to-tr from-indigo-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-indigo-600/40 hover:scale-105 active:scale-95'
                    : 'bg-slate-800 text-slate-500 opacity-60'
                }`}
                title="메시지 전송"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Gemini 스타일 하단 디스클레이머 */}
          <p className="text-center text-[11px] text-slate-400 mt-2.5">
            슬립메이트는 90분 렘수면 데이터 기반으로 솔루션을 제공하며, 알람 설정과 폰 종료는 사용자가 직접 실천해야 합니다.
          </p>
        </div>
      )}

      {/* P·T·I 모달 */}
      <PtiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        botName={botName}
        onUpdateBotName={handleUpdateBotName}
        mode={mode}
        onUpdateMode={handleUpdateMode}
        apiKey={apiKey}
        onUpdateApiKey={handleUpdateApiKey}
      />
    </div>
  );
}
