import { ArrowRight, Clock3, Package2, Search, Sparkles, Target, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../../data/mindxDemo';
import { useMindXDemo } from '../../data/mindxDemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import V2ModuleHeader from './V2ModuleHeader';
import V2MemoryIntakeLauncher from './V2MemoryIntakeLauncher';
import { V2TimelineSignalCard } from './v2Primitives';
import { buildTimelineEntries } from './timelinePresentation';

type MemoryAssistantMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

type MemoryPreviewItem = {
  label?: string;
  title: string;
  body?: string;
  meta?: string;
  badge?: string;
};

type MemoryCardConfig = {
  title: string;
  action: string;
  label: string;
  meta: string;
  editable: boolean;
  previewType: 'memory' | 'goals' | 'knowledge';
  previewItems: MemoryPreviewItem[];
};

function buildMemoryAnswer(
  query: string,
  lang: 'zh' | 'en',
  options: {
    recentSignals: Array<{ title: string; summary: string }>;
    workstreamInsight?: { title: string; body: string };
    preferenceInsight?: { title: string; body: string };
    mountedSummary: string;
    candidateSummary: string;
  }
) {
  const normalizedQuery = query.toLowerCase();

  const asksAboutRecent =
    /最近|今天|recent|today|推进|progress|happen|发生/.test(normalizedQuery);
  const asksAboutPreference =
    /偏好|风格|tone|voice|preference|写作/.test(normalizedQuery);
  const asksAboutMount =
    /挂载|集成|agent|mount|integration|调用|接入/.test(normalizedQuery);
  const asksAboutRisk =
    /风险|follow|待跟进|todo|next|下一步|candidate/.test(normalizedQuery);

  if (asksAboutPreference && options.preferenceInsight) {
    return lang === 'zh'
      ? `${options.preferenceInsight.title}。${options.preferenceInsight.body} 这条偏好已经适合继续挂到写作类 agent 上。`
      : `${options.preferenceInsight.title}. ${options.preferenceInsight.body} This preference is already ready to be mounted into writing-oriented agents.`;
  }

  if (asksAboutMount) {
    return lang === 'zh'
      ? `当前最值得挂载的是三类内容：${options.mountedSummary}。如果你现在要让外部 agent 立即继承上下文，优先挂载已经稳定的偏好、约束和关键决策。`
      : `The most useful things to mount right now are ${options.mountedSummary}. If an external agent needs context immediately, mount stable preferences, constraints, and key decisions first.`;
  }

  if (asksAboutRisk) {
    return lang === 'zh'
      ? `现在最值得追的待确认记忆是：${options.candidateSummary}。它们还没有完全稳定，但已经足够值得继续追问或补证据。`
      : `The most important memory candidates to keep pushing are ${options.candidateSummary}. They are not fully durable yet, but they are strong enough to investigate or support with more evidence.`;
  }

  if (asksAboutRecent || options.workstreamInsight) {
    const signalLead = options.recentSignals[0];
    return lang === 'zh'
      ? `${options.workstreamInsight?.title ?? '最近的主线很清楚'}。${options.workstreamInsight?.body ?? ''}${signalLead ? ` 现在最新正在形成的是“${signalLead.title}”，${signalLead.summary}` : ''}`
      : `${options.workstreamInsight?.title ?? 'The recent thread is fairly clear'}. ${options.workstreamInsight?.body ?? ''}${signalLead ? ` The newest signal forming right now is "${signalLead.title}", ${signalLead.summary}` : ''}`;
  }

  return lang === 'zh'
    ? `我可以直接帮你做三类事情：梳理最近的主线、找出已经稳定的知识资产、或者判断哪些记忆值得挂载给 agent。当前最明显的主线是“${options.workstreamInsight?.title ?? '近期工作主线'}”。`
    : `I can help with three things right away: summarize the latest thread, surface durable knowledge assets, or decide which memory should be mounted into agents. The clearest active theme right now is "${options.workstreamInsight?.title ?? 'recent workstream'}".`;
}

export default function V2MemoryHomePage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { memoryAssets, memoryInsights, memorySourceLinks, memoryTimeline, mountedMemoryPacks } = useMindXDemo();
  const [draft, setDraft] = useState('');

  const timelineEntries = useMemo(
    () => buildTimelineEntries({ memoryAssets, memorySourceLinks, memoryTimeline, lang }),
    [lang, memoryAssets, memorySourceLinks, memoryTimeline]
  );

  const recentSignals = useMemo(
    () => timelineEntries.filter(entry => entry.event.stage !== 'durable').slice(0, 3),
    [timelineEntries]
  );

  const workstreamInsight = useMemo(
    () => memoryInsights.find(insight => insight.kind === 'workstream'),
    [memoryInsights]
  );

  const preferenceInsight = useMemo(
    () => memoryInsights.find(insight => insight.kind === 'preference'),
    [memoryInsights]
  );

  const mountedSummary = useMemo(
    () => mountedMemoryPacks.map(pack => pack.name).join(lang === 'zh' ? '、' : ', '),
    [lang, mountedMemoryPacks]
  );

  const candidateSummary = useMemo(() => {
    const titles = memoryAssets
      .filter(asset => asset.status !== 'durable')
      .slice(0, 2)
      .map(asset => asset.title);
    return titles.join(lang === 'zh' ? '、' : ', ');
  }, [lang, memoryAssets]);

  const knowledgePreview = useMemo(
    () =>
      memoryAssets.slice(0, 2).map(asset => ({
        title: asset.title,
        badge:
          lang === 'zh'
            ? asset.status === 'durable'
              ? '已沉淀'
              : asset.status === 'review'
                ? '待确认'
                : '新线索'
            : asset.status === 'durable'
              ? 'Durable'
              : asset.status === 'review'
                ? 'In Review'
                : 'New',
      })),
    [lang, memoryAssets]
  );

  const initialAssistantText =
    lang === 'zh'
      ? '我是专属于你的记忆专家。我可以帮你从记忆中溯源证据、检索关联、洞察灵感。你只要随时问我就好了。'
      : 'I am your dedicated memory specialist. I can trace evidence, retrieve related memories, and surface fresh insights whenever you ask.';

  const [messages, setMessages] = useState<MemoryAssistantMessage[]>([
    {
      id: 'assistant-initial',
      role: 'assistant',
      text: initialAssistantText,
    },
  ]);

  const copy =
    lang === 'zh'
      ? {
          title: '记忆',
          assistantTitle: 'memo agent',
          askAiTitle: '问 AI',
          assistantPlaceholder: '问我任何和记忆有关的问题，比如“我最近在推进什么？”',
          send: '发送',
          quickPrompts: ['我最近在推进什么？', '哪些记忆适合挂载给 agent？', '现在有哪些记忆还在形成？'],
          formingTitle: '正在生成',
          viewMore: '查看更多',
          edit: '编辑',
          jumpToTimeline: '查看详情',
          memoryCards: [
            {
              title: '基础记忆',
              action: '/document?type=text&backTab=memory&source=whoami_doc',
              label: '',
              meta: '2 项',
              editable: true,
              previewType: 'memory',
              previewItems: [
                {
                  title: '关于我',
                  body: '前沿科技创业者，独立产品经理。偏好极致体验和极简设计，推崇 Agent-Native 理念。',
                },
                {
                  title: '写作原则',
                  body: '沟通直入主题，拒绝废话套话；代码给出完整可执行的实现；分析问题遵循第一性原理。',
                },
              ],
            },
            {
              title: '我的目标',
              action: '/document?type=text&backTab=memory&source=goal_doc',
              label: '',
              meta: '2 项',
              editable: true,
              previewType: 'goals',
              previewItems: [
                {
                  label: '1',
                  title: '构建 Agent-Native 记忆中枢',
                  meta: 'Deadline: Q2 · Priority: High',
                },
                {
                  label: '2',
                  title: '完善全平台交互与多端适配体验',
                  meta: 'Deadline: May · Priority: Medium',
                },
              ],
            },
            {
              title: 'Knowledge',
              action: '/v2/memory/knowledge',
              label: '',
              meta: `${memoryAssets.length} 张卡片`,
              editable: false,
              previewType: 'knowledge',
              previewItems: knowledgePreview,
            },
          ] satisfies MemoryCardConfig[],
        }
      : {
          title: 'Memory',
          assistantTitle: 'memo agent',
          askAiTitle: 'Ask AI',
          assistantPlaceholder: 'Ask anything about your memory, for example “What am I pushing forward lately?”',
          send: 'Send',
          quickPrompts: [
            'What am I pushing forward lately?',
            'Which memory should be mounted into agents?',
            'What memory is still forming right now?',
          ],
          formingTitle: 'Now forming',
          viewMore: 'View more',
          edit: 'Edit',
          jumpToTimeline: 'View details',
          memoryCards: [
            {
              title: 'Base memory',
              action: '/document?type=text&backTab=memory&source=whoami_doc',
              label: '',
              meta: '2 items',
              editable: true,
              previewType: 'memory',
              previewItems: [
                {
                  title: 'Who I am',
                  body: 'Frontier tech founder and independent product manager. Prefers extreme clarity, taste, and agent-native product thinking.',
                },
                {
                  title: 'Writing principles',
                  body: 'Communicate directly, ship complete implementations, and reason from first principles.',
                },
              ],
            },
            {
              title: 'My goals',
              action: '/document?type=text&backTab=memory&source=goal_doc',
              label: '',
              meta: '2 items',
              editable: true,
              previewType: 'goals',
              previewItems: [
                {
                  label: '1',
                  title: 'Build an agent-native memory hub',
                  meta: 'Deadline: Q2 · Priority: High',
                },
                {
                  label: '2',
                  title: 'Refine cross-platform interaction quality and multi-device adaptation',
                  meta: 'Deadline: May · Priority: Medium',
                },
              ],
            },
            {
              title: 'Knowledge',
              action: '/v2/memory/knowledge',
              label: '',
              meta: `${memoryAssets.length} cards`,
              editable: false,
              previewType: 'knowledge',
              previewItems: knowledgePreview,
            },
          ] satisfies MemoryCardConfig[],
        };

  const submitQuery = (query: string) => {
    const nextQuery = query.trim();
    if (!nextQuery) return;

    const answer = buildMemoryAnswer(nextQuery, lang, {
      recentSignals: recentSignals.map(signal => ({
        title: signal.signal.title,
        summary: signal.signal.summary,
      })),
      workstreamInsight: workstreamInsight
        ? { title: workstreamInsight.title, body: workstreamInsight.body }
        : undefined,
      preferenceInsight: preferenceInsight
        ? { title: preferenceInsight.title, body: preferenceInsight.body }
        : undefined,
      mountedSummary,
      candidateSummary,
    });

    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: nextQuery,
      },
      {
        id: `assistant-${Date.now() + 1}`,
        role: 'assistant',
        text: answer,
      },
    ]);
    setDraft('');
  };

  return (
    <div className="space-y-8">
      <V2ModuleHeader
        title={copy.title}
        actionSlot={<V2MemoryIntakeLauncher />}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {copy.memoryCards.map((section, index) => {
          const Icon = index === 0 ? User : index === 1 ? Target : Package2;
          return (
            <div
              key={section.title}
              className="rounded-[1.35rem] border border-stone-200 bg-white p-4 shadow-sm transition-all hover:border-stone-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-stone-700 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900">{section.title}</div>
                    {section.label ? (
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                        {section.label}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-500">
                    {section.meta}
                  </span>
                  {section.editable && (
                    <button
                      onClick={() => navigate(section.action)}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
                    >
                      {copy.edit}
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                {section.previewType === 'memory' &&
                  section.previewItems.map(item => (
                    <div key={item.title} className="rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
                        {item.title}
                      </div>
                      <p className="mt-1.5 text-xs leading-6 text-stone-700">{item.body}</p>
                    </div>
                  ))}

                {section.previewType === 'goals' &&
                  section.previewItems.map(item => (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-[11px] font-bold text-stone-700">
                        {item.label}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-stone-800">{item.title}</div>
                        <div className="mt-1 text-[11px] text-stone-500">{item.meta}</div>
                      </div>
                    </div>
                  ))}

                {section.previewType === 'knowledge' &&
                  section.previewItems.map(item => (
                    <div
                      key={item.title}
                      className="flex items-start justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3"
                    >
                      <div className="min-w-0 text-[13px] font-medium leading-6 text-stone-800">{item.title}</div>
                      {item.badge && (
                        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-500">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
              <button
                onClick={() => navigate(section.action)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-stone-700"
              >
                {copy.viewMore}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(28,25,23,0.04)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-stone-900">{copy.assistantTitle}</h2>
              <div className="text-xs text-stone-500">{currentUser.name}</div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                className={`rounded-[1.35rem] border px-4 py-3 ${
                  message.role === 'assistant'
                    ? 'border-stone-200 bg-stone-50/80'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  {message.role === 'assistant' ? copy.assistantTitle : currentUser.name}
                </div>
                <p className="text-sm leading-6 text-stone-700">{message.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[1.35rem] border border-stone-200 bg-stone-50/70 p-3">
            <div className="flex items-start gap-3">
              <div className="mt-2 text-stone-400">
                <Search className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <textarea
                  value={draft}
                  onChange={event => setDraft(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      submitQuery(draft);
                    }
                  }}
                  placeholder={copy.assistantPlaceholder}
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm leading-6 text-stone-800 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
              <button
                onClick={() => submitQuery(draft)}
                className="shrink-0 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                {copy.send}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {copy.quickPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => submitQuery(prompt)}
                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-[1.75rem] border border-stone-200 bg-[#F7F7F5] p-6 shadow-[0_10px_30px_rgba(28,25,23,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-stone-500" />
              <h2 className="text-lg font-semibold tracking-tight text-stone-900">{copy.formingTitle}</h2>
            </div>
            <button
              onClick={() => navigate('/v2/memory/timeline')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 transition-colors hover:text-stone-900"
            >
              {copy.jumpToTimeline}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {recentSignals.map(signal => (
              <div key={signal.event.id}>
                <V2TimelineSignalCard
                  signal={signal.signal}
                  onClick={() => {
                    void navigate(
                      `/v2/memory/timeline?event=${signal.event.id}${
                        signal.signal.assetId ? `&asset=${signal.signal.assetId}` : ''
                      }&from=memory-home`
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
