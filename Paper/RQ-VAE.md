---
type: paper
tags:
  - algorithm
  - math
  - DeepLearning
  - ComputerVision
publish: CVPR 2022
pdf: "[[Paper/PDF/2203.01941v2.pdf]]"
rate: 🌟🌟🌟
done: false
---
> [!note]- paper
![[Paper/PDF/2203.01941v2.pdf]]


Motivation: 

为了增强生成质量, 通常的方法是增加空间分辨率(即, feature的分辨率). 但是如果使用自回归生成, 增加feature的size会导致建模长度指数级增加, 计算成本过高. 因此RQ-VAE提出: 不再增加feature size, 而是增加quantize的深度

具体的做法为:

1. 首先将原始的图片经过Encoder, 得到feature: $z=\mathcal{E}(I)$. 其中:
	- $I$是原始的图片
	- $\mathcal{E}$是encoder, 在这里使用了[[ResNet]]的架构, 使用CNN+Residual Blocks
	- $z$是隐空间向量, 或者说叫做feature vector
2. 初始残差: $r_0=z$
3. 对于每一层(深度, 用$d$表示), 首先计算quantize: $k_d=\mathop{\arg\max}_{j\in\{1,\cdots,K\}}\|r_{d-1}-e(j)\|^2$, 其中:
	1. $e(j)$表示codebook中第$j$个向量. 实际上, 用$e_j$表示更加合理
	2. $K$是codebook的大小
	3. $r_d$表示残差, 是深度为$d$的时候的残差, 计算方法为$r_d=r_{d-1}-e(k_d)$
	4. $k_d$表示, 在深度为$d$的时候, 应该使用codebook中序号为$k_d$的基向量
4. 最终, 将所有选中的基向量进行加和, 得到最终的重建结果: $\hat z=\sum_{d=1}^De(k_d)$

这个方法类似:

假设有$\{100,50,20,10,5,1,0.5,0.1\}$这几种面值的钱币, 需要凑出来173.6, 应该如何做:
1. 第一步quantize选择$e(k_1)=100$, 残差为$r_1=73.6$
2. 第二步quantize选择$e(k_2)=50$, 残差为$r_2=23.6$
3. ...

因此, 只要codebook覆盖范围足够大, 精度足够细, quantize深度足够深, 那么就能够达到完美重建

