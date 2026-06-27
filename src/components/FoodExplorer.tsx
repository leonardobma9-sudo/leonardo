import React, { useState } from 'react';
import { Food } from '../types';
import { foodDatabase } from '../data/foodDatabase';
import { Search, Calculator, Shield, Flame, Activity } from 'lucide-react';

export default function FoodExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedFoodId, setSelectedFoodId] = useState<string>('f10');
  const [customGrams, setCustomGrams] = useState<number>(100);

  // Available categories
  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'carnes', name: 'Carnes' },
    { id: 'frango', name: 'Frango' },
    { id: 'peixes', name: 'Peixes' },
    { id: 'ovos', name: 'Ovos' },
    { id: 'laticinios', name: 'Laticínios' },
    { id: 'cereais', name: 'Cereais/Carb' },
    { id: 'leguminosas', name: 'Leguminosas' },
    { id: 'frutas', name: 'Frutas' },
    { id: 'verduras', name: 'Verduras' },
    { id: 'legumes', name: 'Legumes' },
    { id: 'oleaginosas', name: 'Oleaginosas' },
    { id: 'temperos', name: 'Temperos/Óleos' },
    { id: 'bebidas', name: 'Bebidas' }
  ];

  // Filtering foods
  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          food.nomeEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || food.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedFood = foodDatabase.find(f => f.id === selectedFoodId) || foodDatabase[0];

  // Calculations scaled to portion
  const factor = customGrams / 100;
  const calSum = parseFloat((selectedFood.calorias * factor).toFixed(0));
  const protSum = parseFloat((selectedFood.proteinas * factor).toFixed(1));
  const carbSum = parseFloat((selectedFood.carboidratos * factor).toFixed(1));
  const fatSum = parseFloat((selectedFood.gorduras * factor).toFixed(1));
  const fiberSum = parseFloat((selectedFood.fibras * factor).toFixed(1));

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Food list and search */}
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4">
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Tabela de Alimentos</h3>
            <p className="text-[11px] opacity-65 leading-tight">Explore a densidade nutricional de nossa base científica integrada.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar alimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Categories pills scroller */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* List area */}
          <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
            {filteredFoods.length > 0 ? (
              filteredFoods.map(food => {
                const isSelected = food.id === selectedFoodId;
                return (
                  <button
                    key={food.id}
                    onClick={() => setSelectedFoodId(food.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex justify-between items-center ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white/10 text-white border border-slate-950 dark:border-white/15'
                        : 'bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-300 border border-transparent'
                    }`}
                  >
                    <span>{food.nome}</span>
                    <span className="text-[10px] opacity-60 font-mono font-normal shrink-0">{food.calorias} kcal/100g</span>
                  </button>
                )
              })
            ) : (
              <p className="text-xs opacity-50 text-center py-6">Nenhum alimento encontrado.</p>
            )}
          </div>
        </div>

        {/* Nutritional details and portion calculator */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
            <div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block font-mono">{selectedFood.categoria}</span>
              <h3 className="text-lg font-black text-slate-950 dark:text-white mt-0.5">{selectedFood.nome}</h3>
            </div>

            {/* Weight inputs */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1.5 rounded-xl">
              <Calculator className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="number"
                min="10"
                max="2000"
                step="10"
                value={customGrams}
                onChange={(e) => setCustomGrams(Number(e.target.value))}
                className="w-16 bg-transparent text-center outline-none border-none font-bold text-xs text-slate-950 dark:text-white"
              />
              <span className="text-[10px] font-bold opacity-60 mr-2">Gramas (g)</span>
            </div>
          </div>

          {/* Portioned macro breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calorias</span>
              <span className="text-xl font-black text-slate-900 dark:text-white block mt-1">{calSum} <span className="text-xs font-normal">kcal</span></span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Proteínas</span>
              <span className="text-xl font-black text-blue-600 dark:text-blue-400 block mt-1">{protSum} <span className="text-xs font-normal">g</span></span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Carboidratos</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 block mt-1">{carbSum} <span className="text-xs font-normal">g</span></span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">Gorduras</span>
              <span className="text-xl font-black text-red-600 dark:text-red-400 block mt-1">{fatSum} <span className="text-xs font-normal">g</span></span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Fibras</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{fiberSum} <span className="text-xs font-normal">g</span></span>
            </div>
          </div>

          {/* Micro nutrients information panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vitaminas Presentes</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedFood.vitaminas && selectedFood.vitaminas.length > 0 ? (
                  selectedFood.vitaminas.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-500/5 dark:bg-blue-400/5 border border-blue-500/15 dark:border-blue-400/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-md">
                      {v}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] opacity-40">Vitaminas padrão de alimento in natura</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Minerais Presentes</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedFood.minerais && selectedFood.minerais.length > 0 ? (
                  selectedFood.minerais.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-500/5 dark:bg-emerald-400/5 border border-emerald-500/15 dark:border-emerald-400/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md">
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] opacity-40">Minerais essenciais de fonte alimentar</span>
                )}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-2 text-[10px] opacity-60 items-center justify-center leading-snug">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Este alimento integra as tabelas oficiais TACO (Tabela Brasileira de Composição de Alimentos) e USDA.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
