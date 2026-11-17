'use client';

import React from 'react';
import {
  Smartphone,
  GraduationCap,
  Clock,
  Moon,
  Sun,
  AlarmClock,
  Zap,
  EyeOff,
  Flame,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { SurveyStep, SurveyOption } from '@/types/survey';

const ICON_MAP = {
  Smartphone,
  GraduationCap,
  Clock,
  Moon,
  Sun,
  AlarmClock,
  Zap,
  EyeOff,
  Flame,
  Sparkles,
};

// 인라인 스타일로 브라우저에 100% 확실하고 비비드하게 렌더링되는 다채로운 테마 정의
export interface VividThemeConfig {
  borderColor: string;
  selectedBorder: string;
  bgGradient: string;
  selectedBg: string;
  iconGradient: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  titleColor: string;
  arrowColor: string;
  glowShadow: string;
  selectedGlow: string;
  accentBar: string;
}

export const VIVID_THEMES: Record<string, VividThemeConfig> = {
  // 1. 선명한 오렌지 / 선셋 코랄 (스마트폰 경고)
  orange: {
    borderColor: '#fb923c', // orange-400
    selectedBorder: '#ea580c', // orange-600
    bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.16) 0%, rgba(20, 16, 24, 0.96) 60%, rgba(15, 12, 20, 0.98) 100%)',
    selectedBg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.32) 0%, rgba(35, 20, 24, 0.98) 100%)',
    iconGradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    badgeBg: 'rgba(249, 115, 22, 0.22)',
    badgeText: '#fdba74', // orange-300
    badgeBorder: 'rgba(251, 146, 60, 0.5)',
    titleColor: '#ffedd5', // orange-100
    arrowColor: '#fb923c',
    glowShadow: '0 8px 24px -4px rgba(249, 115, 22, 0.25)',
    selectedGlow: '0 0 0 4px rgba(249, 115, 22, 0.4), 0 12px 30px -4px rgba(249, 115, 22, 0.45)',
    accentBar: 'linear-gradient(90deg, #f97316, #ef4444)',
  },
  // 2. 청량한 사파이어 / 스카이블루 (시험, 발표, 뇌 컨디션)
  blue: {
    borderColor: '#38bdf8', // sky-400
    selectedBorder: '#0284c7', // sky-600
    bgGradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.16) 0%, rgba(13, 20, 36, 0.96) 60%, rgba(10, 15, 28, 0.98) 100%)',
    selectedBg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.32) 0%, rgba(16, 28, 52, 0.98) 100%)',
    iconGradient: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
    badgeBg: 'rgba(14, 165, 233, 0.22)',
    badgeText: '#7dd3fc', // sky-300
    badgeBorder: 'rgba(56, 189, 248, 0.5)',
    titleColor: '#e0f2fe', // sky-100
    arrowColor: '#38bdf8',
    glowShadow: '0 8px 24px -4px rgba(14, 165, 233, 0.25)',
    selectedGlow: '0 0 0 4px rgba(14, 165, 233, 0.4), 0 12px 30px -4px rgba(14, 165, 233, 0.45)',
    accentBar: 'linear-gradient(90deg, #0284c7, #38bdf8)',
  },
  // 3. 싱그러운 에메랄드 / 민트그린 (상쾌한 기상, 에너지 충전)
  green: {
    borderColor: '#34d399', // emerald-400
    selectedBorder: '#059669', // emerald-600
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(11, 26, 23, 0.96) 60%, rgba(8, 20, 18, 0.98) 100%)',
    selectedBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.32) 0%, rgba(14, 38, 32, 0.98) 100%)',
    iconGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    badgeBg: 'rgba(16, 185, 129, 0.22)',
    badgeText: '#6ee7b7', // emerald-300
    badgeBorder: 'rgba(52, 211, 153, 0.5)',
    titleColor: '#d1fae5', // emerald-100
    arrowColor: '#34d399',
    glowShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.25)',
    selectedGlow: '0 0 0 4px rgba(16, 185, 129, 0.4), 0 12px 30px -4px rgba(16, 185, 129, 0.45)',
    accentBar: 'linear-gradient(90deg, #059669, #34d399)',
  },
  // 4. 영롱한 바이올렛 / 마젠타퍼플 (입면 뒤척임, 라벤더 릴렉스)
  purple: {
    borderColor: '#c084fc', // purple-400
    selectedBorder: '#7e22ce', // purple-700
    bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.16) 0%, rgba(22, 13, 34, 0.96) 60%, rgba(16, 10, 26, 0.98) 100%)',
    selectedBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.32) 0%, rgba(32, 18, 50, 0.98) 100%)',
    iconGradient: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
    badgeBg: 'rgba(168, 85, 247, 0.22)',
    badgeText: '#d8b4fe', // purple-300
    badgeBorder: 'rgba(192, 132, 252, 0.5)',
    titleColor: '#f3e8ff', // purple-100
    arrowColor: '#c084fc',
    glowShadow: '0 8px 24px -4px rgba(168, 85, 247, 0.25)',
    selectedGlow: '0 0 0 4px rgba(168, 85, 247, 0.4), 0 12px 30px -4px rgba(168, 85, 247, 0.45)',
    accentBar: 'linear-gradient(90deg, #9333ea, #ec4899)',
  },
};

// 각 단계의 4개 버튼에 배정할 4가지 뚜렷한 색상
const THEME_ORDER = ['orange', 'blue', 'green', 'purple'];

export const SURVEY_STEPS: SurveyStep[] = [
  {
    step: 1,
    questionNumber: '질문 1 / 3',
    title: '오늘 밤, 잠들지 못하고 있는 가장 큰 이유는 무엇인가요?',
    subtitle: '현재 겪고 있는 상태와 가장 가까운 카드를 클릭해 주세요.',
    options: [
      {
        id: 'q1-phone',
        iconName: 'Smartphone',
        title: '스마트폰 보느라 잠드는 시간을 놓쳤어',
        description: '쇼츠, 릴스, 웹툰 스크롤하느라 이미 1~2시간이 훌쩍 지나버린 상태',
        badge: '블루라이트 & 멜라토닌 억제',
        colorTheme: 'amber',
      },
      {
        id: 'q1-exam',
        iconName: 'GraduationCap',
        title: '내일 아침 중요한 시험 / 발표 / 면접이 있어',
        description: '다음 날 뇌 컨디션이 중요한데, 몇 시에 자고 일어날지 불안하고 막막함',
        badge: '기억력 & 렘수면 최적화 절실',
        colorTheme: 'blue',
      },
      {
        id: 'q1-calc',
        iconName: 'Clock',
        title: '지금 자면 몇 시에 일어나는 게 개운할지 모르겠어',
        description: '중간에 깨서 찌뿌둥하지 않도록 90분 사이클에 맞춘 정확한 시간 계산이 필요',
        badge: '90분 수면 사이클 역산',
        colorTheme: 'cyan',
      },
      {
        id: 'q1-insomnia',
        iconName: 'Moon',
        title: '몸은 너무 피곤한데 누워도 계속 뒤척여',
        description: '눈은 감았는데 잡생각이 많고 뇌가 아직 각성 상태라 잠이 안 옴',
        badge: '체온 저하 & 입면 유도 팁',
        colorTheme: 'purple',
      },
    ],
  },
  {
    step: 2,
    questionNumber: '질문 2 / 3',
    title: '내일 아침 언제 일어나야 하거나, 목표 기상 시각은 언제인가요?',
    subtitle: '입면 소요 시간(15분)과 렘수면 90분 주기를 데이터로 계산해 드립니다.',
    options: [
      {
        id: 'q2-early',
        iconName: 'Zap',
        title: '이른 아침 기상 (오전 6시 ~ 7시 필수)',
        description: '출근, 시험 입실 등 이른 시간까지 반드시 도착해야 하는 일정',
        badge: '최소 4.5h or 6h 사이클 맞춤',
        colorTheme: 'emerald',
      },
      {
        id: 'q2-normal',
        iconName: 'Sun',
        title: '오전 보통 기상 (오전 7시 30분 ~ 9시)',
        description: '비교적 여유 있지만 내일 하루를 위해 가장 상쾌한 기상이 필요',
        badge: '권장 6h or 7.5h 사이클',
        colorTheme: 'blue',
      },
      {
        id: 'q2-now',
        iconName: 'Clock',
        title: '지금 당장 잘 준비 완료 (현재 시각 기준)',
        description: '지금 바로 누울 테니, 뇌 피로도를 0으로 만드는 시각을 추천해줘',
        badge: '실시간 90분 주기 계산',
        colorTheme: 'cyan',
      },
      {
        id: 'q2-later',
        iconName: 'EyeOff',
        title: '폰 정리하고 30분~1시간 뒤에나 잘 것 같아',
        description: '아직 당장 잠들기 어려워 취침 준비 시간을 감안한 계산이 필요',
        badge: '입면 지연 시간 반영',
        colorTheme: 'purple',
      },
    ],
  },
  {
    step: 3,
    questionNumber: '질문 3 / 3',
    title: '오늘 밤 숙면을 위해 지금 바로 스스로 실천할 행동은?',
    subtitle: '챗봇은 폰을 대신 꺼주거나 알람을 켜줄 수 없습니다. 직접 실천할 항목을 골라주세요.',
    options: [
      {
        id: 'q3-phone-down',
        iconName: 'Smartphone',
        title: '스마트폰을 손 닿지 않는 곳에 뒤집어두고 눈 감기',
        description: '챗봇의 조언을 듣고 지금 즉시 스마트폰 화면을 암전시키고 취침 돌입',
        badge: '직접 실천 1순위',
        colorTheme: 'blue',
      },
      {
        id: 'q3-set-alarm',
        iconName: 'AlarmClock',
        title: '추천받은 시각으로 내 손으로 직접 알람 맞추기',
        description: '90분 주기가 끝나는 최적 기상 시각에 직접 스마트폰 알람 앱 켜기',
        badge: '기상 알람 직접 설정',
        colorTheme: 'emerald',
      },
      {
        id: 'q3-breathe',
        iconName: 'Moon',
        title: '방 불 끄고 복식호흡 4-7-8로 체온 낮추기',
        description: '심박수를 안정시키고 체온을 1도 낮춰 자연스러운 졸음을 유도',
        badge: '과학적 입면 루틴',
        colorTheme: 'cyan',
      },
      {
        id: 'q3-chat',
        iconName: 'Sparkles',
        title: '수면 컨설턴트의 맞춤 조언을 보고 바로 행동하기',
        description: '내 상황에 맞는 3줄 핵심 처방을 확인하고 1:1 대화로 실천 확인하기',
        badge: '맞춤형 솔루션 확인',
        colorTheme: 'purple',
      },
    ],
  },
];

interface SleepSurveyFlowProps {
  currentStepIndex: number;
  selectedAnswers: Record<number, SurveyOption>;
  onSelectOption: (option: SurveyOption) => void;
  onPrevStep: () => void;
  botName: string;
}

export default function SleepSurveyFlow({
  currentStepIndex,
  selectedAnswers,
  onSelectOption,
  onPrevStep,
  botName,
}: SleepSurveyFlowProps) {
  const stepData = SURVEY_STEPS[currentStepIndex];
  if (!stepData) return null;

  const progressPercent = ((currentStepIndex + 1) / SURVEY_STEPS.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col py-6 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 상단 프로그레스 바 & 헤더 정보 */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 shadow-sm">
              {stepData.questionNumber}
            </span>
            <span className="text-slate-300 font-semibold">맞춤 수면 솔루션 진단</span>
          </div>
          <span className="font-mono text-indigo-300 font-black text-sm">{Math.round(progressPercent)}%</span>
        </div>

        {/* 프로그레스 게이지 바 */}
        <div className="w-full h-3.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/80 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-sky-400 via-emerald-400 to-purple-500 rounded-full transition-all duration-500 shadow-md"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 질문 타이틀 영역 */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug mb-3">
          {stepData.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 font-normal">
          {stepData.subtitle}
        </p>
      </div>

      {/* ★ 4개 버튼별 완전 다른 고유 컬러 & 넓은 간격(gap-6 sm:gap-7)의 선택 카드 그리드 ★ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7 mb-8">
        {stepData.options.map((option, idx) => {
          const IconComp = ICON_MAP[option.iconName] || Sparkles;
          const themeKey = THEME_ORDER[idx % THEME_ORDER.length];
          const theme = VIVID_THEMES[themeKey] || VIVID_THEMES.orange;
          const isSelected = selectedAnswers[stepData.step]?.id === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option)}
              style={{
                background: isSelected ? theme.selectedBg : theme.bgGradient,
                borderColor: isSelected ? theme.selectedBorder : theme.borderColor,
                boxShadow: isSelected ? theme.selectedGlow : theme.glowShadow,
              }}
              className="group relative flex flex-col p-6 sm:p-7 rounded-[26px] border-[2.5px] transition-all duration-200 text-left cursor-pointer hover:scale-[1.025] hover:-translate-y-0.5 overflow-hidden"
            >
              {/* 상단 컬러 악센트 라인 */}
              <div
                style={{ background: theme.accentBar }}
                className="absolute top-0 left-0 right-0 h-1.5 opacity-90 group-hover:opacity-100 transition-opacity"
              />

              {/* 카드 상단: 선명한 그라데이션 아이콘 & 고대비 유색 배지 */}
              <div className="flex items-center justify-between mb-4 mt-1">
                <div
                  style={{ background: theme.iconGradient }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                >
                  <IconComp className="w-6 h-6" />
                </div>
                <span
                  style={{
                    backgroundColor: theme.badgeBg,
                    color: theme.badgeText,
                    borderColor: theme.badgeBorder,
                  }}
                  className="text-xs font-bold px-3 py-1 rounded-full border shadow-sm"
                >
                  {option.badge}
                </span>
              </div>

              {/* 제목 (선명하고 큼직하게) */}
              <h3
                style={{ color: theme.titleColor }}
                className="text-lg sm:text-xl font-black mb-2 leading-snug group-hover:brightness-110 transition-colors"
              >
                {option.title}
              </h3>

              {/* 설명 (여유로운 행간과 크기) */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
                {option.description}
              </p>

              {/* 하단 클릭 피드백 바 */}
              <div
                style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}
                className="flex items-center justify-between mt-5 pt-4 border-t text-xs sm:text-sm font-bold"
              >
                <span className="flex items-center gap-1.5">
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">선택 완료</span>
                    </>
                  ) : (
                    <span className="text-slate-300 group-hover:text-white transition-colors">클릭하여 선택</span>
                  )}
                </span>
                <div
                  style={{ color: theme.arrowColor }}
                  className="flex items-center gap-1.5 font-extrabold group-hover:translate-x-1 transition-transform"
                >
                  <span>선택하기</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 하단 네비게이션 버튼 (이전 단계) */}
      <div className="flex items-center justify-between pt-1">
        {currentStepIndex > 0 ? (
          <button
            type="button"
            onClick={onPrevStep}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전 질문으로</span>
          </button>
        ) : (
          <span className="text-xs sm:text-sm text-slate-400 font-medium">
            {botName}가 3가지 질문을 통해 최적의 기상 주기와 행동 솔루션을 도출합니다.
          </span>
        )}
      </div>
    </div>
  );
}
