---
tags:
  - paper
  - EmbodiedAI
  - LLM
  - VLA
  - DL
aliases:
  - "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control"
publish: CoRL 2023
---
# RT-2

> [!paper]-
> ![[RT-2.pdf]]

end-to-end训练. 使用[[CoT|chain of thought]]可以使 RT-2 执行多阶段inference, 例如确定哪个物体可以作为临时的锤子(e.g. a rock)
## Intro

training set中的visual-action只占一半左右, 因为要防止LLM忘记之前学到的VLM的内容. 只在固定的情境中输出robot action.

直接训练一个vision-language model, 用于open-vocabulary visual question answering和visual dialogue, 使其直接输出low-level的robot actions.

> [!tip]
> open-vocabulary: 不局限于training dataset中的vocabulary, 对未见过的新的vocabulary也能进行回答.
> 
> 利用CLIP, BLIP, Flamingo等对图片进行encode, 利用GPT等[[Transformer]]架构LLM进行decode和generate

通过将action -> action token然后align with language token创建multimodal sequence来训练.

## Related Work

CLIP: 学习image和text的share embeddings

泛化: 使用pretrained VLM学习到的对真实世界的知识, 对新场景进行泛化

## VLA

使用PaLI-X和PaLM-E作为VLM

### Robot-action Fine-tuning

使用类似[[RT-1]]的方法, 将连续的action space离散化.

action space包含: 末端的6个自由度的位移旋转, gripper的伸展, 是否终止:
$$\text{terminate}\quad\Delta\text{pos}_x\quad\Delta\text{pos}_y\quad\Delta\text{pos}_z\quad\Delta\text{rot}_x\quad\Delta\text{rot}_y\quad\Delta\text{rot}_z\quad\text{gripper\_extention}$$
每一个continue dimension被discrete成256个bin. 因此需要256个额外token

但是对于PaLM-E而言不提供额外的token. 因此覆盖掉最不常用的256 tokens. 这已经被证实是对VLM效果良好.

**co-fine-tuning**

在robot-action和image-text数据上同步微调, 为了防止VLM遗忘原先学到的关于真实世界的知识. 能提高泛化能力.

**output constraint**

为了确保在decode的时候输出valid action tokens, 通过prompt约束, 只在robot-action task的时候输出action tokens, 其他时候正常输出natural language tokens

## Experiments

**chain of thought**

使用分步的输出来进行思考, 添加了Plan步骤. 如: "Instruction: I'm hungry. Plan: pick rxbar chocolate. Action: 1 128 124 136 121 158 111 255"