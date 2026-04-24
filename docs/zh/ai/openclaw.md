# OpenClaw 介绍、安装与用法

> 本文基于 OpenClaw 官网与官方文档整理，按“介绍、安装、用法”三个部分组织，便于快速了解和上手。

## 一、OpenClaw 是什么

OpenClaw 是一个开源、自托管的 AI 助手与 Gateway。它运行在你自己的电脑或服务器上，把 AI 模型能力、聊天入口、浏览器自动化、文件操作和命令执行整合到同一套工作流中，让 AI 不只是“会聊天”，而是能够真正帮你完成任务。

相比单纯的网页聊天工具，OpenClaw 更像是一层“本地 AI 操作系统”：

- 可以运行在 macOS、Windows、Linux 上
- 可以接入云端模型，也可以接入 Ollama 等本地模型
- 可以通过浏览器控制台直接使用，也可以接入微信、Telegram、Discord、Slack、Signal、iMessage 等聊天入口
- 可以读写文件、执行命令、调用工具、操作浏览器
- 支持记忆、技能扩展、插件和多 Agent 管理

从官网展示来看，OpenClaw 的核心定位不是普通聊天机器人，而是“真正会做事的 AI”。它适合以下场景：

- 本地个人 AI 助手
- 开发者自动化工具
- 私有化部署的 AI 网关
- 将多模型、多渠道、多工具统一接入的一体化助手平台

### 核心能力

#### 1. 本地运行与隐私可控
OpenClaw 可以直接运行在自己的设备上，数据链路和权限边界更容易掌控，适合对隐私和可控性要求较高的场景。

#### 2. 多模型接入
它可以接入 Anthropic、OpenAI、Google 等云模型，也支持通过 Ollama 接入本地模型。对于想同时使用“高能力云模型 + 本地低成本模型”的用户非常合适。

#### 3. 多入口交互
除了 Control UI，OpenClaw 还支持将 AI 接入聊天渠道。这样可以直接在聊天软件里与自己的 AI 助手互动，而不必始终停留在单独的网页页面中。

#### 4. 真正可执行的工具能力
OpenClaw 不只是生成文本，还能在授权范围内调用工具，例如：

- 读写本地文件
- 执行命令
- 访问浏览器
- 管理会话与工作空间
- 调用搜索、技能、插件等扩展能力

#### 5. 更适合长期使用
它支持 Agent、会话、工作空间、配置文件和技能体系，更适合长期运行，而不是一次性问答。

## 二、如何安装 OpenClaw

### 安装前准备

在官方文档中，OpenClaw 的安装前提主要包括：

- Node.js 24 为推荐版本
- Node.js 22.14+ 也受支持
- 支持 macOS、Linux、Windows
- Windows 原生与 WSL2 都支持，但官方更推荐 WSL2

如果使用官方一键安装脚本，Node 环境会自动处理；如果你使用 npm、pnpm、bun 安装，则需要自己准备 Node 环境。

### 方式一：官方一键安装脚本

这是官方推荐的最快安装方式。官网首页将其描述为“一键安装”，会自动处理运行环境并安装 OpenClaw；官方安装文档则说明它会识别系统、在需要时安装 Node、安装 OpenClaw，并直接进入引导配置流程。

#### macOS / Linux / WSL2

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

#### Windows PowerShell

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

如果你只想安装、不想立即进入引导流程，可以使用 `--no-onboard`：

#### macOS / Linux / WSL2

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

#### Windows PowerShell

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
```

### 方式二：使用包管理器安装

如果你已经自行维护 Node 环境，可以直接通过包管理器安装 OpenClaw CLI。

#### npm

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

#### pnpm

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

> `pnpm` 首次安装后需要执行 `pnpm approve-builds -g`，这是官方文档特别说明的步骤。

#### bun

```bash
bun add -g openclaw@latest
openclaw onboard --install-daemon
```

### 方式三：从源码安装

如果你希望基于源码运行，或者用于贡献、调试和深度定制，可以使用源码方式安装：

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

### 可选方式：Docker 安装

Docker 方式更适合以下场景：

- 需要容器化部署
- 需要在服务器或 VPS 上运行
- 希望把 Gateway 运行环境和宿主机隔离开

官方文档明确说明：如果你只是想在自己的电脑上快速使用 OpenClaw，优先选择正常安装流程；Docker 更适合容器化或无头部署场景。

### 安装后建议先做的验证

安装完成后，建议先执行以下命令确认 CLI、配置和 Gateway 状态正常：

```bash
openclaw --version
openclaw doctor
openclaw gateway status
```

其中：

- `openclaw --version` 用于确认 CLI 已正确安装
- `openclaw doctor` 用于检查配置与迁移问题
- `openclaw gateway status` 用于确认 Gateway 是否正常运行

## 三、OpenClaw 的基础用法

### 第一步：运行引导配置

官方推荐使用 `onboard` 完成首次配置：

```bash
openclaw onboard --install-daemon
```

这个引导流程通常会帮你完成以下工作：

- 选择模型提供方
- 配置 API Key 或本地模型接入方式
- 配置本地 Gateway
- 进行健康检查
- 安装推荐技能和必要依赖

如果以后需要重新配置，也不必重新安装，可以继续使用：

```bash
openclaw configure
```

### 第二步：确认 Gateway 正常运行

OpenClaw 的 Gateway 是整套系统的核心服务，它负责管理会话、通道、节点、Hook 和控制界面。

查看运行状态：

```bash
openclaw gateway status
```

如果你需要手动运行本地 Gateway，也可以使用：

```bash
openclaw gateway
```

或前台运行别名：

```bash
openclaw gateway run
```

常见服务管理命令包括：

```bash
openclaw gateway install
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
openclaw gateway status
```

默认情况下，Gateway 常见端口为 `18789`。

### 第三步：打开控制台界面

Gateway 正常运行后，可以通过 Control UI 与 OpenClaw 交互：

```bash
openclaw dashboard
```

如果你只想输出链接而不自动打开浏览器，可以使用：

```bash
openclaw dashboard --no-open
```

这是最适合新手的第一种使用方式：直接在浏览器里聊天、查看状态、管理配置。

### 第四步：发送第一条消息

完成安装和引导后，可以直接在 Control UI 中发送消息，验证整套链路是否正常。等浏览器侧跑通后，再逐步接入 Telegram、Discord、Slack 等聊天渠道会更稳妥。

### 第五步：接入本地 Ollama 模型

如果你希望将 OpenClaw 与本地模型结合使用，官方文档推荐使用 Ollama。

#### 1. 安装 Ollama 并拉取模型

```bash
ollama pull gemma4
```

你也可以使用其他模型，例如：

```bash
ollama pull gpt-oss:20b
ollama pull llama3.3
```

#### 2. 在 OpenClaw 引导流程中选择 Ollama

```bash
openclaw onboard
```

之后在 Provider 列表中选择 `Ollama`。官方文档说明，OpenClaw 会：

- 默认使用 `http://127.0.0.1:11434`
- 自动发现可用模型
- 在需要时自动拉取选中的本地模型
- 支持 `Local` 或 `Cloud + Local` 两种模式

#### 3. 手动启用 Ollama

如果你更偏向手动配置，也可以先设置：

```bash
export OLLAMA_API_KEY="ollama-local"
```

然后查看和切换模型：

```bash
openclaw models list
openclaw models set ollama/gemma4
```

#### 4. 重要注意事项

官方文档特别提醒：如果你接的是 Ollama 服务地址，不要使用 OpenAI 兼容路径 `/v1`，例如不要写成：

```bash
http://host:11434/v1
```

OpenClaw 推荐使用 Ollama 原生 API 地址：

```bash
http://host:11434
```

原因是 `/v1` 模式下工具调用可能不稳定，模型甚至可能把工具 JSON 当普通文本输出。

### 第六步：管理模型、Agent 和配置

随着使用深入，最常见的几个命令通常包括：

```bash
openclaw models list
openclaw models set ollama/gemma4
openclaw agents add work-assistant
openclaw configure
openclaw doctor
```

OpenClaw 的配置文件默认位于：

```bash
~/.openclaw/openclaw.json
```

如果你需要长期使用多个助手、多个工作空间或多个渠道，这个配置文件会成为后续扩展的核心入口。

## 总结

如果把 OpenClaw 简单理解成“另一个 AI 客户端”，就低估它了。它更准确的定位是一个可本地运行、可接多模型、可接多渠道、可执行真实任务的 AI Gateway。

建议按下面的顺序上手：

1. 先用官方安装脚本或 npm 安装 CLI
2. 运行 `openclaw onboard --install-daemon`
3. 用 `openclaw gateway status` 检查服务状态
4. 用 `openclaw dashboard` 打开控制台
5. 确认浏览器侧可用后，再接入 Ollama 或聊天渠道

这样最稳，也最符合官方推荐路径。
