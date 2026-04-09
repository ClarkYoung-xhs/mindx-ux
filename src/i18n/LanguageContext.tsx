import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "zh";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav & Common
    "nav.howItWorks": "How it Works",
    "nav.signIn": "Sign In",
    "nav.getStarted": "Get Started",
    "common.search": "Search...",
    "common.back": "Back",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.create": "Create",
    "common.delete": "Delete",
    "common.copy": "Copy",
    "common.copied": "Copied!",

    // Landing Page - Hero
    "landing.integrations": "Integrations",
    "landing.heroTitle1": "Make your agent",
    "landing.heroTitle2": "powerful.",
    "landing.heroDesc":
      "Supercharge your agent with production-grade skills and persistent memory — from vibe coding to real apps, from scattered notes to a personal knowledge graph.",
    "landing.seeHow": "See How It Works",

    // Landing Page - Workflow
    "landing.workflowTitle": "How MindX Works",
    "landing.workflowDesc":
      "Four simple steps to give your agents superpowers.",
    "landing.step1Title": "1. Register",
    "landing.step1Desc":
      "Create your MindX account and access your shared space.",
    "landing.step2Title": "2. Create Agent",
    "landing.step2Desc":
      "Add an agent account to your space to generate a unique token.",
    "landing.step3Title": "3. Prompt Agent",
    "landing.step3Desc": "Send the generated Skill + Token prompt to your AI.",
    "landing.step4Title": "4. Superpowers",
    "landing.step4Desc":
      "Your agent can now read, write, and manage documents in your space.",

    // Landing Page - Features
    "landing.featuresTitle": "Core Capabilities",
    "landing.featuresDesc":
      "Two superpowers for your agent: Skill Booster and Ultimate Memory.",
    "landing.feat1Title": "Online Rich-Text Editing",
    "landing.feat1Desc":
      "Your agent can create interactive rich-text documents — not just Markdown. Work with docs like a human.",
    "landing.feat2Title": "One-Click Deployment",
    "landing.feat2Desc":
      "Vibe coding apps are local-only by default. MindX lets your agent deploy them to the cloud effortlessly — share a link and anyone can access instantly.",
    "landing.feat3Title": "Built-in Database",
    "landing.feat3Desc":
      "Vibe coding usually produces frontend-only demos. With MindX's built-in database, your agent can build full-stack apps with real server-side persistence — effortlessly.",
    "landing.feat4Title": "Cross-Agent Memory Migration",
    "landing.feat4Desc":
      "Seamlessly transfer your preferences and context between Claude, Antigravity, Codex and more.",
    "landing.feat5Title": "Ultimate Digital Twin",
    "landing.feat5Desc":
      "Build the most complete personal profile from chats, docs, and behavior. Your agent knows you better than you.",
    "landing.feat6Title": "Knowledge Compilation",
    "landing.feat6Desc":
      "Compile scattered notes and thoughts into structured insights, building a personalized knowledge graph from massive raw data.",

    // Landing Page - Footer
    "landing.copyright": "© 2026 MindX Platform. All rights reserved.",

    // Auth Modal
    "auth.signInTitle": "Sign in to MindX",
    "auth.checkEmail": "Check your email",
    "auth.emailPrompt": "Enter your email to receive a verification code",
    "auth.codeSentTo": "Code sent to",
    "auth.emailLabel": "Email Address",
    "auth.emailPlaceholder": "you@example.com",
    "auth.continue": "Continue",
    "auth.sendingCode": "Sending code...",
    "auth.codeLabel": "Verification Code",
    "auth.codePlaceholder": "Enter 6-digit code",
    "auth.demoCode": "Demo code:",
    "auth.resendIn": "Resend in",
    "auth.resendCode": "Resend code",
    "auth.verify": "Verify & Sign In",
    "auth.terms":
      "By continuing, you agree to MindX's Terms of Service and Privacy Policy.",
    "auth.invalidEmail": "Please enter a valid email address",
    "auth.invalidCode": "Invalid code. Please enter 123456",

    // Dashboard - Sidebar
    "sidebar.workspace": "Workspace",
    "sidebar.newWorkspace": "New Workspace",
    "sidebar.documents": "Documents",
    "sidebar.activityFeed": "Activity Feed",
    "sidebar.accessControl": "Access Control",
    "sidebar.settings": "Settings",
    "sidebar.global": "Global",
    "sidebar.agentAccounts": "Agent Accounts",
    "sidebar.humanAccounts": "Human Accounts",
    "sidebar.humanAccount": "My Account",

    // Dashboard - Documents
    "docs.title": "Documents",
    "docs.newDoc": "New",
    "docs.name": "Name",
    "docs.type": "Type",
    "docs.date": "Date",
    "docs.creator": "Creator",
    "docs.smartCanvas": "Smart Canvas",
    "docs.smartSheet": "Smart Sheet",
    "docs.page": "Page",

    // Dashboard - Agent
    "agent.title": "Agent Accounts",
    "agent.newAgent": "New Agent",
    "agent.createTitle": "Create New Agent",
    "agent.namePlaceholder": "Agent name...",
    "agent.globalAccount": "Global Agent Account",
    "agent.token": "Agent Token",
    "agent.integrationPrompt": "Integration Prompt",
    "agent.recentActivity": "Recent Activity",
    "agent.noActivity": "No activity recorded for this agent",
    "agent.backToAgents": "Back to Agents",
    "agent.activities": "activities",

    // Dashboard - Human
    "human.title": "Human Accounts",
    "human.newHuman": "+ New Human",
    "human.human": "Human",
    "human.email": "Email",
    "human.noActivity": "No activity recorded for this user",
    "human.backToHumans": "Back to Humans",

    // Dashboard - Access Control
    "access.title": "Access Control",
    "access.member": "Member",
    "access.memberType": "Type",
    "access.role": "Role",

    // Dashboard - Settings
    "settings.title": "Settings",
    "settings.workspaceName": "Space Name",
    "settings.dangerZone": "Danger Zone",
    "settings.deleteWorkspace": "Delete Space",
    "settings.deleteDesc":
      "Once you delete this space, there is no going back. Please be certain.",

    // Dashboard - Activity Feed
    "activity.title": "Activity Feed",
    "activity.thisWeek": "This Week",
    "activity.earlier": "Earlier",

    // Dashboard - Extra UI
    "sidebar.core": "Core",
    "sidebar.labels": "Labels",
    "docs.owner": "Creator",
    "docs.labels": "Labels",
    "docs.lastModified": "Last Modified",
    "docs.lastViewed": "Last Viewed",
    "docs.all": "All",
    "docs.allTypes": "All Types",
    "docs.allLabels": "All Labels",
    "docs.filterByType": "Filter by type",
    "docs.filterByLabel": "Filter by label",
    "docs.sortBy": "Sort by",
    "docs.document": "Document",
    "docs.noLabels": "No Labels Yet",
    "docs.noLabelsDesc": "Labels will appear here once documents are tagged.",
    "docs.actions.download": "Export as PDF",
    "docs.actions.delete": "Delete",
    "access.addAgent": "Add Agent",
    "common.new": "New",
    "docs.filterByOwner": "Filter by creator",
    "docs.allOwners": "All Creators",
    "docs.actions.share": "Share",
    "share.title": "Share Document",
    "share.desc": "Share this document via a public link",
    "share.publicLink": "Public Link",
    "share.anyoneWithLink": "Anyone with this link can view this document.",
  },
  zh: {
    // Nav & Common
    "nav.howItWorks": "了解详情",
    "nav.signIn": "登录",
    "nav.getStarted": "开始使用",
    "common.search": "搜索...",
    "common.back": "返回",
    "common.cancel": "取消",
    "common.save": "保存",
    "common.create": "创建",
    "common.delete": "删除",
    "common.copy": "复制",
    "common.copied": "已复制！",

    // Landing Page - Hero
    "landing.integrations": "集成平台",
    "landing.heroTitle1": "让你的 Agent",
    "landing.heroTitle2": "更加强大",
    "landing.heroDesc":
      "为你的 Agent 装上生产级技能与持久记忆——从 vibe coding 到真实应用，从碎片笔记到个人知识图谱。",
    "landing.seeHow": "了解工作原理",

    // Landing Page - Workflow
    "landing.workflowTitle": "MindX 如何运作",
    "landing.workflowDesc": "四个简单步骤，让你的 Agent 拥有超能力。",
    "landing.step1Title": "1. 注册账号",
    "landing.step1Desc": "创建 MindX 账号，进入你的共享空间。",
    "landing.step2Title": "2. 创建 Agent",
    "landing.step2Desc": "在空间中添加 Agent 账号并生成专属 Token。",
    "landing.step3Title": "3. 配置 Agent",
    "landing.step3Desc": "将生成的 Skill + Token 提示词发送给你的 AI。",
    "landing.step4Title": "4. 开始工作",
    "landing.step4Desc": "你的 Agent 现在可以在空间中读写和管理文档了。",

    // Landing Page - Features
    "landing.featuresTitle": "核心能力",
    "landing.featuresDesc":
      "两大超能力加持你的 Agent：技能增强 & 终极记忆。",
    "landing.feat1Title": "在线富文本能力",
    "landing.feat1Desc":
      "Agent 不只能写 Markdown，还能创建带交互的在线富文本文档——像人类一样使用文档套件。",
    "landing.feat2Title": "傻瓜式部署到线上",
    "landing.feat2Desc":
      "Vibe coding 默认做出的是本地网页。通过 MindX 增强，你的 Agent 可以轻而易举地将应用部署到线上，分享链接即可访问。",
    "landing.feat3Title": "数据库能力",
    "landing.feat3Desc":
      "Vibe coding 默认只能做纯前端 Demo。有了 MindX 内置数据库，你的 Agent 可以轻松构建有服务端能力的完整应用。",
    "landing.feat4Title": "跨 Agent 记忆迁移",
    "landing.feat4Desc":
      "在 Claude、Antigravity、Codex 之间无缝迁移你的偏好、习惯与上下文。换 Agent 不丢记忆。",
    "landing.feat5Title": "打造最全的个人数字分身",
    "landing.feat5Desc":
      "从聊天记录、文档、行为数据中提炼出完整的个人画像——你的 Agent 比你更懂你。",
    "landing.feat6Title": "知识编译",
    "landing.feat6Desc":
      "将碎片化的笔记和思考编译为结构化洞察，将海量原始数据构建为个性化的知识图谱。",

    // Landing Page - Footer
    "landing.copyright": "© 2026 MindX 平台。保留所有权利。",

    // Auth Modal
    "auth.signInTitle": "登录 MindX",
    "auth.checkEmail": "查看邮箱",
    "auth.emailPrompt": "输入邮箱以获取验证码",
    "auth.codeSentTo": "验证码已发送至",
    "auth.emailLabel": "邮箱地址",
    "auth.emailPlaceholder": "you@example.com",
    "auth.continue": "继续",
    "auth.sendingCode": "发送中...",
    "auth.codeLabel": "验证码",
    "auth.codePlaceholder": "输入 6 位验证码",
    "auth.demoCode": "演示验证码：",
    "auth.resendIn": "秒后重发",
    "auth.resendCode": "重新发送",
    "auth.verify": "验证并登录",
    "auth.terms": "继续即表示你同意 MindX 的服务条款和隐私政策。",
    "auth.invalidEmail": "请输入有效的邮箱地址",
    "auth.invalidCode": "验证码错误，请输入 123456",

    // Dashboard - Sidebar
    "sidebar.workspace": "工作空间",
    "sidebar.newWorkspace": "新建工作空间",
    "sidebar.documents": "文档",
    "sidebar.activityFeed": "动态",
    "sidebar.accessControl": "权限管理",
    "sidebar.settings": "设置",
    "sidebar.global": "全局",
    "sidebar.agentAccounts": "Agent",
    "sidebar.humanAccounts": "人类账号",
    "sidebar.humanAccount": "我的账号",

    // Dashboard - Documents
    "docs.title": "文档",
    "docs.newDoc": "新建",
    "docs.name": "名称",
    "docs.type": "类型",
    "docs.date": "日期",
    "docs.creator": "创建者",
    "docs.smartCanvas": "智能文档",
    "docs.smartSheet": "智能表格",
    "docs.page": "页面",

    // Dashboard - Agent
    "agent.title": "Agent",
    "agent.newAgent": "新建 Agent",
    "agent.createTitle": "创建新 Agent",
    "agent.namePlaceholder": "Agent 名称...",
    "agent.globalAccount": "全局 Agent 账号",
    "agent.token": "Agent Token",
    "agent.integrationPrompt": "集成提示词",
    "agent.recentActivity": "近期动态",
    "agent.noActivity": "该 Agent 暂无活动记录",
    "agent.backToAgents": "返回 Agent 列表",
    "agent.activities": "条动态",

    // Dashboard - Human
    "human.title": "人类账号",
    "human.newHuman": "+ 新建人类账号",
    "human.human": "人类",
    "human.email": "邮箱",
    "human.noActivity": "该用户暂无活动记录",
    "human.backToHumans": "返回人类账号列表",

    // Dashboard - Access Control
    "access.title": "权限管理",
    "access.member": "成员",
    "access.memberType": "类型",
    "access.role": "角色",

    // Dashboard - Settings
    "settings.title": "设置",
    "settings.workspaceName": "空间名称",
    "settings.dangerZone": "危险操作",
    "settings.deleteWorkspace": "删除空间",
    "settings.deleteDesc": "删除空间后无法恢复，请谨慎操作。",

    // Dashboard - Activity Feed
    "activity.title": "动态",
    "activity.thisWeek": "本周",
    "activity.earlier": "更早",

    // Dashboard - Extra UI
    "sidebar.core": "核心",
    "sidebar.labels": "标签",
    "docs.owner": "创建者",
    "docs.labels": "标签",
    "docs.lastModified": "最近修改",
    "docs.lastViewed": "最近查看",
    "docs.all": "全部",
    "docs.allTypes": "所有类型",
    "docs.allLabels": "所有标签",
    "docs.filterByType": "按类型筛选",
    "docs.filterByLabel": "按标签筛选",
    "docs.sortBy": "排序方式",
    "docs.document": "文档",
    "docs.noLabels": "暂无标签",
    "docs.noLabelsDesc": "文档打标后标签将在此显示。",
    "docs.actions.download": "导出 PDF",
    "docs.actions.delete": "删除",
    "access.addAgent": "添加 Agent",
    "common.new": "新建",
    "docs.filterByOwner": "按创建者筛选",
    "docs.allOwners": "所有创建者",
    "docs.actions.share": "分享",
    "share.title": "分享文档",
    "share.desc": "通过公开链接分享此文档",
    "share.publicLink": "公开链接",
    "share.anyoneWithLink": "拥有链接的人均可查看此文档。",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem("mindx_lang");
    if (stored === "zh" || stored === "en") return stored;
    return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("mindx_lang", newLang);
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
      onClick={() => setLang(lang === "en" ? "zh" : "en")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
      title={lang === "en" ? "切换到中文" : "Switch to English"}
    >
      <span className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center text-[9px] font-bold">
        {lang === "en" ? "中" : "En"}
      </span>
      {lang === "en" ? "中文" : "EN"}
    </button>
  );
}
