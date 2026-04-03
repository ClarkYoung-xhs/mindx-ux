import type { MemoryAsset, MemoryEvent, SourceLink } from '../../data/mindxDemo';
import type { V2CardRecord, V2PersonRef, V2SourceRef, V2TimelineSignalRecord } from './v2Primitives';

export interface V2TimelineEntryRecord {
  event: MemoryEvent;
  card: V2CardRecord | null;
  primaryAsset?: MemoryAsset;
  people: V2PersonRef[];
  signal: V2TimelineSignalRecord;
  narrative: string;
  primarySource?: V2SourceRef;
}

function formatTypeLabel(type: MemoryAsset['type']) {
  return type === 'follow-up'
    ? 'Follow-Up'
    : `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
}

function timelineTypeLabel(event: MemoryEvent) {
  if (event.lane === 'extract') return 'Idea';
  if (event.lane === 'mount') return 'Decision';
  return 'Task';
}

function joinNames(names: string[], lang: 'zh' | 'en') {
  if (names.length === 0) return '';
  if (lang === 'zh') return names.join('、');
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

function peopleInScene(sources: SourceLink[]) {
  return Array.from(
    new Set(
      sources.flatMap(source => source.participants.filter(participant => participant !== 'Me'))
    )
  );
}

function storyMoment(hour: number, lang: 'zh' | 'en') {
  if (lang === 'zh') {
    if (hour < 11) return '早上';
    if (hour < 13) return '中午';
    if (hour < 18) return '下午';
    return '晚上';
  }

  if (hour < 11) return 'in the morning';
  if (hour < 13) return 'by noon';
  if (hour < 18) return 'in the afternoon';
  return 'in the evening';
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
      if (participant === 'Me' || seen.has(participant)) return;
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

function primarySourceRef(source: SourceLink | undefined, event: MemoryEvent): V2SourceRef {
  if (source) {
    return {
      id: source.id,
      label: source.docName,
      kind: source.kind,
      storage: source.storage,
      docId: source.docId,
      dataSourceId: source.dataSourceId,
      quote: source.quote,
    };
  }

  return {
    id: `event-${event.id}`,
    label: event.docName,
    kind: 'document',
    docId: event.docId,
  };
}

function sourceSurface(docName: string, kind: SourceLink['kind'], lang: 'zh' | 'en') {
  if (lang === 'zh') {
    if (kind === 'chat') return `「${docName}」这段聊天`;
    if (kind === 'comment') return `《${docName}》的评论`;
    if (kind === 'report') return `《${docName}》这份日报`;
    return `《${docName}》`;
  }

  if (kind === 'chat') return `the ${docName} chat`;
  if (kind === 'comment') return `comments on ${docName}`;
  if (kind === 'report') return `${docName}`;
  return docName;
}

function chatLead(collaborators: string[], lang: 'zh' | 'en') {
  if (collaborators.length === 0) {
    return lang === 'zh' ? '我' : 'I';
  }

  return lang === 'zh'
    ? `我和 ${joinNames(collaborators, lang)}`
    : 'I';
}

function assetToCard(asset: MemoryAsset, sources: SourceLink[]): V2CardRecord {
  return {
    id: asset.id,
    timestamp: asset.freshness,
    typeLabel: formatTypeLabel(asset.type),
    title: asset.title,
    content: asset.summary,
    tags: asset.tags,
    sources: sourceRefs(sources),
    people: participantListForSources(sources),
    relatedIds: asset.relatedAssetIds,
    evidence: asset.evidence,
  };
}

function stageLabel(stage: MemoryEvent['stage'], lang: 'zh' | 'en') {
  if (lang === 'zh') {
    if (stage === 'durable') return '已沉淀';
    if (stage === 'candidate') return '整理中';
    return '已记录';
  }

  if (stage === 'durable') return 'Durable';
  if (stage === 'candidate') return 'In Review';
  return 'Captured';
}

function buildSignalSummary(
  event: MemoryEvent,
  asset: MemoryAsset | undefined,
  sources: SourceLink[],
  docName: string,
  sourceKind: SourceLink['kind'],
  lang: 'zh' | 'en'
) {
  const collaborators = peopleInScene(sources);
  const collaboratorText = collaborators.length
    ? lang === 'zh'
      ? `，和 ${joinNames(collaborators, lang)}`
      : ` with ${joinNames(collaborators, lang)}`
    : '';
  const hour = Number.parseInt(event.timeLabel.split(':')[0] ?? '12', 10);
  const moment = storyMoment(hour, lang);
  const formattedDocName = lang === 'zh' ? `《${docName}》` : docName;
  const scene = sourceSurface(docName, sourceKind, lang);

  if (sourceKind === 'chat') {
    const actorLead = chatLead(collaborators, lang);

    if (lang === 'zh') {
      if (event.stage === 'durable' && event.lane === 'mount') {
        return `${moment}${actorLead}在${scene}里把这件事正式聊定了，后续相关工作都会默认按这个判断继续。`;
      }
      if (event.stage === 'candidate' && event.lane === 'refine') {
        return `${moment}${actorLead}在${scene}里继续把这条线索收拢成判断，它已经开始从现场讨论变成可复用的结论。`;
      }
      if (event.lane === 'refine') {
        return `${moment}${actorLead}在${scene}里把白天散着的推进重新串了一遍，这条主线因此更清楚了。`;
      }
      return `${moment}${actorLead}在${scene}里把这条线索聊了出来，值得先记下来继续追。`;
    }

    if (event.stage === 'durable' && event.lane === 'mount') {
      return `${moment} I locked this down in ${scene}${collaboratorText}, so the rest of the work can now follow the same judgment by default.`;
    }
    if (event.stage === 'candidate' && event.lane === 'refine') {
      return `${moment} I kept tightening this signal in ${scene}${collaboratorText}, and it is now close to becoming a reusable conclusion.`;
    }
    if (event.lane === 'refine') {
      return `${moment} I used ${scene}${collaboratorText} to restitch the scattered moves of the day into one clearer storyline.`;
    }
    return `${moment} I surfaced this signal in ${scene}${collaboratorText}, so it is now worth tracking as an early memory signal.`;
  }

  if (lang === 'zh') {
    if (event.stage === 'durable' && event.lane === 'mount') {
      return `${moment}我在 ${formattedDocName}${collaboratorText} 把这件事正式写定了，后续相关工作都会默认按这个判断继续。`;
    }
    if (event.stage === 'candidate' && event.lane === 'refine') {
      return `${moment}我在 ${formattedDocName}${collaboratorText} 继续把这条线索整理成判断，它已经开始从讨论里的感觉变成可复用的结论。`;
    }
    if (event.lane === 'refine') {
      return `${moment}我在 ${formattedDocName}${collaboratorText} 做了一次日结，把白天散着的推进重新串成一条更清楚的主线。`;
    }
    return `${moment}在 ${formattedDocName}${collaboratorText} 里，这条线索第一次冒了出来，值得先记下来继续追。`;
  }

  if (event.stage === 'durable' && event.lane === 'mount') {
    return `${moment} I locked this into ${formattedDocName}${collaboratorText}, so the rest of the work can now follow the same judgment by default.`;
  }
  if (event.stage === 'candidate' && event.lane === 'refine') {
    return `${moment} I kept tightening this signal inside ${formattedDocName}${collaboratorText}, and it is now close to becoming a reusable conclusion.`;
  }
  if (event.lane === 'refine') {
    return `${moment} I used ${formattedDocName}${collaboratorText} as a recap pass to turn scattered work into one clearer storyline.`;
  }
  return `${moment} this signal first surfaced inside ${formattedDocName}${collaboratorText}, so it is now worth tracking as an early memory signal.`;
}

function buildNarrative(
  event: MemoryEvent,
  asset: MemoryAsset | undefined,
  sources: SourceLink[],
  docName: string,
  sourceKind: SourceLink['kind'],
  lang: 'zh' | 'en'
) {
  const collaborators = peopleInScene(sources);
  const collaboratorText = collaborators.length
    ? lang === 'zh'
      ? `，和 ${joinNames(collaborators, lang)}`
      : ` with ${joinNames(collaborators, lang)}`
    : '';
  const hour = Number.parseInt(event.timeLabel.split(':')[0] ?? '12', 10);
  const sceneIcon = hour < 12 ? '☀️' : hour < 18 ? '☕️' : '🌙';
  const assetLead = asset?.title ?? event.title;
  const formattedDocName = lang === 'zh' ? `《${docName}》` : docName;
  const moment = storyMoment(hour, lang);
  const scene = sourceSurface(docName, sourceKind, lang);

  if (sourceKind === 'chat') {
    const actorLead = chatLead(collaborators, lang);

    if (lang === 'zh') {
      if (event.stage === 'durable' && event.lane === 'mount') {
        return `${sceneIcon} ${moment}${actorLead}在${scene}里把“${assetLead}”正式聊定了。它不再只是推进现场里的一句判断，下面这张卡片就是今天沉淀下来的长期版本。`;
      }
      if (event.stage === 'candidate' && event.lane === 'refine') {
        return `${sceneIcon} ${moment}${actorLead}在${scene}里把“${assetLead}”继续往前聊实了。判断已经开始成形，下面这张卡片就是它今天最像样的候选版本。`;
      }
      if (event.lane === 'refine') {
        return `${sceneIcon} ${moment}${actorLead}在${scene}里重新对了一遍白天的推进。下面这张卡片不是另一套叙事，它就是这段聊天最后留下来的记忆版本。`;
      }
      return `${sceneIcon} ${moment}${actorLead}在${scene}里把“${assetLead}”这条线索第一次聊了出来。它还带着现场感，下面这张卡片是今天先留下来的记忆雏形。`;
    }

    if (event.stage === 'durable' && event.lane === 'mount') {
      return `${sceneIcon} ${moment}, I locked "${assetLead}" down in ${scene}${collaboratorText}. It stopped being a live-team judgment and became the durable version that the card below now represents.`;
    }
    if (event.stage === 'candidate' && event.lane === 'refine') {
      return `${sceneIcon} ${moment}, I kept pushing "${assetLead}" forward in ${scene}${collaboratorText}. The judgment is forming now, and the card below is its best working version for today.`;
    }
    if (event.lane === 'refine') {
      return `${sceneIcon} ${moment}, I used ${scene}${collaboratorText} to stitch the scattered moves of the day into one clearer storyline. The card below is the memory version that survived that chat.`;
    }
    return `${sceneIcon} ${moment}, I first surfaced "${assetLead}" in ${scene}${collaboratorText}. It still feels close to the live moment, and the card below is the first memory version we kept.`;
  }

  if (lang === 'zh') {
    if (event.stage === 'durable' && event.lane === 'mount') {
      return `${sceneIcon} ${moment}我在 ${formattedDocName}${collaboratorText} 一起把“${assetLead}”正式写定了。它不再只是推进现场里的一句判断，下面这张卡片就是今天沉淀下来的长期版本。`;
    }
    if (event.stage === 'candidate' && event.lane === 'refine') {
      return `${sceneIcon} ${moment}整理 ${formattedDocName}${collaboratorText} 时，我把“${assetLead}”重新收拢了一遍。判断已经开始成形，下面这张卡片就是它今天最像样的候选版本。`;
    }
    if (event.lane === 'refine') {
      return `${sceneIcon} ${moment}做 ${formattedDocName} 的日结时，我把白天散着的推进又重新串了一遍${collaboratorText}。下面这张卡片不是主角，它只是这条主线在今天留下来的记忆版本。`;
    }
    return `${sceneIcon} ${moment}在 ${formattedDocName}${collaboratorText} 推进时，“${assetLead}”这条线索第一次冒了出来。它还带着现场感，下面这张卡片是今天先留下来的记忆雏形。`;
  }

  if (event.stage === 'durable' && event.lane === 'mount') {
    return `${sceneIcon} ${moment}, I locked "${assetLead}" into ${formattedDocName}${collaboratorText}. It stopped being a live-team judgment and became the durable version that the card below now represents.`;
  }
  if (event.stage === 'candidate' && event.lane === 'refine') {
    return `${sceneIcon} ${moment}, while tightening ${formattedDocName}${collaboratorText}, I pulled "${assetLead}" into focus. The judgment is forming now, and the card below is its best working version for today.`;
  }
  if (event.lane === 'refine') {
    return `${sceneIcon} ${moment}, during the ${formattedDocName} wrap-up${collaboratorText}, I stitched the scattered moves of the day into one clearer storyline. The card below is not the point by itself, it is the memory version that survived the recap.`;
  }
  return `${sceneIcon} ${moment}, inside ${formattedDocName}${collaboratorText}, "${assetLead}" first surfaced as something worth keeping. It still feels close to the live moment, and the card below is the first memory version we kept.`;
}

export function buildTimelineEntries({
  memoryAssets,
  memorySourceLinks,
  memoryTimeline,
  lang,
}: {
  memoryAssets: MemoryAsset[];
  memorySourceLinks: SourceLink[];
  memoryTimeline: MemoryEvent[];
  lang: 'zh' | 'en';
}): V2TimelineEntryRecord[] {
  const sourceMap = memorySourceLinks.reduce<Record<string, SourceLink>>((map, source) => {
    map[source.id] = source;
    return map;
  }, {});

  return [...memoryTimeline]
    .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime())
    .map(event => {
      const primaryAsset = memoryAssets.find(asset => asset.id === event.assetIds[0]);
      const sources = event.sourceIds
        .map(sourceId => sourceMap[sourceId])
        .filter((source): source is SourceLink => Boolean(source));
      const sceneSources = sources.filter(source => source.docId === event.docId);
      const narrativeSources = sceneSources.length > 0 ? sceneSources : sources;
      const narrativeSource = narrativeSources[0] ?? sources[0];
      const primarySource = primarySourceRef(narrativeSource, event);
      const people = participantListForSources(narrativeSources);

      const card = primaryAsset
        ? {
            ...assetToCard(primaryAsset, narrativeSource ? [narrativeSource] : sources),
            typeLabel: timelineTypeLabel(event),
            timestamp: event.timeLabel,
          }
        : null;

      return {
        event,
        card,
        primaryAsset,
        people,
          signal: {
            eventId: event.id,
            assetId: card?.id,
            timeLabel: event.timeLabel,
            stage: event.stage,
            stageLabel: stageLabel(event.stage, lang),
            title: event.title,
            summary: buildSignalSummary(
              event,
              primaryAsset,
              narrativeSources,
              primarySource.label,
              primarySource.kind,
              lang
            ),
            docName: primarySource.label,
            docId: primarySource.docId ?? event.docId,
            sourceKind: primarySource.kind,
            people,
          },
          narrative: buildNarrative(
            event,
            primaryAsset,
            narrativeSources,
            primarySource.label,
            primarySource.kind,
            lang
          ),
          primarySource,
      };
    });
}
