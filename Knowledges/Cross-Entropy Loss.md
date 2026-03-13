---
type: skills
tags:
  - algorithm
  - math
  - DeepLearning
  - LLM
  - code/python
done: false
topic:
  - "[[Coding]]"
  - "[[PyTorch]]"
---
# Cross Entropy Loss

交叉熵损失 (Cross Entropy Loss) 是深度学习和机器学习中用于衡量分类模型性能的最重要的损失函数之一. 它主要用于量化概率分布之间的差异, 即模型预测的概率分布与真实的标签分布之间的距离. 在训练过程中, 优化的目标是最小化这个损失值, 从而使模型的预测结果尽可能接近真实标签.

## Concept and Definition

交叉熵的核心概念来源于信息论. 它可以被理解为衡量两个概率分布 $P$ 和 $Q$ 之间的差异性. 在机器学习的语境下, $P$ 通常代表数据的真实分布 (Ground Truth), 而 $Q$ 代表模型预测的概率分布.

对于分类问题, 我们希望模型对正确类别的预测概率为 1, 而对其他类别的预测概率为 0. 交叉熵损失函数会在模型对正确类别赋予较低概率时产生巨大的惩罚, 从而迫使模型迅速调整参数以提高预测的准确性.

## Mathematical Formulation

在多分类 (Multi-Class) 场景下, 假设共有 $C$ 个类别. 对于某一个样本, 它的真实标签通常用 One-hot 编码表示. 设 $y$ 为真实标签向量, 其中只有对应的正确类别索引处的元素为 1, 其余为 0. 设 $\hat{y}$ 为模型输出的预测概率分布 (通常是经过 Softmax 函数处理后的结果).

单个样本的交叉熵损失公式如下:

$$Loss = - \sum_{i=1}^{C} y_i \log(\hat{y}_i)$$

由于 $y$ 是 One-hot 向量, 只有在真实类别 $t$ (target class) 处 $y_t = 1$, 其他位置均为 0. 因此, 上述公式可以简化为仅关注正确类别的预测概率:

$$Loss = - \log(\hat{y}_t)$$

这里 $\hat{y}_t$ 是模型预测该样本属于真实类别 $t$ 的概率. 从这个公式可以看出, 如果模型对正确类别的预测概率 $\hat{y}_t$ 越接近 1, $\log(\hat{y}_t)$ 就越接近 0, 损失也就越小. 反之, 如果 $\hat{y}_t$ 趋向于 0, 损失将趋向于无穷大.

在实际应用中 (如 PyTorch), 为了数值稳定性, 通常直接将模型的原始输出 (Logits) 作为输入, 将 LogSoftmax 和 NLL Loss (负对数似然损失) 合并计算.

## Expected Inputs and Outputs

理解输入和输出的数据形态对于正确使用该损失函数至关重要.

### Inputs

交叉熵损失函数的输入主要包含两部分. 第一部分是模型的预测输出 (Logits). 在大多数深度学习框架中, 这里的输入不需要预先经过 Softmax 激活, 因为损失函数内部会自动包含这一步. 其形状通常为 $(N, C)$, 其中 $N$ 是批量大小 (Batch Size), $C$ 是类别数量 (对于 LLM 来说是词表大小).

第二部分是真实标签 (Target). 这是一个形状为 $(N)$ 的张量, 包含每个样本对应的真实类别的索引值. 这些索引值的范围必须在 $[0, C-1]$ 之间. 注意, 标签不需要是 One-hot 编码形式, 只需要提供类别的整数索引即可.

第一部分相当于是全部类别的概率. 第二部分是期望概率最大的类别编号. 因此交叉熵最终的目标是最大化正确类别的概率.

### Outputs

该函数的输出是一个标量 (Scalar), 代表整个批次数据的平均损失 (或总和, 取决于归约方式). 这个标量值用于后续的反向传播 (Backpropagation) 以更新模型参数.

## Usage Scenarios

交叉熵损失适用于绝大多数分类任务, 尤其是在类别之间互斥的情况下.

在多分类问题中, 如果每一个样本只能属于一个类别 (例如手写数字识别, 一张图只能是 0-9 中的一个; 或者 LLM 下一个词预测, 真实文本中下一个词是确定的), 必须使用交叉熵损失.

它不适用于回归任务 (Regression), 回归任务通常使用均方误差 (MSE). 也不适用于多标签分类 (Multi-label Classification), 即一个样本可以同时属于多个类别的情况, 那种情况通常使用二元交叉熵 (Binary Cross Entropy) 处理每一个输出节点.

### Application in Large Language Models

大语言模型 (LLM) 的训练本质上是一个基于上下文预测下一个 Token 的多分类问题. 在这个场景下, 交叉熵损失扮演着核心角色.

#### Vocabulary as Categories

对于 LLM 而言, 所谓的 多类别 (Multi-categories) 指的是模型的词表 (Vocabulary). 如果一个模型的词表大小为 50,000, 那么在生成每一个 Token 时, 模型实际上是在做一个 50,000 分类的任务. 模型需要从 50,000 个可能的候选词中选出概率最高的那一个作为下一个词.

#### Sequence Handling

LLM 处理的是序列数据. 假设输入序列长度为 $L$, 批量大小为 $B$, 词表大小为 $V$. 模型输出的 Logits 形状通常为 $(B, L, V)$. 为了计算交叉熵损失, 通常需要将这个三维张量重塑 (Reshape) 或展平.

我们将 $(B, L)$ 视为 $B \times L$ 个独立的样本. 因此, 我们将预测结果重塑为 $(B \times L, V)$, 将对应的真实标签重塑为 $(B \times L)$. 此时, 每一个时间步的 Token 预测都被视为一个独立的分类任务, 计算其与真实下一个 Token 之间的交叉熵, 然后取平均值作为整体的序列损失.
## Python Implementation Example

以下是一个使用 PyTorch 实现交叉熵损失的详细示例. 该示例模拟了一个微型语言模型的场景, 其中包含批量数据处理和序列预测.

### Code Description

代码首先初始化了一个模拟的预测张量 `logits`, 它的维度是 `(Batch Size, Sequence Length, Vocabulary Size)`. 接着初始化了一个真实标签张量 `targets`. 在计算损失前, 我们需要对维度进行调整, 以符合 PyTorch `CrossEntropyLoss` 的输入要求.

### Python Code

```python
import torch
import torch.nn as nn

# 设置随机种子以保证结果可复现
torch.manual_seed(42)

# --- 参数定义 ---
BATCH_SIZE = 2      # 批次大小
SEQ_LENGTH = 3      # 序列长度 (即每个样本预测3个token)
VOCAB_SIZE = 5      # 词表大小 (总共有5个不同的词)

# --- 1. 模拟模型输出 (Logits) ---
# 形状: (Batch Size, Sequence Length, Vocab Size)
# 这里的数值是未经过Softmax归一化的原始分数
llm_output_logits = torch.randn(BATCH_SIZE, SEQ_LENGTH, VOCAB_SIZE)

print(f"模型输出 Logits 形状: {llm_output_logits.shape}")
print("模型输出 Logits (部分):\n", llm_output_logits)

# --- 2. 模拟真实标签 (Targets) ---
# 形状: (Batch Size, Sequence Length)
# 这里的数值是词表中正确单词的索引 (0 到 VOCAB_SIZE-1)
ground_truth_indices = torch.randint(0, VOCAB_SIZE, (BATCH_SIZE, SEQ_LENGTH))

print(f"\n真实标签形状: {ground_truth_indices.shape}")
print("真实标签 (Indices):\n", ground_truth_indices)

# --- 3. 数据预处理 (维度调整) ---
# PyTorch 的 CrossEntropyLoss 期望输入为 (N, C) 或 (N, C, ...)
# 对于序列数据, 通常有两种处理方式:
# 方式 A: 将 Batch 和 Sequence 维度合并 -> (N, C) 其中 N = Batch * Seq
# 方式 B: 将 Class 维度移到第二维 -> (Batch, Class, Sequence)

# 这里使用方式 A (最常用的 LLM 处理方式)
# 将预测值展平: (Batch * Seq, Vocab)
flat_logits = llm_output_logits.view(-1, VOCAB_SIZE)

# 将标签展平: (Batch * Seq)
flat_targets = ground_truth_indices.view(-1)

print(f"\n展平后的 Logits 形状: {flat_logits.shape}")
print(f"展平后的 Targets 形状: {flat_targets.shape}")

# --- 4. 定义和计算损失 ---
criterion = nn.CrossEntropyLoss()

loss = criterion(flat_logits, flat_targets)

print(f"\n计算得到的 Cross Entropy Loss: {loss.item():.4f}")

# --- 验证计算 (手动推导第一个样本的损失) ---
# 取出第一个 token 的 logit 和 target
sample_logit = flat_logits[0]
sample_target = flat_targets[0]

# 1. Softmax
probs = torch.softmax(sample_logit, dim=0)
# 2. 取出对应 target 的概率
target_prob = probs[sample_target]
# 3. 求 -log
manual_loss = -torch.log(target_prob)

print(f"\n手动验证第一个 Token 的损失: {manual_loss.item():.4f}")
```

### Execution Output Explanation

运行上述代码后, 你将看到类似以下的输出流:

```
模型输出 Logits 形状: torch.Size([2, 3, 5])
模型输出 Logits (部分):
 tensor([[[ 1.9269,  1.4873,  0.9007, -2.1055,  0.6784],
         [-1.2345, -0.0431, -1.6047, -0.7521,  1.6487],
         [-0.3925, -1.4036, -0.7279, -0.5594, -2.3169]],

        [[-0.2168, -1.3847, -0.8712, -0.2234,  1.7174],
         [ 0.3189, -0.4245, -0.8286,  0.3309, -1.5576],
         [ 0.9956, -0.8798, -0.6011, -1.2742,  2.1228]]])

真实标签形状: torch.Size([2, 3])
真实标签 (Indices):
 tensor([[3, 4, 3],
        [2, 0, 4]])

展平后的 Logits 形状: torch.Size([6, 5])
展平后的 Targets 形状: torch.Size([6])

计算得到的 Cross Entropy Loss: 1.8124

手动验证第一个 Token 的损失: 4.8685
```

首先是模型的输出 `logits`, 这是一个包含随机实数的张量. 然后是 `targets`, 包含了随机生成的 $0$ 到 $4$ 之间的整数.

关键在于 展平后的 Logits 形状 变成了 `(6, 5)`, 这意味着我们将 $2 \times 3$ 个预测任务合并在了一起处理. 对应的标签形状变成了 `(6)`.

最后的 `Cross Entropy Loss` 是这 6 个独立预测任务损失的平均值. 只要预测的 Logits 中对应 Target 索引位置的数值越大 (相对其他类别), 最终计算出的 Loss 就会越小.