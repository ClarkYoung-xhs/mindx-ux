import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Package, 
  ArrowRight, 
  Copy, 
  Check, 
  Terminal, 
  FileText, 
  Shield, 
  Zap, 
  Bot
} from 'lucide-react';
import { useLanguage, LanguageSwitcher } from '../i18n/LanguageContext';



export default function SkillsPage() {
  const { t, lang } = useLanguage();
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
  };

  const isZh = lang === 'zh';

  const capabilities = isZh
    ? [
        '创建和编辑 Markdown 文档',
        '读取和解析 Office 文件',
        '管理多维表格',
        '白板绘图',
        '读写云端文档和电子表格',
        '实时协作同步',
        '完整的工作空间权限控制',
        '企业级安全保障',
      ]
    : [
        'Create & edit Markdown documents',
        'Read & parse Office files',
        'Manage multi-dimensional tables',
        'Draw on whiteboards',
        'Read & write cloud documents & spreadsheets',
        'Real-time collaboration sync',
        'Full workspace access control',
        'Enterprise-grade security',
      ];

  const installCommand = `1. Download the zip package from https://cdn.mindx.com/static/mindx-docs.zip and unzip it, help me install this skill, and then set the environment variable MINDX_TOKEN="your_token".

2. Download the zip package from https://cdn.addon.tencentsuite.com/static/tencent-docs.zip and unzip it, help me install this skill, and then set the environment variable TENCENT_DOCS_TOKEN="your_token".`;

  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans selection:bg-stone-200">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-stone-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">MindX</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
              {isZh ? '首页' : 'Home'}
            </Link>
            <LanguageSwitcher />
            <Link
              to="/dashboard"
              className="text-sm font-medium bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors"
            >
              {isZh ? '进入控制台' : 'Dashboard'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-600 mb-6">
              <Package className="w-3.5 h-3.5" />
              {isZh ? 'Skill 市场' : 'Skill Marketplace'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-stone-900">
              {isZh ? '为你的 Agent 安装超能力' : 'Install Superpowers for Your Agents'}
            </h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
              {isZh 
                ? 'Skills 是轻量化的能力插件，让 AI Agent 能够访问真实的文档系统和数据源。只需一条命令即可安装。'
                : 'Skills are lightweight capability plugins that give AI agents access to real document systems and data sources. Install with a single command.'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* How Skills Work */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { 
                icon: <Package className="w-5 h-5" />, 
                title: isZh ? '下载 Skill 包' : 'Download Skill', 
                desc: isZh ? '从 CDN 下载 zip 包并解压到本地' : 'Download the zip package from CDN and unzip locally' 
              },
              { 
                icon: <Terminal className="w-5 h-5" />, 
                title: isZh ? '安装到 Agent' : 'Install to Agent', 
                desc: isZh ? '将安装命令发送给你的 AI，自动完成配置' : 'Send the install command to your AI for auto-configuration' 
              },
              { 
                icon: <Zap className="w-5 h-5" />, 
                title: isZh ? '立即生效' : 'Ready to Use', 
                desc: isZh ? 'Agent 立刻获得读写文档的能力' : 'Agent immediately gains document read/write capabilities' 
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative p-5 rounded-xl bg-stone-50/60 border border-stone-200/60"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-600 shadow-sm text-sm font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">{step.title}</h3>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed pl-11">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Single Skill Card */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold text-stone-900 mb-6">
            {isZh ? '可用 Skills' : 'Available Skills'}
          </h2>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border border-stone-200/80 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-sm shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-stone-900 tracking-tight">
                        MindX Docs
                      </h3>
                      <span className="text-[10px] font-bold text-stone-500 uppercase bg-stone-100 px-1.5 py-0.5 rounded">
                        Core
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 font-medium mb-2">
                      {isZh ? '提供方' : 'by'} MindX
                    </p>
                    <p className="text-sm text-stone-500 leading-relaxed max-w-xl">
                      {isZh 
                        ? '让你的 AI Agent 拥有完整的文档协作能力。支持 Markdown、Office、表格、白板和云端文档的创建、阅读、编辑和管理。'
                        : 'Give your AI agents full document collaboration capabilities. Create, read, edit and manage Markdown, Office, Tables, Whiteboards and cloud documents.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Detail */}
              <div className="border-t border-stone-100">
                <div className="p-6 space-y-6">
                  {/* Capabilities */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                      {isZh ? '能力' : 'Capabilities'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {capabilities.map((cap, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-stone-600">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {cap}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Install Command */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      {isZh ? '安装命令' : 'Install Command'}
                    </h4>
                    <div className="relative group">
                      <div className="bg-stone-900 rounded-xl p-5 text-sm font-mono text-stone-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                        {installCommand}
                      </div>
                      <button
                        onClick={() => copyToClipboard(installCommand, 'install')}
                        className="absolute right-3 top-3 p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-stone-700"
                      >
                        {copiedStates['install'] 
                          ? <Check className="w-4 h-4 text-emerald-400" /> 
                          : <Copy className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* Token Info */}
                  <div className="flex items-start gap-3 bg-amber-50/60 border border-amber-200/50 rounded-xl p-4">
                    <Shield className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800 mb-0.5">
                        {isZh ? '环境变量' : 'Environment Variables'}
                      </p>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        {isZh 
                          ? '安装后需要设置对应的环境变量。在 MindX Dashboard 中创建 Agent 后会自动生成对应的 Token。'
                          : 'After installation, set the required environment variables. Tokens will be generated automatically when you create an Agent in the MindX Dashboard.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-10">
            <Bot className="w-10 h-10 text-stone-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              {isZh ? '准备好让你的 Agent 更强了吗？' : 'Ready to supercharge your agents?'}
            </h2>
            <p className="text-sm text-stone-500 mb-6">
              {isZh 
                ? '创建 Agent 并安装 Skills，让 AI 可以直接读写你的文档。' 
                : 'Create an agent and install Skills to let AI read and write your documents.'
              }
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors text-sm"
            >
              {isZh ? '进入控制台' : 'Go to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </Link>
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
