import React, { useState } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { Dumbbell, Activity, ShieldCheck, Flame, Scale, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { t, language } = useLanguageTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Dumbbell className="w-16 h-16 text-blue-500" />,
      titleKey: 'on.step1.title',
      descKey: 'on.step1.desc',
      badge: 'STRENGTH & MUSCLE'
    },
    {
      icon: <Flame className="w-16 h-16 text-green-500 animate-pulse" />,
      titleKey: 'on.step2.title',
      descKey: 'on.step2.desc',
      badge: 'MACRONUTRIENTS & CALORIES'
    },
    {
      icon: <Scale className="w-16 h-16 text-blue-400" />,
      titleKey: 'on.step3.title',
      descKey: 'on.step3.desc',
      badge: 'MEASUREMENTS & EVOLUTION'
    },
    {
      icon: <Activity className="w-16 h-16 text-green-400" />,
      titleKey: 'on.step4.title',
      descKey: 'on.step4.desc',
      badge: 'HABITS & MINDSET'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];

  return (
    <div id="onboarding-panel" className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-200/10 rounded-3xl shadow-xl dark:shadow-2xl backdrop-blur-md text-center flex flex-col justify-between min-h-[480px]">
      <div className="space-y-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-650 dark:text-blue-450 rounded-full text-[10px] font-mono tracking-widest font-extrabold uppercase">
          {step.badge}
        </span>

        {/* Central Icon */}
        <div className="flex justify-center py-6">
          <div className="w-28 h-28 bg-slate-50 dark:bg-slate-800/40 rounded-3xl flex items-center justify-center border border-slate-200/50 dark:border-slate-200/5 shadow-inner">
            {step.icon}
          </div>
        </div>

        {/* Title & Desc */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t(step.titleKey)}
          </h2>
          <p className="text-sm md:text-base opacity-70 font-medium text-slate-600 dark:text-slate-350 max-w-md mx-auto leading-relaxed">
            {t(step.descKey)}
          </p>
        </div>
      </div>

      <div className="pt-8">
        <button
          id="onboarding-next-btn"
          onClick={handleNext}
          className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-blue-600 to-green-600 text-white font-extrabold text-base rounded-2xl shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all animate-pulse"
        >
          {currentStep === steps.length - 1 ? t('app.cta') : (language === 'pt' ? 'PROSSEGUIR' : 'CONTINUE')}
        </button>

        {currentStep < steps.length - 1 && (
          <button
            id="onboarding-skip-btn"
            onClick={onComplete}
            className="block mx-auto mt-4 text-xs opacity-60 hover:opacity-100 text-slate-500 dark:text-slate-400 underline cursor-pointer"
          >
            {language === 'pt' ? 'Pular Onboarding' : 'Skip Onboarding'}
          </button>
        )}
      </div>
    </div>
  );
}
