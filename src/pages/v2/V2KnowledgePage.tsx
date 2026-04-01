import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Briefcase, LayoutGrid, Layers, Lightbulb, Search, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { MemoryAsset, SourceLink } from '../../data/mindxDemo';
import { useMindXDemo } from '../../data/mindxDemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  V2CardDetailModal,
  V2KnowledgeCard,
  V2ResonanceCard,
  type V2CardRecord,
  type V2CardTone,
  type V2PersonRef,
  type V2SourceRef,
} from './v2Primitives';
import V2ModuleHeader from './V2ModuleHeader';
import V2MemoryIntakeLauncher from './V2MemoryIntakeLauncher';

type KnowledgeMode = 'insights' | 'tags' | 'assets';

type LocalizedCardCopy = {
  title: string;
  summary: string;
  freshness: string;
  evidence: string[];
};

type LocalizedSourceCopy = {
  docName: string;
  quote: string;
};

const localizedSourceCopy: Record<string, Record<'zh' | 'en', LocalizedSourceCopy>> = {
  src1: {
    zh: {
      docName: 'mindX 2.0 Memory 产品同步',
      quote: '如果现在把 Knowledge 拉成一级导航，用户会把它理解成第二套产品，而不是 Memory 的升级。',
    },
    en: {
      docName: 'mindX 2.0 Memory Product Sync',
      quote: 'If we promote Knowledge to top-level navigation now, users will read it as a second product instead of Memory growing up.',
    },
  },
  src2: {
    zh: {
      docName: '记忆研究笔记：用户为何信任',
      quote: '用户不是因为你记得多就信你，而是因为他能看见这张卡从哪里来、为什么还成立。',
    },
    en: {
      docName: 'Memory Research Notes — Why Users Trust',
      quote: 'People do not trust memory because it is bigger. They trust it when they can see where a card came from and why it still holds.',
    },
  },
  src3: {
    zh: {
      docName: 'mindX 2.0 Memory 信息架构 PRD',
      quote: 'Knowledge 不是平行模块，它是把 Memory 里的反复判断沉淀成可复用资产的地方。',
    },
    en: {
      docName: 'mindX 2.0 Memory IA PRD',
      quote: 'Knowledge is not a parallel module. It is where recurring judgments inside Memory become reusable assets.',
    },
  },
  src4: {
    zh: {
      docName: '品牌语气与产品叙事',
      quote: '先把判断说出来，再解释为什么。产品口吻要像一个会做取舍的 PM，不像在念宣传册。',
    },
    en: {
      docName: 'Brand Voice & Product Narrative',
      quote: 'Lead with the judgment. The product should sound like it already knows what matters, not like it is reading a brochure.',
    },
  },
  src5: {
    zh: {
      docName: 'Knowledge 归类与治理工作板',
      quote: '如果开放问题到处都能放，这套系统看起来会很聪明，但无法治理。',
    },
    en: {
      docName: 'Knowledge Classification & Governance Board',
      quote: 'If open loops can live everywhere, the system will feel thoughtful but not governable.',
    },
  },
  src6: {
    zh: {
      docName: 'mindX 2.0 Memory 日报',
      quote: '今天的重点不是“多记一点”，而是决定什么东西值得进入长期资产层。',
    },
    en: {
      docName: 'mindX 2.0 Memory Daily Report',
      quote: 'Today stopped being about adding more cards and became about deciding what deserves to become durable.',
    },
  },
};

const localizedAssetCopy: Record<string, Record<'zh' | 'en', LocalizedCardCopy>> = {
  mem1: {
    zh: {
      title: 'Knowledge 暂不升级为一级导航，继续归属 Memory',
      summary: 'mindX 2.0 当前版本的信息架构已经收敛：Knowledge 作为 Memory 内部的结构化资产层存在，不单独承担一级入口。',
      freshness: '42 分钟前定稿',
      evidence: [
        '产品同步会上已经明确否掉“Knowledge 一级化”的方案。',
        'IA PRD 把 Knowledge 定义成 Memory 内部的结构化资产层。',
        '日报里把“先讲清层级归属”定义成今天的核心产品动作。',
      ],
    },
    en: {
      title: 'Knowledge should remain inside Memory instead of becoming top-level navigation',
      summary: 'For the current mindX 2.0 IA, Knowledge is a structured shelf inside Memory rather than a standalone top-level entry.',
      freshness: 'Locked 42m ago',
      evidence: [
        'The product sync explicitly rejected promoting Knowledge into a primary navigation module.',
        'The IA PRD defines Knowledge as the structured asset layer inside Memory.',
        'The daily report framed “clarify ownership before expansion” as the main product move of the day.',
      ],
    },
  },
  mem2: {
    zh: {
      title: '对外入口先落在 Workspace，Memory 负责解释“这个用户是谁”',
      summary: '当前版本的产品入口策略是：Workspace 继续承接日常工作流，Memory 在内部逐步显性化用户理解与长期资产，避免用户误解为第二套系统。',
      freshness: '1 小时前复核',
      evidence: [
        '产品同步会上将 Workspace 定义为当前阶段的外层工作台。',
        '日报里把“入口是否外放 Memory”标记为待确认事项，而不是顶层原则。',
      ],
    },
    en: {
      title: 'Workspace should remain the outer wrapper while Memory explains the user underneath',
      summary: 'The current entry strategy keeps Workspace as the operating shell, while Memory surfaces who the user is and what should persist over time.',
      freshness: 'Reviewed 1h ago',
      evidence: [
        'The product sync treated Workspace as the external workbench for this phase.',
        'The daily report marked entry-point clarity as still under review rather than constitutional.',
      ],
    },
  },
  mem3: {
    zh: {
      title: '产品文案先下判断，再补机制说明',
      summary: '当前稳定的表达习惯是先把结论和取舍讲清楚，再解释页面机制、实现方式或系统细节，不用功能清单当开头。',
      freshness: '1 小时前整理',
      evidence: [
        '叙事评审多次删掉“功能罗列式”表达，保留结论先行的版本。',
        '日报里把“先判断后解释”总结成今天最稳定的文案模式。',
      ],
    },
    en: {
      title: 'Product copy should lead with judgment before mechanism',
      summary: 'The stable writing pattern is to state the conclusion and tradeoff first, then explain the UI mechanics or system details underneath it.',
      freshness: 'Refined 1h ago',
      evidence: [
        'Narrative review repeatedly cut feature-list copy in favor of judgment-first openings.',
        'The daily report described “lead with the judgment, then explain” as the clearest writing pattern of the day.',
      ],
    },
  },
  mem4: {
    zh: {
      title: '整体语气保持直接、克制、非 corporate',
      summary: '品牌和产品表达都应避免空泛的大词、AI 套话和汇报腔，保持像资深产品经理在做判断时的直接表达。',
      freshness: '昨天补充',
      evidence: [
        '品牌语气评审里已经明确否掉了“宏大叙事”和“仪表盘口吻”的写法。',
      ],
    },
    en: {
      title: 'The overall voice should stay direct, restrained, and non-corporate',
      summary: 'Both brand and product language should avoid inflated AI phrasing, internal-report tone, and empty positioning statements.',
      freshness: 'Observed yesterday',
      evidence: [
        'The brand voice review explicitly rejected grand narrative and dashboard-style language.',
      ],
    },
  },
  mem5: {
    zh: {
      title: '用户信任来自来源链路，不来自“更强记忆”口号',
      summary: '长期记忆要成立，核心不是把卡片做得更多，而是让用户看见来源、审核过程和当前为什么仍然有效。',
      freshness: '55 分钟前稳定',
      evidence: [
        '研究笔记把“可追溯来源”列为用户建立信任的第一信号。',
        '日报里没有继续讨论卡片数量，而是反复回到证据和耐久度。',
      ],
    },
    en: {
      title: 'User trust comes from provenance, not from “better memory” claims',
      summary: 'Long-term memory becomes credible when users can see the source, review trail, and current validity of each card.',
      freshness: 'Stabilized 55m ago',
      evidence: [
        'The research notes named visible provenance as the primary trust signal.',
        'The daily report kept returning to evidence and durability instead of card count.',
      ],
    },
  },
  mem6: {
    zh: {
      title: '记忆必须长在工作流里，不能漂在 Workspace 外面',
      summary: '这套系统只有从真实文档、协作过程和决策流里长出来，才会被持续使用；如果变成独立档案库，复用价值会快速下降。',
      freshness: '48 分钟前锁定',
      evidence: [
        '产品同步把 Memory 的价值定义成服务工作流，而不是脱离工作流独立存在。',
        '研究笔记指出，只有挂在真实资产上的记忆才会持续积累信任。',
        'IA PRD 已经把 Knowledge 收在 Memory 内，而不是另起一套档案空间。',
      ],
    },
    en: {
      title: 'Memory must grow out of workflow instead of floating outside Workspace',
      summary: 'The system only earns repeated use when memory emerges from real documents, collaboration, and decisions rather than becoming a separate archive.',
      freshness: 'Locked 48m ago',
      evidence: [
        'The product sync defined Memory as something that should serve workflow rather than sit outside of it.',
        'The research notes argued that trust compounds only when memory attaches to real work artifacts.',
        'The IA PRD keeps Knowledge inside Memory instead of creating another archival surface.',
      ],
    },
  },
  mem7: {
    zh: {
      title: 'mindX 2.0 是 1.0 的升级，不是新产品',
      summary: '当前所有产品表达都要建立在“连续升级”而不是“重新发明”上，避免用户把 2.0 理解成割裂的新系统。',
      freshness: '今天锁定',
      evidence: [
        '产品同步里已经把“连续升级”定为 2.0 的统一叙事。',
        '日报把这条定义成所有 IA 和对外表达都必须遵守的前提。',
      ],
    },
    en: {
      title: 'mindX 2.0 is an upgrade of 1.0, not a separate product',
      summary: 'All product framing should reinforce continuity instead of reinvention, so users read 2.0 as an upgrade rather than a disconnected system.',
      freshness: 'Locked today',
      evidence: [
        'The product sync established continuity as the unified 2.0 narrative.',
        'The daily report treated this as a prerequisite for IA and external communication decisions.',
      ],
    },
  },
  mem8: {
    zh: {
      title: 'Memory 的结构先固定为 Base Memory / Timeline / Knowledge',
      summary: '这三段结构已经足够承接 mindX 2.0 当前阶段的记忆能力，后续功能应该优先往里塞，而不是继续扩一级信息架构。',
      freshness: '36 分钟前写入宪法层',
      evidence: [
        'IA PRD 明确把三段结构写成当前阶段的标准框架。',
        '日报把这次分类调整定义成结构问题，而不是文案问题。',
      ],
    },
    en: {
      title: 'Memory should stay fixed as Base Memory / Timeline / Knowledge',
      summary: 'This three-part frame is sufficient for the current stage of mindX 2.0 Memory; future features should fit inside it instead of creating another primary section.',
      freshness: 'Written into the constitutional layer 36m ago',
      evidence: [
        'The IA PRD codified the three-part frame as the current structural standard.',
        'The daily report treated this classification pass as a structural decision rather than a wording change.',
      ],
    },
  },
  mem9: {
    zh: {
      title: 'L2 / L3 / L4 的晋升规则还没有定稿',
      summary: '现在已经把层级名字讲清楚了，但“什么条件下从项目判断升到长期原则、再升到核心锚点”还缺一套明确规则。',
      freshness: '24 分钟前进入复核',
      evidence: [
        '研究已经给出“可信”的判断标准，但还没落成可执行的晋升门槛。',
        '治理工作板把“晋升逻辑”列为当前最大的未决项。',
        '日报把“什么值得沉淀”定义成今天剩下的核心问题。',
      ],
    },
    en: {
      title: 'The promotion rules from L2 to L3 to L4 are still not finalized',
      summary: 'The layer names are now clear, but the product still lacks explicit criteria for when project judgments become principles and when principles become anchors.',
      freshness: 'Moved into review 24m ago',
      evidence: [
        'Research has already surfaced what “trustworthy” looks like, but not the operational thresholds for promotion.',
        'The governance board lists promotion logic as the biggest unresolved gap.',
        'The daily report framed “what deserves to become durable” as the main remaining question.',
      ],
    },
  },
  mem10: {
    zh: {
      title: '待跟进事项到底放 Knowledge 还是 Timeline，还没有收敛',
      summary: '现在的 follow-up 看起来像资产，实际又更像流程中的开放问题。这个边界如果不收敛，Knowledge 页会继续变脏。',
      freshness: '今天捕获',
      evidence: [
        '治理工作板已经明确提出“未收敛问题不一定适合放 Knowledge”。',
        '日报把这件事定义成产品债，而不是命名问题。',
      ],
    },
    en: {
      title: 'It is still unresolved whether follow-ups belong in Knowledge or Timeline',
      summary: 'Current follow-ups look like assets but behave like workflow. If this boundary stays fuzzy, the Knowledge page will keep getting noisier.',
      freshness: 'Captured today',
      evidence: [
        'The governance board explicitly questioned whether unresolved loops belong in Knowledge at all.',
        'The daily report treated this as product debt rather than a naming issue.',
      ],
    },
  },
};

function localizedSource(source: SourceLink, lang: 'zh' | 'en') {
  return localizedSourceCopy[source.id]?.[lang] ?? { docName: source.docName, quote: source.quote };
}

function localizedAsset(asset: MemoryAsset, lang: 'zh' | 'en') {
  return (
    localizedAssetCopy[asset.id]?.[lang] ?? {
      title: asset.title,
      summary: asset.summary,
      freshness: asset.freshness,
      evidence: asset.evidence,
    }
  );
}

function formatLibraryCategoryLabel(
  category: MemoryAsset['libraryCategory'],
  lang: 'zh' | 'en'
) {
  if (lang === 'zh') {
    if (category === 'project-judgment') return '项目判断';
    if (category === 'work-preference') return '工作偏好';
    if (category === 'long-term-principle') return '长期原则';
    if (category === 'core-anchor') return '核心锚点';
    return '待沉淀';
  }

  if (category === 'project-judgment') return 'Project Judgments';
  if (category === 'work-preference') return 'Work Preferences';
  if (category === 'long-term-principle') return 'Long-Term Principles';
  if (category === 'core-anchor') return 'Core Anchors';
  return 'Pending';
}

function formatStatusLabel(status: MemoryAsset['status'], lang: 'zh' | 'en') {
  if (lang === 'zh') {
    if (status === 'durable') return '已沉淀';
    if (status === 'review') return '审核中';
    return '候选';
  }

  if (status === 'durable') return 'Durable';
  if (status === 'review') return 'In Review';
  return 'Candidate';
}

function getTagSuggestion(tag: string, lang: 'zh' | 'en') {
  if (lang === 'zh') {
    return `你最近围绕“${tag}”的线索明显增多，值得继续补证据并把它提炼成一张更稳定的长期资产。`;
  }
  return `Signals around "${tag}" are clustering. It is likely worth gathering more evidence and turning this into a more durable asset.`;
}

function isAgent(name: string) {
  const normalized = name.toLowerCase();
  return normalized.includes('assistant') || normalized.includes('bot') || normalized.includes('analyzer');
}

function participantListForSources(sources: SourceLink[]) {
  const seen = new Set<string>();
  const people: V2PersonRef[] = [];

  sources.forEach(source => {
    source.participants.forEach(participant => {
      if (seen.has(participant)) return;
      seen.add(participant);
      people.push({
        name: participant,
        kind: isAgent(participant) ? 'agent' : 'human',
      });
    });
  });

  return people;
}

function sourceRefs(sources: SourceLink[]): V2SourceRef[] {
  return sources.map(source => ({
    id: source.id,
    label: source.docName,
    kind: source.kind,
    storage: source.storage,
    docId: source.docId,
    dataSourceId: source.dataSourceId,
    quote: source.quote,
  }));
}

function assetToCard(asset: MemoryAsset, sources: SourceLink[], lang: 'zh' | 'en'): V2CardRecord {
  const localized = localizedAsset(asset, lang);
  return {
    id: asset.id,
    timestamp: localized.freshness,
    typeLabel: formatLibraryCategoryLabel(asset.libraryCategory, lang),
    title: localized.title,
    content: localized.summary,
    tags: asset.tags,
    sources: sourceRefs(
      sources.map(source => {
        const copy = localizedSource(source, lang);
        return {
          ...source,
          docName: copy.docName,
          quote: copy.quote,
        };
      })
    ),
    people: participantListForSources(sources),
    relatedIds: asset.relatedAssetIds,
    evidence: localized.evidence,
    statusLabel: `${asset.layer} · ${formatStatusLabel(asset.status, lang)}`,
  };
}

export default function V2KnowledgePage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { documents, memoryAssets, memorySourceLinks, setMemoryAssets } = useMindXDemo();
  const [knowledgeMode, setKnowledgeMode] = useState<KnowledgeMode>('assets');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [assetCategoryFilter, setAssetCategoryFilter] = useState<MemoryAsset['libraryCategory'] | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [resolvedInsightActions, setResolvedInsightActions] = useState<
    Record<string, 'accept' | 'ignore'>
  >({});

  const sourceMap = useMemo(
    () =>
      memorySourceLinks.reduce<Record<string, SourceLink>>((map, source) => {
        map[source.id] = source;
        return map;
      }, {}),
    [memorySourceLinks]
  );

  const documentMap = useMemo(
    () =>
      documents.reduce<Record<string, (typeof documents)[number]>>((map, doc) => {
        map[doc.id] = doc;
        return map;
      }, {}),
    [documents]
  );

  const assetMap = useMemo(
    () =>
      memoryAssets.reduce<Record<string, MemoryAsset>>((map, asset) => {
        map[asset.id] = asset;
        return map;
      }, {}),
    [memoryAssets]
  );

  const assetCardMap = useMemo(
    () =>
      memoryAssets.reduce<Record<string, V2CardRecord>>((map, asset) => {
        const sources = asset.sourceIds
          .map(sourceId => sourceMap[sourceId])
          .filter((source): source is SourceLink => Boolean(source));
        map[asset.id] = assetToCard(asset, sources, lang);
        return map;
      }, {}),
    [lang, memoryAssets, sourceMap]
  );

  const selectedCard = selectedCardId ? assetCardMap[selectedCardId] ?? null : null;

  useEffect(() => {
    const assetId = searchParams.get('asset');
    if (!assetId) return;
    if (!assetCardMap[assetId]) return;
    setSelectedCardId(assetId);
    setKnowledgeMode('assets');
  }, [assetCardMap, searchParams]);

  const relatedCards = useMemo(() => {
    if (!selectedCard) return [];
    return (selectedCard.relatedIds ?? [])
      .map(relatedId => assetCardMap[relatedId])
      .filter((card): card is V2CardRecord => Boolean(card));
  }, [assetCardMap, selectedCard]);

  const allTags = useMemo(
    () => Array.from(new Set(memoryAssets.flatMap(asset => asset.tags))).sort(),
    [memoryAssets]
  );

  const filteredAssetCards = useMemo(
    () =>
      memoryAssets
        .filter(asset => {
          const matchesTag = !tagFilter || asset.tags.includes(tagFilter);
          const matchesCategory = !assetCategoryFilter || asset.libraryCategory === assetCategoryFilter;
          return matchesTag && matchesCategory;
        })
        .map(asset => assetCardMap[asset.id]),
    [assetCardMap, assetCategoryFilter, memoryAssets, tagFilter]
  );

  const allResonanceCards = useMemo(() => {
    const definitions: Array<{
      assetId: string;
      tone: V2CardTone;
      title: { zh: string; en: string };
      content: { zh: string; en: string };
      tags: { zh: string[]; en: string[] };
      statusLabel: { zh: string; en: string };
    }> = [
      {
        assetId: 'mem9',
        tone: 'thread',
        title: {
          zh: '你现在最该补的不是新卡片，而是 L2 / L3 / L4 的晋升规则。',
          en: 'The biggest gap right now is not more cards, but a clear promotion rule from L2 to L4.',
        },
        content: {
          zh: '如果这条规则不定，资产库会继续增长，但层级不会真正变清楚。',
          en: 'Without this rule, the asset library will keep growing while the layer boundaries stay fuzzy.',
        },
        tags: {
          zh: ['分层治理', '待沉淀'],
          en: ['layering', 'governance'],
        },
        statusLabel: {
          zh: '最近关注',
          en: 'Recently Watching',
        },
      },
      {
        assetId: 'mem5',
        tone: 'synthesis',
        title: {
          zh: '“来源链路建立信任”已经不只是研究结论，足够拿来做对外表达。',
          en: '“Trust comes from provenance” is no longer just research insight. It is ready for outward-facing narrative.',
        },
        content: {
          zh: '它已经在多张资产里反复出现，适合继续提升成长期原则。',
          en: 'It is now repeating across multiple assets and is strong enough to become a product principle.',
        },
        tags: {
          zh: ['信任', '叙事'],
          en: ['trust', 'narrative'],
        },
        statusLabel: {
          zh: 'AI 推荐',
          en: 'AI Suggested',
        },
      },
      {
        assetId: 'mem3',
        tone: 'gem',
        title: {
          zh: '你已经稳定形成一个表达判断：先下判断，再讲机制。',
          en: 'You have already formed a stable writing judgment: lead with the call, then explain the mechanics.',
        },
        content: {
          zh: '这已经不只是文案偏好，而是在反复影响产品说明和结构表达。',
          en: 'This is no longer just a copy preference. It is actively shaping product explanation and structure.',
        },
        tags: {
          zh: ['表达习惯', '产品文案'],
          en: ['writing', 'product-copy'],
        },
        statusLabel: {
          zh: '你已洞察',
          en: 'Already Noticed',
        },
      },
      {
        assetId: 'mem6',
        tone: 'gem',
        title: {
          zh: '你最近几条判断其实在收敛成同一个原则：记忆必须长在 workflow 里。',
          en: 'Several recent judgments are actually converging into one principle: memory has to grow inside workflow.',
        },
        content: {
          zh: '这条判断已经同时出现在 IA、研究和产品同步里，稳定性比单条卡片更高。',
          en: 'The same judgment now shows up across IA, research, and product sync, which makes it more stable than any single card.',
        },
        tags: {
          zh: ['工作流', '长期原则'],
          en: ['workflow', 'principle'],
        },
        statusLabel: {
          zh: '你已洞察',
          en: 'Already Noticed',
        },
      },
      {
        assetId: 'mem1',
        tone: 'synthesis',
        title: {
          zh: '“Knowledge 继续归属 Memory” 这条判断已经足够稳定，可以进一步写成产品原则。',
          en: '“Knowledge stays inside Memory” is now stable enough to be elevated into a product principle.',
        },
        content: {
          zh: '它现在已经不只是当前版本选择，而是在约束后续 IA 的展开方向。',
          en: 'It is no longer just a current-version decision. It is now constraining future IA expansion.',
        },
        tags: {
          zh: ['信息架构', 'Memory'],
          en: ['ia', 'memory'],
        },
        statusLabel: {
          zh: 'AI 推荐',
          en: 'AI Suggested',
        },
      },
      {
        assetId: 'mem10',
        tone: 'thread',
        title: {
          zh: '待跟进事项放 Knowledge 还是 Timeline，这个边界还没收敛。',
          en: 'It is still unresolved whether follow-ups belong in Knowledge or Timeline.',
        },
        content: {
          zh: '如果这一层不先划清，Knowledge 会越来越像“所有没收完的问题收纳盒”。',
          en: 'If this boundary stays loose, Knowledge will gradually turn into a bucket for unresolved work.',
        },
        tags: {
          zh: ['边界', '跟进事项'],
          en: ['boundary', 'follow-up'],
        },
        statusLabel: {
          zh: '最近关注',
          en: 'Recently Watching',
        },
      },
    ];

    return definitions
      .map(definition => {
        const baseCard = assetCardMap[definition.assetId];
        if (!baseCard) return null;

        return {
          card: {
            ...baseCard,
            title: definition.title[lang],
            content: definition.content[lang],
            tags: definition.tags[lang],
            statusLabel: definition.statusLabel[lang],
          },
          tone: definition.tone,
        };
      })
      .filter((item): item is { card: V2CardRecord; tone: V2CardTone } => Boolean(item));
  }, [assetCardMap, lang]);

  const resonanceCards = useMemo(
    () => allResonanceCards.filter(item => !resolvedInsightActions[item.card.id]),
    [allResonanceCards, resolvedInsightActions]
  );

  const insightCardIds = useMemo(
    () => new Set(allResonanceCards.map(item => item.card.id)),
    [allResonanceCards]
  );

  const assetCategoryCards = useMemo(() => {
    const definitions: Array<{
      id: MemoryAsset['libraryCategory'];
      label: string;
      description: string;
      icon: ReactNode;
      color: string;
    }> = [
      {
        id: 'project-judgment',
        label: lang === 'zh' ? '项目判断' : 'Project Judgments',
        description:
          lang === 'zh'
            ? '当前项目阶段已经成立、会直接影响产品方向的关键选择。'
            : 'Project-scoped choices that are already shaping the current product direction.',
        icon: <Lightbulb size={24} />,
        color: 'bg-white border border-zinc-200 text-zinc-700',
      },
      {
        id: 'work-preference',
        label: lang === 'zh' ? '工作偏好' : 'Work Preferences',
        description:
          lang === 'zh'
            ? '长期有效的表达方式、协作习惯和判断口味。'
            : 'Long-lived voice, collaboration habits, and judgment style.',
        icon: <Sparkles size={24} />,
        color: 'bg-white border border-zinc-200 text-zinc-700',
      },
      {
        id: 'long-term-principle',
        label: lang === 'zh' ? '长期原则' : 'Long-Term Principles',
        description:
          lang === 'zh'
            ? '跨任务反复成立的方法论、约束和可复用判断。'
            : 'Reusable methods, constraints, and judgments that hold across multiple tasks.',
        icon: <Layers size={24} />,
        color: 'bg-white border border-zinc-200 text-zinc-700',
      },
      {
        id: 'core-anchor',
        label: lang === 'zh' ? '核心锚点' : 'Core Anchors',
        description:
          lang === 'zh'
            ? '最不该轻易改写的产品宪法、身份定义和顶层真相。'
            : 'Product constitution, identity, and top-level truths that should rarely move.',
        icon: <Briefcase size={24} />,
        color: 'bg-white border border-zinc-200 text-zinc-700',
      },
      {
        id: 'pending',
        label: lang === 'zh' ? '待沉淀' : 'Pending',
        description:
          lang === 'zh'
            ? '还没完全定型，但值得继续补证据和决定归属的候选资产。'
            : 'Candidate assets that still need evidence, review, and a final home.',
        icon: <Search size={24} />,
        color: 'bg-white border border-zinc-200 text-zinc-700',
      },
    ];

    return definitions.map(definition => ({
      ...definition,
      count: memoryAssets.filter(asset => asset.libraryCategory === definition.id).length,
    }));
  }, [lang, memoryAssets]);

  const activeCategory = useMemo(
    () => assetCategoryCards.find(category => category.id === assetCategoryFilter) ?? null,
    [assetCategoryCards, assetCategoryFilter]
  );

  const openSource = (source: V2SourceRef) => {
    if (source.storage === 'memory' && source.dataSourceId) {
      navigate(`/document?source=data_source&dataSourceId=${source.dataSourceId}&from=knowledge`);
      return;
    }

    if (!source.docId) return;

    if (source.kind === 'chat') {
      navigate(`/document?id=${source.docId}&type=chatlog&from=knowledge`);
      return;
    }

    const doc = documentMap[source.docId];
    const type = doc?.type.toLowerCase().replace(/\s+/g, '') ?? 'text';
    navigate(`/document?id=${source.docId}&type=${type}&from=knowledge`);
  };

  const openCardDocument = (cardId: string) => {
    navigate(`/document?type=text&source=memory_asset&assetId=${cardId}&from=knowledge`);
  };

  const getCardDocumentHref = (cardId: string) =>
    `/document?type=text&source=memory_asset&assetId=${cardId}&from=knowledge`;

  const buildTagCandidate = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const runMemoAction = (cardId: string, action: 'refine' | 'tags' | 'related') => {
    const asset = assetMap[cardId];
    if (!asset) {
      return lang === 'zh' ? '这张记忆暂时还没有足够上下文。' : 'This memory card does not have enough context yet.';
    }

    if (action === 'refine') {
      const refinedSummary =
        lang === 'zh'
          ? `${asset.summary.replace(/。?$/, '。')}现在这条记忆的主判断已经更明确了：${asset.title}。`
          : `${asset.summary.replace(/\.*$/, '.')} The main judgment is now framed more directly: ${asset.title}.`;

      setMemoryAssets(prev =>
        prev.map(item => (item.id === cardId ? { ...item, summary: refinedSummary } : item))
      );

      return lang === 'zh'
        ? '我已经先帮你把说明收得更直接了。你如果愿意，我还可以继续往“更像产品判断”那条语气上再推一版。'
        : 'I tightened the description so the judgment lands faster. I can push it one step further if you want.';
    }

    if (action === 'tags') {
      const suggestions = asset.relatedEntities
        .map(buildTagCandidate)
        .filter(Boolean)
        .filter(tag => !asset.tags.includes(tag))
        .slice(0, 2);

      if (suggestions.length === 0) {
        return lang === 'zh'
          ? '这张卡当前的标签已经比较完整了。我建议下一步改来源链路或直接改文档说明。'
          : 'The tags are already in decent shape. The next best move is improving sources or editing the document.';
      }

      setMemoryAssets(prev =>
        prev.map(item =>
          item.id === cardId
            ? {
                ...item,
                tags: [...item.tags, ...suggestions],
              }
            : item
        )
      );

      return lang === 'zh'
        ? `我先补了更贴切的标签：${suggestions.map(tag => `#${tag}`).join(' ')}。`
        : `I added tighter tags: ${suggestions.map(tag => `#${tag}`).join(' ')}.`;
    }

    const relatedTitles = asset.relatedAssetIds
      .map(id => assetMap[id]?.title)
      .filter((title): title is string => Boolean(title))
      .slice(0, 3);

    return relatedTitles.length > 0
      ? lang === 'zh'
        ? `这张卡现在最值得一起看的关联记忆是：${relatedTitles.join('、')}。如果你要，我可以继续把它们收成一版更完整的判断链。`
        : `The strongest related memories here are ${relatedTitles.join(', ')}. I can turn them into a tighter reasoning chain if you want.`
      : lang === 'zh'
        ? '这张卡暂时还没有明显的强关联，我建议先继续补证据。'
        : 'This card does not have strong adjacent memories yet. I would gather more evidence first.';
  };

  const askMemoAgent = (cardId: string, question: string) => {
    const asset = assetMap[cardId];
    if (!asset) {
      return lang === 'zh' ? '这张记忆暂时还没有足够上下文。' : 'This memory card does not have enough context yet.';
    }

    const lowerQuestion = question.toLowerCase();
    const sourceNames = asset.sourceIds
      .map(sourceId => sourceMap[sourceId]?.docName)
      .filter((name): name is string => Boolean(name))
      .slice(0, 3);
    const relatedTitles = asset.relatedAssetIds
      .map(id => assetMap[id]?.title)
      .filter((title): title is string => Boolean(title))
      .slice(0, 3);

    if (
      lowerQuestion.includes('为什么') ||
      lowerQuestion.includes('why') ||
      lowerQuestion.includes('证据') ||
      lowerQuestion.includes('evidence')
    ) {
      return lang === 'zh'
        ? `这张卡当前主要站在这些证据上：${asset.evidence.slice(0, 2).join('；')}。来源主要来自 ${sourceNames.join('、')}。`
        : `This card currently stands on these evidence lines: ${asset.evidence.slice(0, 2).join('; ')}. The main sources are ${sourceNames.join(', ')}.`;
    }

    if (lowerQuestion.includes('下一步') || lowerQuestion.includes('next') || lowerQuestion.includes('怎么做')) {
      return lang === 'zh'
        ? `下一步我建议按这条推进：${asset.nextStep}`
        : `The next move I would make is: ${asset.nextStep}`;
    }

    if (lowerQuestion.includes('标签') || lowerQuestion.includes('tag') || lowerQuestion.includes('关联')) {
      return relatedTitles.length > 0
        ? lang === 'zh'
          ? `这张卡当前和 ${relatedTitles.join('、')} 的关联最强。现有标签 ${asset.tags.map(tag => `#${tag}`).join(' ')} 基本够用，但还可以继续收紧。`
          : `This card is most related to ${relatedTitles.join(', ')}. The current tags ${asset.tags.map(tag => `#${tag}`).join(' ')} are workable but can be tightened.`
        : lang === 'zh'
          ? `这张卡现在主要还是独立判断，现有标签是 ${asset.tags.map(tag => `#${tag}`).join(' ')}。`
          : `This card is still acting as a fairly standalone judgment. Its current tags are ${asset.tags.map(tag => `#${tag}`).join(' ')}.`;
    }

    return lang === 'zh'
      ? `这张记忆现在的核心是：${asset.summary} 如果你想继续发散，我建议先追问它为什么成立、要不要改写，或者它该挂给哪个 agent。`
      : `The core of this memory right now is: ${asset.summary} If you want to keep expanding it, I would ask why it holds, whether the wording should change, or which agent should mount it.`;
  };

  const resolveInsight = (cardId: string, action: 'accept' | 'ignore') => {
    if (action === 'accept') {
      setMemoryAssets(prev =>
        prev.map(asset => {
          if (asset.id !== cardId) return asset;

          const nextStatus =
            asset.status === 'candidate'
              ? 'review'
              : asset.status === 'review'
                ? 'durable'
                : 'durable';

          return {
            ...asset,
            status: nextStatus,
          };
        })
      );
    }

    setResolvedInsightActions(prev => ({
      ...prev,
      [cardId]: action,
    }));
    setSelectedCardId(null);
  };

  return (
    <>
      <div className="space-y-8">
        <V2ModuleHeader
          title="Knowledge"
          actionSlot={<V2MemoryIntakeLauncher />}
        />

        <div className="space-y-16 lg:space-y-20">
          <div className="border-b border-stone-200">
            <div className="flex items-center gap-6 overflow-x-auto">
              {[
                { key: 'assets' as const, label: lang === 'zh' ? '资产库' : 'Assets' },
                { key: 'tags' as const, label: lang === 'zh' ? '标签分类' : 'Tags' },
                { key: 'insights' as const, label: lang === 'zh' ? 'AI 察觉' : 'AI Noticing' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setKnowledgeMode(tab.key)}
                  className={`relative -mb-px border-b-2 px-1 pb-3 pt-1 text-sm font-semibold whitespace-nowrap transition-colors ${
                    knowledgeMode === tab.key
                      ? 'border-stone-900 text-stone-900'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {knowledgeMode === 'insights' && (
            <>
              <section>
                <div className="mb-10 flex flex-wrap items-center gap-6">
                  <div className="flex flex-wrap gap-6">
                    {[
                      {
                        label: lang === 'zh' ? '最近关注' : 'Recently Watching',
                        color: 'bg-zinc-900',
                        desc:
                          lang === 'zh'
                            ? '你最近盯得最紧、但还没完全收敛的问题'
                            : 'What you are circling most tightly right now',
                      },
                      {
                        label: lang === 'zh' ? '你已洞察' : 'Already Noticed',
                        color: 'bg-white shadow-sm',
                        desc:
                          lang === 'zh'
                            ? '已经反复出现、其实你自己已经看见的判断'
                            : 'Judgments you have already been expressing repeatedly',
                      },
                      {
                        label: lang === 'zh' ? 'AI 推荐' : 'AI Suggested',
                        color: 'bg-zinc-200',
                        desc:
                          lang === 'zh'
                            ? 'AI 建议你继续推进、补证据或升格的方向'
                            : 'Where AI thinks you should push, support, or elevate next',
                      },
                    ].map(item => (
                      <div key={item.label} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${item.color}`} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-zinc-400">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-6">
                  {resonanceCards[0] && (
                    <div className="md:col-span-2 lg:col-span-3 lg:row-span-2">
                      <V2ResonanceCard
                        card={resonanceCards[0].card}
                        tone={resonanceCards[0].tone}
                        lang={lang}
                        featured
                        onClick={() => setSelectedCardId(resonanceCards[0].card.id)}
                      />
                    </div>
                  )}
                  {resonanceCards[1] && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <V2ResonanceCard
                        card={resonanceCards[1].card}
                        tone={resonanceCards[1].tone}
                        lang={lang}
                        onClick={() => setSelectedCardId(resonanceCards[1].card.id)}
                      />
                    </div>
                  )}
                  {resonanceCards[2] && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <V2ResonanceCard
                        card={resonanceCards[2].card}
                        tone={resonanceCards[2].tone}
                        lang={lang}
                        onClick={() => setSelectedCardId(resonanceCards[2].card.id)}
                      />
                    </div>
                  )}
                  {resonanceCards.slice(3, 6).map(item => (
                    <div key={item.card.id} className="md:col-span-2 lg:col-span-2">
                      <V2ResonanceCard
                        card={item.card}
                        tone={item.tone}
                        lang={lang}
                        compact
                        onClick={() => setSelectedCardId(item.card.id)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {knowledgeMode === 'assets' && (
            <section>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-zinc-900">
                    {lang === 'zh' ? '知识资产库' : 'Knowledge Assets'}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    {lang === 'zh'
                      ? '结构化管理你的核心数字资产'
                      : 'Structured management for your most reusable digital assets'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
                {assetCategoryCards.map(asset => (
                  <motion.button
                    key={asset.id}
                    whileHover={{ y: -4 }}
                    onClick={() =>
                      setAssetCategoryFilter(assetCategoryFilter === asset.id ? null : asset.id)
                    }
                    className={`group rounded-[1.35rem] border p-6 text-left transition-all ${
                      assetCategoryFilter === asset.id
                        ? 'border-zinc-300 bg-white shadow-[0_10px_24px_rgba(24,24,27,0.06)]'
                        : 'border-zinc-200 bg-white shadow-[0_4px_14px_rgba(24,24,27,0.03)]'
                    }`}
                  >
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${asset.color} transition-transform group-hover:scale-105`}
                    >
                      {asset.icon}
                    </div>
                    <div className="text-[17px] font-semibold leading-tight text-zinc-900">{asset.label}</div>
                    <p className="mt-2 text-xs leading-6 text-zinc-500">{asset.description}</p>
                    <div className="mt-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {lang === 'zh' ? `${asset.count} 条资产` : `${asset.count} Assets`}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-12">
                <div className="mb-8 flex items-center justify-between">
                  <h4 className="text-xl font-bold text-zinc-900">
                    {activeCategory ? activeCategory.label : lang === 'zh' ? '全部资产' : 'All Assets'}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                    <LayoutGrid size={14} />
                    <span>
                      {lang === 'zh' ? `${filteredAssetCards.length} 条记录` : `${filteredAssetCards.length} records`}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {filteredAssetCards.map(card => (
                    <div key={card.id}>
                      <V2KnowledgeCard
                        card={card}
                        onCardClick={setSelectedCardId}
                        onSourceClick={openSource}
                        onTagClick={setTagFilter}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {knowledgeMode === 'tags' && (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="space-y-8 lg:col-span-3">
                <div>
                  <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    热门标签
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          tagFilter === tag
                            ? 'bg-zinc-900 text-white shadow-lg'
                            : 'bg-[#F9F9F8] text-zinc-500 hover:bg-zinc-200'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-zinc-200 bg-[#F9F9F8] p-6">
                  <h4 className="mb-2 text-xs font-bold text-zinc-700">结构化建议</h4>
                  <p className="text-[11px] leading-relaxed text-zinc-600">
                    {getTagSuggestion(tagFilter ?? allTags[0] ?? 'memory', lang)}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-9">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-zinc-900">
                    {tagFilter ? `标签: #${tagFilter}` : '所有结构化记忆'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                    <LayoutGrid size={14} />
                    <span>
                      {lang === 'zh' ? `${filteredAssetCards.length} 条记录` : `${filteredAssetCards.length} records`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {filteredAssetCards.map(card => (
                    <div key={card.id}>
                      <V2KnowledgeCard
                        card={card}
                        onCardClick={setSelectedCardId}
                        onSourceClick={openSource}
                        onTagClick={setTagFilter}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <V2CardDetailModal
        card={selectedCard}
        relatedCards={relatedCards}
        onClose={() => setSelectedCardId(null)}
        onOpenRelated={setSelectedCardId}
        onOpenSource={openSource}
        onEditDocument={openCardDocument}
        editDocumentHref={selectedCard ? getCardDocumentHref(selectedCard.id) : undefined}
        onRunMemoAction={runMemoAction}
        onAskMemoAgent={askMemoAgent}
        showInsightActions={Boolean(selectedCardId && knowledgeMode === 'insights' && insightCardIds.has(selectedCardId))}
        onResolveInsight={resolveInsight}
      />
    </>
  );
}
