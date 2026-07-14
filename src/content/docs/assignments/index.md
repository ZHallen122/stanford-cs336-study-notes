---
title: 作业路线总览
description: 以依赖、里程碑和调试策略组织 CS336 的五个 assignment。
---

## 作业怎样串起来

| 作业 | 主要目标 | 前置依赖 |
| --- | --- | --- |
| A1 · Basics | tokenizer、Transformer、optimizer、最小训练 | PyTorch、shape、反向传播 |
| A2 · Systems | profiling、Triton、FlashAttention、distributed training | A1、GPU 内存层次 |
| A3 · Scaling | 组件分析与 scaling law | A1、回归与实验设计 |
| A4 · Data | Common Crawl 清洗、过滤、去重与混合 | 数据工程、评估基础 |
| A5 · Alignment & Reasoning RL | SFT、RL 与可选安全对齐 | 概率、生成、evaluation |

## 本站对作业的边界

这里会帮助你理解依赖、拆分里程碑、设计测试和解释报错，但不会提供可直接提交的答案。请始终遵守当期课程官网的 honor code 和 AI policy。

## 通用实现顺序

1. 阅读接口与测试，写下输入输出契约。
2. 实现最小正确版本。
3. 用极小数据建立端到端 smoke test。
4. 增加边界测试与数值检查。
5. profile 后再优化。
6. 记录实验配置，保证结果可复现。
