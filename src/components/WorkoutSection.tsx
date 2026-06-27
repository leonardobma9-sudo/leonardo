import React, { useState, useEffect } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { Workout, Exercise, UserProfile } from '../types';
import { defaultWorkouts } from '../data/defaultWorkouts';
import { Dumbbell, Play, CheckCircle, Timer, Award, AlertCircle, RefreshCw, Zap } from 'lucide-react';

interface WorkoutSectionProps {
  currentWorkout: Workout;
  onWorkoutComplete: (workoutId: string) => void;
  user: UserProfile;
}

function calculatePersonalizedCarga(nome: string, peso: number, sexo: 'M' | 'F' | 'Outro', nivel: 'iniciante' | 'intermediario' | 'avancado', lang: string): string {
  const isMale = sexo === 'M';
  const lowercaseNome = nome.toLowerCase();
  
  // Ajuste multiplicador de nível (Atletas avançados treinam mais pesado, iniciantes com carga adaptativa)
  let levelMultiplier = 1.0;
  if (nivel === 'iniciante') levelMultiplier = 0.7;
  if (nivel === 'avancado') levelMultiplier = 1.35;

  let valor = 10;

  // Classificação biomecânica baseada em peso corporal
  if (lowercaseNome.includes('elevação pélvica') || lowercaseNome.includes('hip thrust')) {
    const factor = isMale ? 0.75 : 0.85; // Mulheres têm alto desempenho e recrutamento de glúteos neste exercício
    valor = Math.round((peso * factor * levelMultiplier) / 5) * 5;
    return `${valor} kg`;
  }
  
  if (lowercaseNome.includes('agachamento livre')) {
    const factor = isMale ? 0.7 : 0.5;
    valor = Math.round((peso * factor * levelMultiplier) / 5) * 5;
    return `${valor} kg`;
  }

  if (lowercaseNome.includes('leg press')) {
    const factor = isMale ? 1.6 : 1.2;
    valor = Math.round((peso * factor * levelMultiplier) / 10) * 10;
    return `${valor} kg`;
  }

  if (lowercaseNome.includes('supino reto') || lowercaseNome.includes('supino barra')) {
    const factor = isMale ? 0.6 : 0.25;
    valor = Math.round((peso * factor * levelMultiplier) / 2) * 2;
    return `${valor} kg`;
  }

  if (lowercaseNome.includes('supino com halteres') || lowercaseNome.includes('supino inclinado')) {
    const factor = isMale ? 0.26 : 0.14;
    valor = Math.round((peso * factor * levelMultiplier) / 2) * 2;
    return `${valor} kg ${lang === 'en' ? '(each side)' : '(cada lado)'}`;
  }

  if (lowercaseNome.includes('desenvolvimento')) {
    const factor = isMale ? 0.18 : 0.10;
    valor = Math.round((peso * factor * levelMultiplier) / 2) * 2;
    return `${valor} kg ${lang === 'en' ? '(each side)' : '(cada lado)'}`;
  }

  if (lowercaseNome.includes('remada') || lowercaseNome.includes('puxada') || lowercaseNome.includes('pulldown') || lowercaseNome.includes('pulley')) {
    const factor = isMale ? 0.5 : 0.35;
    valor = Math.round((peso * factor * levelMultiplier) / 5) * 5;
    return `${valor} kg`;
  }

  if (lowercaseNome.includes('remada unilateral') || lowercaseNome.includes('serrote')) {
    const factor = isMale ? 0.25 : 0.15;
    valor = Math.round((peso * factor * levelMultiplier) / 2) * 2;
    return `${valor} kg`;
  }

  if (lowercaseNome.includes('cadeira extensora') || lowercaseNome.includes('mesa flexora') || lowercaseNome.includes('cadeira flexora')) {
    const factor = isMale ? 0.45 : 0.35;
    valor = Math.round((peso * factor * levelMultiplier) / 5) * 5;
    return `${valor} kg`;
  }

  if (lowercaseNome.includes('cadeira abdutora') || lowercaseNome.includes('cadeira adutora')) {
    const factor = isMale ? 0.4 : 0.55; 
    valor = Math.round((peso * factor * levelMultiplier) / 5) * 5;
    return `${valor} kg`;
  }

  if (lowercaseNome.includes('rosca') || lowercaseNome.includes('tríceps') || lowercaseNome.includes('testa') || lowercaseNome.includes('francês')) {
    const factor = isMale ? 0.15 : 0.08;
    valor = Math.round((peso * factor * levelMultiplier) / 2) * 2;
    return `${valor} kg`;
  }

  if (lowercaseNome.includes('elevação lateral') || lowercaseNome.includes('crucifixo')) {
    const factor = isMale ? 0.10 : 0.06;
    valor = Math.max(2, Math.round((peso * factor * levelMultiplier) / 2) * 2);
    return `${valor} kg ${lang === 'en' ? '(each side)' : '(cada lado)'}`;
  }

  if (lowercaseNome.includes('panturrilha')) {
    const factor = isMale ? 0.45 : 0.35;
    valor = Math.round((peso * factor * levelMultiplier) / 5) * 5;
    return `${valor} kg`;
  }

  if (lowercaseNome.includes('abdominal') || lowercaseNome.includes('prancha') || lowercaseNome.includes('barra fixa') || lowercaseNome.includes('paralelas') || lowercaseNome.includes('flexão')) {
    return lang === 'en' ? 'Bodyweight' : 'Peso corporal';
  }

  // Fallback baseado no perfil do usuário
  const defaultFactor = isMale ? 0.35 : 0.22;
  valor = Math.round((peso * defaultFactor * levelMultiplier) / 2) * 2;
  return `${valor} kg`;
}

function getTranslatedWorkout(w: Workout, lang: string, isMale: boolean): { titulo: string; descricao: string; categoria: string; objetivo: string } {
  if (lang === 'pt') {
    return {
      titulo: w.titulo,
      descricao: w.descricao,
      categoria: w.categoria,
      objetivo: w.objetivo || ''
    };
  }

  // English translations map
  const workoutTranslations: Record<string, { titulo: string; descricao: string; categoria: string; objetivo: string }> = {
    'ppl-a': {
      titulo: isMale ? 'Push - Chest & Shoulders Focus' : 'Push & Shoulders (Female Focus)',
      descricao: isMale ? 'Push-focused workout, prioritizing chest, shoulders, and triceps.' : 'Chest, deltoids, and triceps strengthening and toning.',
      categoria: 'Push Pull Legs',
      objetivo: 'Muscle hypertrophy and strength'
    },
    'ppl-b': {
      titulo: isMale ? 'Pull - Back & Biceps Focus' : 'Pull & Back (Posture Focus)',
      descricao: isMale ? 'Pull-focused workout, targeting back, traps, rear delts, and biceps.' : 'Pulling exercises for back, lats strengthening, and postural correction.',
      categoria: 'Push Pull Legs',
      objetivo: 'Back density and strong biceps'
    },
    'ppl-c': {
      titulo: isMale ? 'Legs Day (Strength & Hypertrophy)' : 'Legs & Glutes (Female Premium Focus)',
      descricao: isMale ? 'Heavy leg day targeting quadriceps, hamstrings, and thick calves.' : 'Special lower body routine optimized for toning glutes and quadriceps.',
      categoria: 'Push Pull Legs',
      objetivo: 'Lower body development'
    },
    'iniciante-full': {
      titulo: 'Beginner Full Body',
      descricao: 'Great for beginners, training the entire body in a single session.',
      categoria: 'Full Body',
      objetivo: 'General muscle adaptation'
    },
    'avancado-upper': {
      titulo: 'Advanced Upper Body',
      descricao: 'High density workout focused exclusively on the upper body.',
      categoria: 'Upper Lower',
      objetivo: 'Maximum upper body intensity'
    }
  };

  return workoutTranslations[w.id] || {
    titulo: w.titulo,
    descricao: w.descricao,
    categoria: w.categoria,
    objetivo: w.objetivo || ''
  };
}

function getTranslatedExerciseName(nome: string, lang: string): string {
  if (lang === 'pt') return nome;

  const dictionary: Record<string, string> = {
    'Elevação Pélvica com Barra (Hip Thrust)': 'Barbell Hip Thrust',
    'Agachamento Livre (Foco Glúteos/Coxas)': 'Barbell Squat (Glutes/Thighs Focus)',
    'Cadeira Abdutora (Tronco Inclinado)': 'Seated Hip Abductor (Leaning Forward)',
    'Mesa Flexora (Isquiotibiais)': 'Lying Leg Curl (Hamstrings)',
    'Glúteo na Polia (Glute Kickback)': 'Cable Glute Kickback',
    'Supino com Halteres (Foco Firmeza)': 'Dumbbell Bench Press (Firmness Focus)',
    'Desenvolvimento com Halteres': 'Dumbbell Shoulder Press',
    'Remada Unilateral com Haltere': 'One-Arm Dumbbell Row',
    'Supino Reto com Barra': 'Barbell Bench Press',
    'Supino Inclinado com Halteres': 'Incline Dumbbell Press',
    'Desenvolvimento Militar com Barra': 'Barbell Military Press',
    'Elevação Lateral na Polia': 'Cable Lateral Raise',
    'Tríceps Corda na Polia': 'Triceps Rope Pushdown',
    'Tríceps Testa': 'Lying Triceps Extension (Skull Crusher)',
    'Puxada Alta na Polia (Pulldown)': 'Lat Pulldown',
    'Remada Curvada com Barra': 'Barbell Bent-Over Row',
    'Remada Baixa Unilateral': 'One-Arm Low Row',
    'Crucifixo Invertido com Halteres': 'Reverse Dumbbell Fly',
    'Rosca Direta com Barra W': 'EZ-Bar Bicep Curl',
    'Rosca Martelo Unilateral': 'Single-Arm Hammer Curl',
    'Agachamento Livre com Barra': 'Barbell Back Squat',
    'Leg Press 45': 'Leg Press 45',
    'Cadeira Extensora': 'Leg Extension',
    'Mesa Flexora': 'Lying Leg Curl',
    'Gêmeos em Pé (Panturrilha)': 'Standing Calf Raise',
    'Agachamento com Halteres': 'Dumbbell Squat',
    'Supino Reto com Halteres': 'Flat Dumbbell Bench Press',
    'Puxada Aberta no Pulley': 'Wide-Grip Pulldown',
    'Rosca Direta na Polia': 'Cable Bicep Curl',
    'Prancha Abdominal': 'Abdominal Plank',
    'Barra Fixa com Peso': 'Weighted Pull-Up',
    'Supino Inclinado com Barra': 'Incline Barbell Bench Press',
    'Remada Cavalinho Curvada': 'Bent-Over T-Bar Row',
    'Paralelas com Carga': 'Weighted Chest Dips',
    'Desenvolvimento Dumbbell Sentado': 'Seated Dumbbell Shoulder Press',
    'Supersérie: Rosca Alternada & Tríceps Testa': 'Superset: Alternating Curl & Skull Crusher'
  };

  // Check exact matches or partial matches
  if (dictionary[nome]) return dictionary[nome];
  
  for (const [key, val] of Object.entries(dictionary)) {
    if (nome.toLowerCase().includes(key.toLowerCase())) {
      return val;
    }
  }

  return nome;
}

export default function WorkoutSection({ currentWorkout, onWorkoutComplete, user }: WorkoutSectionProps) {
  const { t: trans, language: lang } = useLanguageTheme();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // Timer States
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const isMale = user.sexo === 'M';
    
    // Dynamically customize workouts based on user gender
    const tailoredWorkoutsBeforeCarga = defaultWorkouts.map(w => {
      let nextExercises = [...w.exercicios];
      
      if (!isMale) {
        // Customize Leg workout with Hip Thrusts & Glute Focus for Females
        if (w.id === 'ppl-c') {
          nextExercises = [
            { id: 'e-ht', nome: 'Elevação Pélvica com Barra (Hip Thrust)', series: 4, repeticoes: '12-15', carga: '40kg', descanso: '90s' },
            { id: 'e13', nome: 'Agachamento Livre (Foco Glúteos/Coxas)', series: 4, repeticoes: '10-12', carga: '40kg', descanso: '90s' },
            { id: 'e-ab', nome: 'Cadeira Abdutora (Tronco Inclinado)', series: 4, repeticoes: '15-20', carga: '35kg', descanso: '60s' },
            { id: 'e16', nome: 'Mesa Flexora (Isquiotibiais)', series: 4, repeticoes: '12', carga: '25kg', descanso: '60s' },
            { id: 'e-cb', nome: 'Glúteo na Polia (Glute Kickback)', series: 3, repeticoes: '12-15', carga: '15kg', descanso: '60s' }
          ];
          return {
            ...w,
            titulo: 'Pernas & Glúteos (Foco Feminino Premium)',
            descricao: 'Treino especial de membros inferiores, otimizado para tonificação de glúteos e quadríceps.',
            exercicios: nextExercises
          };
        }
        
        // Adjust push workouts for females (higher reps, moderate weight)
        if (w.id === 'ppl-a') {
          nextExercises = w.exercicios.map(e => {
            if (e.id === 'e1') return { ...e, nome: 'Supino com Halteres (Foco Firmeza)', repeticoes: '12-15', carga: '10kg' };
            if (e.id === 'e3') return { ...e, nome: 'Desenvolvimento com Halteres', repeticoes: '12-15', carga: '6kg' };
            return { ...e, repeticoes: '12-15', carga: 'leve/moderada' };
          }).slice(0, 5);
          return {
            ...w,
            titulo: 'Push & Ombros (Foco Feminino)',
            descricao: 'Fortalecimento e tonificação de peitoral superior, deltoides e tríceps.',
            exercicios: nextExercises
          };
        }
        
        if (w.id === 'ppl-b') {
          nextExercises = w.exercicios.map(e => {
            if (e.id === 'e8') return { ...e, nome: 'Remada Unilateral com Haltere', repeticoes: '12-15', carga: '10kg' };
            return { ...e, repeticoes: '12-15', carga: 'leve/moderada' };
          });
          return {
            ...w,
            titulo: 'Pull & Costas (Foco Postura)',
            descricao: 'Trabalho de puxada para fortalecimento lombar, dorsal e correção postural.',
            exercicios: nextExercises
          };
        }
      } else {
        // Male default descriptions customization
        if (w.id === 'ppl-c') {
          return {
            ...w,
            titulo: 'Legs Day (Força & Hipertrofia)',
            descricao: 'Treino pesado focado no desenvolvimento de quadríceps, posterior e panturrilhas espessas.'
          };
        }
      }
      return w;
    });

    // Apply the highly personalized load calculation on top of the workouts
    const tailoredWorkouts = tailoredWorkoutsBeforeCarga.map(w => ({
      ...w,
      exercicios: w.exercicios.map(e => ({
        ...e,
        carga: calculatePersonalizedCarga(e.nome, user.peso || 75, user.sexo || 'M', user.nivel || 'intermediario', lang)
      }))
    }));

    setWorkouts(tailoredWorkouts);

    // Set selected workout based on current active workout adjusted
    const foundTailored = tailoredWorkouts.find(w => w.id === (selectedWorkout?.id || currentWorkout.id)) || tailoredWorkouts[0];
    setSelectedWorkout(foundTailored);
    setExercises(prev => {
      return foundTailored.exercicios.map(e => {
        const existing = prev.find(p => p.id === e.id);
        return {
          ...e,
          concluido: existing ? existing.concluido : false
        };
      });
    });
  }, [currentWorkout, user.sexo, user.peso, user.nivel, lang]);

  // Handle rest timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const handleSelectWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setExercises(workout.exercicios.map(e => ({ ...e, concluido: false })));
  };

  const handleToggleExercise = (exerciseId: string) => {
    setExercises(prev => prev.map(e => {
      if (e.id === exerciseId) {
        const nextState = !e.concluido;
        if (nextState) {
          // Trigger a rest timer of 90 seconds
          setTimerSeconds(90);
          setTimerActive(true);
        }
        return { ...e, concluido: nextState };
      }
      return e;
    }));
  };

  const handleCompleteWorkout = () => {
    if (!selectedWorkout) return;
    onWorkoutComplete(selectedWorkout.id);
    alert(lang === 'pt' ? 'Treino Concluído! Você ganhou +150 XP!' : 'Workout Completed! You earned +150 XP!');
  };

  const activeWorkout = selectedWorkout || currentWorkout;

  return (
    <div id="workouts-tab" className="space-y-6 text-slate-900 dark:text-slate-100">
      <header className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Dumbbell className="w-6 h-6 md:w-8 md:h-8 text-slate-900 dark:text-white" />
          {trans('workouts.title')}
        </h2>
        <p className="text-sm opacity-60 font-medium text-slate-500 dark:text-slate-400">{trans('workouts.intro')}</p>
      </header>

      {/* Cargas Personalizadas Alert Banner */}
      <div className="p-4 bg-blue-50/60 dark:bg-blue-500/5 border border-blue-200/50 dark:border-blue-400/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {lang === 'pt' ? 'Cargas Inteligentes Ativas' : 'Smart Loads Active'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'pt' 
                ? `Todas as cargas foram calibradas cientificamente com base no seu peso de ${user.peso} kg, sexo ${user.sexo === 'M' ? 'Masculino' : 'Feminino'} e nível ${user.nivel === 'avancado' ? 'Avançado' : user.nivel === 'intermediario' ? 'Intermediário' : 'Iniciante'}.`
                : `All training loads were scientifically calculated based on your weight of ${user.peso} kg, ${user.sexo === 'M' ? 'Male' : 'Female'} gender, and ${user.nivel === 'avancado' ? 'Advanced' : user.nivel === 'intermediario' ? 'Intermediate' : 'Beginner'} level.`}
            </p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25 rounded-md">
          {lang === 'pt' ? 'Ajustado' : 'Calibrated'}
        </span>
      </div>

      {/* Grid of Workouts and Active Workout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workouts Library */}
        <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-5 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Periodizações Disponíveis</h3>
          
          <div className="space-y-2">
            {workouts.map((w) => (
              <div
                key={w.id}
                onClick={() => handleSelectWorkout(w)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeWorkout.id === w.id
                    ? 'bg-blue-600 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    activeWorkout.id === w.id
                      ? 'bg-white/20 dark:bg-slate-900/10 text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                  }`}>
                    {w.categoria}
                  </span>
                  <span className="text-[10px] opacity-60">⏱ {w.tempoEstimado} min</span>
                </div>
                <h4 className="font-bold mt-2 text-sm">{w.titulo}</h4>
                <p className="text-xs opacity-75 mt-1 line-clamp-1">{w.descricao}</p>
                <div className="mt-2 text-[9px] font-semibold opacity-60 uppercase tracking-wider">
                  <span>Nível: {w.nivel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Workout Screen / Exercise Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-white/5">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{activeWorkout.titulo}</h3>
                <p className="text-xs md:text-sm opacity-60 font-medium text-slate-500 dark:text-slate-400 mt-1">{activeWorkout.descricao}</p>
              </div>

              {/* Countdown Timer Widget */}
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3 self-start sm:self-auto min-w-[150px] justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">DESCANSO</p>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
                <button
                  id="timer-control-btn"
                  onClick={() => {
                    if (timerSeconds === 0) setTimerSeconds(90);
                    setTimerActive(!timerActive);
                  }}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-lg transition-all border border-transparent shadow-sm"
                >
                  {timerActive ? 'Pausar' : 'Iniciar'}
                </button>
              </div>
            </div>

            {/* Exercises Checklist */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{trans('workouts.exercises')}</h4>

              <div className="space-y-2">
                {exercises.map((ex, index) => (
                  <div
                    key={ex.id}
                    onClick={() => handleToggleExercise(ex.id)}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all ${
                      ex.concluido
                        ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200/50 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                        ex.concluido ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {ex.concluido && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <h5 className={`font-bold text-sm ${ex.concluido ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>{ex.nome}</h5>
                        <div className="text-xs opacity-60 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span>{ex.series} séries x {ex.repeticoes}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 font-bold rounded text-[10px]">
                            <Zap className="w-3 h-3 text-blue-500 shrink-0" />
                            <span>Carga: {ex.carga}</span>
                          </span>
                          <span>•</span>
                          <span>Descanso: {ex.descanso}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Complete Workout CTA */}
              <div className="pt-6">
                <button
                  id="complete-workout-btn"
                  onClick={handleCompleteWorkout}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-base rounded-xl md:rounded-2xl shadow-md border border-transparent transition-all"
                >
                  {trans('workouts.completeBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
