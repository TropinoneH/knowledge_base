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

具身智能有一个问题, 就是会涉及大量的OOD(Out-of-Distribution)的数据. Deep Learning是从数据分布中学习, 而在真实世界中会有大量的OOD的场景, 因此只使用DL方法训练会让模型泛化性降低.
## Overview of Action Tokens

| Action Tokens         | details           | Advantages                                                                          | Limitations                                          | Notable Empirical Achievements                                                           |
| --------------------- | ----------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Language Description  | Language Plan     | 1. 被LLM和VLM很好支持;<br>2. 有充足的co-training数据;<br>3. long-horizon规划的必要条件                 | 1. 表达能力不完善(模糊, 难以描述灵巧的操作);<br>2. 高推理延迟               | Make bed([[pi0.5]]);<br>Make a sandwich(Hi Robot)                                        |
|                       | Language Motion   | 多任务数据共享                                                                             | 1. 表达能力不完善(模糊, 难以描述灵巧的操作);<br>2. 高推理延迟               | pull napkin from dispenser(RT-H)                                                         |
| Code                  | API               | 1. LLM很好支持;<br>2. 清晰的控制与规划逻辑;<br>3. 丰富的第三方库的支持                                      | 1. 高度依赖于预定义的API;<br>2. 脆弱的runtime execution          | Rearrange restore(Instruct2Act)                                                          |
| Affordance            | Keypoint          | 1. 精确的交互目标                                                                          | 1. 需要更好的捕获3D空间信息;<br>2. 缺少时序建模;<br>3. visual noise敏感 | Pour tea(ReKep)                                                                          |
|                       | Bounding Box      | 1. VLM支持好;<br>2. 高效instance-level定位                                                 | 同上                                                   | Dexterous grasping in cluttered scenes(DexGraspVLA)                                      |
|                       | Segmentation Mask | 1. 细粒度捕获                                                                            | 同上                                                   | Decision-making in open world(ROCKET-1)                                                  |
|                       | Affordance Map    | 1. 密集<br>2. interaction-centric<br>3. 全场景                                           | 同上                                                   | Deformable object manipulation(ManiFoundation)                                           |
| Trajectory            |                   | 1. 可以从off-domain的视频数据中学习;<br>2. 跨任务的泛化性好;                                           | 1. 有限的3D表达能力;<br>2. VLM支持有限;<br>3. 语义基础不足            | Clean the table with a duster(RT-Trajectory)                                             |
| Goal State            |                   | 1. 基础模型支持好;<br>2.                                                                   |                                                      | Transfer liquid using a pipette(VPP)<br>                                                 |
| Latent Representation |                   | 1. 有很好的数据拓展性, 从human video和cross-embodiment数据中学习;<br>2. 更好的表达潜力(紧凑的结构, 隐式语义, 多模态继承) | 1. 不可解释;<br>2. 在未来工作需要提高                             | Fold shorts(GO-1);<br>Mine diamond in Minecrafe(OmniJARVIS)                              |
| Raw Actioin           |                   | 1. 最少的人类知识;<br>2. 最少的动作token标注;<br>3. 和VLM相似的训练策略, 可以扩展到VLA;<br>4. 高效fine-tuning    | 1. 数据稀缺;<br>2. 高延迟;<br>3. cross-embodiment能力差        | Laundry fold([[pi0]]);<br>Light  a match and light a candle([[RTC\|Real Time Chunking]]) |
| Reasoning             |                   | 1. 增强对目标action的生成能力;<br>2. 复杂问题的解决能力                                                | 1. 高延迟;<br>2. 需要解决灵活推理的范式                            | Autonomous driving(DriveVLM)                                                             |
## Language Description as Action Tokens

将高级指令分解成中间的子步骤

早期的 Language Planner, Socratic Models 和 SayCan 证明了可以将高层级自然语言指令分解成有意义的子目标, 但是缺乏空间,视觉等感知信息

引入显式grounding:
- Socratic Model: 分解成subtask, 然后转换成对VLM的提问, 使用VLM返回每个物体的文字描述
- SayCan: 将所有的可能的subtask给到VLM, VLM给出每个动作打分(成功率)
- Inner Monologue: 使用VLM进行反馈
- DoReMi: 使用VLM判断是否有约束被违反, 如果有, 那么会停止当前的动作

> [!tip]
> grounding指的是将语言与外界感知(如, 2D image, spatial, 3D point cloud等)对齐

但是external grounding模型无法和LLM协同推理. 使用多模态的方式:
- PaLM-E: Vision, Embodiment, Language统一
- EmbodiedGPT: 拼接已经pretrain的模型, 简单fine-tune
- ViLa: 使用GPT-4V, 证明不需要微调, VLM可以直接提到planner
- 3D-VLA和RoboMamba: 使用3D信息, 引入规划循环

后续发展而超过了grounding, 引入memory和reflection机制:
- BUMBLE和ReflectVLM引入了上述机制, 使系统能够处理相互依赖的subtasks

这之前的更多倾向于在pre-defined skill sets中进行规划, 后续更倾向于更泛化的方法:
- Hi Robot和[[pi0.5]]

分层框架. 高层级的VLM输出plan, 低层级的policy model负责输出可执行的action
- [[pi0.5]]更关注于subtask方向分解(整理卧室$\rightarrow$叠被子)
- RT-H更关注于action方向的分解(整理卧室$\rightarrow$双手抓住被子)
### Advantages of Language Descriptions
- 与LLM无缝集成
- 丰富的co-training数据, 在更广泛的数据上训练能够有更好的泛化能力
- 适用于长时间规划
- 语言的可解释性, 可以人为监督和干预, 提高安全性,透明性和可控性
### Discussion and Future Direction
- imperfect expressiveness 不完美的表达能力
- latency 高延迟
## Code as Action Tokens
通过让VLM调用robot control API来控制机器人动作

能利用丰富的第三方库, 能在高层级的语言指令和低层级的动作控制之间构建透明桥梁

- Code as Policy利用GPT-3或Codex, 生成Python代码片段
- ProgPrompt在上述基础上使用FSM(有限状态机)拓展了代码生成的过程
- ChatGPT for Robotics探索了free-form对话, code prompting, XML tags和closed-loop reasoning
- Instruct2Act: LLM生成伪代码, 感知模型(SAM, CLIP等)根据伪代码的需求找到对应的坐标, 然后传给机器人执行
- RoboCodeX: 多信息融合, 引入[[2025-04-09#CoT Tot ToT|ToT]]

也可以用于高层级的规划
- RoboScript: 引入unified code generation pipeline
- Chain-of-Modality: 结合多种模态, 从多种模态中学习
### Brittleness and Challenges
- 受到pre-defined code set的限制
- 由于代码预定义了一些假设, 因此在复杂的真实环境中, 这些假设可能并不能满足, 导致execution brittleness
### Future Direction
1. 开发全面的API库
2. 在生命周期(验证API, 生成代码, 调用, ...)中集成"形式化验证"(通过数学形式证明这种情况下不会违反precondition)
3. 利用代码的可解释性实现有效的人机合作
## Affordance as Action Token
VLA中, affordance指的是structured and spatially grounded action token(有结构,空间属性的action token), 连接了Visual Perception和Physical Interaction

主要探索了keypoints, bounding box, segmentation mask和affordance map等方向.
- keypoints: 提供精准定位
- bounding box: 比较粗糙, 适用于general object selection
- segmentation mask: 捕捉更精细的轮廓, 适用于细粒度的交互场景
- affordance map: 提供更加密集, scene-level的交互概率, 给出交互精度,计算复杂性,计算性能之间的权衡
### Keypoints: Precise Interaction Anchors
通常定义为$[k,d],k,d\in\mathbb R^3$, $x$表示接触位置, $d$表示交互方向

VLM可以结合空间理解, 给VLA提供空间信息
- KITE通过预测task-relevant keypoints, 将language instruction和visual scene对齐
- RoboPoint在此基础上构建数据集, 用于VLM的微调, 使模型能够找到满足relational constraints的点
- CoPa通过将VLM的先验知识融入到coarse-to-fine grounding pipeline中, 提高了空间定位能力
- KUDA引入两级闭环控制, 促进模型的鲁棒性规划
