import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  Terminal, 
  Zap, 
  Users,
  X
} from 'lucide-react';
import { LanguageSwitcher, useLanguage } from '../i18n/LanguageContext';

interface OnboardingWizardProps {
  onComplete: (agentName: string) => void;
  onClose: () => void;
}

export default function OnboardingWizard({ onComplete, onClose }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [agentName, setAgentName] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { lang } = useLanguage();

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(agentName || (lang === 'zh' ? '我的第一个 Agent' : 'My First Agent'));
    }
  };

  const installPrompt = `1. Install MindX Docs Skill
Download the zip package from https://cdn.mindx.com/static/mindx-docs.zip and unzip it, help me install this skill, and then set the environment variable MINDX_TOKEN="mx_agt_demo_token_12345".

2. Install Tencent Docs Skill
Download the zip package from https://cdn.addon.tencentsuite.com/static/tencent-docs.zip and unzip it, help me install this skill, and then set the environment variable TENCENT_DOCS_TOKEN="8678a272066b4156ae2ad95c2709cc2b".`;

  const copyToken = () => {
    navigator.clipboard.writeText(installPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[450px]"
      >
        {/* Left Sidebar - Progress */}
        <div className="w-full md:w-48 shrink-0 bg-stone-50 border-r border-stone-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight">{lang === 'zh' ? 'MindX 引导' : 'MindX Onboarding'}</span>
            </div>

            <div className="space-y-6">
              {[
                { s: 1, label: lang === 'zh' ? '欢迎' : 'Welcome' },
                { s: 2, label: lang === 'zh' ? '身份' : 'Identity' },
                { s: 3, label: lang === 'zh' ? '集成' : 'Integration' },
                { s: 4, label: lang === 'zh' ? '就绪' : 'Ready' }
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                    step >= item.s ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-500'
                  }`}>
                    {step > item.s ? <Check className="w-3 h-3" /> : item.s}
                  </div>
                  <span className={`text-xs font-medium ${step >= item.s ? 'text-stone-900' : 'text-stone-400'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> {lang === 'zh' ? '跳过引导' : 'Skip onboarding'}
          </button>
        </div>

        {/* Right Content - Steps */}
        <div className="flex-1 p-8 md:p-12 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-6">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">{lang === 'zh' ? '欢迎来到 MindX' : 'Welcome to MindX'}</h2>
                  <p className="text-stone-500 leading-relaxed">
                    {lang === 'zh' 
                      ? 'MindX 是一个为人类和 AI Agent 共同设计的协作空间。让我们设置你的第一个 Agent，开始协作吧。'
                      : "MindX is a collaborative space designed for both humans and AI agents. Let's set up your first agent so you can start building together."}
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-6">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">{lang === 'zh' ? '为你的 Agent 命名' : 'Name your Agent'}</h2>
                  <p className="text-stone-500 leading-relaxed mb-6">
                    {lang === 'zh' 
                      ? '为你的第一个 Agent 起个名字。它将出现在文档历史和评论中。'
                      : 'Give your first agent a name. This is how it will be identified in document histories and comments.'}
                  </p>
                  <input 
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder={lang === 'zh' ? '例如 Claude Assistant' : 'e.g. Claude Assistant'}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                    autoFocus
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-6">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">{lang === 'zh' ? '连接你的 Agent' : 'Connect your Agent'}</h2>
                  <p className="text-stone-500 leading-relaxed">
                    {lang === 'zh'
                      ? '复制提示词，粘贴到你的 AI Agent 中回车即可。'
                      : 'Copy the prompt, paste it into your AI Agent and hit Enter.'}
                  </p>
                  <div className="relative">
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 pr-20 text-xs font-mono text-stone-600 leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap">
                      {installPrompt.slice(0, 160)}...
                    </div>
                    <button 
                      onClick={copyToken}
                      className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-medium text-stone-600 hover:text-stone-800 transition-colors"
                    >
                      {isCopied ? <><Check className="w-3.5 h-3.5 text-emerald-500" />{lang === 'zh' ? '已复制' : 'Copied'}</> : <><Copy className="w-3.5 h-3.5" />{lang === 'zh' ? '复制' : 'Copy'}</>}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-6">
                    <Users className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">{lang === 'zh' ? '开始协作' : 'Start Collaborating'}</h2>
                  <p className="text-stone-500 leading-relaxed">
                    {lang === 'zh'
                      ? `一切就绪！你的 Agent ${agentName ? `"${agentName}"` : ''} 已加入你的空间。你现在可以创建文档，实时查看 Agent 的贡献。`
                      : `You're all set! Your agent ${agentName ? `"${agentName}"` : ''} is now part of your space. You can now create documents and see your agent's contributions in real-time.`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-12 flex justify-end items-center gap-3">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-sm text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors"
              >
                {lang === 'zh' ? '上一步' : 'Back'}
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={step === 2 && !agentName.trim()}
              className="flex items-center gap-2 bg-stone-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-stone-900/10"
            >
              {step === totalSteps 
                ? (lang === 'zh' ? '进入空间' : 'Go to Space') 
                : (lang === 'zh' ? '继续' : 'Continue')} 
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
