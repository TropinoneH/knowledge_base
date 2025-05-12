---
tags:
  - algorithm
  - paper
  - RL
  - EmbodiedAI
  - LLM
  - VLA
  - DL
aliases:
  - "GRAPE: Generalizing Robot Policy via Preference Alignment"
---
# GRAPE

> [!paper]-
> ![[2411.19309v2_GRAPE.pdf]]
## Introduce

解决问题:
- 泛化性差
- 行为崩溃
- 目标单一

使用 轨迹级别的偏好对齐(Trajectory-wised Preference Optimization, TPO) 和 隐式奖励建模, 从成功和失败的轨迹中学习, 提升泛化性, 并支持自定义目标(安全性, 效率)来调整策略

自动生成多阶段cost function, 避免人工标注preference的高成本

## Generalizing Robot Policy via Preference Alignment

轨迹对齐, 模仿dataset的轨迹:
$$\mathcal L_{\text{SFT}}=-\sum_{(\zeta,q)\in D}\sum_{t=1}^T\log p(a_t|o_t,q;\pi_\theta)$$
其中数据集$D=\{(\zeta_1,q_1),\cdots,(\zeta_n,q_n)\}$是expert dataset

### TPO

RL目标:
$$\text{max}_{\pi_\theta}\mathbb E_{\zeta\sim\pi_\theta}\left[r_\phi(\zeta)\right]-\beta D_{KL}\left[\pi_\theta(\zeta)\|\pi_{ref}(\zeta)\right]$$
$\pi_{ref}$是SFT之后的模型. 使用RL进行fine-tune, $r_\phi$是强化学习自身的reward

定义一个针对trajectory的reward $r$:
$$r(\zeta,q)=\beta\log\frac{\pi_\theta(\zeta|q)}{\pi_{ref}(\zeta|q)}+\beta\log Z(\zeta)$$
其中, $\pi(\zeta|q)=\prod_i\pi(a_i|(o_i,q))$是似然, $Z$是根据[Direct preference optimization: Your language model is secretly a reward modal](https://arxiv.org/abs/2408.00714)定义的分配函数. 将轨迹$\zeta$分解成action和observe, 有:
$$\log\frac{\pi_\theta(\zeta,q)}{\pi_{ref}(\zeta,q)}=\sum_{t=1}^T\log\frac{\pi_\theta(a_t|(o_t,q))}{\pi_{ref}(a_t|(o_t,q))}$$

使用Bardley-Terry model进行偏好选择:
$$P(\zeta_\omega\succ\zeta_\tau)=\frac{\exp(r(\zeta_\omega),q)}{\exp(r(\zeta_\omega),q)+\exp(r(\zeta_\tau),q)}$$
这个的意思是: 偏好轨迹$\zeta_\omega$的概率.

> [!question]
> 这个公式有点不能理解, 为什么$\exp(r(\zeta),q)$是打错了(应该是$\exp(r(\zeta,q))$)还是说这个$\exp$是一个特殊的函数?

对TPO进行优化, 有loss:
$$\mathcal L_{\text{TPO}}=-\mathbb E_{(\zeta_\omega,\zeta_\tau)\sim D}\left[\log\sigma\left(\beta\left(\log\frac{\pi_\theta(\zeta_\omega)}{\pi_{ref}(\zeta_\theta)}-\log\frac{\pi_\theta(\zeta_\tau)}{\pi_{ref}(\zeta_\tau)}\right)\right)\right]$$
该loss可以展开为action-wised log likelihood.

TPO优点:
1. 通过step-wise的human preference, 在trajectory-wise的层面对齐$\pi_\theta$
2. 使用梯度下降反向传播, 稳定policy, 引导向最终目标
3. 提高泛化能力

### Guided-Cost Preference Generation

对齐的过程中需要人工标注. 使用Guided-Cost Preference Generation(GCPG)可以自动整合

#### Multi-Stage Temporal Keypoint Constraints

使用基于VLM的阶段分解器, 将一个task分解成多个stage. 使用VLM生成每一个stage的起始和结束的关键帧, 然后分解成多个轨迹: $\zeta^1,\cdots,\zeta^S=\mathcal M_D(\zeta,q),\zeta^i=\{(o_t^i,a_t^i)\}_{t=1}^{T_i}$

> [!example]-
> 如, 将一个“抓取并放置物体”的任务可被分解为：
> 1. 接近目标物体
> 2. 抓取物体
> 3. 移动物体至目标位置
> 4. 释放物体

对于每个阶段$S_i$, 使用VLM(如, DINOv2)提取keypoint $\{k_{S_i}\}$, 然后使用LLM(如, GPT-4)生成cost function $C^{S_i}$.

因此定义external reward:
$$R_{\text{ext}}(\zeta)=\prod_{i=1}^{\mathbf S}\exp(-C^{S_i}(\{k_{S_i}\}))$$
- 使用指数函数: 映射到$[0,1]$
- 使用累乘: 如果某一个阶段失败了或者花费很高, 那么整个轨迹都会受到影响
#### Guided-Cost Preference Generation

$$R_{GCPG}=\lambda_1R_{self}(\zeta)+\lambda_2R_{ext}(\zeta)+\lambda_3I_{success}(\zeta)$$
其中:
$$R_{self}(\zeta)=\log\left(\prod_{i=1}^T\pi(a_i|o_i,q)\right)$$
$$I_{success}(\zeta)=\left\{\begin{matrix}1&\text{if }\zeta\text{ is successful}\\0&\text{otherwise}\end{matrix}\right.$$

使用self-evaluated score提高policy生成制定action的概率; 使用external reward使policy满足指定要求(由LLM根据要求生成cost function); 使用$I_{success}$提高成功率

### Iterative Preference Optimization

输入:
1. 基础的VLA policy $\pi_\theta$
2. 一系列的task instructions $Q=\{q_i\}$
3. [[#Multi-Stage Temporal Keypoint Constraints|阶段分解器]] $\mathcal M_D$
4. 最大迭代次数$K$
5. reward权重$\lambda_1,\lambda_2,\lambda_3$
6. stage-wise keypoints $\{K_{S_i}\}$
7. cost function $C^{S_i}_j$
8. thresholds $\{\tau_j^{S_i}\}$

迭代过程:
1. 使用policy $\pi_\theta$和$Q$ 采样轨迹 $D^k=\{\zeta_i\}_{i=1}^M$
2. 对于每一个轨迹, 分解成多个阶段
	1. 计算每个阶段的cost
	2. 计算external reward
	3. 计算policy self-reward
	4. 根据是否成功给出$I_{success}$
	5. 生成[[#Guided-Cost Preference Generation|GCPG reward]]
3. 每一个轨迹$\zeta$都有一个GCPG reward, 根据这个进行[[#TPO]], 使用loss更新$\pi_\theta$

## Pros and Cons

优点：提升泛化性、支持多目标对齐、降低训练成本、阶段性因果建模

缺点：计算复杂度高、依赖预训练模型、任务分解普适性有限