'use client';

import React, { useState } from 'react';
import { X, Settings2, ShieldAlert, BookOpen, Key, Check, Info } from 'lucide-react';
import { getSystemPrompt } from '@/lib/pti-prompt';

interface PtiModalProps {
  isOpen: boolean;
  onClose: () => void;
  botName: string;
  onUpdateBotName: (name: string) => void;
  mode: 'embedded' | 'llm';
  onUpdateMode: (mode: 'embedded' | 'llm') => void;
  apiKey: string;
  onUpdateApiKey: (key: string) => void;
}

export default function PtiModal({
  isOpen,
  onClose,
  botName,
  onUpdateBotName,
  mode,
  onUpdateMode,
  apiKey,
  onUpdateApiKey,
}: PtiModalProps) {
  const [tempName, setTempName] = useState(botName);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [savedToast, setSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'pti'>('config');

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateBotName(tempName.trim() || '슬립메이트');
    onUpdateApiKey(tempApiKey.trim());
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  const systemPromptText = getSystemPrompt(tempName || '슬립메이트');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#131b2e] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/80 text-slate-100 overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#101726]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">챗봇 설정 및 P·T·I 프롬프트</h2>
              <p className="text-xs text-slate-300">페르소나, 목표, 진행 규칙을 확인하고 관리합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-slate-800 bg-[#0d1322] px-6">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'config'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            기본 설정 & 모드
          </button>
          <button
            onClick={() => setActiveTab('pti')}
            className={`py-3.5 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'pti'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            P·T·I 시스템 프롬프트 확인
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#131b2e]">
          {activeTab === 'config' ? (
            <div className="space-y-5">
              {/* 챗봇 이름 설정 */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  챗봇 이름
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="예: 슬립메이트, 닥터나이트, 꿀잠이"
                  className="w-full bg-[#0d1322] border border-slate-700 rounded-xl px-4 py-2.5 text-base text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                />
                <p className="text-xs text-slate-400 mt-1">
                  질문 화면의 타이틀 및 대화 내 페르소나 소개에 즉시 반영됩니다.
                </p>
              </div>

              {/* 엔진 모드 선택 */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  실행 모드
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => onUpdateMode('embedded')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      mode === 'embedded'
                        ? 'bg-indigo-950/60 border-indigo-400 text-white ring-2 ring-indigo-500/20'
                        : 'bg-[#0d1322] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-white">🌙 내장 모드 (기본)</span>
                      {mode === 'embedded' && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      API 키 없이도 즉시 체험 가능! P·T·I 규칙과 90분 렘수면 주기 알고리즘이 완벽히 내장되어 있습니다.
                    </p>
                  </div>

                  <div
                    onClick={() => onUpdateMode('llm')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      mode === 'llm'
                        ? 'bg-indigo-950/60 border-indigo-400 text-white ring-2 ring-indigo-500/20'
                        : 'bg-[#0d1322] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-white">⚡ LLM 연결 모드</span>
                      {mode === 'llm' && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Gemini API 키를 입력하여 실제 고성능 생성형 AI 모델과 실시간으로 대화합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* LLM API 키 입력 (선택) */}
              {mode === 'llm' && (
                <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Key className="w-4 h-4 text-indigo-400" />
                    <span>Gemini API 키 (선택 사항)</span>
                  </div>
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="AIzaSy... (미입력 시 내장 모드로 자동 대체)"
                    className="w-full bg-[#182234] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-400"
                  />
                  <p className="text-xs text-slate-400">
                    입력한 API 키는 브라우저 로컬 저장소에만 보관되며 외부로 노출되지 않습니다.
                  </p>
                </div>
              )}

              {/* 핵심 규칙 안내 카드 */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>적용된 금지 및 대체 행동 가이드라인</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-200 leading-relaxed">
                  <li><strong>스마트폰 제어 금지:</strong> 챗봇이 폰을 꺼주지 않고, 사용자가 직접 눈을 감도록 유도</li>
                  <li><strong>알람 제어 금지:</strong> 임의로 알람을 켜지 않고, 최적 기상 시각 안내 후 직접 맞추도록 격려</li>
                  <li><strong>형식 규칙:</strong> 친근한 반말, 핵심만 3줄 이내 요약</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-950/60 border border-indigo-700/60 rounded-xl flex items-start gap-2.5 text-xs text-indigo-200">
                <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span>
                  아래 프롬프트는 서버의 Next.js API 엔드포인트(`src/app/api/chat/route.ts`)에 시스템 프롬프트로 주입되어 작동합니다.
                </span>
              </div>
              <pre className="p-4 bg-[#0d1322] border border-slate-700 rounded-xl text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {systemPromptText}
              </pre>
            </div>
          )}
        </div>

        {/* 모달 풋터 */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#101726] flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">
            {savedToast ? '✅ 설정이 저장되었습니다!' : '설정 변경 후 저장을 눌러주세요.'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              닫기
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              저장 및 적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
