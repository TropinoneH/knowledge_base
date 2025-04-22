---
tags:
  - algorithm
  - LLM
  - RL
  - DL
  - paper
aliases:
  - "Latent Reward: LLM-Empowered Credit Assignment in Episodic Reinforcement Learning"
---
# Latent Reward: LLM-Empowered Credit Assignment in Episodic Reinforcement Learning

> [!paper]-
> ![[2412.11120v2_LaRe.pdf]]

通过从LLM中整合和任务相关的先验 来获取 语义上interpretable latent reward, 从而增强reward decomposition, 以获取更好的[[09-RL|RL]]

## Preliminary

MPD可以定义为$\mathcal M=\langle S,A,\gamma,p,r\rangle$, 其中$S$是state space, $A$是action space, $\gamma$是discount factor(用于reward随时间步衰减), $P(s'|s,a)$是environment state transition distribution. 目标是找到policy $\pi:S\mapsto A$满足最大化reward $J(\pi)=\mathbb E\left[\sum_{t=1}^T\gamma^tr(s_t,\pi(s_t))|s_0\sim\eta,s_{t+1}\sim P(\cdots|s_t,\pi(s_t)\right]$

对于episodic [[09-RL|RL]], expected episodic reward是$J_{ep}(\pi)=\mathbb E\left[R(\tau)|s_0\sim\eta,a_t\sim\pi(\cdot|s_t),\tau=\langle s_0,a_0,\cdots,s_T\rangle\right]$

通常的一个假设是decomposition of the episodic reward: $R(\tau)=\sum_{t=1}^Tr(s_t,a_t)$

## Latent Reward
### Motivation

让reward包含其他implicit factors的表现. 从概念上讲, latent reward的不同dimension表示task performance的不同方向

最终的reward是将latent reward从space $\mathcal D$到$\mathbb R$的投影. 构建新的episodic RL概率模型:
$$p(R|s_{1:T},a_{1:T})=\int\left[\underbrace{p(r_t|z_{r,t})}_{\text{decoder }f}\underbrace{p(z_{r,t}|s_t,a_t)}_{\text{encoder }\phi}\right]p(R|r_{1:T})dzdr$$
其中$\phi:S\times A\mapsto\mathcal D$是从environment中获取latent reward的函数.

使用LLM能够从冗余的environment information中获取interpretable和multifaceted的task performance metrics, 即latent reward

### Framework
$$
\begin{aligned}
\textbf{Input}&\\
&\text{1. LLM }\mathcal M\\
&\text{2. task information }task\\
&\text{3. candidate responses number }n\\
&\text{4. pre-collected random state-action pairs }\bar s\\
&\text{5. max episodes }\mathcal N^\text{max}\\
\textbf{Output}&\\
&\text{1. policy network }\pi_\theta\\
&\text{2. reward decoder model }f_\psi\\
\textbf{Algorithm}&\\
\text{1:}\quad&\text{初始化policy network参数$\theta$, reward decoder参数$\psi$, replay buffer $\mathcal B$}\\
\text{2:}\quad&\text{获取candidate response $\xi_1,\cdots,\xi_n\gets\mathcal M(task,role)$}\\
\text{3:}\quad&\text{总结得出improved response $\xi\gets\mathcal M(task,role,\xi_1,\cdots,\xi_n)$}\\
\text{4:}\quad&\text{验证latent reward encode functino $\phi$: $err\gets\textbf{verify}(\phi,\bar s);\xi\gets\mathcal M(task, role,\xi_{1:n},err)$. 相当于是错误反馈}\\
\text{5:}\quad&\textbf{For $episode=1$ To $\mathcal N^\text{max}$}\\
\text{6:}\quad&\quad\quad\text{使用当前policy采样一个轨迹$\tau$}\\
\text{7:}\quad&\quad\quad\text{$\mathcal B\gets\mathcal B\cup\{r\}$}\\
\text{8:}\quad&\quad\quad\text{从replay pool $\mathcal B$中采样一个batch $B=\{\tau_i\}_{i=1}^{|B|}$}\\
\text{9:}\quad&\quad\quad\text{评估latent reward. 使用Loss: }\quad\mathcal L_{\text{RD}}^\phi(\psi)=\mathcal E_{r\sim D}\left[\left(R(\tau)-\sum_{t=1}^Tf_\psi(\phi(s_t,a_t)\right)\right]\\
\text{10:}\quad&\quad\quad\text{使用任意有predicted proxy reward $\hat r^{\psi,\phi}=f_\psi(\phi(s,a))$ 的RL算法优化policy}\\
\text{11:}\quad&\textbf{EndFor}
\end{aligned}
$$


1. 使用LLM生成response, 类似[[CoT]]的方法
2. 总结生成的回复, 生成总结. 根据总结生成代码, 这个代码是计算latent reward的一个函数. 调用这个函数并传入`observation, action`即可计算得出`eval_factors`. `eval_factors`指的是一个list, 里面存放所有的reward
3. 验证latent reward是否是合理的, 能否运行
4. 训练一个decoder. 这个decoder相当于是一个加权求和的Linear Layer.
