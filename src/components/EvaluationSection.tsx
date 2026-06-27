import React, { useState } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { WeeklyEvaluation, UserProfile } from '../types';
import { Scale, Ruler, Camera, Plus, Check, Award } from 'lucide-react';

interface EvaluationSectionProps {
  evaluations: WeeklyEvaluation[];
  onAddEvaluation: (evaluation: WeeklyEvaluation) => void;
  user: UserProfile;
}

export default function EvaluationSection({ evaluations, onAddEvaluation, user }: EvaluationSectionProps) {
  const { t, language } = useLanguageTheme();

  // Inputs
  const [peso, setPeso] = useState<number>(user.peso || 78);
  const [bracoDireito, setBracoDireito] = useState<number>(user.sexo === 'F' ? 28 : 36);
  const [bracoEsquerdo, setBracoEsquerdo] = useState<number>(user.sexo === 'F' ? 28 : 36);
  const [peito, setPeito] = useState<number>(user.sexo === 'F' ? 90 : 102);
  const [cintura, setCintura] = useState<number>(user.sexo === 'F' ? 70 : 82);
  const [abdomen, setAbdomen] = useState<number>(user.sexo === 'F' ? 72 : 84);
  const [quadril, setQuadril] = useState<number>(user.sexo === 'F' ? 98 : 96);
  const [coxaDireita, setCoxaDireita] = useState<number>(user.sexo === 'F' ? 54 : 56);
  const [coxaEsquerda, setCoxaEsquerda] = useState<number>(user.sexo === 'F' ? 54 : 56);
  const [panturrilhaD, setPanturrilhaD] = useState<number>(user.sexo === 'F' ? 34 : 37);
  const [panturrilhaE, setPanturrilhaE] = useState<number>(user.sexo === 'F' ? 34 : 37);
  const [pescoco, setPescoco] = useState<number>(user.sexo === 'F' ? 33 : 38);
  const [gorduraPercentual, setGorduraPercentual] = useState<number>(user.sexo === 'F' ? 22 : 14);

  // Synchronize inputs with user prop on update
  React.useEffect(() => {
    setPeso(user.peso || 78);
    setBracoDireito(user.sexo === 'F' ? 28 : 36);
    setBracoEsquerdo(user.sexo === 'F' ? 28 : 36);
    setPeito(user.sexo === 'F' ? 90 : 102);
    setCintura(user.sexo === 'F' ? 70 : 82);
    setAbdomen(user.sexo === 'F' ? 72 : 84);
    setQuadril(user.sexo === 'F' ? 98 : 96);
    setCoxaDireita(user.sexo === 'F' ? 54 : 56);
    setCoxaEsquerda(user.sexo === 'F' ? 54 : 56);
    setPanturrilhaD(user.sexo === 'F' ? 34 : 37);
    setPanturrilhaE(user.sexo === 'F' ? 34 : 37);
    setPescoco(user.sexo === 'F' ? 33 : 38);
    setGorduraPercentual(user.sexo === 'F' ? 22 : 14);
  }, [user]);

  // Photos (Mocks)
  const [fotoFrente, setFotoFrente] = useState<string>('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&auto=format&fit=crop&q=60');
  const [fotoCostas, setFotoCostas] = useState<string>('https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&auto=format&fit=crop&q=60');
  const [fotoLateral, setFotoLateral] = useState<string>('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=60');

  const [success, setSuccess] = useState(false);

  const rcq = parseFloat((cintura / (quadril || 1)).toFixed(2));
  const isMale = user.sexo === 'M';
  
  let rcqRisk = '';
  let rcqColor = '';
  if (isMale) {
    if (rcq < 0.90) {
      rcqRisk = language === 'pt' ? 'Baixo Risco (Excelente)' : 'Low Risk (Excellent)';
      rcqColor = 'text-emerald-500';
    } else if (rcq < 1.00) {
      rcqRisk = language === 'pt' ? 'Risco Moderado' : 'Moderate Risk';
      rcqColor = 'text-amber-500';
    } else {
      rcqRisk = language === 'pt' ? 'Alto Risco' : 'High Risk';
      rcqColor = 'text-red-500';
    }
  } else {
    if (rcq < 0.80) {
      rcqRisk = language === 'pt' ? 'Baixo Risco (Excelente)' : 'Low Risk (Excellent)';
      rcqColor = 'text-emerald-500';
    } else if (rcq < 0.85) {
      rcqRisk = language === 'pt' ? 'Risco Moderado' : 'Moderate Risk';
      rcqColor = 'text-amber-500';
    } else {
      rcqRisk = language === 'pt' ? 'Alto Risco' : 'High Risk';
      rcqColor = 'text-red-500';
    }
  }

  const idealBFRange = isMale ? '8% - 15%' : '18% - 25%';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-calculate lean mass based on bodyfat and weight
    const fatMass = peso * (gorduraPercentual / 100);
    const massaMagra = parseFloat((peso - fatMass).toFixed(1));

    const newEval: WeeklyEvaluation = {
      id: Math.random().toString(36).substring(7),
      data: new Date().toISOString().split('T')[0],
      peso,
      bracoDireito,
      bracoEsquerdo,
      peito,
      cintura,
      abdomen,
      quadril,
      coxaDireita,
      coxaEsquerda,
      panturrilhaDireita: panturrilhaD,
      panturrilhaEsquerda: panturrilhaE,
      pescoco,
      gorduraPercentual,
      massaMagra,
      fotoFrente,
      fotoCostas,
      fotoLateral
    };

    onAddEvaluation(newEval);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div id="evaluations-tab" className="space-y-6 text-slate-900 dark:text-slate-100">
      <header className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-6 h-6 md:w-8 md:h-8 text-slate-900 dark:text-white" />
          {t('eval.title')}
        </h2>
        <p className="text-sm opacity-60 font-medium text-slate-500 dark:text-slate-400">{t('eval.intro')}</p>
      </header>

      {success && (
        <div id="eval-success-alert" className="p-4 bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 font-bold text-sm flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Avaliação registrada com sucesso! Seus gráficos foram atualizados.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Plus className="w-4 h-4 text-slate-900 dark:text-white" />
            {t('eval.register')}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.weight')}</label>
                <input
                  id="eval-weight-input"
                  type="number"
                  step="0.1"
                  required
                  value={peso}
                  onChange={(e) => setPeso(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.bodyfat')}</label>
                <input
                  id="eval-bf-input"
                  type="number"
                  step="0.1"
                  required
                  value={gorduraPercentual}
                  onChange={(e) => setGorduraPercentual(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.pescoco')}</label>
                <input
                  id="eval-neck-input"
                  type="number"
                  step="0.1"
                  required
                  value={pescoco}
                  onChange={(e) => setPescoco(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.bracoD')}</label>
                <input
                  id="eval-arm-r-input"
                  type="number"
                  step="0.1"
                  required
                  value={bracoDireito}
                  onChange={(e) => setBracoDireito(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.bracoE')}</label>
                <input
                  id="eval-arm-l-input"
                  type="number"
                  step="0.1"
                  required
                  value={bracoEsquerdo}
                  onChange={(e) => setBracoEsquerdo(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.peito')}</label>
                <input
                  id="eval-chest-input"
                  type="number"
                  step="0.1"
                  required
                  value={peito}
                  onChange={(e) => setPeito(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.cintura')}</label>
                <input
                  id="eval-waist-input"
                  type="number"
                  step="0.1"
                  required
                  value={cintura}
                  onChange={(e) => setCintura(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.abdomen')}</label>
                <input
                  id="eval-ab-input"
                  type="number"
                  step="0.1"
                  required
                  value={abdomen}
                  onChange={(e) => setAbdomen(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.quadril')}</label>
                <input
                  id="eval-hip-input"
                  type="number"
                  step="0.1"
                  required
                  value={quadril}
                  onChange={(e) => setQuadril(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.coxaD')}</label>
                <input
                  id="eval-thigh-r-input"
                  type="number"
                  step="0.1"
                  required
                  value={coxaDireita}
                  onChange={(e) => setCoxaDireita(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('eval.coxaE')}</label>
                <input
                  id="eval-thigh-l-input"
                  type="number"
                  step="0.1"
                  required
                  value={coxaEsquerda}
                  onChange={(e) => setCoxaEsquerda(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white shadow-xs"
                />
              </div>
            </div>

            {/* Progress Photos Selection Block */}
            <div className="space-y-3 p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl shadow-xs">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                {t('eval.photos')}
              </h4>

              <div className="grid grid-cols-3 gap-4">
                <div className="relative aspect-[3/4] bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden group flex items-center justify-center cursor-pointer shadow-xs">
                  <img src={fotoFrente} referrerPolicy="no-referrer" alt="Frente" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-2 left-2 text-[9px] bg-slate-950/80 px-2 py-0.5 rounded font-mono text-white">FRENTE</span>
                </div>
                <div className="relative aspect-[3/4] bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden group flex items-center justify-center cursor-pointer shadow-xs">
                  <img src={fotoCostas} referrerPolicy="no-referrer" alt="Costas" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-2 left-2 text-[9px] bg-slate-950/80 px-2 py-0.5 rounded font-mono text-white">COSTAS</span>
                </div>
                <div className="relative aspect-[3/4] bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden group flex items-center justify-center cursor-pointer shadow-xs">
                  <img src={fotoLateral} referrerPolicy="no-referrer" alt="Lateral" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-2 left-2 text-[9px] bg-slate-950/80 px-2 py-0.5 rounded font-mono text-white">LATERAL</span>
                </div>
              </div>
            </div>

            <button
              id="submit-eval-btn"
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl shadow-md transition-all border border-transparent hover:-translate-y-0.5 active:translate-y-0"
            >
              SALVAR AVALIAÇÃO FÍSICA
            </button>
          </form>
        </div>

        {/* History Log Widget */}
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm h-full flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              {t('eval.history')}
            </h3>

            {/* Dynamic Gender-Specific Health Indicators */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
              <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {language === 'pt' ? 'Análise Metabólica & RCQ' : 'Metabolic & WHR Analysis'}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'pt' ? 'Relação Cintura-Quadril' : 'Waist-to-Hip Ratio'}:</span>
                  <span className="font-bold font-mono">{rcq}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'pt' ? 'Risco Cardiovascular' : 'Cardiovascular Risk'}:</span>
                  <span className={`font-extrabold ${rcqColor}`}>{rcqRisk}</span>
                </div>
                <div className="border-t border-slate-200/50 dark:border-white/5 my-2 pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'pt' ? 'BF Recomendado' : 'Recommended BF'}:</span>
                  <span className="font-bold text-blue-500 dark:text-blue-400 font-mono">{idealBFRange}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{language === 'pt' ? 'Perfil Biológico' : 'Biological Profile'}:</span>
                  <span className="font-bold uppercase text-[10px] bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    {isMale ? (language === 'pt' ? 'Masculino' : 'Male') : (language === 'pt' ? 'Feminino' : 'Female')}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {evaluations.slice().reverse().map((ev, i) => (
                <div key={ev.id || i} className="p-3 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-xs space-y-1 text-slate-800 dark:text-slate-200 shadow-xs">
                  <div className="flex justify-between font-bold text-slate-500 dark:text-slate-400">
                    <span>Semana {evaluations.length - i}</span>
                    <span className="font-mono text-[10px]">{ev.data}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 opacity-80 font-mono text-[11px]">
                    <div>P: <span className="font-bold">{ev.peso}kg</span></div>
                    <div>BF: <span className="font-bold">{ev.gorduraPercentual}%</span></div>
                    <div>Magra: <span className="font-bold">{ev.massaMagra}kg</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-6 text-center text-[10px] font-medium text-slate-500 dark:text-slate-400">
            Acompanhe o ganho anabólico com consistência.
          </div>
        </div>
      </div>
    </div>
  );
}
