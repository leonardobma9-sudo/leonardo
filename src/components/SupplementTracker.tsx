import React, { useState, useEffect } from 'react';
import { Suplemento } from '../types';
import { Plus, Bell, CheckCircle, Trash2, Clock, ShieldAlert } from 'lucide-react';

export default function SupplementTracker() {
  const [supps, setSupps] = useState<Suplemento[]>([]);
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horario, setHorario] = useState('08:00');
  const [lembrete, setLembrete] = useState(true);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('alpha_supplements');
    if (saved) {
      setSupps(JSON.parse(saved));
    } else {
      // Seed preset standard supplements
      const presets: Suplemento[] = [
        { id: 's1', nome: 'Creatina Monohidratada', dosagem: '5g', horario: 'Pós-treino', lembreteAtivo: true, concluidoHoje: false },
        { id: 's2', nome: 'Whey Protein Concentrado', dosagem: '30g', horario: '16:00', lembreteAtivo: true, concluidoHoje: false },
        { id: 's3', nome: 'Vitamina D3', dosagem: '5000 UI', horario: '08:00', lembreteAtivo: true, concluidoHoje: false }
      ];
      setSupps(presets);
      localStorage.setItem('alpha_supplements', JSON.stringify(presets));
    }
  }, []);

  const saveSupps = (next: Suplemento[]) => {
    setSupps(next);
    localStorage.setItem('alpha_supplements', JSON.stringify(next));
  };

  const handleAddSupplement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !dosagem.trim()) return;

    const newSupp: Suplemento = {
      id: Math.random().toString(36).substring(7),
      nome: nome.trim(),
      dosagem: dosagem.trim(),
      horario,
      lembreteAtivo: lembrete,
      concluidoHoje: false
    };

    saveSupps([...supps, newSupp]);
    setNome('');
    setDosagem('');
  };

  const handleToggleConcluido = (id: string) => {
    const next = supps.map(s => s.id === id ? { ...s, concluidoHoje: !s.concluidoHoje } : s);
    saveSupps(next);
  };

  const handleToggleLembrete = (id: string) => {
    const next = supps.map(s => s.id === id ? { ...s, lembreteAtivo: !s.lembreteAtivo } : s);
    saveSupps(next);
  };

  const handleDelete = (id: string) => {
    const next = supps.filter(s => s.id !== id);
    saveSupps(next);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registration form */}
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Novo Suplemento</h3>
            <p className="text-[11px] opacity-65">Cadastre doses, horários e configure notificações de lembrete diário.</p>
          </div>

          <form onSubmit={handleAddSupplement} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-60">Nome do Suplemento</label>
              <input
                type="text"
                required
                placeholder="Ex: Creatina, Omega 3, Whey..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-60">Dosagem</label>
              <input
                type="text"
                required
                placeholder="Ex: 5g, 2 cápsulas, 1 scoop..."
                value={dosagem}
                onChange={(e) => setDosagem(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase opacity-60">Horário Recomendado</label>
              <input
                type="text"
                placeholder="Ex: 08:00, Pós-treino, No almoço"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                Ativar Alarme de Lembrete
              </span>
              <input
                type="checkbox"
                checked={lembrete}
                onChange={(e) => setLembrete(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-150 text-white dark:text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              REGISTRAR SUPLEMENTO
            </button>
          </form>
        </div>

        {/* Supplement list */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Suplementação de Hoje</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {supps.length > 0 ? (
              supps.map(s => {
                return (
                  <div 
                    key={s.id} 
                    className={`p-4 border rounded-2xl transition-all flex flex-col justify-between gap-4 ${
                      s.concluidoHoje 
                        ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-slate-750 dark:text-slate-300' 
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <span className="font-black text-xs block leading-snug">{s.nome}</span>
                        <div className="flex items-center gap-1.5 text-[10px] opacity-60">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{s.horario} - <span className="font-bold text-blue-500">{s.dosagem}</span></span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-500/70 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/40 dark:border-white/5">
                      <button
                        onClick={() => handleToggleLembrete(s.id)}
                        className={`flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md transition-all ${
                          s.lembreteAtivo 
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                            : 'bg-slate-200/50 dark:bg-white/5 text-slate-500'
                        }`}
                      >
                        <Bell className="w-3 h-3" />
                        <span>{s.lembreteAtivo ? 'Alerta Ativo' : 'Sem Alerta'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleConcluido(s.id)}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                          s.concluidoHoje 
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/15' 
                            : 'bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-150 text-white dark:text-slate-900 shadow-sm'
                        }`}
                      >
                        {s.concluidoHoje ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                        <span>{s.concluidoHoje ? 'TOMADO' : 'MARCAR COMO TOMADO'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-10 space-y-2">
                <p className="text-xs opacity-50">Nenhum suplemento ativo cadastrado.</p>
                <p className="text-[10px] opacity-40">Adicione creatina, multivitamínicos ou shakes no formulário ao lado.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-2 text-[10px] opacity-60 items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-blue-500" />
            <span>Suplementos apoiam a ingestão proteica e micro-metabólica diária de forma limpa.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
