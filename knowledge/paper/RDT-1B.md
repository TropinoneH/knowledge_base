---
tags:
  - paper
  - EmbodiedAI
  - diffusion
aliases:
  - "RDT-1B: A Diffusion Foundation Model For Bimanual Manipulation"
---
[[RDT-1B：A DIFFUSION FOUNDATION MODEL FOR BIMANUAL MANIPULATION.pdf]]
# RDT-1B

针对双手的操作, 提出Robotics [[Diffusion]] [[Transformer]] model.

基于Diffusion模型表示多模态, 通过Transformer模型来处理多模态输入的"heterogeneity"(不同的robot有不同的input格式, 不同的action space)并捕捉robotic data的non-linear,high-frequent的特性. 引入Physically Interpretable Unified Action Space, 解决数据缺少的问题.

## Introduce

对[[DiT]]框架进行修改

使用Physically Interpretable Unified Action Space, 适用于各种gripper arm的机器人的统一的运动格式, 扩大了数据集

## Related Work

双手操作的操作空间的维度会比单臂机器人的更高

VLA由于数据空间的离散化, 对于双手的任务, 会产生误差和不协调

## Problem formulation and challenges

使用: 两个gripper和三个摄像头

$\mathbf o_t:=(\mathbf X_{t-T_{img}+1:t+1},\mathbf z_t,c)$, 其中$\mathbf X_{t-T_{img}+1:t+1}=(\mathbf X_{t-T_{img}+1},\cdots,\mathbf X_t)$是大小为$T_{img}$的RGB观测历史, $\mathbf z_t$是机器人的low-dimensional感知, $c$是控制频率. $\mathbf a_t$通常是$z_{t+1}$的一个子集 ==Have Question Here==

由于双手数据集少, 所以使用pretrain and fine-tune的方式进行训练. 在单手+双手的数据集$\mathcal D_\text{pre}$上进行pretrain, 然后在target robot的数据集$\mathcal D_\text{ft}$上进行fine-tune.

数据集包含$D_i=\{(l^{(i)},\mathbf o_t^{(i)},\mathbf a_t^{(i)})|0\leq t\leq T^{(i)},1\leq i\leq N\}$, $T^{(i)}$是第$i$条数据的长度, $N$是总共有多少条数据

**Challenges**
- 有足够的泛化能力, 有足够的表达能力
- 在heterogeneous data中进行训练

## Robotics Diffusion Transformer

### Diffusion

由于多模态性, 给定instruction $l$和观测$\mathbf o_t$, 可能存在很多的动作$\mathbf a_t$来推进任务. 防止采样一个平均值导致invalid action, 选择使用continuous conditional distribution: $p(\mathbf a_t|\mathbf o_t,l)$. 有很好的质量和表达能力, 但是计算资源消耗大. 但是$\mathbf a_t$的维度远小于图像, 因此可以接受

过程:
1. 采样一个完全噪声的动作$\mathbf a_t^K\sim\mathcal N(\mathbf 0,\mathbf I)$, 然后执行$k$步denoise
2. 去噪:
   $$\mathbf a^{k-1}_t=\frac{\sqrt{\bar\alpha^{k-1}}\beta^{k}}{1-\bar\alpha^k}\mathbf a_t^0+\frac{\sqrt{\alpha^k}(1-\bar\alpha^{k-1})}{1-\bar\alpha^k}\mathbf a_t^k+\sigma^k\mathbf z$$
   其中$\{\alpha^k\}^K_{k=1}$和$\{\sigma^k\}_{k=1}^K$是[scalar coeffcients pre-defined by a noise schedule](https://arxiv.org/abs/2102.09672).
   - 如果$>=1$, $\beta^k=1-\alpha^k$, $\bar\alpha^{k-1}=\prod_{i=1}^{k-1}\alpha^i$, $\mathbf z\sim\mathcal N(\mathbf0,\mathbf I)$.
   - 否则$\bar\alpha^{k-1}=1$, $\mathbf z=0$.
但是, $\mathbf a_t^0$在denoise结束之前是无法获取的, 因此选择使用一个含有参数$\theta$的learnable denoising network $f_\theta$ 从noise data中估计$\mathbf a_t^0=f_\theta(l,\mathbf o^t,\mathbf a_t^k,k)$, 并与真实的$\mathbf a_t$做MSE loss:
$$\mathcal L(\theta)=\text{MSE}(\mathbf a_t,f_\theta(l,\mathbf o_t,\sqrt{\bar\alpha^k}\mathbf a_t^k+\sqrt{1-\bar\alpha^k}\epsilon,k))$$
其中$k\sim\textbf{Uniform}(1,\cdots,K)$, $\epsilon\sim\mathcal N(\mathbf 0,\mathbf I)$. 我们将噪声输入表示为
$$\widetilde{\mathbf a}_t^k=\sqrt{\bar\alpha^k}\mathbf a_t^k+\sqrt{1-\bar\alpha^k}\epsilon$$

在实践中, 我们更倾向于一次性predict一系列的action(动作块, action chunk), 以鼓励时间一致性(time consistency), 并减少决策次数以减小累积误差: $p(\mathbf a_{t:t+T_a}|l,\mathbf o_t)$

### Encoding of Heterogeneous Multimodal Inputs

- 低维输入:
	- robot自己传感器的输入(proprioception, action chunk, control frequency)
	- 使用带有傅里叶特征的MLP进行编码, 捕捉高频特征
- 图像输入:
	- 高维输入, 包含丰富的信息.
	- 使用SigLIP进行提取embedding vector
- 文字输入:
	- 长度可变, 高度抽象
	- 使用pretrained T5 LLM去提取embedding vector

### $f_\theta$的网络架构

**Norm**:
- 计算cross-attention的时候, 使用QKNorm避免数值不稳定性
- 使用RMSNorm替换LayerNorm, 避免token偏移和attention偏移
**MLP Decoder**:
- 将linear decoder替换成non-linear的MLP Decoder, 因为robot action本身就是non-linear的
**ACI(Alternative condition injection)**(交替条件注入):
- 因为image的维度比text高太多, 因此如果同时在cross-attention中计算, 会导致image的信息掩盖text的信息
- 因此在进行计算cross-attention的时候, 交替进行计算: 一层计算image信息, 下一层计算text信息
### Data

因为有了Physically Interpretable Unified Action Space, 可以heterogeneous multi-robots的数据上进行训练.

该空间设计为:
- 使用一个单一的空间储存$\mathbf z_t$本体感知和$\mathbf a_t$动作. 这是因为$\mathbf a_t$通常是desired $\mathbf z_{t+1}$的一个子集.
- 设计一个统一的空间, 涵盖了大多数有gripper arm的机器人的主要物理量. 根据物理意义, 将每个robot原始的物理量 填到这个空间的vector的对应位置, 其他位置用padding填充, 从而统一到一个空间中.

