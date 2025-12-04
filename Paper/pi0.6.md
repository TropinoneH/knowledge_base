---
type: paper
tags:
  - algorithm
  - code/python
  - EmbodiedAI
  - Robot
  - DeepLearning
  - Diffusion
  - VLA
  - VLM
  - math
publish: company blog
pdf: "[[Paper/PDF/pi06.pdf]]"
rate: 🌟🌟🌟
done: false
---
> [!note]- paper
![[Paper/PDF/pi06.pdf]]

Motivation: 之前的工作([[pi0]], [[pi0.5]])过度依赖特定任务的fine-tune, 需要对base model进行中等规模的fine-tune之后才能在benchmark中得到一个较好的分数.

因此pi0.6提出:
- 采用Knowledge Insulation策略, Action Expert的梯度不回传给VLM
- 引入更丰富的Metadata conditioning和多样化的训练数据, 让模型可以在不经过特定任务微调的情况下, 效果更好
- 利用Flow Matching和离散化的token输出, 让效率更高.

基于[[pi0.5]]进行构建: [[pi06.pdf#page=1&selection=30,1,43,69|有high-level的subtask的预测和low-level action的生成]]. 同时, 这个也是[[pistar0.6]]的base model.

与[[pi0.5]]一样, 基于[[Flow Matching]]和[[FAST]], 同时有discrete和continuous的action loss. 但是VLM的backbone使用了Gemma 4B, Action Expert用了Gemma 860M, 扩大了参数.

 



