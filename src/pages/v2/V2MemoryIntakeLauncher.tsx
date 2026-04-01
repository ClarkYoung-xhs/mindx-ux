import {
  Cloud,
  FileText,
  Globe,
  Mail,
  MessageCircle,
  Mic,
  NotebookPen,
  Plus,
  RefreshCw,
  Video,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useMemoryCreateActions } from './useV2ModuleActions';

export default function V2MemoryIntakeLauncher() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const actions = useMemoryCreateActions();

  const actionMap = useMemo(
    () =>
      actions.reduce<Record<string, () => void>>((map, item) => {
        map[item.id] = item.onSelect;
        return map;
      }, {}),
    [actions]
  );

  const groups = useMemo(
    () =>
      lang === 'zh'
        ? [
            {
              title: '通用文档',
              items: [
                {
                  id: 'local-file',
                  label: '本地文件上传',
                  description: 'PDF, Word, TXT, Excel, Markdown',
                  icon: <FileText className="h-5 w-5 text-blue-600" />,
                  actionId: 'import-markdown',
                },
                {
                  id: 'paste-text',
                  label: '粘贴文本',
                  description: '直接粘贴文本内容',
                  icon: <NotebookPen className="h-5 w-5 text-stone-700" />,
                  actionId: 'import-markdown',
                },
              ],
            },
            {
              title: '搜索与收藏',
              items: [
                {
                  id: 'web-clip',
                  label: '网页剪存',
                  description: '保存并在 MindX 阅读网页',
                  icon: <Globe className="h-5 w-5 text-emerald-600" />,
                  actionId: 'import-markdown',
                },
                {
                  id: 'flomo',
                  label: 'flomo',
                  description: '浮墨笔记同步',
                  icon: <RefreshCw className="h-5 w-5 text-emerald-600" />,
                  actionId: 'import-markdown',
                },
              ],
            },
            {
              title: '云端协作',
              items: [
                {
                  id: 'tencent-docs',
                  label: '腾讯文档',
                  description: '自动同步更新的在线文档',
                  icon: <Cloud className="h-5 w-5 text-blue-600" />,
                  actionId: 'create-sync',
                },
                {
                  id: 'weiyun',
                  label: '微云',
                  description: '导入微云文件',
                  icon: <Cloud className="h-5 w-5 text-blue-600" />,
                  actionId: 'create-sync',
                },
                {
                  id: 'wechat',
                  label: '微信',
                  description: '同步微信文件通过小助手',
                  icon: <MessageCircle className="h-5 w-5 text-green-600" />,
                  actionId: 'create-sync',
                },
                {
                  id: 'qq-mail',
                  label: 'QQ 邮箱',
                  description: '解析邮件及其附件',
                  icon: <Mail className="h-5 w-5 text-blue-600" />,
                  actionId: 'create-sync',
                },
              ],
            },
            {
              title: '第三方插件同步',
              items: [
                { id: 'meeting', label: '腾讯会议', description: '同步会议记录', icon: <Video className="h-5 w-5 text-blue-600" />, actionId: 'import-chat' },
                { id: 'feishu', label: '飞书妙记', description: '同步会议转写', icon: <Video className="h-5 w-5 text-blue-600" />, actionId: 'import-chat' },
                { id: 'dingtalk', label: '钉钉闪记', description: '导入语音纪要', icon: <Mic className="h-5 w-5 text-blue-600" />, actionId: 'import-chat' },
                { id: 'plaud', label: 'Plaud', description: '接入录音速记', icon: <Mic className="h-5 w-5 text-blue-600" />, actionId: 'import-chat' },
              ],
            },
          ]
        : [
            {
              title: 'General documents',
              items: [
                { id: 'local-file', label: 'Local file upload', description: 'PDF, Word, TXT, Excel, Markdown', icon: <FileText className="h-5 w-5 text-blue-600" />, actionId: 'import-markdown' },
                { id: 'paste-text', label: 'Paste text', description: 'Paste raw text directly', icon: <NotebookPen className="h-5 w-5 text-stone-700" />, actionId: 'import-markdown' },
              ],
            },
            {
              title: 'Search & capture',
              items: [
                { id: 'web-clip', label: 'Web clip', description: 'Save and read web pages in MindX', icon: <Globe className="h-5 w-5 text-emerald-600" />, actionId: 'import-markdown' },
                { id: 'flomo', label: 'flomo', description: 'Sync floating notes', icon: <RefreshCw className="h-5 w-5 text-emerald-600" />, actionId: 'import-markdown' },
              ],
            },
            {
              title: 'Cloud collaboration',
              items: [
                { id: 'tencent-docs', label: 'Tencent Docs', description: 'Sync cloud docs automatically', icon: <Cloud className="h-5 w-5 text-blue-600" />, actionId: 'create-sync' },
                { id: 'weiyun', label: 'Weiyun', description: 'Import files from Weiyun', icon: <Cloud className="h-5 w-5 text-blue-600" />, actionId: 'create-sync' },
                { id: 'wechat', label: 'WeChat', description: 'Sync WeChat files through the assistant', icon: <MessageCircle className="h-5 w-5 text-green-600" />, actionId: 'create-sync' },
                { id: 'qq-mail', label: 'QQ Mail', description: 'Parse mail and attachments', icon: <Mail className="h-5 w-5 text-blue-600" />, actionId: 'create-sync' },
              ],
            },
            {
              title: 'Third-party sync',
              items: [
                { id: 'meeting', label: 'Tencent Meeting', description: 'Import meeting transcripts', icon: <Video className="h-5 w-5 text-blue-600" />, actionId: 'import-chat' },
                { id: 'feishu', label: 'Feishu Minutes', description: 'Sync meeting notes', icon: <Video className="h-5 w-5 text-blue-600" />, actionId: 'import-chat' },
                { id: 'dingtalk', label: 'DingTalk Notes', description: 'Import voice summaries', icon: <Mic className="h-5 w-5 text-blue-600" />, actionId: 'import-chat' },
                { id: 'plaud', label: 'Plaud', description: 'Connect recorder transcripts', icon: <Mic className="h-5 w-5 text-blue-600" />, actionId: 'import-chat' },
              ],
            },
          ],
    [lang]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
      >
        <Plus className="h-4 w-4" />
        {lang === 'zh' ? '接入记忆' : 'Add memory source'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-stone-900/30 p-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-[2rem] border border-stone-200 bg-white shadow-[0_24px_80px_rgba(28,25,23,0.18)]">
            <div className="flex items-center justify-between border-b border-stone-200 px-7 py-5">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  {lang === 'zh' ? '选择你想接入的数据源' : 'Choose a source to bring into Memory'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-10 px-7 py-7 lg:grid-cols-3">
              {groups.slice(0, 3).map(group => (
                <section key={group.title} className="space-y-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
                    {group.title}
                  </div>
                  <div className="space-y-3">
                    {group.items.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          actionMap[item.actionId]?.();
                          setOpen(false);
                        }}
                        className="flex w-full items-start gap-4 rounded-[1.35rem] border border-stone-200 bg-stone-50/70 px-4 py-4 text-left transition-colors hover:border-stone-300 hover:bg-white"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-lg font-semibold tracking-tight text-stone-900">{item.label}</div>
                          <div className="mt-1 text-sm text-stone-500">{item.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ))}

              {groups[3] && (
                <section className="space-y-4 lg:col-span-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
                    {groups[3].title}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {groups[3].items.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          actionMap[item.actionId]?.();
                          setOpen(false);
                        }}
                        className="flex items-center gap-4 rounded-[1.35rem] border border-stone-200 bg-stone-50/70 px-4 py-4 text-left transition-colors hover:border-stone-300 hover:bg-white"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-lg font-semibold tracking-tight text-stone-900">{item.label}</div>
                          <div className="mt-1 text-sm text-stone-500">{item.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
