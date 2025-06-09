---
tags:
  - paper
  - LLM
  - Vision
  - DL
aliases:
  - A Simple LLM Framework for Long-Range Video Question-Answering
publish: EMNLP 2024
---
# LLoVi

> [!paper]-
> ![[2312.17235v3_LLoVi.pdf]]

motivate: 短视频理解是可行的, 但是拓展到长视频并不简单. 通过短期视觉描述器结合LLM, 完成长视频的理解.

1. 将长视频输入segment into多个短视频, 使用pretrained visual captioner (BLIP2, LaViLa, LLaVA, ...)提取textual descriptions
2. 按顺序拼接caption, 给LLM(如, GPT-3.5, GPT-4, LLaMA, ...)

**Details**:
1. down sample到2 fps, 使用CogAgent为每一帧生成caption
2. 对于长序列, 进行多轮LLM生成, 第一步是总结(将大量的caption进行总结)
3. 使用GPT-4作为LLM进行问答

相关文章: [[VideoTree]]