---
tags:
  - EmbodiedAI
  - LLM
  - VLA
  - paper
  - DL
aliases:
  - Learning Visual Parkour from Generated Images
---
# Lucid Sim

> [!paper]-
> ![[2411.00083v1_LucidSim.pdf]]
## Introduce

使用mujoco渲染深度图像和semantic masks, 给controlnet. 然后从已知场景几何图形和camera pose的变化中计算真实的dense optical flow, 用于生成continuous and consistency的frames
## Lucid Sim

通过generative modal的先验知识填补环境信息的空白, 称为 Prior-Assisted Domain Generation(PADG).

使用GPT生成diverse, structured prompts, 包含 `title block`, `details of the request`, 并要求返回JSON的`structured outputs`. `request`包含 天气,时间,照明,文化场所 等信息. 用于生成略微不同但是大致一样的图片信息

%% TODO %%