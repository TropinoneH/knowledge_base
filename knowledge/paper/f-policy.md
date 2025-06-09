---
tags:
  - algorithm
  - paper
  - RL
  - DL
aliases:
  - "f-Policy Gradients: A General Framework for Goal Conditioned RL using f-Divergences"
publish: NeurIPS 2023
---
# $f$-Policy

> [!paper]-
> ![[2310.06794_f-policy-gradient.pdf]]

motivate: 通过与环境的交互来识别解决任务的优化行为. 能否通过一种方法为policy optimize提供更dense的shaping reward?

考虑最小化agent's state visitation和goal distribution (假设每一个goal可以被represented成一个distribution. 最简单的是Dirac distribution), 以提供额外的learning signals.
## Background

[[LEAP]]: 使用feasible vector确定sub-goal, 然后policy进行生成action. 但是本篇主要是针对one goal的情况, goal的选取不在本篇的考虑之内.

[[08-MDP|MDP]]: $\langle\mathcal S,\mathcal G,\mathcal A,P,r,\gamma,\mu_0,\rho_g\rangle$. 其中, $\mathcal S$是状态空间, $\mathcal A$是动作空间, $\mathcal G\subset\mathcal S$是目标集合, $P:\mathcal S\times\mathcal A\mapsto\Delta(\mathcal S)$是转移概率(其中, $\Delta(\cdot)$表示对集合的probability distribution), $\gamma\in[0,1)$是discount factor, $\mu_0$是初始状态分布, $\rho_g:\Delta(\mathcal G)$是目标分布. 在一个episode开始时, 从分布$\mu_0$和$\rho_g$中采样初始状态$s_0$和目标$g$.

reward $r:\mathcal S\times\mathcal A\mapsto\mathbb R$基于agent的状态和goal的约束.

关注sparse的reward

**Trajectory**: 定义轨迹$\tau=(s_0,a_0,\cdots,s_{T-1},a_{T-1},s_T)$. 累计reward $H_g(s):=\sum_{t=0}^T[\gamma^tr(s_t+1,g)|s_0=s]$. 学习policy $\pi:\mathcal S\times\mathcal G\mapsto\Delta(\mathcal A)$满足最大化预期reward $\mathbb E_{\pi,s_0}[H_g(s_0)]$, 得到最优策略 $\pi^*=\mathop{\arg\max}_{\pi_\theta\in\Pi}\mathbb E_{\pi,s_0}[H_g(s_0)]$

**Distribution matching**: 轨迹的概率定义为 $p_\theta(\tau,g)=p(s_0)\prod_{t=0}^Tp(s_t|s_{t-1},a_{t-1})\pi_\theta(a_t|s_t,g)$. 定义状态$s$在轨迹$\tau$中被访问的次数$\eta_\tau(s)$. 定义agent的goal-conditioned state visitation:
$$\begin{aligned}p_\theta(s,g)&=\frac{\int p_\theta(\tau,g)\eta_\tau(s)d\tau}{Z}\\&=\frac{\int\prod p(s_{t+1}|s_t,a_t)\pi_\theta(a_t|s_t,g)\eta_\tau(s)d\tau}{\int\int\prod p(s_{t+1}|s_t,a_t)\pi_\theta(a_t|s_t,g)\eta_\tau(s)d\tau ds}\end{aligned}$$

定义f-divergences: $$D_f(P\|Q)=\int_{P>0}P(x)f(\frac{Q(x)}{P(x)})dx-f'(\infty)Q([P(x)=0])$$

| f-divergence | $D_f(P\|Q)$                                                                     | $f(u)$                           | $f'(u)$              | $f'(\infty)$ |
| ------------ | ------------------------------------------------------------------------------- | -------------------------------- | -------------------- | ------------ |
| **FKL**      | $\int P(x)\log\frac{P(x)}{Q(x)}dx$                                              | $u\log u$                        | $1+\log u$           | Undefined    |
| **RKL**      | $\int Q(x)\log\frac{Q(x)}{P(x)}dx$                                              | $-\log u$                        | $-\frac{1}{u}$       | 0            |
| **JS**       | $\frac12\int P(x)\log\frac{2P(x)}{P(x)+Q(x)}+Q(x)\log\frac{2Q(x)}{P(x)+Q(x)}dx$ | $u\log u-(1+u)\log\frac{1+u}{2}$ | $\log\frac{2u}{1+u}$ | $\log 2$     |
| $\chi^2$     | $\frac12\int Q(x)(\frac{P(x)}{Q(x)}-1)^2dx$                                     | $\frac12(1-u)^2$                 | $u$                  | Undefined    |

## $f$-Policy Gradient

通过最小化goal和policy导向的最终state distribution的散度, 来学习一个policy:
$$J(\theta)=D_f(p_\theta(s)\|p_g(s))$$
$$\nabla_\theta J(\theta)=\mathbb E_{\tau\sim p_\theta(\tau)}\left[ [\sum_{t=1}^T\nabla_\theta\log\pi_\theta(a_t|s_t)][\sum_{t=1}^Tf'(\frac{p_\theta(s_t)}{p_g(s_t)})]\right]$$

有类似reinforce的问题, 上述梯度的计算完全依赖于on-policy updates. 使用类似proximal policy optimization的clipped objective:
$$\nabla_\theta J(\theta)=\mathbb E_{s_t,a_t\sim p_{\theta'}(s_t,a_t)}\left[\min(r_\theta(s_t)F_{\theta'}(s_t),clip(r_\theta(s_t),1-\epsilon,1+\epsilon)F_{\theta'}(s_t))\right]$$
其中, $r_\theta(t)=\frac{\pi_\theta(a_t|s_t)}{\pi_{\theta'}(a_t|s_t)}$, $F_{\theta'}(s_t)=\sum_{t'=t}^T\gamma^{t'}f'(\frac{p_{\theta'}(s_t)}{p_g(s_t)})$.

1. for $i=1\to num\_iter$:
	1. $B\leftarrow[]$
	2. for $j=1\to num\_traj\_pre\_iter$:
		1. sample $g$, set $p_g(s)$
		2. 收集goal-conditioned trajectories $\tau:g$
		3. 使用$\tau$上的KDE进行[[Fit]] $p_\theta(s)$
		4. 对$\tau$里面的每一个state $s$, 存储$f'\left(\frac{p_\theta(s)}{p_g(s)}\right)$
		5. $B\leftarrow B+{\tau:g}$
	3. for $j=1\to num\_policy\_updates$
		1. $\theta\leftarrow\theta-\alpha\nabla_\theta J(\theta)$

