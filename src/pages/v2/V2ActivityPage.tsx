import { Activity, ArrowRight, Brain, Clock3 } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMindXDemo } from '../../data/mindxDemoContext';
import { useLanguage } from '../../i18n/LanguageContext';

function formatTimestamp(timestamp: string, lang: 'zh' | 'en') {
  const date = new Date(timestamp);
  return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function V2ActivityPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { activities, memoryTimeline } = useMindXDemo();

  const copy =
    lang === 'zh'
      ? {
          title: '动态',
          activityTitle: '最近动态',
          signalTitle: '记忆线索',
          openTimeline: '查看时间轴',
          empty: '暂无动态',
        }
      : {
          title: 'Activity',
          activityTitle: 'Recent activity',
          signalTitle: 'Memory signals',
          openTimeline: 'Open Timeline',
          empty: 'No recent activity',
        };

  const sortedActivities = useMemo(
    () => [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10),
    [activities]
  );

  const formingSignals = useMemo(
    () => memoryTimeline.filter(event => event.stage !== 'durable').slice(0, 4),
    [memoryTimeline]
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{copy.title}</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
        <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(28,25,23,0.04)]">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-stone-500" />
            <h2 className="text-lg font-semibold tracking-tight text-stone-900">{copy.activityTitle}</h2>
          </div>
          <div className="mt-5 space-y-3">
            {sortedActivities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
                {copy.empty}
              </div>
            ) : (
              sortedActivities.map(activity => (
                <div
                  key={activity.id}
                  className="rounded-[1.35rem] border border-stone-200 bg-stone-50/60 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-stone-900">
                        {activity.userName} {activity.action} {activity.targetName}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-stone-600">{activity.details}</p>
                    </div>
                    <div className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                      {formatTimestamp(activity.timestamp, lang)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-stone-200 bg-[#F7F7F5] p-6 shadow-[0_10px_30px_rgba(28,25,23,0.03)]">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-stone-500" />
            <h2 className="text-lg font-semibold tracking-tight text-stone-900">{copy.signalTitle}</h2>
          </div>
          <div className="mt-5 space-y-3">
            {formingSignals.map(signal => (
              <button
                key={signal.id}
                onClick={() => navigate(`/v2/memory/timeline?doc=${signal.docId}&from=activity`)}
                className="w-full rounded-[1.35rem] border border-stone-200 bg-white px-4 py-4 text-left transition-all hover:border-stone-300 hover:bg-stone-50"
              >
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  <Clock3 className="h-3.5 w-3.5" />
                  {signal.timeLabel}
                </div>
                <div className="mt-2 text-sm font-semibold text-stone-900">{signal.title}</div>
                <p className="mt-2 text-sm leading-6 text-stone-600">{signal.summary}</p>
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/v2/memory/timeline')}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-700"
          >
            {copy.openTimeline}
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </div>
    </div>
  );
}
