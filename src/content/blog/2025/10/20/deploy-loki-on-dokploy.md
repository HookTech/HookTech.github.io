---
title: 在 Dokploy 部署 Loki 日志平台（Promtail + MinIO + Nginx 网关）
description: 基于 Dokploy 使用 Docker Compose 一键部署 Loki，统一采集 Docker 容器日志，启用 Grafana 登录、Nginx 网关与 MinIO 对象存储。
pubDate: 2025-10-20T10:30:00
tags:
  - Loki
  - Dokploy
  - Promtail
  - Grafana
  - MinIO
  - Nginx
  - Docker
categories:
  - Observability
---

# 引子
线上日志总是“各自为政”，容器换一换就找不到了。想要的是：最少的改动，把 Loki + Promtail + MinIO 拉起来，让 Dokploy 管着部署和更新，开发同学能直接在 Grafana 里搜到容器日志，没那么多弯弯绕绕。

# 目标与约定
- 统一入口：Nginx 网关对外只暴露 `/loki/*` 和 `:8080`。
- 存储：MinIO 作为对象存储（容器内 9000，对外映射 9003）。
- 采集：Promtail 挂载 Docker socket，自动抓所有容器日志。
- 可视化：Grafana 走 3300，必须登录（禁用匿名）。

# 在 Dokploy 导入 Compose（一把梭）
直接使用仓库的 `production/docker/docker-compose.yaml`。注意几个端口：Grafana `3300:3000`，Gateway `8080:80/3100`，Promtail `9080`，MinIO `9003:9000`、Console `9001`。

需要的挂载（Dokploy 里用 Host Path）：
- `.data/minio:/data`（MinIO 持久化）
- `./config:/etc/loki`、`./config:/etc/promtail`
- `/var/run/docker.sock:/var/run/docker.sock:ro`（Promtail 采集 Docker 容器）

Grafana/MinIO 的默认账号在 compose 里已经给出，记得上线前换成强口令。

# Promtail 配置要点（Docker 场景）
```yaml
clients:
  - url: http://loki-gateway:80/loki/api/v1/push
scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    pipeline_stages:
      - docker: {}
```
说人话：Promtail 直接读 Docker 的 json-file 日志，不需要你改容器里任何日志路径。加上 Docker 的 labels，后面在 Grafana 里按 `service`、`project` 过滤非常顺手。

# 验证（两分钟走通）
1) 打开 Grafana：`http://<host>:3300`，用管理员账号登录。
2) Explore 里搜：`{job="docker"}`，应该能看到容器日志；如果没有，检查 Docker socket 是否挂载到 Promtail。
3) 也可以直接敲 API：
```
curl -G "http://<host>:8080/loki/api/v1/query" \
  --data-urlencode 'query={job="docker"}' \
  --data-urlencode 'limit=5'
```

# 踩坑记录（别问，问就是趟过）
- MinIO 端口：容器内必须 9000，外部想改就映射（本文用 9003→9000）。否则 SDK/URL 一会儿 9000 一会儿 9003，自己打自己。
- 网关端口：对外用 8080，不直接暴露 3100；读写分流都在 Nginx 里配好了。
- 日志驱动：本文默认 Docker 的 `json-file`。如果你机器上换成了 journald/containerd，Promtail 的 `pipeline_stages` 要跟着改。
- 权限问题：Promtail 读 Docker socket 需要 root/组权限，遇到 403/permission denied，先看挂载和容器用户。

# 收尾
这一套在单机就能跑顺，交给 Dokploy 后，更新靠重部署 Compose 即可。生产上把密码放进 Secrets，副本与资源限额按需调。剩下的，就是在 Grafana 里安心敲查询了:)
