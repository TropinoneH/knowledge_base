---
tags:
  - paper
  - LLM
  - EmbodiedAI
  - DL
  - RL
aliases:
  - Planning with Goal-Conditioned Policies
publish: NeurIPS 2019
---
# Goal Condition

> [!paper]-
> ![[1911.08453_LEAP.pdf]]

motivate: 使用model-free的RL, 在不需要对时间和state的repr进行low-level建模environment的情况下, 获得类似model-based的temporal compositionality的好处(意思是, model-based的方法需要对environment建模, 这其中涉及到state和time的表示. 现在使用model-free的方法, 不对这两个建模, 并且也能获得类似model-based的temporal compositionality的好处)

一种避免详细建模的方法是对抽象层面进行规划: 简化state和transition的表达.

结合model-free RL和model-based planning

## background

[[08-MDP|MDP]]: $\langle S,G,A,p,R,T_{\text{max}},\rho_0,\rho_G\rangle$, S: state, G: goal, A: action, $p(s_{t+1}|s_t,a_t)$: time-invariant动态函数, R: reward, $T_{\text{max}}$: maximum horizon, $\rho_0$: initial distribution(state), $\rho_G$: target distribution

目标是通过$\pi(a_t|s_t,g,t)$来最大化$\mathbb E[\sum_{t=0}^{T_{\text{max}}}R(s_t,g,t)]$. $s\sim\rho_0$, $a_t\sim\pi(a_t|s_t,g,t)$, $s_{t+1}\sim p(s_{t+1}|s_t,a_t)$

## Planning with Goal-Conditioned Policies

[[09-RL#Sample-Based Policy Evaluation|Value function]]: $$V^\pi(s,g,t)=\mathbb E\left[\sum_{t'=t}^{T_{\text{max}}}R(s_{t'},g,t')|s_t=s,\pi\text{ is conditioned on }g\right]$$
[[09-RL#TD Learning|TDM]]:
$$R_{TDM}(s,g,t)=-\delta(t=T_{\text{max}})\cdot d(s,g)$$

### Planning over subgoals

定义可行性向量:
$$\vec V(s,g_{1:K},t_{1:K+1},g)=\begin{bmatrix}V(s,g_1,t_1)\\V(g_1,g_2,t2)\\\vdots\\V(g_{K-1},g_K,t_K)\\V(g_K,g,t_{K+1})\end{bmatrix}$$
表达了可行性的度量, 而V越小代表state和goal之间的差距越小. 那么希望feasible vector全为零, 使用norm:
$$\mathcal L(g_{1:K})=\|\vec V(s,g_{1:K},t_{1:K+1},g)\|$$


### Optimizing over images

对$g_{1:K}$进行优化, 但是如果对于图片而言, $g_{1:K}$维度很高. 并且优化的[[Ch1.Introduction_of_Linear_Programming#Preliminaries|feasible solution]]必须是数据集的一部分(必须是有意义且能做出来的动作)

当$g_{1:K}$的维度$r$远小于数据样本个数$N$时, 可以使用VAE学习潜在空间.

因此objective function变成:
$$\mathcal L_{LEAP}(z_{1:K})=\|\vec V(s,z_{1:K},t_{1:K+1},g)\|_p-\lambda\sum_{k=1}^K\log p(z_K)$$
where $\vec V(s,z_{1:K},t_{1:K+1},g)=\begin{bmatrix}V(s,\psi(z_1),t_1)\\V(\psi(z_1),\psi(z_2),t2)\\\vdots\\V(\psi(z_{K-1}),\psi(z_K),t_K)\\V(\psi(z_K),\psi(z),t_{K+1})\end{bmatrix}$, $\psi(z)=\mathop{\arg\max}_{g'}p_\theta(g'|z)$是vae的逆过程.

对于norm, 使用$l_\infty$范数更好, 比$l_1$更好, 因为$l_\infty$要求所有元素的绝对值接近0

### Goal-Conditioned Reinforcement Learning

使用[[09-RL#TD Learning|TDM]](时序差分模型)学习[[08-MDP#Q-value|Q value]]从而计算value: $V(s,g,t)=Q(s,a,g,t)|_{a=\pi(s,g,t)}$

通过最小化$\mathcal L_{LEAP}$来选择合适的goal