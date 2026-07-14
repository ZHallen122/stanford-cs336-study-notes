---
title: 环境准备
description: 为笔记中的最小实验准备一个可重复、成本可控的开发环境。
---

## 最小环境

- Python 3.11 或更新版本
- Git
- 一个能创建虚拟环境的工具（`venv`、uv 或 Conda，选一个即可）
- 8 GB 以上内存；前置章节不需要 GPU

:::tip[先用 CPU]
官方课程也建议先在 CPU 上调试正确性，再使用 GPU 完成训练或性能测量。这样通常更便宜，也更容易定位问题。
:::

## 推荐目录约定

```text
cs336-workspace/
├── course/        # 官方作业仓库，遵循课程 honor code
├── experiments/   # 自己的最小实验
├── data/          # 不提交 Git 的数据
└── notes/         # 个人回顾与问题
```

## 每次实验都记录

1. 代码版本（Git commit）
2. Python 与依赖版本
3. 随机种子
4. 输入数据与 shape
5. CPU/GPU 型号
6. 结果与失败现象

这和服务的 observability 很像：没有上下文的单个 loss 数字，几乎无法用于调试。

## 课程规则

CS336 允许用 LLM 询问低层编程问题或高层概念，但禁止直接用它解题。做作业前请阅读当期官网的 honor code 与 AI policy；本站不提供可直接提交的实现。
