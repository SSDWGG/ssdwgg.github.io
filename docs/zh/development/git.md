# Git 工作流与版本控制规范

本文默认仓库主分支为 `main`。如果个别老仓库仍使用 `master`，请以仓库实际配置为准，但流程要求保持一致。

## 目标

版本控制规范的核心目标不是“限制开发”，而是：

- 保持提交历史清晰可读
- 降低多人协作冲突
- 提高代码审查效率
- 让发布、回滚、追踪问题更容易

## 分支模型

### 长期分支

- `main`：受保护分支，对应可发布状态，只通过 Pull Request 合并。
- `develop`：可选的集成分支。适合多人并行、版本节奏清晰的项目。

如果项目规模较小，也可以采用 **trunk-based** 方式，仅保留 `main`，通过短生命周期功能分支协作。

### 临时分支

| 分支类型 | 用途 | 命名建议 |
| :--- | :--- | :--- |
| `feature/` | 新功能开发 | `feature/login-page` |
| `fix/` | 常规缺陷修复 | `fix/order-status-bug` |
| `hotfix/` | 线上紧急修复 | `hotfix/payment-timeout` |
| `release/` | 发布准备、冻结验证 | `release/v1.4.0` |
| `chore/` | 配置、脚本、依赖等非业务变更 | `chore/eslint-upgrade` |

### 命名原则

- 使用英文、小写、中划线分隔。
- 名称要描述“做什么”，不要只写人名或日期。
- 分支名尽量简短，但要能让团队一眼看出目的。

## 提交规范

推荐使用 Conventional Commits：

```bash
<type>(<scope>): <subject>
```

### 常见 `type`

- `feat`：新增功能
- `fix`：修复问题
- `docs`：文档更新
- `style`：格式调整，不影响逻辑
- `refactor`：重构，不新增功能也不修 bug
- `test`：测试相关
- `chore`：构建、依赖、脚本、配置等杂项
- `perf`：性能优化
- `build`：构建系统或打包流程调整
- `ci`：CI/CD 配置调整

### 提交信息要求

- 使用祈使语气，简洁说明变更意图。
- 一次提交只做一类事情，避免“顺手修很多”。
- 不要使用 `update`、`fix bug`、`test` 这类模糊描述。

### 示例

```bash
git commit -m "feat(auth): add login rate limit"
git commit -m "fix(profile): handle empty avatar url"
git commit -m "docs(api): clarify token refresh flow"
```

## 日常开发流程

### 1. 创建分支

从最新的主线分支拉出自己的工作分支：

```bash
git checkout main
git pull origin main
git checkout -b feature/login-page
```

如果团队使用 `develop` 作为集成分支，则从 `develop` 拉出：

```bash
git checkout develop
git pull origin develop
git checkout -b feature/login-page
```

### 2. 小步提交

- 一个任务拆成多个可理解的提交。
- 提交前先执行自测，不要把明显不可运行的代码推上去。
- WIP（进行中）提交可以存在，但在发起 PR 前应整理干净。

### 3. 保持分支最新

建议经常同步主线，减少后期一次性冲突：

```bash
git fetch origin
git rebase origin/main
```

如果团队明确要求使用 merge 同步，也可以：

```bash
git fetch origin
git merge origin/main
```

**建议团队统一策略，不要同一仓库一部分人用 rebase、一部分人用 merge。**

### 4. 发起 Pull Request

在以下条件满足后再发起 PR：

- 自测完成
- 变更范围清晰
- 提交历史可读
- 已补充必要截图、说明、测试步骤

## Pull Request 规范

一个高质量 PR 至少应包含：

- **变更背景**：为什么要改
- **改动内容**：这次具体做了什么
- **影响范围**：接口、页面、模块、数据库、配置等
- **验证方式**：如何证明这次改动有效
- **风险提示**：是否涉及兼容性、性能、权限、数据变更

### 审查重点

Reviewer 应重点关注：

- 业务逻辑是否正确
- 是否覆盖异常流程与边界情况
- 是否引入重复代码或不必要复杂度
- 是否影响现有接口或公共能力
- 测试与文档是否同步更新

## 合并策略

团队需要明确一种默认合并方式：

- **Squash merge**：适合保持主线历史简洁。
- **Rebase and merge**：适合保留线性历史。
- **Merge commit**：适合保留完整分支上下文。

如果没有特别要求，建议：

- 日常功能分支使用 `squash merge`
- 需要保留完整发布上下文时再使用 `merge commit`

## 发布与热修复流程

### 发布流程

1. 从 `main` 或 `develop` 创建 `release/` 分支。
2. 只允许修复发布相关问题，不再继续塞入新需求。
3. 完成回归测试、版本确认、变更说明。
4. 合并回主分支并打 tag。

示例：

```bash
git tag -a v1.4.0 -m "release v1.4.0"
git push origin v1.4.0
```

### 热修复流程

1. 从 `main` 创建 `hotfix/` 分支。
2. 只修当前线上问题，不捎带其他改动。
3. 修复后尽快合并回 `main`，并同步到 `develop` 或其他集成分支。

## 冲突处理原则

- 尽量早同步，避免长时间不更新主线。
- 冲突解决后必须重新自测。
- 对公共文件、配置文件、路由文件保持额外谨慎。
- 看不懂冲突来源时，先停下来确认，不要凭感觉覆盖。

常用步骤：

```bash
git fetch origin
git rebase origin/main

# 解决冲突后
git add .
git rebase --continue
```

如果需要放弃本次 rebase：

```bash
git rebase --abort
```

## 常用命令速查

| 目的 | 命令 | 说明 |
| :--- | :--- | :--- |
| 查看状态 | `git status` | 查看当前变更 |
| 查看分支 | `git branch` | 查看本地分支 |
| 新建并切换分支 | `git checkout -b feature/xxx` | 基于当前分支创建 |
| 同步远程分支 | `git fetch origin` | 拉取远程最新信息 |
| 合并主线 | `git merge origin/main` | 合并方式同步 |
| 线性同步主线 | `git rebase origin/main` | rebase 方式同步 |
| 暂存修改 | `git stash` | 临时保存工作区 |
| 恢复暂存 | `git stash pop` | 恢复最近一次暂存 |
| 挑选提交 | `git cherry-pick <commit>` | 复制指定提交到当前分支 |
| 回退本地提交 | `git reset --soft HEAD~1` | 保留改动，撤回提交 |
| 生成反向提交 | `git revert <commit>` | 适合撤销已推送提交 |

## 最佳实践

- 每次提交只做一件事。
- 每个分支只解决一个主题问题。
- 不直接向受保护分支推送代码。
- 不在 PR 中混入无关格式化或顺手修复。
- 合并前自己先过一遍 diff，确保改动干净。
- 已合并分支及时删除，保持仓库整洁。

## 一句话总结

好的 Git 规范不是为了增加流程成本，而是为了让团队在“开发、审查、发布、回滚”四个环节都更稳、更快、更可追踪。
