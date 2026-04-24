# Nginx 介绍与使用

Nginx 是高性能 Web 服务器，也常用作反向代理、负载均衡、静态资源服务和 HTTPS 入口。它在前端部署、后端接口代理、域名转发和网关层中都非常常见。

## 常见使用场景

- **静态资源服务**：托管 HTML、CSS、JS、图片、下载文件。
- **反向代理**：把外部请求转发到内部应用服务。
- **负载均衡**：把请求分发到多台后端机器或多个容器。
- **HTTPS 入口**：统一配置证书、TLS、安全头。
- **缓存与压缩**：提升静态资源访问速度，减少后端压力。
- **多站点托管**：同一台服务器用不同域名或端口服务多个项目。

## 安装与常用命令

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install -y nginx
```

### CentOS / Rocky Linux / AlmaLinux

```bash
sudo yum install -y nginx
```

常用命令：

```bash
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl reload nginx
sudo systemctl restart nginx
sudo systemctl status nginx
```

其中 `nginx -t` 用来检查配置是否正确，改配置后建议先检查再重载。

## 目录结构

不同系统的目录可能略有差异，常见位置如下：

| 路径 | 作用 |
| :--- | :--- |
| `/etc/nginx/nginx.conf` | 主配置文件 |
| `/etc/nginx/conf.d/` | 子配置目录 |
| `/etc/nginx/sites-available/` | Debian 系常见站点配置目录 |
| `/etc/nginx/sites-enabled/` | Debian 系常见已启用站点目录 |
| `/var/log/nginx/access.log` | 访问日志 |
| `/var/log/nginx/error.log` | 错误日志 |
| `/usr/share/nginx/html` | 默认静态页面目录 |

## 托管静态网站

假设站点构建产物在 `/var/www/site`，可以新增配置：

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

适合 Vue、React、VitePress 等前端静态站点。`try_files` 的最后一个 `/index.html` 可以让前端路由在刷新页面时仍然正常工作。

配置完成后执行：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 反向代理后端服务

如果后端服务运行在本机 `3000` 端口，可以这样代理：

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

这些 `proxy_set_header` 可以让后端拿到真实域名、客户端 IP 和请求协议，便于日志、鉴权和回调地址生成。

## 前端与接口同域部署

常见部署方式是：前端静态资源走 `/`，后端接口走 `/api/`。

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

注意 `proxy_pass` 末尾是否带 `/` 会影响路径转发结果，配置前要明确后端真实路由。

## 负载均衡

当后端有多个实例时，可以使用 `upstream`：

```nginx
upstream app_servers {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

默认是轮询策略。生产环境还需要结合健康检查、日志、监控和发布策略一起使用。

## HTTPS 配置思路

HTTPS 通常使用云厂商证书、Let’s Encrypt 或公司统一证书。一个简化配置如下：

```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/certs/example.com.pem;
    ssl_certificate_key /etc/nginx/certs/example.com.key;

    root /var/www/site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

证书路径、续期方式和安全参数需要根据实际云厂商或证书工具调整。

## 排查问题

### 配置是否正确

```bash
sudo nginx -t
```

### 查看日志

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 端口是否监听

```bash
sudo ss -lntp | grep nginx
```

### 常见问题

- 页面 404：检查 `root` 路径、构建产物和 `try_files`。
- 接口 502：检查后端服务是否启动、端口是否正确、网络是否可达。
- HTTPS 失败：检查证书路径、证书权限、域名是否匹配。
- 修改不生效：检查是否执行了 `nginx -t` 和 `systemctl reload nginx`。

## 一句话总结

Nginx 最常见的定位是“站点入口”：它负责接收外部请求，再把静态资源直接返回，或把动态请求稳定转发给后端服务。
