import React, { useState } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { Dumbbell, Activity, Flame, Shield, TrendingUp, Calendar, HelpCircle, Check, Award, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStartAuth: (mode: 'login' | 'register') => void;
  onEnterSimulation: () => void;
}

export default function LandingPage({ onStartAuth, onEnterSimulation }: LandingPageProps) {
  const { t, language, theme } = useLanguageTheme();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const benefits = [
    {
      icon: <Dumbbell className="w-6 h-6 text-blue-500" />,
      title: t('lp.benefit.1.title'),
      desc: t('lp.benefit.1.desc')
    },
    {
      icon: <Flame className="w-6 h-6 text-green-500" />,
      title: t('lp.benefit.2.title'),
      desc: t('lp.benefit.2.desc')
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
      title: t('lp.benefit.3.title'),
      desc: t('lp.benefit.3.desc')
    },
    {
      icon: <Activity className="w-6 h-6 text-green-500" />,
      title: t('lp.benefit.4.title'),
      desc: t('lp.benefit.4.desc')
    }
  ];

  const faqs = [
    { q: t('lp.faq.1.q'), a: t('lp.faq.1.a') },
    { q: t('lp.faq.2.q'), a: t('lp.faq.2.a') },
    { q: t('lp.faq.3.q'), a: t('lp.faq.3.a') }
  ];

  return (
    <div id="landing-page" className="w-full text-slate-900 dark:text-slate-100 bg-[#F8FAFC] dark:bg-[#0A0E1A]">
      {/* Navigation */}
      <nav className="border-b border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-[#0A0E1A]/85 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
            <span className="font-extrabold text-white dark:text-slate-900 text-lg">A</span>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              {t('app.name')}
            </span>
            <p className="text-[9px] opacity-50 tracking-widest font-mono uppercase">PREMIUM FITNESS</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            id="nav-login-btn"
            onClick={() => onStartAuth('login')}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {language === 'pt' ? 'Entrar' : 'Sign In'}
          </button>
          <button
            id="nav-register-btn"
            onClick={() => onStartAuth('register')}
            className="px-5 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-all border border-blue-600 dark:border-transparent shadow-xs hover:-translate-y-0.5"
          >
            {language === 'pt' ? 'Criar Conta' : 'Sign Up'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-16 lg:py-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
        <div className="flex-1 text-left space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            {t('app.slogan')}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans leading-tight tracking-tight text-slate-900 dark:text-white">
            {t('lp.headline')}
          </h1>
          <p className="text-lg opacity-70 max-w-xl leading-relaxed text-slate-600 dark:text-slate-300">
            {t('lp.subheadline')}
          </p>

          <div className="pt-4 space-y-4">
            <button
              id="hero-cta-btn"
              onClick={() => onStartAuth('register')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-white text-white dark:text-slate-900 font-bold text-base rounded-2xl hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 border border-blue-600 dark:border-transparent shadow-md"
            >
              {t('app.subscribe')}
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 text-sm font-semibold">
              <span className="text-blue-600 dark:text-blue-400 text-lg font-extrabold">{t('lp.price')}</span>
              <span className="hidden sm:inline opacity-20">|</span>
              <span className="opacity-60">{t('lp.terms')}</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="flex-1 w-full relative z-10">
          <div className="relative mx-auto max-w-[500px] aspect-[4/3] rounded-3xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 p-4 shadow-xl dark:shadow-none backdrop-blur-md overflow-hidden">
            {/* Ambient gradients */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl transition-all duration-700"></div>

            {/* Inner premium visual decoration */}
            <div className="h-full w-full rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-6 flex flex-col justify-between border border-slate-200/80 dark:border-white/5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
                <div className="px-3 py-1 bg-slate-200/60 dark:bg-slate-800 rounded-full text-[9px] font-mono tracking-widest text-slate-600 dark:text-blue-400">
                  ALPHA_DASHBOARD_PREVIEW
                </div>
              </div>

              {/* Workout Preview Card */}
              <div className="bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4 my-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono tracking-wider">NEXT SESSION</span>
                  <span className="text-[9px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">ALPHA PERIODIZATION</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-blue-500" />
                  Push (Empurrar) - Peito e Ombro
                </h3>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div className="bg-slate-100 dark:bg-slate-800/40 p-2 rounded-lg text-center border border-slate-200/50 dark:border-transparent">
                    <p className="text-[9px] opacity-50 font-medium">SÉRIES</p>
                    <p className="font-bold text-slate-800 dark:text-white text-xs mt-0.5">4x por exerc.</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/40 p-2 rounded-lg text-center border border-slate-200/50 dark:border-transparent">
                    <p className="text-[9px] opacity-50 font-medium">REPETIÇÕES</p>
                    <p className="font-bold text-slate-800 dark:text-white text-xs mt-0.5">8-12 Reps</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/40 p-2 rounded-lg text-center border border-slate-200/50 dark:border-transparent">
                    <p className="text-[9px] opacity-50 font-medium">DESCANSO</p>
                    <p className="font-bold text-slate-800 dark:text-white text-xs mt-0.5">90s Ativo</p>
                  </div>
                </div>
              </div>

              {/* Caloric bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <span>METAS DE MACRONUTRIENTES DIÁRIOS</span>
                  <span className="text-blue-600 dark:text-blue-400">85% Concluído</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full w-[45%]" />
                  <div className="bg-emerald-500 h-full w-[35%]" />
                  <div className="bg-amber-500 h-full w-[10%]" />
                </div>
                <div className="flex gap-4 text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>Proteína</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>Carbos</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>Gorduras</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-20 px-6 border-y border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t('lp.benefits')}</h2>
            <p className="opacity-70 text-slate-600 dark:text-slate-300">{t('lp.benefits.sub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl text-left space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-200/50 dark:border-white/5">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
                <p className="text-xs opacity-70 leading-relaxed text-slate-600 dark:text-slate-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t('lp.how')}</h2>
          <p className="opacity-70 text-slate-600 dark:text-slate-300">
            {language === 'pt' 
              ? 'Uma jornada estruturada em ciência e disciplina, pensada para resultados consistentes.'
              : 'A structured journey based on science and discipline, designed for consistent results.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/20 rounded-2xl relative overflow-hidden">
              <span className="absolute -top-4 -right-4 text-7xl font-bold opacity-5 dark:opacity-[0.03] select-none font-sans">
                {step}
              </span>
              <h3 className="text-base font-bold mb-2 text-blue-600 dark:text-blue-400">{t(`lp.how.${step}`)}</h3>
              <p className="text-xs opacity-75 text-slate-600 dark:text-slate-400">{t(`lp.how.${step}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Features & Dashboard Preview */}
      <section className="py-20 px-6 border-y border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t('lp.premium.resources')}
            </h2>
            <p className="opacity-70 text-slate-600 dark:text-slate-300">
              {language === 'pt'
                ? 'Nossos assinantes têm acesso a um ecossistema completo de anabolismo e performance, incluindo calculadoras biológicas automatizadas, rotinas de sono e controle refinado de hipertrofia.'
                : 'Our subscribers have access to a complete anabolism and performance ecosystem, including automated biological calculators, sleep routines and refined hypertrophy control.'}
            </p>

            <div className="space-y-4">
              {[
                { title: 'TMB & TDEE Automáticos', desc: 'As equações Mifflin-St Jeor atualizam seus macros automaticamente conforme você altera seu peso.' },
                { title: 'Central de Conquistas e Níveis', desc: 'Ganhe XP ao registrar treinos, alimentar-se corretamente e manter a hidratação.' },
                { title: 'Monitoramento Físico de Medidas', desc: 'Insira braço, peitoral, abdômen e veja o gráfico de ganho de diâmetro muscular.' },
                { title: 'Suporte Multilíngue Premium', desc: 'Alternância imediata entre Português e Inglês para acompanhar seu progresso global.' }
              ].map((res, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{res.title}</h4>
                    <p className="text-xs opacity-70 mt-0.5 text-slate-600 dark:text-slate-400">{res.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="p-6 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm backdrop-blur-md relative">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                {t('lp.demo.title')}
              </h3>
              <p className="text-xs opacity-70 mb-6 text-slate-600 dark:text-slate-400">{t('lp.demo.desc')}</p>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="text-slate-600 dark:text-slate-300">CALORIAS RECOMENDADAS</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">3.250 Kcal</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="text-slate-600 dark:text-slate-300">PROTEÍNA RECOMENDADA</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">175g</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="text-slate-600 dark:text-slate-300">CARBOIDRATOS RECOMENDADOS</span>
                  <span className="font-bold text-amber-600 dark:text-amber-500">410g</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  id="demo-trial-btn"
                  onClick={onEnterSimulation}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-100 hover:opacity-90 text-white dark:text-slate-900 font-bold rounded-xl transition-all border border-blue-600 dark:border-transparent text-sm shadow-md hover:-translate-y-0.5"
                >
                  {language === 'pt' ? 'EXPERIMENTAR PREVIEW IMEDIATO' : 'TRY IMMEDIATE PREVIEW'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t('lp.comp.title')}</h2>
          <p className="opacity-70 text-slate-600 dark:text-slate-300">{t('lp.comp.desc')}</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 text-xs">
                <th className="p-4 font-bold text-slate-900 dark:text-white uppercase">RECURSO</th>
                <th className="p-4 font-bold text-red-500 uppercase">APLICATIVOS COMUNS</th>
                <th className="p-4 font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-slate-100/50 dark:bg-white/5">PROJETO ALPHA PREMIUM</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-slate-200 dark:border-white/5">
                <td className="p-4 font-semibold">Cálculo de macros de massa</td>
                <td className="p-4 opacity-60">Geralmente pago ou impreciso</td>
                <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400 bg-slate-100/20 dark:bg-white/[0.02]">Incluso (Mifflin-St Jeor automatizado)</td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-white/5">
                <td className="p-4 font-semibold">Biblioteca de Treinos Inteligentes</td>
                <td className="p-4 opacity-60">Focado somente em aeróbico genérico</td>
                <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400 bg-slate-100/20 dark:bg-white/[0.02]">Hipertrofia, ABCDE, PPL, etc.</td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-white/5">
                <td className="p-4 font-semibold">Medição de Variações de Medidas</td>
                <td className="p-4 opacity-60">Não possui acompanhamento visual</td>
                <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400 bg-slate-100/20 dark:bg-white/[0.02]">Histórico e gráficos detalhados</td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-white/5">
                <td className="p-4 font-semibold">Fidelidade e Contratos</td>
                <td className="p-4 opacity-60">Multas ou contratos anuais caros</td>
                <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400 bg-slate-100/20 dark:bg-white/[0.02]">Sem fidelidade, cancele quando quiser</td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-white/5">
                <td className="p-4 font-semibold">Valor Mensal</td>
                <td className="p-4 opacity-60">R$ 59,90 a R$ 120,00</td>
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 bg-slate-100/20 dark:bg-white/[0.02]">R$ 17,90 (O melhor custo-benefício)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/10">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-extrabold text-center tracking-tight text-slate-900 dark:text-white">{t('lp.faq.title')}</h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden bg-white dark:bg-slate-950/20 shadow-sm">
                <button
                  id={`faq-btn-${index}`}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-5 text-left font-bold text-sm flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                >
                  <span className="text-slate-900 dark:text-white">{faq.q}</span>
                  <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                </button>
                {activeFaq === index && (
                  <div className="p-5 border-t border-slate-200 dark:border-white/5 text-xs leading-relaxed opacity-80 bg-slate-50 dark:bg-slate-900/10 text-slate-700 dark:text-slate-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Stripe CTA Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t('lp.benefit.1.title')} e muito mais!</h2>
          <p className="text-sm opacity-70 max-w-lg mx-auto mt-3 text-slate-600 dark:text-slate-300">
            {language === 'pt'
              ? 'Tenha acesso completo a todos os recursos anabólicos e inicie sua revolução física hoje mesmo.'
              : 'Get full access to all anabolic resources and start your physical revolution today.'}
          </p>

          <div className="my-8">
            <span className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 block">{t('lp.price')}</span>
            <span className="text-[10px] opacity-50 tracking-widest uppercase font-mono mt-2 block">Recorrência Mensal Automatizada</span>
          </div>

          <button
            id="lp-bottom-cta-btn"
            onClick={() => onStartAuth('register')}
            className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all border border-blue-600 dark:border-transparent shadow-md"
          >
            {t('app.subscribe')}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs opacity-60 text-slate-500 dark:text-slate-400">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Processamento Seguro e Criptografado por Stripe</span>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/10 max-w-7xl mx-auto px-6 text-xs opacity-60 flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-500 dark:text-slate-400">
        <div>
          <p>© 2026 {t('app.name')}. Todos os direitos reservados.</p>
          <p className="text-[11px] mt-1.5 leading-relaxed max-w-2xl">Recomendações fitness baseadas em parâmetros esportivos e de nutrição de caráter informativo. Não substituem orientação de profissionais de saúde.</p>
        </div>
        <div className="flex gap-4 shrink-0 font-medium">
          <a href="#" className="hover:underline">Termos de Uso</a>
          <a href="#" className="hover:underline">Privacidade</a>
        </div>
      </footer>
    </div>
  );
}
