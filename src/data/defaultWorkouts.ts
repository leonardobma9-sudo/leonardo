import { Workout } from '../types';

export const defaultWorkouts: Workout[] = [
  {
    id: 'ppl-a',
    titulo: 'Push (Empurrar) - Foco Peito e Ombros',
    categoria: 'Push Pull Legs',
    nivel: 'intermediario',
    objetivo: 'Hipertrofia muscular e força',
    tempoEstimado: 60,
    descricao: 'Treino focado em empurrar, priorizando peitorais, ombros e tríceps.',
    exercicios: [
      { id: 'e1', nome: 'Supino Reto com Barra', series: 4, repeticoes: '8-10', carga: '60kg', descanso: '90s' },
      { id: 'e2', nome: 'Supino Inclinado com Halteres', series: 4, repeticoes: '10-12', carga: '22kg', descanso: '90s' },
      { id: 'e3', nome: 'Desenvolvimento Militar com Barra', series: 3, repeticoes: '8-10', carga: '30kg', descanso: '90s' },
      { id: 'e4', nome: 'Elevação Lateral na Polia', series: 4, repeticoes: '12-15', carga: '10kg', descanso: '60s' },
      { id: 'e5', nome: 'Tríceps Corda na Polia', series: 4, repeticoes: '10-12', carga: '25kg', descanso: '60s' },
      { id: 'e6', nome: 'Tríceps Testa', series: 3, repeticoes: '10', carga: '20kg', descanso: '60s' }
    ]
  },
  {
    id: 'ppl-b',
    titulo: 'Pull (Puxar) - Foco Costas e Bíceps',
    categoria: 'Push Pull Legs',
    nivel: 'intermediario',
    objetivo: 'Densidade das costas e bíceps fortes',
    tempoEstimado: 55,
    descricao: 'Treino voltado para puxadas, exercitando costas, trapézio, posterior de ombro e bíceps.',
    exercicios: [
      { id: 'e7', nome: 'Puxada Alta na Polia (Pulldown)', series: 4, repeticoes: '10-12', carga: '50kg', descanso: '90s' },
      { id: 'e8', nome: 'Remada Curvada com Barra', series: 4, repeticoes: '8-10', carga: '45kg', descanso: '90s' },
      { id: 'e9', nome: 'Remada Baixa Unilateral', series: 3, repeticoes: '10-12', carga: '20kg', descanso: '60s' },
      { id: 'e10', nome: 'Crucifixo Invertido com Halteres', series: 3, repeticoes: '12-15', carga: '8kg', descanso: '60s' },
      { id: 'e11', nome: 'Rosca Direta com Barra W', series: 4, repeticoes: '10', carga: '24kg', descanso: '60s' },
      { id: 'e12', nome: 'Rosca Martelo Unilateral', series: 3, repeticoes: '12', carga: '12kg', descanso: '60s' }
    ]
  },
  {
    id: 'ppl-c',
    titulo: 'Legs (Pernas Completo)',
    categoria: 'Push Pull Legs',
    nivel: 'intermediario',
    objetivo: 'Desenvolvimento de membros inferiores',
    tempoEstimado: 65,
    descricao: 'Treino de pernas completo com foco em quadríceps, isquiotibiais e panturrilhas.',
    exercicios: [
      { id: 'e13', nome: 'Agachamento Livre com Barra', series: 4, repeticoes: '8-10', carga: '70kg', descanso: '120s' },
      { id: 'e14', nome: 'Leg Press 45', series: 4, repeticoes: '10-12', carga: '160kg', descanso: '90s' },
      { id: 'e15', nome: 'Cadeira Extensora', series: 3, repeticoes: '12-15', carga: '40kg', descanso: '60s' },
      { id: 'e16', nome: 'Mesa Flexora', series: 4, repeticoes: '10-12', carga: '35kg', descanso: '60s' },
      { id: 'e17', nome: 'Gêmeos em Pé (Panturrilha)', series: 4, repeticoes: '15-20', carga: '50kg', descanso: '60s' }
    ]
  },
  {
    id: 'iniciante-full',
    titulo: 'Full Body Iniciante',
    categoria: 'Full Body',
    nivel: 'iniciante',
    objetivo: 'Adaptação muscular geral',
    tempoEstimado: 45,
    descricao: 'Excelente para quem está começando, exercitando o corpo todo na mesma sessão.',
    exercicios: [
      { id: 'e18', nome: 'Agachamento com Halteres', series: 3, repeticoes: '12', carga: '10kg', descanso: '60s' },
      { id: 'e19', nome: 'Supino Reto com Halteres', series: 3, repeticoes: '12', carga: '12kg', descanso: '60s' },
      { id: 'e20', nome: 'Puxada Aberta no Pulley', series: 3, repeticoes: '12', carga: '30kg', descanso: '60s' },
      { id: 'e21', nome: 'Desenvolvimento com Halteres', series: 3, repeticoes: '12', carga: '8kg', descanso: '60s' },
      { id: 'e22', nome: 'Rosca Direta na Polia', series: 3, repeticoes: '12', carga: '15kg', descanso: '60s' },
      { id: 'e23', nome: 'Prancha Abdominal', series: 3, repeticoes: '30s', carga: 'Corpo', descanso: '45s' }
    ]
  },
  {
    id: 'avancado-upper',
    titulo: 'Upper Body Avançado',
    categoria: 'Upper Lower',
    nivel: 'avancado',
    objetivo: 'Máxima intensidade de membros superiores',
    tempoEstimado: 70,
    descricao: 'Alta densidade de treino focada exclusivamente na parte superior do corpo.',
    exercicios: [
      { id: 'e24', nome: 'Barra Fixa com Peso', series: 4, repeticoes: '6-8', carga: '10kg', descanso: '120s' },
      { id: 'e25', nome: 'Supino Inclinado com Barra', series: 4, repeticoes: '6-8', carga: '80kg', descanso: '120s' },
      { id: 'e26', nome: 'Remada Cavalinho Curvada', series: 4, repeticoes: '8-10', carga: '60kg', descanso: '90s' },
      { id: 'e27', nome: 'Paralelas com Carga', series: 3, repeticoes: '8-10', carga: '15kg', descanso: '90s' },
      { id: 'e28', nome: 'Desenvolvimento Dumbbell Sentado', series: 4, repeticoes: '8-10', carga: '26kg', descanso: '90s' },
      { id: 'e29', nome: 'Supersérie: Rosca Alternada & Tríceps Testa', series: 4, repeticoes: '10-12', carga: '16kg', descanso: '75s' }
    ]
  }
];
