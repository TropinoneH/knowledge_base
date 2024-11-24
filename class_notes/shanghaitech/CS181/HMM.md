# Background

频率派: 统计机器学习, 核心思想是定义一个Loss Function, 然后进行优化

> 一般思路:
>
> 1. 定义model: e.g. $y=w^Tx+b$ 超平面
> 2. 定义strategy: 定义优化的策略, 即定义一个Loss Function. 不同的Loss Function会偏向优化不同的方面
> 3. 算法求解: e.g. 梯度下降,随机梯度下降,牛顿法,逆牛顿法,...

贝叶斯派: 概率图模型, 核心思想是做推断, 求后验概率, 求后验概率相关的计算(方差, 期望, etc...), 采用数值积分的方式(Monta Carlo的方法有了实质的突破)

那么HMM从根本上是属于概率图模型

## 概率图模型

- 有向图: 贝叶斯网络

- 无向图: 马尔可夫随机场

  - 概率图+时间: 动态模型 Dynamic Model

    一般而言的模型, 如高斯混合模型(GMM), N个样本: $\{x_1,x_2,\cdots,x_N\}$这些样本之间是独立同分布的.

    但是Dynamic Model是在普通模型的基础上添加了时间序列. 这个时间可以认为是真实的时间, 也可以是一个抽象的时间, 也可以是一个序列(一段话, 一个句子(nlp))

    这个时候$x_i$之间就不是独立同分布(i.i.d)的了

    e.g.

    ```mermaid
    graph LR
    i1-->i2
    i1-->o1
    i2-->i3
    i2-->o2
    i3-->...
    ```

    其中, $A_i$是系统状态system state, 是隐变量, 而$o_i$是观测变量. 

    可以认为横向是时间, 或者说是序列; 纵向是混合mixture

    如果时间序列上(横向)的system state是离散的, 每一个隐变量的取值是离散的: HMM; 如果是连续, 那么判断是否是线性的. 其中一个线性的代表是Kalman Filter, 非线性的代表是Partide Filter

# Hidden Markov Model

## HMM

### 参数

假设观测变量用$o$表示, 系统状态变量用i表示

然后假设取值集合(值域): o的值域$V=\{v_1, v_2,\cdots,v_M\}$, i的取值集合(值域): $Q=\{q_1,q_2,\cdots,q_N\}$
$$
\lambda=(\pi,A,B)\\
\pi\text{: 初始的概率分布}\\
\pi=[\pi_1,\pi_2,...,\pi_N]\text{表示系统变量取值的概率.默认所有变量的初始的分布是相同的}\\
A=[\ a_{ij}\ ]\text{: 状态转移矩阵}\\
\text{其中, }a_{ij}=p(i_{t+1}=q_j|i_t=q_i)\text{ 注意这里的下标$_i$表示状态取值的第$i$个值,而$i_t$指系统变量$i$在$t$时刻的取值}\\
B=[\ b_j(k)\ ]\text{: 发射矩阵}\\
\text{其中, }b_j(k)=p(o_t=v_k|i_t=q_j)
$$

这里的$\pi_i$是指的是在初始状态下为第$i$个状态的概率, 并不是第$i$个system state的概率. 默认初始状态下所有system state的分布相同

### 假设

- 齐次马尔可夫假设

  可以简单认为是无后效性的. 也就是说, 认为未来和过去没有关系

  $p(i_{t+1}|i_t,i_{t-1},\cdots,i_1,o_t,o_{t-1},\cdots,o_1)=p(i_{t+1}|i_t)$

  即,$i_{t+1}$只和$i_t$相关, 其他的都无关

- 观测独立假设

  $p(o_t|i_t,i_{t-1},\cdots,i_1,o_{t-1},\cdots,o_1)=p(o_t|i_t)$

  即, $o_t$只和$i_t$有关

### 三个主要问题

- Evaluation

  根据初始化的参数$\lambda=(\pi,A,B)$求$P(O|\lambda)$

  常用Forward Backward Algorithm

- Learning

  求参数$\lambda$

  使用EM算法

  $\lambda=\mathop{\arg\max}p(O|\lambda)$

- Decoding

  根据O求解I. 常见两种求解:

  1. 预测, 求解$p(i_{t+1}|o_1,o_2,\cdots,,o_t)$
  2. 滤波, 求解$p(i_t|o_1,o_2,\cdots,o_t)$

  $I=\mathop{\arg\max}p(I|O)$

## Evaluation

Given $\lambda$, find $p(O|\lambda)$
$$
p(O|\lambda)=\sum_Ip(I,O|\lambda)=\sum_Ip(O|I,\lambda)p(I|\lambda)
$$

其中

$$
p(I|\lambda)=p(i_1,i_2,\cdots,i_T|\lambda)=p(i_T|i_1,i_2,\cdots,i_{T-1},\lambda)p(i_1,\cdots,i_{T-i}|\lambda)\\=p(i_T|i_1,i_2,\cdots,i_{T-1},\lambda)\cdots p(i_2|i_1,\lambda)p(i_1|\lambda)\\
\text{consider the assumption: }p(i_{t+1}|i_t,i_{t-1},\cdots,i_1,o_t,o_{t-1},\cdots,o_1)=p(i_{t+1}|i_t)\\
\Rightarrow p(I|\lambda)=p(i_T|i_{T-1})\cdots p(i_2|i_1)=a_{i_{T-1}i_T}a_{i_{T-2}i_{T-1}}\cdots a_{i_1i_2}\pi(i_1)=\pi(i_1)\prod_{t=2}^Ta_{i_{t-1}i_{t}}
$$

$$
p(O|I,\lambda)=\text{<使用观测独立假设, 类似的过程>}=\prod_{t=1}^Tb_{i_t}(o_t)
$$

因此
$$
p(O|\lambda)=\sum_I\pi(i_1)\prod_{t=2}^Ta_{i_{t-1}i_{t}}\prod_{t=1}^Tb_{i_t}(o_t)\\
=\sum_{i_1}\sum_{i_2}\cdots\sum_{i_N}\pi(i_1)\prod_{t=2}^Ta_{i_{t-1}i_{t}}\prod_{t=1}^Tb_{i_t}(o_t)
$$
注意到时间复杂度为$O(N^T)$是一个指数时间增长的, 时间复杂度非常恐怖. 所以使用另外的方法计算

### 前向算法

现在假设一个记号$\alpha_t(i)=p(o_1,o_2,\cdots,o_t,i_t=q_i|\lambda)$(注意分别作为参数的i是$q_i$的下标,而$i_t$是表示第$t$个system state)

这个记号表示第$t$个system state为$q_i$, 并且观测到的结果为$o_1,\cdots,o_t$的概率.

那么有:
$$
P(O|\lambda)=\sum_{i=1}^Np(o_1,\cdots,o_T,i_T=q_i|\lambda)\ \ \ \ \text{尝试通过累加的方式消除掉引入的$i_T$}\\
=\sum_{i=1}^N\alpha_T(i)
$$
现在通过计算$\alpha_T(i)$能化简计算:
$$
\alpha_{t+1}(j)=p(o_1,\cdots,o_{t+1},i_{t+1}=q_j|\lambda)\\
=\sum_{i=1}^Np(o_1,\cdots,o_{t+1},i_{t+1}=q_j,i_t=q_i|\lambda)\\
=\sum_{i=1}^Np(o_{t+1}|o_1,\cdots,o_t,i_{t+1}=q_j,i_t=q_i,\lambda)p(o_1,\cdots,o_t,i_{t+1}=q_j,i_t=q_i|\lambda)\\
=\sum_{i=1}^Np(o_{t+1}|i_{t+1}=q_j)p(o_1,\cdots,o_t,i_{t+1}=q_j,i_t=q_i|\lambda)\ \ \ \ \text{使用观测独立假设}\\
=\sum_{i=1}^Np(o_{t+1}|i_{t+1}=q_j)p(i_{t+1}=q_j|o_1,\cdots,o_t,i_t=q_i,\lambda)p(o_1,\cdots,o_t,i_t=q_i|\lambda)\\
=\sum_{i=1}^Np(o_{t+1}|i_{t+1}=q_j)p(i_{t+1}=q_j|i_t=q_i)\alpha_t(i)\ \ \ \ \text{使用齐次马尔可夫假设}\\
=\sum_{i=1}^Nb_j(o_{t+1})a_{ij}\alpha_t(i)
$$

### 后向传播

假定一个记号$\beta_y(i)=p(o_{t+1},\cdots,o_T|i_t=q_i,\lambda)$, 表示在给定第$t$个时刻的system state $i_t=q_i$之后, 可观测变量为$o_{t+1},\cdots,o_T$的概率

注意, $i_t$和$o_{t+1}$是正好错开了一个时序

那么有$\beta_1(i)=p(o_2,\cdots,o_T|i_1=q_i,\lambda)$

那么根据$\beta_t(i)$, 写出:
$$
p(O|\lambda)=p(o_1,\cdots,o_T|\lambda)\\
=\sum_{i=1}^Np(o_1,\cdots,o_T,i_1=q_i|\lambda)\\
=\sum_{i=1}^Np(o_1,\cdots,o_T|i_1=q_i,\lambda)p(i_1=q_i|\lambda)\\
=\sum_{i=1}^Np(o_1|o_2,\cdots,o_T,i_1=q_i,\lambda)p(o_2,\cdots,o_T|i_1=q_i,\lambda)\pi_i\\
=\sum_{i=1}^Np(o_1|i_1=q_i)\beta_1(i)\pi_i\\
=\sum_{i=1}^Nb_i(o_1)\pi_i\beta_1(i)
$$
现在推导$\beta_t(i)$的地推表达式

> 引论: D-seperated
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
>
> - 马尔科夫毯：Markov Blanket
>
>   $X_{MB_i}$：一个点$X_i$的所有的直接父节点，子节点，联合父节点（直接子节点的直接父节点）组成的一部分
>
>   那么给定$X_{MB_i}$之后，$X_i$和$X_{\bar{MB_i}}$条件独立$\Rightarrow X_i\perp\!\!\!\perp X_{\bar{MB_i}}|X_{MB_i}$

$$
\beta_t(j)=p(o_{t+1},\cdots,o_T|i_t=q_j,\lambda)\\
=\sum_{i=1}^Np(o_{t+1},\cdots,o_T,q_{t+1}=q_i|i_t=q_j,\lambda)\\
=\sum_{i=1}^Np(o_{t+1},\cdots,o_T|i_{t+1}=q_i,i_t=q_j,\lambda)p(i_{t+1}=q_i|i_t=q_j,\lambda)\\
=\sum_{i=1}^Np(o_{t+1},\cdots,o_T|i_{t+1}=q_i,\lambda)a_{ji}\ \ \ \ \text{考虑D-seperated第一种情况,$i_t$在给定$i_{t+1}$时条件独立}\\
=\sum_{i=1}^Np(o_{t+1}|o_{t+2},\cdots,o_T,i_{t+1}=q_i,\lambda)p(o_{t+2},\cdots,o_T|i_{t+1}=q_i,\lambda)a_{ji}\\
=\sum_{i=1}^Np(o_{t+1}|i_{t+1}=q_i)\beta_{t+1}(i)a_{ji}\ \ \ \ \text{使用观测独立假设}\\
=\sum_{i=1}^Nb_i(o_{t+1})a_{ji}\beta_{t+1}(i)
$$

## Learning

$\lambda=\mathop{\arg\max}_\lambda p(O|\lambda)$

> Baum-Welch算法是在EM算法之前提出的, 但是实际上Baum-Welch算法就是EM算法的一种特殊形式

考虑EM算法公式:
$$
\theta^{(t+1)}=\mathop{\arg\max}\int_z\log p(X,Z|\theta)p(Z|X,\theta^{(t)})dZ
$$
在这里, 隐变量$Z=I$, $X=O$, $\theta=\lambda$, 那么就有了针对HMM的EM算法的公式:
$$
\lambda^{(t+1)}=\mathop{\arg\max}_\lambda\sum_{I}\log p(O,I|\lambda)p(I|O,\lambda^{(t)})\\
=\mathop{\arg\max}_\lambda\sum_{I}\log p(O,I|\lambda)\frac{p(O,I|\lambda^{(t)})}{p(O|\lambda^{(t)})}\\
=\mathop{\arg\max}_\lambda\sum_{I}\log p(O,I|\lambda)p(O,I|\lambda^{(t)})
$$
注意, $\lambda^{(t)}=(\pi^{(t)},A^{(t)},B^{(t)})$是上一次迭代产生的结果, 那么$p(O|\lambda^{(t)})$是一个常数, 对求解$\mathop{\arg\max}_\lambda$没有关系, 因此可以舍弃.

我们再定义中间的函数$Q(\lambda,\lambda^{(t)})=\sum_{I}\log p(O,I|\lambda)p(O,I|\lambda^{(t)})$

将原始的Evalution带入表达式:
$$
Q(\lambda,\lambda^{(t)})=\sum_I\log(\pi(i_1)\prod_{t=2}^Ta_{i_{t-1}i_{t}}\prod_{t=1}^Tb_{i_t}(o_t))p(O,I|\lambda^{(t)})\\
=\sum_I\left[\left(\log\pi_{i_1}+\log\sum_{t=1}^Ta_{i_{t-1}i_t}+\log\sum_{t=1}^Tb_{i_1}(o_t)\right)p(O,I|\lambda^{(t)})\right]\\
\\
\pi^{(t+1)}=\mathop{\arg\max}_\pi Q(\lambda,\lambda^{(t)}))=\sum_{i_1}\cdots\sum_{i_T}\left(\log\pi_{i_1}p(O,i_1,\cdots,i_T|\lambda^{(t)}))\right)\\
=\mathop{\arg\max}_\pi\sum_{i_1}\left(\log\pi_{i_1}p(O,i_1|\lambda^{(t)})\right)\ \text{s.t.}\sum_{i}\pi_{i}=1\\
$$
应用拉格朗日乘子法:
$$
\mathcal{L}(\pi,\eta)=\sum_{i=1}^N\log\pi_ip(O,i_1=q_i|\lambda^{(t)})+\eta(\sum_{i=1}^N\pi_i-1)\\
\frac{\partial\mathcal{L}}{\partial\pi_i}=\frac{1}{\pi_i}p(O,i_1=q_i|\lambda^{(t)})+\eta=0\ \ \ \ (1)\\
\Rightarrow\ \ \ \sum_{i=1}^N\left[p(O,i_1=q_i|\lambda^{(t)})+\pi_i\eta\right]=0\ \ \ \Leftrightarrow\ \ \ p(O|\lambda^{(t)})+\eta=0\ \ \Leftrightarrow\ \ \ \eta=-p(O|\lambda^{(t)})\\
\text{代入(1), 得: }p(O,i_1=q_i|\lambda^{(t)})+\eta\pi_i=p(O,i_1=q_i|\lambda^{(t)})-\pi_ip(O|\lambda^{(t)})=0\\
\Rightarrow \pi_i^{(t+1)}=\frac{p(O,i_1=q_i|\lambda^{(t)})}{p(O|\lambda^{(t)})}
$$
关于$A^{(t+1)}$和$B^{(t+1)}$的推导过程是类似的, 这里不做推导.

## Decoding

也称为Viterbi Algorithm

$\hat I=\arg\max_I p(I|O,\lambda)$

> 我们可以认为这里有一个动态规划的问题
>
> 假设路径的长度是$\frac1p$, 那么我们的目的就是找到最短路径. 这样就能最大化概率

定义
$$
\delta_t(i)=\max_{i_1,\cdots,i_{t-1}} p(o_1,\cdots,o_t,i_1,\cdots,i_{t-1},i_t=q_i|\lambda)\\
\text{意义是达到$t$时刻的时候, 选择$q_i$作为system state的概率的最大值}\\
$$

状态转移方程为:

$$
\delta_{t+1}(j)=\max_{i_1,\cdots,i_t}p(o_1,\cdots,o_{t+1},i_1,\cdots,i_t,i_{t+1}=q_j|\lambda)=\max_{1\leq i\leq N}\delta_t(i)a_{ij}b_j(o_{t+1})
$$
记录中间经过的路径:
$$
\text{定义}\psi_{t+1}(j)=\mathop{\arg\max}_{1\leq i\leq N}\delta_t(i)a_{ij}
$$

## 其他

假设隐变量是$Z$, 观测变量是$X$

### filtering

$$
P(z_t|x_1,\cdots,x_t)
$$

是给定观测结果从$x_1,\cdots,x_t$之后找到对应的隐变量$z_t$

这个可以做online learning在线学习

$p(z_1|x_1)\rightarrow p(z_2|x_1,x_2)\rightarrow\cdots\rightarrow p(z_t|x_1,\cdots,x_t)\rightarrow\cdots$

每进来一个数据就可以做一次filtering, 是可以做online的
$$
p(z_t|x_{1:t})=\frac{p(z_t,x_{1:t})}{p(x_{1:t})}=\frac{p(z_t,x_{1:t})}{\sum_{z_t}p(x_{1:t},z_t)}\propto p(z_t,x_{1:t})=\alpha_t(z_t)
$$


### smoothing

$$
p(z_t|x_1,\cdots,x_T)
$$

给定所有的观测值, 然后求解某一个时刻的隐变量

更偏向offline, 类似于全部结束之后的整体复盘

称作*前向后向算法*
$$
p(z_t|x_{1:T})=\frac{p(z_t,x_{1:T})}{p(x_{1:T})}=\frac{p(z_t,x_{1:T})}{\sum_{z_t}p(x_{1:T},z_t)}\\
p(x_{1:T},z_t)=p(x_{1:t},x_{t+1:T},z_t)=p(x_{t+1:T}|x_{1:t},z_t)p(x_{1:t},z_t)=p(x_{t+1:T}|z_t)\alpha_t(z_t)=\beta_t(z_t)\alpha_t(z_t)\\
\Rightarrow p(z_t|x_{1:T})\propto p(z_t,x_{1:T})=\beta_t(z_t)\alpha_t(z_t)
$$
中间的$p(x_{t+1:T}|x_{1:t},z_t)=p(x_{t+1:T}|z_t)$化简用到了[D-separator](###后向传播)

### prediction

$$
p(z_{t+1},\cdots|x_1,\cdots,x_t)\\\text{or}\\
p(x_{t+1},\cdots|x_1,\cdots,x_t)
$$

在给定前$t$时刻的观测值$x_1,\cdots,x_t$之后, 预测后面一个或者多个隐变量或者观测值的过程
$$
p(z_{t+1}|x_{1:t})=\sum_{z_t}p(z_{t+1},z_t|x_{1:t})=\sum_{z_t}p(z_{t+1}|z_t,x_{1:t})p(z_t|x_{1:t})=\sum_{z_t}p(z_{t+1}|z_t)\alpha_t(z_t)\text{(这里是马尔可夫齐次假设和filtering问题)}\\
p(x_{t+1}|x_{1:t})=\sum_{z_{t+1}}p(x_{t+1},z_{t+1}|x_{1:t})=\sum_{z_{t+1}}p(x_{t+1}|z_{t+1},x_{1:t})p(z_{t+1}|x_{1:t})=\sum_{z_{t+1}}\left[p(x_{t+1}|z_{t+1})\sum_{z_t}p(z_{t+1}|z_t)\alpha_t(z_t)\right]\\
\text{这里是观测独立假设和上面刚刚求解的预测}
$$
