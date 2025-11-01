---
type: paper
tags:
  - algorithm
  - math
  - LLM
  - DeepLearning
  - ComputerVision
publish: ICLR 2021
pdf: "[[Paper/PDF/2010.11929v2.pdf]]"
rate: 🌟🌟🌟🌟🌟
done: false
---
> [!note]- paper
![[Paper/PDF/2010.11929v2.pdf]]

Motivation: 将[[Transformer]]架构应用给 #ComputerVision 领域, 证明了可以完全抛弃[[Deep Learning#Convolutional Neural Networks (CNNs)|CNN]]架构

> [!PDF|] [[2010.11929v2.pdf#page=1&selection=104,48,104,94|2010.11929v2, p.1]]
> > Transformers lack some of the inductive biases inherent to CNNs
> 
> Transformers在小规模未经归一化的数据集上表现不如传统CNN模型(如, [[Deep Learning#ResNet|ResNet]]), 是因为CNN模型有[[2010.11929v2.pdf#page=2&selection=1,25,1,63&color=teal|平移等变性并能捕捉local的特征]].
> 
> 但是如果在更大数据规模上进行训练CNN, 那么会有更好的表现

pipeline:
![[2010.11929v2.pdf#page=3&rect=138,538,474,723]]

> [!PDF|] [[2010.11929v2.pdf#page=3&selection=101,30,164,13|2010.11929v2, p.3]]
> > To handle 2D images, we reshape the image $x\in\mathbb R^{H\times W\times C}$ into a sequence of flattened 2D patches $x_p\in\mathbb R^{N\times(P^2\cdot C)}$, where (H, W ) is the resolution of the original image, C is the number of channels, (P, P ) is the resolution of each image patch, and N = HW/P 2 is the resulting number of patches, which also serves as the effective input sequence length for the Transformer. 
> 
> 
