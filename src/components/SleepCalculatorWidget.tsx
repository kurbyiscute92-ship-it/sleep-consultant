'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Clock, Sparkles } from 'lucide-react';
import { calculateSleepCycles } from '@/lib/pti-prompt';

interface SleepCalculatorWidgetProps {
  onSelectTime?: (timeText: string) => void;
}

export default function SleepCalculatorWidget({ onSelectTime }: SleepCalculatorWidgetProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [cycles, setCycles] = useState<ReturnType<typeof calculateSleepCycles>>([]);

  useEffect(() => {
    setCurrentTime(new Date());
    setCycles(calculateSleepCycles(new Date(), 15));

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCycles(calculateSleepCycles(now, 15));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!currentTime) return null;

  const timeString = currentTime.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-[#131b2e] border border-slate-700/80 rounded-2xl p-4 shadow-xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Moon className="w-5 h-5 fill-indigo-400/20" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              실시간 90분 렘수면 주기 분석기
            </h2>
            <p className="text-xs text-slate-300">지금 누우면(입면 15분) 가장 개운하게 일어날 수 있는 시각</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200 bg-indigo-950/80 px-3 py-1.5 rounded-full border border-indigo-700/50">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>현재 시각 {timeString}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {cycles.map((c) => (
          <button
            key={c.cycles}
            type="button"
            onClick={() => onSelectTime?.(`지금 자면 ${c.wakeTime}(${c.cycles}주기, ${c.hours}시간)에 일어나도 괜찮아?`)}
            className="group flex flex-col p-3 rounded-xl bg-[#1a233a] hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-400 transition-all text-left cursor-pointer shadow-sm hover:shadow-indigo-500/20"
          >
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 group-hover:text-indigo-200">
              <span className="font-semibold">{c.cycles}사이클 ({c.hours}h)</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-80" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-300 font-mono my-1 tracking-tight">
              {c.wakeTime}
            </div>
            <div className="text-[11px] font-medium text-indigo-300/90 group-hover:text-white truncate">
              {c.tag}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
