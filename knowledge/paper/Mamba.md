---
tags:
  - paper
  - DL
  - Vision
aliases:
  - "Mamba: Linear-Time Sequence Modeling with Selective State Spaces"
publish: COLM 2024
---
# Mamba

> [!paper]-
> ![[2312.00752v2_Mamba.pdf]]

受到[[Transformer]]选择性关注的影响, 对[[SSM]]的改进.

Motivate: SSM无法根据输入的信息选择性的处理信息(state)

但是会破坏[[SSM#优点|并行计算]]的优点, 因此提出了一个新的方法: Parallel Scan算法, 能够比串行计算更快
## Methods
![[Pasted image 20250705175213.png]]
### Selective SSM

首先计算步长$\Delta_t$
1. 将input $x_t$映射到一个很小的维度, 得到$x_{\Delta}=W_{\Delta}\cdot x_t+b_{\Delta}$
2. 将低维的$x_{\Delta}$使用broadcast拓展到原始input的维度: $s_{\Delta}=\text{Broadcast}(x_{\Delta})$. 一个简单的方法是直接复制. 也可以使用线性变换的方式.
3. 计算步长$\Delta_t=\text{softplus}(\text{Param}_{\Delta}+s_{\Delta})$, 其中`softplus`指的是$\text{softplus}(x)=\log(1+e^x)$, $Param_{\Delta}$是一个可学习的参数

然后, 根据步长计算得到输出:
1. 根据输入$x_t$得到hidden state: $B_t=W_B\cdot x_t+b_B$
2. 计算输出层 $C_t=W_C\cdot x_t+b_C$

这里的$\Delta_t$只是一个gate的开关, 在公式的哪个位置使用这个开关是Model相关的内容, 和Selection部分没有关系