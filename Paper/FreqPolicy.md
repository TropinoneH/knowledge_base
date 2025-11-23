---
type: paper
tags:
  - algorithm
  - VLA
  - math
  - code
  - EmbodiedAI
  - Robot
  - DeepLearning
  - VLM
publish: NeurIPS 2025
pdf: "[[Paper/PDF/2506.01583v2.pdf]]"
rate: 🌟🌟🌟
done: false
---
> [!note]- paper
![[Paper/PDF/2506.01583v2.pdf]]

Motivation: 要求在保持[[2506.01583v2.pdf#page=1&selection=63,57,63,81|计算效率]]的同时能够生成[[2506.01583v2.pdf#page=1&selection=63,23,63,37|精确的action]].

使用频域对action进行建模能够[[2506.01583v2.pdf#page=1&selection=66,40,68,56|捕捉更有效的捕捉动作结构]]: 低频是全局运动模式, 高频表示更精细的局部细节

可以理解成, 低频捕捉的是任何机器人在这个动作下的相似部分, 高频捕捉特定的机器人的精细操作. 因此可以学习一个共用的低频, 只生成高频即可做泛化

> [!PDF|] [[2506.01583v2.pdf#page=1&selection=92,0,92,48]]
> > 现存的视觉运动策略学习
> 
> 大概分成两类:
> - 以[[Diffusion Policy]]为主的[[Diffusion|扩散]]策略模型
> - 使用[[Transformer]]做自回归生成的 #VLA 模型, 如[[pi0]], [[OpenVLA]]等
> 
> 扩散策略能够生成连续的action, 能从少量样本中获得比较强的生成能力, 但是有较长的inference delay.
> 
> 自回归模型虽然能够快速生成token并且对高频信号的表达能力更强, 但是token是一个离散的输出, 无法完整的表达整个action空间(在VLM的token输出后面接一个diffusion或者[[Flow Matching]]能够缓解问题, 虽然在中间步骤仍然会有信息的损失, 但只要token足够好, 扩散模型能够较好的还原原始action)

![[2506.01583v2.pdf#page=2&rect=382,567,507,675]]

通过图中大概能够看出, 仅使用[[2506.01583v2.pdf#page=2&selection=67,60,72,39|30%]]的低频信号就可以近似得到原始的信号; [[2506.01583v2.pdf#page=2&selection=85,0,88,27|60%]]的信号就可以恢复得到较为精细的信号细节.

对于[[2506.01583v2.pdf#page=2&selection=91,11,92,32|简单任务]], 低频信号就可以满足需求. 去除高频信号能够保持更稳定, action更平滑.

对于[[2506.01583v2.pdf#page=2&selection=95,27,95,74|高灵活性的复杂任务]], 需要保留足够的高频信息.

[[2506.01583v2.pdf#page=2&selection=100,26,101,31|低频信息更容易学习, 并能够捕捉全局的信号信息]], 因此从低频信息开始生成, 然后再逐步生成更高频的信号. 使用自回归的模型更加适合这种生成范式.

[[FAST]]使用[[DCT]]直接将连续动作从时域空间转换成离散的频域空间, 并证明了[[Diffusion]]模型[[2506.01583v2.pdf#page=2&selection=113,68,118,68|对连续的空间有更好的表现能力]].

FreqPolicy这个方法: 首先使用[[DCT]][[2506.01583v2.pdf#page=2&selection=124,1,129,36|将action sequence转换为频率分量.]] 然后通过[[Masked Auto Encoder|MAE]]逐步预测, 使用[[2506.01583v2.pdf#page=2&selection=130,70,131,88|低频信号指导高频信号的生成]].

## Methods

pipeline:
![[2506.01583v2.pdf#page=4&rect=101,488,508,726]]

Training阶段:
1. 首先使用DCT将action sequence分解成频率分量
2. 使用逆DCT在不同level上重建


