---
type: paper
tags:
  - algorithm
  - math
  - Robot
  - EmbodiedAI
  - Diffusion
  - DeepLearning
publish: RSS 2023
pdf: "[[Paper/PDF/2303.04137v5.pdf]]"
rate: 🌟🌟🌟
done: false
---
> [!note]- paper
![[Paper/PDF/2303.04137v5.pdf]]

[Github Repo](https://github.com/real-stanford/diffusion_policy)

> [!PDF|] [[2303.04137v5.pdf#page=1&selection=118,0,143,1|2303.04137v5, p.1]]
> > In this work, we seek to address this challenge by introducing a new form of robot visuomotor policy that generates behavior via a “conditional denoising diffusion process Ho et al. (2020) on robot action space”, Diffusion Policy.
> 
> 在机器人的Action Space上使用[[Diffusion]]进行去噪作为policy model以获取action

pipeline:
![[2303.04137v5.pdf#page=3&rect=49,648,548,793|2303.04137v5, p.3]]

> [!PDF|] [[2303.04137v5.pdf#page=2&selection=386,0,386,40|2303.04137v5, p.2]]
> > Denoising Diffusion Probabilistic Models
> 
> 使用[[DDPM]]进行训练.
> 
> 去噪过程可以表示为:
> $$x^{k-1}=\alpha(x^k-\gamma\epsilon_\theta(x^k,k)+\mathcal N(0,\sigma^2I))$$
> 其中:
> - $\epsilon_\theta$是学习的去噪网络, $\theta$是参数
> - $\mathcal N(0,\sigma^2I)$是训练的时候添加的高斯噪声
> 
> 这个去噪过程可以表示为一次带噪声的梯度下降过程:
> $$x'=x-\gamma\nabla E(x)$$
> 使用网络模型$\epsilon_\theta$去学习预测梯度场$\nabla E$

> [!PDF|] [[2303.04137v5.pdf#page=3&selection=341,0,341,40|2303.04137v5, p.3]]
> > Diffusion for Visuomotor Policy Learning
> 
> 把Observation $O_t$作为condition, 对action进行denoise生成.
> 
> 为了时间连续性, 并为了最大发挥出diffusion的能力, 一次性生成一个chunk的action sequence. 执行其中一小部分, 然后根据新的observation进行replan, 重新生成新的action, 以执行闭环控制.
> 
> 为了能预测当前的动作, 同时不需要预测未来动作以加速推理, 因此使用DDPM去拟合一个分布$p(A_t|O_t)$而不是原始的联合分布$p(A_t,O_t)$. 此时, 去噪公式变成:
> $$A_t^{k-1}=\alpha(A_t^k-\gamma\epsilon_\theta(O_t,A_t^k,k)+\mathcal N(0,\sigma^2I))$$
> Loss变成:
> $$\mathcal L=\text{MSE}(\varepsilon^k,\epsilon_\theta(O_t,A_t^0+\varepsilon^k,k))$$
