---
tags:
  - paper
  - LLM
aliases:
  - "LoRA: Low-Rank Adaptation of Large Language Models"
---
事实上, `LoRA` 是将一个大的矩阵, 拆分成两个小的矩阵. 通过对小的矩阵进行训练, 来完成对原始矩阵的微调(fine-tune).

训练之后, 推理的时候经过两个小的矩阵得到的输出和经过原始的输出加和, 得到fine-tune之后的矩阵.