---
tags:
  - paper
  - VLA
  - LLM
  - DL
publish: CoRL 2024
---
# What makes Pre-trained- Visual Representations Successful for Robust Manipulation

publish: CoRL 2024

> [!paper]-
> ![[2312.12444v1_WhatMakesPreTrainedVisualRepresentationsSuccessfulForRobustManipulation.pdf]]

motivate:
1. 在visual distribution shift的评估下, 专门为了manipulation and control设计的模型并不比visual pre-trained的模型效果好
2. ViT(Visual [[Transformer]]) 的emergent segmentation是泛化的强预测指标

## Environment, Evaluated Protocol and Pre-trained Models

冻结pre-trained visual encoder的基础上进行学习policy, 然后改变光照和纹理和物体等, 进行zero-shot的测试

**Environment**

使用[FrankaKitchen](https://arxiv.org/abs/1910.11956)和[Meta-World](https://arxiv.org/abs/1910.10897)两个测试环境

**Distribution Shift**

纹理和光照的shift, 以及干扰物

**Policy Train**

使用模仿学习, 最小化MSE(policy action和expert action)

## Generalization of Models Pre-Trained for Manipulation

**Models Pre-Trained for Manipulation**

R3M 和 VIP 显出优于baseline(ImageNet)

其他数据的影响会超过数据规模

**Supervised ImageNet Models**

ImageNet学到的特征, 即使冻结也能在各种模拟控制任务中与真实状态信息竞争

风格化 ImageNet 上进行监督训练在训练分布中实现了比使用掩码自编码损失的 ImageNet 自监督训练更高的成功率

监督的存在对out-of-domain的预测性(泛化性)不如其他因素

**Self-Supervised ImageNet Models**

增强集的选择比监督的重要性更大

**ResNet v.s. ViT**

架构选择方面, ViTs 比 ResNets 略有优势

## Properties of Robust Visual Representations for Manipulation

### Metrics

- ID v.s. OOD
- ImageNet v.s. OOD
- Shape-Bias v.s. OOD
- Jaccard v.s. OOD

## Conclusion

1. 在操作相关数据上预训练的模型并不一定比在标准预训练数据集（如 ImageNet）上训练的模型泛化得更好
2. 具有高emergent segmentation accuracy的 ViT 模型在视觉分布偏移下泛化表现良好
3. 优先考虑能够导致strong emergent segmentation的架构开发和训练算法，而不是仅仅在更多操作相关数据上进行训练。