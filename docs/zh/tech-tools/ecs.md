# ECS 介绍与使用

ECS 通常指云服务器（Elastic Compute Service）。它本质上是一台运行在云厂商基础设施上的虚拟服务器，可以安装操作系统、部署应用、配置网络和挂载数据盘。不同云厂商的控制台名称略有差异，但核心概念基本一致。

## ECS 能做什么

- 部署网站、后台接口、管理系统、文档站。
- 运行 Docker、Nginx、数据库、缓存等基础服务。
- 作为测试环境、演示环境、跳板机或轻量运维节点。
- 承载定时任务、爬虫、自动化脚本、小型业务服务。
- 配合负载均衡、对象存储、数据库等云产品组成完整系统。

## 核心概念

| 概念 | 说明 |
| :--- | :--- |
| 实例 | 一台云服务器，包含 CPU、内存、网络等计算资源 |
| 镜像 | 创建服务器时使用的操作系统模板 |
| 系统盘 | 存放操作系统和基础软件 |
| 数据盘 | 存放业务数据，便于扩容、迁移和备份 |
| 安全组 | 云服务器的虚拟防火墙，控制入站和出站端口 |
| 公网 IP | 让外部用户可以访问服务器 |
| VPC | 云上的私有网络，用于隔离和组织云资源 |
| 快照 | 磁盘备份，可用于恢复或复制数据 |

## 创建 ECS 的基本流程

### 1. 选择地域和可用区

地域尽量靠近用户或业务依赖。例如用户主要在中国大陆，就优先选择大陆或距离更近的地域；如果主要面向海外用户，则选择对应海外地域。

选择时重点考虑：

- 用户访问延迟
- 云产品是否在同地域可用
- 合规、备案和数据存储要求
- 成本和带宽价格

### 2. 选择规格

小型个人站点或测试服务可以从较低配置开始，例如：

- 1 核 1G：适合非常轻量的静态站或测试脚本
- 2 核 2G：适合小型 Web 服务、Nginx、Docker 单机部署
- 2 核 4G 及以上：适合同时跑多个容器、数据库或更复杂服务

生产环境不要只看 CPU 和内存，还要关注带宽、磁盘 I/O、峰值流量和扩容方式。

### 3. 选择镜像

常见选择：

- Ubuntu LTS：文档多，社区活跃，适合大多数 Web 服务。
- Debian：稳定、轻量，适合偏简洁的服务器环境。
- CentOS / Rocky Linux / AlmaLinux：适合习惯 RHEL 系生态的团队。

新项目推荐选择长期支持版本，避免使用过旧系统。

### 4. 配置网络与安全组

常见开放端口：

| 端口 | 用途 | 建议 |
| :--- | :--- | :--- |
| 22 | SSH 登录 | 尽量限制来源 IP |
| 80 | HTTP | 对公网开放 |
| 443 | HTTPS | 对公网开放 |
| 3000 / 8080 | 应用端口 | 通常只给内网或 Nginx 访问 |
| 3306 / 6379 | MySQL / Redis | 不建议直接对公网开放 |

安全组是 ECS 最重要的安全边界之一。原则是：只开放必须端口，数据库和缓存不要直接暴露到公网。

## 登录服务器

创建实例后，可以使用 SSH 登录：

```bash
ssh root@服务器公网IP
```

如果使用密钥登录：

```bash
chmod 600 ~/.ssh/your-key.pem
ssh -i ~/.ssh/your-key.pem root@服务器公网IP
```

登录后建议创建普通用户，再通过 `sudo` 管理服务器，减少长期直接使用 `root` 的风险。

```bash
adduser deploy
usermod -aG sudo deploy
```

## 初始化服务器

### 更新系统

Ubuntu / Debian：

```bash
sudo apt update
sudo apt upgrade -y
```

CentOS / Rocky Linux / AlmaLinux：

```bash
sudo yum update -y
```

### 设置时区

```bash
sudo timedatectl set-timezone Asia/Shanghai
timedatectl
```

### 安装常用工具

```bash
sudo apt install -y curl wget git vim ufw
```

如果是 RHEL 系系统，可以把 `apt` 换成 `yum` 或 `dnf`。

## 部署网站的常见方式

### 方式一：Nginx 托管静态站

适合 VitePress、Vue、React 等构建后的静态资源。

```bash
sudo mkdir -p /var/www/site
sudo cp -r dist/* /var/www/site/
```

然后在 Nginx 中配置站点根目录：

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 方式二：Docker 部署应用

适合后端服务、全栈应用或需要统一运行环境的项目。

```bash
docker build -t my-app .
docker run -d --name my-app -p 3000:3000 --restart always my-app
```

再用 Nginx 把公网请求转发到容器端口：

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 方式三：Docker Compose 编排

适合一个应用同时依赖 Web、Redis、MySQL 等服务。

```bash
docker compose up -d
docker compose logs -f
```

生产环境需要额外考虑数据卷备份、日志、监控、环境变量和镜像版本管理。

## 日常运维

### 查看资源

```bash
top
free -h
df -h
du -sh *
```

### 查看端口

```bash
sudo ss -lntp
```

### 查看系统日志

```bash
journalctl -xe
journalctl -u nginx -f
```

### 查看磁盘占用

```bash
df -h
sudo du -sh /var/log/*
```

如果磁盘经常打满，要重点检查日志、Docker 镜像、容器日志和临时文件。

## 安全建议

- SSH 尽量使用密钥登录，并限制来源 IP。
- 安全组只开放必要端口。
- 数据库、Redis、管理后台不要直接暴露公网。
- 定期更新系统补丁和基础软件。
- 重要数据使用快照、备份或对象存储。
- 生产环境开启监控、告警和日志留存。
- 域名对外提供服务时优先配置 HTTPS。

## 一句话总结

ECS 是最基础、最灵活的云上计算资源。你可以把它理解为“云上的一台 Linux 服务器”，真正的关键在于网络、安全、部署和备份是否设计得足够清晰。
