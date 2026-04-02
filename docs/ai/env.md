# 基础配置

## ollama + open-webui
- Ollama 是一个开源工具，专为在本地计算机上​​快速部署和运行大型语言模型（LLM）​​而设计。通过简化的命令行操作，用户无需复杂配置即可调用诸如 DeepSeek、Qwen 等主流开源模型，适合：
开发者快速测试模型
研究者进行原型开发
企业实现私有化部署
```
curl -fsSL https://ollama.com/install.sh | sh
```

<!-- ollama本地模型 启动 openclaw  -->
```
openclaw gateway --port 18789
ollama launch openclaw
```

## LM Studio
LM Studio 是一个功能强大的本地AI模型管理工具，允许用户在个人电脑上运行各种开源大语言模型。它提供了一个直观的图形界面，让用户能够轻松下载、管理和与AI模型进行交互。

## OpenClaw

### 什么是 OpenClaw？
OpenClaw 是一个开源的个人 AI 助手框架，允许用户在本地部署和管理多个 AI 模型，提供统一的接口和工具链。

### 核心特性
- 多模型支持（Ollama、Zhipu AI、OpenAI 等）
- 统一命令行界面
- 插件系统
- 本地知识库
- 自动化任务管理

### 安装方法
```bash
# 使用 Homebrew 安装
brew install openclaw

# 或从源码安装
git clone https://github.com/openclaw/openclaw.git
cd openclaw
make install
```

### 基本配置
```bash
# 初始化配置
openclaw init

# 配置模型
openclaw models set zai/glm-4.6v

# 启动 Gateway
openclaw gateway start

# 查看状态
openclaw status
```

### 与其他工具的集成
OpenClaw 可以与 Ollama、LM Studio 等工具无缝集成，提供统一的 AI 体验。

## 其他常用 AI 工具

### Oobabooga Text Generation WebUI
- 基于 Gradio 的 Web 界面
- 支持多种模型格式
- 可视化参数调整
- 本地部署简单

### GPT-4All
- 轻量级本地模型运行器
- 支持多种模型格式
- 跨平台支持
- 简单易用

### ModelScope
- 阿里巴巴开源的模型平台
- 丰富的预训练模型
- 易于部署和使用
- 社区活跃

### Hugging Face Transformers
- 最流行的 AI 框架之一
- 丰富的模型库
- 灵活的 API
- 社区支持强大

## 选择建议

### 个人开发者
- Ollama + Open-WebUI：简单易用，适合快速测试
- LM Studio：图形界面友好，适合不熟悉命令行的用户

### 企业/研究机构
- OpenClaw：功能全面，支持多模型管理
- Hugging Face Transformers：适合深度定制和集成

### 性能考虑
- 轻量级任务：GPT-4All、Oobabooga
- 重型任务：LM Studio、OpenClaw
- 跨平台：Hugging Face Transformers

## 常见问题

### 如何选择合适的工具？
根据你的需求选择：
- 需要图形界面？→ LM Studio、Oobabooga
- 需要命令行工具？→ Ollama、OpenClaw
- 需要企业级功能？→ OpenClaw、Hugging Face

### 本地部署 vs 云服务
- 本地部署：数据隐私、离线使用、成本控制
- 云服务：易用性、可扩展性、维护简单

### 模型大小选择
- 小型模型：适合低配设备，响应快
- 大型模型：性能更好，但需要更多资源