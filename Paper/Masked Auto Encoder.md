---
type: paper
tags:
  - ComputerVision
  - algorithm
  - math
  - DeepLearning
  - code/python
publish: CVPR 2022
pdf: "[[Paper/PDF/2111.06377v3.pdf]]"
rate: 🌟🌟🌟🌟🌟
done: false
---
> [!note]- paper
![[Paper/PDF/2111.06377v3.pdf]]

MAE: Masked Auto-Encoder

Motivation: 将NLP领域的遮罩预测方法(以[[BERT]]为例子)应用到视觉领域
- 使用[[2111.06377v3.pdf#page=1&selection=35,7,39,28|非对称的Encoder-Decoder框架]]
- 使用[[2111.06377v3.pdf#page=1&selection=45,8,50,32|高遮盖率]], 迫使模型学习全局的语义信息, 从而克服图像的空间冗余
- [[2111.06377v3.pdf#page=1&selection=58,48,59,41|高可迁移能力, 高可拓展性]]

> [!info] Related Work
> Masked Language Modeling:
> - [[BERT]]
> - GPT
> 
> Auto Encoding:
> - [[AE]]
> - [[VAE]]
> 
> Masked Image Encoding:
> - DAE
> - [[ViT]], [[Transformer]]

> [!PDF|] [[2111.06377v3.pdf#page=1&selection=145,13,149,1|2111.06377v3, p.1]]
> > Convolutions typically operate on regular grids and it is not straightforward to integrate ‘indicators’ such as mask tokens or positional embeddings into convolutional networks.
> 
> CNN网络架构导致了很难将位置编码或者掩码引入, 因此在架构上很难做到[[2111.06377v3.pdf#page=1&selection=89,36,90,52|学习被移除的内容]]
> 
> 但是现在由于[[ViT]]模型架构的产生, 能够引入[[Transformer]]模型来支持在图像中嵌入Mask, 因此可以实现在视觉任务中的Masked Auto-Encoder

> [!PDF|] [[2111.06377v3.pdf#page=1&selection=159,0,160,41|2111.06377v3, p.1]]
> > Languages are human-generated signals that are highly semantic and information-dense
> 
> 语言是高语意高信息密度的信号, 因此通过少量的mask就能让模型学习到语言的结构, 诱导出复杂的语义理解
>
> 与语言的高密度信息不同, [[2111.06377v3.pdf#page=1&selection=163,35,164,24|图片模态]]中有大量的空间冗余信息. 模型很容易聚焦于local的猜测, 从相邻的image patch中猜测需要预测的内容, 并没有对全局信息以及图片的语义信息的理解.
> 
> 因此对于视觉方面的MAE, 需要使用[[2111.06377v3.pdf#page=2&selection=18,54,23,25|更多的Mask]]让模型学习到全局的信息, 减少冗余.

> [!PDF|] [[2111.06377v3.pdf#page=2&selection=38,37,51,34|2111.06377v3, p.2]]
> >  In vision, the decoder reconstructs pixels, hence its output is of a lower semantic level than common recognition tasks. This is in contrast to language, where the decoder predicts missing words that contain rich semantic information.
> 
> 语言是高语义级别的decoder, 因为每一个文字都含有丰富的语义信息. decoder重建的时候, 从latent space的隐变量转换成输出的过程比较简单(都含有丰富语义)
> 
> 但是对于图片不同. 图片的latent space有丰富的语义信息, 但是最终的输出是pixel, 语义信息非常稀少. 如果使用架构简单的decoder(如, MLP), 那么可能迫使Encoder学习非常local的信息(如, 纹理, 光影等pixel level的信息, 而忽略了全局信息以及语义信息).

优点:
1. [[2111.06377v3.pdf#page=2&selection=74,0,86,52|由于Mask掉了大量(75%)的输入, 因此Encoder的训练更加轻量级(输入少了), 因此很容易Scaling]]
2. [[2111.06377v3.pdf#page=2&selection=87,0,90,41|泛化能力强]]. Scaling并扩大训练数据可以增强模型能力, 与LLM相似

Pipeline:
![[2111.06377v3.pdf#page=1&rect=292,453,563,599|2111.06377v3, p.1]]

## Approach

> [!PDF|] [[2111.06377v3.pdf#page=3&selection=108,0,108,7|2111.06377v3, p.3]]
> > Masking
> 
> 使用类似[[ViT]]的方法, 对图片进行patch, 然后随机mask

> [!PDF|] [[2111.06377v3.pdf#page=3&selection=139,0,139,11|2111.06377v3, p.3]]
> > MAE encoder
> 
> 是一个[[ViT]], 但是仅针对没有被mask掉的部分.
> - Embedding Image Patch + Positional Embedding
> - Transformer blocks

> [!PDF|] [[2111.06377v3.pdf#page=3&selection=157,0,158,0|2111.06377v3, p.3]]
> > MAE decoder
> 
> 将image embeddings和一个特殊的embedding vector(mask embedding)按照顺序进行拼接, 得到最终的`input_embeds`, 然后送给[[Transformer]]进行Self Attention, 最终得到一个完整的image的embeddings.
> 
> 随后, 使用MLP或其他方法将hidden states重建成为image

> [!PDF|] [[2111.06377v3.pdf#page=4&selection=26,0,27,1|2111.06377v3, p.4]]
> > Reconstruction target.
> 
> 与[[BERT]]类似, 只针对masked掉的patch进行[[Deep Learning#MSE|MSE]] loss计算. 因此在infer的时候, 那些没有被masked的patch重建效果可能较差

> [!PDF|] [[2111.06377v3.pdf#page=4&selection=51,0,52,1|2111.06377v3, p.4]]
> > Simple implementation.
> 
> 这一部分是比较巧妙的地方, 使用了一些trick, 能够加速mask的replace.
> 
> 首先, 使用randomly shuffle随机打乱patch embeds:
> ```python
> input_patches = patch(image) # (bs, seq_len, image_dim)
> shuffle_indices = torch.rand(bs, seq_len).argsort(dim=1)
> unshuffle_indices = shuffle_indices.argsort(dim=1)
> 
> shuffle_patches = torch.gather(input_patches, 1, shuffled_indices.unsqueeze(-1).expand(-1, -1, image_dim))
> num_visible = int(0.25 * seq_len) # Maksed 75% patches
> visible_patches = shuffle_patches[:, :num_visible, :]
> 
> visible_embeds = transformer(visible_patches)
> 
> # Concat visible patches and mask embeds
> full_shuffled_embeds = torch.cat([visible_embeds, masked_token.expand(bs, seq_len - num_visible, )])
> ```
