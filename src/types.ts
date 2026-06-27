export type Language = 'pt' | 'en';
export type Theme = 'light' | 'dark';

export interface SmartQuestionnaire {
  sexo: 'M' | 'F' | 'Outro';
  idade: number;
  peso: number;
  altura: number;
  gorduraPercentual: number;
  circunferenciaAbdominal: number;
  nivelAtividade: 'sedentario' | 'moderado' | 'intenso';
  diasTreinoSemana: number;
  horarioTreino: string;
  objetivo: 'ganhar_massa' | 'emagrecer' | 'recomposicao' | 'manter_peso';
  restricoesAlimentares: string[]; // e.g. "vegano", "vegetariano", "lactose", "gluten"
  alergias: string;
  alimentosPreferidos: string;
  alimentosNaoGosta: string;
  orcamento: 'baixo' | 'medio' | 'alto';
  horasSono: number;
  consumoAlcool: 'nunca' | 'socialmente' | 'frequentemente';
  tabagismo: boolean;
  usoSuplementos: string[]; // e.g. "creatina", "whey", etc
  consumoAguaMl: number;
}

export interface Suplemento {
  id: string;
  nome: string;
  dosagem: string;
  horario: string;
  lembreteAtivo: boolean;
  concluidoHoje?: boolean;
}

export interface UserProfile {
  nome: string;
  sobrenome: string;
  sexo: 'M' | 'F' | 'Outro';
  idade: number;
  peso: number;
  altura: number; // in cm
  objetivo: 'hipertrofia' | 'definicao' | 'condicionamento';
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  email: string;
  avatarUrl?: string;
  createdAt: string;
  diasAtivos: number;
  xp: number;
  nivelUsuario: number;
  isPremium: boolean;
  theme: Theme;
  language: Language;
}

export interface Exercise {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
  carga: string;
  descanso: string; // e.g. "60s"
  concluido?: boolean;
}

export interface Workout {
  id: string;
  titulo: string; // e.g. "Treino A - Peito e Tríceps"
  categoria: string; // e.g. "Hipertrofia", "ABC", "Push Pull Legs"
  nivel: 'iniciante' | 'intermediario' | 'avancado' | 'todos';
  objetivo: string;
  tempoEstimado: number; // in minutes
  descricao: string;
  exercicios: Exercise[];
  concluidoHoje?: boolean;
}

export interface Food {
  id: string;
  nome: string;
  nomeEn: string;
  calorias: number; // per 100g
  proteinas: number; // in grams per 100g
  carboidratos: number; // in grams per 100g
  gorduras: number; // in grams per 100g
  fibras: number; // in grams per 100g
  categoria: 'carnes' | 'frango' | 'peixes' | 'ovos' | 'laticinios' | 'cereais' | 'leguminosas' | 'frutas' | 'verduras' | 'legumes' | 'oleaginosas' | 'temperos' | 'bebidas';
  vitaminas?: string[];
  minerais?: string[];
}

export interface LoggedMealItem {
  id: string;
  foodId: string;
  nome: string;
  pesoGrams: number;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

export interface LoggedMeal {
  id: string;
  tipo: 'cafe' | 'almoco' | 'lanche' | 'jantar' | 'ceia';
  horario: string;
  itens: LoggedMealItem[];
}

export interface WeeklyEvaluation {
  id: string;
  data: string; // YYYY-MM-DD
  peso: number;
  bracoDireito: number;
  bracoEsquerdo: number;
  peito: number;
  cintura: number;
  abdomen: number;
  quadril: number;
  coxaDireita: number;
  coxaEsquerda: number;
  panturrilhaDireita: number;
  panturrilhaEsquerda: number;
  pescoco: number;
  gorduraPercentual: number;
  massaMagra: number;
  fotoFrente?: string;
  fotoCostas?: string;
  fotoLateral?: string;
}

export interface HabitLog {
  data: string; // YYYY-MM-DD
  sono: number; // hours
  agua: number; // ml
  humor: 'excelente' | 'bom' | 'regular' | 'cansado' | 'estressado';
  energia: number; // 1 to 5
  estresse: number; // 1 to 5
  treino: boolean;
  sol: boolean;
  suplementos: boolean;
}

export interface Badge {
  id: string;
  tituloPt: string;
  tituloEn: string;
  descricaoPt: string;
  descricaoEn: string;
  icone: string;
  conquistada: boolean;
  dataConquista?: string;
  progresso: number; // 0 to 100
}

export interface StripeTransaction {
  id: string;
  data: string;
  valor: number;
  moeda: string;
  status: 'pago' | 'pendente' | 'cancelado';
  descricao: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'add_meal' | 'remove_meal_item' | 'add_evaluation' | 'update_habits' | 'workout_complete';
  payload: any;
  timestamp: string;
  description: string;
  descriptionEn?: string;
}
