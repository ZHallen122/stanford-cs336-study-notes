---
title: 术语库 A–Z
description: 面向初学者的 CS336 中英双语术语解释，优先回答“它是什么、为什么需要”。
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---

术语保留英文，因为代码、论文和报错通常使用英文；中文用于建立第一层理解。

## Activation

**激活值。** 模型执行 forward 时，由当前输入和参数产生的中间 tensor。训练通常需要保留部分 activation，供反向传播计算梯度。

## Arithmetic intensity

**算术强度。** 单位数据搬运对应多少浮点运算。它帮助判断算子更可能受计算吞吐还是内存带宽限制。

## Attention

**注意力机制。** 根据当前 token 与上下文其他 token 的相关程度，组合信息的一种计算。它不是人类意识中的“注意”；Q/K/V、mask 与 shape 的完整入门见[Transformer block 与 Attention](../../foundations/transformer-attention/)。

## Autograd

**自动求导系统。** PyTorch 记录 tensor 操作的依赖关系，并用链式法则为需要求导的 tensor 计算 gradient。它计算 gradient，但不负责执行 optimizer 更新。

## Backpropagation

**反向传播。** 从 loss 出发，利用链式法则计算每个参数梯度的过程。

## Batch

**批次。** 一次并行送入模型的一组样本或序列。更大的 batch 可能提高硬件吞吐，也会增加 activation 内存并影响优化行为。

## BPE

**Byte Pair Encoding。** 从小单位开始，反复合并语料中最常见相邻对的 tokenizer 训练方法。

## BF16 / bfloat16

**Brain floating point 16-bit。** 占 2 bytes 的浮点格式，指数位数与 FP32 相同，因此动态范围接近 FP32，但有效精度更低。它常用于加速深度学习训练，不代表所有计算都能安全降为 16-bit。

## Checkpoint

**训练状态快照。** 为故障恢复或后续继续训练而保存的状态。除了模型 parameter，连续恢复通常还需要 optimizer、step、随机数、data position 和 scheduler 等状态。

## Causal mask

**因果遮罩。** 在计算 attention 权重前，把当前位置右侧的未来位置标为不可读取。这样，第 $t$ 个 token 的表示只依赖第 $t$ 个及更早的 token，符合自回归语言模型逐 token 预测的约束。

## Context window

**上下文窗口。** 模型一次 forward 能直接参考的 token 范围。更长的窗口会增加内存与计算成本，并不保证模型能同样有效地利用所有位置。

## GQA

**Grouped-Query Attention，分组查询注意力。** 使用较多 query heads、较少 key/value heads，让一组 query heads 共享 K/V。它在 MHA 与 MQA 之间折中表达能力和生成期 KV cache 成本。

## Embedding

**嵌入。** 把离散 ID 映射成连续向量。向量的各维通常不能单独用固定自然语言命名。

## Dtype

**数据类型。** Tensor 每个元素的数值格式，例如 FP32、FP16 或 BF16。它决定单元素字节数、动态范围、精度，以及硬件可使用的计算路径。

## Device

**执行设备。** Tensor 的 storage 与算子所在位置，例如 CPU 或 CUDA GPU。参与同一算子的 tensor 通常需要位于相容 device。

## FLOPs

**浮点运算次数。** 估算计算工作量的指标。相同 FLOPs 不保证相同运行时间。

## Gradient

**梯度。** loss 对一个或多个参数变化的局部敏感度；优化器用它决定参数更新方向与大小。

## Inference

**推理。** 使用已经训练的参数生成或评分，不再通过训练循环更新参数。

## KV cache

**键值缓存。** 自回归生成时，为每层保存历史 token 的 key 和 value，避免生成下一个 token 时重算完整前缀。它通常随 batch、上下文长度、层数、KV head 数和 head dimension 线性增长。

## Logits

模型对每个候选类别或 token 给出的未归一化分数。经过 softmax 后可转成概率分布。

## Loss

衡量预测与训练目标差距的标量。训练优化 loss，但低训练 loss 不自动等于真实场景表现好。

## MFU

**Model FLOPs Utilization，模型浮点运算利用率。** 实际完成的模型 FLOP/s 与硬件理论峰值 FLOP/s 的比值。它依赖 dtype、工作负载与核算口径，不能跨配置盲目比较。

## Mixed precision

**混合精度训练。** 在同一次训练中让不同算子或状态使用不同浮点格式，以平衡吞吐、内存与数值稳定性。它不是把整个模型无条件转换为低精度。

## Module

**PyTorch 模型组件。** `nn.Module` 把 forward 计算、子模块、parameter 和 buffer 组织在一起，并提供训练/推理模式切换与状态管理接口。

## MQA

**Multi-Query Attention，多查询注意力。** 多个 query heads 共享单个 key head 和 value head，以显著缩小生成期 KV cache 与内存带宽需求；相比 GQA，它的压缩更激进，也可能带来更大质量风险。

## Optimizer

**优化器。** 根据参数的 gradient 和内部状态计算参数更新的算法，例如 AdamW。它决定怎样走，但训练目标由 loss 定义。

## Optimizer state

**优化器状态。** 优化器为每个 parameter 跨训练 step 保存的统计量，例如 Adam 的一阶矩和二阶矩。它会占用训练内存，并需要随 checkpoint 保存才能连续恢复。

## Parameter

**参数。** 训练过程中会更新的数值，例如线性层权重。它不同于运行时产生的 activation。

## Pre-norm

**前置归一化。** 在 attention 或 FFN 子层之前做 normalization，再把子层输出加回未经该 norm 的 residual stream。它为深层 Transformer 提供更直接的信号和梯度路径。

## Q / K / V

**Query、Key 与 Value。** Attention 从输入生成的三组向量。Query 表示当前位置要读取什么，Key 用于计算各位置的匹配分数，Value 是最终按权重组合的内容；三者是学习到的表示，不是人工填写的数据库字段。

## Residual connection

**残差连接。** 把子层输出加回其输入，例如 $x + \operatorname{Attention}(x)$。它保持一条直接的信息与梯度路径，但要求相加两侧的 shape 相容。

## RMSNorm

**Root Mean Square Normalization。** 按特征维的均方根缩放每个 token 的表示，但不减去均值。它保持 shape，通常比 LayerNorm 少一次中心化和一组 bias 参数。

## RoPE

**Rotary Position Embedding，旋转位置嵌入。** 按 token 位置旋转 query 和 key 的成对坐标，使 attention 内积能够通过旋转角之差表达相对位置。

## Sliding-window attention

**滑动窗口注意力。** 每个位置只读取附近固定窗口内的 token，把单层 attention score 数量从约 `T²` 降到约 `T × W`，代价是单层无法直接访问任意远的位置。

## Softmax

**归一化指数函数。** 把一组任意实数分数转换为非负且总和为 1 的权重。实现时通常先减去最大分数，以避免指数运算溢出；它不会自动把最大项变成 1。

## SwiGLU

**Swish-Gated Linear Unit。** 使用 SiLU/Swish 激活的门控 FFN：一条投影产生 gate，另一条投影产生内容，逐元素相乘后再投影回 model dimension。

## Tensor

**张量。** 多维数值数组；在 PyTorch 中还带有 dtype、device 和梯度追踪等执行信息。

## State dict

**具名状态映射。** PyTorch Module 或 optimizer 暴露的可保存状态字典。Module 的 state dict 通常包含 parameter 和持久 buffer；完整训练恢复还需要 optimizer 与训练进度等状态。

## View

**张量视图。** 与另一个 tensor 共享底层 storage、但使用不同 shape、stride 或 offset 解读数据的 tensor。创建 view 通常不复制 payload，但写入可能影响所有别名，后续算子也可能因不连续布局而复制。

## Token

模型处理文本时使用的离散单位，可能是字、词的一部分、标点或字节片段。token 不等同于单词。

## Tokenizer

把文本编码成 token ID，并把 ID 解码回文本的规则、词表与实现。

## Transformer

以 attention 和逐位置前馈网络为核心构件的神经网络架构。现代语言模型通常堆叠很多 Transformer block；基础数据流见[Transformer block 与 Attention](../../foundations/transformer-attention/)。

## Vocabulary

**词表。** tokenizer 可直接表示的全部 token 集合，以及 token 与整数 ID 的映射。

---

发现缺失术语时，请在对应讲义首次出现处添加短解释，再在这里添加完整条目。不要只添加没有上下文的中文翻译。
