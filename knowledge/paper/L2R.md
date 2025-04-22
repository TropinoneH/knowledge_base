---
tags:
  - LLM
  - algorithm
  - paper
  - RL
  - DL
aliases:
  - Language to Reward for Robotic Skill Synthesis
---
# Language to Reward for Robotic Skill Synthesis

> [!paper]-
> ![[2306.08647v2_L2R.pdf]]


使用LLM定义reward parameter以增强[[09-RL|RL]]

## Method

### Background and Reward Interface

定义MDP问题: $(S,A,R,P,p_0)$, 其中$S$是state space, $A$是action space, $R:S\times A\mapsto\mathbb R$是reward function, $P:S\times A\mapsto S$是动态方程(在经过action之后得到state), $p_0$是initial state distribution.

给定奖励函数$R$, optimal controller能找到最大化reward的动作序列$a_{1:H}=\{a_1,\cdots,a_H\},J(a_{1:H})=\mathbb E_{r=(s_0,a_0,\cdots,s_{H-1},a_{H-1},s_H)}\sum_{t=0}^HR(s_t,a_t)$, 其中$H$是roll-out horizon

假设reward有特殊的形式, 满足MJPC:
$$R(s,a)=-\sum_{i=0}^Mw_i\cdot n_i(r_i(s,a,\psi_i))$$
其中
- $w_i\in\mathbb R$是权重
- $n_i(\cdot):\mathbb bR\mapsto\mathbb R_+$是二阶可微的范数(norm), 最小值为$0$
- $r_i\in\mathbb R$是残差, 当$r_i=0$的时候达到最优
- $\psi_i$是第$i$项的参数

使用LLM调整$w_i$和$\psi_i$, 自动生成针对不同task的reward
### Reward Translator

**Motion Description**
- 使用Motion Descriptor LLM, 将user input解释和拓展成描述期望的robot motion的自然语言描述
  - 可以对比较简单的任务生成reward, 对于复杂任务经常失败
  - 但是可以对复杂任务的motion生成description
- 因此使用template, 让LLM直接生成Motion的自然语言description

**Reward Coding**

使用LLM生成reward function的API调用

### Motion Controller

使用Model Predictive Control(MPC).

每一步MPC规划一个sequence的optimized action $a_{1:H}$, 并将其发送给robot. robot执行之后将state返回给MJPC planner, MJPC生成下一步的plan.









