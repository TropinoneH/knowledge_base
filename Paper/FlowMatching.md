---
type: paper
tags:
  - algorithm
  - math
  - Diffusion
  - code/python
  - DeepLearning
  - ComputerVision
publish: NeurIPS 2024
pdf: "[[Paper/PDF/2210.02747v2.pdf]]"
rate: 🌟🌟🌟🌟
done: false
---
> [!note]- paper
![[Paper/PDF/2210.02747v2.pdf]]

> [!tip] 快速理解
> 按照物理的运动学理解加噪去噪的过程.
> 
> 假设原始的状态是$x_1$, 加噪之后完全噪声为$x_0$. 假设加噪的过程是一个直线运动的过程: $x_t=a(t)x_0+b(t)x_1$, 则在加噪过程中的速度为$v_t=\frac{d x_t}{dt}=a'(t)x_0+b'(t)x_1$.
> 
> 如果已知完全噪声$x_0$, 同时知道每时每刻的速度$v_t$, 那么可以通过物理学的运动方程反向推算$x_1$. 此为去噪过程. 但是注意, 这个去噪过程是一个非直线的过程.
> 
> 为了取求速度$v_t$, 使用[[Deep Learning#Neural Network Basics|神经网络]]去拟合$v_t$, 使用MSE loss进行监督: $\|u_t-v_t\|_2^2$. 如此可以得到最终的结果.
> 
> 小问题:
> 1. 这里使用的是从$x_0\rightarrow x_1$的过程, 能否代表分布$p_0\rightarrow p_1$的过程?
>    
>    **回答**: 可以. 最终证明使用连续性方程进行证明, 可以从点到点的去噪拓展到分布到分布的过程
>    
> 2. 这里的$v_t$实际上是基于$x_1$的过程, 需要写成$v_t(x_t|x_1)$, 也就是说需要已知起点和终点才能计算速度. 在推理的时候无法得知终点$x_1$, 还能这么用吗?
>    
>    **回答**: 可以. 仍然是根据连续性方程和loss的公式, 最终数学形式上证明loss没有问题.

基于Conditional Normalizing Flows进行改进.

这个仍然属于[[Diffusion]]模型中的一种, 加噪和去噪的过程.

> [!PDF|] [[2210.02747v2.pdf#page=2&selection=34,0,43,4|2210.02747v2, p.2]]
> > PRELIMINARIES: CONTINUOUS NORMALIZING FLOWS
> 
> 连续归一化流
> 
> 注意此处的CNF并不是最终FM的形式. 这个只是CNF的表达
> 
> - 此处的 "流" 指的是加噪的过程: $\phi_t(x)=a(t)x_0+b(t)x_1$
> - 速度$v$即为加噪的速度, 将噪声减去加噪的速度来达成去噪的效果. 速度即为flow的微分:
>   $$\frac{d}{dt}\phi_t(x)=v_t(\phi_t(x))$$
> - 概率路径$p_t,p_0$: 表示最终的一个分布. 其中$p_0$可以认为是一个加噪的终点(去噪的起点), 可以是一个简单的高斯噪声: $p_0(x)=\mathcal N\left(x|\mu(x_0),\sigma(x_0)^2I\right)$
> 
> 使用CNF的去噪可以表示为:
> $$p_t=[\phi_t]*p_0$$
> 定义push-forward算子$*$:
> $$[\phi_t]*p_0(x)=p_0(\phi_t^{-1}(x))\det\begin{bmatrix}\frac{\partial\phi_t^{-1}}{\partial x}(x)\end{bmatrix}$$

> [!PDF|] [[2210.02747v2.pdf#page=2&selection=344,0,366,7|2210.02747v2, p.2]]
> > Let $x_1$ denote a random variable distributed according to some unknown data distribution $q(x_1)$. We assume we only have access to data samples from $q(x_1)$ but have no access to the density function itself.
> 
> 假设ground truth的数据分布为$q(x_1)$. 我们无法得知$q$分布的真实数学公式, 只能从这个分布中进行采样, 得到原始的数据$x_1$.

> [!PDF|] [[2210.02747v2.pdf#page=2&selection=407,54,417,1|2210.02747v2, p.2]]
> > The Flow Matching objective is then designed to match this target probability path, which will allow us to flow from $p_0$ to $p_1$.
> 
> 假设一个非常简单的分布, 如高斯分布, 作为最初的噪声分布: $p_0=\mathcal N(x|0,I)$, 那么Flow Matching的目的为, 尝试通过找到一个flow, 将$p_0$转换为$p_1$分布, 让$p_1$分布尽可能和$q(x_1)$分布尽可能相似. 这样就能使用flow从一个简单的高斯噪声分布转换成我们的目标概率密度分布.

> [!PDF|] [[2210.02747v2.pdf#page=3&selection=23,15,23,43|2210.02747v2, p.3]]
> > Flow Matching (FM) objective
> 
> 在训练的过程中, Flow Matching并不需要直接使用各种散度(如, KL散度, JS散度等)去对两个分布之间进行loss计算. Flow Matching仍然针对速度进行loss建模, 只需要保证速度尽可能精确, 那么最终的分布一定是接近的.
> 
> 于是最终的loss为:
> $$\mathcal L_{FM}(\theta)=\mathbb E_{t,p_t(x)}\|v_t(x)-u_t(x)\|^2$$
> 其中$u_t(x)$是神经网络学习到的速度, $v_t$是真实的速度.

> [!PDF|] [[2210.02747v2.pdf#page=3&selection=105,18,106,8|2210.02747v2, p.3]]
> > it is intractable to use in practice
> 
> 但是实际上, 由于在真实环境中没有一个合适的先验知识去给定$p_t$和$u_t$, 此时有无数多种概率路径令$p_1(x)=q(x)$.
> 
> 同时, 由于无法获取速度$u_t(x)$的闭式解, 这个loss function无法在真实环境中使用

> [!PDF|] [[2210.02747v2.pdf#page=3&selection=179,2,179,12|2210.02747v2, p.3]]
> > simple way 
> 
> 考虑更简单的情况: 采样一个点$x_1\sim q(x_1),x_0\sim\mathcal N(x|0,I)$, 先只考虑从噪声的一个点到原始分布的一个点的去噪过程.
> 
> 那么给定原始分布的一个采样$x_1$, 使用$p_t(x|x_1)$表示在$x_1$作为条件下的概率分布. 在时间步$t=0$时有噪声$p_0(x|x_1)=p(x)$, 最终的去噪结果被设计为$p_1(x|x_1)=\mathcal N(x|x_1,\sigma^2I)$(一个均值为$x_1$且标准差$\sigma>0$足够小的正态分布, 至于为什么这么设计, 可以看下面的marginal probability的计算)
> 
> 计算边缘概率分布:
> $$p_t(x)=\int p_t(x|x_1)q(x_q)dx_1$$
> 
> 当时间步$t=1$的时候, 计算结果为:
> $$p_1(x)=\int\mathcal N(x|x_1,\sigma^2I)q(x_1)dx_1\approx q(x)$$
> 是原始的概率分布
> 
> 相似的, 可以使用条件概率去定义速度:
> $$u_t(x)=\int u_t(x|x_1)\frac{p_t(x|x_1)q(x_1)}{p_t(x)}dx_1$$
> 其中$u_t(x|x_1)$用于生成$p_t(x|x_1)$

> [!PDF|]- [[2210.02747v2.pdf#page=14&selection=10,0,11,1|连续性方程的证明]]
> > [[2210.02747v2.pdf#page=3&selection=533,53,533,63|2210.02747v2, p.3]]
> 
> 证明了$u_t$和$p_t$满足连续性方程, 因此可以使用条件概率分布去生成flow

> [!PDF|] [[2210.02747v2.pdf#page=4&selection=17,20,19,76|2210.02747v2, p.4]]
> > intractable to naively compute an unbiased estimator of the original Flow Matching objective.
> 
> 但是使用这个边缘概率路径仍然无法计算loss, 因为积分在此处是无法计算的(因为路径太多).

> [!PDF|] [[2210.02747v2.pdf#page=4&selection=23,0,25,15|2210.02747v2, p.4]]
> > Conditional Flow Matching (CFM) objective
> 
> 因此, 提出了Conditional Flow Matching的目标loss:
> $$\mathcal L_{CFM}(\theta)=\mathbb E_{t,q(x_1),p(x|x_1)}\|v_t(x)-u_t(x|x_1)\|^2$$
> 
> 使用conditional的速度来代替marginal的速度.
> 
> 依照[[2210.02747v2.pdf#page=4&selection=159,0,159,9|定理2]], 优化CFM(Conditional Flow Matching)在期望上等同于优化FM(Flow Matching)

由于最终的分布和初始的分布都是高斯分布, 因此讨论中介的条件概率密度为一般高斯分布的过程:

> [!PDF|] [[2210.02747v2.pdf#page=4&selection=269,0,270,29|2210.02747v2, p.4]]
> > Namely, we consider conditional probability paths of the form
> 
> $$p_t(x|x_1)=\mathcal N(x|\mu_t(x_1),\sigma_t(x_1)^2I$$
> 其中$\mu_t$和$\sigma_t$都是与时间相关的函数.
> 
> 当t=0的时候, 令$\mu_0(x_1)=0,\sigma_0(x_1)=1$, 成为一个标准的正态分布; 当t=1的时候, 令$\mu_1(x_1)=x_1,\sigma_1(x_1)=\sigma_{\text{min}}$



