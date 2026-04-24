# 版本控制规范

## 1. 分支管理规范

### 1.1 分支类型

- **main/master**: 主分支，用于生产环境部署，只接受合并请求
- **develop**: 开发分支，用于集成功能开发
- **feature/***: 功能分支，用于新功能开发
- **hotfix/***: 热修复分支，用于紧急bug修复
- **release/***: 发布分支，用于版本发布准备

### 1.2 分支命名规范

- 功能分支: `feature/功能名称-日期` 或 `feature/功能名称`
- 修复分支: `hotfix/问题描述-日期`
- 发布分支: `release/版本号`

## 2. 提交规范

### 2.1 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2.2 提交类型 (type)

- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响功能）
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建过程或辅助工具变动

### 2.3 提交示例

```bash
git commit -m "feat(user): 添加用户登录功能

- 实现JWT认证
- 添加登录页面
- 完善权限控制

Closes #123"
```

## 3. 工作流程

### 3.1 功能开发流程

1. 从develop分支创建feature分支
2. 在feature分支上进行开发
3. 完成开发后提交到远程仓库
4. 创建Pull Request到develop分支
5. 代码审查通过后合并

### 3.2 发布流程

1. 从develop分支创建release分支
2. 在release分支上进行测试和bug修复
3. 测试通过后合并到main和develop分支
4. 为main分支打上版本标签

### 3.3 热修复流程

1. 从main分支创建hotfix分支
2. 修复问题并测试
3. 合并到main和develop分支
4. 删除hotfix分支

## 4. 代码审查规范

### 4.1 审查要点

- 代码是否符合编码规范
- 功能实现是否正确
- 是否有适当的测试覆盖
- 是否存在安全风险
- 性能是否满足要求

### 4.2 审查流程

1. 创建Pull Request
2. 至少需要1-2名审查者
3. 审查者提出修改意见
4. 开发者根据意见修改
5. 审查通过后合并

## 5. 标签管理

### 5.1 标签命名

- 版本标签: `v1.0.0`, `v1.2.3`
- 预发布标签: `v1.0.0-rc.1`, `v1.0.0-beta.2`

### 5.2 标签创建

```bash
# 创建带注释的标签
git tag -a v1.0.0 -m "版本1.0.0发布"

# 推送标签到远程
git push origin v1.0.0
```

## 6. 冲突解决

### 6.1 预防冲突

- 频繁拉取最新代码
- 小步提交，避免大文件修改
- 及时合并长期分支

### 6.2 解决冲突

1. 拉取最新代码
2. 使用git mergetool或手动解决
3. 测试冲突解决后的代码
4. 提交解决结果

## 7. 最佳实践

### 7.1 提交规范

- 每次提交只做一件事
- 提交信息要清晰明确
- 避免提交大文件
- 及时提交，避免积压

### 7.2 分支管理

- 及时删除已合并的分支
- 保持分支历史的整洁
- 定期清理远程分支

### 7.3 协作规范

- 尊重他人代码
- 及时响应审查意见
- 保持沟通顺畅

## 8. 工具推荐

### 8.1 Git客户端

- Git命令行
- SourceTree
- GitKraken
- VS Code Git扩展
- Github Desktop

### 8.2 Git指令学习
[git指令学习网站](https://learngitbranching.js.org/?locale=zh_CN)

### 8.3 简易git指令

- git branch player-modal 创建xx分支。  
- git checkout player-modal 切换分支。
- Git status 查看对当前分支的修改了的文件
- git status 对比冲突
- git pull origin dev 拉取dev分支
- git commit 提交 git branch xxxx 创建分支 git checkout xxx 切换分支 git checkout -b 创建同时切换分支 
- git branch -m oldName newName 修改本地分支名称  
- git push --delete origin oldName 删除远程分支
- git push origin newName 上传本地分支  
- git branch --set-upstream-to origin/newName关联远程分支 
- git merge xxx 合并分支
- git rebase xxx 线性合并分支
- git checkout xxx^^ 切换到xxx到前两个父节点 Git checkout xxx~2 切换到xxx到前两个父节点 
- git branch -f xxx HEAD~3 切换分支xxx到HEAD的前三个父节点。 或者用来切换到xyzj节点
- git reset HEAD^本地操作回退一个节点
- git revert 回退远程的节点，在现在的节点下创造上一个节点的镜像
- git cherry-pick xx xxx xxx 将节点复制到当前HEAD节点下
- git rebase -i HEAD～4 通过弹出的ui界面操作修改提交节点顺序
- git stash save ’暂存‘ git stash list git stash pop