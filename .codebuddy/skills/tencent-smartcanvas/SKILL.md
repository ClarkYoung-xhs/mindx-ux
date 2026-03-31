---
name: tencent-smartcanvas
description: 腾讯智能文档（docs.qq.com）- 专注于智能文档创建和编辑的精简版 skill。支持创建排版美观的智能文档，支持 MDX 高级排版格式，提供文件管理和网页剪藏功能。涉及"新建文档"、"创建智能文档"、"写文档"、"在线文档"等操作的首选工具。
homepage: https://docs.qq.com/home
version: 1.0.0
author: tencent-docs
metadata: {"openclaw":{"primaryEnv":"TENCENT_DOCS_TOKEN","category":"tencent","tencentTokenMode":"custom","tokenUrl":"https://docs.qq.com/scenario/open-claw.html?nlc=1","emoji":"📝"}}
---

# 腾讯智能文档 MCP 使用指南

腾讯智能文档 MCP 是一个专注于智能文档的精简版工具，提供智能文档的创建、编辑和管理功能。

## 支持的文档类型

| 类型     | doc_type    | 推荐度       | 说明                                          |
| -------- | ----------- | ------------ | --------------------------------------------- |
| 智能文档 | smartcanvas | ⭐⭐⭐ **首选** | 排版美观，支持丰富组件，支持 MDX 高级排版格式 |

> 💡 本 skill 专注于智能文档能力。如需使用其他文档类型（Word、Excel、PPT 等），请使用完整版 `tencent-docs` skill。

## ⚙️ 快速配置

首次安装使用时，需要先完成本地安装和注册，详见 `references/auth.md`。

### 授权执行环境说明

- `setup.sh tdoc_check_and_start_auth` 会先生成授权链接，再启动后台轮询进程等待用户完成授权
- 在普通本地终端中，后台轮询通常可以跨两次命令持续存活，因此再执行 `setup.sh tdoc_wait_auth` 即可完成配置
- 在部分 Agent / 沙箱 / 受控命令执行环境中，首条命令结束后后台子进程可能被系统回收，导致第二步一直等不到 token 文件
- 遇到这类环境时，不要假设第一步启动的后台轮询仍然存在；应让第二步自动补启动轮询，或改用单进程同步授权流程
- 当前 `setup.sh` 已内置兜底：若 `tdoc_wait_auth` 发现后台轮询丢失，会自动切换为前台补轮询后继续配置

## 🎯 场景路由表

根据任务场景，选择对应的参考文档：

| 场景 | 文档类型 | 参考文档 |
|------|---------|---------|
| 报告、笔记、文章、总结等 | smartcanvas | `smartcanvas/entry.md` |
| 获取文档内容、上传图片、网页剪藏等公共接口 | — | `references/workflows.md` (get_content/upload_image/scrape_url) |
| 文件管理（搜索/重命名/移动/删除/复制/导入导出/权限等） | — | `references/manage_references.md` |

## 📁 文件目录结构

```
tencent-smartcanvas/
├── SKILL.md                        # 入口文件（本文件），全局导航与核心规则
├── setup.sh                        # 本地安装脚本
├── import_file.sh                  # 文件导入辅助脚本（预导入+上传COS）
├── references/                     # 参考文档
│   ├── auth.md                     # 鉴权与授权流程
│   ├── workflows.md                # 公共接口（get_content/upload_image/scrape_url）+ 常见工作流
│   └── manage_references.md        # 文件管理（搜索/重命名/移动/删除/复制/导入导出/权限）
└── smartcanvas/                    # 智能文档模块
    ├── entry.md                    # 智能文档入口，创建与编辑
    └── mdx_references.md           # MDX 格式规范（智能文档内容格式）
```

## 🔧 调用方式

### 获取工具列表
```bash
mcporter list tencent-docs
```

### 调用工具

```bash
mcporter call "tencent-docs" "<工具名>" --args '<JSON参数>'
```

> ⚠️ 本 skill 的包名是 `tencent-smartcanvas`，但底层 MCP 服务仍注册为 `tencent-docs`。参考文档中的参数说明应与 MCP 工具 Schema 保持一致。如有冲突，以 `mcporter list tencent-docs` 返回的 Schema 为准。

### 通用响应结构

所有 API 返回都包含：
- `error`: 错误信息（成功时为空）
- `trace_id`: 调用链追踪 ID

### API 详细参考

各工具的完整 API 说明（调用示例、参数说明、返回值说明）请参考场景路由表中对应的参考文档。公共接口和常见工作流详见 `references/workflows.md`。

## 常见工作流

详见 `references/workflows.md`，包含以下内容：

### 公共接口
- **get_content**：获取文档完整内容
- **upload_image**：上传图片到腾讯文档
- **scrape_url**：网页剪藏，抓取网页内容并保存为智能文档

### 工作流列表
- **搜索并读取文档**：manage.search_file 按关键词搜索 → 获取 file_id → get_content 读取内容
- **文件管理**：manage.folder_list 获取目录 → manage.* 工具进行重命名、移动、删除、复制、权限设置
- **网页剪藏**：scrape_url 抓取网页 → scrape_progress 轮询进度 → 自动保存为智能文档（用户提供 URL 时必须优先使用此工作流）
- **导入导出**：使用 manage.import_file 或 manage.pre_import + manage.async_import 导入文档，使用 manage.export_file 导出文档

## 核心规则

- **默认使用智能文档**：本 skill 专注于智能文档，所有创建操作使用 `create_smartcanvas_by_mdx`，编辑操作使用 `smartcanvas.*` 系列工具
- **创建文档支持 `parent_id`**：`create_smartcanvas_by_mdx` 工具支持 `parent_id` 参数，可将文档创建到指定目录；不填则在根目录创建
- **`node_id` 即 `file_id`**：空间节点的 `node_id` 同时也是文档的 `file_id`
- **文件创建限制**：使用 `manage.create_file` 时，`file_type` 仅支持 `smartcanvas`（智能文档）和 `folder`（文件夹）
- **Markdown 内容**：使用 UTF-8 格式，特殊字符无需转义
- **分页查询**：每页返回 20-40 条记录，使用 `has_next` 判断是否有更多
- **异步任务使用 spawn 子会话轮询**：`scrape_url`（网页剪藏）等异步任务，推荐使用 spawn 子会话专职轮询，主会话保持响应避免阻塞用户交互

## 问题定位指南

### 常见错误码

| 错误码     | 错误类型           | 解决方案                                                                                                                                                                 |
| ---------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **400006** | **Token 鉴权失败** | 需要先完成本地授权，详见 `references/auth.md`                                                                                                                            |
| **400007** | **VIP权限不足**    | ⭐ **立即升级VIP**：访问 [https://docs.qq.com/vip?immediate_buy=1?part_aid=persnlspace_mcp](https://docs.qq.com/vip?immediate_buy=1?part_aid=persnlspace_mcp) 购买VIP服务 |
| **-32601** | **请求接口错误**   | 确认调用的工具是否在工具列表中存在                                                                                                                                        |
| **-32603** | **请求参数错误**   | 确认请求参数是否正确，例如 `file_id`、`content` 等                                                                                                                        |
| **11607**  | **请求参数错误**   | 确认请求参数是否正确，例如 `file_id`、`content` 等                                                                                                                        |

### 排查步骤

1. **匹配错误码**：先查上方错误码表，按对应方案处理
2. **确认工具可用**：`mcporter list tencent-docs` 查看可用工具列表及参数定义
3. **确认授权状态**：如有鉴权相关错误，重新执行 `references/auth.md` 中的授权流程
4. **查阅参考文档**：根据场景路由表找到对应参考文档，确认工具调用规范和参数约束

## SKILL 更新

每天使用 SKILL 前进行一次更新检查，按照如下的步骤执行:

1. **查看当前版本version**：读取本文件顶部 frontmatter 中的 `version` 字段；格式为 MAJOR.MINOR.PATCH
2. **查看最新版本latest**：通过命令获取最新版本信息`latest`，输入参数 `version` 为上一步获取的当前版本
```bash
mcporter call "https://docs.qq.com/openapi/mcp" "check_skill_update" --args '{"version": "<version>"}'
```
JSON 格式数据返回，返回参数示例：
  - `latest`: 最新版本号，格式为 MAJOR.MINOR.PATCH
  - `release_note`: 最新版本发布说明
  - `instruction`: 更新指令

3. **更新版本**：如果当前版本`version`低于最新版本`latest`，则遵循 `instruction` 指令进行更新，或提示用户更新
