# Reinforcement Learning

![image-20241122114925922](./09-Reinforcement%20learning.assets/image-20241122114925922.png)

使用类似MDP的定义, 但是这个时候并不清楚$T$或者$R$

![image-20241122121529933](./09-Reinforcement%20learning.assets/image-20241122121529933.png)

在Agent中存在$\pi$或者说action, 在environment中存在state, reward function和transition function.

认为在environment中的作为ground truth, 因此是function而不是model(model是Agent中学习到的)

Basic Idea:

- 采取行动并观察outcomes
- 根据挂查到的样本进行学习
- 使用学到的内容进行最大化期望reward

### Model Based Learning

通过经验进行学习, 然后将学习到的模型进行估计

Step 1: 采取不同的action然后基于outcomes计算MDP Model

- 计算outcomes $s'$根据给定的$s,a$

  a是由$\pi_i(s)$给出的, 这个$\pi_i$是在Agent中, 我们认为在更新environment的过程中, $\pi_i$是固定的.
- 归一化, 然后计算$\hat T(s,a,s')$

  我们认为虽然$T$的parameters中有$s,a,s'$三个, 但是$s$是current state是固定的, $a=\pi_i(s)$认为是固定的. 因此随机性只产生在$s'$处.
- 计算$R(s,a,s')$对于每一个给定的$s,a,s'$

  Reward Function是environment中的函数, 有可能是已知的, 但是在真实的environment中也是需要迭代的.

Step 2: 使用MDP的Iteration的方法计算, 更新$\pi_{i+1}$

### Model Free Learning

> model based v.s. model free
>
> 假设计算所有人的平均年龄:
>
> - 如果已知每个年龄有多少概率:
>   $$
>   E[A]=\sum_aP(a)a
>   $$
>
> - 如果未知$P(a)$
>
>   - model based
>     $$
>     \hat P(a)=\frac{\# a}{N}\\
>     E[A]\approx\sum_a\hat P(a)a
>     $$
>
>   - model free
>     $$
>     E[A]\approx\frac1N\sum_ia_i
>     $$

