import { Food } from '../types';

export const foodDatabase: Food[] = [
  // Carnes
  {
    id: 'f10',
    nome: 'Patinho Bovino Grelhado',
    nomeEn: 'Grilled Lean Beef',
    calorias: 219,
    proteinas: 35.9,
    carboidratos: 0,
    gorduras: 7.3,
    fibras: 0,
    categoria: 'carnes',
    vitaminas: ['Vitamina B12', 'Vitamina B6', 'Niacina'],
    minerais: ['Zinco', 'Ferro', 'Fósforo', 'Potássio']
  },
  {
    id: 'f21',
    nome: 'Maminha Grelhada',
    nomeEn: 'Grilled Tri-Tip',
    calorias: 153,
    proteinas: 28,
    carboidratos: 0,
    gorduras: 4.5,
    fibras: 0,
    categoria: 'carnes',
    vitaminas: ['Vitamina B12', 'Riboflavina'],
    minerais: ['Zinco', 'Ferro', 'Selênio']
  },
  {
    id: 'f22',
    nome: 'Filé Mignon Bovino Grelhado',
    nomeEn: 'Grilled Tenderloin',
    calorias: 220,
    proteinas: 32,
    carboidratos: 0,
    gorduras: 9,
    fibras: 0,
    categoria: 'carnes',
    vitaminas: ['Vitamina B12', 'B6'],
    minerais: ['Zinco', 'Ferro', 'Fósforo']
  },

  // Frango
  {
    id: 'f1',
    nome: 'Peito de Frango Grelhado',
    nomeEn: 'Grilled Chicken Breast',
    calorias: 165,
    proteinas: 31,
    carboidratos: 0,
    gorduras: 3.6,
    fibras: 0,
    categoria: 'frango',
    vitaminas: ['Niacina', 'Vitamina B6', 'Ácido Pantotênico'],
    minerais: ['Fósforo', 'Selênio', 'Potássio']
  },
  {
    id: 'f23',
    nome: 'Coxa de Frango Grelhada (sem pele)',
    nomeEn: 'Grilled Chicken Drumstick (skinless)',
    calorias: 170,
    proteinas: 26,
    carboidratos: 0,
    gorduras: 7,
    fibras: 0,
    categoria: 'frango',
    vitaminas: ['Niacina', 'Vitamina B12'],
    minerais: ['Zinco', 'Ferro', 'Potássio']
  },

  // Peixes
  {
    id: 'f16',
    nome: 'Atum Sólido em Lata',
    nomeEn: 'Canned Solid Tuna',
    calorias: 116,
    proteinas: 26,
    carboidratos: 0,
    gorduras: 1,
    fibras: 0,
    categoria: 'peixes',
    vitaminas: ['Vitamina B12', 'Vitamina D', 'Niacina'],
    minerais: ['Selênio', 'Fósforo', 'Sódio']
  },
  {
    id: 'f24',
    nome: 'Filé de Salmão Grelhado',
    nomeEn: 'Grilled Salmon Fillet',
    calorias: 206,
    proteinas: 22,
    carboidratos: 0,
    gorduras: 12,
    fibras: 0,
    categoria: 'peixes',
    vitaminas: ['Vitamina D', 'Vitamina B12', 'B6'],
    minerais: ['Fósforo', 'Potássio', 'Selênio', 'Magnésio']
  },
  {
    id: 'f25',
    nome: 'Sardinha em Lata (em óleo drain)',
    nomeEn: 'Canned Sardine',
    calorias: 208,
    proteinas: 24,
    carboidratos: 0,
    gorduras: 11.5,
    fibras: 0,
    categoria: 'peixes',
    vitaminas: ['Vitamina D', 'Vitamina B12'],
    minerais: ['Cálcio', 'Zinco', 'Ferro', 'Fósforo']
  },

  // Ovos
  {
    id: 'f3',
    nome: 'Ovo Inteiro Cozido',
    nomeEn: 'Boiled Whole Egg',
    calorias: 155,
    proteinas: 13,
    carboidratos: 1.1,
    gorduras: 11,
    fibras: 0,
    categoria: 'ovos',
    vitaminas: ['Vitamina B12', 'Vitamina A', 'Vitamina D', 'Riboflavina'],
    minerais: ['Zinco', 'Fósforo', 'Ferro', 'Selênio']
  },
  {
    id: 'f4',
    nome: 'Clara de Ovo',
    nomeEn: 'Egg White',
    calorias: 52,
    proteinas: 11,
    carboidratos: 0.7,
    gorduras: 0.2,
    fibras: 0,
    categoria: 'ovos',
    vitaminas: ['Riboflavina'],
    minerais: ['Potássio', 'Sódio']
  },

  // Laticínios
  {
    id: 'f5',
    nome: 'Whey Protein Concentrado',
    nomeEn: 'Whey Protein Concentrate',
    calorias: 400,
    proteinas: 80,
    carboidratos: 6,
    gorduras: 6,
    fibras: 0,
    categoria: 'laticinios',
    vitaminas: ['Complexo B'],
    minerais: ['Cálcio', 'Potássio', 'Fósforo']
  },
  {
    id: 'f12',
    nome: 'Iogurte Natural Desnatado',
    nomeEn: 'Non-fat Plain Yogurt',
    calorias: 41,
    proteinas: 4,
    carboidratos: 6,
    gorduras: 0.2,
    fibras: 0,
    categoria: 'laticinios',
    vitaminas: ['Vitamina B12', 'Riboflavina'],
    minerais: ['Cálcio', 'Fósforo', 'Potássio']
  },
  {
    id: 'f13',
    nome: 'Queijo Cottage',
    nomeEn: 'Cottage Cheese',
    calorias: 98,
    proteinas: 11,
    carboidratos: 3.4,
    gorduras: 4.3,
    fibras: 0,
    categoria: 'laticinios',
    vitaminas: ['Vitamina B12', 'Riboflavina'],
    minerais: ['Cálcio', 'Fósforo', 'Sódio']
  },
  {
    id: 'f26',
    nome: 'Leite Desnatado líquido',
    nomeEn: 'Skimmed Milk',
    calorias: 35,
    proteinas: 3.2,
    carboidratos: 4.7,
    gorduras: 0.1,
    fibras: 0,
    categoria: 'laticinios',
    vitaminas: ['Vitamina D', 'Vitamina B12', 'Cálcio'],
    minerais: ['Cálcio', 'Fósforo', 'Potássio']
  },

  // Cereais
  {
    id: 'f2',
    nome: 'Arroz Integral Cozido',
    nomeEn: 'Cooked Brown Rice',
    calorias: 111,
    proteinas: 2.6,
    carboidratos: 23,
    gorduras: 0.9,
    fibras: 1.8,
    categoria: 'cereais',
    vitaminas: ['Tiamina', 'Niacina', 'Vitamina B6'],
    minerais: ['Manganês', 'Fósforo', 'Magnésio']
  },
  {
    id: 'f6',
    nome: 'Batata Doce Cozida',
    nomeEn: 'Cooked Sweet Potato',
    calorias: 86,
    proteinas: 1.6,
    carboidratos: 20,
    gorduras: 0.1,
    fibras: 3,
    categoria: 'cereais', // categorized as carb/cereal category for fitness usage
    vitaminas: ['Vitamina A (Beta-caroteno)', 'Vitamina C', 'B6'],
    minerais: ['Potássio', 'Manganês', 'Cobre']
  },
  {
    id: 'f8',
    nome: 'Aveia em Flocos',
    nomeEn: 'Oat Flakes',
    calorias: 389,
    proteinas: 16.9,
    carboidratos: 66,
    gorduras: 6.9,
    fibras: 10.6,
    categoria: 'cereais',
    vitaminas: ['Tiamina', 'Ácido Fólico'],
    minerais: ['Manganês', 'Fósforo', 'Magnésio', 'Ferro', 'Zinco']
  },
  {
    id: 'f11',
    nome: 'Pão de Forma Integral',
    nomeEn: 'Whole Wheat Bread',
    calorias: 247,
    proteinas: 12,
    carboidratos: 43,
    gorduras: 3.2,
    fibras: 6.5,
    categoria: 'cereais',
    vitaminas: ['Tiamina', 'Niacina'],
    minerais: ['Ferro', 'Fósforo', 'Magnésio']
  },

  // Leguminosas
  {
    id: 'f18',
    nome: 'Feijão Carioca Cozido',
    nomeEn: 'Cooked Carioca Beans',
    calorias: 76,
    proteinas: 4.8,
    carboidratos: 14,
    gorduras: 0.5,
    fibras: 5.1,
    categoria: 'leguminosas',
    vitaminas: ['Ácido Fólico', 'Tiamina'],
    minerais: ['Ferro', 'Zinco', 'Potássio', 'Fósforo', 'Magnésio']
  },
  {
    id: 'f27',
    nome: 'Lentilha Cozida',
    nomeEn: 'Cooked Lentils',
    calorias: 116,
    proteinas: 9,
    carboidratos: 20,
    gorduras: 0.4,
    fibras: 7.9,
    categoria: 'leguminosas',
    vitaminas: ['Ácido Fólico', 'Vitamina B6'],
    minerais: ['Zinco', 'Ferro', 'Potássio', 'Fósforo']
  },
  {
    id: 'f28',
    nome: 'Grão de Bico Cozido',
    nomeEn: 'Cooked Chickpeas',
    calorias: 164,
    proteinas: 8.9,
    carboidratos: 27,
    gorduras: 2.6,
    fibras: 7.6,
    categoria: 'leguminosas',
    vitaminas: ['Ácido Fólico', 'Vitamina B6'],
    minerais: ['Ferro', 'Zinco', 'Magnésio', 'Fósforo']
  },

  // Frutas
  {
    id: 'f7',
    nome: 'Banana Prata',
    nomeEn: 'Silver Banana',
    calorias: 89,
    proteinas: 1.1,
    carboidratos: 23,
    gorduras: 0.3,
    fibras: 2.6,
    categoria: 'frutas',
    vitaminas: ['Vitamina B6', 'Vitamina C'],
    minerais: ['Potássio', 'Manganês', 'Magnésio']
  },
  {
    id: 'f15',
    nome: 'Maçã',
    nomeEn: 'Apple',
    calorias: 52,
    proteinas: 0.3,
    carboidratos: 14,
    gorduras: 0.2,
    fibras: 2.4,
    categoria: 'frutas',
    vitaminas: ['Vitamina C', 'Vitamina K'],
    minerais: ['Potássio']
  },
  {
    id: 'f17',
    nome: 'Mamão Papaia',
    nomeEn: 'Papaya',
    calorias: 43,
    proteinas: 0.5,
    carboidratos: 11,
    gorduras: 0.1,
    fibras: 1.7,
    categoria: 'frutas',
    vitaminas: ['Vitamina C', 'Vitamina A', 'Ácido Fólico'],
    minerais: ['Potássio', 'Cálcio']
  },
  {
    id: 'f29',
    nome: 'Abacate',
    nomeEn: 'Avocado',
    calorias: 160,
    proteinas: 2,
    carboidratos: 8.5,
    gorduras: 15,
    fibras: 6.7,
    categoria: 'frutas',
    vitaminas: ['Vitamina E', 'Vitamina K', 'Vitamina B6', 'Ácido Fólico'],
    minerais: ['Potássio', 'Cobre', 'Magnésio']
  },

  // Verduras
  {
    id: 'f19',
    nome: 'Brócolis Cozido',
    nomeEn: 'Steamed Broccoli',
    calorias: 35,
    proteinas: 2.4,
    carboidratos: 7,
    gorduras: 0.4,
    fibras: 2.6,
    categoria: 'verduras',
    vitaminas: ['Vitamina C', 'Vitamina K', 'Vitamina A', 'Ácido Fólico'],
    minerais: ['Cálcio', 'Ferro', 'Zinco', 'Potássio']
  },
  {
    id: 'f30',
    nome: 'Espinafre Cozido',
    nomeEn: 'Steamed Spinach',
    calorias: 23,
    proteinas: 3,
    carboidratos: 3.8,
    gorduras: 0.3,
    fibras: 2.4,
    categoria: 'verduras',
    vitaminas: ['Vitamina A', 'Vitamina C', 'Vitamina K', 'Ácido Fólico'],
    minerais: ['Ferro', 'Cálcio', 'Zinco', 'Magnésio']
  },
  {
    id: 'f31',
    nome: 'Rúcula Fresca',
    nomeEn: 'Arugula',
    calorias: 25,
    proteinas: 2.6,
    carboidratos: 3.7,
    gorduras: 0.7,
    fibras: 1.6,
    categoria: 'verduras',
    vitaminas: ['Vitamina K', 'Vitamina A', 'Vitamina C'],
    minerais: ['Cálcio', 'Ferro', 'Zinco']
  },

  // Legumes
  {
    id: 'f32',
    nome: 'Cenoura Cozida',
    nomeEn: 'Cooked Carrot',
    calorias: 41,
    proteinas: 0.8,
    carboidratos: 9.6,
    gorduras: 0.2,
    fibras: 2.8,
    categoria: 'legumes',
    vitaminas: ['Vitamina A (Beta-caroteno)', 'Vitamina K', 'B6'],
    minerais: ['Potássio', 'Sódio']
  },
  {
    id: 'f33',
    nome: 'Chuchu Cozido',
    nomeEn: 'Cooked Chayote',
    calorias: 19,
    proteinas: 0.8,
    carboidratos: 4.5,
    gorduras: 0.1,
    fibras: 1.7,
    categoria: 'legumes',
    vitaminas: ['Vitamina C', 'Ácido Fólico'],
    minerais: ['Zinco', 'Potássio']
  },
  {
    id: 'f34',
    nome: 'Abóbora Cabotiá Cozida',
    nomeEn: 'Cooked Kabocha Pumpkin',
    calorias: 48,
    proteinas: 1,
    carboidratos: 10.8,
    gorduras: 0.1,
    fibras: 2.5,
    categoria: 'legumes',
    vitaminas: ['Vitamina A', 'Vitamina C', 'Vitamina E'],
    minerais: ['Potássio', 'Cálcio', 'Zinco']
  },

  // Oleaginosas
  {
    id: 'f20',
    nome: 'Castanha do Pará',
    nomeEn: 'Brazil Nut',
    calorias: 656,
    proteinas: 14,
    carboidratos: 12,
    gorduras: 66,
    fibras: 7.5,
    categoria: 'oleaginosas',
    vitaminas: ['Vitamina E', 'Tiamina'],
    minerais: ['Selênio', 'Zinco', 'Magnésio', 'Cálcio']
  },
  {
    id: 'f9',
    nome: 'Pasta de Amendoim Integral',
    nomeEn: 'Peanut Butter',
    calorias: 588,
    proteinas: 25,
    carboidratos: 20,
    gorduras: 50,
    fibras: 6,
    categoria: 'oleaginosas',
    vitaminas: ['Niacina', 'Vitamina E', 'Vitamina B6'],
    minerais: ['Zinco', 'Magnésio', 'Potássio', 'Ferro']
  },
  {
    id: 'f35',
    nome: 'Amêndoas Sem Sal',
    nomeEn: 'Almonds',
    calorias: 579,
    proteinas: 21,
    carboidratos: 22,
    gorduras: 49.9,
    fibras: 12.5,
    categoria: 'oleaginosas',
    vitaminas: ['Vitamina E', 'Riboflavina'],
    minerais: ['Magnésio', 'Cálcio', 'Ferro', 'Zinco']
  },
  {
    id: 'f36',
    nome: 'Nozes Quartz',
    nomeEn: 'Walnuts',
    calorias: 654,
    proteinas: 15.2,
    carboidratos: 13.7,
    gorduras: 65.2,
    fibras: 6.7,
    categoria: 'oleaginosas',
    vitaminas: ['Vitamina B6', 'Ácido Fólico'],
    minerais: ['Magnésio', 'Manganês', 'Cobre', 'Zinco']
  },

  // Temperos
  {
    id: 'f14',
    nome: 'Azeite de Oliva Extra Virgem',
    nomeEn: 'Extra Virgin Olive Oil',
    calorias: 884,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 100,
    fibras: 0,
    categoria: 'temperos',
    vitaminas: ['Vitamina E', 'Vitamina K'],
    minerais: ['Cálcio', 'Potássio']
  },
  {
    id: 'f37',
    nome: 'Alho Triturado',
    nomeEn: 'Crushed Garlic',
    calorias: 149,
    proteinas: 6.4,
    carboidratos: 33,
    gorduras: 0.5,
    fibras: 2.1,
    categoria: 'temperos',
    vitaminas: ['Vitamina C', 'B6'],
    minerais: ['Manganês', 'Zinco', 'Selênio']
  },
  {
    id: 'f38',
    nome: 'Cúrcuma (Açafrão-da-terra) pó',
    nomeEn: 'Turmeric Powder',
    calorias: 354,
    proteinas: 7.8,
    carboidratos: 64.9,
    gorduras: 9.9,
    fibras: 21.1,
    categoria: 'temperos',
    vitaminas: ['Vitamina C', 'Vitamina E'],
    minerais: ['Zinco', 'Magnésio', 'Ferro']
  },

  // Bebidas
  {
    id: 'f39',
    nome: 'Café Preto (sem açúcar)',
    nomeEn: 'Black Coffee (unsweetened)',
    calorias: 2,
    proteinas: 0.1,
    carboidratos: 0,
    gorduras: 0,
    fibras: 0,
    categoria: 'bebidas',
    vitaminas: ['Riboflavina', 'Niacina'],
    minerais: ['Potássio', 'Magnésio', 'Sódio']
  },
  {
    id: 'f40',
    nome: 'Chá Verde Infusão',
    nomeEn: 'Green Tea Brew',
    calorias: 1,
    proteinas: 0,
    carboidratos: 0.2,
    gorduras: 0,
    fibras: 0,
    categoria: 'bebidas',
    vitaminas: ['Vitamina C', 'Complexo B'],
    minerais: ['Flúor', 'Potássio', 'Zinco', 'Manganês']
  },
  {
    id: 'f41',
    nome: 'Água Mineral de Copo',
    nomeEn: 'Mineral Water',
    calorias: 0,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
    fibras: 0,
    categoria: 'bebidas',
    vitaminas: [],
    minerais: ['Cálcio', 'Magnésio', 'Sódio', 'Potássio', 'Bicarbonato']
  }
];
