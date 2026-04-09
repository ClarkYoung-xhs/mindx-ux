import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Database, 
  Users, 
  RefreshCw, 
  ArrowRight, 
  Bot, 
  Sparkles, 
  Terminal,
  Zap,
  Code,
  Cpu,
  Briefcase,
  Layers,
  Search
} from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { useLanguage, LanguageSwitcher } from '../i18n/LanguageContext';

const INTEGRATIONS: { name: string; icon: React.ReactNode; color: string; highlight?: boolean }[] = [
  { name: 'Workbuddy', icon: <Briefcase className="w-4 h-4" />, color: 'bg-stone-100', highlight: true },
  { name: 'Claude', icon: <Bot className="w-4 h-4" />, color: 'bg-stone-100' },
  { name: 'Antigravity', icon: <Zap className="w-4 h-4" />, color: 'bg-stone-100' },
  { name: 'Codex', icon: <Code className="w-4 h-4" />, color: 'bg-stone-100' },
  { name: 'OpenClaw', icon: <Cpu className="w-4 h-4" />, color: 'bg-stone-100' },
  { name: 'TRAE', icon: <Layers className="w-4 h-4" />, color: 'bg-stone-100' },
  { name: 'Qoder', icon: <Terminal className="w-4 h-4" />, color: 'bg-stone-100' },
  { name: 'opencode', icon: <Code className="w-4 h-4" />, color: 'bg-stone-100' },
];

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleAuth = (email: string) => {
    // Compute workspace_id: quick-login shares 'w1', real email gets unique id
    const wsId = (email === 'demo@mindx.com' || email === 'google@mindx.com' || email === 'facebook@mindx.com')
      ? 'w1'
      : `w-${email.replace(/@/g, '-').replace(/\./g, '-')}`;
    const userName = email === 'demo@mindx.com' ? 'Me' : email.split('@')[0];
    localStorage.setItem('mindx_logged_in', email);
    localStorage.setItem('mindx_workspace_id', wsId);
    localStorage.setItem('mindx_user_name', userName);
    setShowAuth(false);
    navigate('/dashboard?onboarding=true');
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('mindx_logged_in');
    if (savedEmail) {
      navigate('/dashboard');
    }
  }, []);

  const steps = [
    { icon: <Users className="w-5 h-5" />, title: t('landing.step1Title'), desc: t('landing.step1Desc') },
    { icon: <Bot className="w-5 h-5" />, title: t('landing.step2Title'), desc: t('landing.step2Desc') },
    { icon: <Terminal className="w-5 h-5" />, title: t('landing.step3Title'), desc: t('landing.step3Desc') },
    { icon: <Sparkles className="w-5 h-5" />, title: t('landing.step4Title'), desc: t('landing.step4Desc') },
  ];

  const features = [
    { icon: <FileText className="w-5 h-5 text-stone-600" />, title: t('landing.feat1Title'), desc: t('landing.feat1Desc') },
    { icon: <Sparkles className="w-5 h-5 text-stone-600" />, title: t('landing.feat2Title'), desc: t('landing.feat2Desc') },
    { icon: <Database className="w-5 h-5 text-stone-600" />, title: t('landing.feat3Title'), desc: t('landing.feat3Desc') },
    { icon: <RefreshCw className="w-5 h-5 text-stone-600" />, title: t('landing.feat4Title'), desc: t('landing.feat4Desc') },
    { icon: <Users className="w-5 h-5 text-stone-600" />, title: t('landing.feat5Title'), desc: t('landing.feat5Desc') },
    { icon: <Search className="w-5 h-5 text-stone-600" />, title: t('landing.feat6Title'), desc: t('landing.feat6Desc') },
  ];

  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans selection:bg-stone-200">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-stone-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">MindX</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/skills" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden md:block">
              Skills
            </Link>
            <LanguageSwitcher />
            <button
              onClick={() => setShowAuth(true)}
              className="text-sm font-medium bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors"
            >
              {t('nav.getStarted')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-12"
          >

            {INTEGRATIONS.map((item) => (
              <div 
                key={item.name}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm hover:shadow-md transition-all cursor-default group ${
                  item.highlight
                    ? 'bg-stone-900 border-stone-700 ring-2 ring-stone-400/30'
                    : 'bg-stone-50 border-stone-200/60 hover:border-stone-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full ${item.highlight ? 'bg-stone-700' : item.color} flex items-center justify-center ${item.highlight ? 'text-white' : 'text-stone-600'} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-semibold ${item.highlight ? 'text-white' : 'text-stone-700'}`}>{item.name}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-stone-900"
          >
            {t('landing.heroTitle1')} <br className="hidden md:block" />
            <span className="text-stone-400">
              {t('landing.heroTitle2')}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('landing.heroDesc')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="relative">
              <div className="flex items-stretch">
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-l-md font-medium hover:bg-stone-800 transition-colors"
                >
                  {t('nav.getStarted')} <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowVersionMenu(!showVersionMenu)}
                  className="flex items-center bg-stone-900 text-white px-2 py-3 rounded-r-md border-l border-stone-700 hover:bg-stone-800 transition-colors"
                >
                  <svg className={`w-4 h-4 transition-transform ${showVersionMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
              {showVersionMenu && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-md shadow-lg border border-stone-200 overflow-hidden z-50">
                  <button
                    onClick={() => { setShowVersionMenu(false); setShowAuth(true); }}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-between"
                  >
                    V1 <span className="text-[10px] text-stone-400">当前版本</span>
                  </button>
                  <button
                    onClick={() => { setShowVersionMenu(false); window.open('https://mindx-ux.vercel.app/v2', '_blank'); }}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-between border-t border-stone-100"
                  >
                    V2 <span className="text-[10px] text-accent-terracotta text-orange-600">NEW</span>
                  </button>
                </div>
              )}
            </div>
            <a
              href="/mindx-presentation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-stone-800 px-6 py-3 rounded-md font-medium hover:bg-stone-50 transition-colors border border-stone-200"
            >
              {t('landing.seeHow')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 bg-stone-50 border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-stone-900">{t('landing.workflowTitle')}</h2>
            <p className="text-stone-500">{t('landing.workflowDesc')}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-6 rounded-xl bg-white border border-stone-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded bg-stone-100 flex items-center justify-center text-stone-600 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-medium mb-2 text-stone-900">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition / Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-stone-900">{t('landing.featuresTitle')}</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              {t('landing.featuresDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="p-6 rounded-xl bg-white border border-stone-200 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded bg-stone-50 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-medium mb-2 text-stone-900">{feat.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-stone-200 py-8 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-medium text-stone-900">MindX</span>
          </div>
          <p className="text-stone-500 text-sm">{t('landing.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
