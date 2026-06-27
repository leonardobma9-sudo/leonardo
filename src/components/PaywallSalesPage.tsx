import React, { useState } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { Shield, Lock, Check, Sparkles, Loader2, LogOut, Award, Flame, Dumbbell, Activity, RefreshCw } from 'lucide-react';

interface PaywallSalesPageProps {
  email: string;
  onLogout: () => void;
  onSubscribe: () => void;
  isRedirecting: boolean;
}

export default function PaywallSalesPage({ email, onLogout, onSubscribe, isRedirecting }: PaywallSalesPageProps) {
  const { t, language } = useLanguageTheme();
  
  const benefits = [
    {
      title: 'Treinos de Alta Performance',
      titleEn: 'High Performance Workouts',
      desc: 'Periodização completa focada em hipertrofia e ganho de massa muscular (ABCDE, PPL, etc).',
      descEn: 'Complete periodization focused on hypertrophy and muscle mass gain.',
      icon: <Dumbbell className="w-5 h-5 text-blue-500" />
    },
    {
      title: 'Calculadoras Biológicas e Macros',
      titleEn: 'Biological & Macro Calculators',
      desc: 'Equações Mifflin-St Jeor integradas calculando TMB e macros em tempo real.',
      descEn: 'Mifflin-St Jeor equations calculating BMR and macros in real-time.',
      icon: <Activity className="w-5 h-5 text-emerald-500" />
    },
    {
      title: 'Evolução Física com Gráficos',
      titleEn: 'Physical Evolution with Charts',
      desc: 'Acompanhe braços, peitoral, abdômen e veja seu ganho de diâmetro muscular.',
      descEn: 'Track arms, chest, abdomen and see your muscle diameter gains.',
      icon: <Flame className="w-5 h-5 text-amber-500" />
    },
    {
      title: 'Saúde Hormonal e Suplementação',
      titleEn: 'Hormonal Health & Supplements',
      desc: 'Diretrizes inteligentes de hidratação, sono, suplementação e testosterona.',
      descEn: 'Smart hydration, sleep, supplementation, and testosterone guidelines.',
      icon: <Sparkles className="w-5 h-5 text-indigo-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in">
      <div className="max-w-4xl w-full bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative">
        
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-600/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Left column: Visual Pitch */}
        <div className="lg:w-[45%] bg-slate-50 dark:bg-[#0A0E1A]/60 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5 flex flex-col justify-between text-left">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="font-extrabold text-white dark:text-slate-900 text-sm">A</span>
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">Projeto Alpha</h2>
                <p className="text-[9px] tracking-wider uppercase opacity-55 font-mono">PREMIUM FITNESS</p>
              </div>
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400">
                  {language === 'pt' ? 'Assinatura Necessária' : 'Subscription Required'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === 'pt' 
                    ? `Sua conta (${email}) não possui uma assinatura ativa do Projeto Alpha Premium no Stripe.` 
                    : `Your account (${email}) does not have an active subscription to Projeto Alpha Premium on Stripe.`}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">BENEFÍCIOS PREMIUM</span>
              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-3 items-start text-xs">
                    <div className="p-1.5 bg-slate-200/50 dark:bg-white/5 rounded-lg shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{language === 'pt' ? b.title : b.titleEn}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{language === 'pt' ? b.desc : b.descEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-between mt-6 lg:mt-0">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{email}</span>
            <button
              onClick={onLogout}
              className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              {language === 'pt' ? 'Sair da Conta' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Right column: Action Plan / Price Checkout */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center text-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              REVOLUÇÃO ANABÓLICA
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {language === 'pt' ? 'Desbloqueie o Acesso Premium' : 'Unlock Premium Access'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'pt' 
                  ? 'Escolha o melhor plano e comece sua evolução física agora mesmo. Sem fidelidade, cancele quando quiser no painel.' 
                  : 'Choose the best plan and start your physical evolution right now. No contracts, cancel anytime.'}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 dark:from-white/5 dark:to-white/5 border border-blue-100/80 dark:border-white/5 rounded-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-12 h-12 bg-blue-500/10 rounded-full blur-lg"></div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono">PLANO MENSAL</span>
              <div className="my-3 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-blue-950 dark:text-white">R$ 17,90</span>
                <span className="text-sm text-indigo-950/50 dark:text-slate-400 font-medium">/ mês</span>
              </div>
              <ul className="text-[11px] text-indigo-950/80 dark:text-slate-400 space-y-1.5 mt-4 text-left max-w-xs mx-auto font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Cobrança recorrente automatizada</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Zero taxas escondidas ou multas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Suporte e painel do cliente Stripe</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onSubscribe}
              disabled={isRedirecting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg disabled:bg-blue-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-700"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redirecionando para o Stripe Checkout...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'pt' ? 'Assinar Agora' : 'Subscribe Now'}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Garantia de segurança Stripe SSL de 256 bits</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
