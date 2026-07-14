---
title: PyTorch 与张量
description: 从普通 Python 程序过渡到 PyTorch 的数据、自动求导和训练循环。
---

## 会在哪些课程里用到

- [Lecture 2 · PyTorch 与资源核算](../../lessons/02-pytorch-resources/)：用 tensor 的 shape、dtype、device 和内存占用理解训练成本。
- [Assignment 1 · Basics 路线](../../assignments/a1/)：阅读和调试模型、optimizer 与 training loop 时作为快速参考。

## Tensor 可以看成“带执行语义的多维数组”

除了值与 shape，tensor 还有 dtype、device 和是否记录梯度等属性。调试时至少打印这四项。

```python
def inspect(name, x):
    print(name, {
        "shape": tuple(x.shape),
        "dtype": str(x.dtype),
        "device": str(x.device),
        "requires_grad": x.requires_grad,
    })
```

## 最小训练循环

```python
optimizer.zero_grad()   # 清除上一步留下的梯度
prediction = model(x)  # 前向计算
loss = loss_fn(prediction, target)
loss.backward()        # 自动求导
optimizer.step()       # 更新参数
```

:::caution[梯度默认会累加]
这和普通局部变量的直觉不同。不调用 `zero_grad()` 时，新梯度会加到旧梯度上；有时这是刻意的 gradient accumulation，有时是 bug。
:::

## 调试顺序

1. 先用极小输入在 CPU 上跑通。
2. 对每个边界检查 shape、dtype、device。
3. 确认 loss 能在一个很小的数据集上下降。
4. 再迁移 GPU。
5. 正确性稳定后才做 profiling 和优化。
