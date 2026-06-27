import React, { useState } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { UserProfile, LoggedMeal, WeeklyEvaluation, HabitLog } from '../types';
import { Settings, Globe, ShieldAlert, Monitor, Bell, HelpCircle, Download, FileJson, FileSpreadsheet, Database, CheckCircle2 } from 'lucide-react';

interface SettingsSectionProps {
  user: UserProfile;
  onUpdateSettings: (lang: 'pt' | 'en', theme: 'light' | 'dark') => void;
  onOpenPortal?: () => void;
}

export default function SettingsSection({ user, onUpdateSettings, onOpenPortal }: SettingsSectionProps) {
  const { t, language, theme, setLanguage, setTheme } = useLanguageTheme();
  const [successMessage, setSuccessMessage] = useState<string>('');

  const showSuccessToast = () => {
    setSuccessMessage(t('settings.backup.successToast'));
    setTimeout(() => {
      setSuccessMessage('');
    }, 4500);
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (headers: string[], rows: (string | number | boolean)[][]) => {
    return [
      headers.join(','),
      ...rows.map(row => 
        row.map(value => {
          const valStr = value === null || value === undefined ? '' : String(value);
          if (valStr.includes(',') || valStr.includes('"') || valStr.includes('\n')) {
            return `"${valStr.replace(/"/g, '""')}"`;
          }
          return valStr;
        }).join(',')
      )
    ].join('\n');
  };

  const exportAllJSON = () => {
    try {
      const profile = localStorage.getItem('alpha_logged_user');
      const meals = localStorage.getItem('alpha_meals');
      const evaluations = localStorage.getItem('alpha_evaluations');
      const habits = localStorage.getItem('alpha_habits');
      const supplements = localStorage.getItem('alpha_supplements');
      const questionnaire = localStorage.getItem('alpha_smart_questionnaire');

      const backupData = {
        profile: profile ? JSON.parse(profile) : null,
        meals: meals ? JSON.parse(meals) : [],
        evaluations: evaluations ? JSON.parse(evaluations) : [],
        habits: habits ? JSON.parse(habits) : {},
        supplements: supplements ? JSON.parse(supplements) : [],
        questionnaire: questionnaire ? JSON.parse(questionnaire) : null,
        exportedAt: new Date().toISOString(),
        appName: 'Alpha Premium System',
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      downloadFile(jsonString, 'alpha_premium_full_backup.json', 'application/json');
      showSuccessToast();
    } catch (err) {
      console.error('JSON export error', err);
    }
  };

  const exportNutritionCSV = () => {
    try {
      const stored = localStorage.getItem('alpha_meals');
      if (!stored) {
        alert(t('settings.backup.emptyData'));
        return;
      }
      const meals: LoggedMeal[] = JSON.parse(stored);
      if (meals.length === 0) {
        alert(t('settings.backup.emptyData'));
        return;
      }

      const headers = [
        'Meal ID',
        'Meal Type',
        'Time',
        'Food Name',
        'Weight (g)',
        'Calories (kcal)',
        'Proteins (g)',
        'Carbohydrates (g)',
        'Fats (g)'
      ];

      const rows: (string | number)[][] = [];
      meals.forEach(meal => {
        if (meal.itens && meal.itens.length > 0) {
          meal.itens.forEach(item => {
            rows.push([
              meal.id,
              meal.tipo,
              meal.horario,
              item.nome,
              item.pesoGrams,
              item.calorias,
              item.proteinas,
              item.carboidratos,
              item.gorduras
            ]);
          });
        }
      });

      if (rows.length === 0) {
        alert(t('settings.backup.emptyData'));
        return;
      }

      const csv = convertToCSV(headers, rows);
      downloadFile(csv, 'alpha_nutrition_log.csv', 'text/csv;charset=utf-8;');
      showSuccessToast();
    } catch (err) {
      console.error('Nutrition CSV export error', err);
    }
  };

  const exportEvaluationsCSV = () => {
    try {
      const stored = localStorage.getItem('alpha_evaluations');
      if (!stored) {
        alert(t('settings.backup.emptyData'));
        return;
      }
      const evals: WeeklyEvaluation[] = JSON.parse(stored);
      if (evals.length === 0) {
        alert(t('settings.backup.emptyData'));
        return;
      }

      const headers = [
        'Date',
        'Weight (kg)',
        'Body Fat (%)',
        'Lean Mass (kg)',
        'Chest (cm)',
        'Waist (cm)',
        'Abdomen (cm)',
        'Hip (cm)',
        'Neck (cm)',
        'Right Arm (cm)',
        'Left Arm (cm)',
        'Right Thigh (cm)',
        'Left Thigh (cm)',
        'Right Calf (cm)',
        'Left Calf (cm)'
      ];

      const rows = evals.map(e => [
        e.data || '',
        e.peso || 0,
        e.gorduraPercentual || 0,
        e.massaMagra || 0,
        e.peito || 0,
        e.cintura || 0,
        e.abdomen || 0,
        e.quadril || 0,
        e.pescoco || 0,
        e.bracoDireito || 0,
        e.bracoEsquerdo || 0,
        e.coxaDireita || 0,
        e.coxaEsquerda || 0,
        e.panturrilhaDireita || 0,
        e.panturrilhaEsquerda || 0
      ]);

      const csv = convertToCSV(headers, rows);
      downloadFile(csv, 'alpha_physical_evaluations.csv', 'text/csv;charset=utf-8;');
      showSuccessToast();
    } catch (err) {
      console.error('Evaluations CSV export error', err);
    }
  };

  const exportHabitsCSV = () => {
    try {
      const stored = localStorage.getItem('alpha_habits');
      if (!stored) {
        alert(t('settings.backup.emptyData'));
        return;
      }
      const habits: HabitLog = JSON.parse(stored);

      const headers = [
        'Date',
        'Sleep (hours)',
        'Water Intake (ml)',
        'Mood',
        'Energy Level (1-5)',
        'Stress Level (1-5)',
        'Worked Out',
        'Sun Exposure',
        'Supplements Taken'
      ];

      const rows = [
        [
          habits.data || new Date().toISOString().split('T')[0],
          habits.sono || 0,
          habits.agua || 0,
          habits.humor || '',
          habits.energia || 0,
          habits.estresse || 0,
          habits.treino ? 'Yes' : 'No',
          habits.sol ? 'Yes' : 'No',
          habits.suplementos ? 'Yes' : 'No'
        ]
      ];

      const csv = convertToCSV(headers, rows);
      downloadFile(csv, 'alpha_habits_log.csv', 'text/csv;charset=utf-8;');
      showSuccessToast();
    } catch (err) {
      console.error('Habits CSV export error', err);
    }
  };

  const handleLanguageChange = (lang: 'pt' | 'en') => {
    setLanguage(lang);
    onUpdateSettings(lang, theme);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    onUpdateSettings(language, newTheme);
  };

  return (
    <div id="settings-tab" className="space-y-6 text-slate-900 dark:text-slate-100">
      <header className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 md:w-8 md:h-8 text-blue-500 animate-spin-slow" />
          {t('settings.title')}
        </h2>
        <p className="text-sm opacity-60 font-medium text-slate-500 dark:text-slate-400">{t('settings.langApp')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Lang & Theme options */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('settings.langApp')}</h3>

          {/* Language Selector */}
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl">
            <label className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              {t('settings.selectLang')}
            </label>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                id="lang-pt-btn"
                onClick={() => handleLanguageChange('pt')}
                className={`p-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  language === 'pt'
                    ? 'bg-blue-500/5 dark:bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-200/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                🇧🇷 Português (Brasil)
              </button>
              <button
                id="lang-en-btn"
                onClick={() => handleLanguageChange('en')}
                className={`p-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-blue-500/5 dark:bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-200/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl">
            <label className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-green-500" />
              {t('settings.selectTheme')}
            </label>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                id="theme-dark-btn"
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-blue-500/5 dark:bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-200/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                {t('settings.theme.dark')}
              </button>
              <button
                id="theme-light-btn"
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-blue-500/5 dark:bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-200/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                {t('settings.theme.light')}
              </button>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm h-full flex flex-col justify-between text-center">
          <div className="space-y-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 justify-center">
              <Bell className="w-5 h-5 text-yellow-500" />
              Notificações de Atividades
            </h3>
            <p className="text-xs opacity-60 font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Deseja receber lembretes de consumo de água, agendamento de treinos e avisos de avaliação física semanal? Ative em seu dispositivo móvel.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-6 flex items-center justify-center gap-2 text-xs opacity-60">
            <ShieldAlert className="w-4 h-4 text-green-500" />
            <span>Configurações verificadas de alta segurança</span>
          </div>
        </div>
      </div>

      {/* Stripe Subscription Management Section */}
      {user.email !== 'demo@projetoalpha.com' && (
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
            <div className="space-y-1 text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500 animate-spin-slow" />
                {language === 'pt' ? 'Gerenciamento de Assinatura' : 'Subscription Management'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                {language === 'pt'
                  ? 'Gerencie seus métodos de pagamento, faturas e status de cobrança do Stripe diretamente pelo portal oficial seguro.'
                  : 'Manage your payment methods, invoices, and Stripe billing status directly via the official secure portal.'}
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider self-start md:self-center">
              {language === 'pt' ? 'Stripe Ativo' : 'Stripe Active'}
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/40 dark:from-white/5 dark:to-white/5 rounded-2xl border border-blue-100/80 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <p className="text-xs font-bold text-blue-950 dark:text-white">
                {language === 'pt' ? 'Assinatura Ativa (R$ 17,90/mês)' : 'Active Subscription ($17.90/mo)'}
              </p>
              <p className="text-[11px] text-indigo-950/70 dark:text-slate-400">
                {language === 'pt'
                  ? `Vinculado ao e-mail: ${user.email}. As faturas automáticas são emitidas mensalmente.`
                  : `Linked to email: ${user.email}. Automatic invoices are issued monthly.`}
              </p>
            </div>

            <button
              id="btn-stripe-portal"
              onClick={onOpenPortal}
              className="py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-none flex items-center gap-1.5"
            >
              <span>{language === 'pt' ? 'Abrir Portal de Cliente Stripe' : 'Open Stripe Customer Portal'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Offline Backup & Data Export Section */}
      <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-500" />
              {t('settings.backup.title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {t('settings.backup.desc')}
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-indigo-500/10 dark:bg-indigo-500/5 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider self-start md:self-center">
            {language === 'pt' ? 'Totalmente Local' : '100% Offline'}
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* JSON Full Backup */}
          <button
            id="btn-export-json"
            onClick={exportAllJSON}
            className="group flex flex-col items-start text-left p-5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 hover:from-indigo-500/10 hover:to-purple-500/10 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-500/20 dark:border-indigo-500/30 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <FileJson className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-white mb-1">
              JSON Backup
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
              {t('settings.backup.btnJson')}
            </span>
            <span className="mt-auto text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:underline">
              <Download className="w-3 h-3" />
              Download .json
            </span>
          </button>

          {/* CSV Nutrition Log */}
          <button
            id="btn-export-nutrition-csv"
            onClick={exportNutritionCSV}
            className="group flex flex-col items-start text-left p-5 bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-white mb-1">
              {language === 'pt' ? 'Log de Nutrição' : 'Nutrition Log'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
              {t('settings.backup.btnNutritionCsv')}
            </span>
            <span className="mt-auto text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:underline">
              <Download className="w-3 h-3" />
              Download .csv
            </span>
          </button>

          {/* CSV Habits & Workouts Log */}
          <button
            id="btn-export-habits-csv"
            onClick={exportHabitsCSV}
            className="group flex flex-col items-start text-left p-5 bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-500/5 dark:hover:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500 mb-4 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-white mb-1">
              {language === 'pt' ? 'Log de Hábitos' : 'Habits Log'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
              {t('settings.backup.btnHabitsCsv')}
            </span>
            <span className="mt-auto text-[10px] font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1 group-hover:underline">
              <Download className="w-3 h-3" />
              Download .csv
            </span>
          </button>

          {/* CSV Physical Evaluations */}
          <button
            id="btn-export-evaluations-csv"
            onClick={exportEvaluationsCSV}
            className="group flex flex-col items-start text-left p-5 bg-purple-500/5 hover:bg-purple-500/10 dark:bg-purple-500/5 dark:hover:bg-purple-500/10 border border-purple-500/20 dark:border-purple-500/30 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-white mb-1">
              {language === 'pt' ? 'Avaliações Físicas' : 'Physical Evaluations'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
              {t('settings.backup.btnEvalsCsv')}
            </span>
            <span className="mt-auto text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:underline">
              <Download className="w-3 h-3" />
              Download .csv
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
