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

