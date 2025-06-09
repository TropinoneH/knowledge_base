---
tags:
  - paper
  - LLM
  - VLA
  - DL
aliases:
  - "Fine-Tuning Vision-Language-Action Models: Optimizing Speed and Success"
publish: NeurIPS 2024
---
# OpenVLA-OFT

> [!paper]-
> ![[2502.19645v2_OpenVLA-oft.pdf]]

motivate: 解决问题:
1. VLA+LoRA可以实现低参数高效finetune, 但是推理速度太慢(3-5 Hz), 无法满足高频控制的需求(25-50+ Hz). 使用更好的action tokenization能够有 2-13$\times$ 的加速, 但是两个chunk之间的延迟(750ms)是对真实世界部署的限制.
2. 在双臂(bimanual manipulation)任务中, 表现往往难以满足期望.

使用[[OpenVLA]]

![[Pasted image 20250609170348.png]]