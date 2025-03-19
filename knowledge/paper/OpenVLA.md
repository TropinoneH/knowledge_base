---
tags:
  - paper
  - EmbodiedAI
  - LLM
  - VLA
aliases:
  - "OpenVLA: An Open-Source Vision-Language-Action Model"
---
[[OpenVLA：An Open-Source Vision-Language-Action Model.pdf]]
# OpenVLA

7B-parameter vision-language-action model, [[Transformer]]

基于`Llama 2`, 结合使用了`DINOv2`和`SigLIP`的pretrained visual encoder. 可以使用[[LoRA]]进行微调.

## Intro

VLA弱点: 泛化能力受限. 单一指令集对于新的初始条件(position, lighting)能够泛化, 但是对于新的物体或场景干扰物品缺乏鲁棒性

使用现有的VLM作为核心组件, 用于训练泛化的policies

OpenVLA基于VLM, 在Open X-Embodiment数据集上fine-tune

## Related work

VLM: 原先是直接cross-attention, 现在是patch-as-token的方法

Generalist Robot Policies: 先前的Octo等工作是通过policy learning将visual encoder,language embeddings和额外的组件缝合在一起. OpenVLA更加end-to-end, 将robot actions看作token, 直接对VLM进行fine-tune, 生成robot actions. 这能提高泛化能力

VLA: 直接对VLM进行fine-tune生成actions. 直接将robot action control融合到VLM的backbone中. 有三个好处: 1. 在large Internet-scale dataset上对齐pretrained vision and language components. 2. 使用generic architecture, 不是专门给robot action的架构, 少量修改即可扩展到billion级别参数的训练. 3.为robotics提供一个direct pathway去快速利用VLM.

## Methods

### VLM

VLM有三个组成部分. 分别是visual encoder(将image inputs映射成"image patch embeddings"), projector, LLM backbone

使用Prismatic-7B, visual encoder(600M param, 两部分, SigLIP+DINOv2(更强的空间推理, 有助于robot, 生成的特征向量拼接), projector(2-layer MLP), LLM(Llama 2)

### OpenVLA

为了能够让VLM预测robot action, 将continuous的action使用tokenizer映射成离散的token.

按照[[RT-2]]的方法, 将每一个动作维度discrete成256个区间. 对于每一个动作维度, 将每一个区间quantize到$1\sim99$. 使用quantile是为了能够忽略training set中的异常动作. `Llama 2`仅仅保留了100额外token可以添加, 因此选择覆盖最后256个token(是最不常用的token)

### Training Data

使用Open X-Embodiment的数据训练.

### OpenVLA Design Decisions

使用$224\times224$px的图片进行训练. 在VLM中提高分辨率能提高性能, 但是暂时在VLA中没有发现这一点.

需要fine-tune video encoder. 会对VLA更好.

最终27个epochs on full dataset

learning rate: fixed $2e-5$