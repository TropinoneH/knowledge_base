---
tags:
  - paper
  - RL
  - DL
  - LLM
publish: NeurIPS 2023
---
# Learning Goal-Conditioned Representations for Language Reward Models

> [!paper]-
> ![[2407.13887v2_Learning Goal-Conditioned Representations for Language Reward Models.pdf]]

motivate: 改进reward model学习的repr, 以实现language model的对齐.

提高了数学推理中识别 正确/错误的solution 的能力

使用 RLHF + [[09-RL|RL]] 的范式
## Method

### Preliminaries

**Preference ranking reward modeling for LMs**

奖励模型参数化: $r(x,y)\rightarrow\mathbb R$. 给定prompt $x$和completion sequence of tokens $y=[y_0,\cdots,y_T]$, 返回一个scalar reward. 给定preference triple $(x,y^w,y^l)$组成的数据库, 有Loss:
$$\mathcal L^R=-\frac{1}{|D|}\mathbb E_{(x,y^w,y^l)\in D}[\log\sigma(r(x,y^w)-r(x,y^l))]$$
其中reward model $r(x,y)$是 对整个 $y$ 提供标量反馈
