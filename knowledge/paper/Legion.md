---
tags:
  - paper
  - algorithm
  - LLM
  - VLA
  - EmbodiedAI
  - RL
  - DL
aliases:
  - Preserving and combining knowledge in robotic lifelong reinforcement learning
---
# Preserving and combining knowledge in robotic lifelong reinforcement learning

## Introduce

机器人终身学习

基于深度学习的方法, 平衡神经网络的稳定性和可塑性, 这种情况下一个常见的问题是灾难性遗忘. 可以使用正则化, 结构模块化和经验回放, 但是更多应用于[[Fit|传统机器学习]]

在deep learning for reinforcement learning中, 常见的方法是通过多任务强化学习(MTRL). 在MTRL中, agent可以同时访问多个任务, 避免了神经网络固有的以往问题. 但是也有问题, 依赖与预定义的任务范围, 对zero-shot样本难以泛化.

受到Dirichlet过程混合模型(Dirichlet process mixture model, DPMM)的启发, 结合记忆变分贝叶斯推断模型(memorized variational [[Bayes]] inference method, memoVB), 在upstream level实现了simultaneous inference和asynchronous knowledge preservation.

## Method

可以continuously gain knowledge from a steam of a one-time feeding tasks.

upstream module包含:
- pretrained language embedding
- task encoder
- DPMM
- generative module
训练过程: offline

1. LLM结合语音识别 pre-encoded Language Embeddings. 这一步通过消除计算密集型的实时编码来加速训练
2. task state observation(包含end-effector位置, objects的位置, goals的位置)与Language Embeddings结合, 送给task inference encoder
3. 生成的inference result使用DPMM与knowledge space进行拟合(fit). 来自同一个任务的inferred result被clustered并储存在DPMM的相同component中. 如果是新的样本, 创建一个新的component来储存. 知识保存:
	1. 使用task encoder得到的$z_i$更新DPMM参数.
	2. 固定DPMM参数, 更新task encoder:
		1. reconstruct loss: $x_i$ with $x_i^*$
		2. KL divergence: task encoder distribution with DPMM knowledge component
4. generative module重建language embeddings并预测当前任务的动态函数, 使得upstream和downstream之间可以解耦参数更新
	1. 将$z_i$作为输入, 重建language embeddings tokens, 与原始language embeddings token做reconstruction loss
	2. 使用当前observed state, action, $z_t$进行对下一步state预测$p_\theta(s_{t+1}|s_t,a_t,z_t)$, 与真实执行(simulate)后的结果做reconstruction loss
5. downstream中使用SAC作为策略学习模块, critics计算$Q(s_t,a_t,z_t)$, actor提供action $a_t$

![[Pasted image 20250408142002.png]]

在deployment(inference)过程中, 使用online encode方法. 使用Sim2Real和Real2Sim, 这两个模块包括安全控制检查, Sim和Real world坐标系转换, 手眼校准, 相机偏移设置.

## Non-parametric knowledge space
### Dirichlet process mixture model

假设$G$为random probability measure, $\mathcal H$是base probability distribution基于参数空间$\Theta$, $\alpha$是concentration parameter.

认为$G$是Dirichlet过程中采样得到, 记作$G\sim\text{DP}(\alpha,\mathcal H)$. 使用`stick-breaking`方法进行从$DP(\alpha,\mathcal H)$中sample

DPMM用于capture infinite mixture of clusters, 从observation $\mathbf x=x_{1:N}$. DPMM的组件并没有固定, 而是online的方式去确定.

DPMM中, 认为每一个数据点$x_i\sim F(\theta_i)$, 其中$\theta_i$是从先验$G$中独立采样的latent variable, 并通过允许$\theta_i$重复来引入discreteness和clustering properties. 因此, 使用相同的$\theta_i$绘制的data points自然形成一个聚类.

fit过程中, 为了data point分配给一个cluster, 把data point $x_i$和变量$v_i$关联. $v_i$通过$\pi\sim\text{Cat}(\pi)$来sample得到. 其中混合比例$\pi$也可以等价表示为从广义的Ewens分布(GEM)中sample.

总而言之, DPMM可以写作:
$$\theta_k|\lambda\sim\mathcal H(\lambda)$$
$$\pi|\alpha\sim\text{GEM}(\alpha)$$
$$v_i|\pi\sim\text{Cat}(\pi)$$
$$x_i|v_i\sim F(\theta_{v_i})$$

### Variational Inference

使用变分推断来估计真实posterior. DPMM的分布可表示为:
$$p(x,v,\theta,\beta)=\prod_{n=1}^NF(x_n|\theta_{v_n})\text{Cat}(v_n|\pi(\beta))\prod_{k=1}^\infty B(\beta_k|1,\alpha)\mathcal H(\theta_k|\lambda)$$
其中$B$是stick-breaking过程, $\beta_k$是对应的随机变量.

使用ELBO方法求近似后验$q(v,\theta,\beta)$:
$$\text{ELBO}(q)=\mathbb E[\log p(x|v,\theta,\beta)]-\mathbb{KL}(q(v,\theta,\beta)\|p(v,\theta,\beta))$$
基于变分概念和mean-field assumption, 定义$q$的variational distribution:
$$q(v,\theta,\beta)=\prod_{n=1}^Nq(v_n|\hat r_n)\prod_{k=1}^Kq(\beta_k|\hat\alpha_{k_1},\hat\alpha_{k_0})q(\theta_k|\hat\lambda_k)$$
$$=\prod_{n=1}^N\underbrace{\text{Cat}(v_n|\hat r_{n_1:n_k})}_{q_{v_n}}\prod_{k=1}^K\underbrace{B(\beta_k|\hat\alpha_{k_1},\hat\alpha_{k_0})}_{q_{\beta_k}}\underbrace{\mathcal H(\theta_k|\hat\lambda_k)}_{q_{\theta_k}}$$
其中, $q_{v_n}$是含有变分参数$\hat r_n$分类因子, $q_{\beta_k}$是含参数$\hat\alpha_{k_1},\hat\alpha_{k_0}$的stick-breaking比例因子, $q_{\theta_k}$是含有参数$\hat\lambda_k$的base distribution因子.

为了模拟较为精确的后验概率, 使用一个足够大的$K$以包含所有potential features, 则ELBO为:
$$\text{ELBO}(q)=\sum_{k=1}^K\left[\mathbb E_q[\theta_k]^\top s_k(x)-\hat N_k[a(\theta_k)]+\hat N_k[\log\pi_k(\beta)]-\sum_{n=1}^N\hat r_{nk}+\mathbb E_q\left[\log\frac{B(\beta_k|1,\alpha)}{q(\beta_k|\hat\alpha_{k_1},\hat\alpha_{k_0})}\right]+\mathbb E_q\left[\log\frac{\mathcal H(\theta_k|\lambda)}{q(\theta_k|\hat\lambda_k)}\right]\right]$$

$N_k$和$s_k$需要完整的数据集. 对于大型dataset, 使用memoVB的方法进行批处理.

## Parametrics Modules
### Language Embedding

human-in-a-loop的方式指导embodied agent完成real-world tasks.

使用RoBERTa将side information(语音输入)encode成embeddings

### Observation space

包含end-effector的位置(3-dim), object pose(6-dim), goal position(3-dim)

经过encoder之后, 维度提升为768-dim

### Action space

4 dimensions. end-effector的移动(单位: m) 和 gripper的开口距离. 每个维度限制在$[-1.0, 1.0]$之内

### Reward

success的标准是将object放入goal的范围中.

reward分为: 

### Optimization

使用Adam adapter.

## Metrics

average success rate: 
$$P(t)=\frac1N\sum_{i=1}^NP_i(t)\text{: 每个任务的成功率的平均}$$

forgetting:
$$F_i=(P_i(\Delta i)-P_i(T)) \text{: 训练后的成功率减去最终成功率}$$
$$F=\frac1{N-1}\sum_{i=1}^NF_i$$

forward transfer:
$$FT_i=\frac1{i-1}\sum_{k=1}^{i-1}P_k(\Delta k)\text{ : 训练前i个任务的平均成功率}$$
$$FT=\frac1{N-1}\sum_{i=2}^NFT_i$$表示从早期任务获取的知识有助于提升后续的任务的成功率

Improvement of few-shot knowledge recall:
$$f=\frac1{T\times P_\text{max}}\left(\int^{T_j}_{t_j}P(t)dt-\int^{T_i}_{t_i}P(t)dt\right)$$
$P_\text{max}$表示成功率的最大值, 这里是$1.0$. $t$和$T$分别表示在training step $j>i$的上下界.
