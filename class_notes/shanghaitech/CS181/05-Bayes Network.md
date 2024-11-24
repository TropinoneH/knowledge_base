# Bayes Network

CPT: Conditional Distributions Tabel

独立: 
$$
\forall x,y\ P(x,y)=P(x)P(y)\\
\text{or }\forall x,y\ P(x|y)=P(x)\\
\text{or }\forall x,y\ P(y|x)=P(y)
$$


条件独立: 给定某个条件下, 两个事件相互独立
$$
\forall x,y,z\ P(x,y|z)=P(x|z)P(y|z)\\
\text{or }\forall x,y,z\ P(x|y,z)=P(x|z)\\
\text{or }\forall x,y,z\ P(y|x,z)=P(y|z)
$$
写作$x\perp\!\!\!\perp y|z$

链式法则chain rule:
$$
P(x_1,x_2,x_3,\cdots)=P(x_1)P(x_2|x_1)P(x_3|x_2,x_1)\cdots
$$
可以在使用链式法则的时候使用条件独立化简条件:

e.g.: Traffic, Umbrella, Rain

$\text{P(Traffic, Umbrella, Rain)=P(Rain)P(Traffic|Rain)P(Umbrella|Traffic,Rain)=P(Rain)P(Traffic|Rain)P(Umbrella|Rain)}$



对于某一个子节点:

- 假设父节点的domain为$d_i$
- 假设该节点的domain为$d$
- 每一行之和是1
- 那么该节点的复杂度(参数量)是$(d-1)\prod_id_i$
- $(d-1)$的原因是行之和为1

![image-20241030140135379](./05-Bayes%20Network.assets/image-20241030140135379.png)



对于一个Bayesian Network:

- $n$个变量
- 最大的domain是$d$
- 最大的父节点数量是$k$

$\Rightarrow$ 全联合概率密度分布是$O(d^n)$

$\Rightarrow$ Bayes Net的空间是$O(n\cdot d^{k+1})$

## Markov Blanket

给定父节点, 子节点, 子节点的父节点, 然后该节点与其他所有节点条件独立

- causal chain

  Global semantic: $P(x,y,z)=P(x)P(y|x)P(z|y)$

  $P(z|x,y)=\frac{P(x,y,z)}{P(x,y)}=\frac{P(x)P(y|x)P(y|z)}{P(x)P(y|x)}=P(z|y)$

  给定$Y$, 有$X\perp\!\!\!\perp Z|Y$

  ![image-20241030102642664](./05-Bayes%20Network.assets/image-20241030102642664.png)

- Global semantic: $P(x,y,z)=P(y)P(x|y)P(z|y)$

  $P(z|x,y)=P(z|y)$

  给定$X$, 有$Z\perp\!\!\!\perp Y|X$

  ![image-20241030103231563](./05-Bayes%20Network.assets/image-20241030103231563.png)

- 若不给定$Z$, 那么$X\perp\!\!\!\perp Y$

  给定$Z$, 有$X$与$Y$不独立

  ![image-20241030103253867](./05-Bayes%20Network.assets/image-20241030103253867.png)

![image-20241030103613018](./05-Bayes%20Network.assets/image-20241030103613018.png)灰色节点表示是given nodes, 即给定的条件(或者说block的nodes)

这里的Active Triple表示dependent, Inactive Triple表示Conditional Independent

判断两个节点是否是条件独立, 那么可以看这条路径是否是Inactive的.

查询是否条件独立的编程思想: 

- 第一层循环遍历所有的路径
- 第二层循环遍历所有的Triple

<span><img src="./05-Bayes%20Network.assets/image-20241030104139722.png" alt="image-20241030104139722" style="zoom:33%;" /><img src="./05-Bayes%20Network.assets/image-20241030104202909.png" alt="image-20241030104202909" style="zoom:33%;" />$T$和$D$节点有两个路径, 只有第二条能够全部Inactive</span>

> 来自[CS182-notes.md](https://github.com/TropinoneH/CS182/blob/slides/CS182%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E5%BC%95%E8%AE%BA.md):
>
> D-separated
>
> ```mermaid
> graph TB
> X-->Y-->Z
> M-->N
> M-->P
> A-->B
> C-->B
> ```
>
> 这个时候，有三种情况：
>
> 1. 第一种原来是条件不独立，给定$Y$之后变成条件独立
> 2. 第二种原来条件不独立，给定$M$后条件独立
> 3. 第三种原来条件独立，给定$B$之后条件不独立
>
> 可以认为，两者之间如果有一条通路，那么就算是条件独立。但是注意第三种，给定$B$之后不是将通路打断，而是把断掉的通路合成

e.g.

![image-20241030140839533](./05-Bayes%20Network.assets/image-20241030140839533.png)

## Node Ordering

每一个模型的假设是不同的, 即可以认为是$X\rightarrow Y$也可以认为是$Y\rightarrow X$

但是每一种假设会有不同的计算复杂度和不同的空间复杂度

如果Bayes Network建模的是因果关系, 那么会高效很多

## Markov Network

可以看作是无向图+势函数的结合

Bayes Network是有向无环图来建模, Markov Network是无向有环图来定义的



Clique: 一个完全图(全连接)

Maximal Clique: 最大的全连接的图

![image-20241030141057673](./05-Bayes%20Network.assets/image-20241030141057673.png)

定义势函数$\psi(x_c)>0$针对Clique(或者Maximal Clique).

对于联合概率, 与势函数的乘积成比例:

$P(x)=\frac{1}{Z}\prod_C\psi_C(x_C)$, 其中$Z=\sum_C\psi_C(x_C)$是归一化系数

> Markov Blanket: 所有与该节点直接相连的节点组成Markov Blanket
>
> ![image-20241030141148032](./05-Bayes%20Network.assets/image-20241030141148032.png)

e.g.

![image-20241030105816978](./05-Bayes%20Network.assets/image-20241030105816978.png)

定义每个pixel $x_i$,  定义pixel对应是否是想要的分类 $y_i$

定义势函数$\psi(x_i,y_i)=\exp(w^T\phi(x_i,y_i))$ where $\phi(x_i,y_i)$ is feature vector

定义势函数$\psi(y_i,y_j)=\exp(\alpha \mathbf{I}(y_i=y_j))$表示相邻的两个点之间更可能是相同的分类

如果有更复杂的网络结构, 那么分类的准确率会更大

<span><img src="./05-Bayes%20Network.assets/image-20241030110317976.png" alt="image-20241030110317976" style="zoom:33%;" /><img src="./05-Bayes%20Network.assets/image-20241030110335833.png" alt="image-20241030110335833" style="zoom: 33%;" /></span>

### Convert Bayes Network to Markov Network

<span><img src="./05-Bayes%20Network.assets/image-20241030111505010.png" alt="image-20241030111505010" style="zoom:27.5%;" /><img src="./05-Bayes%20Network.assets/image-20241030111528746.png" alt="image-20241030111528746" style="zoom:25%;" /></span>

Moralization: 

Bayes Network中, 相关的关系不一定体现在边的连接上. 但是在Markov Network中, 只有相连的两个节点才会有关系. 所以在转换的过程中, 需要把相关的两个点添加边连接



Steps:

- Moralization
- Construct potential functions from CPTs

Bayes Network和Markov Network编码了同样的分布

但是并不是编码相同的条件独立性

> 如, 在第二张图中, 我们可以认为Markov Network的建模中, $x_2,x_4$共同影响$x_1$.
>
> 但是Bayes Network中, $x_4$不能影响$x_1$

认为Bayes Network和Markov Network更接近于谓词逻辑PL(相较于一阶谓词逻辑FOL)

可以认为BN和MN是带有概率的拓展PL

## CRF Conditional Random Field

生成式模型: 建模一个分布: $P(X_1, X_2,\cdots, X_n)$

- Bayes Network和Markov Network都是Generative Model

判别式模型: 只建模$P(Y_1,\cdots,Y_n|X)$, 不建模$P(X)$

- CRF, Image Segmentation



CRF的概率:
$$
P(y|x)=\frac1{Z(x)}\prod_C\psi_C(y_C,x)\\
Z(X)=\sum_y\prod_C\psi_C(y_C,x)
$$
applications:

- NLP
  - Pos tagging
  - Named entity recognize
  - Syntactic parsing
- CV
  - Image Segmentation
  - Posture Recognize

![image-20241030144438372](./05-Bayes%20Network.assets/image-20241030144438372.png)