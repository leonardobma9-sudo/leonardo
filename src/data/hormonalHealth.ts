export interface EducationalArticle {
  id: string;
  titulo: string;
  tituloEn: string;
  resumo: string;
  resumoEn: string;
  conteudo: string[];
  conteudoEn: string[];
  alimentosRecomendados: {
    nome: string;
    nomeEn: string;
    nutriente: string;
    nutrienteEn: string;
    porcao: string;
    porcaoEn: string;
  }[];
}

export const warningNoticePt = "Uma alimentação equilibrada, treinamento de força, sono adequado e hábitos saudáveis contribuem para a manutenção da saúde hormonal. O aplicativo não realiza diagnóstico nem promete aumentar os níveis de testosterona.";
export const warningNoticeEn = "A balanced diet, strength training, adequate sleep, and healthy habits contribute to the maintenance of hormonal health. This application does not diagnose or guarantee increased testosterone levels.";

export const hormonalArticles: EducationalArticle[] = [
  {
    id: 'h1',
    titulo: 'O Impacto Científico do Sono nos Hormônios Anabólicos',
    tituloEn: 'The Scientific Impact of Sleep on Anabolic Hormones',
    resumo: 'Descubra como o repouso profundo atua como catalisador biológico para a regeneração muscular e regulação hormonal.',
    resumoEn: 'Discover how deep rest acts as a biological catalyst for muscular recovery and hormonal balance.',
    conteudo: [
      'Estudos clínicos demonstram que mais de 85% do hormônio de crescimento (GH) humano é secretado durante ciclos de sono de ondas lentas (N3).',
      'A privação de sono aumenta drasticamente a liberação de cortisol (o hormônio do estresse), que atua de forma catabólica, destruindo fibras de tecido muscular e favorecendo o acúmulo de gordura visceral.',
      'Dormir menos de 7 horas por noite reduz a síntese de testosterona em homens e mulheres saudáveis em até 15% no dia seguinte, afetando diretamente a síntese protéica e o rendimento físico no treino.',
      'Estabelecer um ciclo circadiano saudável e manter horários consistentes de sono é um dos pilares mais econômicos e eficientes para otimizar os seus resultados anabólicos.'
    ],
    conteudoEn: [
      'Clinical studies show that over 85% of human growth hormone (GH) is secreted during deep slow-wave sleep (N3 phase).',
      'Sleep deprivation significantly raises cortisol (the stress hormone), which acts catabolically, breaking down muscular tissue and promoting visceral fat storage.',
      'Sleeping less than 7 hours per night reduces testosterone synthesis in healthy adults by up to 15% the next day, directly affecting protein synthesis and physical training capacity.',
      'Establishing a healthy circadian cycle and keeping consistent sleeping patterns is one of the most cost-effective and powerful tools to optimize anabolic results.'
    ],
    alimentosRecomendados: [
      { nome: 'Banana Prata', nomeEn: 'Banana', nutriente: 'Vitamina B6, Magnésio, Potássio', nutrienteEn: 'Vitamin B6, Magnesium, Potassium', porcao: '1 unidade antes de dormir', porcaoEn: '1 unit before bed' },
      { nome: 'Amêndoas', nomeEn: 'Almonds', nutriente: 'Magnésio, Triptofano, Gordura Saudável', nutrienteEn: 'Magnesium, Tryptophan, Healthy Fat', porcao: '30g', porcaoEn: '30g' },
      { nome: 'Chá de Camomila', nomeEn: 'Chamomile Tea', nutriente: 'Apigenina (indutor de sono)', nutrienteEn: 'Apigenin (sleep inducer)', porcao: '200ml infusão morna', porcaoEn: '200ml warm brew' }
    ]
  },
  {
    id: 'h2',
    titulo: 'Gorduras Saudáveis e a Estrutura da Testosterona',
    tituloEn: 'Healthy Fats and Testosterone Synthesis Structure',
    resumo: 'Por que dietas extremamente restritas em gordura sabotam os seus níveis hormonais e diminuem a força.',
    resumoEn: 'Why extremely low-fat diets sabotage your hormone levels and reduce physical strength.',
    conteudo: [
      'O colesterol e os lipídios saturados e monoinsaturados servem como base química direta para a síntese de todos os hormônios esteróides, incluindo a testosterona.',
      'Dietas em que as gorduras correspondem a menos de 20% das calorias diárias causam reduções clinicamente significativas na concentração de testosterona circulante em atletas.',
      'Fontes saudáveis de lipídios como o abacate, gema de ovo inteiro, carne bovina magra e azeite de oliva extra virgem contêm fitoesteróis e ácidos graxos essenciais que lubrificam as articulações e dão suporte à integridade das membranas celulares.',
      'Consumir a quantidade de gorduras prescrita nos seus cálculos diários é essencial para manter a densidade androgênica e a performance de força muscular.'
    ],
    conteudoEn: [
      'Cholesterol and saturated/monounsaturated lipids serve as the direct raw material for the biological synthesis of steroid hormones like testosterone.',
      'Diets where fats constitute less than 20% of total daily calories trigger clinically significant reductions in circulating testosterone in training athletes.',
      'Healthy lipid sources such as avocado, whole egg yolks, lean beef, and extra virgin olive oil contain key fatty acids and phytosterols that lubricate joints and support cellular membrane stability.',
      'Meeting your calculated daily fat targets is paramount for keeping healthy androgenic levels and muscular strength output.'
    ],
    alimentosRecomendados: [
      { nome: 'Abacate', nomeEn: 'Avocado', nutriente: 'Ácido oleico (Monoinsaturado) e Beta-sitosterol', nutrienteEn: 'Oleic acid (Monounsaturated) & Beta-sitosterol', porcao: '100g no lanche da tarde', porcaoEn: '100g as afternoon snack' },
      { nome: 'Ovo Inteiro Cozido', nomeEn: 'Boiled Egg', nutriente: 'Lecitina, Colesterol Bom e Zinco', nutrienteEn: 'Lecithin, Good Cholesterol & Zinc', porcao: '2 a 3 unidades ao dia', porcaoEn: '2 to 3 units daily' },
      { nome: 'Azeite de Oliva Extra Virgem', nomeEn: 'Extra Virgin Olive Oil', nutriente: 'Polifenóis, Vitamina E e Gordura Saudável', nutrienteEn: 'Polyphenols, Vitamin E & Healthy Fat', porcao: '15ml (1 colher de sopa)', porcaoEn: '15ml (1 tablespoon)' }
    ]
  },
  {
    id: 'h3',
    titulo: 'Micronutrientes Chave para a Performance de Força',
    tituloEn: 'Key Micronutrients for Strength and Endurance Performance',
    resumo: 'Zinco, Magnésio e Vitamina D: O trio de suporte biológico mais recomendado pela literatura médica.',
    resumoEn: 'Zinc, Magnesium, and Vitamin D: The biological support trio most recommended by medical literature.',
    conteudo: [
      'O Zinco atua diretamente como cofator em mais de 300 enzimas celulares e é essencial para o correto funcionamento dos receptores androgênicos. Sua deficiência extrema leva à atrofia testicular e supressão metabólica.',
      'O Magnésio melhora a biodisponibilidade da testosterona livre no sangue ao se ligar à SHBG (globulina de ligação a hormônios sexuais), deixando mais hormônio ativo livre para interagir com os músculos.',
      'A Vitamina D se comporta biologicamente como um pré-hormônio e possui receptores espalhados por todo o tecido muscular e testículos. A sua suficiência está diretamente associada com maiores taxas de hipertrofia e menor fadiga crônica.',
      'Alimentos de origem marinha, sementes e exposição sensata à luz solar garantem a ingestão adequada desses micronutrientes preciosos para atletas.'
    ],
    conteudoEn: [
      'Zinc acts directly as a cofactor in over 300 cellular enzymatic reactions and is crucial for androgen receptor sensitivity. Severe deficiency suppresses standard metabolism.',
      'Magnesium improves the bioavailability of free testosterone in blood by binding to SHBG (sex hormone-binding globulin), allowing more active hormone to stimulate muscle tissue.',
      'Vitamin D functions biologically as a pre-hormone with receptors distributed throughout muscular tissue and endocrine centers. Its balance is directly tied to higher muscle growth and reduced chronic fatigue.',
      'Marine foods, seeds, and reasonable sun exposure ensure sufficient levels of these vital micronutrients for athletes.'
    ],
    alimentosRecomendados: [
      { nome: 'Sementes de Abóbora', nomeEn: 'Pumpkin Seeds', nutriente: 'Zinco e Magnésio altamente biodisponíveis', nutrienteEn: 'Highly bioavailable Zinc and Magnesium', porcao: '20g sobre as refeições', porcaoEn: '20g sprinkled on meals' },
      { nome: 'Filé de Salmão / Sardinha', nomeEn: 'Salmon / Sardines', nutriente: 'Vitamina D3 natural e Ômega 3 (EPA/DHA)', nutrienteEn: 'Natural Vitamin D3 and Omega-3 (EPA/DHA)', porcao: '150g duas vezes na semana', porcaoEn: '150g twice a week' },
      { nome: 'Castanha do Pará', nomeEn: 'Brazil Nut', nutriente: 'Selênio (poderoso antioxidante celular)', nutrienteEn: 'Selenium (powerful cellular antioxidant)', porcao: '1 a 2 unidades por dia', porcaoEn: '1 to 2 units per day' }
    ]
  }
];
