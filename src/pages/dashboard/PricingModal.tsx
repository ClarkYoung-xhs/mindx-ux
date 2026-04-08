import React from "react";
import { X, Check, Zap } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export default function PricingModal({
  isOpen,
  onClose,
  lang,
}: PricingModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden transform transition-all"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        <div className="px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between border-b border-stone-100 bg-white relative z-10">
          <h2 className="text-xl font-bold text-stone-900">
            {lang === "zh" ? "升级您的工作空间" : "Upgrade your workspace"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-6 bg-stone-50/50">
          {/* Free */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-semibold text-stone-800 mb-2">
              {lang === "zh" ? "免费版" : "Free"}
            </h3>
            <p className="text-sm text-stone-500 mb-6 flex-none">
              {lang === "zh"
                ? "体验下一代 Agent-Native 第二大脑"
                : "Experience the next-gen Agent-Native brain"}
            </p>
            <div className="text-4xl font-bold text-stone-900 mb-8">
              $0
              <span className="text-base font-normal text-stone-500 ml-1">
                / mo
              </span>
            </div>
            <button className="w-full py-3 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 mb-8 transition-colors">
              {lang === "zh" ? "当前计划" : "Current Plan"}
            </button>
            <ul className="space-y-4 text-sm text-stone-600 flex-1">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />{" "}
                基础文档检索与问答
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />{" "}
                基础通用大模型支持
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />{" "}
                <span className="font-bold text-stone-900">
                  2个自定义 Agent
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-stone-300 shrink-0" />{" "}
                <span className="text-stone-400 line-through">
                  自动信息提炼与洞察
                </span>
              </li>
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden transform md:scale-105 z-10 flex flex-col ring-4 ring-stone-900/5">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"></div>
            <div className="absolute top-5 right-5 bg-stone-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              {lang === "zh" ? "爆款" : "Popular"}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-stone-900">
                {lang === "zh" ? "专业版" : "Pro"}
              </h3>
              <Zap className="w-5 h-5 text-orange-500 fill-current" />
            </div>
            <p className="text-sm text-stone-500 mb-6 flex-none">
              {lang === "zh"
                ? "解锁完整的无缝深度洞察能力"
                : "Unlock full deep insight capabilities"}
            </p>
            <div className="text-4xl font-bold text-stone-900 mb-8">
              $20
              <span className="text-base font-normal text-stone-500 ml-1">
                / mo
              </span>
            </div>
            <button className="w-full py-3 rounded-xl border border-transparent text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 mb-8 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group/btn">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
              {lang === "zh" ? "立即升级 (Subscribe)" : "Upgrade to Pro"}
            </button>
            <ul className="space-y-4 text-sm text-stone-700 font-medium flex-1">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />{" "}
                无底线使用上下文提炼引擎
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />{" "}
                无限制的高级自定义 Agent
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />{" "}
                优先解锁第三方应用连接
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" /> 允许将
                Agent 分享至微信小程序与外部网络群体
              </li>
            </ul>
          </div>

          {/* Team */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-semibold text-stone-800 mb-2">
              {lang === "zh" ? "团队版" : "Team"}
            </h3>
            <p className="text-sm text-stone-500 mb-6 flex-none">
              {lang === "zh"
                ? "为企业组织打造的全能知识引擎"
                : "The all-in-one engine for orgs"}
            </p>
            <div className="text-4xl font-bold text-stone-900 mb-8">
              $30
              <span className="text-base font-normal text-stone-500 ml-1">
                / user
              </span>
            </div>
            <button className="w-full py-3 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50 mb-8 transition-colors">
              {lang === "zh" ? "联系销售" : "Contact Sales"}
            </button>
            <ul className="space-y-4 text-sm text-stone-600 flex-1">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" /> Pro
                版所包含的一切权限
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />{" "}
                空间无缝协同共享与严格权限控制
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />{" "}
                企业级用量池与保障额度
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />{" "}
                企业数据隔离与专属化定制 SSO
              </li>
            </ul>
          </div>
        </div>
        <div className="p-4 bg-stone-100/50 text-center text-[11px] text-stone-400 border-t border-stone-100">
          {lang === "zh"
            ? "标价均支持年付 8 折优惠。所有的计划升级支持随时取消。"
            : "Prices reflect annual billing. Cancel anytime."}
        </div>
      </div>
    </div>
  );
}
