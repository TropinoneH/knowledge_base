---
tags:
  - paper
  - Vision
  - LLM
  - EmbodiedAI
  - VLA
  - DL
aliases:
  - "SpatialVLA: Exploring Spatial Representation for Visual-Language-Action Model"
publish: arxiv preprint
---
# SpatialVLA

> [!paper]-
> ![[2501.15830v5_SpatialVLA.pdf]]

![[Pasted image 20250619042333.png]]

让VLA理解3D空间知识, 然后进行推理生成action

## Methodology
![[Pasted image 20250619042603.png]]

### Ego3D Position Encoding

以自我为中心构建3D点云. 避免了没有外参而无法构建global 3D position的问题

1. 使用[ZoeDepth](https://arxiv.org/abs/2302.12288)根据image生成depth channel
2. 根据depth和intrinsic param构建3D点云. 那么现在有一个shape为(width, height, 3)的矩阵, `3`指的是3D坐标`(x,y,z)`
3. 使用position embedding, 即, 对于`x`, 变成`[x,sin(x),cos(x)]`, `y`和`z`也一样, 最终一个坐标变成9个值, concat到一起: `(x,y,z) -> (x, sin(x), cos(x), y, sin(y), cos(y), z, sin(z), cos(z))`
4. 将经过正弦函数增强的坐标, 送入MLP(Linear+LayerNorm+ReLU+Linear), 得到一个feature map. 这个feature map的shape需要是(batch_size, flatten_num, 1152), 因为SigLIP的输出维度是1152
5. 使用SigLIP对原始的2D图像进行forward, 得到一个feature map, shape: (batch_size, flatten_num, 1152)
6. 将position embedding和SigLIP的features map相加, 得到$O_{3D}$

### Adaptive Action Grids

对每一个action维度进行Gaussian Probability Distribution的拟合

把Gaussian Probability Distribution分成等概率(PDF面积相等)的多个bin, 然后把action离散化到每一个bin中

![[Pasted image 20250619050023.png]]
