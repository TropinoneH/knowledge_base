---
type: skills
tags:
  - algorithm
  - math
  - MachineLearning
  - DeepLearning
  - code/python
done: true
topic:
  - "[[Coding]]"
  - "[[PyTorch]]"
---
# Root Mean Square

均方根 (Root Mean Square, 简称 RMS) 是一种统计测量方法, 用于确定一组数值或一个连续变化量的有效大小. 正如其名称所示, 它是对数值先进行平方 (Square), 然后求平均 (Mean), 最后开方 (Root) 所得的结果.

在许多科学和工程领域, 数据的算术平均值往往不足以描述系统的能量或实际强度. 特别是对于那些在正负之间波动的数值 (如正弦波), 其算术平均值可能接近于零或等于零. RMS 通过将所有数值平方, 消除了符号的影响, 从而能够准确反映出波动信号的平均功率或有效值.

## Mathematical Formulas

RMS 的计算公式根据数据是离散序列还是连续函数而有所不同.

### Discrete Data

对于一组包含 $n$ 个数值的离散数据序列 $x = \{x_1, x_2, \dots, x_n\}$, 其均方根值的计算公式如下.

$$
x_{\text{RMS}} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} x_i^2}
$$

在这个公式中, $x_i$ 代表数据中的每一个具体数值, $n$ 是数据的总个数. 每一个数值首先被平方, 然后所有平方后的值相加并除以 $n$ 得到均方值, 最后对均方值开算术平方根.

### Continuous Function

对于在区间 $[t_1, t_2]$ 上定义的连续函数 $f(t)$, 其均方根值的定义涉及积分运算.

$$
f_{\text{RMS}} = \sqrt{\frac{1}{t_2 - t_1} \int_{t_1}^{t_2} [f(t)]^2 \, dt}
$$

这里, $f(t)$ 代表随时间或其他变量变化的函数, $t_2 - t_1$ 代表积分区间的长度 (周期). 对于周期性函数 (例如正弦波), 通常在一个完整的周期 $T$ 上进行积分计算.

## Usage Scenarios

RMS 是一个应用极广的概念, 主要用于需要衡量波动量大小, 能量或误差的场景.

### Electrical Engineering

在电力工程与电子学中, RMS 是最常用的度量标准, 尤其是在处理交流电 (AC) 时. 交流电的电压和电流是随时间不断变化的, 且正负交替. 如果计算简单的平均值, 结果通常为零.

此时 RMS 被用来表示交流电的 有效值 (Effective Value). 这个有效值的物理意义在于: 当一个交流电流流过电阻时, 它所产生的热效应 (能量) 与一个数值等于该 RMS 值的直流电流 (DC) 所产生的热效应是相同的.

例如, 我们常说的家用电压 220V 或 110V, 指的并不是电压的峰值, 而是电压的 RMS 值. 对于标准的正弦波交流电, 其 RMS 值与峰值 $V_{peak}$ 的关系为:

$$
V_{\text{RMS}} = \frac{V_{\text{peak}}}{\sqrt{2}} \approx 0.707 V_{\text{peak}}
$$

这意味着 220V 的家用交流电, 其电压峰值实际上约为 311V.

### Statistics and Machine Learning

在统计学和机器学习领域, RMS 概念的变体 均方根误差 (Root Mean Square Error, RMSE) 是衡量模型预测质量的核心指标.

当我们需要评估一个预测模型 (如线性回归) 的表现时, 我们关注的是预测值与真实观测值之间的偏差. 由于偏差有正有负, 直接相加会互相抵消. 通过计算预测误差的 RMS 值, 我们可以得到一个能够反映总体误差幅度的非负数值. RMSE 对较大的误差非常敏感 (因为误差被平方了), 因此它常用于希望特别惩罚较大预测错误的场景.

### Acoustics and Signal Processing

在声学中, 声音信号也是一种随时间变化的压力波. 为了衡量声音的响度或功率, 工程师通常计算音频信号的 RMS 值. 它可以代表音频信号的平均能量水平. 与仅反映瞬间最高电平的峰值不同, RMS 电平更能反映人耳对响度的实际感知, 因为人耳对声音的感受更接近于一种平均能量的积分效果.

# RMSNorm in Deep Learning

均方根归一化 (Root Mean Square Normalization, 简称 RMSNorm) 是一种专门用于[[Deep Learning#Neural Network Basics|深度神经网络]], 尤其是 [[1706.03762]] 架构中的归一化技术. RMSNorm 是广为人知的层归一化 (Layer Normalization, LayerNorm) 的一种变体.

与 LayerNorm 相比, RMSNorm 的核心理念在于简化计算过程. LayerNorm 的成功在很大程度上归功于其缩放不变性 (Rescaling Invariance), 而平移不变性 (Re-centering Invariance) 并不总是必须的. 因此, RMSNorm 舍弃了计算均值和平移 (Subtracting Mean) 的步骤, 仅保留了基于均方根的缩放操作. 这种简化使得 RMSNorm 在保持模型性能的同时, 显著减少了计算开销.

## Mathematical Formulation

RMSNorm 的计算过程可以分为两步: 标准化和线性缩放.

假设一层的输入向量为 $x$, 该向量包含 $n$ 个元素, 即 $x = [x_1, x_2, \dots, x_n]$.

首先, 计算输入向量的均方根 (RMS). 这是通过计算所有元素平方和的平均值, 然后开平方得到的. 为了防止除以零的数值稳定性问题, 通常会在根号内加入一个极小的常数 $\epsilon$.

$$
\text{RMS}(x) = \sqrt{\frac{1}{n} \sum_{i=1}^{n} x_i^2 + \epsilon}
$$

接下来, 使用计算出的 RMS 值对输入向量进行归一化, 并乘以一个可学习的缩放参数 $g$ (Gain). 与 LayerNorm 不同, RMSNorm 通常不需要可学习的偏置参数 (Bias). 输出向量 $\bar{x}$ 中的每一个元素 $\bar{x}_i$ 计算如下.

$$
\bar{x}_i = \frac{x_i}{\text{RMS}(x)} \cdot g_i
$$

在向量形式下, 整个操作可以表示为:

$$
\bar{x} = \frac{x}{\text{RMS}(x)} \odot g
$$

其中 $\odot$ 表示逐元素相乘.

## Python Implementation

以下是使用 PyTorch 框架实现 RMSNorm 的代码示例.

```python
import torch
import torch.nn as nn

class RMSNorm(nn.Module):
    def __init__(self, d_model: int, eps: float = 1e-6):
        """
        初始化 RMSNorm 层.
        
        Args:
            d_model (int): 输入特征的维度.
            eps (float): 防止除零的微小常数.
        """
        super().__init__()
        self.eps = eps
        # 定义可学习的缩放参数 gamma (即公式中的 g)
        self.weight = nn.Parameter(torch.ones(d_model))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        前向传播计算.
        
        Args:
            x (torch.Tensor): 输入张量, 形状通常为 (batch_size, seq_len, d_model).
            
        Returns:
            torch.Tensor: 归一化后的张量.
        """
        # 计算 RMS. 注意要在最后一个维度 (dim=-1) 上计算
        # x.pow(2) -> 平方
        # .mean(-1, keepdim=True) -> 求均值, 保持维度以便广播
        # torch.rsqrt -> 计算平方根的倒数
        output = x * torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + self.eps)
        
        # 乘以可学习的参数
        return output * self.weight

# 使用示例
if __name__ == "__main__":
    batch_size, seq_len, d_model = 2, 10, 512
    input_tensor = torch.randn(batch_size, seq_len, d_model)
    
    rms_norm = RMSNorm(d_model)
    output_tensor = rms_norm(input_tensor)
    
    print(f"Input shape: {input_tensor.shape}")
    print(f"Output shape: {output_tensor.shape}")
```

## Advantages

RMSNorm 的主要优势在于计算效率.

在深度学习模型中, LayerNorm 需要同时计算均值 (Mean) 和方差 (Variance). 均值的计算涉及到对输入向量所有元素的求和与除法, 随后还需要在计算方差前将每个元素减去该均值. RMSNorm 省略了这一步平移操作 (Re-centering), 直接计算均方根. 在大规模模型和长序列处理中, 这种计算量的减少能够转化为显著的训练和推理速度提升. 实验表明, 在某些 [[1706.03762]] 模型中, 使用 RMSNorm 可以带来 10% 到 40% 的速度提升.

此外, RMSNorm 常常表现出更好的数值稳定性. 简化的公式减少了浮点运算的累积误差, 且其对权重的缩放不变性有助于梯度的稳定传播, 从而在某些情况下使得模型收敛得更加平稳.

## Disadvantages

RMSNorm 的潜在缺点在于其假设前提.

它假设输入的均值并不重要, 或者说通过去除均值 (Re-centering) 带来的收益微乎其微. 在绝大多数现代深度神经网络, 特别是使用 ReLU 或 GeLU 等激活函数的网络中, 这一假设通常成立. 然而, 如果在某些特定的网络结构或数据分布中, 输入数据的均值偏移包含了关键信息, 那么强制忽略均值的 RMSNorm 可能会导致表达能力的轻微下降. 不过在大型语言模型的实践中, 这种情况很少成为瓶颈.
