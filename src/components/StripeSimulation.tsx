import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, Shield, ArrowLeft, Loader2, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface StripeSimulationProps {
  mode: 'checkout' | 'portal';
  email: string;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function StripeSimulation({ mode, email, onClose, onSuccess }: StripeSimulationProps) {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardName, setCardName] = useState('Atleta Alpha');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Portal state
  const [subStatus, setSubStatus] = useState<'ativo' | 'cancelado'>('ativo');

  useEffect(() => {
    if (mode === 'portal') {
      // Check current status from DB
      fetch(`/api/subscription/status/${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'ativo') {
            setSubStatus('ativo');
          } else {
            setSubStatus('cancelado');
          }
        })
        .catch(() => setSubStatus('ativo'));
    }
  }, [mode, email]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText('Verificando cartão...');

    setTimeout(async () => {
      setLoadingText('Processando pagamento seguro...');
      setTimeout(async () => {
        setLoadingText('Transmitindo webhook para o servidor...');
        try {
          const res = await fetch('/api/stripe/simulate-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              eventType: 'checkout.session.completed',
            }),
          });

          if (!res.ok) {
            throw new Error('Falha ao processar simulação de pagamento');
          }

          setLoading(false);
          setSuccess(true);
          setTimeout(() => {
            onSuccess(email);
          }, 2000);
        } catch (err: any) {
          setLoading(false);
          setError(err.message || 'Erro inesperado no checkout');
        }
      }, 1000);
    }, 1200);
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar sua assinatura do Projeto Alpha Premium?')) return;
    
    setLoading(true);
    setLoadingText('Processando cancelamento no Stripe...');

    setTimeout(async () => {
      try {
        const res = await fetch('/api/stripe/simulate-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            eventType: 'customer.subscription.deleted',
          }),
        });

        if (!res.ok) {
          throw new Error('Falha ao processar cancelamento no Stripe');
        }

        setLoading(false);
        setSubStatus('cancelado');
        alert('Assinatura cancelada com sucesso no Stripe.');
      } catch (err: any) {
        setLoading(false);
        alert(err.message || 'Erro ao cancelar');
      }
    }, 1500);
  };

  const handleReactivateSubscription = async () => {
    setLoading(true);
    setLoadingText('Reativando sua assinatura...');

    setTimeout(async () => {
      try {
        const res = await fetch('/api/stripe/simulate-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            eventType: 'checkout.session.completed',
          }),
        });

        if (!res.ok) {
          throw new Error('Falha ao reativar assinatura');
        }

        setLoading(false);
        setSubStatus('ativo');
        alert('Assinatura reativada com sucesso!');
      } catch (err: any) {
        setLoading(false);
        alert(err.message || 'Erro ao reativar');
      }
    }, 1200);
  };

  if (mode === 'checkout') {
    return (
      <div className="fixed inset-0 bg-[#f8f9fa] text-[#30313d] z-[999] overflow-y-auto flex flex-col md:flex-row font-sans">
        {/* Left Side: Product Details */}
        <div className="md:w-[45%] bg-[#ffffff] p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e3e8ee]">
          <div className="space-y-8 text-left">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-semibold text-[#697386] hover:text-[#111] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Projeto Alpha Premium
            </button>

            <div className="space-y-2 mt-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#697386]">PROJETO ALPHA PREMIUM</span>
              <h1 className="text-3xl font-black text-[#1f1f2f]">Assinatura Mensal</h1>
              <p className="text-sm text-[#697386]">Acesso completo a treinos personalizados, dietas, calculadoras automáticas e saúde hormonal.</p>
            </div>

            <div className="flex items-baseline gap-2 pt-4">
              <span className="text-4xl font-extrabold text-[#111]">R$ 17,90</span>
              <span className="text-sm text-[#697386] font-medium">/ mês</span>
            </div>

            <div className="border-t border-[#e3e8ee] pt-6 space-y-4 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-[#697386]">Projeto Alpha Premium</span>
                <span>R$ 17,90</span>
              </div>
              <div className="flex justify-between border-b border-[#e3e8ee] pb-4">
                <span className="text-[#697386]">Frequência</span>
                <span>Mensal</span>
              </div>
              <div className="flex justify-between text-[#111] font-bold text-base">
                <span>Total devido hoje</span>
                <span>R$ 17,90</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-[#697386] mt-12">
            <Shield className="w-4 h-4 text-[#3ecf8e]" />
            <span>Processamento seguro simulado em ambiente Sandbox do Stripe</span>
          </div>
        </div>

        {/* Right Side: Stripe Card Input Form */}
        <div className="flex-1 bg-[#f8f9fa] p-8 md:p-16 flex items-center justify-center">
          <div className="max-w-md w-full text-left">
            {success ? (
              <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-6 border border-[#e3e8ee] animate-fade-in">
                <div className="w-16 h-16 bg-[#3ecf8e]/10 text-[#3ecf8e] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#111]">Pagamento Autorizado!</h2>
                  <p className="text-sm text-[#697386]">Sua assinatura mensal foi processada e ativada com sucesso pelo Stripe.</p>
                </div>
                <p className="text-xs text-[#697386] animate-pulse">Redirecionando de volta ao aplicativo...</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-lg text-xs font-semibold mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Você está no ambiente de teste do Stripe. Use qualquer dado fictício.</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#1f1f2f]">Informações de Pagamento</h3>
                  <p className="text-xs text-[#697386]">Preencha os campos abaixo para simular a criação de sua assinatura.</p>
                </div>

                <div className="space-y-4">
                  {/* Email Input (read only / prepopulated) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4f566b] uppercase">Endereço de E-mail</label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full px-3 py-2.5 bg-[#e3e8ee] text-[#4f566b] border border-[#e3e8ee] rounded-lg text-sm font-medium"
                    />
                  </div>

                  {/* Card Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4f566b] uppercase">Informações do Cartão</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e3e8ee] focus:border-[#635bff] rounded-lg text-sm font-medium outline-none shadow-sm transition-all text-[#111]"
                      />
                      <CreditCard className="w-5 h-5 text-[#a3acb9] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Expiry and CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4f566b] uppercase">Validade</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-[#e3e8ee] focus:border-[#635bff] rounded-lg text-sm font-medium outline-none shadow-sm transition-all text-[#111]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4f566b] uppercase">CVC</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-[#e3e8ee] focus:border-[#635bff] rounded-lg text-sm font-medium outline-none shadow-sm transition-all text-[#111]"
                      />
                    </div>
                  </div>

                  {/* Name on Card */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4f566b] uppercase">Nome no Cartão</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome Completo"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#e3e8ee] focus:border-[#635bff] rounded-lg text-sm font-medium outline-none shadow-sm transition-all text-[#111]"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#635bff] hover:bg-[#563dff] disabled:bg-[#635bff]/60 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{loadingText}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Inscrever-se no Projeto Alpha (R$ 17,90/mês)</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[#697386]">
                  Ao clicar em Inscrever-se, você autoriza o Projeto Alpha Premium a cobrar R$ 17,90 mensalmente até que você cancele sua assinatura no portal de cliente do Stripe.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PORTAL MODE
  return (
    <div className="fixed inset-0 bg-[#f8f9fa] text-[#30313d] z-[999] overflow-y-auto flex items-center justify-center font-sans">
      <div className="max-w-xl w-full p-6 md:p-12 bg-[#ffffff] rounded-3xl border border-[#e3e8ee] shadow-2xl text-left space-y-8 relative m-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e3e8ee] pb-4">
          <div>
            <h1 className="text-xl font-bold text-[#111] flex items-center gap-2">
              <span className="w-6 h-6 bg-[#635bff] text-white font-black text-xs flex items-center justify-center rounded">S</span>
              Stripe Customer Portal
            </h1>
            <p className="text-xs text-[#697386]">Gerencie suas assinaturas e formas de pagamento com segurança</p>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold px-3 py-1.5 border border-[#e3e8ee] hover:bg-slate-50 rounded-lg text-[#697386] transition-colors cursor-pointer"
          >
            Sair do Portal
          </button>
        </div>

        {/* Portal status banner */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-lg text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Você está no portal de teste do Stripe (Sandbox). As ações refletirão no banco de dados.</span>
        </div>

        {/* User Info */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#697386] uppercase tracking-wider block">CONTA DE CLIENTE</span>
          <div className="text-sm font-bold text-[#111]">{email}</div>
        </div>

        {/* Subscription details */}
        <div className="p-5 bg-[#f8f9fa] border border-[#e3e8ee] rounded-2xl space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#697386]">ASSINATURA ATIVA</span>
              <h2 className="text-base font-black text-[#111]">Projeto Alpha Premium</h2>
              <p className="text-xs text-[#697386]">R$ 17,90 por mês • Cobrado via Stripe</p>
            </div>
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
              subStatus === 'ativo'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {subStatus === 'ativo' ? 'Ativo' : 'Cancelado'}
            </div>
          </div>

          <div className="border-t border-[#e3e8ee] pt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[#697386] font-medium">Data de Início</p>
              <p className="font-bold text-[#111] mt-0.5">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[#697386] font-medium">Próxima Cobrança</p>
              <p className="font-bold text-[#111] mt-0.5">
                {subStatus === 'ativo' 
                  ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() 
                  : 'Nenhuma (Acesso expira em breve)'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions panel */}
        <div className="space-y-4 pt-2">
          {loading ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span>{loadingText}</span>
            </div>
          ) : subStatus === 'ativo' ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelSubscription}
                className="flex-1 py-3 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl text-xs text-center transition-colors cursor-pointer"
              >
                Cancelar Assinatura
              </button>
              <button
                onClick={() => alert('Método de pagamento atualizado no Stripe (Simulado).')}
                className="flex-1 py-3 bg-[#635bff] hover:bg-[#563dff] text-white font-bold rounded-xl text-xs text-center transition-all cursor-pointer"
              >
                Atualizar Cartão de Crédito
              </button>
            </div>
          ) : (
            <button
              onClick={handleReactivateSubscription}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs text-center transition-all cursor-pointer"
            >
              Reativar Assinatura (R$ 17,90/mês)
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 text-[10px] text-[#697386] justify-center pt-4 border-t border-[#e3e8ee]">
          <Shield className="w-3.5 h-3.5 text-[#3ecf8e]" />
          <span>Segurança garantida por Stripe • Conectado à conta do Projeto Alpha Premium</span>
        </div>
      </div>
    </div>
  );
}
