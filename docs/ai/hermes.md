# Hermes Agent 介绍、安装与用法

> 本文基于 Nous Research 官方仓库与 Hermes Agent 官方文档整理，重点介绍 Hermes Agent 的定位、安装方式、基础用法与适用场景。

## 一、Hermes Agent 是什么

Hermes Agent 是 Nous Research 推出的开源 AI Agent。它不是普通的聊天客户端，也不是只在 IDE 里辅助补全的 Copilot，而是一个可以长期运行、持续积累记忆、不断生成和改进技能的自主 Agent 系统。

官方文档对它的定位非常明确：这是一个“会随着使用变强”的 AI Agent。它不仅能对话，还能把经验沉淀下来，在后续任务中继续复用。

### 它和普通 AI 客户端的区别

Hermes Agent 的重点不只是“调用模型”，而是把以下能力组织成一整套长期运行的工作系统：

- 长期记忆
- 技能沉淀与自改进
- 多平台消息入口
- 工具调用与终端执行
- 定时任务与自动化
- 多 Agent / 子 Agent 并行协作

从定位上看，Hermes 更接近“持续运行的 AI 助手 / AI 执行体”，而不是一次性问答工具。

### 核心特性

#### 1. 自改进学习循环
这是 Hermes 最有辨识度的一点。官方文档强调它内置了 learning loop：Agent 会从任务经验中生成技能、在后续使用中继续改进技能，并推动记忆持续积累。

#### 2. 长期记忆与跨会话上下文
Hermes 支持跨会话记忆，不是只依赖当前对话窗口。它既可以记住用户习惯，也可以把长期知识沉淀到本地配置和记忆文件中。

#### 3. 多平台运行
Hermes 不只在本机 CLI 中使用，还可以接入：

- Telegram
- Discord
- Slack
- WhatsApp
- Signal
- Matrix
- Mattermost
- Email
- Feishu / Lark
- WeCom 等

这意味着它可以作为一个“长期在线的消息型 Agent”存在。

#### 4. 多种终端后端
官方文档提到 Hermes 支持多种 terminal backend，包括：

- local
- Docker
- SSH
- Daytona
- Singularity
- Modal

因此它既可以跑在本机，也可以跑在远程服务器、容器环境或更偏云化的运行环境中。

#### 5. MCP、技能与自动化
Hermes 支持 MCP、技能系统、计划任务、子 Agent 并行处理和工具调用，比较适合长期演化成“自己的 Agent 工作台”。

## 二、如何安装 Hermes Agent

### 平台支持

根据官方安装文档，Hermes Agent 当前主要支持：

- Linux
- macOS
- WSL2
- Android（Termux）

需要注意的是：

- 原生 Windows 不受官方支持
- Windows 用户官方推荐使用 WSL2

### 安装前提

官方安装指南说明，唯一硬性前提是本机有 `git`。其余依赖通常由安装器自动处理，包括：

- Python
- Node.js
- ripgrep
- ffmpeg
- 虚拟环境与 CLI 命令安装

### 官方一键安装

这是最推荐的安装方式：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

安装完成后，重新加载 shell：

```bash
source ~/.bashrc
```

或者：

```bash
source ~/.zshrc
```

然后直接启动：

```bash
hermes
```

### Docker 方式

如果希望用 Docker 跑 Hermes，官方也提供了容器化路径。首次配置常见方式如下：

```bash
mkdir -p ~/.hermes
docker run -it --rm \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent setup
```

如果之后要作为后台 Gateway 持续运行，可以使用：

```bash
docker run -d \
  --name hermes \
  --restart unless-stopped \
  -v ~/.hermes:/opt/data \
  -p 8642:8642 \
  nousresearch/hermes-agent gateway run
```

### 安装后的第一步

官方文档最推荐的顺序不是立刻加一堆插件，而是先确保“基础对话可用”：

1. 安装 Hermes
2. 配置模型提供方
3. 跑通一条正常对话
4. 再逐步叠加 Gateway、技能、语音、自动化等能力

这个顺序很重要，因为 Hermes 的功能很多，但官方也明确提醒：如果最基础的聊天都没有跑通，不要急着继续叠加更复杂能力。

## 三、Hermes Agent 的基础用法

### 1. 先配置模型

官方 Quickstart 建议首先执行：

```bash
hermes model
```

这个命令会交互式地引导你选择模型提供方和默认模型。

官方给出的建议大致是：

- 最省心：Nous Portal 或 OpenRouter
- 已有 Claude / Codex 认证：可直接选 Anthropic 或 OpenAI Codex
- 想走本地或私有化：可选 Ollama 或自定义 OpenAI 兼容端点

### 2. 重要限制：模型上下文至少 64K

Hermes 官方文档特别强调：Hermes Agent 需要至少 64K tokens 的上下文窗口。

原因是它要处理多步工具调用、长上下文记忆和复杂任务编排。上下文窗口太小的模型，无法稳定支撑这类工作流。

如果你走本地模型路线，这一点尤其要提前确认。

### 3. 启动第一条对话

安装完成并选择好模型后，直接运行：

```bash
hermes
```

这会进入交互式 CLI 会话。

在 Hermes 中，CLI 是非常重要的一等入口，不是附属功能。官方文档列出的常见命令包括：

```bash
hermes
hermes model
hermes tools
hermes setup
hermes gateway
hermes doctor
```

### 4. 使用完整设置向导

如果你不想逐项配置，也可以直接运行：

```bash
hermes setup
```

或者只配置某一部分：

```bash
hermes setup model
hermes setup gateway
hermes setup tools
hermes setup agent
```

这比手动逐项改配置文件更适合初次使用。

### 5. 配置消息网关

如果你希望 Hermes 通过消息平台长期在线运行，可以使用：

```bash
hermes gateway setup
```

常见网关命令包括：

```bash
hermes gateway
hermes gateway setup
hermes gateway install
hermes gateway start
hermes gateway stop
hermes gateway status
```

Hermes 的 Gateway 不只是消息转发层，它还会负责会话路由、定时任务调度等功能。

### 6. 常见聊天命令

在消息平台中，官方文档列出了这些常见命令：

- `/new` 或 `/reset`
- `/model`
- `/provider`
- `/personality`
- `/retry`
- `/undo`
- `/status`
- `/stop`
- `/compress`
- `/usage`
- `/voice`

这说明 Hermes 的消息端并不是简单“转发聊天”，而是拥有一套完整的 Agent 控制指令体系。

## 四、Hermes 的记忆、上下文与技能

### 记忆系统

Hermes 的一个核心卖点是长期记忆。它不只依赖会话上下文，还会把长期信息写入自己的记忆体系中，持续影响后续行为。

### 配置与数据目录

Hermes 的长期配置与运行数据默认会落在 `~/.hermes` 目录下。实际使用中最常见的几个位置包括：

- `~/.hermes/config.yaml`：主配置文件
- `~/.hermes/.env`：环境变量与密钥配置
- `~/.hermes/SOUL.md`：Agent 身份定义

如果你准备长期使用 Hermes，这个目录基本可以理解为它的“主数据目录”。

### 上下文文件

官方配置文档里提到，Hermes 会读取多类上下文文件，例如：

- `SOUL.md`
- `.hermes.md`
- `HERMES.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.cursorrules`

其中：

- `SOUL.md` 是 Agent 的主要身份定义
- `AGENTS.md` 等文件则用于项目级上下文和工作目录规则

这意味着 Hermes 对“项目规则文件”兼容度较高，适合接进开发工作流中。

### 技能系统

Hermes 支持技能搜索、安装与复用，例如：

```bash
hermes skills search kubernetes
hermes skills install openai/skills/k8s
```

这让它更像一个可以不断装配和成长的 Agent 平台，而不是单体程序。

## 五、Hermes 与 OpenClaw 的关系

对于你这个项目来说，这一点其实很值得单独写清楚。

Hermes 和 OpenClaw 都属于“自托管 Agent / Gateway”这一类工具，但侧重点不同：

- `OpenClaw` 更偏向多渠道接入、本地运行、AI Gateway 和数字助理体验
- `Hermes Agent` 更强调长期学习、记忆、技能、Agent 演化和更强的 CLI / Gateway 双形态

另外，Hermes 官方文档已经明确提供了从 OpenClaw 迁移的路径：

```bash
hermes claw migrate
```

还支持：

```bash
hermes claw migrate --dry-run
hermes claw migrate --preset full --yes
```

官方迁移文档说明，Hermes 可以从 OpenClaw 导入的内容包括：

- Persona
- Memory
- Skills
- 部分 API Key
- 部分平台配置
- Workspace 指令文件

这说明它们在使用定位上确实存在很强的连续性。

## 六、Hermes 适合什么场景

Hermes 更适合以下场景：

- 想长期运行个人 AI Agent
- 想让 Agent 具备长期记忆和技能积累
- 想把 CLI 与消息平台打通
- 想在本机、服务器、Docker、远程终端之间灵活迁移
- 想把 AI 助手做成一个持续演化的工作系统

如果你的目标只是“本地跑模型并简单问答”，Hermes 可能偏重；但如果你想搭建一套会长期使用、会持续成长的 Agent 环境，Hermes 就很值得单独了解。

## 七、Hermes 的模型与 Provider 生态

Hermes 的另一个强项是 Provider 生态比较完整。官方文档显示，它既支持云端模型，也支持本地或自托管端点。

当前官方文档中明确列出的 Provider 包括：

- `nous`
- `openrouter`
- `openai-codex`
- `copilot`
- `anthropic`
- `huggingface`
- `zai`
- `kimi-coding`
- `minimax`
- `minimax-cn`
- `custom`

这意味着 Hermes 并不绑定某一个模型厂商，而是更像一个“Agent 编排层”。

### 常见接入方式

#### 1. 最省心的默认路径

```bash
hermes model
```

直接用交互式方式选择：

- Nous Portal
- OpenRouter
- Anthropic
- OpenAI Codex
- Copilot
- Ollama / 自定义 OpenAI 兼容端点

#### 2. 本地模型接入

如果你已经有 Ollama 或 vLLM 这类本地服务，可以通过 Hermes 的 provider 配置把本地模型挂进来。这样做的好处是：

- 隐私更可控
- 成本更可控
- 能把本地模型直接接入 Hermes 的技能、记忆和 Gateway 体系

#### 3. 回退 Provider

Hermes 还支持 fallback provider。也就是说，当主 Provider 异常、限流或响应失败时，可以切换到备用 Provider，减少会话中断。

这对于长期运行的 Agent 特别重要。

## 八、Hermes 的运行形态

Hermes 不是只有一种用法。官方资料表明，它至少有三种典型运行形态：

### 1. CLI 交互模式

最常见也最推荐的入口：

```bash
hermes
```

适合：

- 本地开发
- 个人使用
- 快速调试 Agent 行为

### 2. Gateway 消息模式

适合把 Hermes 接入 Telegram、Discord、Slack、WhatsApp、Signal、Email 等渠道，让它长期在线工作：

```bash
hermes gateway setup
hermes gateway start
```

适合：

- 长期运行数字助理
- 团队消息入口
- 定时任务、提醒、自动化处理

### 3. 远程 / 容器 / 服务器模式

Hermes 支持 Docker、SSH 等终端后端，适合把 Agent 运行在服务器或远程开发环境中。

适合：

- 远程开发机
- 容器化部署
- 团队共享运行环境

## 九、常用命令速查

下面这些命令基本覆盖了 Hermes 的日常使用核心路径：

```bash
hermes                  # 启动 CLI 会话
hermes model            # 选择 Provider 与模型
hermes tools            # 配置工具权限
hermes setup            # 一次性运行完整配置向导
hermes gateway          # 启动消息网关
hermes doctor           # 诊断问题
hermes update           # 更新 Hermes
hermes claw migrate     # 从 OpenClaw 迁移
```

如果你是第一次接触 Hermes，建议最少先跑通下面这一组：

```bash
hermes model
hermes
hermes doctor
```

## 十、上手顺序建议

如果你准备真正把 Hermes 用起来，推荐按下面的顺序操作：

1. 安装 Hermes
2. 执行 `hermes model` 选定 Provider 和模型
3. 直接运行 `hermes`，确认基础对话可用
4. 再配置 `hermes tools`
5. 最后再配置 `hermes gateway`、技能、记忆和自动化

这个顺序的好处是：先确认底层模型与 CLI 可用，再逐步叠加复杂能力，排错会轻松很多。
