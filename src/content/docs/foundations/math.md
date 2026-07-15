---
title: 数学最小集
description: CS336 中反复出现的线性代数、微积分、归一化与概率概念，强调输入、输出和直觉而非证明。
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---

## 这页解决什么问题

语言模型会使用向量、矩阵、内积、平均值、指数、对数和梯度。你不需要先完成一门大学数学课；第一次阅读只需要知道每个运算接收什么、输出什么，以及它为什么出现在模型里。

看到陌生公式时，可以随时只读对应小节，不要求从头读到尾。

## 会在哪些课程里用到

- [Lecture 1 · Overview & Tokenization](../../lessons/01-tokenization/)：读取序列概率分解，并理解为什么语言模型预测下一个 token 的概率。
- [Lecture 2 · PyTorch 与资源核算](../../lessons/02-pytorch-resources/)：检查矩阵乘法 shape，并理解 autograd 如何用链式法则计算 gradient。
- [Transformer block 与 Attention](../transformer-attention/)：用内积比较 Q/K，用 softmax 得到读取权重。
- [Lecture 3 · Architecture & Hyperparameters](../../lessons/03-architecture-hyperparameters/)：读取 RMSNorm、RoPE、attention softmax 和 stability trick 的公式。
- 后续 loss、normalization、scaling law 与 sampling 内容会继续回链到本页。

## 阅读公式的固定顺序

看到公式时，不要先逐字符解析。按这个顺序：

1. 找输出是什么。
2. 标出每个输入的 shape。
3. 用 shape 检查操作是否合法。
4. 代入一个很小的数字例子。
5. 最后再理解抽象符号和推导。

如果第一遍只能完成前 3 步，已经足够继续很多工程任务。

## 标量、向量、矩阵与 Tensor

- 标量：单个数，例如 loss。
- 向量：一列有顺序的数，例如一个 token 的表示。
- 矩阵：二维数表，例如线性层权重。
- tensor：把这些概念推广到任意维度。

Shape 描述每个维度的长度。例如 `(B,T,D)` 表示 `B` 条序列、每条 `T` 个位置、每个位置 `D` 个数字。

### 矩阵乘法先检查中间维

若 `X` 的 shape 是 `(B,T,D)`，`W` 的 shape 是 `(D,K)`：

$$
Y = XW
$$

`D` 相等并被消去，输出 shape 是 `(B,T,K)`。

```text
(B, T, D) @ (D, K) → (B, T, K)
       └──────┘
       必须相等
```

矩阵乘法不是逐元素乘法。逐元素乘法要求对应位置可以匹配，通常不会消去维度。

## 内积：把两个向量比较成一个分数

对两个长度相同的向量 $x,y \in \mathbb{R}^{D}$，内积是对应元素相乘后求和：

$$
x \cdot y = \sum_{i=1}^{D} x_i y_i
$$

例如：

$$
[1,2] \cdot [3,4] = 1\times3 + 2\times4 = 11
$$

输入是两个 shape `(D,)` 的向量，输出是一个标量。Attention 使用 query 与 key 的内积产生匹配分数。

内积大不一定只表示“方向更相似”，也可能因为向量本身尺度更大。Normalization 和除以 $\sqrt{d_{head}}$ 都在帮助控制这个尺度。

## 平均值、方差与均方根

### 平均值回答中心在哪里

对 $D$ 个数字：

$$
\operatorname{mean}(x) = \frac{1}{D}\sum_{i=1}^{D}x_i
$$

`[2,4,6]` 的平均值是 `4`。

### 方差回答围绕平均值有多分散

$$
\operatorname{var}(x)
= \frac{1}{D}\sum_{i=1}^{D}(x_i-\operatorname{mean}(x))^2
$$

先减平均值，再平方并取平均。标准差是方差的平方根。

### RMS 回答数字的典型绝对尺度

Root Mean Square (RMS，均方根) 不先减平均值：

$$
\operatorname{RMS}(x)
= \sqrt{\frac{1}{D}\sum_{i=1}^{D}x_i^2}
$$

对 `x=[3,4]`：

$$
\operatorname{RMS}(x)
= \sqrt{\frac{3^2+4^2}{2}}
= \sqrt{12.5}
\approx 3.536
$$

RMS 不是标准差。标准差先围绕平均值中心化，RMS 保留了均值对尺度的贡献；这正是 RMSNorm 与 LayerNorm 的一个核心差异。

## 指数函数：放大分数差异

指数函数写作 $e^x$ 或 `exp(x)`。它的输出永远大于 0：

| 输入 `x` | `exp(x)` 约等于 |
| ---: | ---: |
| `-1` | `0.368` |
| `0` | `1` |
| `1` | `2.718` |
| `2` | `7.389` |

输入只增加 1，输出会乘上约 2.718。这个快速增长让 softmax 能突出较大的分数，也带来 overflow 风险。

## Softmax：把一组分数变成概率权重

Softmax 接收任意实数向量 $z \in \mathbb{R}^{N}$，输出同 shape 的向量：

$$
\operatorname{softmax}(z)_i
= \frac{e^{z_i}}{\sum_{j=1}^{N}e^{z_j}}
$$

输出满足两个不变量：

1. 每个元素在 0 与 1 之间。
2. 所有元素之和为 1。

例如 `z=[2,1,0]`：

```text
softmax(z) ≈ [0.665, 0.245, 0.090]
```

最大的分数得到最大权重，但不是直接变成 1。Attention 用 softmax 把匹配分数变成读取权重；语言模型输出层用它把 vocabulary logits 变成 token 概率。

### 为什么先减最大值

直接计算 `exp(1000)` 会 overflow。Softmax 对所有输入加同一个常数不敏感，因此可以令 $m=\max(z)$：

$$
\operatorname{softmax}(z)_i
= \frac{e^{z_i-m}}{\sum_j e^{z_j-m}}
$$

现在最大的指数输入是 0，`exp(0)=1`。结果不变，数值更安全。

:::caution[Softmax 维度必须明确]
对 shape `(B,H,T,T)` 的 attention scores，通常沿最后一个 key-position 维做 softmax。沿错维度仍可能得到“每行和为 1”的 tensor，却表达了错误语义。
:::

## Log 与 log-sum-exp

自然对数 `log` 是指数函数的逆运算：

$$
\log(e^x)=x
$$

概率相乘容易得到极小数字；取 log 后，乘法变加法：

$$
\log(ab)=\log a+\log b
$$

语言模型训练常最小化正确 token 的负对数概率：正确答案概率越接近 1，惩罚越接近 0。

### 稳定地计算 log-sum-exp

Log-sum-exp 是：

$$
\operatorname{LSE}(z)=\log\sum_i e^{z_i}
$$

令 $m=\max(z)$，可改写为：

$$
\operatorname{LSE}(z)
= m + \log\sum_i e^{z_i-m}
$$

这与 softmax 的“减最大值”是同一种数值稳定技巧。Cross-entropy、z-loss 和许多概率计算都会用到它。

## 二维旋转：RoPE 的最小数学积木

二维旋转矩阵把向量转过角度 $\theta$：

$$
R(\theta)=
\begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix}
$$

对向量 `[1,0]`：

- 旋转 `0°` 仍是 `[1,0]`。
- 旋转 `90°` 变成 `[0,1]`。
- 旋转 `180°` 变成 `[-1,0]`。

旋转保持向量长度，也保持同时旋转两个向量时的内积。若两个向量旋转不同角度，它们的内积只与角度差有关：

$$
(R(i\theta)q)^T(R(j\theta)k)
= q^T R((j-i)\theta)k
$$

RoPE 把高维向量拆成许多二维坐标对，用不同频率旋转。第一次阅读只需要记住：**绝对位置决定各自旋转多少，Q/K 内积看到的是相对角度差。**

## 导数、梯度与链式法则

导数回答：“输入发生很小变化时，输出大约怎样变化？”梯度把这个问题同时问给很多参数。

若一个值经过多步函数才得到 loss，链式法则把每一步的局部变化率相乘，让影响从 loss 传回较早的参数。这是 backpropagation 的数学基础。

第一次阅读不需要推导矩阵微积分。先知道 gradient 的 shape 与 parameter 相同，并且 optimizer 使用它更新 parameter。

## 一个标准库小实验

```python
import math

def stable_softmax(values: list[float]) -> list[float]:
    maximum = max(values)
    exponentials = [math.exp(value - maximum) for value in values]
    total = sum(exponentials)
    return [value / total for value in exponentials]

weights = stable_softmax([2.0, 1.0, 0.0])

assert abs(sum(weights) - 1.0) < 1e-9
assert weights[0] > weights[1] > weights[2]
assert abs(weights[0] - 0.6652) < 1e-3
```

把输入改成 `[1002,1001,1000]`，输出应几乎相同。三项之间的差仍是 `2:1:0`，而减最大值避免了计算 `exp(1002)`。

## 常见误区

### “向量维度就是可以命名的人工特征”

模型内部维度通常由训练共同形成，单独一维未必对应稳定的人类概念。Shape 告诉你接口，不自动给出语义。

### “Softmax 输出就是模型最终选择”

Softmax 只产生分布。推理还要使用 greedy、sampling、temperature 或其他策略选择 token。

### “数值稳定技巧只是性能优化”

不是。`exp` overflow、`log(0)` 或低精度舍入可能产生 Inf/NaN，让训练直接失效。等价改写首先是在保护正确性。

### “RMS 与标准差是同一个量”

标准差先减平均值，RMS 不减。输入均值不是 0 时，两者通常不同。

## 理解检查

1. `(B,T,D) @ (D,K)` 的输出 shape 是什么？
2. `[1,2]·[3,4]` 为什么输出标量？
3. RMS 与标准差在计算步骤上少了哪一步？
4. Softmax 输出必须满足哪两个不变量？
5. 为什么 softmax 可以先减去输入最大值？
6. Attention scores 应沿 query 维还是 key 维归一化？
7. RoPE 中同时平移两个位置，为什么 pairwise 内积不变？
8. Gradient 与 parameter 的 shape 通常是什么关系？

## 这一页暂时不追求什么

不要求证明 softmax 导数、完整矩阵微积分、RoPE 频率设计或数值分析误差界。第一遍能检查 shape、手算小例子、知道稳定性改写在保护什么，就足以继续 Lecture 3。

## 官方资料与状态

- [CS336 Spring 2026 Assignment 1 handout](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Root Mean Square Layer Normalization](https://arxiv.org/abs/1910.07467)
- [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- 本页是本站的零基础数学导航，不替代课程作业要求。
- 最后对照：CS336 Spring 2026 Assignment 1 version 26.0.3，2026-07-15。
