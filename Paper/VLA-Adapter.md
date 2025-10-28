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

> [!PDF|] [[2509.09372v2.pdf#page=3&selection=175,15,178,1|2509.09372v2, p.3]]
> > ActionQuery AQ
> 
> 这个是一个Embedding, 可学习的参数:
> 
> [self.action_queries = nn.Embedding(NUM_TOKENS, self.llm_dim)](https://github.com/OpenHelix-Team/VLA-Adapter/blob/838a36da195daf3e8b8a53520c8c7ce86231b6d9/prismatic/extern/hf/modeling_prismatic.py#L375C9-L375C69)
> 
> 在VLM中, 每一层attention layer输出的hidden state和Action Query进行一次cross attention, 得到更深一层的action query features:
> ![[2509.09372v2.pdf#page=4&rect=116,566,213,693|2509.09372v2, p.4|162]]
> 
> Bridge Attention: 将VLM的hidden state和Action Query的hidden state作为condition生成Action:
> ![[2509.09372v2.pdf#page=5&rect=273,348,499,431|2509.09372v2, p.5|452]]
> 实际上, 在代码中, 并没有直接按照Bridge Attention的做法, 做Cross Attention以及Action的Attention. 在代码中, 仅仅是将`image feature`+`language feature`+`action query hidden state`拼接到一起, 过一次`self.language_model`的self attention, 然后通过`action_head`(分成两种, continuous的L1Regressive以及discrete的通过VLM的`logits`计算)获取normalized action.

> [!PDF|] [[2509.09372v2.pdf#page=3&selection=223,0,223,62|2509.09372v2, p.3]]
> > The backbones select the Prismatic VLM trained on Qwen2.5-0.5B
> 
> VLM骨干用的是 Qwen2.5-0.5B, 是纯文字版本, 然后使用Prismatic VLM的方法进行训练.
> 
> 使用[[SigLip]]和[[DINOv2]]作为Vision Transformer, 获取图片的feature, 与Qwen进行共同训练

> [!PDF|] [[2509.09372v2.pdf#page=4&selection=277,0,304,54|2509.09372v2, p.4]]
> > Key Finding 1. Regarding CR t , the middle-layer latent performs better than the deep-layer latent. Deep-layer CR t is biased towards semantic information and less effective in action generation. The middle-layer CR t effectively integrates image and text information, retains richer multimodal details, and facilitates action generation.
> 
> 结果: 中间层的Hidden State(embeds)会包含更加丰富的features, 深层的Hidden State包含的语义信息更多但是features更少. 因此中间层更适合用于Action的生成

