---
type: paper
tags:
  - Diffusion
  - EmbodiedAI
  - DeepLearning
  - code/python
  - Robot
  - VLA
publish: arxiv preprint
pdf: "[[Paper/PDF/2505.11123v1.pdf]]"
rate: 🌟🌟🌟🌟
done: false
---
> [!note]- paper
![[Paper/PDF/2505.11123v1.pdf]]

Motivation: 尝试解决[[Diffusion Policy]]等方法对机器人action的训练效果低下的问题(尝试解决loss collapse问题)

> [!PDF|] [[2505.11123v1.pdf#page=1&selection=36,0,37,1|2505.11123v1, p.1]]
> > loss collapse
> 
> 损失崩塌: 由于condition差距过小, [[2505.11123v1.pdf#page=2&selection=73,44,75,53|导致模型忽略了condition]], 不学习条件概率$p(\text{action}|\text{condition})$而去学习边缘概率$p(\text{action})$:
> ![[2505.11123v1.pdf#page=4&rect=126,608,482,730|2505.11123v1, p.4]]
> 由于条件过于相似, 模型忽略了条件, 直接学习了"move"这个action. 均有0.5的概率进行向左或向右移动(忽略了指令的条件)
> 
> 数学推导: 根据[[2505.11123v1.pdf#page=4&selection=374,0,374,13|Loss Collapse]]部分的公式, 标准的[[Flow Matching]]的损失函数为:
> $$\mathcal L_{CFM}(\theta):=\mathbb E_{t,q(x_0),q(x_1,c),p_t(x|x_1,x_0)}\|v_\theta(t,x,c)-u_t(x|x_1,x_0)\|^2$$
> 在这个loss计算中, 需要提供这些内容: 条件$c$, 噪声采样$x_0$, 原始action $x_1$. 但是注意, 噪声分布$q(x_0)$与条件$c$无关.
> 
> 当模型无法区分两个相似的condition $c_1,c_2$时, 数学表示为$\forall c_1,c_2\in\mathcal C,\|v_\theta(t,x,c_1)-v_\theta(t,x,c_2)\|\leq\epsilon$时, loss函数的梯度会有:
> $$\|\nabla_\theta\mathcal L_{CFM}(\theta,c_1)-\nabla_\theta\mathcal L_{CFM}(\theta,c_2)\|\leq2(M+KD)\epsilon$$
> 其中:
> - 上限$\|\nabla_\theta v_\theta\|\leq M$
> - 上限$\|d\|\leq D$
> 
> 于是模型对相似condition的loss优化相同, 最终[[2505.11123v1.pdf#page=4&selection=412,3,413,14|目标loss函数会退化成边缘分布]]
>
> 


