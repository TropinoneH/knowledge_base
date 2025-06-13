---
tags:
  - paper
  - LLM
  - EmbodiedAI
  - DL
  - VLA
  - RL
aliases:
  - "ConRFT: A Reinforced Fine-tuning Method for VLA Models via Consistency Policy"
publish: RSS 2025
---
# ConRFT

> [!paper]-
> ![[2502.05450v2_ConRFT.pdf]]

在fine-tuning一个VLM使其执行robotic manipulation的时候, 可能会由于 有限且不一致 的demonstrations(特别是在contact-rich的环境中), 导致无法得到robust performance

问题:
1. 在fine-tuning中严重依赖于数据集的质量与数量
2. VLA需要有安全性和成本限制

提出reinforced fine-tuning:
1. offline阶段, 使用监督学习([[BehaviorClone]])+[[09-RL#Q-Learning|Q-learning]]结合
2. online阶段, 通过[[ConsistencyPolicy|consistency policy]]的方式进行[[09-RL|RL]]训练

## Problem Setup and Preliminaries

定义:
1. $\pi_{\phi_{\text{pre}}}$ 是pretrained VLA model, 可以编码visual input(如, RGB image)以及language instructions
2. $\tau=(s_0,a_0,\cdots,s_H)$: 是任务的trajectory
3. $\mathcal L$: negative log-likelihood 或者Mean-Squared Error

在SFT(Supervise Fine-Tuning)任务中, 目的是用一个小的labeled demonstrations集合作为训练数据.

VLA目的是$\min_\phi\mathcal L(\tau,\phi)$, 即最小化loss(NLL或者MSE)

定义[[08-MDP|MDP]]: $\mathcal M=(S,A,P,r,\rho,\gamma)$

其中$s\in S$是state, $a\in A$是action. 定义$P(s'|s,a)$是environment transition probability. $\rho(s)$是初始状态分布. $r(s,a)$是reward, 使用$\gamma$作为discount factor. $\pi$作为policy, 需要maximize reward

## Method

![[Pasted image 20250611014056.png]]

### Stage 1: Offline Fine-tuning with Cal-ConRFT

pretrained VLA对zero-shot的novel robotic configurations缺乏泛化性, 因此在online之前, 使用小数据集的demonstrations(20-30 trajectory)

> [!tip]- Cal-QL (最开始的方法)
> 为了让Q-function对 out-of-distribution(OOD) 的action也能robust, 使用calibrated [[09-RL#Q-Learning|Q-Learning]](Cal-QL)进行训练(通过[[09-RL#TD Learning|TD Learning]]加上一个正则化项)
> 
> 正则化项惩罚超过在OOD的action上Q-value超过reference $V^\mu(s)$的情况
> 
> loss:
> $$\mathcal L_Q^{\text{offline}}=\alpha(\mathbb E_{s\sim D,a\sim\pi(a|s)}[\max(Q_\theta(s,a),V^\mu(s))]-\mathbb E_{s,a\sim D}[Q_\theta(s,a)])+\frac{1}{2}\mathbb E_{(s,a,s')\sim D}[(Q_\theta(s,a)-\mathcal B^\pi\bar Q_{\bar\theta}(s,a))^2]$$
> 其中:
> - $Q_\theta$是使用$\theta$作为参数的Q-function
> - $\bar Q_{\bar\theta}$是delayed target Q-function parameterized by $\bar\theta$
> - $\mathcal B^\pi\bar Q(s,a)=r(s,a)+\gamma\mathbb E_{a'\sim\pi(a'|s')}[\bar Q(s',a')]$是Bellman backup operator
> - $D$是数据集或者叫replay buffer, 收集所有的demonstration
> - $\alpha$是控制conservative(保守性)的惩罚
> 
> 但是Cal-RL是由small dataset(20-30 demonstrations)进行训练的, 因此policy可能难以泛化到从未见过的state.

为了解决这个问题, 引入[[BehaviorClone]] loss(BC loss)来让model模仿演示中的行为, 提供了额外的supervisory signals(监督信号)

将BC loss和Cal-QL结合在consistency-based objective中, 提出了Cal-ConRFT的方法. 这个方法使用consistency policy作为action head来fine-tuning VLA, 解决两个主要的问题:
1. pre-collected dataset中的inconsistency和sub-optimal的演示示例
2. 与[[Diffusion]] policy相比, 这个方法更加轻量级

对于diffusion horizon(diffusion的时间范围) $[\varepsilon, K]$, 将其离散化为$M$个子区间, 其边界为$k_1=\varepsilon\leq k_2\leq\cdots\leq k_m=K$. 这种情况下的consistency policy为:
$$\pi_\psi(a|s)=f_\psi(a^k,k|E_\phi(s))$$
其中:
- $f_\psi$是$\psi$参数化的consistency policy model, 从$k$步噪声生成action
- $k$: diffusion noise step
- $a^k\sim\mathcal N(0,kI)$: 经过$k$步加噪声之后的action
- $E_\phi(s)$: encoded state, 由$\phi$参数化的pretrained VLA生成

那么consistency-based objective为:
$$\mathcal L_\pi^{\text{offline}}(\psi)=\beta\mathcal L_\pi^{\text{BC}}+\eta\mathcal L_\pi^{\text{Q}}$$
其中:
- $\mathcal L_\pi^{\text{BC}}=\mathbb E_{(s,a)\sim D,m\sim\mathcal U[1,M-1]}[d(f_\psi(a+k_mz,k_z|E(s)),a)]$
	- $z\sim\mathcal N(0,I)$
	- $d(x,y)=\|x-y\|_2$ 表示欧几里得距离
- $\mathcal L_\pi^{\text{Q}}=-\mathbb E_{s\sim D,a\sim\pi_\psi(a|s)}[Q(s,a)]$
- $\beta,\eta$: 超参数

### Stage 2: Online Fine-tuning with HIL-ConRFT

offline stage提供了初始化的policy, 但是由于其从small dataset中学习, 因此可能有limited performance

提出HIL-ConRFT, 通过与真实世界互动, 使用consistency policy来fine-tuning VLA

训练过程中, offline的数据集$D$仍然保存, 同时使用replay buffer $R$来保存online数据, 使用symmetric sampling对每一个batch采样(每一个batch在$R$和$D$中等量采样), 目的是减少offline的distribution-shift问题

因此直接的loss为:
$$\mathcal L_Q^{\text{online}}(\theta)=\mathbb E_{(s,a,s')\sim(D\cup R)}[(Q_\theta(s,a)-\mathcal B^\pi\bar Q(s,a))^2]$$
使用consistency policy的loss为:
$$\mathcal L_\pi^{\text{online}}(\psi)=\beta\mathcal L_\pi^{\text{BC}}+\eta\mathcal L_\pi^{\text{Q}}$$
其中:
- $\mathcal L_\pi^{\text{BC}}=\mathbb E_{(s,a)\sim(D\cup R),m\sim\mathcal U[1,M-1]}[d(f_\psi(a+k_mz,k_m|E(s)),a)]$
- $\mathcal L_\pi^{\text{Q}}=-\mathbb E_{s\sim(D\cup R)}[Q(s,a)]$

注意到这个和stage 1的consistency policy loss非常接近, 这可以快速的进行训练(代码修改少)

在online阶段, 降低$\beta$增加$\eta$:
1. 确保policy能够不遗忘演示数据(continues to align with demonstration data)
2. 降低BC loss以防止突然崩溃, 导致安全问题
