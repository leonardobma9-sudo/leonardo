import React, { useState } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { UserProfile, LoggedMeal, Food, LoggedMealItem } from '../types';
import { foodDatabase } from '../data/foodDatabase';
import { calculateMacros } from '../utils/calculations';
import { Flame, Apple, Search, Plus, Trash2, Edit3, ArrowUpRight } from 'lucide-react';

interface DietSectionProps {
  user: UserProfile;
  loggedMeals: LoggedMeal[];
  onAddMeal: (meal: LoggedMeal) => void;
  onRemoveMealItem: (mealId: string, itemId: string) => void;
}

export default function DietSection({
  user,
  loggedMeals,
  onAddMeal,
  onRemoveMealItem
}: DietSectionProps) {
  const { t, language } = useLanguageTheme();

  // Calculate user macros
  const {
    tmb,
    tdee,
    caloriasAlvo: caloriasGanhoMassa,
    proteinasG,
    carboidratosG,
    gordurasG
  } = calculateMacros(user.peso, user.altura, user.idade, user.sexo, 'moderado', 'ganhar_massa');

  // Meal types
  const mealTypes = [
    { id: 'cafe', title: t('diet.meal.cafe'), time: '08:00' },
    { id: 'almoco', title: t('diet.meal.almoco'), time: '13:00' },
    { id: 'lanche', title: t('diet.meal.lanche'), time: '16:30' },
    { id: 'jantar', title: t('diet.meal.jantar'), time: '20:00' },
    { id: 'ceia', title: t('diet.meal.ceia'), time: '22:30' }
  ];

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'cafe' | 'almoco' | 'lanche' | 'jantar' | 'ceia'>('cafe');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [portionGrams, setPortionGrams] = useState<number>(100);

  // Filter foods based on query
  const filteredFoods = searchTerm.trim() === ''
    ? []
    : foodDatabase.filter((f) => {
        const query = searchTerm.toLowerCase();
        return f.nome.toLowerCase().includes(query) || f.nomeEn.toLowerCase().includes(query);
      });

  // Calculate current intake sums
  const totalCal = loggedMeals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.calorias, 0), 0);
  const totalProt = loggedMeals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.proteinas, 0), 0);
  const totalCarb = loggedMeals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.carboidratos, 0), 0);
  const totalFat = loggedMeals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.gorduras, 0), 0);

  const handleAddFoodItem = () => {
    if (!selectedFood) return;

    // Scale macros to portion
    const factor = portionGrams / 100;
    const itemCalories = Math.round(selectedFood.calorias * factor);
    const itemProteins = Math.round(selectedFood.proteinas * factor);
    const itemCarbs = Math.round(selectedFood.carboidratos * factor);
    const itemFats = Math.round(selectedFood.gorduras * factor);

    const newItem: LoggedMealItem = {
      id: Math.random().toString(36).substring(7),
      foodId: selectedFood.id,
      nome: language === 'pt' ? selectedFood.nome : selectedFood.nomeEn,
      pesoGrams: portionGrams,
      calorias: itemCalories,
      proteinas: itemProteins,
      carboidratos: itemCarbs,
      gorduras: itemFats
    };

    // Find existing meal of selectedMealType or create new one
    const existingMeal = loggedMeals.find(m => m.tipo === selectedMealType);
    if (existingMeal) {
      const updatedMeal = {
        ...existingMeal,
        itens: [...existingMeal.itens, newItem]
      };
      onAddMeal(updatedMeal);
    } else {
      const newMeal: LoggedMeal = {
        id: Math.random().toString(36).substring(7),
        tipo: selectedMealType,
        horario: mealTypes.find(t => t.id === selectedMealType)?.time || '12:00',
        itens: [newItem]
      };
      onAddMeal(newMeal);
    }

    // Reset inputs
    setSelectedFood(null);
    setSearchTerm('');
    setPortionGrams(100);
  };

  return (
    <div id="diet-tab" className="space-y-6 text-slate-900 dark:text-slate-100">
      <header className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Apple className="w-6 h-6 md:w-8 md:h-8 text-slate-900 dark:text-white" />
          {t('diet.title')}
        </h2>
        <p className="text-sm opacity-60 font-medium text-slate-500 dark:text-slate-400">
          {language === 'pt' 
            ? 'Configure sua nutrição, calcule macros para ganho de peso e registre alimentos.' 
            : 'Configure your nutrition, calculate weight gain macros and log foods.'}
        </p>
      </header>

      {/* Calories Calculations Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
          <span className="text-[10px] font-bold tracking-wider uppercase opacity-50 block">{t('diet.bmr')}</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{tmb} Kcal</span>
          <p className="text-[11px] opacity-60 mt-1">Gasto em repouso absoluto</p>
        </div>

        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
          <span className="text-[10px] font-bold tracking-wider uppercase opacity-50 block">{t('diet.tdee')}</span>
          <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">{tdee} Kcal</span>
          <p className="text-[11px] opacity-60 mt-1">Energia diária estimada com atividades</p>
        </div>

        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
          <span className="text-[10px] font-bold tracking-wider uppercase opacity-50 block">{t('diet.surplus')}</span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{caloriasGanhoMassa} Kcal</span>
          <p className="text-[11px] opacity-60 mt-1">Superávit focado em ganho de massa magra</p>
        </div>
      </div>

      {/* Target Macros Progress */}
      <div className="p-6 bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-wider uppercase opacity-80">{t('diet.macros')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl">
            <div className="flex justify-between items-baseline mb-2 text-xs">
              <span className="opacity-60">Calorias Consumidas</span>
              <span className="font-bold text-slate-900 dark:text-white">{totalCal} / {caloriasGanhoMassa}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 dark:bg-white h-full" style={{ width: `${Math.min(100, (totalCal / caloriasGanhoMassa) * 100)}%` }}></div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl">
            <div className="flex justify-between items-baseline mb-2 text-xs">
              <span className="opacity-60">{t('diet.proteins')} (2.2g/kg)</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{totalProt}g / {proteinasG}g</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 dark:bg-blue-400 h-full" style={{ width: `${Math.min(100, (totalProt / proteinasG) * 100)}%` }}></div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl">
            <div className="flex justify-between items-baseline mb-2 text-xs">
              <span className="opacity-60">{t('diet.carbs')}</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{totalCarb}g / {carboidratosG}g</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-600 dark:bg-amber-400 h-full" style={{ width: `${Math.min(100, (totalCarb / carboidratosG) * 100)}%` }}></div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl">
            <div className="flex justify-between items-baseline mb-2 text-xs">
              <span className="opacity-60">{t('diet.fats')}</span>
              <span className="font-bold text-red-600 dark:text-red-400">{totalFat}g / {gordurasG}g</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-600 dark:bg-red-400 h-full" style={{ width: `${Math.min(100, (totalFat / gordurasG) * 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Food Search and Log Action */}
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('diet.addMeal')}</h3>

          {/* Selected meal type */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('diet.mealType')}</label>
            <select
              id="food-meal-type-select"
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
            >
              {mealTypes.map(m => (
                <option key={m.id} value={m.id} className="text-slate-900">{m.title}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{language === 'pt' ? 'Pesquisar Alimento' : 'Search Food'}</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 opacity-40 text-slate-500" />
              <input
                id="food-search-input"
                type="text"
                placeholder={t('diet.searchFood')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white"
              />
            </div>

            {/* Dropdown list of results */}
            {filteredFoods.length > 0 && (
              <div id="food-search-results" className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl max-h-48 overflow-y-auto z-20 shadow-xl p-1 text-slate-900 dark:text-white">
                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => {
                      setSelectedFood(food);
                      setSearchTerm(language === 'pt' ? food.nome : food.nomeEn);
                    }}
                    className="p-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg cursor-pointer flex justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {language === 'pt' ? food.nome : food.nomeEn}
                    </span>
                    <span className="opacity-60">{food.calorias} Kcal/100g</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Portion and stats if selected */}
          {selectedFood && (
            <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nutrientes Estimados</span>
                <span className="text-[10px] opacity-60">por {portionGrams}g</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-lg">
                  <p className="text-[9px] opacity-60">CAL</p>
                  <p className="text-slate-900 dark:text-white mt-0.5">{Math.round(selectedFood.calorias * (portionGrams / 100))}</p>
                </div>
                <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-lg">
                  <p className="text-[9px] opacity-60">PROT</p>
                  <p className="text-blue-600 dark:text-blue-400 mt-0.5">{Math.round(selectedFood.proteinas * (portionGrams / 100))}g</p>
                </div>
                <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-lg">
                  <p className="text-[9px] opacity-60">CARB</p>
                  <p className="text-amber-600 dark:text-amber-400 mt-0.5">{Math.round(selectedFood.carboidratos * (portionGrams / 100))}g</p>
                </div>
                <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-lg">
                  <p className="text-[9px] opacity-60">GORD</p>
                  <p className="text-red-600 dark:text-red-400 mt-0.5">{Math.round(selectedFood.gorduras * (portionGrams / 100))}g</p>
                </div>
              </div>

              {/* Portion input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">{t('diet.foodWeight')}</label>
                <input
                  id="food-portion-input"
                  type="number"
                  min="10"
                  max="1000"
                  value={portionGrams}
                  onChange={(e) => setPortionGrams(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <button
                id="add-food-btn"
                onClick={handleAddFoodItem}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-md transition-all border border-transparent hover:-translate-y-0.5 active:translate-y-0"
              >
                {t('diet.addFood')}
              </button>
            </div>
          )}
        </div>

        {/* Logged Foods List */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">{t('diet.logged')}</h3>

          {loggedMeals.length === 0 ? (
            <div id="diet-empty-state" className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl opacity-60">
              <Apple className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Nenhum alimento registrado para hoje.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {loggedMeals.map((meal) => (
                <div key={meal.id} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/30 dark:border-white/5">
                    <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                      {mealTypes.find(t => t.id === meal.tipo)?.title}
                    </span>
                    <span className="text-[10px] font-semibold opacity-60">⏱ {meal.horario}</span>
                  </div>

                  <div className="space-y-2.5">
                    {meal.itens.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{item.nome} ({item.pesoGrams}g)</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            P: {item.proteinas}g • C: {item.carboidratos}g • G: {item.gorduras}g
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900 dark:text-white">{item.calorias} Kcal</span>
                          <button
                            id={`remove-meal-item-${meal.id}-${item.id}`}
                            onClick={() => onRemoveMealItem(meal.id, item.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
