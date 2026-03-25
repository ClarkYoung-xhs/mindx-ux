import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  X,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AuthModalProps {
  onClose: () => void;
  onAuth: (email: string) => void;
}

const MOCK_VERIFICATION_CODE = '123456';
const MOCK_USERS_KEY = 'mindx_users';

type Step = 'email' | 'verify';

export default function AuthModal({ onClose, onAuth }: AuthModalProps) {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      setError(t('auth.invalidEmail'));
      return;
    }

    setError('');
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSending(false);
    setCountdown(60);
    setStep('verify');
    console.log(`[MOCK] Verification code ${MOCK_VERIFICATION_CODE} sent to ${email}`);
  };

  const handleVerify = () => {
    if (verificationCode !== MOCK_VERIFICATION_CODE) {
      setError(t('auth.invalidCode'));
      return;
    }

    setError('');

    const stored = localStorage.getItem(MOCK_USERS_KEY);
    const users: string[] = stored ? JSON.parse(stored) : [];
    if (!users.includes(email)) {
      users.push(email);
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    }

    onAuth(email);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
    console.log(`[MOCK] Resending code ${MOCK_VERIFICATION_CODE} to ${email}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-stone-900 tracking-tight">MindX</span>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-xl font-semibold text-stone-900 tracking-tight mb-1">
            {step === 'email' ? t('auth.signInTitle') : t('auth.checkEmail')}
          </h2>
          <p className="text-sm text-stone-500">
            {step === 'email' 
              ? t('auth.emailPrompt')
              : <>{t('auth.codeSentTo')} <span className="font-medium text-stone-700">{email}</span></>
            }
          </p>
        </div>

        <div className="px-8 mb-6">
          <div className="flex gap-2">
            <div className="h-1 flex-1 rounded-full bg-stone-900 transition-all" />
            <div className={`h-1 flex-1 rounded-full transition-all ${step === 'verify' ? 'bg-stone-900' : 'bg-stone-200'}`} />
          </div>
        </div>

        <div className="px-8 pb-8">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {step === 'email' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  {t('auth.emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder={t('auth.emailPlaceholder')}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 focus:bg-white transition-all placeholder:text-stone-400 placeholder:font-normal"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                  />
                </div>
              </div>

              <button
                onClick={handleSendCode}
                disabled={!email || isSending}
                className="w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('auth.sendingCode')}
                  </>
                ) : (
                  <>
                    {t('auth.continue')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  {t('auth.codeLabel')}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={verificationCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(val);
                      setError('');
                    }}
                    placeholder={t('auth.codePlaceholder')}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 focus:bg-white transition-all placeholder:text-stone-400 placeholder:font-normal tracking-widest text-center"
                    autoFocus
                    maxLength={6}
                    onKeyDown={(e) => e.key === 'Enter' && verificationCode.length === 6 && handleVerify()}
                  />
                </div>
                <div className="flex items-center justify-between mt-2.5">
                  <p className="text-xs text-stone-400">
                    {t('auth.demoCode')} <span className="font-mono font-medium text-stone-500">123456</span>
                  </p>
                  <button
                    onClick={handleResend}
                    disabled={countdown > 0}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 disabled:text-stone-300 transition-colors"
                  >
                    {countdown > 0 
                      ? (lang === 'zh' ? `${countdown} ${t('auth.resendIn')}` : `${t('auth.resendIn')} ${countdown}s`)
                      : t('auth.resendCode')
                    }
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep('email'); setVerificationCode(''); setError(''); }}
                  className="px-5 py-3 bg-stone-100 text-stone-600 rounded-xl text-sm font-semibold hover:bg-stone-200 transition-colors"
                >
                  {t('common.back')}
                </button>
                <button
                  onClick={handleVerify}
                  disabled={verificationCode.length !== 6}
                  className="flex-1 py-3 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t('auth.verify')}
                </button>
              </div>
            </motion.div>
          )}

          <button
            onClick={() => onAuth('demo@mindx.com')}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-600 hover:bg-stone-50 border border-dashed border-stone-200 hover:border-stone-300 transition-all flex items-center justify-center gap-1.5"
          >
            ⚡ {lang === 'zh' ? '快捷登录（测试）' : 'Quick Login (Test)'}
          </button>

          <p className="text-center text-[11px] text-stone-400 mt-4">
            {t('auth.terms')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
