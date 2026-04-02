# OpenClaw 介绍与使用指南

## 什么是 OpenClaw？

OpenClaw 是一个开源的个人 AI 助手框架，允许用户在本地部署和管理多个 AI 模型，提供统一的接口和工具链。它旨在简化 AI 模型的使用和管理，让用户能够轻松地与各种 AI 模型进行交互，无需深入了解底层技术细节。

## 核心特性

### 多模型支持
- 支持 Ollama、Zhipu AI、OpenAI、Anthropic 等多种模型提供商
- 统一的模型管理界面，无需分别学习不同平台的 API
- 灵活的模型切换机制，支持热切换和回退策略

### 统一命令行界面
- 简洁的 CLI 命令，一致的命令格式
- 丰富的命令选项和参数
- 详细的帮助文档和自动补全

### 插件系统
- 可扩展的插件架构，支持自定义功能
- 丰富的内置插件（Web 搜索、知识库、工具调用等）
- 插件市场，方便获取和分享插件

### 本地知识库
- 内置知识库管理，支持多种格式
- RAG (检索增强生成) 支持，提高回答准确性
- 知识更新机制，保持信息最新

### 自动化任务管理
- 定时任务支持，基于 cron 表达式
- 任务调度系统，支持复杂依赖关系
- 任务监控和日志，便于调试和优化

### 安全性
- 本地部署，数据隐私保护
- 认证和授权机制
- 安全的 API 密钥管理

## 安装方法

### 使用 Homebrew 安装（推荐）
```bash
# 安装 OpenClaw
brew install openclaw

# 验证安装
openclaw --version

# 查看帮助
openclaw --help
```

### 从源码安装
```bash
# 克隆仓库
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 编译安装
make install

# 验证安装
openclaw --version
```

### Docker 安装
```bash
# 拉取 Docker 镜像
docker pull openclaw/openclaw:latest

# 运行容器
docker run -d -p 18789:18789 openclaw/openclaw:latest

# 查看容器状态
docker ps | grep openclaw
```

### 直接下载安装
```bash
# 下载最新版本
wget https://github.com/openclaw/openclaw/releases/latest/download/openclaw-darwin-amd64.tar.gz

# 解压
tar -xzf openclaw-darwin-amd64.tar.gz

# 添加到 PATH
export PATH=$PATH:./openclaw-darwin-amd64
```

## 基本配置

### 初始化配置
```bash
# 初始化 OpenClaw 配置
openclaw init

# 配置文件位置
~/.openclaw/openclaw.json

# 配置文件示例
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "zai/glm-4.6v"
      }
    }
  }
}
```

### 配置模型
```bash
# 设置默认模型
openclaw models set zai/glm-4.6v

# 查看可用模型
openclaw models list

# 查看模型状态
openclaw models status

# 添加回退模型
openclaw models fallbacks add zai/glm-4.7

# 清除回退模型
openclaw models fallbacks clear
```

### 配置插件
```bash
# 启用插件
openclaw plugins enable web-search

# 禁用插件
openclaw plugins disable web-search

# 查看插件列表
openclaw plugins list

# 更新插件
openclaw plugins update
```

### 配置知识库
```bash
# 添加知识库
openclaw knowledge add my_knowledge --path ./documents

# 设置知识库参数
openclaw knowledge config my_knowledge --chunk-size 512 --overlap 50

# 查看知识库状态
openclaw knowledge status my_knowledge
```

## 基本用法

### 启动 Gateway
```bash
# 启动 OpenClaw Gateway
openclaw gateway start

# 自定义端口
openclaw gateway start --port 18888

# 后台运行
openclaw gateway start --daemon

# 查看 Gateway 状态
openclaw gateway status

# 停止 Gateway
openclaw gateway stop
```

### 交互式使用
```bash
# 启动交互式 shell
openclaw shell

# 运行命令
openclaw run "请介绍一下你自己"

# 执行脚本
openclaw run-file my_script.sh

# 批量处理
openclaw batch process input.txt output.txt
```

### 模型管理
```bash
# 切换模型
openclaw models set zai/glm-5

# 查看当前模型
openclaw models current

# 测试模型
openclaw models test zai/glm-4.6v
```

## 高级功能

### 知识库管理
```bash
# 添加知识库
openclaw knowledge add docs --path ./documents --type text

# 更新知识库
openclaw knowledge update docs

# 删除知识库
openclaw knowledge remove docs

# 查询知识库
openclaw knowledge query docs "什么是 OpenClaw?"
```

### 定时任务
```bash
# 添加定时任务
openclaw cron add "每天早上 9 点提醒我" --schedule "0 9 * * *" --command "openclaw run '早上好！'"

# 查看任务列表
openclaw cron list

# 删除任务
openclaw cron remove <task-id>

# 运行任务
openclaw cron run <task-id>
```

### 插件开发
```python
# 示例插件
from openclaw import Plugin, Command

class WeatherPlugin(Plugin):
    name = "weather"
    
    def setup(self):
        self.register_command("weather", self.get_weather)
    
    def get_weather(self, args):
        # 获取天气信息
        return "今天天气晴朗，温度 25°C"

# 注册插件
openclaw plugins register weather_plugin.py
```

### 工作流管理
```bash
# 创建工作流
openclaw workflow create email-processing

# 添加步骤
openclaw workflow step add email-processing "extract-recipient" --command "python extract.py"

# 运行工作流
openclaw workflow run email-processing

# 查看工作流状态
openclaw workflow status email-processing
```

## 常用命令速查

| 命令 | 功能 | 示例 |
|------|------|------|
| `openclaw init` | 初始化配置 | `openclaw init` |
| `openclaw models set` | 设置模型 | `openclaw models set zai/glm-4.6v` |
| `openclaw gateway start` | 启动 Gateway | `openclaw gateway start` |
| `openclaw shell` | 启动交互式 shell | `openclaw shell` |
| `openclaw knowledge add` | 添加知识库 | `openclaw knowledge add docs` |
| `openclaw cron add` | 添加定时任务 | `openclaw cron add "提醒" --schedule "* * * * *"` |
| `openclaw plugins enable` | 启用插件 | `openclaw plugins enable web-search` |
| `openclaw status` | 查看状态 | `openclaw status` |
| `openclaw --help` | 查看帮助 | `openclaw --help` |

## 最佳实践

### 1. 模型选择策略
- **轻量级任务**：选择小型模型（如 GLM-4.5 Air）
- **复杂任务**：选择大型模型（如 GLM-5）
- **图像处理**：选择支持图像的模型（如 GLM-4.6V）
- **成本敏感**：选择免费或低成本模型

### 2. 知识库管理
- 定期更新知识库，保持信息最新
- 使用 RAG 增强生成质量
- 合理设置 chunk 大小和重叠比例
- 为不同主题创建独立的知识库

### 3. 性能优化
- 根据硬件选择合适模型
- 启用模型量化（如果支持）
- 优化上下文窗口大小
- 使用缓存机制减少重复计算

### 4. 安全考虑
- 保护 API 密钥，不要硬编码在代码中
- 定期更新 OpenClaw 到最新版本
- 监控系统资源使用情况
- 设置适当的访问权限

### 5. 调试技巧
- 使用详细日志模式：`openclaw --verbose`
- 检查模型状态：`openclaw models status`
- 验证配置文件：`openclaw config validate`
- 测试网络连接：`openclaw network test`

## 故障排除

### 常见问题

#### 1. 模型无法加载
```bash
# 检查模型是否已安装
openclaw models list

# 重新安装模型
openclaw models set zai/glm-4.6v

# 检查模型文件
ls ~/.openclaw/models/
```

#### 2. Gateway 无法启动
```bash
# 检查端口占用
lsof -i :18789

# 更改端口
openclaw gateway start --port 18888

# 查看错误日志
cat ~/.openclaw/logs/gateway.log
```

#### 3. 插件无法加载
```bash
# 检查插件状态
openclaw plugins list

# 重新启用插件
openclaw plugins enable <plugin-name>

# 检查插件依赖
openclaw plugins dependencies check
```

#### 4. 知识库查询失败
```bash
# 检查知识库状态
openclaw knowledge status my_knowledge

# 重建知识库
openclaw knowledge rebuild my_knowledge

# 检查索引文件
ls ~/.openclaw/knowledge/my_knowledge/index/
```

## 获取帮助

```bash
# 查看帮助文档
openclaw --help

# 查看特定命令帮助
openclaw models --help

# 查看插件帮助
openclaw plugins --help

# 查看版本信息
openclaw --version

# 查看日志
openclaw logs view
```

## 贡献指南

OpenClaw 是开源项目，欢迎贡献！

1. Fork 项目仓库
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

### 开发环境设置
```bash
# 克隆仓库
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 安装依赖
pip install -r requirements.txt

# 运行测试
pytest

# 构建文档
make docs
```

### 代码规范
- 遵循 PEP 8 代码风格
- 编写单元测试
- 更新文档
- 添加类型注解

更多详细信息请访问 [OpenClaw GitHub](https://github.com/openclaw/openclaw)。

## 许可证

OpenClaw 采用 MIT 许可证，允许自由使用、修改和分发。

```
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted...
```

## 联系方式

- 官方网站：https://openclaw.ai
- GitHub：https://github.com/openclaw/openclaw
- 社区论坛：https://community.openclaw.ai
- 邮箱：contact@openclaw.ai