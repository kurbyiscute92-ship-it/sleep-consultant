'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  GraduationCap,
  Clock,
  Moon,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';

export interface SituationOption {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  tag: string;
  prompt: string;
  color: string;
}

export const SITUATIONS: SituationOption[] = [
  {
    id: 'smartphone',
    icon: Smartphone,
    title: '스마트폰 하느라 잠드는 시간을 놓쳤어',
    desc: '유튜브, 쇼츠, 웹툰 보느라 1~2시간째 못 자고 있어. 지금이라도 빨리 자야 해.',
    tag: '패턴 붕괴 / 블루라이트 각성',
    prompt: '매일 밤 침대에서 스마트폰(쇼츠/유튜브) 보느라 잠드는 시간을 놓쳤어. 지금이라도 바로 잠들고 싶은데 어떻게 해야 해?',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
  },
  {
    id: 'exam',
    icon: GraduationCap,
    title: '내일 아침 중요한 시험 / 발표 / 면접이 있어',
    desc: '다음 날 이른 일정인데 밤늦게 누워서 몇 시에 일어나야 뇌가 맑을지 막막해.',
    tag: '최상의 뇌 컨디션 절실',
    prompt: '내일 아침에 중요한 시험(발표/면접)이 있어. 다음 날 뇌가 멍하지 않도록 최적의 수면 시간과 기상 시각을 알려줘!',
    color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/40 text-indigo-300',
  },
  {
    id: 'calculate',
    icon: Clock,
    title: '지금 자면 몇 시에 일어나야 할지 계산이 막막해',
    desc: '자다 깨서 피곤하지 않으려면 지금 누워서 몇 시간 자야 할지 딱 정해줘.',
    tag: '90분 렘수면 주기 계산',
    prompt: '지금 자리에 누웠는데, 90분 수면 주기 계산상 몇 시에 일어나는 게 가장 개운할까?',
    color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-300',
  },
  {
    id: 'insomnia',
    icon: Moon,
    title: '몸은 피곤한데 뒤척이고 잠이 안 와',
    desc: '눈은 감았는데 잡생각이 많고 뇌가 각성되어 있어서 잠드는 법이 필요해.',
    tag: '체온 저하 & 입면 유도',
    prompt: '몸은 피곤한데 자리에 누워도 계속 뒤척이고 잠이 안 와. 과학적인 입면 팁 좀 알려줘.',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300',
  },
];

interface SituationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSituation: (situation: SituationOption, customText?: string) => void;
  botName: string;
}

export default function SituationModal({
  isOpen,
  onClose,
  onSelectSituation,
  botName,
}: SituationModalProps) {
  const [customText, setCustomText] = useState('');
  const [selectedId, setSelectedId] = useState<string>('exam');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (customText.trim()) {
      onSelectSituation(
        {
          id: 'custom',
          icon: Sparkles,
          title: '직접 입력한 상황',
          desc: customText,
          tag: '맞춤형 상황',
          prompt: customText,
          color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-300',
        },
        customText.trim()
      );
    } else {
      const selected = SITUATIONS.find((s) => s.id === selectedId) || SITUATIONS[0];
      onSelectSituation(selected);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111827] border-2 border-indigo-500/40 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl shadow-indigo-950/80 text-white overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-slate-800 bg-[#0f172a] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Moon className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  수면 상태 사전 진단
                </span>
                <span className="text-xs text-slate-400 font-medium">1초 맞춤 설정</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                오늘 밤, 어떤 상황이신가요?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                수면 컨설턴트 {botName}가 상황에 딱 맞는 90분 주기와 행동 가이드를 처방해 드립니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 바디 (상황 카드 목록) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1 bg-[#111827]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SITUATIONS.map((sit) => {
              const IconComp = sit.icon;
              const isSelected = selectedId === sit.id && !customText.trim();

              return (
                <div
                  key={sit.id}
                  onClick={() => {
                    setSelectedId(sit.id);
                    setCustomText('');
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1e293b] border-indigo-400 shadow-lg shadow-indigo-950/60 ring-2 ring-indigo-500/30'
                      : 'bg-[#151f32] border-slate-800 hover:border-slate-700 hover:bg-[#1a253c]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${sit.color}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {sit.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-white mb-1 leading-snug">
                      {sit.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sit.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80">
                    <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          선택됨
                        </>
                      ) : (
                        '이 상황으로 시작'
                      )}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-indigo-300' : 'text-slate-500'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 직접 상황 입력란 */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              직접 내 상황 입력하기 (선택)
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="예: 내일 아침 7시에 회의가 있는데 과제하느라 아직 못 잤어..."
              className="w-full bg-[#0d1322] border-2 border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* 풋터 */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            상황 선택 건너뛰기
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>맞춤 컨설팅 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
