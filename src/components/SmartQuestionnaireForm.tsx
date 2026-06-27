import React, { useState } from 'react';
import { SmartQuestionnaire } from '../types';
import { HelpCircle, Save, CheckCircle } from 'lucide-react';

interface SmartQuestionnaireFormProps {
  initialQuestionnaire: SmartQuestionnaire | null;
  onSave: (q: SmartQuestionnaire) => void;
}

export default function SmartQuestionnaireForm({ initialQuestionnaire, onSave }: SmartQuestionnaireFormProps) {
  const [sexo, setSexo] = useState<'M' | 'F' | 'Outro'>(initialQuestionnaire?.sexo || 'M');
  const [idade, setIdade] = useState<number>(initialQuestionnaire?.idade || 25);
  const [peso, setPeso] = useState<number>(initialQuestionnaire?.peso || 75);
  const [altura, setAltura] = useState<number>(initialQuestionnaire?.altura || 175);
  const [gorduraPercentual, setGorduraPercentual] = useState<number>(initialQuestionnaire?.gorduraPercentual || 15);
  const [circunferenciaAbdominal, setCircunferenciaAbdominal] = useState<number>(initialQuestionnaire?.circunferenciaAbdominal || 82);
  const [nivelAtividade, setNivelAtividade] = useState<'sedentario' | 'moderado' | 'intenso'>(initialQuestionnaire?.nivelAtividade || 'moderado');
  const [diasTreinoSemana, setDiasTreinoSemana] = useState<number>(initialQuestionnaire?.diasTreinoSemana || 4);
  const [horarioTreino, setHorarioTreino] = useState<string>(initialQuestionnaire?.horarioTreino || '18:00');
  const [objetivo, setObjetivo] = useState<'ganhar_massa' | 'emagrecer' | 'recomposicao' | 'manter_peso'>(initialQuestionnaire?.objetivo || 'ganhar_massa');
  const [restricoes, setRestricoes] = useState<string[]>(initialQuestionnaire?.restricoesAlimentares || []);
  const [alergias, setAlergias] = useState<string>(initialQuestionnaire?.alergias || '');
  const [preferidos, setPreferidos] = useState<string>(initialQuestionnaire?.alimentosPreferidos || '');
  const [evitados, setEvitados] = useState<string>(initialQuestionnaire?.alimentosNaoGosta || '');
  const [orcamento, setOrcamento] = useState<'baixo' | 'medio' | 'alto'>(initialQuestionnaire?.orcamento || 'medio');
  const [horasSono, setHorasSono] = useState<number>(initialQuestionnaire?.horasSono || 8);
  const [alcool, setAlcool] = useState<'nunca' | 'socialmente' | 'frequentemente'>(initialQuestionnaire?.consumoAlcool || 'socialmente');
  const [tabagismo, setTabagismo] = useState<boolean>(initialQuestionnaire?.tabagismo || false);
  const [suplementos, setSuplementos] = useState<string[]>(initialQuestionnaire?.usoSuplementos || []);
  const [consumoAgua, setConsumoAgua] = useState<number>(initialQuestionnaire?.consumoAguaMl || 2000);

  const [saved, setSaved] = useState(false);

  const toggleRestricao = (val: string) => {
    if (restricoes.includes(val)) {
      setRestricoes(restricoes.filter(r => r !== val));
    } else {
      setRestricoes([...restricoes, val]);
    }
  };

  const toggleSuplemento = (val: string) => {
    if (suplementos.includes(val)) {
      setSuplementos(suplementos.filter(s => s !== val));
    } else {
      setSuplementos([...suplementos, val]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: SmartQuestionnaire = {
      sexo,
      idade,
      peso,
      altura,
      gorduraPercentual,
      circunferenciaAbdominal,
      nivelAtividade,
      diasTreinoSemana,
      horarioTreino,
      objetivo,
      restricoesAlimentares: restricoes,
      alergias,
      alimentosPreferidos: preferidos,
      alimentosNaoGosta: evitados,
      orcamento,
      horasSono,
      consumoAlcool: alcool,
      tabagismo,
      usoSuplementos: suplementos,
      consumoAguaMl: consumoAgua
    };
    onSave(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            Anamnese & Questionário Inteligente de Saúde
          </h3>
          <p className="text-xs opacity-60 mt-1 leading-relaxed">
            Responda às questões abaixo para que nosso motor científico de nutrição calcule metas precisas de calorias, macronutrientes, fibras e hidratação ideal.
          </p>
        </div>

        {saved && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-xl font-bold text-xs flex items-center gap-2 animate-pulse">
            <CheckCircle className="w-4 h-4" />
            <span>Perfil nutricional atualizado! Metas de alimentação calibradas com sucesso.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Seção 1: Dados Físicos */}
          <div className="space-y-4 md:border-r md:border-slate-100 dark:md:border-white/5 md:pr-6">
            <h4 className="text-xs font-black tracking-wider uppercase text-blue-500">1. Dados Corporais</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Sexo Biológico</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Idade (Anos)</label>
                <input
                  type="number"
                  required
                  min="12"
                  max="100"
                  value={idade}
                  onChange={(e) => setIdade(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Peso Atual (kg)</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="30"
                  max="250"
                  value={peso}
                  onChange={(e) => setPeso(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Altura (cm)</label>
                <input
                  type="number"
                  required
                  min="100"
                  max="230"
                  value={altura}
                  onChange={(e) => setAltura(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Gordura Est. (%)</label>
                <input
                  type="number"
                  required
                  min="3"
                  max="60"
                  value={gorduraPercentual}
                  onChange={(e) => setGorduraPercentual(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Circ. Abdominal (cm)</label>
                <input
                  type="number"
                  required
                  min="40"
                  max="180"
                  value={circunferenciaAbdominal}
                  onChange={(e) => setCircunferenciaAbdominal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Atividade & Objetivo */}
          <div className="space-y-4 md:border-r md:border-slate-100 dark:md:border-white/5 md:px-6">
            <h4 className="text-xs font-black tracking-wider uppercase text-emerald-500">2. Estilo de Vida e Foco</h4>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-60">Nível de Atividade Física</label>
              <select
                value={nivelAtividade}
                onChange={(e) => setNivelAtividade(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              >
                <option value="sedentario">Sedentário (Trabalho sentado, sem treino)</option>
                <option value="moderado">Moderado (Treino moderado 3-4x/semana)</option>
                <option value="intenso">Intenso (Treino diário de alta performance)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Treinos / Semana</label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={diasTreinoSemana}
                  onChange={(e) => setDiasTreinoSemana(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Horário do Treino</label>
                <input
                  type="text"
                  placeholder="Ex: 18:00"
                  value={horarioTreino}
                  onChange={(e) => setHorarioTreino(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-60">Objetivo Principal</label>
              <select
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white font-bold text-blue-600 dark:text-blue-400"
              >
                <option value="ganhar_massa">💪 Ganhar Massa Muscular (Bulking)</option>
                <option value="emagrecer">🔥 Emagrecer (Cutting)</option>
                <option value="recomposicao">🔄 Recomposição Corporal</option>
                <option value="manter_peso">⚖️ Manter Peso Atual</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Horas de Sono / Noite</label>
                <input
                  type="number"
                  min="3"
                  max="12"
                  value={horasSono}
                  onChange={(e) => setHorasSono(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Água Diária Atual (ml)</label>
                <input
                  type="number"
                  step="250"
                  min="0"
                  max="8000"
                  value={consumoAgua}
                  onChange={(e) => setConsumoAgua(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Nutrição & Restrições */}
          <div className="space-y-4 md:pl-6">
            <h4 className="text-xs font-black tracking-wider uppercase text-amber-500">3. Alimentação & Hábitos</h4>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase opacity-60 block">Restrições Alimentares</label>
              <div className="flex flex-wrap gap-1.5">
                {['Glúten', 'Lactose', 'Vegano', 'Vegetariano'].map(r => {
                  const isChecked = restricoes.includes(r);
                  return (
                    <button
                      type="button"
                      key={r}
                      onClick={() => toggleRestricao(r)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                        isChecked 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400' 
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-60">Alergias Alimentares</label>
              <input
                type="text"
                placeholder="Ex: Amendoim, Frutos do mar..."
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-60">Alimentos Favoritos</label>
              <input
                type="text"
                placeholder="Ex: Ovos, banana, arroz..."
                value={preferidos}
                onChange={(e) => setPreferidos(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-60">Alimentos que Evita / Não Gosta</label>
              <input
                type="text"
                placeholder="Ex: Berinjela, jiló..."
                value={evitados}
                onChange={(e) => setEvitados(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Consumo de Álcool</label>
                <select
                  value={alcool}
                  onChange={(e) => setAlcool(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                >
                  <option value="nunca">Nunca</option>
                  <option value="socialmente">Socialmente</option>
                  <option value="frequentemente">Frequente</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60">Orçamento Dieta</label>
                <select
                  value={orcamento}
                  onChange={(e) => setOrcamento(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                >
                  <option value="baixo">Econômico (Baixo)</option>
                  <option value="medio">Moderado (Médio)</option>
                  <option value="alto">Premium (Alto)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[11px] opacity-60 text-slate-500 dark:text-slate-400 max-w-lg leading-tight">
            *Ao salvar, suas metas diárias serão atualizadas cientificamente de acordo com as diretrizes do ACSM (American College of Sports Medicine) e Sociedade Brasileira de Nutrição Esportiva.
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-150 text-white dark:text-slate-900 font-bold rounded-xl flex items-center gap-2 text-xs transition-all shadow-md w-full sm:w-auto justify-center cursor-pointer hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            SALVAR PERFIL E CALCULAR METAS
          </button>
        </div>
      </div>
    </form>
  );
}
