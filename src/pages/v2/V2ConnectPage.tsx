import { ArrowRight, Link2, Package2, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMindXDemo } from "../../data/mindxDemoContext";
import { useLanguage } from "../../i18n/LanguageContext";
import V2ModuleHeader from "./V2ModuleHeader";
import { useIntegrationCreateActions } from "./useV2ModuleActions";

export default function V2ConnectPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const integrationCreateActions = useIntegrationCreateActions();
  const {
    agentConnections,
    agentWritebacks,
    memoryAssets,
    mountedMemoryPacks,
  } = useMindXDemo();

  const copy =
    lang === "zh"
      ? {
          title: "集成与挂载",
          stats: {
            connected: "已接入 Agent",
            mounted: "挂载包",
            writebacks: "今日回写",
          },
          connections: "接入中的 Agent",
          mounts: "已挂载的记忆包",
          writebacks: "最近回写",
          openWorkspace: "回到 Workspace 上下文",
          openKnowledge: "查看对应知识资产",
          mountedAssets: "条资产",
          mountedTo: "已挂载到",
          mountedAgents: "个 Agent",
          noMountedAgents: "还没有挂载对象",
        }
      : {
          title: "Integrations",
          stats: {
            connected: "Connected agents",
            mounted: "Mounted packs",
            writebacks: "Today writebacks",
          },
          connections: "Connected agents",
          mounts: "Mounted memory packs",
          writebacks: "Recent writebacks",
          openWorkspace: "Open workspace context",
          openKnowledge: "Open related knowledge",
          mountedAssets: "assets",
          mountedTo: "Mounted to",
          mountedAgents: "agents",
          noMountedAgents: "No mounted agents yet",
        };

  const stats = useMemo(
    () => [
      { label: copy.stats.connected, value: `${agentConnections.length}` },
      { label: copy.stats.mounted, value: `${mountedMemoryPacks.length}` },
      { label: copy.stats.writebacks, value: `${agentWritebacks.length}` },
    ],
    [
      agentConnections.length,
      agentWritebacks.length,
      copy.stats.connected,
      copy.stats.mounted,
      copy.stats.writebacks,
      mountedMemoryPacks.length,
    ],
  );

  return (
    <div className="space-y-8">
      <V2ModuleHeader
        title={copy.title}
        actionLabel={lang === "zh" ? "新建集成" : "New integration"}
        actionItems={integrationCreateActions}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-4"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              {stat.label}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(28,25,23,0.04)]">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-stone-500" />
            <h2 className="text-lg font-semibold tracking-tight text-stone-900">
              {copy.connections}
            </h2>
          </div>
          <div className="mt-5 space-y-3">
            {agentConnections.map((connection) => (
              <div
                key={connection.id}
                className="rounded-[1.35rem] border border-stone-200 bg-stone-50/60 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-semibold text-stone-900">
                        {connection.name}
                      </span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-stone-500">
                        {connection.provider}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {connection.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {connection.readScopes.map((scope) => (
                        <span
                          key={`${connection.id}-${scope}`}
                          className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600"
                        >
                          Read: {scope}
                        </span>
                      ))}
                      {connection.writeScopes.map((scope) => (
                        <span
                          key={`${connection.id}-${scope}`}
                          className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600"
                        >
                          Write: {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-500">
                    {connection.status}
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/v2/doc/${connection.latestWorkspaceDocId}?from=agent`,
                    )
                  }
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-stone-700"
                >
                  {copy.openWorkspace}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-stone-200 bg-[#F7F7F5] p-6 shadow-[0_10px_30px_rgba(28,25,23,0.03)]">
            <div className="flex items-center gap-2">
              <Package2 className="h-4 w-4 text-stone-500" />
              <h2 className="text-lg font-semibold tracking-tight text-stone-900">
                {copy.mounts}
              </h2>
            </div>
            <div className="mt-5 space-y-3">
              {mountedMemoryPacks.map((pack) => {
                const mountedAgents = pack.mountedByConnectionIds
                  .map((connectionId) =>
                    agentConnections.find(
                      (connection) => connection.id === connectionId,
                    ),
                  )
                  .filter(
                    (
                      connection,
                    ): connection is (typeof agentConnections)[number] =>
                      Boolean(connection),
                  );

                return (
                  <div
                    key={pack.id}
                    className="rounded-[1.35rem] border border-stone-200 bg-white px-4 py-4"
                  >
                    <div className="text-sm font-semibold text-stone-900">
                      {pack.name}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {pack.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-stone-400">
                      <span className="uppercase">
                        {lang === "zh"
                          ? `${pack.assetIds.length} ${copy.mountedAssets}`
                          : `${pack.assetIds.length} ${copy.mountedAssets}`}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="uppercase">
                        {lang === "zh"
                          ? `${copy.mountedTo} ${mountedAgents.length} ${copy.mountedAgents}`
                          : `${copy.mountedTo} ${mountedAgents.length} ${copy.mountedAgents}`}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {mountedAgents.length > 0 ? (
                        mountedAgents.map((agent) => (
                          <span
                            key={`${pack.id}-${agent.id}`}
                            className="rounded-full bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-600"
                          >
                            {agent.name}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-full bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-500">
                          {copy.noMountedAgents}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(28,25,23,0.04)]">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-stone-500" />
              <h2 className="text-lg font-semibold tracking-tight text-stone-900">
                {copy.writebacks}
              </h2>
            </div>
            <div className="mt-5 space-y-3">
              {agentWritebacks.map((writeback) => {
                const relatedAsset = memoryAssets.find(
                  (asset) => asset.id === writeback.assetId,
                );
                return (
                  <div
                    key={writeback.id}
                    className="rounded-[1.35rem] border border-stone-200 bg-stone-50/70 px-4 py-4"
                  >
                    <div className="text-sm font-semibold text-stone-900">
                      {writeback.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {writeback.detail}
                    </p>
                    {relatedAsset && (
                      <button
                        onClick={() =>
                          navigate(`/v2/knowledge?asset=${relatedAsset.id}`)
                        }
                        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-stone-700"
                      >
                        {copy.openKnowledge}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
