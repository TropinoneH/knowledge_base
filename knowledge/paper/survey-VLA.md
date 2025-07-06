---
tags:
  - paper
  - survey
  - algorithm
  - VLA
  - EmbodiedAI
  - LLM
  - Vision
---
# Survey on VLA

> [!paper]-
> ![[2507.01925v1_VLASurvey.pdf]]

## The Evolution of Language and Vision Foundation Models
### Language Foundation Models

从[[Transformer]]开始, 有很多引入的内容.

如BERT, Next Token Prediction, GRPO, [[Mamba]], MoE等架构, 和张量并行, 模型量化等方法.
### Vision Foundation Models

CLIP将语言与图片信息对齐, SigLIP将sigmoid函数代替softmax以提高效率, DINO自监督学习

Depth Anything用于单目相机下的深度估计, SAM2将图片分割能力拓展到视频, CoTracker引入Transformer架构

GLIP将CLIP拓展到区域级别, Grounding DINO 1.5使用DETR风格架构有SOTA效果, Grounding SAM结合Grounding DINO和SAM2, 零样本分割

视频生成: DALL-E, StableDiffusion等模型, ControlNet学习空间架构
### Vision-Language Models
BLIP: ViT+BERT的encoder-decoder架构, BLIP-2使用Q-Former

Flamingo使用Perceiver Resampler和gate cross-attention layer的方式进行跨模态对齐, LLaVA使用简单Linear层将CLIP和LLM对齐, LLava2使用MLP代替Linear层

Qwen2-VL使用position-aware cross-attention adaptor将ViT和Qwen LLM对齐, Qwen2.5-VL拓展到时间领域, 使用M-RoPE旋转位置编码对齐时间

PaliGemma是Gemma 2B和SigLIP+So400m组合的VLM, 后续用于[[pi0]], [[pi0.5]]系列模型
### Embodied VLA Models as the Next Frontier

