import React, { useState } from 'react';
import { hormonalArticles, warningNoticePt, warningNoticeEn } from '../data/hormonalHealth';
import { ShieldCheck, Flame, BookOpen, AlertCircle, ShoppingBag } from 'lucide-react';
import { useLanguageTheme } from './LanguageThemeContext';

export default function HormonalHealthHub() {
  const { language } = useLanguageTheme();
  const [selectedArticleId, setSelectedArticleId] = useState<string>('h1');

  const selectedArticle = hormonalArticles.find(a => a.id === selectedArticleId) || hormonalArticles[0];

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Medical disclaimer header banner */}
      <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide">AVISO DE INFORMAÇÃO EDUCACIONAL</h4>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
            {language === 'pt' ? warningNoticePt : warningNoticeEn}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article selector list */}
        <div className="space-y-3">
          <span className="text-[10px] font-black tracking-widest uppercase opacity-50 block">Artigos Científicos</span>
          {hormonalArticles.map(art => {
            const isSelected = art.id === selectedArticleId;
            return (
              <button
                key={art.id}
                onClick={() => setSelectedArticleId(art.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white/10 text-white dark:text-white border-slate-950 dark:border-white/20 shadow-sm'
                    : 'bg-white dark:bg-[#0A0E1A]/40 border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-60 uppercase">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Artigo Educativo</span>
                </div>
                <h4 className="font-bold text-xs leading-tight">
                  {language === 'pt' ? art.titulo : art.tituloEn}
                </h4>
                <p className="text-[10px] opacity-75 line-clamp-2">
                  {language === 'pt' ? art.resumo : art.resumoEn}
                </p>
              </button>
            );
          })}

          <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl space-y-2.5 shadow-xs">
            <h5 className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Evidências & Fisiologia
            </h5>
            <p className="text-[10px] leading-relaxed opacity-75">
              Nossas recomendações seguem as descobertas de estudos revisados por pares e ensaios randomizados para assegurar hábitos alimentares anabólicos sem riscos endócrinos.
            </p>
          </div>
        </div>

        {/* Selected article reader */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6">
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-white/5">
              <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-widest">Leitura Recomendada</span>
              <h3 className="text-lg md:text-xl font-black text-slate-950 dark:text-white leading-tight">
                {language === 'pt' ? selectedArticle.titulo : selectedArticle.tituloEn}
              </h3>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {(language === 'pt' ? selectedArticle.conteudo : selectedArticle.conteudoEn).map((paragraph, index) => (
                <p key={index} className="indent-2">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Nutrientes & Alimentos Sugeridos */}
            <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-500" />
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-white">Alimentos Aliados no Prato</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedArticle.alimentosRecomendados.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl space-y-1.5 flex flex-col justify-between shadow-xs">
                    <div>
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                        {language === 'pt' ? item.nome : item.nomeEn}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-400 block mt-0.5 leading-snug">
                        Rich in: <span className="font-semibold text-slate-600 dark:text-slate-300">{language === 'pt' ? item.nutriente : item.nutrienteEn}</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-500 font-bold block bg-blue-500/5 py-0.5 px-2 rounded-md self-start">
                      {language === 'pt' ? item.porcao : item.porcaoEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
