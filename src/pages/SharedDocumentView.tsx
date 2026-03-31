import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Clock, 
  Sparkles,
  FileText,
  Eye,
  Users,
  Copy,
  Check,
  ArrowRight,
  Globe,
  Zap,
  Shield
} from 'lucide-react';
import { SmartDocIcon } from '../components/DocIcons';
import { useLanguage } from '../i18n/LanguageContext';

interface Paragraph {
  id: string;
  text: string;
  author: string;
  authorType: 'human' | 'agent';
}

export default function SharedDocumentView() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  const documentTitle = lang === 'zh' ? 'Project Alpha 系统架构文档' : 'Project Alpha Architecture';
  const ownerName = 'Clark Young';
  const lastEditedBy = 'Claude Assistant';
  const lastEditedTime = lang === 'zh' ? '2 分钟前' : '2 mins ago';

  const paragraphs: Paragraph[] = [
    { id: 'p1', text: '## Project Alpha Architecture', author: 'Clark Young', authorType: 'human' },
    { id: 'p2', text: 'This document outlines the core architecture for Project Alpha.', author: 'Clark Young', authorType: 'human' },
    { id: 'p3', text: '### 1. Overview', author: 'Clark Young', authorType: 'human' },
    { id: 'p4', text: 'The system is composed of three main microservices:\n- **Auth Service**: Handles user authentication and authorization.\n- **Data Service**: Manages the core business data and database interactions.\n- **Notification Service**: Sends emails and push notifications.', author: 'Claude Assistant', authorType: 'agent' },
    { id: 'p5', text: 'Each service is independently deployable and communicates through well-defined APIs. This architecture allows for better scalability and maintainability.', author: 'Clark Young', authorType: 'human' },
    { id: 'p6', text: '### 2. Auth Service Details', author: 'Clark Young', authorType: 'human' },
    { id: 'p7', text: 'The Auth Service implements JWT-based authentication with refresh token rotation. It supports OAuth2.0 for third-party integrations including Google, GitHub, and Microsoft.', author: 'Claude Assistant', authorType: 'agent' },
    { id: 'p8', text: 'Security features include:\n- Rate limiting on login attempts\n- Multi-factor authentication support\n- Session management with Redis\n- Password hashing using bcrypt with salt rounds of 12', author: 'Claude Assistant', authorType: 'agent' },
    { id: 'p9', text: '### 3. Data Service Architecture', author: 'Clark Young', authorType: 'human' },
    { id: 'p10', text: 'The Data Service handles all business logic and database operations. It implements the repository pattern for data access and uses TypeORM as the ORM layer.', author: 'Clark Young', authorType: 'human' },
    { id: 'p11', text: '#### 3.1 Database Schema', author: 'Clark Young', authorType: 'human' },
    { id: 'p12', text: 'We will use PostgreSQL for the primary database. We will use Redis for caching to improve performance. The schema is designed to be highly normalized to ensure data integrity.', author: 'Claude Assistant', authorType: 'agent' },
    { id: 'p13', text: 'Key tables include:\n- **users**: Store user profiles and credentials\n- **workspaces**: Organize user documents and projects\n- **documents**: Store document metadata and content\n- **permissions**: Handle access control and sharing', author: 'Claude Assistant', authorType: 'agent' },
    { id: 'p14', text: '#### 3.2 Caching Strategy', author: 'Clark Young', authorType: 'human' },
    { id: 'p15', text: 'Redis is used for caching frequently accessed data with TTL-based expiration. Cache invalidation follows a write-through pattern to ensure consistency.', author: 'Claude Assistant', authorType: 'agent' },
    { id: 'p16', text: '### 4. Notification Service', author: 'Clark Young', authorType: 'human' },
    { id: 'p17', text: 'The Notification Service manages all outbound communications including emails, SMS, and push notifications. It uses a message queue (RabbitMQ) for reliable delivery.', author: 'Claude Assistant', authorType: 'agent' },
    { id: 'p18', text: 'Notification templates are stored in the database and support internationalization. The service tracks delivery status and provides retry mechanisms for failed notifications.', author: 'Claude Assistant', authorType: 'agent' },
    { id: 'p19', text: '### 5. API Gateway', author: 'Clark Young', authorType: 'human' },
    { id: 'p20', text: 'An API Gateway sits in front of all microservices to handle routing, rate limiting, and authentication. It uses Kong for its robust plugin ecosystem.', author: 'Clark Young', authorType: 'human' },
    { id: 'p21', text: '### 6. Deployment', author: 'Clark Young', authorType: 'human' },
    { id: 'p22', text: 'The application will be containerized using Docker and deployed to a Kubernetes cluster. Maya also wants staging approval checkpoints called out before the release section.', author: 'Maya Chen', authorType: 'human' },
    { id: 'p23', text: '#### 6.1 CI/CD Pipeline', author: 'Clark Young', authorType: 'human' },
    { id: 'p24', text: 'The CI/CD pipeline uses GitHub Actions for automated testing and deployment:\n1. Code push triggers automated tests\n2. Successful tests build Docker images\n3. Images are pushed to container registry\n4. Staging environment is automatically updated\n5. After approval, production deployment is triggered', author: 'Claude Assistant', authorType: 'agent' },
    { id: 'p25', text: '### 7. Monitoring and Observability', author: 'Clark Young', authorType: 'human' },
    { id: 'p26', text: 'We use Prometheus for metrics collection, Grafana for visualization, and ELK stack for log aggregation. Distributed tracing is implemented using Jaeger.', author: 'Claude Assistant', authorType: 'agent' },
  ];

  const collaborators = [
    { name: 'Clark Young', type: 'human' },
    { name: 'Maya Chen', type: 'human' },
    { name: 'Claude Assistant', type: 'agent' },
    { name: 'Research Bot', type: 'agent' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Render paragraph text with basic markdown-like formatting
  const renderText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold
      let processed: React.ReactNode[] = [line];
      const boldParts = line.split(/\*\*(.*?)\*\*/g);
      if (boldParts.length > 1) {
        processed = boldParts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-semibold text-stone-900">{part}</strong> : part
        );
      }
      
      if (line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-2 ml-4">
            <span className="text-stone-400 mt-0.5">•</span>
            <span>{processed.length > 1 ? processed : line.substring(2)}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\./)?.[1];
        return (
          <div key={i} className="flex gap-2 ml-4">
            <span className="text-stone-400 font-medium">{num}.</span>
            <span>{line.replace(/^\d+\.\s/, '')}</span>
          </div>
        );
      }
      return <div key={i}>{processed}</div>;
    });
  };

  return (
    <div className="h-screen bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-stone-200 overflow-hidden">
      
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-stone-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <SmartDocIcon size={24} />
          <div>
            <h1 className="text-sm font-semibold text-stone-900">{documentTitle}</h1>
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <span>{lang === 'zh' ? '分享者' : 'Shared by'} {ownerName}</span>
              <span>·</span>
              <Eye className="w-3 h-3" />
              <span>{lang === 'zh' ? '只读' : 'View Only'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-stone-400 mr-2">
            <Clock className="w-3 h-3" />
            {lang === 'zh' ? `最后编辑于 ${lastEditedTime}` : `Last edited ${lastEditedTime}`} · {lastEditedBy}
          </div>
          
          {/* Collaborator avatars */}
          <div className="flex -space-x-2 mr-2">
            {collaborators.slice(0, 4).map((c, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium border-2 border-white ${
                  c.type === 'agent' ? 'bg-stone-100 text-stone-500' : 'bg-stone-200 text-stone-700'
                }`}
                title={c.name}
                style={{ zIndex: 10 + i }}
              >
                {c.type === 'agent' ? <Bot className="w-3 h-3" /> : c.name.charAt(0)}
              </div>
            ))}
          </div>

          {/* Copy link button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 border border-stone-200 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink 
              ? (lang === 'zh' ? '已复制' : 'Copied') 
              : (lang === 'zh' ? '复制链接' : 'Copy Link')}
          </button>

        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="max-w-3xl mx-auto p-8 lg:p-12">
          
          {/* Document Meta Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-start gap-4">
              <SmartDocIcon size={40} />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-stone-900 mb-1">{documentTitle}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {collaborators.length} {lang === 'zh' ? '位协作者' : 'collaborators'}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Smart Doc</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lang === 'zh' ? '创建于 3 天前' : 'Created 3 days ago'}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Project Alpha', 'PRD'].map(label => (
                    <span key={label} className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md text-[11px] font-medium">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Document Content - Read Only */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            {paragraphs.map((p) => (
              <div key={p.id} className="group relative pl-10">
                {/* Author indicator on hover */}
                <div className="absolute left-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-sm ${
                    p.authorType === 'agent' 
                      ? 'bg-stone-50 text-stone-500 border-stone-200' 
                      : 'bg-stone-100 text-stone-700 border-stone-300'
                  }`} title={`${lang === 'zh' ? '作者' : 'Written by'}: ${p.author}`}>
                    {p.authorType === 'agent' ? <Bot className="w-3 h-3" /> : p.author.charAt(0)}
                  </div>
                </div>
                
                <div className="text-stone-800 font-sans text-lg leading-relaxed whitespace-pre-wrap">
                  {p.text.startsWith('##') ? (
                    <h2 className="text-2xl font-bold text-stone-900 mb-2 mt-6">
                      {p.text.replace(/^#+\s*/, '')}
                    </h2>
                  ) : p.text.startsWith('####') || p.text.startsWith('#### ') ? (
                    <h4 className="text-base font-semibold text-stone-900 mb-1 mt-4">
                      {p.text.replace(/^#+\s*/, '')}
                    </h4>
                  ) : p.text.startsWith('###') ? (
                    <h3 className="text-xl font-bold text-stone-900 mb-1 mt-5">
                      {p.text.replace(/^#+\s*/, '')}
                    </h3>
                  ) : (
                    <div className="space-y-1">{renderText(p.text)}</div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bottom CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 mb-8"
          >
            <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-2xl p-8 text-white relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold">MindX</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  {lang === 'zh' 
                    ? '这篇文档由 AI Agent 与人类共同创作' 
                    : 'This document was co-created by AI Agents & Humans'}
                </h3>
                <p className="text-sm text-white/60 mb-6 max-w-lg">
                  {lang === 'zh' 
                    ? 'MindX 是新一代人机协作知识管理平台。让 AI Agent 成为你的超级队友，自动撰写文档、分析数据、追踪项目进展。'
                    : 'MindX is a next-gen knowledge platform. Let AI Agents become your super teammates — auto-draft docs, analyze data, and track projects.'}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  {[
                    { icon: <Bot className="w-4 h-4" />, text: lang === 'zh' ? 'AI Agent 实时协作' : 'Real-time AI Agent collab' },
                    { icon: <FileText className="w-4 h-4" />, text: lang === 'zh' ? '智能文档自动生成' : 'Smart doc auto-generation' },
                    { icon: <Shield className="w-4 h-4" />, text: lang === 'zh' ? '企业级安全与权限' : 'Enterprise security & permissions' },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      {feature.text}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCTA(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-xl text-sm font-semibold hover:bg-stone-100 transition-colors shadow-lg"
                  >
                    <Zap className="w-4 h-4" />
                    {lang === 'zh' ? '免费开始使用' : 'Get Started Free'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open('https://mindx.app', '_blank')}
                    className="flex items-center gap-2 px-5 py-3 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {lang === 'zh' ? '了解更多' : 'Learn More'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Sticky bottom bar — always visible */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-t border-stone-700 px-6 py-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">MindX</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <span>
            {lang === 'zh' 
              ? '人机协作知识管理平台 — 让 AI Agent 成为你的超级队友' 
              : 'Human-AI Knowledge Platform — Make AI Agents your super teammates'}
          </span>
        </div>
        <button
          onClick={() => setShowCTA(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-stone-900 rounded-lg text-xs font-semibold hover:bg-stone-100 transition-colors shadow-sm"
        >
          <Zap className="w-3 h-3" />
          {lang === 'zh' ? '免费使用 MindX' : 'Try MindX Free'}
        </button>
      </div>

      {/* CTA Modal */}
      {showCTA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCTA(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header image area */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M20%200L40%2020L20%2040L0%2020Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-1">
                  {lang === 'zh' ? '欢迎使用 MindX' : 'Welcome to MindX'}
                </h2>
                <p className="text-sm text-white/60">
                  {lang === 'zh' ? '开启人机协作新体验' : 'Start your Human-AI collaboration journey'}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {[
                  { icon: '🤖', title: lang === 'zh' ? 'AI Agent 实时协作' : 'Real-time AI Agent Collaboration', desc: lang === 'zh' ? '多个 Agent 同时参与文档创作和知识管理' : 'Multiple agents co-creating docs in real-time' },
                  { icon: '📄', title: lang === 'zh' ? '智能文档引擎' : 'Smart Document Engine', desc: lang === 'zh' ? '自动生成报告、分析数据、汇总信息' : 'Auto-generate reports, analyze data, summarize info' },
                  { icon: '🔒', title: lang === 'zh' ? '安全可控' : 'Secure & Controlled', desc: lang === 'zh' ? '精细的权限管理，企业级安全保障' : 'Fine-grained permissions, enterprise-grade security' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-stone-900">{item.title}</div>
                      <div className="text-[11px] text-stone-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/?from=shared')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10"
              >
                <Zap className="w-4 h-4" />
                {lang === 'zh' ? '免费注册 / 登录' : 'Sign Up / Sign In Free'}
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowCTA(false)}
                className="w-full mt-3 text-xs text-stone-400 hover:text-stone-600 transition-colors text-center py-2"
              >
                {lang === 'zh' ? '稍后再说' : 'Maybe later'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
