---
title: 符号与形状速查
description: 集中解释讲义中反复使用的维度名和数学符号。
---

## 常见维度

| 符号 / 名称 | 含义 |
| --- | --- |
| `B` / batch | 一次并行处理的样本数 |
| `T` / sequence length | 每个样本的 token 数 |
| `V` / vocabulary size | 词表大小 |
| `D` / `d_model` | 模型隐藏表示维度 |
| `K` / output dimension | 线性变换的输出维度 |
| `H` / heads | attention head 数量 |
| `d_head` | 单个 attention head 的维度 |
| `H_q` / query heads | query 的 head 数量 |
| `H_kv` / KV heads | key 和 value 的 head 数量；GQA/MQA 中可少于 `H_q` |
| `d_ff` / feed-forward dimension | FFN 内部扩展后的宽度 |
| `L` / layers | 堆叠的 Transformer block 数量 |
| `W` / attention window | sliding-window attention 中每个位置可读取的局部范围 |
| `N` / flattened tokens | 展平 batch 与 sequence 后的 token 数，通常 `N = B × T` |
| `E` / experts | MoE 中 routed expert 的数量 |
| `k` / active experts | MoE 中每个 token 选择的 routed expert 数量 |
| `C` / expert capacity | 一个 expert 在一次 dispatch 中最多接收的 token assignment 数 |
| `d_φ` / feature width | linear attention 中 query/key feature map 的输出维度 |

## 典型 shape

| 数据 | Shape |
| --- | --- |
| token IDs | `(B, T)` |
| embeddings / hidden states | `(B, T, D)` |
| vocabulary logits | `(B, T, V)` |
| attention scores（单层多头） | `(B, H, T, T)` |
| query / key / value（MHA） | `(B, H, T, d_head)` |
| query / key / value（GQA） | Q 为 `(B, H_q, T, d_head)`；K/V 为 `(B, H_kv, T, d_head)` |
| FFN 中间 activation | `(B, T, d_ff)` |
| MoE router logits | 展平后为 `(N, E)`，其中 `N = B × T` |
| Linear attention recurrent state | `S` 为 `(d_φ, d_v)`；归一化状态 `z` 为 `(d_φ)` |
| 线性变换 `X @ W` | `(B, D) @ (D, K) → (B, K)` |

## 阅读规则

- 文中会明确 batch 维和 sequence 维，不依赖“读者应该知道”的约定。
- shape 使用从左到右的固定顺序；若代码库不同，会在页面开头注明。
- `*` 表示标量乘法，`@` 表示矩阵乘法；逐元素乘法会明确写出。
- `≈` 表示近似，不是严格等于。
