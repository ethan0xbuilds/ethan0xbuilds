---
title: "我的 OpenStack 云原生化实践总结"
date: "2026-03-15"
summary: "5 年华为云 OpenStack 经验，30+ 组件迁移 K8s 的技术细节与踩坑记录。"
category: tech
---

## 背景

华为云 OpenStack 控制面最初依赖裸机部署，缺乏弹性扩缩容能力。我们团队负责将 30+ 个组件迁移到 K8s。

## 技术方案

### 指标采集

使用 Keystone 鉴权完成 Prometheus Exporter，遇到的核心问题是 `prometheus/client_python` 不支持 HTTPS/mTLS。

最终设计了 TLS 上下文切换方案，支持 TLS 与 mTLS 双模式，并向上游提交了 PR，经过 73 轮 review 后合并。

### 容器化改造

Keystone 和 wrap-trigger 的容器化改造涉及：

- 配置文件挂载（ConfigMap vs Secret）
- 健康检查端点设计
- 滚动升级策略

## 数据

改造完成后，节约估算超过 1000 人天的运维人力成本。
