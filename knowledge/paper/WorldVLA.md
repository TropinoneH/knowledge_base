---
tags:
  - paper
  - VLA
  - LLM
  - DL
  - WorldModel
  - EmbodiedAI
aliases:
  - "WorldVLA: Towards Autoregressive Action World Model"
publish: arxiv preprint
---
# World VLA

> [!paper]-
> ![[2506.21539_WorldVLA.pdf]]

![[Pasted image 20250705024817.png]]

整合VLA模型和世界模型

action chunk + 并行解码: 会有误差, 因为大模型主要接触的是image和language模态而非action模态. 因此使用一种动作的注意力掩码, 在生成当前动作时选择性掩码之前的动作
## Methods
### Problem Formulation

有两个任务, 一个是根据observation生成action chunk(VLA policy), 一个是根据observation和action chunk生成下一帧图片(World Model对动作和世界的理解)

$$a_t=M^{\text{policy}}_\psi(a_t|o_{t-h:t},l)$$
$$o_t=M^{\text{world}}_\psi(o_t|o_{t-h:t-1},a_{t-h:t-1})$$
然后WorldVLA Model可以表示为$M:\left\{\begin{aligned}a_t=&M^{\text{policy}}_\psi(a_t|o_{t-h:t},l)\\o_t=&M^{\text{world}}_\psi(o_t|o_{t-h:t-1},a_{t-h:t-1})\end{aligned}\right.$
### Architecture
![[Pasted image 20250705031814.png]]
### Training Strategy
Special Tokens:
- `[BOS]`: begin of sequence
- `[EOS]`: end of sequence
- `[BOI]`: begin of images
- `[EOI]`: end of images
- `[BOA]`: begin of actions
- `[EOA]`: end of actions

Action Data: `[BOS]{text}[BOI]{image}...{image}[EOI][BOA]{action}...{action}[EOA][EOS]`, 仅对action部分计算loss

World Data:`[BOS]{text}[BOI]{image}...{image}[EOI][BOA]{action}...{action}[EOA][EOS][BOI]{image}[EOI]`, 仅对最后的image计算loss

Attention Mask:
![[Pasted image 20250705044224.png]]
使用(b)方法进行训练, 确保当前动作仅依赖于当前的指令和当前观测到的图片, 与之前的动作没有关系

Training Objective:
$$\mathcal L=\mathcal L_{action}+\alpha\mathcal L_{world}$$
使用权重$\alpha$平衡action policy的loss和world model生成图片的loss, 使模型同时具有action policy的能力, 同时有对世界的理解


