import React from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { HabitLog } from '../types';
import { Activity, Moon, Droplet, Sun, Pill, ShieldCheck, HelpCircle } from 'lucide-react';

interface HabitsSectionProps {
  habits: HabitLog;
  onUpdate: (habits: Partial<HabitLog>) => void;
}

export default function HabitsSection({ habits, onUpdate }: HabitsSectionProps) {
  const { t, language } = useLanguageTheme();

  // Calculate Health score of today's logged habits
  // Max score: 100
  let score = 0;
  if (habits.agua >= 3000) score += 20;
  else if (habits.agua >= 1500) score += 10;

  if (habits.sono >= 8) score += 20;
  else if (habits.sono >= 6) score += 10;

  if (habits.treino) score += 20;
  if (habits.suplementos) score += 15;
  if (habits.sol) score += 15;
  
  // Mood / Energy adjustments
  if (habits.energia >= 4) score += 10;

  score = Math.min(100, score);

  let scoreFeedback = '';
  let scoreColor = '';
  if (score >= 80) {
    scoreFeedback = language === 'pt' ? 'EXCELENTE' : 'EXCELLENT';
    scoreColor = 'text-green-500';
  } else if (score >= 50) {
    scoreFeedback = language === 'pt' ? 'BOM' : 'GOOD';
    scoreColor = 'text-blue-400';
  } else {
    scoreFeedback = language === 'pt' ? 'REGULAR / EM ADAPTAÇÃO' : 'REGULAR / ADAPTING';
    scoreColor = 'text-yellow-500';
  }

  return (
    <div id="habits-tab" className="space-y-6 text-slate-900 dark:text-slate-100">
      <header className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 md:w-8 md:h-8 text-blue-500 animate-pulse" />
          {t('habits.title')}
        </h2>
        <p className="text-sm opacity-60 font-medium text-slate-500 dark:text-slate-400">{t('habits.intro')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habits Inputs */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Hábitos de Hoje</h3>

          {/* Water Intake */}
          <div className="space-y-3 p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl shadow-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-500" />
                {t('habits.water')}
              </span>
              <span className="font-bold text-sm text-blue-600 dark:text-blue-400">{habits.agua} ml / 3000 ml</span>
            </div>
            <input
              id="habit-water-slider"
              type="range"
              min="0"
              max="4000"
              step="250"
              value={habits.agua}
              onChange={(e) => onUpdate({ agua: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Sleep Hours */}
          <div className="space-y-3 p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl shadow-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                {t('habits.sleep')}
              </span>
              <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{habits.sono} horas / 8 horas</span>
            </div>
            <input
              id="habit-sleep-slider"
              type="range"
              min="0"
              max="12"
              step="1"
              value={habits.sono}
              onChange={(e) => onUpdate({ sono: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 dark:accent-indigo-400"
            />
          </div>

          {/* Checklist with switch toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => onUpdate({ treino: !habits.treino })}
              className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer h-24 transition-all ${
                habits.treino
                  ? 'bg-green-500/5 dark:bg-green-500/10 border-green-500/20 dark:border-green-500/30 text-green-600 dark:text-green-400 font-bold'
                  : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-750 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-white/10 shadow-xs'
              }`}
            >
              <Activity className="w-5 h-5" />
              <div>
                <p className="text-xs font-bold">{t('habits.workout')}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{habits.treino ? 'Sim' : 'Não'}</p>
              </div>
            </div>

            <div
              onClick={() => onUpdate({ sol: !habits.sol })}
              className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer h-24 transition-all ${
                habits.sol
                  ? 'bg-yellow-500/5 dark:bg-yellow-500/10 border-yellow-500/20 dark:border-yellow-500/30 text-yellow-650 dark:text-yellow-450 font-bold'
                  : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-750 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-white/10 shadow-xs'
              }`}
            >
              <Sun className="w-5 h-5" />
              <div>
                <p className="text-xs font-bold">{t('habits.sun')}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{habits.sol ? 'Sim' : 'Não'}</p>
              </div>
            </div>

            <div
              onClick={() => onUpdate({ suplementos: !habits.suplementos })}
              className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer h-24 transition-all ${
                habits.suplementos
                  ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold'
                  : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-750 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-white/10 shadow-xs'
              }`}
            >
              <Pill className="w-5 h-5" />
              <div>
                <p className="text-xs font-bold">{t('habits.suplementos')}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{habits.suplementos ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>

          {/* Slider selectors for Humor and Energy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{t('habits.humor')}</span>
              <select
                id="habit-mood-select"
                value={habits.humor}
                onChange={(e) => onUpdate({ humor: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
              >
                <option value="excelente">😊 Excelente</option>
                <option value="bom">😄 Bom</option>
                <option value="regular">😐 Regular</option>
                <option value="cansado">😴 Cansado</option>
                <option value="estressado">😡 Estressado</option>
              </select>
            </div>

            <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl space-y-2 shadow-xs">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{t('habits.energy')} (1 - 5)</span>
              <input
                id="habit-energy-slider"
                type="range"
                min="1"
                max="5"
                step="1"
                value={habits.energia}
                onChange={(e) => onUpdate({ energia: Number(e.target.value) })}
                className="w-full h-1 bg-slate-250 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] opacity-60">
                <span>Esgotado</span>
                <span>Explosivo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Score Panel */}
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm flex flex-col justify-between text-center">
          <div className="space-y-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('habits.weeklyScore')}</h3>

            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center relative bg-white dark:bg-slate-950/40 shadow-xs">
                <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800" />
                <div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white block">{score}</span>
                  <span className="text-[9px] tracking-widest font-mono opacity-50 uppercase mt-0.5 block">SCORE</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className={`text-base font-black ${scoreColor}`}>{scoreFeedback}</p>
              <p className="text-xs opacity-60 font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                {t('habits.scoreDesc')}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-6 flex items-center justify-center gap-2 text-xs opacity-60">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Rotina validada pela IA Alpha</span>
          </div>
        </div>
      </div>
    </div>
  );
}
