---
title: 术语库 A–Z
description: 面向初学者的 CS336 中英双语术语解释，优先回答“它是什么、为什么需要”。
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---

术语保留英文，因为代码、论文和报错通常使用英文；中文用于建立第一层理解。

## Arithmetic intensity

**算术强度。** 单位数据搬运对应多少浮点运算。它帮助判断算子更可能受计算吞吐还是内存带宽限制。

## Attention

**注意力机制。** 根据当前 token 与上下文其他 token 的相关程度，组合信息的一种计算。它不是人类意识中的“注意”。

## Backpropagation

**反向传播。** 从 loss 出发，利用链式法则计算每个参数梯度的过程。

## BPE

**Byte Pair Encoding。** 从小单位开始，反复合并语料中最常见相邻对的 tokenizer 训练方法。

## Embedding

**嵌入。** 把离散 ID 映射成连续向量。向量的各维通常不能单独用固定自然语言命名。

## FLOPs

**浮点运算次数。** 估算计算工作量的指标。相同 FLOPs 不保证相同运行时间。

## Gradient

**梯度。** loss 对一个或多个参数变化的局部敏感度；优化器用它决定参数更新方向与大小。

## Inference

**推理。** 使用已经训练的参数生成或评分，不再通过训练循环更新参数。

## Logits

模型对每个候选类别或 token 给出的未归一化分数。经过 softmax 后可转成概率分布。

## Loss

衡量预测与训练目标差距的标量。训练优化 loss，但低训练 loss 不自动等于真实场景表现好。

## Parameter

**参数。** 训练过程中会更新的数值，例如线性层权重。它不同于运行时产生的 activation。

## Tensor

**张量。** 多维数值数组；在 PyTorch 中还带有 dtype、device 和梯度追踪等执行信息。

## Token

模型处理文本时使用的离散单位，可能是字、词的一部分、标点或字节片段。token 不等同于单词。

## Tokenizer

把文本编码成 token ID，并把 ID 解码回文本的规则、词表与实现。

## Transformer

以 attention 和逐位置前馈网络为核心构件的神经网络架构。现代语言模型通常堆叠很多 Transformer block。

## Vocabulary

**词表。** tokenizer 可直接表示的全部 token 集合，以及 token 与整数 ID 的映射。

---

发现缺失术语时，请在对应讲义首次出现处添加短解释，再在这里添加完整条目。不要只添加没有上下文的中文翻译。
