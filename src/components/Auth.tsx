import React, { useState } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { UserProfile } from '../types';
import { Shield, Mail, Lock, User, Activity, Scale, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  initialMode: 'login' | 'register';
  onAuthSuccess: (profile: UserProfile) => void;
  onCancel: () => void;
}

export default function Auth({ initialMode, onAuthSuccess, onCancel }: AuthProps) {
  const { t, language } = useLanguageTheme();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Form Fields
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [sexo, setSexo] = useState<'M' | 'F' | 'Outro'>('M');
  const [idade, setIdade] = useState<number>(24);
  const [peso, setPeso] = useState<number>(75);
  const [altura, setAltura] = useState<number>(175);
  const [objetivo, setObjetivo] = useState<'hipertrofia' | 'definicao' | 'condicionamento'>('hipertrofia');
  const [nivel, setNivel] = useState<'iniciante' | 'intermediario' | 'avancado'>('intermediario');
  const [email, setEmail] = useState('leonardo.bma@hotmail.com');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Visual/Feedback States
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !senha) {
      setErrorMsg(t('auth.validation.fields'));
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg(t('auth.validation.email'));
      return;
    }

    // Try finding user in localStorage
    const storedUsers = localStorage.getItem('alpha_users');
    const users: UserProfile[] = storedUsers ? JSON.parse(storedUsers) : [];
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Simulate creating a premium user if none exists for instant testing
      const testUser: UserProfile = {
        nome: 'Athlete',
        sobrenome: 'Alpha',
        sexo: 'M',
        idade: 25,
        peso: 80,
        altura: 180,
        objetivo: 'hipertrofia',
        nivel: 'intermediario',
        email: email,
        diasAtivos: 1,
        xp: 150,
        nivelUsuario: 1,
        isPremium: true,
        theme: 'dark',
        language: 'pt',
        createdAt: new Date().toISOString()
      };
      
      // Save user
      users.push(testUser);
      localStorage.setItem('alpha_users', JSON.stringify(users));
      localStorage.setItem('alpha_logged_user', JSON.stringify(testUser));
      onAuthSuccess(testUser);
    } else {
      localStorage.setItem('alpha_logged_user', JSON.stringify(user));
      onAuthSuccess(user);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!nome || !sobrenome || !email || !senha || !confirmSenha) {
      setErrorMsg(t('auth.validation.fields'));
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg(t('auth.validation.email'));
      return;
    }

    if (senha.length < 6) {
      setErrorMsg(t('auth.validation.password'));
      return;
    }

    if (senha !== confirmSenha) {
      setErrorMsg(t('auth.validation.match'));
      return;
    }

    if (!aceitoTermos) {
      setErrorMsg(t('auth.validation.terms'));
      return;
    }

    // Prepare profile
    const newProfile: UserProfile = {
      nome,
      sobrenome,
      sexo,
      idade: Number(idade),
      peso: Number(peso),
      altura: Number(altura),
      objetivo,
      nivel,
      email: email.toLowerCase(),
      diasAtivos: 1,
      xp: 100, // starting xp
      nivelUsuario: 1,
      isPremium: true, // Auto unlock Premium on registration as Stripe is integrated or simulated
      theme: 'dark',
      language: language,
      createdAt: new Date().toISOString()
    };

    // Save user in simulated db (localStorage)
    const storedUsers = localStorage.getItem('alpha_users');
    const users: UserProfile[] = storedUsers ? JSON.parse(storedUsers) : [];

    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      setErrorMsg(language === 'pt' ? 'Este e-mail já está cadastrado.' : 'This email is already registered.');
      return;
    }

    users.push(newProfile);
    localStorage.setItem('alpha_users', JSON.stringify(users));
    localStorage.setItem('alpha_logged_user', JSON.stringify(newProfile));

    setSuccessMsg(language === 'pt' ? 'Cadastro concluído com sucesso!' : 'Registration completed successfully!');
    setTimeout(() => {
      onAuthSuccess(newProfile);
    }, 1000);
  };

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg(t('auth.validation.email'));
      return;
    }

    setSuccessMsg(language === 'pt' ? 'E-mail de recuperação enviado para ' + email : 'Recovery email sent to ' + email);
    setTimeout(() => {
      setMode('login');
      setSuccessMsg('');
    }, 3000);
  };

  return (
    <div id="auth-panel" className="w-full max-w-lg mx-auto p-6 my-10 bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl dark:shadow-none backdrop-blur-md text-slate-900 dark:text-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
          {mode === 'login' ? t('auth.login.title') : mode === 'register' ? t('auth.register.title') : t('auth.forgot.title')}
        </h2>
        <p className="text-sm opacity-60 mt-2 font-medium">{t('app.slogan')}</p>
      </div>

      {errorMsg && (
        <div id="auth-error-alert" className="p-4 mb-6 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-500 text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div id="auth-success-alert" className="p-4 mb-6 bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 dark:border-green-500/30 rounded-xl text-green-600 dark:text-green-500 text-sm font-semibold">
          {successMsg}
        </div>
      )}

      {/* LOGIN MODE */}
      {mode === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3.5 opacity-40 text-slate-500 dark:text-slate-400" />
              <input
                id="login-email-input"
                type="email"
                required
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 outline-none text-sm transition-colors text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3.5 opacity-40 text-slate-500 dark:text-slate-400" />
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="******"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 outline-none text-sm transition-colors text-slate-900 dark:text-white"
              />
              <button
                type="button"
                id="login-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                id="login-remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 dark:border-white/10 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>{t('auth.keepConnected')}</span>
            </label>
            <button
              type="button"
              id="login-forgot-password"
              onClick={() => setMode('forgot')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t('auth.forgotPass')}
            </button>
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            className="w-full py-4 mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl shadow-sm transition-all border border-transparent hover:-translate-y-0.5 active:translate-y-0"
          >
            {language === 'pt' ? 'ENTRAR AGORA' : 'SIGN IN NOW'}
          </button>
        </form>
      )}

      {/* REGISTER MODE */}
      {mode === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.firstName')}</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3.5 opacity-40 text-slate-500 dark:text-slate-400" />
                <input
                  id="reg-first-name"
                  type="text"
                  required
                  placeholder="Lucas"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 outline-none text-xs transition-colors text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.lastName')}</label>
              <input
                id="reg-last-name"
                type="text"
                required
                placeholder="Silva"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 outline-none text-xs transition-colors text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.sex')}</label>
              <select
                id="reg-gender"
                value={sexo}
                onChange={(e) => setSexo(e.target.value as 'M' | 'F' | 'Outro')}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              >
                <option value="M" className="text-slate-900">{language === 'pt' ? 'Masculino' : 'Male'}</option>
                <option value="F" className="text-slate-900">{language === 'pt' ? 'Feminino' : 'Female'}</option>
                <option value="Outro" className="text-slate-900">{language === 'pt' ? 'Outro' : 'Other'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.age')}</label>
              <input
                id="reg-age"
                type="number"
                required
                min="14"
                max="100"
                value={idade}
                onChange={(e) => setIdade(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.weight')}</label>
              <input
                id="reg-weight"
                type="number"
                required
                min="30"
                max="250"
                value={peso}
                onChange={(e) => setPeso(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.height')}</label>
              <input
                id="reg-height"
                type="number"
                required
                min="100"
                max="230"
                value={altura}
                onChange={(e) => setAltura(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.goal')}</label>
              <select
                id="reg-goal"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value as 'hipertrofia' | 'definicao' | 'condicionamento')}
                className="w-full px-2 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              >
                <option value="hipertrofia" className="text-slate-900">{language === 'pt' ? 'Ganhar Massa' : 'Gain Mass'}</option>
                <option value="definicao" className="text-slate-900">{language === 'pt' ? 'Definição' : 'Definition'}</option>
                <option value="condicionamento" className="text-slate-900">{language === 'pt' ? 'Resistência' : 'Endurance'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.level')}</label>
              <select
                id="reg-level"
                value={nivel}
                onChange={(e) => setNivel(e.target.value as 'iniciante' | 'intermediario' | 'avancado')}
                className="w-full px-2 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
              >
                <option value="iniciante" className="text-slate-900">{language === 'pt' ? 'Iniciante' : 'Beginner'}</option>
                <option value="intermediario" className="text-slate-900">{language === 'pt' ? 'Intermediário' : 'Intermediate'}</option>
                <option value="avancado" className="text-slate-900">{language === 'pt' ? 'Avançado' : 'Advanced'}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 opacity-40 text-slate-500 dark:text-slate-400" />
              <input
                id="reg-email"
                type="email"
                required
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 outline-none text-xs transition-colors text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 opacity-40 text-slate-500 dark:text-slate-400" />
                <input
                  id="reg-password"
                  type="password"
                  required
                  placeholder="******"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 outline-none text-xs transition-colors text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.confirmPassword')}</label>
              <input
                id="reg-confirm-password"
                type="password"
                required
                placeholder="******"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 outline-none text-xs transition-colors text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer select-none text-xs py-2 text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              id="reg-terms"
              checked={aceitoTermos}
              onChange={(e) => setAceitoTermos(e.target.checked)}
              className="rounded border-slate-300 dark:border-white/10 text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 shrink-0"
            />
            <span className="opacity-80 leading-relaxed">{t('auth.terms')}</span>
          </label>

          <button
            type="submit"
            id="reg-submit-btn"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl shadow-sm transition-all border border-transparent hover:-translate-y-0.5 active:translate-y-0"
          >
            {language === 'pt' ? 'CRIAR MINHA CONTA PREMIUM' : 'CREATE MY PREMIUM ACCOUNT'}
          </button>
        </form>
      )}

      {/* FORGOT MODE */}
      {mode === 'forgot' && (
        <form onSubmit={handleRecoverSubmit} className="space-y-4">
          <p className="text-xs opacity-70 leading-relaxed text-center mb-4 text-slate-600 dark:text-slate-400">
            {language === 'pt' 
              ? 'Insira seu e-mail abaixo para receber um link de redefinição de senha.'
              : 'Enter your email below to receive a password reset link.'}
          </p>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3.5 opacity-40 text-slate-500 dark:text-slate-400" />
              <input
                id="recover-email"
                type="email"
                required
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 outline-none text-sm transition-colors text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            id="recover-submit-btn"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl shadow-sm transition-all border border-transparent hover:-translate-y-0.5 active:translate-y-0"
          >
            {t('auth.recoverBtn')}
          </button>
        </form>
      )}

      {/* Mode selectors */}
      <div className="mt-8 border-t border-slate-100 dark:border-slate-200/10 pt-6 text-center text-xs space-y-3">
        {mode === 'login' ? (
          <button
            id="toggle-register-mode"
            onClick={() => setMode('register')}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            {t('auth.dontHave')}
          </button>
        ) : (
          <button
            id="toggle-login-mode"
            onClick={() => setMode('login')}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            {t('auth.alreadyHave')}
          </button>
        )}

        <div>
          <button
            id="auth-back-to-landing"
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline font-medium"
          >
            {language === 'pt' ? 'Voltar para a Página Inicial' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
}
