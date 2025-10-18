---
type: paper
tags:
  - VLA
  - VLM
  - LLM
  - EmbodiedAI
  - Robot
  - DeepLearning
  - algorithm
publish: arxiv preprint
pdf: "[[Paper/PDF/2509.09372v2.pdf]]"
rate:
done: false
---
> [!note]- paper
![[Paper/PDF/2509.09372v2.pdf]]

> [!PDF|] [[2509.09372v2.pdf#page=1&selection=150,40,151,66|2509.09372v2, p.1]]
> > In this paper, we investigate how to effectively bridge vision-language (VL) representations to action (A). 
> 
> Motivation:
> - 高效将视觉-语言表达和动作对齐
> - 减少VLA模型对大型VLM和大规模pretrain的训练

训练需要的参数:
![[2509.09372v2.pdf#page=1&rect=254,192,496,245|2509.09372v2, p.1]]
pipeline:
![[2509.09372v2.pdf#page=1&rect=254,156,496,194|2509.09372v2, p.1]]

> [!PDF|] [[2509.09372v2.pdf#page=3&selection=223,0,223,62|2509.09372v2, p.3]]
> > The backbones select the Prismatic VLM trained on Qwen2.5-0.5B
> 
> VLM骨干用的是 Qwen2.5-0.5B, 是纯文字版本, 然后使用Prismatic VLM的方法进行训练.


