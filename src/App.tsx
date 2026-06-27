import React, { useState, useEffect } from 'react';
import { LanguageThemeProvider, useLanguageTheme, LanguageThemeProvider as CustomProvider } from './components/LanguageThemeContext';
import { UserProfile, LoggedMeal, WeeklyEvaluation, HabitLog, Workout, SyncQueueItem } from './types';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import PaywallSalesPage from './components/PaywallSalesPage';
import StripeSimulation from './components/StripeSimulation';
import Dashboard from './components/Dashboard';
import WorkoutSection from './components/WorkoutSection';
import SmartNutritionModule from './components/SmartNutritionModule';
import HabitsSection from './components/HabitsSection';
import EvaluationSection from './components/EvaluationSection';
import EvolutionSection from './components/EvolutionSection';
import ConquestsSection from './components/ConquestsSection';
import ProfileSection from './components/ProfileSection';
import SettingsSection from './components/SettingsSection';
import { defaultWorkouts } from './data/defaultWorkouts';
import { Dumbbell, Flame, Award, Settings, User, Activity, TrendingUp, Scale, Compass, LogOut, Globe, Moon, Sun, Menu, X, Wifi, WifiOff, CloudOff, Cloud, RefreshCw, Loader2 } from 'lucide-react';

function AppContent() {
  const { t, language, theme, setLanguage, setTheme } = useLanguageTheme();

  // Core App States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Stripe & Subscription Integration States
  const [isCheckingSubscription, setIsCheckingSubscription] = useState<boolean>(false);
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState<boolean>(false);
  const [stripeSimMode, setStripeSimMode] = useState<'checkout' | 'portal' | null>(null);
  const [stripeConfig, setStripeConfig] = useState<{ hasRealKeys: boolean; priceAmount: number; priceCurrency: string } | null>(null);

  // Offline & Sync States
  const [realOnline, setRealOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineSimulation, setOfflineSimulation] = useState<boolean>(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('alpha_offline_simulation') === 'true';
    }
    return false;
  });
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('alpha_sync_queue');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number; message: string; messageEn: string } | null>(null);
  const [toastNotification, setToastNotification] = useState<{ message: string; messageEn: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const activeOnline = realOnline && !offlineSimulation;

  const showToast = (msg: string, msgEn: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastNotification({ message: msg, messageEn: msgEn, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Browser offline/online listeners
  useEffect(() => {
    const handleOnline = () => {
      setRealOnline(true);
      showToast('📡 Conexão com a internet restabelecida!', '📡 Internet connection restored!', 'success');
    };
    const handleOffline = () => {
      setRealOnline(false);
      showToast('⚠️ Conexão com a internet perdida. Modo Offline ativo.', '⚠️ Internet connection lost. Offline Mode active.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Trigger auto synchronization when connection transitions to online
  useEffect(() => {
    if (activeOnline && syncQueue.length > 0 && !isSyncing) {
      handleStartSync();
    }
  }, [activeOnline, syncQueue.length]);

  const handleStartSync = async (queueToSync = syncQueue) => {
    if (queueToSync.length === 0 || isSyncing) return;
    setIsSyncing(true);

    // Step through the synchronization items
    for (let i = 0; i < queueToSync.length; i++) {
      const item = queueToSync[i];
      setSyncProgress({
        current: i + 1,
        total: queueToSync.length,
        message: `Sincronizando: ${item.description}...`,
        messageEn: `Syncing: ${item.descriptionEn || item.description}...`
      });
      // Simulate server roundtrip
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setSyncProgress({
      current: queueToSync.length,
      total: queueToSync.length,
      message: 'Sincronização concluída com sucesso!',
      messageEn: 'Synchronization completed successfully!'
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Clear queue
    setSyncQueue([]);
    localStorage.setItem('alpha_sync_queue', JSON.stringify([]));
    setIsSyncing(false);
    setSyncProgress(null);

    showToast(
      '✓ Todos os dados offline foram sincronizados com sucesso!',
      '✓ All offline data has been successfully synchronized!',
      'success'
    );
  };

  const queueSyncAction = (
    type: 'add_meal' | 'remove_meal_item' | 'add_evaluation' | 'update_habits' | 'workout_complete',
    payload: any,
    description: string,
    descriptionEn?: string
  ) => {
    const queueItem: SyncQueueItem = {
      id: Math.random().toString(36).substring(2, 11),
      type,
      payload,
      timestamp: new Date().toISOString(),
      description,
      descriptionEn
    };
    const nextQueue = [...syncQueue, queueItem];
    setSyncQueue(nextQueue);
    localStorage.setItem('alpha_sync_queue', JSON.stringify(nextQueue));

    showToast(
      '💾 Salvo offline! Sincronização automática agendada.',
      '💾 Saved offline! Automatic synchronization scheduled.',
      'info'
    );
  };

  const getMealTypeLabel = (type: string) => {
    switch (type) {
      case 'cafe': return 'Café da Manhã';
      case 'almoco': return 'Almoço';
      case 'lanche': return 'Lanche';
      case 'jantar': return 'Jantar';
      case 'ceia': return 'Ceia';
      default: return type;
    }
  };

  const getMealTypeLabelEn = (type: string) => {
    switch (type) {
      case 'cafe': return 'Breakfast';
      case 'almoco': return 'Lunch';
      case 'lanche': return 'Snack';
      case 'jantar': return 'Dinner';
      case 'ceia': return 'Supper';
      default: return type;
    }
  };

  // App Database states (Sync to localStorage)
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [evaluations, setEvaluations] = useState<WeeklyEvaluation[]>([]);
  const [todayHabits, setTodayHabits] = useState<HabitLog>({
    data: new Date().toISOString().split('T')[0],
    sono: 7,
    agua: 1250,
    humor: 'bom',
    energia: 4,
    estresse: 2,
    treino: false,
    sol: false,
    suplementos: false
  });

  // Load state on mount
  useEffect(() => {
    let loggedUser = localStorage.getItem('alpha_logged_user');
    
    // Automatically connect with leonardo.bma@hotmail.com if no user is logged in
    if (!loggedUser) {
      const defaultUser: UserProfile = {
        nome: 'Leonardo',
        sobrenome: 'BMA',
        sexo: 'M',
        idade: 26,
        peso: 82,
        altura: 180,
        objetivo: 'hipertrofia',
        nivel: 'intermediario',
        email: 'leonardo.bma@hotmail.com',
        diasAtivos: 12,
        xp: 450,
        nivelUsuario: 4,
        isPremium: true,
        theme: 'light',
        language: 'pt',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('alpha_logged_user', JSON.stringify(defaultUser));
      
      // Also register in simulated database
      const storedUsers = localStorage.getItem('alpha_users');
      const users: UserProfile[] = storedUsers ? JSON.parse(storedUsers) : [];
      if (!users.some(u => u.email.toLowerCase() === 'leonardo.bma@hotmail.com')) {
        users.push(defaultUser);
        localStorage.setItem('alpha_users', JSON.stringify(users));
      }
      
      loggedUser = JSON.stringify(defaultUser);
    }

    if (loggedUser) {
      const parsedUser = JSON.parse(loggedUser) as UserProfile;
      setUser(parsedUser);
      setLanguage(parsedUser.language || 'pt');
      if (parsedUser.theme) {
        setTheme(parsedUser.theme);
      } else {
        setTheme('light');
      }
    }

    // Prepopulate physical evaluations with high quality test progress data
    const storedEvals = localStorage.getItem('alpha_evaluations');
    if (storedEvals) {
      setEvaluations(JSON.parse(storedEvals));
    } else {
      const initialEvals: WeeklyEvaluation[] = [
        {
          id: 'ev1',
          data: '2026-05-20',
          peso: 80,
          bracoDireito: 34,
          bracoEsquerdo: 34,
          peito: 98,
          cintura: 85,
          abdomen: 86,
          quadril: 98,
          coxaDireita: 54,
          coxaEsquerda: 54,
          panturrilhaDireita: 35.5,
          panturrilhaEsquerda: 35.5,
          pescoco: 38,
          gorduraPercentual: 16.5,
          massaMagra: 66.8
        },
        {
          id: 'ev2',
          data: '2026-05-27',
          peso: 79.5,
          bracoDireito: 34.2,
          bracoEsquerdo: 34.2,
          peito: 99,
          cintura: 84,
          abdomen: 85,
          quadril: 97,
          coxaDireita: 54.5,
          coxaEsquerda: 54.5,
          panturrilhaDireita: 35.8,
          panturrilhaEsquerda: 35.8,
          pescoco: 38,
          gorduraPercentual: 15.8,
          massaMagra: 66.9
        },
        {
          id: 'ev3',
          data: '2026-06-03',
          peso: 79.8,
          bracoDireito: 34.8,
          bracoEsquerdo: 34.8,
          peito: 100,
          cintura: 83.5,
          abdomen: 84.2,
          quadril: 97,
          coxaDireita: 55,
          coxaEsquerda: 55,
          panturrilhaDireita: 36,
          panturrilhaEsquerda: 36,
          pescoco: 38,
          gorduraPercentual: 15.1,
          massaMagra: 67.7
        },
        {
          id: 'ev4',
          data: '2026-06-10',
          peso: 80.4,
          bracoDireito: 35.3,
          bracoEsquerdo: 35.3,
          peito: 101.5,
          cintura: 82.8,
          abdomen: 83.5,
          quadril: 96.5,
          coxaDireita: 55.5,
          coxaEsquerda: 55.5,
          panturrilhaDireita: 36.4,
          panturrilhaEsquerda: 36.4,
          pescoco: 38,
          gorduraPercentual: 14.5,
          massaMagra: 68.7
        },
        {
          id: 'ev5',
          data: '2026-06-17',
          peso: 81.1,
          bracoDireito: 36,
          bracoEsquerdo: 36,
          peito: 103,
          cintura: 82,
          abdomen: 83,
          quadril: 96,
          coxaDireita: 56,
          coxaEsquerda: 56,
          panturrilhaDireita: 37,
          panturrilhaEsquerda: 37,
          pescoco: 38,
          gorduraPercentual: 13.8,
          massaMagra: 69.9
        }
      ];
      setEvaluations(initialEvals);
      localStorage.setItem('alpha_evaluations', JSON.stringify(initialEvals));
    }

    const storedMeals = localStorage.getItem('alpha_meals');
    if (storedMeals) {
      setLoggedMeals(JSON.parse(storedMeals));
    }

    const storedHabits = localStorage.getItem('alpha_habits');
    if (storedHabits) {
      setTodayHabits(JSON.parse(storedHabits));
    }
  }, []);

  // Retrieve Stripe config on mount
  useEffect(() => {
    fetch('/api/stripe/config')
      .then(res => res.json())
      .then(data => setStripeConfig(data))
      .catch(err => console.error('Error fetching Stripe configuration:', err));
  }, []);

  // Sync / monitor Stripe URL query callbacks
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get('stripe_checkout');
    const email = params.get('email');

    if (checkoutStatus === 'success' && email) {
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Force immediate subscription status re-verification
      setIsCheckingSubscription(true);
      fetch(`/api/subscription/status/${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          setIsCheckingSubscription(false);
          if (data.status === 'ativo') {
            showToast(
              '✓ Assinatura ativa! Bem-vindo ao Projeto Alpha Premium.',
              '✓ Subscription active! Welcome to Projeto Alpha Premium.',
              'success'
            );
            if (user && user.email.toLowerCase().trim() === email.toLowerCase().trim()) {
              handleUpdateProfile({ isPremium: true });
            }
          }
        })
        .catch(() => setIsCheckingSubscription(false));
    } else if (checkoutStatus === 'cancelled') {
      window.history.replaceState({}, document.title, window.location.pathname);
      showToast(
        '⚠️ O pagamento foi cancelado. Tente novamente quando estiver pronto.',
        '⚠️ Payment cancelled. Please try again when you are ready.',
        'warning'
      );
    }
  }, [user?.email]);

  // Periodic and conditional active subscription status check
  useEffect(() => {
    if (!user) return;
    
    // Bypass for special demo preview user
    if (user.email === 'demo@projetoalpha.com') {
      return;
    }

    setIsCheckingSubscription(true);
    fetch(`/api/subscription/status/${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        setIsCheckingSubscription(false);
        const isActive = data.status === 'ativo';
        if (user.isPremium !== isActive) {
          handleUpdateProfile({ isPremium: isActive });
        }
      })
      .catch(err => {
        setIsCheckingSubscription(false);
        console.error('Failed to verify subscription status:', err);
      });
  }, [user?.email]);

  // Initiate Stripe Checkout session
  const handleStartCheckout = async () => {
    if (!user) return;
    setIsRedirectingToStripe(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.simulated) {
        // Fallback to high-fidelity Stripe checkout simulation page
        setStripeSimMode('checkout');
      } else if (data.url) {
        // Redirect to live Stripe Checkout page
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to generate Checkout url');
      }
    } catch (err: any) {
      console.error('Stripe checkout trigger error:', err);
      showToast(
        'Falha ao iniciar o portal do Stripe. Redirecionando para simulação local...',
        'Failed to connect to Stripe. Redirecting to local simulation...',
        'warning'
      );
      setStripeSimMode('checkout');
    } finally {
      setIsRedirectingToStripe(false);
    }
  };

  // Open Stripe Customer Billing Portal
  const handleOpenStripePortal = async () => {
    if (!user) return;
    showToast(
      'Acessando painel seguro do Stripe...',
      'Opening secure Stripe billing portal...',
      'info'
    );
    try {
      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.simulated) {
        setStripeSimMode('portal');
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to generate portal url');
      }
    } catch (err) {
      console.error('Stripe portal opening error:', err);
      setStripeSimMode('portal');
    }
  };

  // Update user profile
  const handleUpdateProfile = (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
    const nextProfile = { ...user, ...updatedFields };
    setUser(nextProfile);
    localStorage.setItem('alpha_logged_user', JSON.stringify(nextProfile));

    // Update global users database
    const storedUsers = localStorage.getItem('alpha_users');
    if (storedUsers) {
      const usersList = JSON.parse(storedUsers) as UserProfile[];
      const nextUsersList = usersList.map(u => u.email === user.email ? { ...u, ...updatedFields } : u);
      localStorage.setItem('alpha_users', JSON.stringify(nextUsersList));
    }
  };

  const handleUpdateSettings = (lang: 'pt' | 'en', nextTheme: 'light' | 'dark') => {
    handleUpdateProfile({ language: lang, theme: nextTheme });
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    handleUpdateProfile({ theme: nextTheme });
  };

  const handleToggleLanguage = () => {
    const nextLang = language === 'pt' ? 'en' : 'pt';
    setLanguage(nextLang);
    handleUpdateProfile({ language: nextLang });
  };

  const handleLogout = () => {
    localStorage.removeItem('alpha_logged_user');
    setUser(null);
    setShowAuth(false);
    setActiveTab('dashboard');
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setUser(profile);
    setShowAuth(false);
    if (profile.diasAtivos === 1) {
      setShowOnboarding(true);
    }
  };

  const handleAddMeal = (nextMeal: LoggedMeal) => {
    const nextMeals = loggedMeals.some(m => m.tipo === nextMeal.tipo)
      ? loggedMeals.map(m => m.tipo === nextMeal.tipo ? nextMeal : m)
      : [...loggedMeals, nextMeal];

    setLoggedMeals(nextMeals);
    localStorage.setItem('alpha_meals', JSON.stringify(nextMeals));

    // Reward XP for healthy meal logging
    if (user) {
      handleUpdateProfile({ xp: Math.min(300, user.xp + 25) });
    }

    if (!activeOnline) {
      const mealName = getMealTypeLabel(nextMeal.tipo);
      const mealNameEn = getMealTypeLabelEn(nextMeal.tipo);
      queueSyncAction(
        'add_meal',
        nextMeal,
        `Refeição registrada (${mealName})`,
        `Logged meal (${mealNameEn})`
      );
    }
  };

  const handleRemoveMealItem = (mealId: string, itemId: string) => {
    const updatedMeals = loggedMeals.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          itens: m.itens.filter(i => i.id !== itemId)
        };
      }
      return m;
    }).filter(m => m.itens.length > 0);

    setLoggedMeals(updatedMeals);
    localStorage.setItem('alpha_meals', JSON.stringify(updatedMeals));

    if (!activeOnline) {
      queueSyncAction(
        'remove_meal_item',
        { mealId, itemId },
        'Removido item da refeição',
        'Removed item from meal'
      );
    }
  };

  const handleAddEvaluation = (nextEval: WeeklyEvaluation) => {
    const updatedEvals = [...evaluations, nextEval];
    setEvaluations(updatedEvals);
    localStorage.setItem('alpha_evaluations', JSON.stringify(updatedEvals));

    // Reward XP
    if (user) {
      handleUpdateProfile({ 
        xp: Math.min(300, user.xp + 80),
        peso: nextEval.peso // Update core user weight to match recent physical evaluation
      });
    }

    if (!activeOnline) {
      queueSyncAction(
        'add_evaluation',
        nextEval,
        `Avaliação física registrada: ${nextEval.peso}kg`,
        `Physical evaluation logged: ${nextEval.peso}kg`
      );
    }
  };

  const handleUpdateHabits = (fields: Partial<HabitLog>, skipQueue = false) => {
    const nextHabits = { ...todayHabits, ...fields };
    setTodayHabits(nextHabits);
    localStorage.setItem('alpha_habits', JSON.stringify(nextHabits));

    // Reward XP for checking positive habits
    if (user) {
      handleUpdateProfile({ xp: Math.min(300, user.xp + 10) });
    }

    if (!activeOnline && !skipQueue) {
      queueSyncAction(
        'update_habits',
        fields,
        `Hábitos diários atualizados`,
        `Daily habits updated`
      );
    }
  };

  const handleWorkoutComplete = (workoutId: string) => {
    // Reward major XP for completing whole workouts
    if (user) {
      let nextXp = user.xp + 150;
      let nextLevel = user.nivelUsuario;
      if (nextXp >= 300) {
        nextXp = nextXp - 300;
        nextLevel += 1;
      }
      handleUpdateProfile({ 
        xp: nextXp, 
        nivelUsuario: nextLevel,
        diasAtivos: user.diasAtivos + 1
      });
    }
    handleUpdateHabits({ treino: true }, true);

    if (!activeOnline) {
      const workoutObj = defaultWorkouts.find(w => w.id === workoutId) || activeWorkout;
      const titlePt = workoutObj?.titulo || 'Treino';
      queueSyncAction(
        'workout_complete',
        { workoutId },
        `Treino concluído: ${titlePt}`,
        `Workout completed: ${titlePt}`
      );
    }
  };

  // Pre-selected workout based on user goals
  const activeWorkout = defaultWorkouts.find(w => w.nivel === user?.nivel) || defaultWorkouts[0];

  // Landing Page callback
  const handleEnterSimulation = () => {
    // Create immediate demo user profile to bypass lock screens instantly
    const demoUser: UserProfile = {
      nome: 'Preview',
      sobrenome: 'Alpha',
      sexo: 'M',
      idade: 23,
      peso: 82,
      altura: 182,
      objetivo: 'hipertrofia',
      nivel: 'intermediario',
      email: 'demo@projetoalpha.com',
      diasAtivos: 10,
      xp: 210,
      nivelUsuario: 3,
      isPremium: true,
      theme: 'light',
      language: 'pt',
      createdAt: new Date().toISOString()
    };
    setUser(demoUser);
  };

  // Determine active view
  if (stripeSimMode) {
    return (
      <StripeSimulation
        mode={stripeSimMode}
        email={user?.email || ''}
        onClose={() => setStripeSimMode(null)}
        onSuccess={(email) => {
          setStripeSimMode(null);
          setIsCheckingSubscription(true);
          fetch(`/api/subscription/status/${encodeURIComponent(email)}`)
            .then(res => res.json())
            .then(data => {
              setIsCheckingSubscription(false);
              if (data.status === 'ativo') {
                handleUpdateProfile({ isPremium: true });
                showToast(
                  '✓ Pagamento confirmado! Acesso premium liberado.',
                  '✓ Payment confirmed! Premium access granted.',
                  'success'
                );
              }
            })
            .catch(() => setIsCheckingSubscription(false));
        }}
      />
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  if (!user) {
    if (showAuth) {
      return (
        <main className="min-h-screen py-10 px-4 flex items-center justify-center">
          <Auth
            initialMode={authMode}
            onAuthSuccess={handleAuthSuccess}
            onCancel={() => setShowAuth(false)}
          />
        </main>
      );
    }
    return (
      <LandingPage
        onStartAuth={(mode) => {
          setAuthMode(mode);
          setShowAuth(true);
        }}
        onEnterSimulation={handleEnterSimulation}
      />
    );
  }

  // Block general dashboard access and redirect to the sales paywall if subscription is inactive
  if (user && !user.isPremium && user.email !== 'demo@projetoalpha.com') {
    return (
      <PaywallSalesPage
        email={user.email}
        onLogout={handleLogout}
        onSubscribe={handleStartCheckout}
        isRedirecting={isRedirectingToStripe}
      />
    );
  }

  // Sidebar / Header Navigation tabs configuration
  const tabs = [
    { id: 'dashboard', label: t('menu.dashboard'), icon: <Compass className="w-5 h-5" /> },
    { id: 'workouts', label: t('menu.workouts'), icon: <Dumbbell className="w-5 h-5" /> },
    { id: 'diet', label: t('menu.diet'), icon: <Flame className="w-5 h-5" /> },
    { id: 'habits', label: t('menu.habits'), icon: <Activity className="w-5 h-5" /> },
    { id: 'evaluations', label: t('menu.evaluations'), icon: <Scale className="w-5 h-5" /> },
    { id: 'evolution', label: t('menu.evolution'), icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'conquests', label: t('menu.conquests'), icon: <Award className="w-5 h-5" /> },
    { id: 'profile', label: t('menu.profile'), icon: <User className="w-5 h-5" /> },
    { id: 'settings', label: t('menu.settings'), icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-[#030712] transition-colors duration-200">
      {/* Mobile Header Navigation */}
      <nav className="lg:hidden border-b border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-[#0A0E1A]/85 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
            <span className="font-extrabold text-white dark:text-slate-900 text-sm">A</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
            Alpha
          </span>
        </div>

        {/* Rapid selectors for language and theme */}
        <div className="flex items-center gap-2">
          <button
            id="mobile-offline-toggle"
            onClick={() => {
              const nextSim = !offlineSimulation;
              setOfflineSimulation(nextSim);
              localStorage.setItem('alpha_offline_simulation', String(nextSim));
              showToast(
                nextSim ? 'Modo offline simulado ativo!' : 'Modo online restabelecido!',
                nextSim ? 'Simulated offline mode active!' : 'Online connection restored!',
                nextSim ? 'warning' : 'success'
              );
            }}
            className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
              !activeOnline 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400 animate-pulse' 
                : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500'
            }`}
            title={language === 'pt' ? 'Simular Modo Offline' : 'Simulate Offline Mode'}
          >
            {!activeOnline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          </button>
          <button
            id="mobile-theme-toggle"
            onClick={handleToggleTheme}
            className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            id="mobile-lang-toggle"
            onClick={handleToggleLanguage}
            className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            {language === 'pt' ? 'EN' : 'PT'}
          </button>
          <button
            id="mobile-logout-btn"
            onClick={handleLogout}
            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col justify-between w-64 border-r border-slate-200/80 dark:border-white/10 p-6 bg-white dark:bg-[#0A0E1A]/50 backdrop-blur-md shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
              <span className="font-extrabold text-white dark:text-slate-900 text-lg">A</span>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-950 dark:text-white block">
                Alpha Premium
              </span>
              <p className="text-[9px] opacity-50 tracking-wider uppercase">Sua evolução agora</p>
            </div>
          </div>

          <div className="space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`sidebar-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-all border ${
                    isActive
                      ? 'bg-blue-600 dark:bg-white/10 text-white dark:text-white border-blue-700 dark:border-white/20 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border-transparent'
                  }`}
                >
                  <span className={`${isActive ? 'text-white dark:text-blue-400' : 'opacity-70 text-slate-400 dark:text-slate-500'}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {/* Connection Status widget */}
          <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                {language === 'pt' ? 'CONECTIVIDADE' : 'CONNECTIVITY'}
              </span>
              <span className={`w-2 h-2 rounded-full ${activeOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!activeOnline ? (
                  <WifiOff className="w-4 h-4 text-amber-500" />
                ) : (
                  <Wifi className="w-4 h-4 text-emerald-500" />
                )}
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {activeOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <button
                id="sidebar-offline-toggle"
                onClick={() => {
                  const nextSim = !offlineSimulation;
                  setOfflineSimulation(nextSim);
                  localStorage.setItem('alpha_offline_simulation', String(nextSim));
                  showToast(
                    nextSim ? 'Modo offline simulado ativo!' : 'Modo online restabelecido!',
                    nextSim ? 'Simulated offline mode active!' : 'Online connection restored!',
                    nextSim ? 'warning' : 'success'
                  );
                }}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                  offlineSimulation
                    ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                    : 'bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border-transparent'
                }`}
              >
                {offlineSimulation 
                  ? (language === 'pt' ? 'Simulado' : 'Simulated') 
                  : (language === 'pt' ? 'Simular' : 'Simulate')}
              </button>
            </div>
            
            {syncQueue.length > 0 && (
              <div className="pt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {language === 'pt' ? `${syncQueue.length} pendentes` : `${syncQueue.length} pending`}
                </span>
                {activeOnline && (
                  <button
                    onClick={() => handleStartSync()}
                    className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
                    Sync
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-semibold px-3 text-slate-500 dark:text-slate-400">
            <button
              id="sidebar-theme-toggle"
              onClick={handleToggleTheme}
              className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              <span>{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
            </button>
            <button
              id="sidebar-lang-toggle"
              onClick={handleToggleLanguage}
              className="font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {language === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
            </button>
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="w-full p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('app.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main View Container */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full pb-24 lg:pb-8">
        {/* Offline Alert Banner */}
        {!activeOnline && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'pt' ? 'Modo Offline Ativo' : 'Offline Mode Active'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'pt' 
                    ? 'Você está visualizando treinos, dietas e logs localmente. Tudo será sincronizado automaticamente quando a conexão for restabelecida.'
                    : 'You are viewing workouts, diets, and logs locally. Everything will be synced automatically when the connection is restored.'}
                </p>
              </div>
            </div>
            
            {syncQueue.length > 0 && (
              <div className="flex items-center gap-2 self-stretch sm:self-auto bg-amber-500/10 dark:bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-400 text-center justify-center">
                <span>{language === 'pt' ? `${syncQueue.length} Ações Aguardando` : `${syncQueue.length} Pending Actions`}</span>
              </div>
            )}
          </div>
        )}

        {/* Synchronization Progress Modal */}
        {isSyncing && syncProgress && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0A0E1A] border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-full space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500/10 dark:bg-white/5 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'pt' ? 'Sincronizando Dados' : 'Synchronizing Data'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {language === 'pt' ? 'Unificando treinos, dietas e avaliações offline com a nuvem...' : 'Merging offline workouts, diets, and evaluations with the cloud...'}
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500">
                  <span>{language === 'pt' ? 'Progresso' : 'Progress'}</span>
                  <span>{Math.round((syncProgress.current / syncProgress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-transparent">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300 rounded-full" 
                    style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {language === 'pt' ? syncProgress.message : syncProgress.messageEn}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Floating Custom Toast notifications */}
        {toastNotification && (
          <div className="fixed bottom-6 right-6 z-[120] max-w-sm w-full bg-white dark:bg-[#0A0E1A] border border-slate-200 dark:border-white/10 p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-fade-in">
            <div className={`p-2 rounded-xl flex-shrink-0 ${
              toastNotification.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-500' 
                : toastNotification.type === 'warning'
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-blue-500/10 text-blue-500'
            }`}>
              {toastNotification.type === 'success' ? (
                <Cloud className="w-5 h-5 animate-pulse" />
              ) : toastNotification.type === 'warning' ? (
                <WifiOff className="w-5 h-5" />
              ) : (
                <CloudOff className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'pt' ? 'Sistema Alpha Premium' : 'Alpha Premium System'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium leading-relaxed">
                {language === 'pt' ? toastNotification.message : toastNotification.messageEn}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            user={user}
            loggedMeals={loggedMeals}
            todayHabits={todayHabits}
            currentWorkout={activeWorkout}
            onNavigate={(tab) => setActiveTab(tab)}
            onUpdateHabits={handleUpdateHabits}
          />
        )}

        {activeTab === 'workouts' && user && (
          <WorkoutSection
            currentWorkout={activeWorkout}
            onWorkoutComplete={handleWorkoutComplete}
            user={user}
          />
        )}

        {activeTab === 'diet' && (
          <SmartNutritionModule
            user={user}
            loggedMeals={loggedMeals}
            todayHabits={todayHabits}
            evaluations={evaluations}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsSection
            habits={todayHabits}
            onUpdate={handleUpdateHabits}
          />
        )}

        {activeTab === 'evaluations' && user && (
          <EvaluationSection
            evaluations={evaluations}
            onAddEvaluation={handleAddEvaluation}
            user={user}
          />
        )}

        {activeTab === 'evolution' && (
          <EvolutionSection
            evaluations={evaluations}
          />
        )}

        {activeTab === 'conquests' && (
          <ConquestsSection
            user={user}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSection
            user={user}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsSection
            user={user}
            onUpdateSettings={handleUpdateSettings}
            onOpenPortal={handleOpenStripePortal}
          />
        )}

        {/* Rapid mobile tabs bar footer */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0A0E1A]/95 border-t border-slate-200 dark:border-white/10 p-2 flex justify-around text-slate-500 dark:text-slate-400 text-[10px] z-40 backdrop-blur-md shadow-lg">
          {tabs.slice(0, 4).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-lg transition-all ${
                  isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'opacity-70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-lg transition-all ${
              isMobileMenuOpen ? 'text-blue-600 dark:text-blue-400 font-bold' : 'opacity-70'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span>{language === 'pt' ? 'Menu' : 'Menu'}</span>
          </button>
        </div>

        {/* Collapsible Mobile Bottom Sheet Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 flex flex-col justify-end" onClick={() => setIsMobileMenuOpen(false)}>
            <div 
              className="bg-white dark:bg-[#0A0E1A] border-t border-slate-200 dark:border-white/10 rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in slide-in-from-bottom duration-250"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Projeto Alpha Premium</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t('app.slogan')}</p>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of all 9 menu tabs */}
              <div className="grid grid-cols-2 gap-2.5">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold border transition-all ${
                        isActive
                          ? 'bg-blue-600 dark:bg-white text-white dark:text-slate-900 border-blue-700 dark:border-white/10 shadow-sm'
                          : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className={isActive ? 'text-white dark:text-blue-500' : 'opacity-70 text-slate-500 dark:text-slate-400'}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Fast Settings Toggle & Logout */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between text-xs font-semibold bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/5">
                  <button
                    id="mobile-drawer-theme-toggle"
                    onClick={handleToggleTheme}
                    className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                    <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
                  </button>
                  <button
                    id="mobile-drawer-lang-toggle"
                    onClick={handleToggleLanguage}
                    className="font-bold text-slate-600 dark:text-slate-300"
                  >
                    {language === 'pt' ? '🇺🇸 Switch to English' : '🇧🇷 Mudar para PT'}
                  </button>
                </div>

                <button
                  id="mobile-drawer-logout-btn"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('app.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageThemeProvider>
      <AppContent />
    </LanguageThemeProvider>
  );
}
