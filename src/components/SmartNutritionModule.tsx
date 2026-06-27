import React, { useState, useEffect } from 'react';
import { UserProfile, LoggedMeal, WeeklyEvaluation, HabitLog, SmartQuestionnaire } from '../types';
import { useLanguageTheme } from './LanguageThemeContext';
import { HelpCircle, Sparkles, Flame, Apple, Compass, BookOpen, Pill, ShieldCheck, ChevronRight } from 'lucide-react';

// Sub-components imports
import SmartQuestionnaireForm from './SmartQuestionnaireForm';
import HormonalHealthHub from './HormonalHealthHub';
import FoodExplorer from './FoodExplorer';
import SupplementTracker from './SupplementTracker';
import MealPlanner from './MealPlanner';
import NutritionDashboard from './NutritionDashboard';

interface SmartNutritionModuleProps {
  user: UserProfile;
  loggedMeals: LoggedMeal[];
  todayHabits: HabitLog;
  evaluations: WeeklyEvaluation[];
  onUpdateProfile: (updatedFields: Partial<UserProfile>) => void;
}

export default function SmartNutritionModule({
  user,
  loggedMeals,
  todayHabits,
  evaluations,
  onUpdateProfile
}: SmartNutritionModuleProps) {
  const { language } = useLanguageTheme();
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [questionnaire, setQuestionnaire] = useState<SmartQuestionnaire | null>(null);

  // Load saved questionnaire on mount
  useEffect(() => {
    const cached = localStorage.getItem('alpha_smart_questionnaire');
    if (cached) {
      setQuestionnaire(JSON.parse(cached));
    }
  }, []);

  // Synchronize questionnaire with global user properties when they change
  useEffect(() => {
    if (questionnaire) {
      if (
        questionnaire.peso !== user.peso ||
        questionnaire.sexo !== user.sexo ||
        questionnaire.altura !== user.altura ||
        questionnaire.idade !== user.idade ||
        questionnaire.objetivo !== user.objetivo
      ) {
        const updated = {
          ...questionnaire,
          peso: user.peso || questionnaire.peso,
          sexo: user.sexo || questionnaire.sexo,
          altura: user.altura || questionnaire.altura,
          idade: user.idade || questionnaire.idade,
          objetivo: user.objetivo || questionnaire.objetivo
        };
        setQuestionnaire(updated);
        localStorage.setItem('alpha_smart_questionnaire', JSON.stringify(updated));
      }
    }
  }, [user.peso, user.sexo, user.altura, user.idade, user.objetivo, questionnaire]);

  const handleSaveQuestionnaire = (data: SmartQuestionnaire) => {
    setQuestionnaire(data);
    localStorage.setItem('alpha_smart_questionnaire', JSON.stringify(data));
    
    // Propagate objective back to global user profile to keep system in sync
    onUpdateProfile({ 
      peso: data.peso,
      altura: data.altura,
      idade: data.idade,
      sexo: data.sexo
    });

    // Automatically navigate to dashboard to show results
    setActiveSubTab('dashboard');
  };

  // If questionnaire is not filled yet, show an elegant onboarding call to action
  if (!questionnaire) {
    return (
      <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-4xl mx-auto py-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-3xl border border-blue-500/20 text-blue-500 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Ative Seu Perfil Nutricional Premium
            </h2>
            <p className="text-sm opacity-60 max-w-lg mx-auto leading-relaxed">
              Olá, <span className="font-bold text-slate-900 dark:text-white">{user.nome}</span>! Desbloqueie o módulo de nutrição esportiva inteligente baseado em evidências científicas respondendo ao nosso questionário de 20 perguntas.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6 max-w-2xl mx-auto">
          <h3 className="font-black text-sm uppercase tracking-wider text-slate-400">O que você ganha ao ativar:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-800 dark:text-slate-300">
            <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl flex items-center gap-3">
              <Compass className="w-5 h-5 text-blue-500" />
              <span>Cálculo Científico de Macros e Água</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>Dieta Customizada por Refeição</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl flex items-center gap-3">
              <Pill className="w-5 h-5 text-indigo-500" />
              <span>Controle de Suplementos e Alertas</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              <span>Saúde Hormonal & Alimentos Aliados</span>
            </div>
          </div>

          <button
            onClick={() => {
              // Prepopulate basic questionnaire fields from user profile to start
              const defaultQ: SmartQuestionnaire = {
                sexo: user.sexo || 'M',
                idade: user.idade || 25,
                peso: user.peso || 75,
                altura: user.altura || 175,
                gorduraPercentual: 14,
                circunferenciaAbdominal: 82,
                nivelAtividade: 'moderado',
                diasTreinoSemana: 4,
                horarioTreino: '18:00',
                objetivo: 'ganhar_massa',
                restricoesAlimentares: [],
                alergias: '',
                alimentosPreferidos: '',
                alimentosNaoGosta: '',
                orcamento: 'medio',
                horasSono: 8,
                consumoAlcool: 'socialmente',
                tabagismo: false,
                usoSuplementos: [],
                consumoAguaMl: 2500
              };
              setQuestionnaire(defaultQ);
              setActiveSubTab('questionnaire');
            }}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-150 text-white dark:text-slate-900 font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
          >
            <span>INICIAR ANAMNESE NUTRICIONAL</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      
      {/* Horizontal Sub-tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200/60 dark:border-white/5 overflow-x-auto pb-2 scrollbar-none max-w-full">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <Compass className="w-4 h-4" /> },
          { id: 'plan', label: 'Dieta & Receitas', icon: <Flame className="w-4 h-4" /> },
          { id: 'explore', label: 'Explorar Alimentos', icon: <Apple className="w-4 h-4" /> },
          { id: 'supplements', label: 'Suplementação', icon: <Pill className="w-4 h-4" /> },
          { id: 'hormones', label: 'Saúde Hormonal', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'questionnaire', label: 'Editar Anamnese', icon: <HelpCircle className="w-4 h-4" /> }
        ].map(subTab => {
          const isActive = activeSubTab === subTab.id;
          return (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 dark:bg-white/10 text-white dark:text-white border-slate-950 dark:border-white/15'
                  : 'bg-white dark:bg-[#0A0E1A]/10 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <span>{subTab.icon}</span>
              <span>{subTab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render sub-view */}
      <div className="space-y-6">
        {activeSubTab === 'dashboard' && (
          <NutritionDashboard
            user={user}
            loggedMeals={loggedMeals}
            todayHabits={todayHabits}
            evaluations={evaluations}
          />
        )}

        {activeSubTab === 'plan' && (
          <MealPlanner
            objetivo={questionnaire.objetivo}
            user={user}
          />
        )}

        {activeSubTab === 'explore' && (
          <FoodExplorer />
        )}

        {activeSubTab === 'supplements' && (
          <SupplementTracker />
        )}

        {activeSubTab === 'hormones' && (
          <HormonalHealthHub />
        )}

        {activeSubTab === 'questionnaire' && (
          <SmartQuestionnaireForm
            initialQuestionnaire={questionnaire}
            onSave={handleSaveQuestionnaire}
          />
        )}
      </div>

    </div>
  );
}
