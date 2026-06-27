import React, { useState } from 'react';
import { useLanguageTheme } from './LanguageThemeContext';
import { UserProfile } from '../types';
import { User, Mail, CreditCard, Shield, Download, FileText, Check, AlertTriangle, Edit, Wallet, QrCode, RefreshCw, ExternalLink, Lock, PlusCircle, DollarSign, CheckCircle2, ArrowUpRight, Award, Flame } from 'lucide-react';

interface ProfileSectionProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export default function ProfileSection({ user, onUpdateProfile }: ProfileSectionProps) {
  const { t, language } = useLanguageTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState(user.nome);
  const [sobrenome, setSobrenome] = useState(user.sobrenome);
  const [peso, setPeso] = useState(user.peso);
  const [altura, setAltura] = useState(user.altura);
  const [objetivo, setObjetivo] = useState(user.objetivo);
  const [nivel, setNivel] = useState(user.nivel);

  // Keep inputs updated when user prop changes (e.g. from evaluations or questionnaire)
  React.useEffect(() => {
    if (!isEditing) {
      setNome(user.nome);
      setSobrenome(user.sobrenome);
      setPeso(user.peso);
      setAltura(user.altura);
      setObjetivo(user.objetivo);
      setNivel(user.nivel);
    }
  }, [user, isEditing]);

  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [excelSuccess, setExcelSuccess] = useState(false);
  const [stripeSuccess, setStripeSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      nome,
      sobrenome,
      peso: Number(peso),
      altura: Number(altura),
      objetivo,
      nivel
    });
    setIsEditing(false);
  };

  const handleExportPdf = () => {
    setPdfSuccess(true);
    setTimeout(() => {
      setPdfSuccess(false);
      alert(language === 'pt' ? 'Relatório em PDF exportado com sucesso!' : 'PDF Report exported successfully!');
    }, 1500);
  };

  const handleExportExcel = () => {
    setExcelSuccess(true);
    setTimeout(() => {
      setExcelSuccess(false);
      alert(language === 'pt' ? 'Planilha em Excel exportada com sucesso!' : 'Excel Sheet exported successfully!');
    }, 1500);
  };

  const handleStripePortal = () => {
    setStripeSuccess(true);
    setTimeout(() => {
      setStripeSuccess(false);
      alert(language === 'pt' ? 'Portal do Cliente Stripe carregado com sucesso!' : 'Stripe Customer Portal loaded successfully!');
    }, 1500);
  };

  // Merchant / Payout Connection states
  const [merchantConfig, setMerchantConfig] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('alpha_merchant_config');
      if (stored) return JSON.parse(stored);
    }
    return {
      connected: false,
      provider: null as 'stripe' | 'strike' | null,
      stripeEmail: '',
      stripeAccountId: '',
      strikeUsername: '',
      balance: 0.00,
      transactions: [] as { id: string; amount: number; date: string; description: string; descriptionEn: string; status: 'completed' }[]
    };
  });

  const [activeMerchantTab, setActiveMerchantTab] = useState<'stripe' | 'strike'>('stripe');
  const [isMerchantConnecting, setIsMerchantConnecting] = useState(false);
  const [inputStripeEmail, setInputStripeEmail] = useState('');
  const [inputStrikeUsername, setInputStrikeUsername] = useState('');
  const [mockInvoiceAmount, setMockInvoiceAmount] = useState<number>(50);
  const [generatedInvoice, setGeneratedInvoice] = useState<string>('');
  const [isInvoicePaid, setIsInvoicePaid] = useState<boolean>(false);
  const [simulatingPayment, setSimulatingPayment] = useState<boolean>(false);

  const handleConnectStripe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputStripeEmail) return;
    setIsMerchantConnecting(true);
    setTimeout(() => {
      const generatedId = `acct_1M` + Math.random().toString(36).substring(2, 10).toUpperCase();
      const updated = {
        connected: true,
        provider: 'stripe' as const,
        stripeEmail: inputStripeEmail,
        stripeAccountId: generatedId,
        strikeUsername: '',
        balance: 150.00,
        transactions: [
          {
            id: `txn_${Math.random().toString(36).substring(2, 9)}`,
            amount: 150.00,
            date: new Date().toLocaleDateString(),
            description: 'Consultoria de Treino Mensal (Aluno: Bruno)',
            descriptionEn: 'Monthly Training Coaching (Student: Bruno)',
            status: 'completed' as const
          }
        ]
      };
      setMerchantConfig(updated);
      localStorage.setItem('alpha_merchant_config', JSON.stringify(updated));
      setIsMerchantConnecting(false);
    }, 1500);
  };

  const handleConnectStrike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputStrikeUsername) return;
    setIsMerchantConnecting(true);
    setTimeout(() => {
      const username = inputStrikeUsername.toLowerCase().trim();
      const updated = {
        connected: true,
        provider: 'strike' as const,
        stripeEmail: '',
        stripeAccountId: '',
        strikeUsername: username,
        balance: 0.00,
        transactions: []
      };
      setMerchantConfig(updated);
      localStorage.setItem('alpha_merchant_config', JSON.stringify(updated));
      setIsMerchantConnecting(false);
    }, 1500);
  };

  const handleDisconnectMerchant = () => {
    const updated = {
      connected: false,
      provider: null,
      stripeEmail: '',
      stripeAccountId: '',
      strikeUsername: '',
      balance: 0.00,
      transactions: []
    };
    setMerchantConfig(updated);
    localStorage.setItem('alpha_merchant_config', JSON.stringify(updated));
    setGeneratedInvoice('');
    setIsInvoicePaid(false);
  };

  const handleSimulateStripePayment = () => {
    setSimulatingPayment(true);
    setTimeout(() => {
      const amount = Math.random() > 0.5 ? 199.90 : 250.00;
      const newTx = {
        id: `txn_${Math.random().toString(36).substring(2, 9)}`,
        amount: amount,
        date: new Date().toLocaleDateString(),
        description: 'Recebimento de Mensalidade (Simulado)',
        descriptionEn: 'Membership Payment Received (Simulated)',
        status: 'completed' as const
      };
      const updated = {
        ...merchantConfig,
        balance: parseFloat((merchantConfig.balance + amount).toFixed(2)),
        transactions: [newTx, ...merchantConfig.transactions]
      };
      setMerchantConfig(updated);
      localStorage.setItem('alpha_merchant_config', JSON.stringify(updated));
      setSimulatingPayment(false);
    }, 1000);
  };

  const handleGenerateStrikeInvoice = () => {
    if (!merchantConfig.strikeUsername) return;
    const amountSats = Math.round(mockInvoiceAmount * 2000); // 1 USD ~ 2000 sats mock conversion
    const randomHash = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const invoiceStr = `lnbc${amountSats}n1p1pvjlh...` + randomHash;
    setGeneratedInvoice(invoiceStr);
    setIsInvoicePaid(false);
  };

  const handleSimulateStrikePayment = () => {
    if (!generatedInvoice) return;
    setSimulatingPayment(true);
    setTimeout(() => {
      const newTx = {
        id: `txn_${Math.random().toString(36).substring(2, 9)}`,
        amount: mockInvoiceAmount,
        date: new Date().toLocaleDateString(),
        description: `Micro-pagamento Lightning (@${merchantConfig.strikeUsername})`,
        descriptionEn: `Lightning Micro-payment (@${merchantConfig.strikeUsername})`,
        status: 'completed' as const
      };
      const updated = {
        ...merchantConfig,
        balance: parseFloat((merchantConfig.balance + mockInvoiceAmount).toFixed(2)),
        transactions: [newTx, ...merchantConfig.transactions]
      };
      setMerchantConfig(updated);
      localStorage.setItem('alpha_merchant_config', JSON.stringify(updated));
      setSimulatingPayment(false);
      setIsInvoicePaid(true);
      setGeneratedInvoice('');
    }, 1200);
  };

  // IMC Calculation
  const alturaM = user.altura / 100;
  const imc = parseFloat((user.peso / (alturaM * alturaM)).toFixed(1));

  return (
    <div id="profile-tab" className="space-y-6 text-slate-900 dark:text-slate-100">
      <header className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 md:w-8 md:h-8 text-blue-500 animate-pulse" />
          {t('profile.title')}
        </h2>
        <p className="text-sm opacity-60 font-medium text-slate-500 dark:text-slate-400">{t('profile.details')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Profile stats or editing */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0E1A]/40 border border-slate-200 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-150 dark:border-slate-200/5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-green-500 rounded-3xl flex items-center justify-center font-black text-3xl text-white shadow-xl">
                {user.nome[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.nome} {user.sobrenome}</h3>
                <p className="text-xs opacity-70 flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400">
                  <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  {user.email}
                </p>
                <span className="inline-block text-[9px] font-mono uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-extrabold mt-2">
                  ✓ {t('profile.subscriptionActive')}
                </span>
              </div>
            </div>

            <button
              id="edit-profile-toggle-btn"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold text-xs rounded-xl border border-slate-200/50 dark:border-slate-200/5 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              {t('app.edit')}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-750 dark:text-slate-350">Nome</label>
                  <input
                    id="edit-first-name"
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-750 dark:text-slate-350">Sobrenome</label>
                  <input
                    id="edit-last-name"
                    type="text"
                    required
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-750 dark:text-slate-350">Peso (kg)</label>
                  <input
                    id="edit-weight-input"
                    type="number"
                    required
                    value={peso}
                    onChange={(e) => setPeso(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-750 dark:text-slate-350">Altura (cm)</label>
                  <input
                    id="edit-height-input"
                    type="number"
                    required
                    value={altura}
                    onChange={(e) => setAltura(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-750 dark:text-slate-350">Objetivo</label>
                  <select
                    id="edit-goal-select"
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                  >
                    <option value="hipertrofia">Ganhar Massa</option>
                    <option value="definicao">Definição</option>
                    <option value="condicionamento">Resistência</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-750 dark:text-slate-350">Nível</label>
                  <select
                    id="edit-level-select"
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="submit"
                  id="edit-save-btn"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  {t('app.save')}
                </button>
                <button
                  type="button"
                  id="edit-cancel-btn"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-750 dark:text-white font-bold text-xs rounded-xl border border-slate-200/50 dark:border-slate-200/5 cursor-pointer"
                >
                  {t('app.cancel')}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center">
              <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl shadow-xs">
                <span className="text-[10px] font-mono opacity-50 uppercase block">Peso Corporal</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white mt-1 block">{user.peso} kg</span>
              </div>
              <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl shadow-xs">
                <span className="text-[10px] font-mono opacity-50 uppercase block">Altura</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white mt-1 block">{user.altura} cm</span>
              </div>
              <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl shadow-xs">
                <span className="text-[10px] font-mono opacity-50 uppercase block">Calculated IMC</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1 block">{imc}</span>
              </div>
              <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl shadow-xs">
                <span className="text-[10px] font-mono opacity-50 uppercase block">Tempo Ativo</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400 mt-1 block">{user.diasAtivos} dias</span>
              </div>
            </div>
          )}

          {/* Merchant Integration Section */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-indigo-500" />
                  {t('profile.merchant.title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                  {t('profile.merchant.desc')}
                </p>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 self-start md:self-auto ${
                merchantConfig.connected
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                  : 'bg-white dark:bg-white/5 text-slate-500 border border-slate-100 dark:border-white/5 shadow-xs'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${merchantConfig.connected ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                {merchantConfig.connected ? t('profile.merchant.connected') : t('profile.merchant.disconnected')}
              </div>
            </div>

            {!merchantConfig.connected ? (
              <div className="space-y-4">
                {/* Integration Selection Tabs */}
                <div className="flex gap-2 p-1 bg-white dark:bg-white/5 border border-slate-100 rounded-xl max-w-md shadow-xs">
                  <button
                    type="button"
                    onClick={() => setActiveMerchantTab('stripe')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMerchantTab === 'stripe'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Stripe Connect
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMerchantTab('strike')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeMerchantTab === 'strike'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Strike (Bitcoin)
                  </button>
                </div>

                {/* Stripe Form */}
                {activeMerchantTab === 'stripe' && (
                  <form onSubmit={handleConnectStripe} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 rounded-2xl text-left space-y-4 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>{t('profile.merchant.stripe')}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Receba pagamentos com cartões de crédito e débito globalmente. O Stripe Connect depositará as vendas diretamente na sua conta bancária.
                    </p>
                    <div className="space-y-2 max-w-md">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-350 block">E-mail Comercial para o Stripe</label>
                      <input
                        id="stripe-email-input"
                        type="email"
                        required
                        placeholder="exemplo@academia.com"
                        value={inputStripeEmail}
                        onChange={(e) => setInputStripeEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isMerchantConnecting}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      {isMerchantConnecting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Conectando...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" />
                          {t('profile.merchant.connectBtn')}
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Strike Form */}
                {activeMerchantTab === 'strike' && (
                  <form onSubmit={handleConnectStrike} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 rounded-2xl text-left space-y-4 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                      <Lock className="w-4 h-4 text-amber-500" />
                      <span>{t('profile.merchant.strike')}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Receba pagamentos instantâneos com taxas quase zero em qualquer lugar do mundo utilizando a rede Bitcoin Lightning.
                    </p>
                    <div className="space-y-2 max-w-md">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-350 block">Nome de Usuário Strike (Ex: lucas)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">@</span>
                        <input
                          id="strike-username-input"
                          type="text"
                          required
                          placeholder="seu-username"
                          value={inputStrikeUsername}
                          onChange={(e) => setInputStrikeUsername(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Isto criará seu endereço Lightning Address para recebimento: <strong className="text-slate-500 dark:text-slate-300">username@strike.me</strong></span>
                    </div>
                    <button
                      type="submit"
                      disabled={isMerchantConnecting}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      {isMerchantConnecting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" />
                          {t('profile.merchant.connectBtn')}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Connected Dashboard Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Provider Info Card */}
                  <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl text-left space-y-2.5">
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Provedor Ativo</span>
                    <div className="flex items-center gap-2">
                      {merchantConfig.provider === 'stripe' ? (
                        <>
                          <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">S</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white">Stripe Connect</span>
                        </>
                      ) : (
                        <>
                          <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">⚡</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white">Strike Bitcoin</span>
                        </>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {merchantConfig.provider === 'stripe' ? (
                        <p className="truncate">Conta: {merchantConfig.stripeAccountId}</p>
                      ) : (
                        <p className="truncate">Endereço: {merchantConfig.strikeUsername}@strike.me</p>
                      )}
                    </div>
                  </div>

                  {/* Account Balance Card */}
                  <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl text-left space-y-1 relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 w-16 h-16 bg-green-500/5 rounded-full blur-xl"></div>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Saldo Disponível</span>
                    <div className="text-xl font-black text-green-600 dark:text-green-400 mt-1">
                      {merchantConfig.provider === 'stripe' ? 'R$ ' : '$ '}
                      {merchantConfig.balance.toFixed(2)}
                    </div>
                    <span className="text-[9px] text-slate-400">Pronto para saque imediato</span>
                  </div>

                  {/* Actions / Control Panel */}
                  <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl flex flex-col justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleDisconnectMerchant}
                      className="w-full py-2 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      {t('profile.merchant.disconnectBtn')}
                    </button>

                    {merchantConfig.provider === 'stripe' ? (
                      <button
                        type="button"
                        onClick={handleSimulateStripePayment}
                        disabled={simulatingPayment}
                        className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {simulatingPayment ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            Simular Pagamento BRL
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={handleGenerateStrikeInvoice}
                          className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Gerar Invoice
                        </button>
                        {generatedInvoice && (
                          <button
                            type="button"
                            onClick={handleSimulateStrikePayment}
                            disabled={simulatingPayment}
                            className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white text-[10px] font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            {simulatingPayment ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              'Pagar'
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Strike Invoice Details */}
                {merchantConfig.provider === 'strike' && generatedInvoice && (
                  <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-left space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4" />
                        Fatura Lightning Gerada (LN Invoice)
                      </span>
                      <span className="text-[10px] font-mono text-amber-600 bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                        {mockInvoiceAmount} USD ~ {(mockInvoiceAmount * 2000).toLocaleString()} sats
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Fake Scan QR code */}
                      <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shadow-inner border border-amber-500/10 shrink-0">
                        <div className="w-full h-full relative grid grid-cols-4 grid-rows-4 gap-1 opacity-85">
                          {/* Top-left corner box */}
                          <div className="bg-slate-900 border border-slate-950 col-start-1 row-start-1"></div>
                          <div className="bg-slate-900 col-start-2 row-start-1"></div>
                          <div className="bg-slate-900 col-start-1 row-start-2"></div>
                          <div className="bg-white col-start-2 row-start-2"></div>
                          {/* Top-right corner box */}
                          <div className="bg-slate-900 col-start-4 row-start-1"></div>
                          <div className="bg-slate-900 col-start-4 row-start-2"></div>
                          {/* Bottom-left corner box */}
                          <div className="bg-slate-900 col-start-1 row-start-4"></div>
                          <div className="bg-slate-900 col-start-2 row-start-4"></div>
                          {/* Some random data pixels */}
                          <div className="bg-slate-900 col-start-3 row-start-2"></div>
                          <div className="bg-slate-900 col-start-2 row-start-3"></div>
                          <div className="bg-slate-900 col-start-4 row-start-3"></div>
                          <div className="bg-slate-900 col-start-3 row-start-4"></div>
                          <div className="bg-slate-900 col-start-3 row-start-3"></div>
                        </div>
                      </div>

                      <div className="space-y-3 flex-1 min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Utilize o botão "Pagar" ao lado para simular o escaneamento e liquidação imediata da fatura na rede Lightning.
                        </p>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 block">Código da Fatura</span>
                          <div className="p-2.5 bg-slate-100 dark:bg-slate-950/40 rounded-xl font-mono text-[9px] text-slate-600 dark:text-slate-400 select-all break-all border border-slate-200/50 dark:border-white/5">
                            {generatedInvoice}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transactions Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-left">
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    Histórico de Recebimentos Recentes
                  </h4>

                  {merchantConfig.transactions.length === 0 ? (
                    <div className="p-6 bg-white dark:bg-white/5 border border-dashed border-slate-100 dark:border-white/10 rounded-2xl text-center shadow-xs">
                      <p className="text-xs text-slate-400 dark:text-slate-500">Nenhum pagamento recebido ainda nesta conta.</p>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-white/5 shadow-xs">
                      {merchantConfig.transactions.map((tx) => (
                        <div key={tx.id} className="p-3.5 flex items-center justify-between gap-4 text-left">
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-xs font-bold text-slate-800 dark:text-white truncate block">
                              {language === 'pt' ? tx.description : tx.descriptionEn}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                              <span>ID: {tx.id}</span>
                              <span>•</span>
                              <span>{tx.date}</span>
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-green-600 dark:text-green-400 block">
                              +{merchantConfig.provider === 'stripe' ? 'R$ ' : '$ '}
                              {tx.amount.toFixed(2)}
                            </span>
                            <span className="text-[9px] font-semibold text-emerald-500 uppercase tracking-wider block">✓ Pago</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar for Exports & Payments */}
        <div className="space-y-6">
          {/* Billing Card / Stripe checkout simulator */}
          <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-green-500/10 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-500" />
              {t('profile.statusPremium')}
            </h3>
            <p className="text-xs opacity-60 font-medium text-slate-500 dark:text-slate-400 mb-4 text-left">Gerencie as faturas mensais automáticas e cartões cadastrados.</p>

            <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-xs space-y-2 mb-6 text-left shadow-xs">
              <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                <span>Plano:</span>
                <span className="text-green-600 dark:text-green-400">Projeto Alpha Premium</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                <span>Valor:</span>
                <span>R$ 17,90 por mês</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                <span>Status:</span>
                <span className="text-green-500">Ativa</span>
              </div>
            </div>

            <button
              id="stripe-portal-btn"
              onClick={handleStripePortal}
              disabled={stripeSuccess}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold text-xs rounded-xl shadow-md transition-transform cursor-pointer"
            >
              {stripeSuccess ? 'Carregando portal Stripe...' : t('profile.stripeCheckout')}
            </button>
          </div>

          {/* PDF & Excel exports */}
          <div className="bg-white dark:bg-[#0A0E1A]/40 border border-slate-100 dark:border-white/10 p-6 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" />
              {t('profile.reports')}
            </h3>

            <div className="space-y-3">
              <button
                id="export-pdf-btn"
                onClick={handleExportPdf}
                disabled={pdfSuccess}
                className="w-full p-3 bg-white hover:bg-slate-50/50 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  {t('profile.exportPdf')}
                </span>
                <Download className="w-4 h-4" />
              </button>

              <button
                id="export-excel-btn"
                onClick={handleExportExcel}
                disabled={excelSuccess}
                className="w-full p-3 bg-white hover:bg-slate-50/50 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  {t('profile.exportExcel')}
                </span>
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
