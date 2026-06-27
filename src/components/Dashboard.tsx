import React, { useState } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { UserProfile, HabitLog, LoggedMeal, Workout } from '../types';
import { calculateMacros } from '../utils/calculations';
import { Dumbbell, Flame, Droplet, Moon, Award, Sparkles, Plus, Check, ChevronRight, Activity, TrendingUp } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  loggedMeals: LoggedMeal[];
  todayHabits: HabitLog;
  currentWorkout: Workout;
  onNavigate: (tab: string) => void;
  onUpdateHabits: (habits: Partial<HabitLog>) => void;
}

export default function Dashboard({
  user,
  loggedMeals,
  todayHabits,
  currentWorkout,
  onNavigate,
  onUpdateHabits
}: DashboardProps) {
  const { t, language } = useLanguageTheme();

  // Calculate calories and macros logged today
  const totalCal = loggedMeals.reduce((acc, meal) => 
    acc + meal.itens.reduce((sum, item) => sum + item.calorias, 0), 0
  );
  const totalProt = loggedMeals.reduce((acc, meal) => 
    acc + meal.itens.reduce((sum, item) => sum + item.proteinas, 0), 0
  );

  // Resolve unified scientific calculations
  const mappedObjective = user.objetivo === 'hipertrofia' ? 'ganhar_massa' : user.objetivo === 'definicao' ? 'emagrecer' : 'recomposicao';
  const mappedLevel = user.nivel === 'avancado' ? 'intenso' : user.nivel === 'intermediario' ? 'moderado' : 'sedentario';
  
  const {
    caloriasAlvo: targetCal,
    proteinasG: targetProt,
    aguaIdealMl,
    imc,
    imcStatus: calcImcStatus
  } = calculateMacros(
    user.peso || 75,
    user.altura || 175,
    user.idade || 25,
    user.sexo || 'M',
    mappedLevel,
    mappedObjective
  );

  // Checklist of daily activities
  const dailyTasks = [
    { id: 't1', titlePt: `Beber ${(aguaIdealMl / 1000).toFixed(1)}L de Água`, titleEn: `Drink ${(aguaIdealMl / 1000).toFixed(1)}L of Water`, done: todayHabits.agua >= aguaIdealMl, action: () => onUpdateHabits({ agua: Math.min(aguaIdealMl + 1000, todayHabits.agua + 500) }) },
    { id: 't2', titlePt: 'Dormir 8 Horas', titleEn: 'Sleep 8 Hours', done: todayHabits.sono >= 8, action: () => onUpdateHabits({ sono: 8 }) },
    { id: 't3', titlePt: 'Concluir Treino', titleEn: 'Complete Workout', done: todayHabits.treino, action: () => onUpdateHabits({ treino: !todayHabits.treino }) },
    { id: 't4', titlePt: 'Tomar Suplementação', titleEn: 'Take Supplements', done: todayHabits.suplementos, action: () => onUpdateHabits({ suplementos: !todayHabits.suplementos }) },
    { id: 't5', titlePt: 'Exposição ao Sol', titleEn: 'Sun Exposure', done: todayHabits.sol, action: () => onUpdateHabits({ sol: !todayHabits.sol }) }
  ];

  // IMC (BMI) status and colors
  let imcStatus = calcImcStatus;
  let imcColor = '';
  if (imc < 18.5) {
    imcColor = 'text-yellow-500';
  } else if (imc < 24.9) {
    imcColor = 'text-green-500';
  } else {
    imcColor = 'text-red-500';
  }

  return (
    <div id="dashboard-tab" className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Top Welcome / Status row */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center font-bold text-xl text-white dark:text-slate-950 border border-slate-900 dark:border-white/10">
            {user.nome[0]}
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {language === 'pt' ? `Olá, ${user.nome}!` : `Hello, ${user.nome}!`}
            </h2>
            <p className="text-xs opacity-60 flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>{t('app.slogan')}</span>
            </p>
          </div>
        </div>

        {/* Level indicator / Streak */}
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-xs px-4 py-2.5 rounded-xl text-center min-w-[100px]">
            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">{t('db.streak')}</p>
            <p className="text-lg font-extrabold text-orange-500 flex items-center justify-center gap-1.5 mt-0.5">
              🔥 {user.diasAtivos}
            </p>
          </div>
          <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-xs px-4 py-2.5 rounded-xl text-center min-w-[100px]">
            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">NÍVEL ATLETA</p>
            <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
              LVL {user.nivelUsuario}
            </p>
          </div>
        </div>
      </header>

      {/* Quick Actions Panel */}
      <div className="bg-white dark:bg-[#0A0E1A]/20 p-5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none">
        <h3 className="text-[10px] font-bold tracking-wider uppercase opacity-60 mb-3">{t('db.quickActions')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="qa-workout"
            onClick={() => onNavigate('workouts')}
            className="p-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm border border-transparent cursor-pointer"
          >
            <Dumbbell className="w-4 h-4 text-white dark:text-slate-950" />
            <span className="text-xs">{t('db.action.startWorkout')}</span>
          </button>
          <button
            id="qa-diet"
            onClick={() => onNavigate('diet')}
            className="p-3 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-500/5 dark:border-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/10 font-bold rounded-xl flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5 shadow-xs cursor-pointer"
          >
            <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="text-xs">{t('db.action.logMeal')}</span>
          </button>
          <button
            id="qa-eval"
            onClick={() => onNavigate('evaluations')}
            className="p-3 bg-blue-50/60 hover:bg-blue-100/80 text-blue-700 border border-blue-200/60 dark:bg-blue-500/5 dark:border-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/10 font-bold rounded-xl flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5 shadow-xs cursor-pointer"
          >
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs">{t('db.action.logEval')}</span>
          </button>
          <button
            id="qa-evol"
            onClick={() => onNavigate('evolution')}
            className="p-3 bg-amber-50/60 hover:bg-amber-100/80 text-amber-700 border border-amber-200/60 dark:bg-amber-500/5 dark:border-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/10 font-bold rounded-xl flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5 shadow-xs cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs">{t('db.action.seeEvol')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Info stats cards & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info stats cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-5 rounded-2xl shadow-sm dark:shadow-none backdrop-blur-sm">
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-50 block">{t('db.weight')}</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{user.peso} kg</span>
              <p className="text-xs opacity-60 mt-2">
                {language === 'pt' ? `Altura: ${user.altura}cm` : `Height: ${user.altura}cm`}
              </p>
            </div>

            <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-5 rounded-2xl shadow-sm dark:shadow-none backdrop-blur-sm">
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-50 block">{t('db.target')}</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {user.objetivo === 'hipertrofia' ? (language === 'pt' ? 'Massa' : 'Mass') : (language === 'pt' ? 'Definir' : 'Define')}
              </span>
              <p className="text-xs opacity-60 mt-2">
                {language === 'pt' ? `Nível: ${user.nivel}` : `Level: ${user.nivel}`}
              </p>
            </div>

            <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-5 rounded-2xl shadow-sm dark:shadow-none backdrop-blur-sm">
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-50 block">{t('db.bmi')}</span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">{imc}</span>
              <p className={`text-xs font-semibold mt-2 ${imcColor}`}>{imcStatus}</p>
            </div>
          </div>

          {/* Caloric / Macronutrient progress summary */}
          <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                {t('db.weeklyProgress')}
              </h3>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {totalCal} / {targetCal} Kcal
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-400 dark:from-blue-500 dark:to-cyan-400 h-full transition-all duration-500 rounded-full" 
                style={{ width: `${Math.min(100, (totalCal / targetCal) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 shadow-xs">
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">PROTEÍNAS CONSUMIDAS</p>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{totalProt}g</span>
                  <span className="text-xs text-slate-400">/ {targetProt}g</span>
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 shadow-xs">
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">ÁGUA REGISTRADA</p>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-base font-bold text-sky-600 dark:text-sky-400">{todayHabits.agua} ml</span>
                  <span className="text-xs text-slate-400">/ {aguaIdealMl} ml</span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Workout Details */}
          <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full">
                  {currentWorkout.categoria}
                </span>
                <h3 className="text-lg font-bold mt-2 text-slate-900 dark:text-white">
                  {currentWorkout.titulo}
                </h3>
                <p className="text-xs opacity-70 mt-1 max-w-md">
                  {currentWorkout.descricao}
                </p>
              </div>
              <button
                id="dash-start-workout-btn"
                onClick={() => onNavigate('workouts')}
                className="p-3 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl transition-all shadow-sm border border-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] opacity-70 font-medium text-slate-500 dark:text-slate-400">
              <span>
                {language === 'pt' ? `Total: ${currentWorkout.exercicios.length} exercícios` : `Total: ${currentWorkout.exercicios.length} exercises`}
              </span>
              <span>
                ⏱ {currentWorkout.tempoEstimado} min
              </span>
            </div>
          </div>
        </div>

        {/* Checklist widget */}
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm h-full flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 text-sm">
              <Check className="w-4 h-4 text-emerald-500" />
              {t('db.checklist')}
            </h3>

            <div className="space-y-2">
              {dailyTasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={task.action}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    task.done 
                      ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-white/10 shadow-xs'
                  }`}
                >
                  <span className="text-xs font-semibold">
                    {language === 'pt' ? task.titlePt : task.titleEn}
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    task.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {task.done && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-6 text-center">
            <p className="text-[10px] opacity-50 font-medium text-slate-500 dark:text-slate-400">
              {language === 'pt' ? 'Mantenha os hábitos para ganhar XP!' : 'Maintain habits to earn XP!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
