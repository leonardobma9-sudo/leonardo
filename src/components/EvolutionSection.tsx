import React, { useState } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { WeeklyEvaluation } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Activity, BarChart2, Award } from 'lucide-react';

interface EvolutionSectionProps {
  evaluations: WeeklyEvaluation[];
}

export default function EvolutionSection({ evaluations }: EvolutionSectionProps) {
  const { t, language } = useLanguageTheme();
  const [activeSubTab, setActiveSubTab] = useState<'weight' | 'bodyfat' | 'medidas'>('weight');

  // Map database evaluations to Recharts data model
  const chartData = evaluations.map((ev, index) => ({
    name: language === 'pt' ? `Semana ${index + 1}` : `Week ${index + 1}`,
    peso: ev.peso,
    bf: ev.gorduraPercentual,
    massaMagra: ev.massaMagra,
    braco: (ev.bracoDireito + ev.bracoEsquerdo) / 2,
    coxa: (ev.coxaDireita + ev.coxaEsquerda) / 2,
    peito: ev.peito,
    cintura: ev.cintura,
    abdomen: ev.abdomen
  }));

  // Compare first vs last evaluation
  const firstEval = evaluations[0];
  const lastEval = evaluations[evaluations.length - 1];

  const weightDiff = lastEval && firstEval ? lastEval.peso - firstEval.peso : 0;
  const bfDiff = lastEval && firstEval ? lastEval.gorduraPercentual - firstEval.gorduraPercentual : 0;
  const leanDiff = lastEval && firstEval ? lastEval.massaMagra - firstEval.massaMagra : 0;

  return (
    <div id="evolution-tab" className="space-y-6 text-slate-900 dark:text-slate-100">
      <header className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-slate-900 dark:text-white" />
          {t('evol.title')}
        </h2>
        <p className="text-sm opacity-60 font-medium text-slate-500 dark:text-slate-400">{t('evol.desc')}</p>
      </header>

      {/* Comparisons Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 rounded-2xl md:rounded-3xl shadow-xs dark:shadow-none backdrop-blur-sm">
          <span className="text-[10px] font-bold uppercase opacity-50 tracking-wider block">Ganho Líquido de Peso</span>
          <span className={`text-2xl font-extrabold mt-1 block ${weightDiff >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
            {weightDiff >= 0 ? `+${weightDiff.toFixed(1)}` : weightDiff.toFixed(1)} kg
          </span>
          <p className="text-[11px] opacity-60 mt-1">Comparando início vs atual</p>
        </div>

        <div className="p-5 bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 rounded-2xl md:rounded-3xl shadow-xs dark:shadow-none backdrop-blur-sm">
          <span className="text-[10px] font-bold uppercase opacity-50 tracking-wider block">Variação de Gordura Corporal</span>
          <span className={`text-2xl font-extrabold mt-1 block ${bfDiff <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
            {bfDiff >= 0 ? `+${bfDiff.toFixed(1)}%` : `${bfDiff.toFixed(1)}%`}
          </span>
          <p className="text-[11px] opacity-60 mt-1">Comparando início vs atual</p>
        </div>

        <div className="p-5 bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 rounded-2xl md:rounded-3xl shadow-xs dark:shadow-none backdrop-blur-sm">
          <span className="text-[10px] font-bold uppercase opacity-50 tracking-wider block">Aumento de Massa Magra</span>
          <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">
            {leanDiff >= 0 ? `+${leanDiff.toFixed(1)}` : leanDiff.toFixed(1)} kg
          </span>
          <p className="text-[11px] opacity-60 mt-1">Ganhos musculares puros</p>
        </div>
      </div>

      {/* Chart Selector Buttons */}
      <div className="flex gap-1.5 p-1 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl self-start max-w-md shadow-xs">
        <button
          id="btn-subtab-weight"
          onClick={() => setActiveSubTab('weight')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeSubTab === 'weight'
              ? 'bg-blue-600 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-white/5'
          }`}
        >
          {language === 'pt' ? 'Peso e IMC' : 'Weight & BMI'}
        </button>
        <button
          id="btn-subtab-bodyfat"
          onClick={() => setActiveSubTab('bodyfat')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeSubTab === 'bodyfat'
              ? 'bg-blue-600 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-white/5'
          }`}
        >
          {language === 'pt' ? 'Massa Magra & BF%' : 'Lean Mass & BF%'}
        </button>
        <button
          id="btn-subtab-medidas"
          onClick={() => setActiveSubTab('medidas')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeSubTab === 'medidas'
              ? 'bg-blue-600 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-white/5'
          }`}
        >
          {language === 'pt' ? 'Circunferências' : 'Measurements'}
        </button>
      </div>

      {/* Render Active Chart Container */}
      <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm h-[400px] flex flex-col justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 uppercase tracking-wider flex items-center gap-2 opacity-80">
          <BarChart2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          {activeSubTab === 'weight' ? t('evol.weightChange') : activeSubTab === 'bodyfat' ? 'Gráfico de Composição Corporal' : t('evol.medidas')}
        </h3>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {activeSubTab === 'weight' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="peso" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} name="Peso (kg)" />
              </LineChart>
            ) : activeSubTab === 'bodyfat' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="massaMagra" stroke="#2563eb" strokeWidth={3} name="Massa Magra (kg)" />
                <Line type="monotone" dataKey="bf" stroke="#dc2626" strokeWidth={2} name="Gordura (%)" />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="braco" fill="#2563eb" name="Braço Médio (cm)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="peito" fill="#10b981" name="Peito (cm)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="coxa" fill="#f59e0b" name="Coxa Média (cm)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="abdomen" fill="#ef4444" name="Abdômen (cm)" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
