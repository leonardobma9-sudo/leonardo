import React, { useState, useEffect } from 'react';
import { Food, UserProfile } from '../types';
import { foodDatabase } from '../data/foodDatabase';
import { RefreshCw, CheckSquare, Square, ShoppingCart, Info, ListCheck, ShieldAlert } from 'lucide-react';

interface MealPlannerProps {
  objetivo: 'ganhar_massa' | 'emagrecer' | 'recomposicao' | 'manter_peso';
  user: UserProfile;
}

interface MealItemState {
  id: string;
  originalFoodId: string;
  nome: string;
  nomeEn: string;
  pesoGrams: number;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  fibras: number;
  categoria: string;
}

interface MealState {
  tipo: string;
  titulo: string;
  horario: string;
  itens: MealItemState[];
}

export default function MealPlanner({ objetivo, user }: MealPlannerProps) {
  const [meals, setMeals] = useState<MealState[]>([]);
  const [activeReplaceItem, setActiveReplaceItem] = useState<{ mealType: string; itemId: string } | null>(null);
  const [shoppingChecked, setShoppingChecked] = useState<string[]>([]);

  // Generate meal presets based on objective and user gender
  useEffect(() => {
    const cachedPlan = localStorage.getItem(`alpha_meal_plan_${objetivo}_${user.sexo}`);
    if (cachedPlan) {
      setMeals(JSON.parse(cachedPlan));
      return;
    }

    const plan: MealState[] = [];

    // Helper to find foods
    const f = (id: string) => foodDatabase.find(food => food.id === id) || foodDatabase[0];

    const isMale = user.sexo === 'M';
    const scaleFactor = isMale ? 1.0 : 0.75; // Balanced female portions to prevent excess caloric surplus

    const generateItem = (id: string, grams: number): MealItemState => {
      const foodObj = f(id);
      const scaledGrams = Math.round((grams * scaleFactor) / 10) * 10;
      const factor = scaledGrams / 100;
      return {
        id: Math.random().toString(36).substring(7),
        originalFoodId: id,
        nome: foodObj.nome,
        nomeEn: foodObj.nomeEn,
        pesoGrams: scaledGrams,
        calorias: Math.round(foodObj.calorias * factor),
        proteinas: parseFloat((foodObj.proteinas * factor).toFixed(1)),
        carboidratos: parseFloat((foodObj.carboidratos * factor).toFixed(1)),
        gorduras: parseFloat((foodObj.gorduras * factor).toFixed(1)),
        fibras: parseFloat((foodObj.fibras * factor).toFixed(1)),
        categoria: foodObj.categoria
      };
    };

    if (objetivo === 'ganhar_massa') {
      plan.push({
        tipo: 'cafe',
        titulo: 'Café da Manhã',
        horario: '08:00',
        itens: [
          generateItem('f26', 200), // Leite desnatado
          generateItem('f8', 50),   // Aveia
          generateItem('f5', 30),   // Whey
          generateItem('f7', 100)   // Banana
        ]
      });
      plan.push({
        tipo: 'lanche_manha',
        titulo: 'Lanche da Manhã',
        horario: '10:30',
        itens: [
          generateItem('f3', 100),  // 2 ovos cozidos
          generateItem('f11', 50)   // Pão de forma integral
        ]
      });
      plan.push({
        tipo: 'almoco',
        titulo: 'Almoço',
        horario: '13:00',
        itens: [
          generateItem('f1', 150),  // Frango grelhado
          generateItem('f2', 150),  // Arroz integral
          generateItem('f18', 100), // Feijão
          generateItem('f19', 100), // Brócolis
          generateItem('f14', 10)   // Azeite
        ]
      });
      plan.push({
        tipo: 'lanche_tarde',
        titulo: 'Lanche da Tarde',
        horario: '16:30',
        itens: [
          generateItem('f15', 120), // Maçã
          generateItem('f9', 30)    // Pasta de amendoim
        ]
      });
      plan.push({
        tipo: 'jantar',
        titulo: 'Jantar',
        horario: '20:00',
        itens: [
          generateItem('f10', 150), // Patinho
          generateItem('f6', 200),  // Batata doce
          generateItem('f31', 50)   // Rúcula
        ]
      });
      plan.push({
        tipo: 'ceia',
        titulo: 'Ceia',
        horario: '22:30',
        itens: [
          generateItem('f12', 150), // Iogurte natural
          generateItem('f13', 50),  // Cottage
          generateItem('f20', 15)   // Castanha do Pará
        ]
      });
    } else {
      // cutting, recomposicao, manter_peso (Cutting/Emagrecer presets)
      const isDeficit = objetivo === 'emagrecer';
      plan.push({
        tipo: 'cafe',
        titulo: 'Café da Manhã',
        horario: '08:00',
        itens: [
          generateItem('f26', 150), // Leite desnatado
          generateItem('f8', 30),   // Aveia
          generateItem('f5', 30)    // Whey
        ]
      });
      plan.push({
        tipo: 'lanche_manha',
        titulo: 'Lanche da Manhã',
        horario: '10:30',
        itens: [
          generateItem('f4', 100),  // Claras de ovo (3)
          generateItem('f3', 50),   // 1 ovo inteiro
          generateItem('f11', 25)   // 1 fatia pão integral
        ]
      });
      plan.push({
        tipo: 'almoco',
        titulo: 'Almoço',
        horario: '13:00',
        itens: [
          generateItem('f1', 150),  // Frango grelhado
          generateItem('f2', 100),  // Arroz integral
          generateItem('f19', 150), // Brócolis
          generateItem('f14', 5)    // Azeite
        ]
      });
      plan.push({
        tipo: 'lanche_tarde',
        titulo: 'Lanche da Tarde',
        horario: '16:30',
        itens: [
          generateItem('f17', 150), // Mamão
          generateItem('f9', 15)    // Pasta de amendoim
        ]
      });
      plan.push({
        tipo: 'jantar',
        titulo: 'Jantar',
        horario: '20:00',
        itens: [
          generateItem('f10', 150), // Patinho
          generateItem('f6', 100),  // Batata doce
          generateItem('f30', 100)  // Espinafre
        ]
      });
      plan.push({
        tipo: 'ceia',
        titulo: 'Ceia',
        horario: '22:30',
        itens: [
          generateItem('f12', 150), // Iogurte natural
          generateItem('f13', 50)   // Cottage
        ]
      });
    }

    setMeals(plan);
    localStorage.setItem(`alpha_meal_plan_${objetivo}_${user.sexo}`, JSON.stringify(plan));
  }, [objetivo, user.sexo]);

  const saveMealsPlan = (next: MealState[]) => {
    setMeals(next);
    localStorage.setItem(`alpha_meal_plan_${objetivo}_${user.sexo}`, JSON.stringify(next));
  };

  // Automated replacements
  const getEquivalents = (cat: string): Food[] => {
    // If protein category
    if (['carnes', 'frango', 'peixes', 'ovos'].includes(cat)) {
      return foodDatabase.filter(food => ['carnes', 'frango', 'peixes', 'ovos'].includes(food.categoria));
    }
    // Else category specific
    return foodDatabase.filter(food => food.categoria === cat);
  };

  const handleSubstitute = (mealType: string, itemId: string, targetFoodId: string) => {
    const targetFood = foodDatabase.find(f => f.id === targetFoodId);
    if (!targetFood) return;

    const nextPlan = meals.map(m => {
      if (m.tipo === mealType) {
        const nextItens = m.itens.map(item => {
          if (item.id === itemId) {
            // Keep approximately same portion weight, scale macros
            const grams = item.pesoGrams;
            const factor = grams / 100;
            return {
              ...item,
              originalFoodId: targetFoodId,
              nome: targetFood.nome,
              nomeEn: targetFood.nomeEn,
              calorias: Math.round(targetFood.calorias * factor),
              proteinas: parseFloat((targetFood.proteinas * factor).toFixed(1)),
              carboidratos: parseFloat((targetFood.carboidratos * factor).toFixed(1)),
              gorduras: parseFloat((targetFood.gorduras * factor).toFixed(1)),
              fibras: parseFloat((targetFood.fibras * factor).toFixed(1)),
              categoria: targetFood.categoria
            };
          }
          return item;
        });
        return { ...m, itens: nextItens };
      }
      return m;
    });

    saveMealsPlan(nextPlan);
    setActiveReplaceItem(null);
  };

  // Sum total daily nutritional targets in plan
  const planCalories = meals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.calorias, 0), 0);
  const planProteins = parseFloat(meals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.proteinas, 0), 0).toFixed(1));
  const planCarbs = parseFloat(meals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.carboidratos, 0), 0).toFixed(1));
  const planFats = parseFloat(meals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.gorduras, 0), 0).toFixed(1));
  const planFibers = parseFloat(meals.reduce((acc, m) => acc + m.itens.reduce((s, i) => s + i.fibras, 0), 0).toFixed(1));

  // Generate grocery list based on weekly dietary plan (7 days)
  const generateGroceryList = () => {
    const hash: { [key: string]: { name: string; weight: number; category: string } } = {};
    meals.forEach(m => {
      m.itens.forEach(item => {
        // Multiply by 7 days
        const weeklyWeight = item.pesoGrams * 7;
        if (hash[item.originalFoodId]) {
          hash[item.originalFoodId].weight += weeklyWeight;
        } else {
          hash[item.originalFoodId] = {
            name: item.nome,
            weight: weeklyWeight,
            category: item.categoria
          };
        }
      });
    });
    return Object.values(hash);
  };

  const groceryList = generateGroceryList();

  const handleToggleGroceryCheck = (foodName: string) => {
    if (shoppingChecked.includes(foodName)) {
      setShoppingChecked(shoppingChecked.filter(item => item !== foodName));
    } else {
      setShoppingChecked([...shoppingChecked, foodName]);
    }
  };

  const shoppingProgress = groceryList.length > 0 
    ? Math.round((shoppingChecked.length / groceryList.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      
      {/* Plan Totals Banner */}
      <div className="bg-slate-950 text-white p-5 rounded-2xl md:rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            Meta Nutricional Integrada do Plano
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-snug">Metas nutricionais acumuladas pelas refeições listadas neste plano atual.</p>
        </div>

        <div className="flex flex-wrap gap-4 font-mono text-[11px] font-semibold">
          <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            CALORIAS: <span className="font-bold text-yellow-400 text-xs">{planCalories} kcal</span>
          </div>
          <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            PROT: <span className="font-bold text-blue-400 text-xs">{planProteins}g</span>
          </div>
          <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            CARB: <span className="font-bold text-amber-400 text-xs">{planCarbs}g</span>
          </div>
          <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            GORD: <span className="font-bold text-red-400 text-xs">{planFats}g</span>
          </div>
          <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            FIB: <span className="font-bold text-emerald-400 text-xs">{planFibers}g</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Meal cards column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <ListCheck className="w-5 h-5 text-blue-500" />
            Divisão de Refeições Diárias
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meals.map(m => {
              const mealCal = m.itens.reduce((s, i) => s + i.calorias, 0);
              const mealProt = m.itens.reduce((s, i) => s + i.proteinas, 0);
              const mealCarb = m.itens.reduce((s, i) => s + i.carboidratos, 0);
              const mealFat = m.itens.reduce((s, i) => s + i.gorduras, 0);

              return (
                <div key={m.tipo} className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-white/5">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{m.titulo}</span>
                      <span className="font-mono text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 py-0.5 px-2 rounded-md">{m.horario}</span>
                    </div>

                    {/* Food Items in Meal */}
                    <div className="space-y-2 pt-3">
                      {m.itens.map(item => {
                        const isReplacing = activeReplaceItem?.mealType === m.tipo && activeReplaceItem?.itemId === item.id;
                        const equivalents = getEquivalents(item.categoria);

                        return (
                          <div key={item.id} className="text-xs space-y-2 p-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white">{item.nome}</span>
                                <span className="text-[10px] text-slate-400 block">{item.pesoGrams}g - {item.calorias} kcal</span>
                              </div>

                              <button
                                onClick={() => setActiveReplaceItem(isReplacing ? null : { mealType: m.tipo, itemId: item.id })}
                                className="text-blue-500 hover:text-blue-600 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 bg-blue-500/5 px-2 py-1 rounded-md cursor-pointer shrink-0"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Substituir
                              </button>
                            </div>

                            {/* Macro values line */}
                            <div className="flex gap-2.5 font-mono text-[9px] opacity-70">
                              <span>P: <span className="font-bold">{item.proteinas}g</span></span>
                              <span>C: <span className="font-bold">{item.carboidratos}g</span></span>
                              <span>G: <span className="font-bold">{item.gorduras}g</span></span>
                              <span>F: <span className="font-bold">{item.fibras}g</span></span>
                            </div>

                            {/* Equivalence switcher sub-box */}
                            {isReplacing && (
                              <div className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-white/10 space-y-2 animate-in fade-in duration-200">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Equivalentes Compatíveis:</span>
                                <div className="grid grid-cols-1 gap-1 max-h-[120px] overflow-y-auto pr-1">
                                  {equivalents.map(eq => (
                                    <button
                                      key={eq.id}
                                      onClick={() => handleSubstitute(m.tipo, item.id, eq.id)}
                                      className="w-full text-left px-2 py-1 bg-slate-50 dark:bg-white/5 rounded text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white flex justify-between"
                                    >
                                      <span>{eq.nome}</span>
                                      <span className="opacity-60">{eq.calorias} kcal/100g</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Meal summary macros */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 mt-3 flex justify-between items-center text-[10px] font-mono opacity-80 font-bold">
                    <span>Calorias: {mealCal} kcal</span>
                    <div className="flex gap-2 text-[9px] font-bold">
                      <span className="text-blue-500">P:{mealProt.toFixed(0)}g</span>
                      <span className="text-amber-500">C:{mealCarb.toFixed(0)}g</span>
                      <span className="text-red-500">G:{mealFat.toFixed(0)}g</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly shopping list */}
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Lista de Compras (Semanal)</h3>
            </div>

            {/* Grocery progress */}
            <div className="space-y-1.5 p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl">
              <div className="flex justify-between items-baseline text-xs font-bold">
                <span className="opacity-60">Progresso</span>
                <span className="text-blue-600 dark:text-blue-400">{shoppingProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${shoppingProgress}%` }}></div>
              </div>
            </div>

            {/* Shopping list checklist */}
            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {groceryList.map((item, idx) => {
                const isChecked = shoppingChecked.includes(item.name);
                const quantityText = item.weight >= 1000 
                  ? `${(item.weight / 1000).toFixed(1)} kg` 
                  : `${item.weight} g`;

                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleGroceryCheck(item.name)}
                    className="p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl text-xs font-bold flex justify-between items-center cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Square className="w-4 h-4 opacity-50 text-slate-400" />
                      )}
                      <span className={isChecked ? 'line-through opacity-40' : ''}>{item.name}</span>
                    </div>

                    <span className="font-mono text-[10px] font-bold opacity-60 shrink-0">{quantityText}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 text-[10px] opacity-60 text-center flex items-center justify-center gap-1 leading-snug">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
            <span>As quantidades sugerem compras exatas para 7 dias inteiros de plano alimentar.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
