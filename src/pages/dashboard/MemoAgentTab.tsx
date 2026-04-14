import { Search, Sparkles, MessageSquareText } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

function SearchChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-200 hover:text-stone-900"
    >
      {label}
    </button>
  );
}

export default function MemoAgentTab() {
  const [memoDraft, setMemoDraft] = useState('');
  const [memoMessages, setMemoMessages] = useState<
    Array<{ id: string; role: 'assistant' | 'user'; text: string }>
  >([]);

  const memoIntro =
    '我是专属于你的记忆专家。我可以帮你从记忆中溯源证据、检索关联、洞察灵感。你只要随时问我就好了。';

  const submitMemoQuery = (query: string) => {
    const question = query.trim();
    if (!question) return;

    setMemoMessages(prev => [
      ...prev,
      {
        id: `memo-user-${Date.now()}-${prev.length}`,
        role: 'user',
        text: question,
      },
      {
        id: `memo-assistant-${Date.now()}-${prev.length + 1}`,
        role: 'assistant',
        text: `我先按 "${question}" 理解你的问题。你可以继续往 Profile 和 Raw Data 页面查看基础记忆、洞察卡片和数据源列表。`,
      },
    ]);
    setMemoDraft('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl space-y-6 pb-12"
    >
      {/* Hero */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-white">
          <MessageSquareText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            Memo Agent
          </h2>
          <p className="text-sm text-stone-500">{memoIntro}</p>
        </div>
      </div>

      {/* Messages */}
      {memoMessages.length > 0 && (
        <div className="space-y-3">
          {memoMessages.map(message => (
            <div
              key={message.id}
              className={`rounded-[1.35rem] border px-5 py-4 ${
                message.role === 'assistant'
                  ? 'border-stone-200 bg-stone-50/80'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                {message.role === 'assistant' ? 'memo agent' : '你'}
              </div>
              <p className="text-sm leading-6 text-stone-700">{message.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="rounded-[1.35rem] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_rgba(28,25,23,0.04)]">
        <div className="flex items-start gap-3">
          <div className="mt-2 text-stone-400">
            <Search className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <textarea
              value={memoDraft}
              onChange={event => setMemoDraft(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  submitMemoQuery(memoDraft);
                }
              }}
              placeholder='问我任何和记忆有关的问题，比如"我最近在推进什么？"'
              rows={3}
              className="w-full resize-none bg-transparent text-sm leading-6 text-stone-800 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => submitMemoQuery(memoDraft)}
            className="shrink-0 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            发送
          </button>
        </div>
      </div>

      {/* Quick Chips */}
      <div className="flex flex-wrap gap-2">
        <SearchChip
          label="我最近在推进什么？"
          onClick={() => submitMemoQuery('我最近在推进什么？')}
        />
        <SearchChip
          label="哪些记忆适合挂载给 agent？"
          onClick={() => submitMemoQuery('哪些记忆适合挂载给 agent？')}
        />
        <SearchChip
          label="现在有哪些记忆还在形成？"
          onClick={() => submitMemoQuery('现在有哪些记忆还在形成？')}
        />
      </div>
    </motion.div>
  );
}
