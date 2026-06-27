import React from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { Badge, UserProfile } from '../types';
import { Award, Zap, Calendar, Trophy, Check } from 'lucide-react';

interface ConquestsSectionProps {
  user: UserProfile;
}

export default function ConquestsSection({ user }: ConquestsSectionProps) {
  const { t, language } = useLanguageTheme();

  // Pre-defined premium badges
  const badges: Badge[] = [
    {
      id: 'b1',
      tituloPt: 'Primeiro Passo',
      tituloEn: 'First Step',
      descricaoPt: 'Registrou seu primeiro treino anabólico.',
      descricaoEn: 'Logged your first anabolic workout.',
      icone: '🚀',
      conquistada: true,
      dataConquista: '2026-06-20',
      progresso: 100
    },
    {
      id: 'b2',
      tituloPt: 'Super Hidratado',
      tituloEn: 'Super Hydrated',
      descricaoPt: 'Alcançou a meta de 3L de água por 5 dias consecutivos.',
      descricaoEn: 'Reached the 3L water goal for 5 consecutive days.',
      icone: '💧',
      conquistada: true,
      dataConquista: '2026-06-24',
      progresso: 100
    },
    {
      id: 'b3',
      tituloPt: 'Monstro do Ganho',
      tituloEn: 'Gain Monster',
      descricaoPt: 'Ganhou 2kg de Massa Magra em suas avaliações físicas.',
      descricaoEn: 'Gained 2kg of Lean Mass in your physical evaluations.',
      icone: '💪',
      conquistada: false,
      progresso: 60
    },
    {
      id: 'b4',
      tituloPt: 'Mestre da Rotina',
      tituloEn: 'Routine Master',
      descricaoPt: 'Concluiu todos os hábitos saudáveis em um único dia.',
      descricaoEn: 'Completed all healthy habits in a single day.',
      icone: '🧠',
      conquistada: true,
      dataConquista: '2026-06-25',
      progresso: 100
    },
    {
      id: 'b5',
      tituloPt: 'Guerreiro do Sono',
      tituloEn: 'Sleep Warrior',
      descricaoPt: 'Manteve 8h de sono anabólico por uma semana inteira.',
      descricaoEn: 'Maintained 8h of anabolic sleep for an entire week.',
      icone: '🌙',
      conquistada: false,
      progresso: 40
    }
  ];

  // Calendar of workouts
  // Mocking 30 days grid with some workouts marked completed
  const currentMonthDays = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    workoutDone: [2, 4, 5, 8, 9, 11, 12, 14, 15, 18, 19, 21, 22, 25, 26].includes(i + 1)
  }));

  return (
    <div id="conquests-tab" className="space-y-6 text-slate-900 dark:text-slate-100">
      <header className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 animate-bounce" />
          {t('conq.title')}
        </h2>
        <p className="text-sm opacity-60 font-medium text-slate-500 dark:text-slate-400">
          {language === 'pt'
            ? 'Monitore seu engajamento, conquiste distintivos exclusivos e suba de nível no estilo Alpha.'
            : 'Track your commitment, unlock exclusive badges and level up in Alpha style.'}
        </p>
      </header>

      {/* Level and XP Section */}
      <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-yellow-500/10 border border-white/10 shrink-0">
            {user.nivelUsuario}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('conq.level')}</h3>
            <p className="text-xs opacity-60 font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {t('conq.nextLevel').replace('{xp}', (300 - user.xp).toString())}
            </p>
          </div>
        </div>

        {/* Progress Bar of XP */}
        <div className="w-full md:max-w-md space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{user.xp} XP / 300 XP</span>
            <span className="text-yellow-600 dark:text-yellow-500 font-bold">PRODUTIVO</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-full transition-all duration-500" style={{ width: `${(user.xp / 300) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Badges / Medals list */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('conq.badges')}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                  b.conquistada
                    ? 'bg-yellow-500/5 border-yellow-500/20 text-yellow-650 dark:text-yellow-450'
                    : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-450 shadow-xs'
                }`}
              >
                <div className="text-4xl p-2 bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-white/5 shrink-0 select-none shadow-xs">
                  {b.icone}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {language === 'pt' ? b.tituloPt : b.tituloEn}
                  </h4>
                  <p className="text-xs opacity-60 font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {language === 'pt' ? b.descricaoPt : b.descricaoEn}
                  </p>
                  {b.conquistada ? (
                    <span className="inline-block text-[9px] font-mono uppercase bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-2 py-0.5 rounded font-extrabold">
                      ✓ Desbloqueada
                    </span>
                  ) : (
                    <div className="w-full max-w-[150px] bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-blue-500 h-full" style={{ width: `${b.progresso}%` }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Calendar Widget */}
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Calendário de Treinos
            </h3>
            <p className="text-xs opacity-60 font-medium text-slate-500 dark:text-slate-400 mb-6">Frequência e consistência mensal de suas sessões físicas.</p>

            {/* Grid of days */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-700 dark:text-slate-300">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, index) => (
                <span key={index} className="opacity-50 font-bold py-1">{d}</span>
              ))}

              {currentMonthDays.map((dayObj) => (
                <div
                  key={dayObj.day}
                  className={`aspect-square flex items-center justify-center rounded-lg border text-[10px] font-bold ${
                    dayObj.workoutDone
                      ? 'bg-green-500/10 dark:bg-green-500/15 border-green-500/35 dark:border-green-500 text-green-600 dark:text-green-400 font-extrabold'
                      : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 shadow-xs'
                  }`}
                >
                  {dayObj.day}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-6 flex justify-between text-xs opacity-75 font-semibold text-slate-700 dark:text-slate-300">
            <span>Frequência Mensal:</span>
            <span className="font-bold text-green-600 dark:text-green-400">50% das Metas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
