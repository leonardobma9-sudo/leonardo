export interface Recipe {
  id: string;
  nome: string;
  nomeEn: string;
  tempoPreparo: number; // minutes
  filtros: ('ganho_massa' | 'emagrecimento' | 'high_protein' | 'low_carb' | 'economica' | 'vegetariana' | 'recomposicao_corporal')[];
  ingredientes: string[];
  ingredientesEn: string[];
  preparo: string[];
  preparoEn: string[];
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  fibras: number;
}

export const recipesDatabase: Recipe[] = [
  {
    id: 'r1',
    nome: 'Mingau de Aveia Hiperprotéico Anabólico',
    nomeEn: 'Anabolic High-Protein Oatmeal',
    tempoPreparo: 10,
    filtros: ['ganho_massa', 'high_protein', 'economica', 'vegetariana'],
    ingredientes: [
      '60g de Aveia em flocos',
      '30g de Whey Protein concentrado',
      '1 Banana média picada',
      '15g de Pasta de Amendoim integral',
      '250ml de Leite desnatado ou água',
      'Canela em pó a gosto'
    ],
    ingredientesEn: [
      '60g Rolled Oats',
      '30g Whey Protein concentrate',
      '1 Medium sliced Banana',
      '15g Natural Peanut Butter',
      '250ml Skimmed Milk or water',
      'Cinnamon powder to taste'
    ],
    preparo: [
      'Coloque a aveia e o leite (ou água) em uma panela e leve ao fogo médio por 5 minutos, mexendo sempre.',
      'Assim que engrossar, desligue o fogo.',
      'Adicione o Whey Protein e misture vigorosamente para não empedrar.',
      'Sirva em uma tigela, cubra com a banana fatiada, a pasta de amendoim e finalize com canela.'
    ],
    preparoEn: [
      'Place oats and milk (or water) in a small saucepan over medium heat for 5 minutes, stirring constantly.',
      'Once thickened, turn off the heat.',
      'Add Whey Protein and mix vigorously to keep it smooth.',
      'Serve in a bowl, top with sliced banana, peanut butter, and sprinkle cinnamon.'
    ],
    calorias: 520,
    proteinas: 42,
    carboidratos: 62,
    gorduras: 12,
    fibras: 8
  },
  {
    id: 'r2',
    nome: 'Omelete de Claras Fit com Espinafre',
    nomeEn: 'Fit Egg White Omelet with Spinach',
    tempoPreparo: 8,
    filtros: ['emagrecimento', 'high_protein', 'low_carb', 'economica', 'vegetariana'],
    ingredientes: [
      '4 Claras de ovo',
      '1 Ovo inteiro',
      '1 xícara de Espinafre fresco picado',
      '30g de Queijo Cottage',
      'Sal marinho, pimenta-do-reino e orégano a gosto',
      'Fio de azeite de oliva para grelhar'
    ],
    ingredientesEn: [
      '4 Egg Whites',
      '1 Whole Egg',
      '1 cup chopped fresh Spinach',
      '30g Cottage Cheese',
      'Sea salt, black pepper, and oregano to taste',
      'Drizzle of olive oil for grilling'
    ],
    preparo: [
      'Bata as claras e o ovo inteiro em um recipiente com o sal, pimenta e orégano.',
      'Aqueça uma frigideira antiaderente com um fio de azeite e doure ligeiramente o espinafre.',
      'Despeje os ovos batidos sobre o espinafre e cozinhe em fogo baixo com tampa por 3 minutos.',
      'Vire o omelete com cuidado, adicione o queijo cottage no centro e dobre ao meio.',
      'Sirva quente.'
    ],
    preparoEn: [
      'Whisk egg whites and whole egg in a bowl with salt, pepper, and oregano.',
      'Heat a non-stick skillet with a drizzle of olive oil and lightly sauté the spinach.',
      'Pour whisked eggs over spinach and cook covered on low heat for 3 minutes.',
      'Carefully flip the omelet, place cottage cheese in the middle, and fold in half.',
      'Serve hot.'
    ],
    calorias: 195,
    proteinas: 26,
    carboidratos: 2,
    gorduras: 9,
    fibras: 1.5
  },
  {
    id: 'r3',
    nome: 'Bowl de Frango Grelhado, Abóbora e Abacate',
    nomeEn: 'Grilled Chicken, Roasted Pumpkin & Avocado Bowl',
    tempoPreparo: 20,
    filtros: ['emagrecimento', 'low_carb', 'high_protein'],
    ingredientes: [
      '150g de Peito de Frango cozido e desfiado ou grelhado',
      '100g de Abóbora cabotiá assada em cubos',
      '60g de Abacate fresco em fatias',
      'Salada verde à vontade (alface, rúcula e agrião)',
      '1 colher de sopa de Sementes de Abóbora tostadas',
      'Suco de 1/2 limão e 1 colher de chá de Azeite de Oliva'
    ],
    ingredientesEn: [
      '150g cooked shredded or grilled Chicken Breast',
      '100g roasted Kabocha Pumpkin cubes',
      '60g fresh sliced Avocado',
      'Greens salad to taste (lettuce, arugula, watercress)',
      '1 tbsp toasted Pumpkin Seeds',
      'Juice of 1/2 lemon and 1 tsp Extra Virgin Olive Oil'
    ],
    preparo: [
      'Grelhe o peito de frango temperado com alho e sal.',
      'Monte o prato colocando as folhas verdes como base.',
      'Distribua os cubos de abóbora assada, o frango grelhado e as fatias de abacate.',
      'Tempere a salada com o limão, sal e azeite.',
      'Finalize salpicando as sementes de abóbora crocantes por cima (fonte incrível de magnésio e zinco).'
    ],
    preparoEn: [
      'Grill chicken breast seasoned with garlic and salt.',
      'Assemble the bowl using the salad greens as a base.',
      'Arrange roasted pumpkin cubes, grilled chicken, and avocado slices.',
      'Season with lemon juice, salt, and olive oil.',
      'Top with toasted pumpkin seeds (a fantastic source of zinc and magnesium).'
    ],
    calorias: 380,
    proteinas: 38,
    carboidratos: 12,
    gorduras: 18,
    fibras: 6
  },
  {
    id: 'r4',
    nome: 'Panqueca de Whey e Banana Fit',
    nomeEn: 'Fit Whey & Banana Pancake',
    tempoPreparo: 12,
    filtros: ['ganho_massa', 'high_protein', 'vegetariana'],
    ingredientes: [
      '1 Banana prata amassada',
      '1 Ovo inteiro',
      '30g de Aveia em flocos finos',
      '15g de Whey protein (baunilha ou chocolate)',
      'Canela em pó e adoçante opcional'
    ],
    ingredientesEn: [
      '1 Mashed banana',
      '1 Whole egg',
      '30g Fine rolled oats',
      '15g Whey protein (vanilla or chocolate)',
      'Cinnamon powder and optional sweetener'
    ],
    preparo: [
      'Em uma tigela pequena, amasse bem a banana com um garfo.',
      'Adicione o ovo, a aveia, o whey protein e a canela. Misture até obter uma massa homogênea.',
      'Aqueça uma frigideira antiaderente untada com gotas de óleo de coco.',
      'Coloque colheradas da massa, cozinhe em fogo baixo até formar bolhas e vire para dourar o outro lado.',
      'Sirva com morangos frescos por cima.'
    ],
    preparoEn: [
      'In a small bowl, thoroughly mash the banana with a fork.',
      'Add the egg, oats, whey protein, and cinnamon. Mix until a homogeneous batter forms.',
      'Heat a non-stick skillet greased with a few drops of coconut oil.',
      'Pour the batter, cook on low heat until bubbles form, then flip to brown the other side.',
      'Serve topped with fresh strawberries.'
    ],
    calorias: 310,
    proteinas: 22,
    carboidratos: 40,
    gorduras: 7,
    fibras: 5
  },
  {
    id: 'r5',
    nome: 'Arroz de Forno com Patinho Moído e Vegetais',
    nomeEn: 'Baked Rice with Lean Beef & Vegetables',
    tempoPreparo: 25,
    filtros: ['ganho_massa', 'recomposicao_corporal', 'economica'],
    ingredientes: [
      '120g de Arroz integral cozido',
      '150g de Patinho moído refogado',
      '50g de Brócolis cozido picado',
      '50g de Cenoura ralada',
      '1 colher de sopa de Azeite de oliva',
      'Alho, cebola e salsinha fresca picada'
    ],
    ingredientesEn: [
      '120g cooked Brown Rice',
      '150g cooked Lean Ground Beef',
      '50g chopped steamed Broccoli',
      '50g shredded Carrot',
      '1 tbsp Olive Oil',
      'Garlic, onions, and fresh chopped parsley'
    ],
    preparo: [
      'Refogue o patinho moído com alho, cebola e temperos de sua preferência.',
      'Misture o patinho cozido com o arroz integral, o brócolis cozido e a cenoura ralada.',
      'Adicione o azeite de oliva e misture bem.',
      'Leve ao forno em uma travessa pequena por 10 minutos para aquecer e dourar por cima.',
      'Finalize com salsinha fresca.'
    ],
    preparoEn: [
      'Sauté ground beef with garlic, onions, and your choice of spices.',
      'Combine beef with brown rice, chopped broccoli, and shredded carrots.',
      'Drizzle extra virgin olive oil and mix thoroughly.',
      'Bake in a small tray for 10 minutes until heated through and golden.',
      'Garnish with fresh parsley.'
    ],
    calorias: 490,
    proteinas: 40,
    carboidratos: 36,
    gorduras: 16,
    fibras: 5
  },
  {
    id: 'r6',
    nome: 'Salmão Grelhado com Aspargos e Batata Doce',
    nomeEn: 'Grilled Salmon with Asparagus & Sweet Potatoes',
    tempoPreparo: 30,
    filtros: ['recomposicao_corporal', 'low_carb', 'high_protein'],
    ingredientes: [
      '150g de Filé de Salmão fresco',
      '120g de Batata doce em cubos assada',
      '6 ramos de Aspargos frescos',
      'Suco de limão siciliano',
      '1 dente de Alho amassado',
      '1 colher de sopa de Azeite de oliva extra virgem'
    ],
    ingredientesEn: [
      '150g fresh Salmon fillet',
      '120g roasted Sweet Potato cubes',
      '6 fresh Asparagus spears',
      'Juice of organic lemon',
      '1 mashed garlic clove',
      '1 tbsp Extra Virgin Olive Oil'
    ],
    preparo: [
      'Tempere o salmão com sal, alho e suco de limão.',
      'Grelhe o salmão na frigideira com azeite, iniciando com a pele para baixo por 4 minutos, vire e grelhe por mais 3 minutos.',
      'Na mesma frigideira, refogue os aspargos por 3-5 minutos até ficarem macios e crocantes.',
      'Sirva o salmão com os aspargos e os cubos de batata doce assados.'
    ],
    preparoEn: [
      'Season salmon fillet with salt, garlic, and lemon juice.',
      'Sauté salmon in a pan with olive oil, starting skin-side down for 4 minutes, then flip for 3 minutes.',
      'In the same skillet, toss asparagus spears for 3-5 minutes until tender-crisp.',
      'Serve salmon alongside asparagus and roasted sweet potato cubes.'
    ],
    calorias: 460,
    proteinas: 34,
    carboidratos: 28,
    gorduras: 21,
    fibras: 4.5
  },
  {
    id: 'r7',
    nome: 'Strogonoff de Frango Fit Saudável',
    nomeEn: 'Healthy Fit Chicken Stroganoff',
    tempoPreparo: 20,
    filtros: ['recomposicao_corporal', 'high_protein', 'economica'],
    ingredientes: [
      '150g de Peito de Frango em cubos',
      '1 colher de sopa de Azeite de oliva',
      '2 colheres de sopa de Molho de Tomate natural',
      '1 colher de chá de Mostarda dijon ou comum',
      '50g de Champignon fatiado',
      '80g de Iogurte natural desnatado (para substituir o creme de leite)',
      '100g de Arroz branco ou integral cozido'
    ],
    ingredientesEn: [
      '150g diced Chicken Breast',
      '1 tbsp Olive Oil',
      '2 tbsp natural Tomato Sauce',
      '1 tsp Mustard',
      '50g sliced Mushroom (Champignon)',
      '80g Non-fat Plain Yogurt (to replace heavy cream)',
      '100g cooked White or Brown Rice'
    ],
    preparo: [
      'Grelhe o frango em cubos no azeite com alho e sal até dourar por completo.',
      'Adicione os champignons, o molho de tomate e a mostarda. Misture e cozinhe por 3 minutos.',
      'Desligue o fogo para evitar talhar.',
      'Adicione o iogurte desnatado e misture bem até formar um molho cremoso homogêneo.',
      'Sirva com o arroz quente.'
    ],
    preparoEn: [
      'Sauté diced chicken in olive oil with garlic and salt until completely cooked.',
      'Add mushrooms, tomato sauce, and mustard. Stir and cook for 3 minutes.',
      'Turn off the heat to prevent curdling.',
      'Stir in the non-fat yogurt until a creamy and consistent sauce forms.',
      'Serve alongside hot rice.'
    ],
    calorias: 395,
    proteinas: 38,
    carboidratos: 32,
    gorduras: 11,
    fibras: 2
  }
];
