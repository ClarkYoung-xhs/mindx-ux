import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav & Common
    'nav.howItWorks': 'How it Works',
    'nav.signIn': 'Sign In',
    'nav.getStarted': 'Get Started',
    'common.search': 'Search...',
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.create': 'Create',
    'common.delete': 'Delete',
    'common.copy': 'Copy',
    'common.copied': 'Copied!',

    // Landing Page - Hero
    'landing.integrations': 'Integrations',
    'landing.heroTitle1': 'One Space for',
    'landing.heroTitle2': 'Humans and AI Agents',
    'landing.heroDesc': 'Give your AI agents the power to create, read, edit, and collaborate on documents. A shared home for Markdown, Office, Tables, and Whiteboards.',
    'landing.seeHow': 'See How It Works',

    // Landing Page - Workflow
    'landing.workflowTitle': 'How MindX Works',
    'landing.workflowDesc': 'Four simple steps to give your agents superpowers.',
    'landing.step1Title': '1. Register',
    'landing.step1Desc': 'Create your MindX account and access your shared space.',
    'landing.step2Title': '2. Create Agent',
    'landing.step2Desc': 'Add an agent account to your space to generate a unique token.',
    'landing.step3Title': '3. Prompt Agent',
    'landing.step3Desc': 'Send the generated Skill + Token prompt to your AI.',
    'landing.step4Title': '4. Superpowers',
    'landing.step4Desc': 'Your agent can now read, write, and manage documents in your space.',

    // Landing Page - Features
    'landing.featuresTitle': 'Core Capabilities',
    'landing.featuresDesc': 'MindX provides the infrastructure your agents need to interact with the real world of documents and data.',
    'landing.feat1Title': 'Create, Read, Edit',
    'landing.feat1Desc': 'Full support for Markdown, Office documents, multi-dimensional tables, and whiteboard drawings.',
    'landing.feat2Title': 'One Shared Space',
    'landing.feat2Desc': 'Start with one shared space so people and agents work in the same context from day one.',
    'landing.feat3Title': 'Agent Accounts',
    'landing.feat3Desc': 'Provision dedicated accounts and tokens for each of your agents to securely access your space.',
    'landing.feat4Title': 'Human-Agent Collaboration',
    'landing.feat4Desc': 'A collaborative UI where humans and agents can work together, including text selection and commenting.',
    'landing.feat5Title': 'Format Conversion',
    'landing.feat5Desc': 'Seamlessly convert between various document formats (e.g., Markdown to PDF, CSV to Table).',

    // Landing Page - Footer
    'landing.copyright': '© 2026 MindX Platform. All rights reserved.',

    // Auth Modal
    'auth.signInTitle': 'Sign in to MindX',
    'auth.checkEmail': 'Check your email',
    'auth.emailPrompt': 'Enter your email to receive a verification code',
    'auth.codeSentTo': 'Code sent to',
    'auth.emailLabel': 'Email Address',
    'auth.emailPlaceholder': 'you@example.com',
    'auth.continue': 'Continue',
    'auth.sendingCode': 'Sending code...',
    'auth.codeLabel': 'Verification Code',
    'auth.codePlaceholder': 'Enter 6-digit code',
    'auth.demoCode': 'Demo code:',
    'auth.resendIn': 'Resend in',
    'auth.resendCode': 'Resend code',
    'auth.verify': 'Verify & Sign In',
    'auth.terms': "By continuing, you agree to MindX's Terms of Service and Privacy Policy.",
    'auth.invalidEmail': 'Please enter a valid email address',
    'auth.invalidCode': 'Invalid code. Please enter 123456',

    // Dashboard - Sidebar
    'sidebar.workspace': 'Workspace',
    'sidebar.newWorkspace': 'New Workspace',
    'sidebar.documents': 'Documents',
    'sidebar.activityFeed': 'Activity Feed',
    'sidebar.accessControl': 'Access Control',
    'sidebar.settings': 'Settings',
    'sidebar.global': 'Global',
    'sidebar.agentAccounts': 'Agent Accounts',
    'sidebar.humanAccounts': 'Human Accounts',
    'sidebar.humanAccount': 'My Account',

    // Dashboard - Documents
    'docs.title': 'Documents',
    'docs.newDoc': 'New',
    'docs.name': 'Name',
    'docs.type': 'Type',
    'docs.date': 'Date',
    'docs.creator': 'Creator',
    'docs.markdown': 'Markdown',
    'docs.table': 'Table',
    'docs.whiteboard': 'Whiteboard',
    'docs.chatLog': 'Chat Log',
    'docs.smartDoc': 'Smart Doc',
    'docs.form': 'Form',

    // Dashboard - Agent
    'agent.title': 'Agent Accounts',
    'agent.newAgent': '+ New Agent',
    'agent.createTitle': 'Create New Agent',
    'agent.namePlaceholder': 'Agent name...',
    'agent.globalAccount': 'Global Agent Account',
    'agent.token': 'Agent Token',
    'agent.integrationPrompt': 'Integration Prompt',
    'agent.recentActivity': 'Recent Activity',
    'agent.noActivity': 'No activity recorded for this agent',
    'agent.backToAgents': 'Back to Agents',
    'agent.activities': 'activities',

    // Dashboard - Human
    'human.title': 'Human Accounts',
    'human.newHuman': '+ New Human',
    'human.human': 'Human',
    'human.email': 'Email',
    'human.noActivity': 'No activity recorded for this user',
    'human.backToHumans': 'Back to Humans',

    // Dashboard - Access Control
    'access.title': 'Access Control',
    'access.member': 'Member',
    'access.memberType': 'Type',
    'access.role': 'Role',

    // Dashboard - Settings
    'settings.title': 'Settings',
    'settings.workspaceName': 'Space Name',
    'settings.dangerZone': 'Danger Zone',
    'settings.deleteWorkspace': 'Delete Space',
    'settings.deleteDesc': 'Once you delete this space, there is no going back. Please be certain.',

    // Dashboard - Activity Feed
    'activity.title': 'Activity Feed',
    'activity.thisWeek': 'This Week',
    'activity.earlier': 'Earlier',

    // Dashboard - Extra UI
    'sidebar.core': 'Core',
    'sidebar.labels': 'Labels',
    'docs.owner': 'Creator',
    'docs.labels': 'Labels',
    'docs.lastModified': 'Last Modified',
    'docs.lastViewed': 'Last Viewed',
    'docs.all': 'All',
    'docs.allTypes': 'All Types',
    'docs.allLabels': 'All Labels',
    'docs.filterByType': 'Filter by type',
    'docs.filterByLabel': 'Filter by label',
    'docs.sortBy': 'Sort by',
    'docs.document': 'Document',
    'docs.noLabels': 'No Labels Yet',
    'docs.noLabelsDesc': 'Labels will appear here once documents are tagged.',
    'docs.actions.download': 'Export as PDF',
    'docs.actions.delete': 'Delete',
    'access.addAgent': 'Add Agent',
    'common.new': 'New',
    'docs.filterByOwner': 'Filter by creator',
    'docs.allOwners': 'All Creators',
    'docs.actions.share': 'Share',
    'share.title': 'Share Document',
    'share.desc': 'Share this document via a public link',
    'share.publicLink': 'Public Link',
    'share.anyoneWithLink': 'Anyone with this link can view this document.',
  },
  zh: {
    // Nav & Common
    'nav.howItWorks': '了解详情',
    'nav.signIn': '登录',
    'nav.getStarted': '开始使用',
    'common.search': '搜索...',
    'common.back': '返回',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.create': '创建',
    'common.delete': '删除',
    'common.copy': '复制',
    'common.copied': '已复制！',

    // Landing Page - Hero
    'landing.integrations': '集成平台',
    'landing.heroTitle1': '专为',
    'landing.heroTitle2': '人类与 AI Agent 打造的工作空间',
    'landing.heroDesc': '赋予你的 AI Agent 创建、阅读、编辑和协作文档的能力。一个共享空间里完成 Markdown、Office、表格和白板协作。',
    'landing.seeHow': '了解工作原理',

    // Landing Page - Workflow
    'landing.workflowTitle': 'MindX 如何运作',
    'landing.workflowDesc': '四个简单步骤，让你的 Agent 拥有超能力。',
    'landing.step1Title': '1. 注册账号',
    'landing.step1Desc': '创建 MindX 账号，进入你的共享空间。',
    'landing.step2Title': '2. 创建 Agent',
    'landing.step2Desc': '在空间中添加 Agent 账号并生成专属 Token。',
    'landing.step3Title': '3. 配置 Agent',
    'landing.step3Desc': '将生成的 Skill + Token 提示词发送给你的 AI。',
    'landing.step4Title': '4. 开始工作',
    'landing.step4Desc': '你的 Agent 现在可以在空间中读写和管理文档了。',

    // Landing Page - Features
    'landing.featuresTitle': '核心能力',
    'landing.featuresDesc': 'MindX 为你的 Agent 提供与真实文档和数据交互所需的基础设施。',
    'landing.feat1Title': '创建、阅读、编辑',
    'landing.feat1Desc': '全面支持 Markdown、Office 文档、多维表格和白板绘图。',
    'landing.feat2Title': '一个共享空间',
    'landing.feat2Desc': '第一版先聚焦一个共享空间，让人和 Agent 从第一天就在同一上下文里协作。',
    'landing.feat3Title': 'Agent 账号',
    'landing.feat3Desc': '为每个 Agent 配置专属账号和 Token，安全访问你的空间。',
    'landing.feat4Title': '人机协作',
    'landing.feat4Desc': '人类与 Agent 可以在协作界面中共同工作，支持文本选择和评论。',
    'landing.feat5Title': '格式转换',
    'landing.feat5Desc': '在多种文档格式之间无缝转换（例如 Markdown 转 PDF、CSV 转表格）。',

    // Landing Page - Footer
    'landing.copyright': '© 2026 MindX 平台。保留所有权利。',

    // Auth Modal
    'auth.signInTitle': '登录 MindX',
    'auth.checkEmail': '查看邮箱',
    'auth.emailPrompt': '输入邮箱以获取验证码',
    'auth.codeSentTo': '验证码已发送至',
    'auth.emailLabel': '邮箱地址',
    'auth.emailPlaceholder': 'you@example.com',
    'auth.continue': '继续',
    'auth.sendingCode': '发送中...',
    'auth.codeLabel': '验证码',
    'auth.codePlaceholder': '输入 6 位验证码',
    'auth.demoCode': '演示验证码：',
    'auth.resendIn': '秒后重发',
    'auth.resendCode': '重新发送',
    'auth.verify': '验证并登录',
    'auth.terms': '继续即表示你同意 MindX 的服务条款和隐私政策。',
    'auth.invalidEmail': '请输入有效的邮箱地址',
    'auth.invalidCode': '验证码错误，请输入 123456',

    // Dashboard - Sidebar
    'sidebar.workspace': '工作空间',
    'sidebar.newWorkspace': '新建工作空间',
    'sidebar.documents': '文档',
    'sidebar.activityFeed': '动态',
    'sidebar.accessControl': '权限管理',
    'sidebar.settings': '设置',
    'sidebar.global': '全局',
    'sidebar.agentAccounts': 'Agent 账号',
    'sidebar.humanAccounts': '人类账号',
    'sidebar.humanAccount': '我的账号',

    // Dashboard - Documents
    'docs.title': '文档',
    'docs.newDoc': '新建',
    'docs.name': '名称',
    'docs.type': '类型',
    'docs.date': '日期',
    'docs.creator': '创建者',
    'docs.markdown': 'Markdown',
    'docs.table': '表格',
    'docs.whiteboard': '白板',
    'docs.chatLog': '会话记录',
    'docs.smartDoc': '智能文档',
    'docs.form': '收集表',

    // Dashboard - Agent
    'agent.title': 'Agent 账号',
    'agent.newAgent': '+ 新建 Agent',
    'agent.createTitle': '创建新 Agent',
    'agent.namePlaceholder': 'Agent 名称...',
    'agent.globalAccount': '全局 Agent 账号',
    'agent.token': 'Agent Token',
    'agent.integrationPrompt': '集成提示词',
    'agent.recentActivity': '近期动态',
    'agent.noActivity': '该 Agent 暂无活动记录',
    'agent.backToAgents': '返回 Agent 列表',
    'agent.activities': '条动态',

    // Dashboard - Human
    'human.title': '人类账号',
    'human.newHuman': '+ 新建人类账号',
    'human.human': '人类',
    'human.email': '邮箱',
    'human.noActivity': '该用户暂无活动记录',
    'human.backToHumans': '返回人类账号列表',

    // Dashboard - Access Control
    'access.title': '权限管理',
    'access.member': '成员',
    'access.memberType': '类型',
    'access.role': '角色',

    // Dashboard - Settings
    'settings.title': '设置',
    'settings.workspaceName': '空间名称',
    'settings.dangerZone': '危险操作',
    'settings.deleteWorkspace': '删除空间',
    'settings.deleteDesc': '删除空间后无法恢复，请谨慎操作。',

    // Dashboard - Activity Feed
    'activity.title': '动态',
    'activity.thisWeek': '本周',
    'activity.earlier': '更早',

    // Dashboard - Extra UI
    'sidebar.core': '核心',
    'sidebar.labels': '标签',
    'docs.owner': '创建者',
    'docs.labels': '标签',
    'docs.lastModified': '最近修改',
    'docs.lastViewed': '最近查看',
    'docs.all': '全部',
    'docs.allTypes': '所有类型',
    'docs.allLabels': '所有标签',
    'docs.filterByType': '按类型筛选',
    'docs.filterByLabel': '按标签筛选',
    'docs.sortBy': '排序方式',
    'docs.document': '文档',
    'docs.noLabels': '暂无标签',
    'docs.noLabelsDesc': '文档打标后标签将在此显示。',
    'docs.actions.download': '导出 PDF',
    'docs.actions.delete': '删除',
    'access.addAgent': '添加 Agent',
    'common.new': '新建',
    'docs.filterByOwner': '按创建者筛选',
    'docs.allOwners': '所有创建者',
    'docs.actions.share': '分享',
    'share.title': '分享文档',
    'share.desc': '通过公开链接分享此文档',
    'share.publicLink': '公开链接',
    'share.anyoneWithLink': '拥有链接的人均可查看此文档。',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('mindx_lang');
    return (stored === 'zh' || stored === 'en') ? stored : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('mindx_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
      title={lang === 'en' ? '切换到中文' : 'Switch to English'}
    >
      <span className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center text-[9px] font-bold">
        {lang === 'en' ? '中' : 'En'}
      </span>
      {lang === 'en' ? '中文' : 'EN'}
    </button>
  );
}
