---
tags:
  - algorithm
  - LLM
  - RL
  - EmbodiedAI
aliases:
  - survey of LLM aided RL
---
# LLM generate reward for [[09-RL|RL]]

> [!paper]- LaRe
> ![[LaRe]]

> [!paper]- L2R
> ![[L2R]]

# RL enhance LLM

> [!paper]- MAYE
> ![[MAYE]]

> [!paper]- ToRL
> ![[ToRL]]
# Others RL with DL

> [!info]- 使用Transformer模仿RL
> # Think Before You Act
> 
> > [!paper]-
> > ![[2304.11063v1_ThinkBeforeYouAct.pdf]]
> 
> 将语言推理和环境中执行action结合起来
> 
> ## Problem Formulation
> 
> 考虑一个部分马尔可夫决策过程(Partially observable Markov decision process, POMDP), $o_t$只包含部分可观测信息.
> 
> 历史信息$h_t=(o_0,a_0,\cdots,o_{t-1},a_{t-1})$, 文本instruction $m$, 目标是找到最优的策略$\pi(a_t|m,h_t,o_t)$
> 
> training的时候在预收集的dataset上进行offline的训练. 训练时输入trajectory $(m, (o_t,a_t,c_t)_{0\leq t\leq T})$, 其中m是文本instruction, $c_t$是$t$时刻的"字幕", 但是$c_t$只在training stage时出现, inference/evaluation stage并没有$c_t$
> 
> ## Method
> 
> ### Unifying actions and language reasoning
> 
> 在记录的过程中, 将action和字幕进行统一:
> ![[Pasted image 20250420231509.png]]
> 
> ### Auto-regressive transformer for generating both language and actions
> 
> ![[Pasted image 20250421001839.png]]
> 
> 直接送给transformer进行自回归推理
> 
> ## Experiment
> 
> ### Training details
> 
> 使用GPT-2, 和对应的tokenizer
> 

> [!info]- 将RL蒸馏到DL的神经网络中
> # In-Context Reinforcement Learning with Algorithm Distillation
> 
> 将offline RL视为sequential prediction problem, 将RL policy蒸馏到causal sequence model中, 使用DL对RL建模

