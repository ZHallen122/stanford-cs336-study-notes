---
title: PyTorch 与张量
description: 从普通 Python 程序过渡到 tensor、autograd、nn.Module 和最小训练循环。
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---

## 这页解决什么问题

PyTorch 把“多维数组计算、自动求导、模型状态和参数更新”组合在同一个执行系统里。对第一次接触深度学习的软件工程师，真正需要先建立的不是 API 记忆，而是一组稳定的检查问题：数据是什么 shape、存在哪里、是否参与求导，以及哪一步修改了长期状态。

完成本页后，你应该能够：

- 用 shape、dtype、device 和 `requires_grad` 描述 tensor。
- 区分逐元素乘法与矩阵乘法，并用 shape 检查操作是否合法。
- 解释 `loss.backward()` 产生什么，以及 gradient 为什么会累加。
- 识别 `nn.Module` 中的 parameter，并读懂 `state_dict()`。
- 按正确顺序阅读一个最小训练循环。
- 用固定顺序排查常见 shape、dtype、device 与 gradient 问题。

:::tip[建议阅读方式]
第一次读到“最小训练循环”即可继续 Lecture 2。Storage、stride、FLOPs、mixed precision 和性能优化都放在后续讲义中，不需要在这里一次学完。
:::

## 会在哪些课程里用到

- [Lecture 2 · PyTorch 与资源核算](../../lessons/02-pytorch-resources/)：把 tensor、autograd、Module 和 optimizer 展开成内存与计算账本。
- [Assignment 1 · Basics 路线](../../assignments/a1/)：阅读和调试模型、loss、optimizer 与 training loop 时作为快速参考。
- 后续架构、GPU kernel、parallelism 和 inference 课程都会继续使用同一套 tensor 语义。

本页解释的是通用 PyTorch 基础，不是 Assignment 1 的实现答案。做作业时仍应遵守当期课程 AI policy 与 honor code。

## Tensor：带执行语义的多维数组

Tensor 可以先理解为类似 NumPy array 的多维数值容器，但它还知道数据位于哪个 device，并能参与 automatic differentiation（自动求导）。输入、parameter、activation、gradient 和 optimizer state 通常都用 tensor 表示。

### 四个必查属性

```python
import torch

x = torch.tensor(
    [[1.0, 2.0], [3.0, 4.0]],
    dtype=torch.float32,
    device="cpu",
)
x.requires_grad_(True)

print({
    "shape": tuple(x.shape),
    "dtype": x.dtype,
    "device": x.device,
    "requires_grad": x.requires_grad,
})
```

| 属性 | 这个例子 | 回答的问题 |
| --- | --- | --- |
| shape | `(2, 2)` | 有哪些维度，每一维多长？ |
| dtype | `torch.float32` | 每个元素怎样表示？ |
| device | `cpu` | 数据和计算在哪里？ |
| `requires_grad` | `True` | autograd 是否需要追踪相关操作？ |

调试时不要只打印数值。两个 tensor 即使看起来包含相同数字，也可能因 dtype 或 device 不同而无法参与同一个操作。

### Shape 是接口契约

假设 `X` 的 shape 是 `(B, D)`，表示 `B` 个样本、每个样本 `D` 个特征；`W` 的 shape 是 `(D, K)`。矩阵乘法会消去中间的 `D`：

```python
B, D, K = 3, 2, 4
X = torch.ones(B, D)
W = torch.ones(D, K)

Y = X @ W
assert Y.shape == (B, K)
```

`@` 表示矩阵乘法，`*` 表示逐元素乘法。`X * X` 的输出仍是 `(B, D)`；`X @ W` 的输出则是 `(B, K)`。

:::caution[不要让 broadcasting 隐藏 shape bug]
PyTorch 可能自动扩展长度为 1 或缺失的维度。程序可以运行，不代表维度语义正确；每个模块边界仍应写出预期 shape。
:::

### Dtype 与 device 必须相容

模型 parameter 与输入通常要位于相同 device，并使用算子支持的相容 dtype。常见迁移方式是：

```python
device = "cuda" if torch.cuda.is_available() else "cpu"
x = x.to(device=device, dtype=torch.float32)
model = model.to(device)
```

`.to(...)` 可能返回新 tensor。若忘记接住返回值，原来的 `x` 不会自动变到目标 device。

第一次学习时先在 CPU 和 FP32 上验证正确性。GPU 与低精度能提高吞吐，却也会引入异步执行、数据移动和数值稳定性问题。

## Autograd：从 loss 计算 gradient

Automatic differentiation（autograd）记录 tensor 操作之间的依赖，并用链式法则计算导数。它不是数值微分，也不是把训练代码反向执行一遍。

### 一个可以手算的例子

令输入 $x=3$、parameter $w=2$、target $y=7$：

$$
\hat{y} = xw = 6, \qquad L = (\hat{y}-y)^2 = 1
$$

loss 对 $w$ 的 gradient 是：

$$
\frac{\partial L}{\partial w}
= 2(\hat{y}-y)x
= 2(6-7)3
= -6
$$

PyTorch 写法：

```python
x = torch.tensor(3.0)
w = torch.tensor(2.0, requires_grad=True)
target = torch.tensor(7.0)

prediction = x * w
loss = (prediction - target).pow(2)
loss.backward()

assert w.grad.item() == -6.0
```

`loss.backward()` 计算 gradient；它不会自动修改 `w`。真正的 parameter 更新由 optimizer 的 `step()` 完成。

### Gradient 默认累加

再次调用 `backward()` 时，新 gradient 会加到已有 `.grad`：

```python
loss = (x * w - target).pow(2)
loss.backward()
assert w.grad.item() == -12.0
```

这可以用于 gradient accumulation，也可能是忘记清空 gradient 的 bug。开始新一步训练前，通常调用：

```python
optimizer.zero_grad(set_to_none=True)
```

### 什么时候不需要计算 gradient

验证和推理通常不更新 parameter，可以关闭 gradient 记录：

```python
model.eval()

with torch.no_grad():
    prediction = model(x)
```

`model.eval()` 改变 dropout、batch normalization 等模块的运行行为；`torch.no_grad()` 关闭当前代码块的 gradient 记录。两者职责不同，不能互相替代。

## nn.Module：组织计算与长期状态

`nn.Module` 把 forward 计算、子模块和 parameter 组织在一起。把 `nn.Parameter` 或另一个 Module 赋给 Module 属性后，PyTorch 才能通过 `parameters()` 和 `state_dict()` 发现它们。

### 一个最小模型

```python
from torch import nn

class TinyRegressor(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.linear = nn.Linear(2, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.linear(x)

model = TinyRegressor()
x = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
prediction = model(x)

assert prediction.shape == (2, 1)
```

输入 shape 是 `(batch=2, features=2)`；`nn.Linear(2, 1)` 对每个样本产生一个输出，因此结果是 `(2, 1)`。

### Parameter 与 activation 不同

| 对象 | 来自哪里 | 是否跨 batch 保留 |
| --- | --- | --- |
| Parameter | `nn.Linear` 的 weight 与 bias | 是，由 optimizer 更新 |
| Activation | 当前 `x` 经过 forward 的中间结果 | 通常否；训练时可能保留到 backward |
| Gradient | backward 计算出的 parameter 导数 | 保留到清空或下一次更新 |

```python
for name, parameter in model.named_parameters():
    print(name, tuple(parameter.shape))
```

这个模型会报告 `linear.weight` shape `(1, 2)` 与 `linear.bias` shape `(1,)`。

### `state_dict()` 是可保存状态的映射

```python
state = model.state_dict()
print(state.keys())
```

对这个模型，键包括 `linear.weight` 和 `linear.bias`。Checkpoint 通常保存 model state、optimizer state 和训练进度；完整恢复方法在 [Lecture 2 的 checkpoint 小节](../../lessons/02-pytorch-resources/#checkpoint-保存恢复所需状态)。

## 最小训练循环

训练一步的核心顺序是：清空旧 gradient → forward → loss → backward → update。

```python
from torch import nn

model = TinyRegressor()
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
loss_fn = nn.MSELoss()

features = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
targets = torch.tensor([[3.0], [7.0]])

optimizer.zero_grad(set_to_none=True)
predictions = model(features)
loss = loss_fn(predictions, targets)
loss.backward()
optimizer.step()
```

每一行只负责一件事：

1. `zero_grad`：清除上一步累积的 gradient。
2. `model(features)`：执行 forward，产生 prediction 与 activation。
3. `loss_fn(...)`：把预测误差压缩成标量 loss。
4. `backward()`：为 parameter 计算 gradient。
5. `step()`：optimizer 读取 gradient 并更新 parameter。

:::note[顺序可以有等价变体]
有些代码把 `zero_grad()` 放在上一步 `step()` 之后。关键不变量是：新一轮 backward 前，旧 gradient 已按计划清空；若刻意累计多个 microbatch，则要明确何时清空和更新。
:::

## 一个 CPU 小实验

下面把同一个 toy batch 重复训练 100 步，目的是观察训练循环，不是获得有泛化能力的模型：

```python
torch.manual_seed(0)

model = TinyRegressor()
optimizer = torch.optim.SGD(model.parameters(), lr=0.05)
loss_fn = nn.MSELoss()

features = torch.tensor([
    [0.0, 0.0],
    [1.0, 0.0],
    [0.0, 1.0],
    [1.0, 1.0],
])
targets = torch.tensor([[1.0], [3.0], [4.0], [6.0]])

initial_loss = None

for step in range(100):
    optimizer.zero_grad(set_to_none=True)
    predictions = model(features)
    loss = loss_fn(predictions, targets)

    if initial_loss is None:
        initial_loss = loss.item()

    loss.backward()
    optimizer.step()

assert loss.item() < initial_loss
```

这个数据满足 $y = 2x_1 + 3x_2 + 1$。实验应验证的不是某个固定的最后小数，而是：shape 始终正确、loss 是有限值，并且在固定设置下明显下降。

:::caution[执行状态]
本站的 Astro 构建不会运行 Python 代码，当前仓库环境也没有安装 PyTorch。以上示例依据官方 PyTorch API 编写；请在安装 PyTorch 的 CPU 环境中运行，并把实际版本与结果记录下来。
:::

## 常见失败模式

### Shape 对不上

先写出算子两侧的完整 shape，再找应该相等或被消去的维度。不要通过随意 `squeeze()`、`unsqueeze()` 让报错消失。

### Dtype 或 device 不一致

打印输入与第一个 parameter 的 dtype/device：

```python
first_parameter = next(model.parameters())
print(features.dtype, features.device)
print(first_parameter.dtype, first_parameter.device)
```

在模型入口统一转换，比在每一层临时 `.to(...)` 更容易维护。

### Loss 不下降

先固定 seed 和极小数据，检查 target shape、gradient 是否存在、learning rate 是否合理，以及 `step()` 是否真的执行。能否 overfit 一个 tiny batch 是很有用的最小诊断，但通过它不代表模型能泛化。

### 出现 NaN 或 Inf

找到第一个异常 tensor，而不是只看最终 loss。缩小输入和模型，改回 FP32，并检查除法、`log`、`exp`、初始化与 learning rate。

### 训练和推理行为混淆

训练使用 `model.train()`；验证和推理使用 `model.eval()`，并在不需要 gradient 时配合 `torch.no_grad()` 或 `torch.inference_mode()`。

## 固定调试顺序

1. 用极小 deterministic 输入在 CPU、FP32 上运行。
2. 检查每个边界的 shape、dtype 和 device。
3. 确认 scalar loss 有限，parameter gradient 存在且有限。
4. 确认一步 `optimizer.step()` 后 parameter 确实改变。
5. 尝试 overfit 一个 tiny batch。
6. 正确性稳定后再迁移 GPU、低精度、较大 batch 或编译优化。

这套顺序把 correctness 与 performance 分开。若一开始就同时改变 device、dtype、batch 和实现，很难判断是哪一层破坏了不变量。

## 理解检查

1. Shape、dtype、device 和 `requires_grad` 分别回答什么问题？
2. `(B, D) @ (D, K)` 的输出 shape 是什么？`(B, D) * (B, D)` 呢？
3. 为什么连续调用两次 `backward()` 会改变 `.grad` 的值？
4. `loss.backward()` 与 `optimizer.step()` 各自负责什么？
5. `model.eval()` 与 `torch.no_grad()` 为什么不能互相替代？
6. Parameter、activation 和 gradient 哪些跨 batch 保留？
7. Tiny batch 可以被 overfit，却不能在真实数据上工作，这两个事实是否矛盾？

## 继续到哪里

- [Lecture 2 · PyTorch 与资源核算](../../lessons/02-pytorch-resources/)：继续学习 storage/view、dtype 成本、FLOPs、MFU、optimizer state、checkpoint 与 mixed precision。
- [数学最小集](../math/)：复习矩阵乘法、gradient 和链式法则。
- [符号与形状速查](../../reference/notation/)：查询 `B`、`T`、`D` 等维度约定。
- [Assignment 1 · Basics 路线](../../assignments/a1/)：把这些检查动作应用到课程组件，但不获取提交答案。

## 官方资料

- [PyTorch tensors tutorial](https://docs.pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html)
- [PyTorch autograd tutorial](https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html)
- [PyTorch build-model tutorial](https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html)
- [PyTorch optimization tutorial](https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html)
- [PyTorch tensor views documentation](https://docs.pytorch.org/docs/stable/tensor_view.html)

本页最后核对官方 PyTorch 文档：2026-07-14。
