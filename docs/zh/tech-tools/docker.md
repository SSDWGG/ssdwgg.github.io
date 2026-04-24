# Docker 介绍与使用

Docker 是一个容器化平台，它可以把应用、运行时、依赖和启动命令一起打包成镜像，再用容器的方式稳定运行。对团队开发来说，Docker 最大的价值是减少环境差异，让“本机开发、测试环境、线上部署”尽量使用同一套运行方式。

## 适合解决什么问题

- **环境一致**：避免“我电脑能跑，你电脑不能跑”的问题。
- **快速启动依赖**：数据库、缓存、消息队列等服务可以一条命令启动。
- **交付更稳定**：应用依赖被写进镜像，部署时不再依赖人工安装。
- **隔离性更好**：不同项目可以使用不同版本的 Node、Java、Python、MySQL 等环境。
- **便于自动化**：CI/CD 可以基于镜像完成构建、测试和发布。

## 核心概念

| 概念 | 说明 |
| :--- | :--- |
| 镜像 Image | 应用运行环境的模板，类似“打包好的系统快照” |
| 容器 Container | 镜像启动后的运行实例 |
| Dockerfile | 描述如何构建镜像的文件 |
| Volume | 持久化数据或挂载本地目录 |
| Network | 容器之间通信的网络 |
| Registry | 存放镜像的仓库，例如 Docker Hub、私有镜像仓库 |
| Compose | 用 `docker compose` 管理多容器应用 |

## 安装与验证

安装完成后，可以通过以下命令确认 Docker 是否可用：

```bash
docker --version
docker compose version
docker run hello-world
```

如果能成功输出 `hello-world` 相关信息，说明 Docker 已经可以正常拉取镜像并启动容器。

## 常用命令

### 镜像操作

```bash
docker pull nginx:alpine
docker images
docker rmi nginx:alpine
```

### 容器操作

```bash
docker ps
docker ps -a
docker run -d --name web -p 8080:80 nginx:alpine
docker logs -f web
docker exec -it web sh
docker stop web
docker rm web
```

### 清理资源

```bash
docker system df
docker container prune
docker image prune
docker volume prune
```

清理命令会删除未使用的资源，执行前要确认没有误删仍需要的数据卷。

## 使用 Dockerfile 打包应用

以一个 Node 服务为例，可以在项目根目录创建 `Dockerfile`：

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

构建并启动：

```bash
docker build -t my-node-app .
docker run -d --name my-node-app -p 3000:3000 my-node-app
```

常见优化思路：

- 先复制依赖描述文件，再安装依赖，利用构建缓存。
- 使用更小的基础镜像，例如 `alpine` 版本。
- 不要把 `.env`、日志、构建产物缓存、敏感文件打进镜像。
- 通过 `.dockerignore` 排除 `node_modules`、`.git`、`dist` 等不必要文件。

## 使用 Docker Compose 管理多服务

当项目依赖多个服务时，推荐使用 `docker-compose.yml`：

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      REDIS_HOST: redis
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

常用命令：

```bash
docker compose up -d
docker compose logs -f
docker compose ps
docker compose down
```

如果需要连同数据卷一起删除，可以使用：

```bash
docker compose down -v
```

但生产环境或重要本地数据不要随意执行 `-v`。

## 开发中的推荐用法

### 本地依赖容器化

推荐先把数据库、Redis、MQ、对象存储模拟服务放进 Docker，而不是一开始就把所有东西都塞进容器。

```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: app
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mysql-data:
```

### 业务服务容器化

当项目运行链路稳定后，再把前端、后端、网关等业务服务写进 Compose，形成一条统一启动命令：

```bash
docker compose up -d
```

团队新人拉取代码后，只需要安装 Docker 并执行启动命令，就能快速进入开发状态。

## 生产部署注意点

- 镜像版本要固定，不要长期使用 `latest`。
- 配置和密钥通过环境变量、密钥管理服务或部署平台注入。
- 数据库、上传文件、日志等需要持久化的数据不要只放在容器内部。
- 容器需要配置健康检查、日志采集和重启策略。
- 镜像构建、推送、部署建议纳入 CI/CD 流程。

## 一句话总结

Docker 不是为了“炫技”，而是为了把环境变成可复制、可追踪、可自动化交付的基础设施。
