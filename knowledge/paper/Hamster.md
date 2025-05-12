---
tags:
  - paper
  - EmbodiedAI
  - DL
  - VLA
  - LLM
  - RL
  - algorithm
aliases:
  - "HAMSTER: Hierarchical Action Models for Open-World Robot Manipulation"
---
# Hamster

publish on: ICLR 2025

> [!paper]-
> ![[Hamster.pdf]]
## Introduce

robot数据是expensive的.

小模型效果不错

结合 大模型VLM的泛化优势 和 小模型的效率,局部robustness

## Hamster

分成两个阶段:
1. 在大规模, off-domain的数据集上finetune VLM, 生成2D path guidance
2. 基于2D path生成action

### VLM for Producing 2D Path Trained from Off-Domain Data

high-level的VLM根据单目RGB图片$\text{img}$和文字instruction $z$预测粗略的2D path $\hat p\sim\text{VLM}(\text{img},z)$, 这个路径描述机器人的end-effector(eef)在这个RGB image上的移动轨迹, 同时包含gripper的开合状态: $p=[(x_t,y_t,\text{gripper\_open}_t)]_t$. 其中坐标均为归一化之后的值, $\text{gripper\_open}$是二进制的值, 表示gripper的open或close

使用[VILA](https://arxiv.org/abs/2312.07533)作为backbone.

#### Fine-tuning Objective and Datasets

多样化off-domain dataset, 包含real-world data, visual question-answering data, simulation data.

**Pixel Point Prediction**:

使用[RoboPoint](https://arxiv.org/abs/2406.10721)数据集, 输入: image和instruction, 输出: 一个array, 包含point

**Simulated Robot Data**:

使用[RLBench](https://arxiv.org/abs/1909.12271)生成一个dataset. RL Bench是使用Franka进行tabletop manipulation的simulator

输入: camera的第一帧作为image, 以及task的instruction, 输出: 路径$p=[(x_t,y_t,\text{gripper\_open}_t)]_t$, 这个路径是真实路径通过FK和相机参数投影计算得出的

**Real Robot Data**:

使用[Bridge](https://arxiv.org/abs/2308.12952), [Open X-Embodiment](https://arxiv.org/abs/2310.08864)和[Droid](https://arxiv.org/abs/2403.12945)作为数据集, 使用RL Bench转换成类似的数据格式.

**Remark**

对于VLA而言, 提取的2D path可能会非常长. 因此使用[Ramer-Douglas-Peucker algorithm](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm)进行简化曲线.

#### Path Guided Low-Level Policy Learning

Hamster的low-level policy $\pi_\theta(a|s,o,z,p)$

policy可以在没有path的基础上学习, 但是path能够让low-level policy放弃long-horizon和语义推理, 只关注local and geometric predictions以生成robot actions

low-level可以使用proprioceptive和perceptual(e.g. depth images, 3D perceptual information: point-cloud等). 这些信息不会给high-level VLM, 而是直接给low-level policy生成robot actions

将path叠加到observation images上, 使用颜色的渐变标志时间; 叠加圆圈, 使用颜色表示gripper的开关

原始数据集$\mathcal D=\{(s_i,o_i,z_i,a_i)\}_{i=1}^N$, 使用oracle 2D paths constructed by proprioception projection, 类似[[#VLM for Producing 2D Path Trained from Off-Domain Data]]节**Simulated Robot Data**部分使用的方法. 由此可以获取训练数据集$\mathcal D_{\text{path}}=\{(s_i,o_i,z_i,a_i,p_i)\}$, 用于训练$\pi_\theta(a|s,o,z,p)$, 使得最大化$\mathbb E[\log\pi_\theta(a_i|s_i,o_i,z_i,p_i)]$

