# AI 环境配置总览

## 为什么要先理解环境栈

在本地部署 AI 工具时，最容易混淆的一点是：不同工具解决的是不同层的问题。有的负责运行模型，有的负责提供图形界面，有的负责把模型变成真正可执行任务的 Agent。

如果先把“层次”理清，再选工具会轻松很多。

推荐把 AI 本地环境拆成 4 层来理解：

- 模型运行层：负责把模型真正跑起来，例如 `Ollama`、`LM Studio`
- 交互界面层：负责提供网页或桌面交互界面，例如 `Open WebUI`
- Agent / 自动化层：负责把模型接到工具、文件、命令和消息渠道上，例如 `OpenClaw`、`Hermes Agent`
- 模型与数据层：负责具体使用哪个模型、如何接入 API、是否使用本地知识库和 RAG

## 推荐的环境组合

### 1. 最快的本地体验
适合刚开始接触本地 AI，希望先把模型跑起来并在浏览器里对话。

推荐组合：

- `Ollama`
- `Open WebUI`

这套组合的优点是：

- 安装路径成熟
- 本地隐私友好
- 对非开发者也比较友好
- 适合快速验证模型效果

### 2. 图形界面优先
适合更偏桌面应用体验，希望直接下载模型、切换参数、管理本地推理服务。

推荐组合：

- `LM Studio`

它更偏向“本地模型桌面工作台”，上手门槛较低，适合只想专注在模型下载、测试和本地 API 暴露的场景。

### 3. 需要 Agent 和自动化能力
适合希望 AI 不只是聊天，而是能执行命令、读写文件、接入消息渠道、长期运行、支持工作流和自动化。

推荐组合：

- `Ollama` 或云模型
- `OpenClaw` 或 `Hermes Agent`

其中：

- `OpenClaw` 更偏“自托管 AI Gateway / 数字助理”
- `Hermes Agent` 更偏“带学习能力和长期记忆的 AI Agent”

如果你想继续深入看具体工具，可以继续阅读：

- [OpenClaw 介绍页](/ai/openclaw)
- [Hermes 介绍页](/ai/hermes)
- [Codex 介绍页](/ai/codex)
- [Claude / Claude Code 介绍页](/ai/claude)
- [国内访问与合规说明](/ai/china-access)

## 核心工具说明

### Ollama

#### 它解决什么问题
Ollama 是本地大语言模型运行时，核心作用是把开源模型在本机或服务器上跑起来，并以统一命令行和 API 方式提供调用能力。

它适合：

- 本地测试开源模型
- 私有化部署
- 给 Open WebUI、OpenClaw、Hermes 这类上层工具提供模型能力

#### 安装方式

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### 常见命令

```bash
ollama serve
ollama pull qwen3
ollama list
ollama run qwen3
```

#### 适合什么场景

- 希望自己掌控模型数据与运行环境
- 不依赖云 API
- 想给本地网页 UI 或 Agent 工具提供模型后端

### Open WebUI

#### 它解决什么问题
Open WebUI 是一个自托管的 AI Web 界面。它可以连接 Ollama 和 OpenAI 兼容 API，让你在浏览器中完成聊天、文档问答、RAG、模型切换等操作。

如果说 Ollama 是“模型运行层”，那么 Open WebUI 更像“浏览器交互层”。

#### 安装方式

如果本机已经有 Ollama，官方常见启动方式是：

```bash
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

如果希望把 Ollama 一并打包进同一个容器，也可以使用官方 `:ollama` 镜像。

#### 它的优势

- 浏览器体验友好
- 支持 Ollama 与 OpenAI 兼容接口
- 可扩展 RAG、插件、管道和权限体系
- 比纯命令行更适合日常问答和团队演示

#### 适合什么场景

- 个人本地聊天工作台
- 团队内部 AI 门户
- 需要网页界面而不是纯命令行

### LM Studio

#### 它解决什么问题
LM Studio 是本地模型桌面应用，强调图形化体验。它适合用来下载模型、管理模型、运行推理服务，并将本地模型以 API 形式暴露给其他工具调用。

#### 安装方式

官方提供的常见安装方式包括：

#### macOS / Linux

```bash
curl -fsSL https://lmstudio.ai/install.sh | bash
```

#### Windows

```powershell
irm https://lmstudio.ai/install.ps1 | iex
```

#### 它的特点

- 图形化程度高
- 本地模型管理更直观
- 可以连接远程 LM Studio 实例
- 提供 SDK 与本地 API，适合开发调试

#### 适合什么场景

- 更偏桌面 GUI 的用户
- 想快速切模型、调参数、观察推理状态
- 想把本地模型作为 API 服务供其他工具调用

### OpenClaw

#### 它解决什么问题
OpenClaw 是自托管的 AI Gateway / 数字助理，重点不在“跑模型”本身，而在把模型、聊天入口、浏览器能力、命令执行和工具调用统一起来。

#### 更适合谁

- 想把 AI 接入微信、Telegram、Slack 等渠道
- 想让 AI 具备文件、浏览器、命令执行能力
- 想长期运行一个私有化 AI 助手

更完整内容请看：

- [OpenClaw 介绍页](/ai/openclaw)

### Hermes Agent

#### 它解决什么问题
Hermes Agent 是 Nous Research 推出的开源 AI Agent，强调长期使用中的“学习、记忆、技能积累和多平台运行”。它不是单纯的聊天工具，而是一个会随着使用不断变强的 Agent 系统。

#### 更适合谁

- 想要更强的长期记忆与技能沉淀
- 想把 AI 作为持续运行的个人或团队 Agent
- 想在 CLI、网关、聊天平台、远程主机之间灵活切换

更完整内容请看：

- [Hermes 介绍页](/ai/hermes)

### Codex

#### 它解决什么问题
Codex 是 OpenAI 的 coding agent，适合把“理解代码、改代码、执行测试、代码审查、云端并行任务”整合到同一套编码工作流里。

#### 更适合谁

- 想在 Web、CLI、IDE、云端之间切换的人
- 想把 AI 深度接入工程研发流程的人
- 需要编码 Agent 而不只是补全的人

更完整内容请看：

- [Codex 介绍页](/ai/codex)

### Claude / Claude Code

#### 它解决什么问题
Claude 是通用型 AI 助手，而 Claude Code 是 Anthropic 面向终端开发工作流的 coding agent，适合读代码、改代码、跑命令、接 MCP。

#### 更适合谁

- 想要高质量通用 AI 助手的人
- 想在终端里使用 coding agent 的开发者
- 想结合 MCP、工具链和本地开发环境的人

更完整内容请看：

- [Claude / Claude Code 介绍页](/ai/claude)

## 如何做环境选择

### 如果你只想尽快跑通本地模型
优先考虑：

- `Ollama`
- `Open WebUI`

### 如果你更喜欢桌面图形界面
优先考虑：

- `LM Studio`

### 如果你需要真正的 Agent 自动化
优先考虑：

- `OpenClaw`
- `Hermes Agent`

### 如果你同时在意隐私与扩展能力
优先考虑：

- `Ollama` 作为本地模型后端
- `Open WebUI` 作为浏览器工作台
- `OpenClaw` 或 `Hermes Agent` 作为自动化和多渠道入口

## 一条实用建议

如果你还不确定从哪里开始，最稳妥的顺序是：

1. 先用 `Ollama` 跑通本地模型
2. 再用 `Open WebUI` 验证网页交互体验
3. 最后根据需求选择 `OpenClaw`、`Hermes Agent`、`Codex` 或 `Claude Code`

这样可以先把“模型能不能跑”与“Agent 能不能工作”分开排查，整个环境会更清晰，也更容易维护。
