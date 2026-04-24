# 单向同步mac

> [!INFO] 需求：实时+单向同步文件到云空间
>### 目前已知可用的软件：
>1. 群辉（nas，需配置）
>2. 极空间（nas、未验证可行性）
>### 双向实时同步软件（强绑定同步的文件，一端删除，云端也会被删除）
>1. 坚果云
>2. 亿方云
>3. ……

> Tip：
> 1. nas需单独采购，且依赖内网网络
> 2. 未列出的一些同步软件可能不支持mac|win 跨端同步


## 📌 详细对比：主流网盘对 rclone 的支持情况
| 网盘名称       | 是否原生支持 rclone | 同步方式                     | 可行性 | 备注 |
|----------------|---------------------|------------------------------|--------|------|
| **坚果云**     | ✅ 是                | WebDAV                       | ⭐⭐⭐⭐⭐ | 官方开放 WebDAV，稳定可靠 |
| **百度网盘**   | ❌ 否                | 需 `baidupcs-go` + WebDAV 代理 | ⭐⭐☆   | 非官方，易被限速/封号 |
| **阿里云盘**   | ❌ 否                | 需 `AliyunDrive-Fuse` 或 `rclone-aliyundrive` 插件 | ⭐⭐⭐   | 社区插件可用，但需 token，可能失效 |
| **腾讯微云**   | ❌ 否                | 无稳定方案                   | ⭐      | 未开放 API，基本不可用 |
| **天翼云盘**   | ❌ 否                | 有实验性 WebDAV 项目         | ⭐⭐     | 第三方项目，不稳定 |
| **OneDrive**   | ✅ 是                | 官方 OAuth 支持              | ⭐⭐⭐⭐⭐ | 微软官方支持，推荐 |
| **Google Drive**| ✅ 是                | 官方 API                     | ⭐⭐⭐⭐⭐ | 国内需代理 |
| **Dropbox**    | ✅ 是                | 官方 API                     | ⭐⭐⭐⭐  | 稳定，但国内访问慢 |


对比下来只能使用 webDav+坚果云+ fswatch 的方式实现的监控文件实时单向同步

访问频率限制：由于WebDAV协议比较占用系统资源，免费版用户限制访问频率为每30分钟不超过600次请求。付费用户限制访问频率为每30分钟不超过1500次请求。

MACOS系统

1. 确保你的 Mac 已安装 Xcode 命令行工具。如果没有安装，可以先在终端中运行以下命令：
```
xcode-select --install
```

2. 安装 Homebrew
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

3. 验证 Homebrew 安装
```
brew --version
```

4. 安装 rclone
```
brew install rclone
```

5. 配置云盘
```
rclone config
```

6. 配置云盘流程（user和password是云盘的应用账号和应用授权密码）
1. 选择 n (新建 remote)
2. name> 输入一个名字，比如 jianguoyunRyw
3. 存储类型选择：webdav
4. url> https://dav.jianguoyun.com/dav/
5. vendor> other
6. user> 你的坚果云邮箱
7. pass> 粘贴刚才生成的“应用密码”（输入时不可见，正常粘贴回车即可）
8. 其他选项直接回车用默认
9. 确认配置，输入 y
10. 输入 q 退出

7：验证配置
```
rclone lsd jianguoyun:
```

8. 测试设置单向同步  Desktop->DesktopBackup
```
rclone copy ~/Desktop jianguoyunRyw:/我的坚果云/DesktopBackup \
  --update \
  --transfers=4 \
  --checkers=8 \
  --verbose \
  --exclude=".*" \
  --exclude=".*/**" \
  --exclude="*.tmp" \
  --exclude="~*" \
  --log-file="$HOME/rclone_desktop_backup.log"
```

9. 安装 fswatch（文件监控工具）
```
brew install fswatch
```

10. 创建实时同步脚本
```
mkdir -p ~/Scripts
nano ~/Scripts/rclone_desktop_realtime.sh
```
11. 在脚本内粘贴以下内容
```
#!/bin/bash
```
### 配置
```
REMOTE="jianguoyunRyw:/我的坚果云/DesktopBackup"
LOCAL="$HOME/Desktop"
LOG="$HOME/rclone_desktop_realtime.log"
DELAY=10  # 延迟 10 秒，合并多次变更
```

### 确保 rclone 在 PATH 中

```
export PATH="/opt/homebrew/bin:$PATH"
```

### 记录日志函数
```
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG"
}
log "Starting real-time sync for $LOCAL -> $REMOTE"
```

### 启动 fswatch 监控
```
fswatch -o "$LOCAL" | while read _; do
  log "File change detected. Waiting ${DELAY}s before sync..."
  sleep $DELAY
```
###  执行同步（排除临时文件）
```
  rclone copy "$LOCAL" "$REMOTE" \
    --update \
    --transfers=4 \
    --checkers=8 \
    --exclude=".*" \
    --exclude=".*/**" \
    --exclude="*.tmp" \
    --exclude="~*" \
    --log-file="$LOG" \
    --verbose

  log "Sync completed."
done
```

### 保存退出
```
Ctrl+O → 回车 → Ctrl+X
```
12:赋予执行权限
```
chmod +x ~/Scripts/rclone_desktop_realtime.sh
```
13：开机自启（用 launchd）
```
nano ~/Library/LaunchAgents/com.user.rclone-desktop-realtime.plist
```
内容：
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.user.rclone-desktop-realtime</string>
  <key>ProgramArguments</key>
  <array>
    <string>/Users/renshuaiweidemac/Scripts/rclone_desktop_realtime.sh</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/rclone-realtime.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/rclone-realtime.err</string>
</dict>
</plist>
```
14：加载开机任务
```
launchctl load ~/Library/LaunchAgents/com.user.rclone-desktop-realtime.plist
```
15：测试
```
echo "test" > ~/Desktop/realtime_test_$(date +%s).txt
等待几秒后查看日志，并查看云盘空间
tail -f ~/rclone_desktop_realtime.log
```

16:停止同步
```
launchctl unload ~/Library/LaunchAgents/com.user.rclone-desktop-realtime.plist
```
验证是否已停止
```
ps aux | grep rclone_desktop_realtime.sh
```
在桌面新建一个文件
```
echo "test" > ~/Desktop/stop_test.txt
```
查看日志
```
tail ~/rclone_desktop_realtime.log
```

17：恢复同步
```
launchctl load ~/Library/LaunchAgents/com.user.rclone-desktop-realtime.plist
```









