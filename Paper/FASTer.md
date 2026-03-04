---
type: paper
tags:
  - algorithm
  - EmbodiedAI
  - VLA
  - code/python
  - DeepLearning
  - Robot
  - VLM
publish: ICLR 2026
pdf: "[[Paper/PDF/2512.04952v2.pdf]]"
rate: 🌟🌟🌟🌟
done: false
---
> [!note]- paper
![[Paper/PDF/2512.04952v2.pdf]]

Motivation: 解决action tokenizer的效率和精度之间的权衡

现有的问题: 要么token过多导致效率低, 要么token表达动作太多精度低导致成功率低

提出FASTer框架, 分为两个核心组件:
- FASTerVQ 分词器, 使用“非均匀分块”的策略来平衡不同动作维度的分布不均问题, 结合[[RQ-VAE]]在保持高压缩比的同时
- 
