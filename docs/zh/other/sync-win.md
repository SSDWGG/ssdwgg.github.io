# 单向同步windows

单向同步Win
 Windows 系统（Windows 10/11）的完整流程文档，目标同样是：

> 使用 rclone + 文件监控工具，实现本地桌面文件夹（Desktop）到坚果云 WebDAV 的实时单向同步（Desktop → 坚果云）

由于 Windows 没有原生 `fswatch`，我们将使用 PowerShell 脚本 + `FileSystemWatcher` 实现实时监控，并通过 任务计划程序（Task Scheduler） 实现开机自启。



🪟 Windows 系统配置流程：rclone 实时同步桌面到坚果云



1️⃣ 安装必要工具

1.1 安装 Chocolatey（可选但推荐）
Chocolatey 是 Windows 的包管理器，类似 Homebrew。

以 管理员身份 打开 PowerShell，运行：
```powershell
Set-ExecutionPolicy Bypass -Scope CurrentUser -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

> 如果不想用 Chocolatey，也可手动下载安装 rclone（见 1.2）。

1.2 安装 rclone
方法一（推荐）：用 Chocolatey
```powershell
choco install rclone -y
```

方法二：手动安装
1. 访问 [https://rclone.org/downloads/](https://rclone.org/downloads/)
2. 下载 Windows amd64 版本（zip 文件）
3. 解压到 `C:\rclone`
4. 将 `C:\rclone` 添加到系统环境变量 `PATH`：
   - 右键“此电脑” → 属性 → 高级系统设置 → 环境变量
   - 在“系统变量”中找到 `Path` → 编辑 → 新建 → 输入 `C:\rclone`

> 安装后，在 PowerShell 中运行 `rclone --version` 验证是否成功。



2️⃣ 配置坚果云 WebDAV 远程存储

运行以下命令配置 rclone：
```powershell
rclone config
```

按提示操作：

1. `e/n/d/r/c/s/q> n` → 新建 remote  
2. `name> jianguoyun`（可自定义，记住这个名字）  
3. 选择存储类型：输入 `webdav`（或输入对应编号）  
4. `url> https://dav.jianguoyun.com/dav/`  
5. `vendor> other`  
6. `user> 你的坚果云邮箱`（如：xxx@xxx.com）  
7. `pass> 你的坚果云“应用密码”`（不是登录密码！需在坚果云网页端生成）  
8. 其他选项直接回车使用默认  
9. 确认配置：`y`  
10. 退出：`q`

> ✅ 验证配置：
```powershell
rclone lsd jianguoyun:
```
应能列出“我的坚果云”根目录内容（或空但无报错）。



3️⃣ 创建实时同步 PowerShell 脚本

3.1 创建脚本目录
```powershell
mkdir $env:USERPROFILE\Scripts
```

3.2 创建脚本文件
用记事本或 VS Code 创建：
```
notepad "$env:USERPROFILE\Scripts\rclone_desktop_realtime.ps1"
```

粘贴以下内容（请根据你的 remote 名和路径调整）：

```powershell


# rclone_desktop_polling.ps1 - Fixed version (no log file conflict)
# Safe for Jianguoyun WebDAV, runs every hour

$LocalPath = "$env:USERPROFILE\Desktop"
$RemotePath = "jianguoyun:/DesktopBackupWin"
$MainLogFile = "$env:USERPROFILE\rclone_desktop_polling.log"
$StateFile = "$env:USERPROFILE\.desktop_sync_state"
$IntervalSeconds = 100  

function Write-Log {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$Timestamp - $Message" | Out-File -FilePath $MainLogFile -Append -Encoding UTF8
    Write-Host "$Timestamp - $Message"
}

function Get-DirectoryFingerprint {
    $files = Get-ChildItem -Path $LocalPath -Recurse -File -Force -ErrorAction SilentlyContinue |
             Where-Object {
                 $_.Name -notlike ".*" -and
                 $_.Name -notlike "*.tmp" -and
                 $_.Name -notlike "~*" -and
                 $_.Name -notlike "Thumbs.db" -and
                 $_.Name -notlike "desktop.ini" -and
                 $_.Name -notlike "*.DS_Store"
             } |
             Sort-Object FullName

    if ($null -eq $files -or $files.Count -eq 0) {
        return "EMPTY_DESKTOP"
    }

    $hasher = [System.Security.Cryptography.SHA256]::Create()
    $input = foreach ($f in $files) {
        "$($f.FullName)|$($f.LastWriteTimeUtc.Ticks)"
    }
    $bytes = [System.Text.Encoding]::UTF8.GetBytes(($input | Out-String))
    return [BitConverter]::ToString($hasher.ComputeHash($bytes)).Replace("-", "")
}

Write-Log "Starting polling sync (interval: ${IntervalSeconds}s): $LocalPath -> $RemotePath"

# Initialize state on first run
if (-not (Test-Path $StateFile)) {
    Write-Log "First run: recording initial state."
    $initialFingerprint = Get-DirectoryFingerprint
    $initialFingerprint | Set-Content $StateFile -Encoding UTF8
    $lastFingerprint = $initialFingerprint
} else {
    $lastFingerprint = Get-Content $StateFile -Raw
}

Start-Sleep -Seconds 5

try {
    while ($true) {
        $currentFingerprint = Get-DirectoryFingerprint

        if ($currentFingerprint -ne $lastFingerprint) {
            Write-Log "Change detected. Starting sync..."

            # Use a SEPARATE log file for rclone to avoid file lock conflict
            $RcloneLogFile = "$env:TEMP\rclone_desktop_sync_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

            & rclone copy "$LocalPath" "$RemotePath" `
                --update `
                --transfers=2 `
                --checkers=4 `
                --exclude=".*" `
                --exclude=".*/**" `
                --exclude="*.tmp" `
                --exclude="~*" `
                --exclude="*.DS_Store" `
                --exclude="Thumbs.db" `
                --exclude="desktop.ini" `
                --log-file="$RcloneLogFile" `
                --verbose 2>&1 | Out-Null

            if ($LASTEXITCODE -eq 0) {
                Write-Log "Sync completed successfully."
                $currentFingerprint | Set-Content $StateFile -Encoding UTF8
                $lastFingerprint = $currentFingerprint
            } else {
                Write-Log "rclone failed with exit code $LASTEXITCODE"
                if (Test-Path $RcloneLogFile) {
                    $tail = Get-Content $RcloneLogFile -Tail 8 -ErrorAction SilentlyContinue
                    foreach ($line in $tail) {
                        Write-Log "rclone error: $line"
                    }
                }
            }
        } else {
            Write-Log "No changes detected."
        }

        Write-Log "Sleeping for $IntervalSeconds seconds..."
        Start-Sleep -Seconds $IntervalSeconds
    }
} finally {
    Write-Log "Polling stopped."
}

# 计时器触发同步
Register-ObjectEvent -InputObject $timer -EventName Elapsed -Action $syncAction

# 文件变动事件
$onChange = {
    $lastChangeTime = Get-Date
    $timer.Stop()
    $timer.Start()
    Write-Log "Change detected in $($EventArgs.FullPath)"
}

Register-ObjectEvent -InputObject $watcher -EventName Created -Action $onChange
Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $onChange
Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $onChange
# Deleted 不同步（单向 Desktop → 云）

Write-Log "Monitoring started. Press Ctrl+C to stop."

# 保持脚本运行
try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    $watcher.Dispose()
    $timer.Dispose()
    Write-Log "Monitoring stopped."
}


```

> ⚠️ 注意：
> - `$RemotePath` 中的 `jianguoyun` 必须与 `rclone config` 中设置的名称一致。


4️⃣ 测试脚本

在 PowerShell 中运行（不要用 CMD）：
```powershell
cd $env:USERPROFILE\Scripts
.\rclone_desktop_realtime.ps1
```

然后在桌面新建一个文件：
```powershell
echo "test" > $env:USERPROFILE\Desktop\win_test_$(Get-Date -Format "yyyyMMdd_HHmmss").txt
```

观察日志：
```powershell
Get-Content -Path "$env:USERPROFILE\rclone_desktop_realtime.log" -Wait
```

> ✅ 成功后按 `Ctrl+C` 停止脚本。



5️⃣ 设置开机自启（使用任务计划程序）

5.1 打开任务计划程序
● Win + R → 输入 `taskschd.msc` → 回车

5.2 创建基本任务
1. 右侧点击“创建基本任务”
2. 名称：`Rclone Desktop Sync`
3. 触发器：`当前用户登录时`
4. 操作：`启动程序`
   - 程序/脚本：`powershell.exe`
   - 参数（可选参数）：
     ```
     -ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\Users\<你的用户名>\Scripts\rclone_desktop_realtime.ps1"
     ```
     > 例如：`-File "C:\Users\John\Scripts\rclone_desktop_realtime.ps1"`

5. 勾选“打开属性对话框”，点击“完成”

5.3 修改高级属性（重要）
在属性窗口中：
● 勾选 ✅ “不管用户是否登录都要运行”
● 勾选 ✅ “使用最高权限运行”
● 在“常规”选项卡 → 选择 ✅ “只在用户登录时运行”（如果你不希望后台静默运行，可不勾“不管是否登录”）
  > 建议：不勾“不管是否登录”，因为 rclone 需要访问用户目录，且坚果云密码可能依赖用户会话。

> 💡 如果你希望完全后台运行，需将 rclone config 文件复制到系统级位置，但复杂且不推荐。建议“用户登录时运行”即可。



6️⃣ 验证开机自启

1. 重启电脑
2. 登录后，检查任务管理器 → 详细信息 → 是否有 `powershell.exe` 运行该脚本
3. 在桌面新建文件，观察日志是否更新：


✅ 补充说明

| 项目 | 说明 |
|------|------|
| rclone config 位置 | Windows 默认在 `%USERPROFILE%\.config\rclone\rclone.conf` |
| 应用密码 | 必须在 [坚果云官网](https://www.jianguoyun.com/) → 账户设置 → 安全 → 应用密码 中生成 |
| 路径中文支持 | PowerShell 默认 UTF-8，坚果云 WebDAV 支持 UTF-8，一般无问题 |
| 性能 | `--transfers=4` 和 `--checkers=8` 适合普通网络，可按需调整 |
| 日志大小 | 长期运行建议定期清理日志，或在脚本开头加日志轮转逻辑 |



🔒 安全提示
● 不要将 `rclone.conf` 上传到 GitHub 或共享
● 应用密码 ≠ 登录密码，泄露风险较低，但仍需保密



如有问题，可检查：
● `rclone lsd jianguoyun:` 是否能列出目录
● 脚本是否以正确用户权限运行
● 防火墙是否阻止 rclone 访问网络

