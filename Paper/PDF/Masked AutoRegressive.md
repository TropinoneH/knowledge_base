---
type: paper
tags:
  - LLM
  - ComputerVision
  - VLM
  - DeepLearning
  - code/python
  - algorithm
publish: NeurIPS 2024
pdf: "[[Paper/PDF/2406.11838v3.pdf]]"
rate: 🌟🌟🌟
done: false
---
> [!note]- paper
![[Paper/PDF/2406.11838v3.pdf]]

Motivation: 现在为了将连续的图像数据匹配给离散的[[1706.03762]](Auto Regressive)模型, 需要使用Vector Quantization方法(如, [[VQ-VAE|VQ-VAE]]). 但是VQ Tokenizer训练困难, 对梯度近似敏感, 重建质量往往比连续空间的方法更差(如, [[Deep Learning#Variational Autoencoder (VAE)|VAE]]). 但是本文提出, **自回归本身是根据已有预测未知, 不依赖于数据是离散的还是连续的**. 关键的缺失是一个能够在连续值空间中建模每个token概率分布的loss函数

因此, 提出一种新的方法, 在不使用VQ的情况下建模loss分布:
1. 提出Diffusion Loss. 用一个小型扩散过程来模拟连续值token的概率分布: $p(x|z)$, 使得Auto-Regressive模型能够直接预测连续的latent数据
2. 提出MAR框架, 融合 Diffusion Loss的Auto-Regressive 和 [[2111.06377|MAE]] 的方法, 结合[[Bidirectional Attention]]机制, 提高生成速度和质量


