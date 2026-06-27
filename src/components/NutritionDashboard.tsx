import React from 'react';
import { UserProfile, LoggedMeal, WeeklyEvaluation, HabitLog } from '../types';
import { calculateMacros } from '../utils/calculations';
import { Compass, Scale, Moon, Droplet, Flame, AlertCircle, ShieldAlert, Award, TrendingUp, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface NutritionDashboardProps {
  user: UserProfile;
  loggedMeals: LoggedMeal[];
  todayHabits: HabitLog;
  evaluations: WeeklyEvaluation[];
}

export default function NutritionDashboard({
  user,
  loggedMeals,
  todayHabits,
  evaluations
}: NutritionDashboardProps) {

  // Load questionnaire results if any
  const cachedQ = localStorage.getItem('alpha_smart_questionnaire');
  const questionnaire = cachedQ ? JSON.parse(cachedQ) : null;

  // Perform dynamic calculations
  const peso = questionnaire?.peso || user.peso || 75;
  const altura = questionnaire?.altura || user.altura || 175;
  const idade = questionnaire?.idade || user.idade || 25;
  const sexo = questionnaire?.sexo || user.sexo || 'M';
  const nivelAtividade = questionnaire?.nivelAtividade || 'moderado';
  const objetivo = questionnaire?.objetivo || 'ganhar_massa';

  const {
    imc,
    imcStatus,
    tmb,
    tdee,
    caloriasAlvo,
    proteinasG,
    carboidratosG,
    gordurasG,
    fibrasG,
    aguaIdealMl
  } = calculateMacros(peso, altura, idade, sexo, nivelAtividade, objetivo);

  // Sum today's logged foods
  const totalCal = loggedMeals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.calorias, 0), 0);
  const totalProt = loggedMeals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.proteinas, 0), 0);
  const totalCarb = loggedMeals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.carboidratos, 0), 0);
  const totalFat = loggedMeals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.gorduras, 0), 0);

  // Today logged habits
  const waterLogged = todayHabits.agua;
  const sleepLogged = todayHabits.sono;

  // Calculate habit score (0-100)
  let habitScore = 0;
  if (waterLogged >= aguaIdealMl) habitScore += 25;
  else if (waterLogged >= aguaIdealMl / 2) habitScore += 12;

  if (sleepLogged >= 8) habitScore += 25;
  else if (sleepLogged >= 6.5) habitScore += 15;

  if (totalProt >= proteinasG * 0.9) habitScore += 25;
  else if (totalProt >= proteinasG * 0.6) habitScore += 12;

  if (todayHabits.treino) habitScore += 15;
  if (todayHabits.suplementos) habitScore += 10;

  habitScore = Math.min(100, habitScore);

  // Smart Warnings alerts
  const alerts: string[] = [];
  if (totalProt < proteinasG * 0.8) {
    alerts.push(`Alerta de Proteína: Ingestão de proteína atual (${totalProt.toFixed(0)}g) está abaixo da sua meta ideal (${proteinasG}g). Adicione ovos ou Whey Protein para manter o saldo nitrogenado positivo.`);
  }
  if (waterLogged < aguaIdealMl) {
    alerts.push(`Alerta de Hidratação: Consumo de água baixo (${waterLogged}ml) em relação ao seu alvo de ${aguaIdealMl}ml. A desidratação prejudica a síntese proteica e reduz a força muscular.`);
  }
  if (sleepLogged < 7) {
    alerts.push(`Alerta de Sono: Registrado apenas ${sleepLogged}h de sono. Dormir menos de 7.5h eleva o cortisol (hormônio catabólico), reduzindo os ganhos de massa.`);
  }
  if (todayHabits.estresse >= 4) {
    alerts.push("Alerta de Estresse: Seus índices de estresse estão elevados. Isso afeta negativamente seu perfil androgênico e anabólico. Pratique respiração focada ou meditação.");
  }
  if (!todayHabits.treino && todayHabits.energia >= 4) {
    alerts.push("Alerta de Estímulo: Energia alta hoje, mas nenhum treino registrado. Aproveite para realizar seu estímulo de hipertrofia planejado.");
  }

  // Live Continuous AI Recommendations Engine
  const generateAIAdvice = (): string[] => {
    const advice: string[] = [];
    if (objetivo === 'ganhar_massa') {
      advice.push(`Seu superávit calórico de Bulking está configurado em ${caloriasAlvo} kcal. Mantenha os treinos de força intensos para direcionar esse excedente energético para a síntese de novas fibras musculares, em vez de gordura.`);
      advice.push(`Tome sua Creatina diariamente (${questionnaire?.usoSuplementos.includes('creatina') ? 'confirmado' : 'não cadastrado em uso'}) para saturar os estoques de fosfocreatina intracelular, expandindo a volumização hídrica muscular.`);
    } else if (objetivo === 'emagrecer') {
      advice.push(`Seu déficit de Cutting está calibrado para ${caloriasAlvo} kcal. Sua proteína alvo está elevada para ${proteinasG}g/dia especificamente para agir como escudo muscular anticatabólico enquanto seu corpo queima gorduras.`);
      advice.push("Priorize saladas de folhas escuras antes do almoço e do jantar para aumentar a distensão gástrica via fibras, estimulando a liberação do hormônio da saciedade GLP-1.");
    } else {
      advice.push(`Sua meta de recomposição corporal está definida em ${caloriasAlvo} kcal. Busque consistência diária nos macros para favorecer a oxidação lipídica concomitante à hipertrofia.`);
    }

    // Hormone specific tips
    if (questionnaire?.restricoesAlimentares.includes('Vegano') || questionnaire?.restricoesAlimentares.includes('Vegetariano')) {
      advice.push("Como vegetariano/vegano, certifique-se de associar leguminosas com cereais para obter o perfil completo de aminoácidos essenciais diários.");
    } else {
      advice.push("Consuma gemas de ovos cozidos moderadamente: o colesterol e as gorduras saudáveis são os precursores diretos da síntese molecular dos andrógenos.");
    }

    return advice;
  };

  const aiAdvice = generateAIAdvice();

  // Prepare chart data for weight evolution
  const weightData = evaluations.map((ev, i) => ({
    name: ev.data.substring(5), // MM-DD
    peso: ev.peso,
    massaMagra: ev.massaMagra
  }));

  // Prepare macros comparison chart data
  const macroChartData = [
    { name: 'Proteínas', Consumido: Math.round(totalProt), Meta: proteinasG },
    { name: 'Carbos', Consumido: Math.round(totalCarb), Meta: carboidratosG },
    { name: 'Gorduras', Consumido: Math.round(totalFat), Meta: gordurasG }
  ];

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm relative overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block">Peso Corporal</span>
          <span className="text-2xl font-black text-slate-950 dark:text-white mt-1.5 block">{peso} kg</span>
          <span className="text-[10px] bg-blue-500/10 text-blue-500 font-bold font-mono px-2 py-0.5 rounded-md mt-2 inline-block">IMC: {imc} ({imcStatus})</span>
        </div>

        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block">Calorias Diárias</span>
          <span className="text-2xl font-black text-slate-950 dark:text-white mt-1.5 block">{totalCal} / {caloriasAlvo}</span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-2 block">Restam {Math.max(0, caloriasAlvo - totalCal)} kcal para atingir meta</span>
        </div>

        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block">Hidratação Diária</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{waterLogged}</span>
            <span className="text-xs opacity-50">/ {aguaIdealMl} ml</span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-2 block">Ideal calculado por massa corporal</span>
        </div>

        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block">Qualidade de Sono</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-black text-indigo-500 dark:text-indigo-400">{sleepLogged}</span>
            <span className="text-xs opacity-50">/ 8 h</span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-2 block">{sleepLogged >= 7.5 ? 'Sono Regenerador' : 'Sono Deficitário'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts and Progress */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Macronutrients distribution bars */}
          <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Macros Consumidos vs Metas</h3>
              <span className="text-[11px] font-bold text-slate-500 font-mono">Meta Fibras: {fibrasG}g</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-blue-500">PROTEÍNA</span>
                  <span>{totalProt.toFixed(0)}g / {proteinasG}g</span>
                </div>
                <div className="w-full bg-slate-250 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all" style={{ width: `${Math.min(100, (totalProt / proteinasG) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-amber-500">CARBOIDRATO</span>
                  <span>{totalCarb.toFixed(0)}g / {carboidratosG}g</span>
                </div>
                <div className="w-full bg-slate-250 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all" style={{ width: `${Math.min(100, (totalCarb / carboidratosG) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-red-500">GORDURA</span>
                  <span>{totalFat.toFixed(0)}g / {gordurasG}g</span>
                </div>
                <div className="w-full bg-slate-250 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full transition-all" style={{ width: `${Math.min(100, (totalFat / gordurasG) * 100)}%` }}></div>
                </div>
              </div>
            </div>

            {/* Recharts Bar chart of consumed macros */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macroChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#090D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="Consumido" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  <Bar dataKey="Meta" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weight and lean mass progression charts */}
          {evaluations.length > 0 && (
            <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Evolução Corporal Científica (Peso vs Massa Magra)
              </h3>
              
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMagra" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} domain={['dataMin - 3', 'dataMax + 3']} />
                    <Tooltip 
                      contentStyle={{ background: '#090D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="peso" name="Peso Total (kg)" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPeso)" />
                    <Area type="monotone" dataKey="massaMagra" name="Massa Magra (kg)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMagra)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Coach Feed & Alerts */}
        <div className="space-y-6">
          
          {/* Daily Habit Score card */}
          <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm flex flex-col justify-between items-center text-center relative overflow-hidden">
            <span className="text-[10px] font-black tracking-widest text-slate-400 block uppercase">Habit Score Diário</span>
            
            <div className="w-28 h-28 rounded-full border-4 border-slate-100 dark:border-white/5 flex items-center justify-center relative my-4 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="absolute inset-1.5 rounded-full border border-dashed border-slate-200 dark:border-white/10" />
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white block">{habitScore}</span>
                <span className="text-[8px] tracking-widest font-mono text-slate-400 block mt-0.5">SCORE</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">{habitScore >= 80 ? 'EXCELENTE ANABOLISMO' : habitScore >= 50 ? 'BOM DESEMPENHO' : 'NECESSITA AJUSTES'}</p>
              <p className="text-[11px] opacity-60 mt-1 max-w-[210px] mx-auto">Mede sua adesão diária aos alvos de hidratação, sono, ingestão proteica e treinos.</p>
            </div>
          </div>

          {/* AI Coach Feed */}
          <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
              AI Coach Feed Científico
            </h3>

            <div className="space-y-3">
              {aiAdvice.map((advice, i) => (
                <div key={i} className="p-3 bg-blue-500/5 dark:bg-blue-400/5 border border-blue-500/10 dark:border-blue-400/10 rounded-xl text-[11px] leading-relaxed text-blue-850 dark:text-blue-300">
                  {advice}
                </div>
              ))}
            </div>
          </div>

          {/* Smart Alerts Warnings */}
          <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Notificações e Alertas Ativos
            </h3>

            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert, i) => (
                  <div key={i} className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] leading-relaxed text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{alert}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-white/5 rounded-xl">
                  <p className="text-[11px] opacity-50">Nenhum alerta ativo! Rotina 100% calibrada e anabólica.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
