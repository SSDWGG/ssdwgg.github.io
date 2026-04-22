# Claude 与 Claude Code 介绍

> 本文基于 Anthropic 官方产品页、帮助中心与 Claude Code 官方文档整理，分为两部分：先介绍 Claude，再介绍 Claude Code 的安装与使用方式。

## 一、Claude 是什么

Claude 是 Anthropic 推出的通用大语言模型与 AI 助手。官方帮助中心对它的定义很直接：Claude 是 Anthropic 构建的 LLM，目标是成为一个有帮助、诚实、无害，并具备对话能力的助手。

相比只强调“模型参数”或“单项基准”的介绍，Anthropic 对 Claude 的产品定位更偏向“解决问题的 AI 合作伙伴”。

从官方产品页来看，Claude 的主要特点包括：

- 擅长复杂问题拆解
- 适合写作、分析、研究、代码等知识型任务
- 可通过桌面端、移动端和 Web 使用
- 在部分入口中支持更主动的任务协作能力

## 二、Claude 的主要使用入口

### 1. Claude Web

最常见入口是 Claude Web，也就是用户熟悉的聊天界面。

适合：

- 日常对话
- 文档分析
- 写作和总结
- 研究和计划类任务

### 2. Claude Desktop

Anthropic 官方产品页明确提供桌面端下载入口，适合把 Claude 作为常驻桌面助手使用。

相对 Web 版，桌面端更适合：

- 长时间工作流
- 和本地文件、桌面环境协作
- 使用更偏主动的任务功能

### 3. Claude Mobile

官方也提供 iOS 与 Android 应用，适合移动端快速问答和日常协作。

## 三、Claude 能做什么

按照官方产品定位，Claude 更适合以下几类任务：

- 复杂问题分析
- 文档阅读与总结
- 数据解释与结构化整理
- 头脑风暴与方案设计
- 编程与代码解释
- 研究与写作

如果把 Claude 当作“只会聊天的机器人”，会低估它。更准确地说，它是一个通用问题解决型助手。

## 四、Claude 的地区与可用性说明

Anthropic 官方帮助中心维护了 Claude 的支持地区列表。是否能正常使用 Claude，不是只看你有没有账号，还要看你所在地区是否属于官方支持范围。

截至 `2026-04-22`，Anthropic 官方支持地区页面中给出了可访问 Claude 的国家和地区列表。中国大陆未出现在该支持列表中。

这里我需要明确说明：这是我根据官方支持国家页面的公开列表做出的判断。

## 五、Claude Code 是什么

Claude Code 是 Anthropic 的 agentic coding tool，也就是偏 Agent 形态的编码工具。官方文档对它的描述很明确：它运行在终端里，帮助你更快把想法变成代码。

和普通 AI 编码工具相比，Claude Code 的核心特点是：

- 读取代码库上下文
- 修改多个文件
- 执行命令
- 跑测试
- 使用 MCP 接入外部工具
- 通过 CLI 深度参与开发流程

它更像是“终端里的编码 Agent”，而不是简单的补全插件。

## 六、如何安装 Claude Code

### 系统要求

根据 Anthropic 官方 Claude Code 文档，目前主要要求包括：

- 支持 macOS、Windows、Ubuntu、Debian、Alpine 等环境
- 4GB 以上内存
- 需要联网
- Shell 推荐 Bash、Zsh、PowerShell 或 CMD

另外，文档特别说明：

- 原生 Windows 可以使用
- 如果是原生 Windows，通常需要 `Git for Windows`
- WSL 也是官方支持路径

### 官方推荐安装方式

Anthropic 现在更推荐原生安装方式。

#### macOS / Linux / WSL

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

#### Windows PowerShell

```powershell
irm https://claude.ai/install.ps1 | iex
```

#### Windows CMD

```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

### 其他安装方式

官方文档还支持：

- Homebrew
- WinGet
- npm

例如 npm 安装：

```bash
npm install -g @anthropic-ai/claude-code
```

不过从当前官方文档看，原生安装已经是更推荐的主路径。

## 七、如何开始使用 Claude Code

### 第一步：确认安装

```bash
claude --version
claude doctor
```

其中：

- `claude --version` 用于确认 CLI 安装成功
- `claude doctor` 用于检查安装、配置和环境问题

### 第二步：登录账号

启动 `claude` 后，会进入认证流程。官方文档说明，Claude Code 需要以下任一账号类型：

- Pro
- Max
- Team
- Enterprise
- Console

官方同时说明：Claude.ai 免费计划不包含 Claude Code 访问权限。

### 第三步：进入项目目录启动

```bash
cd /path/to/your/project
claude
```

这会进入 Claude Code 的交互式会话。

## 八、Claude Code 的常见用法

### 1. 让它理解代码库

例如：

```text
解释这个项目的目录结构，并告诉我用户登录流程的关键文件。
```

### 2. 让它修改代码

例如：

```text
修复这个接口在参数为空时返回 500 的问题，并补上测试。
```

### 3. 让它执行开发命令

Claude Code 可以在终端中工作，因此很适合：

- 跑测试
- 检查日志
- 搜索文件
- 调试命令行工具链

### 4. 让它通过 MCP 连接外部工具

官方文档专门强调了 Claude Code 对 MCP 的支持。通过 MCP，它可以接入：

- 文档系统
- 任务系统
- 数据库
- 内部工具
- 外部 API

这会让 Claude Code 从“本地终端助手”升级成“可接企业工具链的编码 Agent”。

## 九、Claude Code 的常见命令

官方 CLI 文档中常见的使用方式包括：

```bash
claude
claude doctor
claude update
claude --model sonnet
claude --model opus
claude -p "explain this repository"
```

其中：

- `sonnet` 是偏日常编码任务的常用模型别名
- `opus` 更适合复杂推理任务

## 十、Claude 与 Claude Code 的关系

可以把它们简单理解为：

- `Claude` 是通用 AI 助手产品
- `Claude Code` 是偏软件工程与终端开发场景的专用形态

如果你主要做的是：

- 通用问答
- 文案写作
- 文档分析
- 研究与总结

那么 Claude 本体就够用了。

如果你主要做的是：

- 读代码
- 改代码
- 跑测试
- 终端开发
- 工程自动化

那 Claude Code 会更适合。

## 十一、适合什么人使用

Claude 适合：

- 知识工作者
- 研究与写作用户
- 产品、运营、分析类角色
- 需要高质量通用 AI 协作的人

Claude Code 适合：

- 开发者
- DevOps / 平台工程师
- 需要终端工作流的人
- 需要把 AI 真正接入代码仓库的人

如果你想把 Anthropic 这一条产品线理解清楚，最简单的方式就是把它分成“通用 Claude”与“工程向 Claude Code”来看。
