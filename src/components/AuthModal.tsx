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
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
      
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

          {step === 'email' && (
            <>
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs text-stone-400 font-medium">{lang === 'zh' ? '或' : 'OR'}</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => onAuth('demo@mindx.com')}
                className="w-full py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-600 hover:bg-stone-50 border border-dashed border-stone-200 hover:border-stone-300 transition-all flex items-center justify-center gap-1.5"
              >
                ⚡ {lang === 'zh' ? '快捷登录（测试）' : 'Quick Login (Test)'}
              </button>
              <button
                onClick={() => onAuth('google@mindx.com')}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all text-sm font-medium text-stone-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {lang === 'zh' ? '使用 Google 登录' : 'Continue with Google'}
              </button>
              <button
                onClick={() => onAuth('facebook@mindx.com')}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all text-sm font-medium text-stone-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
                {lang === 'zh' ? '使用 Facebook 登录' : 'Continue with Facebook'}
              </button>
            </div>
            </>
          )}

          <p className="text-center text-[11px] text-stone-400 mt-4">
            {t('auth.terms')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
