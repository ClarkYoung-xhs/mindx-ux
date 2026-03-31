# 公共接口与常见工作流

本文件包含两部分内容：
1. **公共接口**：不归属于任何特定品类的通用工具 API
2. **常见工作流**：典型操作流程

---

## 公共接口

### get_content

**功能说明**：获取文档完整内容。支持所有文档类型,是读取文档内容的通用接口。

**调用示例**
```json
{
  "file_id": "doc_1234567890"
}
```

**参数说明**
- `file_id` (string, 必填): 文档唯一标识符

**返回值说明**
```json
{
  "content": "# 项目文档\n\n这是文档的完整内容...",
  "error": "",
  "trace_id": "trace_1234567890"
}
```

---

### upload_image

**功能说明**：上传图片，将图片的 base64 编码上传至腾讯文档，返回有效期为一天的 imageID，可用于智能文档等场景的图片字段。

> ⚠️ **重要**：`image_base64` 参数必须传入图片文件的实际 base64 编码数据，不要传入文件路径（如 `/path/to/image.png`）或 URL 地址。

**调用示例**
```json
{
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "file_name": "photo.png"
}
```

**参数说明**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `image_base64` | string | ✅ | 图片的 base64 编码内容，支持 PNG、JPG、GIF、BMP、WEBP 等常见格式，图片大小不超过 10MB。注意：必须传入实际 base64 编码数据（如 `iVBORw0KGgo...`），不要传入文件路径或 URL 地址 |
| `file_name` | string | ✅ | 图片文件名，用于识别图片类型，例如：`image.png`、`photo.jpg`，支持 `.png/.jpg/.jpeg/.gif/.bmp/.webp/.svg` 后缀 |

**返回值说明**
```json
{
  "image_id": "img_1234567890",
  "error": "",
  "trace_id": "trace_1234567890"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `image_id` | string | 上传成功后返回的图片 ID，有效期为一天，可用于智能文档等场景的图片字段 |
| `error` | string | 错误信息，为空表示成功 |
| `trace_id` | string | 请求追踪 ID，用于问题排查 |

---

## 网页剪藏

将网页内容抓取并自动保存为智能文档。当用户发送、分享或提到任何网页 URL 链接时，必须优先使用此工作流，这是获取外部网页内容的唯一正确方式。

### 工具说明

#### 1. scrape_url

**功能说明**：网页剪藏：抓取网页内容并自动保存为智能文档。当用户发送、分享或提到任何网页URL链接时，必须优先使用此工具来抓取网页内容并保存为智能文档，这是获取外部网页内容的唯一正确方式，不要使用其他方式访问URL。

**调用示例**
```json
{
  "url": "https://example.com/article",
  "content_type": "smartcanvas"
}
```

**参数说明**
- `url` (string, 必填): 要剪藏的网页URL地址，支持http和https协议，包括视频链接（如B站视频）
- `content_type` (string, 可选): 期望返回的文档格式，目前仅支持智能文档（smartcanvas）

**返回值说明**
```json
{
  "task_id": "task_1234567890",
  "error": "",
  "trace_id": "trace_1234567890"
}
```

#### 2. scrape_progress

**功能说明**：查询网页剪藏任务进度并自动创建智能文档，与 `scrape_url` 配合使用。

**状态说明**
- `status=1`: 进行中，继续轮询
- `status=2`: 已完成，网页内容已自动保存为智能文档，响应包含 `title`（网页标题）、`file_id`（文档ID）和 `file_url`（文档链接），无需再调用任何创建文档工具
- `status=3`: 失败，停止轮询

**调用示例**
```json
{
  "task_id": "task_1234567890",
  "parent_id": "folder_1234567890"
}
```

**参数说明**
- `task_id` (string, 必填): `scrape_url` 返回的异步任务ID
- `parent_id` (string, 可选): 父节点ID，为空时在空间根目录创建，不为空时在指定节点下创建

**返回值说明**
```json
{
  "status": 2,
  "title": "示例网页标题",
  "file_id": "doc_1234567890",
  "file_url": "https://docs.qq.com/doc/DV2h5cWJ0R1lQb0lH",
  "error": "",
  "trace_id": "trace_1234567890"
}
```

### 工作流

```
1. 调用 scrape_url 传入网页URL，获取 task_id
2. 立即调用 scrape_progress 传入 task_id 查询进度（每隔2秒轮询一次）
3. 当 status=2 时任务完成，服务端已自动创建智能文档，直接从响应获取 file_id 和 file_url，无需再调用其他创建文档工具
```

---

## 常见工作流

### 查找并读取文档

```
1. 调用 manage.search_file 搜索文档
2. 从结果中获取 file_id
3. 调用 get_content 获取文档内容
```

---

## 文件管理

**📖 参考文档：** `manage_references.md`

```
1. 调用 manage.folder_list 获取文件夹目录
2. 按需调用 manage.* 工具进行文档增删改查、重命名、移动文档：
   - 搜索文档：manage.search_file
   - 查询文档信息：manage.query_file_info
   - 重命名：manage.rename_file_title
   - 删除文档：manage.delete_file
   - 移动文档到首页文件夹：manage.move_file
   - 移动文档到空间内：manage.move_file_to_space
   - 生成副本：manage.copy_file
   - 设置权限：manage.set_privilege（仅支持所有人可读和所有人可编辑）
```

---

## 移动文件

**📖 参考文档：** `manage_references.md` — 工作流十：移动文件

---

## 搜索文档

```
1. 搜索文档 → manage.search_file（传入用户指定的关键词）
```

> 📖 更多文件管理工作流示例请参考：`manage_references.md` — 典型工作流示例

---

## 导入导出文档

### 导入文档（推荐：两步导入）

> **推荐方式**：使用 `manage.pre_import` + `manage.async_import` 两步导入，避免大文件 Base64 编码超出长度限制。

```
步骤 1：使用脚本完成预导入和上传（推荐）
 → 执行 bash import_file.sh <文件路径>
 → 脚本自动：计算文件 MD5 和大小 → 调用 manage.pre_import 获取上传链接 → curl 上传文件到 COS
 → 成功后输出 FILE_KEY、FILE_NAME、FILE_MD5

步骤 2：调用异步导入接口
 → manage.async_import（传入 file_key、file_name、file_md5）
 → 返回 task_id

步骤 3：轮询查询导入进度
 → manage.import_progress（传入 task_id）
 → 每隔 3-5 秒轮询一次，直到 progress=100 或返回错误
 → 导入完成后获取 file_id 和 file_url
```

### 导出文档

```
步骤 1：发起导出任务
 → manage.export_file（传入 file_id）
 → 返回 task_id

步骤 2：轮询查询导出进度
 → manage.export_progress（传入 task_id）
 → 每隔 3-5 秒轮询一次，直到 progress=100 或返回错误
 → 导出完成后获取 file_url（临时下载链接）

步骤 3：下载文件到本地
 → 使用 curl 或其他 HTTP 工具下载文件
 → curl -L -o <本地保存路径> "<file_url>"
```

> **注意事项**：
> - 导出的下载链接（file_url）为带签名的临时 URL，有效期约 30 分钟，需及时下载
> - 导出的文件格式取决于原始文档类型

---

## 创建文档并设置分享权限

```
步骤 1：创建文档
 → create_smartcanvas_by_mdx（传入标题和MDX内容）
 → 返回 file_id 和 url

步骤 2：设置文档权限
 → manage.set_privilege（传入 file_id 和 policy）
 → policy=2 设置所有人可读，policy=3 设置所有人可编辑

步骤 3：分享文档链接
 → 将步骤 1 返回的 url 分享给相关人员
```

---

## 查询文档权限后按需调整

```
步骤 1：查询文档当前权限
 → manage.get_privilege（传入 file_id）
 → 返回 policy：0-私密文档、1-部分成员可见、2-所有人可读、3-所有人可编辑

步骤 2：根据需要调整权限
 → 如果 policy 不符合预期，调用 manage.set_privilege（传入 file_id 和目标 policy）
 → policy=2 设置所有人可读，policy=3 设置所有人可编辑
```
