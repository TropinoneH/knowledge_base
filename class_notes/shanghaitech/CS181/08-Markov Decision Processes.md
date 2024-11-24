# Markov Decision Process

![image-20241120105206785](./08-Markov%20Decision%20Processes.assets/image-20241120105206785.png)

是Non-deterministic的搜索算法

假定了下一时刻的状态只和当前事态的状态和当前时刻的action有关, 与之前的状态和动作无关
$$
P(S_{t+1}=s'|S_t=s_t,A_t=a_t,s_{t-1}=s_{t-1},\cdots,S_0=s_0)=P(S_{t+1}=s'|S_t=s_t,A_t=a_t)
$$
假设$R(s)$是reward function, $R(s)$表示每存活一定时间对总的reward的更新:

![image-20241120110016702](./08-Markov%20Decision%20Processes.assets/image-20241120110016702.png)

不同的reward function会导致不同的结果

## Markov Search Tree

![image-20241120111657588](./08-Markov%20Decision%20Processes.assets/image-20241120111657588.png)

节点$(s,a)$并不是真实的节点, 而是虚拟的节点, 类似expectation-max的节点

## Utilities of Sequences

如何考虑未来的reward的影响? 应该放弃眼前的收益考虑更长远的收益还是更期待长期的收益?

Utility Function: 是基于整个Sequence的值的函数, 并不完全等于Reward Function. 如果只关注了最近的一个值的update, 那么就是Reward

Discounting: 如果未来的reward比较低, 对当前的影响不大, 那么设置一个discounting factor: $\gamma$, 每一个时间步的reward的影响(reward的值)乘上$\gamma$作为未来的权重. 如果更看重当前, 那么设置$0<\gamma<1$, 如果更看中未来, 可以让$\gamma>1$.

$0<\gamma<1$有助于防止无限循环, 有助于算法收敛

> 防止无限循环的方法:
>
> 1. 设置discounting factor<1
>    $$
>    U([r_0,\cdots,r_\infty])=\sum_{t=0}^\infty\gamma^tr_t\leq \frac{R_\max}{1-\gamma}\text{(Sum of Geometric Sequence)}
>    $$
> 2. 设置最多轮数, 设置最大搜索深度
> 3. 设置aborting state. 如果一个状态进去就出不来, 就设置这个状态为停止状态, 表示这个状态没必要再搜索

### Optimal Quantities

![image-20241120112645100](./08-Markov%20Decision%20Processes.assets/image-20241120112645100.png)

optimal value function:
$$
V^*(s)=\max_a Q^*(s,a)\\
Q^*(s,a)=\sum_{s'}T(s,a,s')[R(s,a,s')+\gamma V^*(s')]\\
\Rightarrow V^*(s)=\max_a\sum_{s'}T(s,a,s')[R(s,a,s')+\gamma V^*(s')]
$$
其中, $T(s,a,s')$是状态转移的概率,  $R(s,a,s')$是状态转移的reward, $\gamma$是discounting factor.

前面两个式子可以写成一个总式(最后一行), 叫做Bellman Equation

### Value Iteration

从$V_0(s)=0$开始, 迭代计算
$$
V_{k+1}\leftarrow\max_a\sum_{s'}T(s,a,s')[R(s,a,s')+\gamma V_k(s')]
$$


![image-20241122103739147](./08-Markov%20Decision%20Processes.assets/image-20241122103739147.png)

复杂度: $O(s^2a)$

#### Q-value

相同的, Q-value也可以使用Value Iteration计算
$$
Q_{k+1}(s,a)\leftarrow\sum_{s'}T(s,a,s')[R(s,a,s')+\gamma\max_{a'} Q_k(s',a')]
$$

![image-20241122103717499](./08-Markov%20Decision%20Processes.assets/image-20241122103717499.png)

#### proof

Bellman equation $U_{t+1}\leftarrow BU_t$

max norm $||U||=\max_s|U(s)|$

the bellman update is a contraction by a  factor of $\gamma$ on the space of utility vectors

- $||BU_t-BU_t'||\leq\gamma||U_t-U_t'||$

there exists only one optimal value of contraction transformation

- $B[V^*]=V^*$

Value iteration $V_{k+1}=T[V_k]$ converges to $V^*$

#### example

> e.g.
>
> ![image-20241120114102099](./08-Markov%20Decision%20Processes.assets/image-20241120114102099.png)
>
> Value Iteration:
>
> <span>
> <img src="./08-Markov%20Decision%20Processes.assets/image-20241120114126136.png" alt="image-20241120114126136" style="zoom:25%;" />
> <img src="./08-Markov%20Decision%20Processes.assets/image-20241120114141337.png" alt="image-20241120114141337" style="zoom:25%;" />
> </span>
> <span>
> <img src="./08-Markov%20Decision%20Processes.assets/image-20241120114200685.png" alt="image-20241120114200685" style="zoom:25%;" />
> <img src="./08-Markov%20Decision%20Processes.assets/image-20241120114226943.png" alt="image-20241120114226943" style="zoom:25%;" />
> </span>

>  e.g. 2
>
> ![image-20241120114526529](./08-Markov%20Decision%20Processes.assets/image-20241120114526529.png)
>
> Value Iteration:
>
> <span><img src="./08-Markov%20Decision%20Processes.assets/image-20241120114612136.png" alt="image-20241120114612136" style="zoom:25%;" /><img src="./08-Markov%20Decision%20Processes.assets/image-20241120114635284.png" alt="image-20241120114635284" style="zoom:25%;" /></span>
>
> <span><img src="./08-Markov%20Decision%20Processes.assets/image-20241120114703314.png" alt="image-20241120114703314" style="zoom:25%;" /><img src="./08-Markov%20Decision%20Processes.assets/image-20241120114721758.png" alt="image-20241120114721758" style="zoom:25%;" /></span>
> $$
> \cdots
> $$
> <span><img src="./08-Markov%20Decision%20Processes.assets/image-20241120114756943.png" alt="image-20241120114756943" style="zoom:25%;" /><img src="./08-Markov%20Decision%20Processes.assets/image-20241120114814633.png" alt="image-20241120114814633" style="zoom:25%;" /></span>

#### Computing action from values

$$
\pi^*(s)=\mathop{\arg\max}_a\sum_{s'}T(s,a,s')[R(s,a,s')+\gamma V^*(s')]
$$

称作policy extraction

或者如果已知[optimal q-function](#Q-value), 可以写成:
$$
\pi^*(s)=\mathop{\arg\max}_aQ^*(s,a)
$$
相较于从value得出, action从q-value得出更容易(计算量更少)

### Policy Iteration

Problem with Value Iteration:
$$
V_{k+1}(s)\leftarrow\max_a\sum_{s'}T(s,a,s')\left[R(s,a,s')-\gamma V_k(s')\right]
$$

- 太慢, 每一次迭代的时间复杂度为$O(s^2a)$
  - 对自己的所有值域遍历(每个值对应的value都更新, 复杂度$O(s)$), 
  - 取每个action中的最大值($O(a)$)
  - 每个action的值由action对应状态$s'$的转移概率和对应的Reward乘积决定($O(s)$)
- 在max这一步的value基本没有改变

因此提出: 只关注$\mathop{\arg\max}\pi^*$即可, 而不是关注每一个值

1. 计算当前Policy的结果

   计算一个固定的(不一定optimal, 可能是随机)Utility Function

2. 优化Policy

   更新policy使用one-step look-ahead, 可能不是最优, 但是收敛速度更快



- Step1
  $$
  V^\pi_{k+1}=\sum_{s'}T(s,\pi(s),s')[R(s,\pi(s),s')+\gamma V^\pi_k(s')]
  $$

  不再提供action, 而是给定一个policy函数$\pi$, 根据这个函数计算对应的值.

  复杂度: $O(s^2)$

  或者假定已经达到了收敛状态, 那么只需要解出一个线性方程即可
  $$
  V^\pi=\sum_{s'}T(s,\pi(s),s')[R(s,\pi(s),s')+\gamma V^\pi(s')]
  $$

- Step2

  更新Policy:
  $$
  \pi_{i+1}(s)=\mathop{\arg\max}_a\sum_{s'}T(s,a,s')[R(s,a,s')+\gamma V^{\pi_i}(s')]
  $$

#### Value Iteration v.s. Policy Iteration

都是计算相同的内容: 计算一个最优的action

都是动态规划



Value Iteration:

- 每一次更新都会计算所有的policy的value
- 会track所有的policy的值

Policy Iteration:

- 只更新一部分固定的policy. 每一个iteration都只关注一个policy而不是全部的policy
- 每一次计算之后都会更新policy function
- 可能收敛更快
