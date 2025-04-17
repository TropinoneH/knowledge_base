---
tags:
  - EmbodiedAI
  - paper
  - LLM
  - DL
aliases:
  - RoCo Dialectic Multi-Robot Collaboration with Lar
---
[[RoCo Dialectic Multi-Robot Collaboration with Lar.pdf]]
# RoCo

使用LLM进行高层通信和低层路径规划, 提供环境反馈. 引入了RoCoBench, 多机器人写作的基准测试.

## Introduce

使多机器人合作, 需要对高层的任务有理解, 并考虑每一个机器人的能力.

提出了RoCo, 一种零样本(zero-shot)多机器人协作的方法:
- 对话式任务协调: 将每一个robot委托给一个LLM代理, 使robot可以使用natural language进行讨论
- LLM生成并通过反馈改进的子任务计划: multi-agent的对话最终会为每一个代理生成一个子任务. 提供反馈(如碰撞和IK failed), 直到LLM提出一个合理的方案
- 基于LLM的关节空间运动规划: 验证后的子任务中, 提取robot joint space中的目标配置(goal configuration), 使用centralized RRT-sampler去规划motion trajectories. (利用了LLM的3D空间推理)
	- 给定任务空间中的起点, 目标和障碍物位置, 展示了LLM可以生成可以包含任务语义和环境约束的路径点, 并显著降低了运动规划的采样复杂度?

RoCoBench:
- 6 robot, multi-agent cooperator

## Preliminaries

**任务假设**:
- 含有$N$个robot agent, 有限时间$T$, 完全观测空间$O$
- 第$n$-th个代理有观测空间$\Omega^n\subset O$. agent可能有非对称的观测空间, 因此通讯是必要的.
- define description functions $f$, 任务语义$g$, observation variable over time-step $t$: $o_t\in\Omega^n$, 得到自然语言的描述$l_t^n=f^n(g^n,o_t)$
- 定义解析函数, 将自然语言的任务描述映射到具体的子任务. 这些子任务can be described by one or more gripper goal configuration

**多臂路径规划**:
- $\mathcal X\in\mathbb R^d$是所有$N$个机器人臂的关节配置空间. $\mathcal X_{ob}$是configuration space中的obstacle, 无碰撞空间为$\mathcal X_{free}=\mathcal X/\mathcal X_{ob}$
- 初始条件$x_{init}\in\mathcal X_{free}$, 目标区域$x_{goal}\in\mathcal X_{free}$
- 找到一条最优路径$\sigma^*=[0,1]\to\mathcal X$, 满足$\sigma^*(0)=x_{init},\sigma^*(1)=x_{goal}$

## Multi-Robot Collaboration With LLMs

![[Pasted image 20250319210113.png]]

### Multi-Agent Dialog via LLMS

使用[[Transformer]] based LLM进行生成对话和action.

需要通信协调agents非对称的observation space

每次环境交互之前先进行一轮对话, 

### LLM-Generated Sub-task Plan

当一轮对话结束时, 最后一个发言的LLM会进行summary一个plan, 其中每一个agent获取一个子任务, 并可选地获得一个任务空间中的3D路径点. 先进行验证:
1. 文本解析: 确保遵循格式, 以及包含了固定的关键词
2. 任务约束: 检查每一个动作是否符合任务和代理的约束
3. IK: 检查每一个机械臂的位置能否通过IK抵达
4. 碰撞检测: 检查通过IK求解的机器人的关节臂配置是否会导致collision
5. 有效路径点(可选): 如果任务需要路径规划, 每个中间路径点需要通过IK求解并保证no collision, 并且所有步骤分布均匀

### LLM-informed Motion Planning in Joint Space

task通过验证之后, 使用IK生成目标配置, and optionally each step of the task space waypoint paths produces an intermediate goal configuration. goal configuration通过RRT-based multi-arm motion planner, 然后输出每个robot的motion trajectories, 在环境中执行

使用centralized collision-checking and planning for the multi-arm motion planner, 因为environment的几何信息更容易收集和规划

## RoCoBench

提出了三个关键属性:
- 任务是否能够分解
- 观测空间是否共享(这个纯粹是人为设置)
- 工作空间重叠

| 任务         | 任务分解 | 观测空间 | 工作空间重叠 |
|--------------|----------|----------|--------------|
| 清扫地板     | 并行     | 非对称   | 中           |
| 打包杂货     | 并行     | 共享     | 中           |
| 移动绳索     | 并行     | 共享     | 高           |
| 整理橱柜     | 顺序     | 非对称   | 高           |
| 制作三明治   | 顺序     | 非对称   | 低           |
| 分类立方体   | 顺序     | 共享     | 低           |

目的是评估:
- 任务分解与分配
- 通信与协调
- 适应性与鲁棒性
- 低层运动规划