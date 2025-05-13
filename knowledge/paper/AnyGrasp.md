---
tags:
  - paper
  - algorithm
  - DL
  - EmbodiedAI
aliases:
  - "AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains"
---
# Any Grasp

T-RO (IEEE Transactions on Robotics)

> [!paper]-
> ![[2212.08333_AnyGrasp.pdf]]
## Introduce

弥合机器人与人类对于抓取的感知的差距, 结合物体center of gravity(COG)重心感知

问题: 缺少数据集; 解决: 仍然使用真实世界数据(而不是Sim2Real), 使用静态场景
## Related Work

**Grasp Pose Detection**

通常在完整的笛卡尔空间内. 早期 假设物体有完整的2D/3D知识, 或者将物体近似为一组原始形状. 后期使用在点云上进行采样, 然后使用神经网络评估抓取效果.

但是上述是在静态场景. 提出generation-associate的抓取方法

**Continuous Action Learning for Grasping**

直接将observation映射到action space(不是本文的内容, 偏向[[pi0]],[[RT-1]],[[RT-2]],[[RDT-1B]]等, 传统的 #VLA 也是类似)

**Training Data for 6-DoF Grasping**

144 object组成的数据集

## AnyGrasp Design Principles

定义抓取姿势为 $\mathcal G=[\mathbf R\quad\mathbf t\quad w]$, 其中$\mathbf R\in\mathbb R^{3\times3}$表示gripper orientation, $\mathbf t\in\mathbb R^{3\times1}$表示抓取重心, $w\in\mathbb R$表示抓取target需要的最小gripper宽度

定义抓取成功的指示变量为 $s(\mathcal E,\mathcal P,\mathcal G)$, 其中$\mathcal E$是环境信息, $\mathcal P$是摄像机观测转换的点云, 表示在环境$\mathcal E$下观测到点云$\mathcal P$, 使用$\mathcal G$的欻去成功的概率

引入时间维度$t$, 定义$\text{dist}(\mathcal G_k^t,\mathcal G_k^{t-1}|\mathcal E^t,\mathcal E^{t-1})$表示 在target坐标系中, 成对的两个grasp pose在两个时刻的距离

目标: 找到一组抓取, 最大化成功的概率:
$$\begin{aligned}G^*&=\{\mathcal G_1^*,\cdots,\mathcal G_n^*\}=\mathop{\arg\max}_{|G|=n}\sum_{\mathcal G_i\in G} P(s=1|\mathcal E,\mathcal P,\mathcal G_i)\\\text{s.t. }&\text{dist}(\mathcal G_k^t,\mathcal G_k^{t-1}|\mathcal E^t,\mathcal E^{t-1})\leq\delta\quad\forall\mathcal G_k^{t-1}\in G^{t-1}\end{aligned}$$
其中$\delta$是误差容差

### Spatial-Continuous Learning

使用[[#Geometry processing module|几何处理]]模块, 直接感知场景的单视角点云, 并在$\mathbb R^6$的空间中判断抓取质量

将整个场景输入:
1. 使用卷积网络, 能够同时考虑相邻区域的几何结构
2. 通过找中心的方法拟合重心, 考虑COG以提高稳定性
3. 考虑障碍物避免碰撞

### Temporal-Continuous Learning

为了grasp平稳且一致的移动, 需要两帧之间的grasp pose有较小的SE(3) distance

## Methods and Materials
### data collision

主要使用[[GraspNet-1B]]的训练集, 额外添加三个标签.
1. 添加0.5cm的抓取深度
2. 定义稳定性分数: 抓手平面与COG之间的归一化垂直距离. 该分数越低, 表示抓取更稳定, 抗干扰性越强. 由于无法通过视觉计算COG, 因此假设中心就是重心
3. 将两帧的object关联, 保证时间一致性.
   $$\begin{aligned}\Delta\mathbf R&=\frac{\text{tr}(\mathbf R_1^\top\mathbf R_2)-1}{2}\\\Delta\mathbf t&=\|t_1-t_2\|\end{aligned}$$
   其中$\mathcal G_1=[\mathbf R_1\quad\mathbf t_1\quad w_1]$和$\mathcal G_2=[\mathbf R_2\quad\mathbf t_2\quad w_2]$是转换后相同坐标系(如, target object坐标系)下的grasp pose. 因此定义两个pose的距离:
   $$d(\mathcal G_1,\mathcal G_2)=\frac{\Delta\mathbf t}{w_{\text{max}}}+\gamma\frac{\Delta\mathbf R}{\pi}$$
### Grasp Perception Model Details
![[Pasted image 20250509180022.png]]

#### Geometry processing module
![[Pasted image 20250509180051.png|几何处理模块]]

基于GSNet

1. 输入点云$\mathcal P$, 使用3D-Conv提取features
2. 使用MLP生成object mask和指示可抓取概率的heatmap
3. 执行Graspable FPS(可抓取最远端采样, Graspable Farthest Point Sampling): 根据object mask和heatmap, 从场景中采样$M$个seed point
4. 使用MLP生成300个view score, 给Graspable PVS(可抓取概率视图, Graspable Probabilistic View Selection), 选择抓取的view
5. Cylinder Grouping圆柱体分组模块沿该view对object的局部几何特征进行分组
6. 使用MLP对每个分组预测48个grasp pose的grasp score, 这些pose由12个in-plane的旋转和4个approach depth和48个grasp width组成

inference时, 将原始分数$\times(1-\text{stability\_score})$作为最终分数, 保证稳定性

#### Temporal association module

**为每个Pose构建特征向量**

1. 给定输入点云, [[#Geometry processing module]]返回$M$个seed point. 同时, 返回在前几层计算获得的features
2. 使用cylinder grouping的方法对RGB信息分组, 其中输入的seed features被替换成RGB信息. 对于每一个seed point, cylinder分成$K$个点, 因此最终有$M\times K\times3$的shape
3. 使用MLP forward+Pooling, 得到color feature
4. 将color feature(刚刚获得的), seed feature, pose feature(GSNet中生成的), pose(GSNet最终结果)拼接, 给MLP, 生成$C$大小的特征向量

**计算相似分数**

假设特征向量是$\mathbf f_1,\mathbf f_2$, 抓取pose是$\mathcal G_1,\mathcal G_2$, 那么correspondence score:
$$s_{\text{corr}}(\mathcal G_1,\mathcal G_2)=\frac{\mathbf f_1\cdot\mathbf f_2}{\|\mathbf f_1\|\|\mathbf f_2\|}$$

计算所有的$s_{\text{corr}}$, 得到矩阵

训练过程中, 将其作为[[#Loss Function]]

inference时, 将计算得到的features vectors储存到temporal buffer, score matrix是通过当前的features和buffer中的features计算得到的. 因此如果想track某$n$个确定向量, 那么把$n$个向量的feature vectors和当前的seed的feature计算分数, 找到top-$n$ score的pose

#### Loss Function

$$\mathcal L=\sum_{\mathcal G_1^i\in G_1}\frac{-1}{|P(i)|}\sum_{\mathcal G_j^2\in P(i)}\log\frac{\exp(s_{\text{corr}}(\mathcal G_1^i,\mathcal G_2^j)/\tau)}{\sum_{\mathcal G_2^k\in G_2}\exp(s_{\text{corr}}(\mathcal G_1^i,\mathcal G_2^k)/\tau)}$$

其中, $P(i)=\{\mathcal G_2^k\in G_2|\text{dist}(\mathcal G_1^i,\mathcal G_2^k)<\sigma\}$

### Detection Post-processing

**碰撞检测**

网络会隐式学习碰撞检测, 但是没用硬性约束. 因此对前100个pose进行检测, 基于点云, 检查gripper所表示的方格内是否有点

**gripper-centering process**

防止两侧手指中的一根提前接触object, 导致将object推开.

计算两侧手指距离接触点的距离, 然后沿接触方向平移gripper, 使object处于中间

