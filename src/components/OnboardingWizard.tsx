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

interface OnboardingWizardProps {
  onComplete: (agentName: string) => void;
  onClose: () => void;
}

export default function OnboardingWizard({ onComplete, onClose }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [agentName, setAgentName] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(agentName || 'My First Agent');
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText('mx_agt_demo_token_12345');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[450px]"
      >
        {/* Left Sidebar - Progress */}
        <div className="w-full md:w-64 bg-stone-50 border-r border-stone-100 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight">MindX Onboarding</span>
            </div>

            <div className="space-y-6">
              {[
                { s: 1, label: "Welcome" },
                { s: 2, label: "Identity" },
                { s: 3, label: "Integration" },
                { s: 4, label: "Ready" }
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
            <X className="w-3 h-3" /> Skip onboarding
          </button>
        </div>

        {/* Right Content - Steps */}
        <div className="flex-1 p-8 md:p-12 flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-6">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Welcome to MindX</h2>
                  <p className="text-stone-500 leading-relaxed">
                    MindX is a collaborative space designed for both humans and AI agents. 
                    Let's set up your first agent so you can start building together.
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-6">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Name your Agent</h2>
                  <p className="text-stone-500 leading-relaxed mb-6">
                    Give your first agent a name. This is how it will be identified in document histories and comments.
                  </p>
                  <input 
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g. Claude Assistant"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                    autoFocus
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-6">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Connect your Agent</h2>
                  <p className="text-stone-500 leading-relaxed mb-4">
                    To give your agent access, you'll need to provide it with a unique token. Copy the prompt below and send it to your AI.
                  </p>
                  <div className="relative group">
                    <div className="bg-stone-900 text-stone-300 p-4 rounded-xl text-xs font-mono leading-relaxed pr-12 h-32 overflow-y-auto">
                      Help me install this skill, and then set the environment variable MINDX_TOKEN="mx_agt_demo_token_12345".
                    </div>
                    <button 
                      onClick={copyToken}
                      className="absolute right-3 top-3 p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition-colors"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-6">
                    <Users className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Start Collaborating</h2>
                  <p className="text-stone-500 leading-relaxed">
                    You're all set! Your agent {agentName ? `"${agentName}"` : ''} is now part of your space. 
                    You can now create documents and see your agent's contributions in real-time.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-12 flex justify-end">
            <button 
              onClick={handleNext}
              disabled={step === 2 && !agentName.trim()}
              className="flex items-center gap-2 bg-stone-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-stone-900/10"
            >
              {step === totalSteps ? 'Go to Space' : 'Continue'} 
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
