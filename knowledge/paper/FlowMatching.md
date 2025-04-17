---
tags:
  - diffusion
  - paper
  - algorithm
  - tutorial
  - python
  - DL
aliases:
  - Flow Matching for Generative Modeling
---
[[2210.02747v2_FlowMatching.pdf]]

[Github Project](https://github.com/lebellig/flow-matching)
# Flow Matching

## Preliminaries

**Continuous Normalizing Flows**(CNF):

数据点$\mathbf x=(x^1,\cdots,x^d)\in\mathbb R^d$.

two important objects:
1. Probability density path: $p:[0,1]\times\mathbb R^d\to\mathbb R_+$
2. time-dependent vector field: $v:[0,1]\times\mathbb R^d\to\mathbb R^d$

一个vector field $v_t$可以构筑一个time-dependent diffeomorphic map, 称作$flow,\phi:[0,1]\times\mathbb R^d\to\mathbb R^d$, 通过ordinary differential equation(ODE)定义:
$$\frac{d}{dt}\phi_t(x)=v_t(\phi_t(x))$$
$$\phi_0(x)=x$$
可以认为$\phi_t$是在$t$时刻的状态, 对应[[Diffusion]]过程中在$t$时刻的噪声图.

CNF可以通过Push Forward公式将纯噪声$p_0$转换为较为复杂的分布$p_1$(注意, 这里和Diffusion中定义不一样, $p_0$在这里是纯噪声, 而Diffusion中是真实样本.):
$$p_t(x)=[\phi_t]*p_0(x)=p_0(\phi^{-1}_t(x))\det\left(\frac{\partial}{\partial x}\phi_t^{-1}(x)\right)$$
如果flow $\phi_t$满足上述公式, 那么我们可以认为vector field $v_t$ *generate* a probability density path $p_t$

## Flow Matching

从一个简单的纯噪声分布$p_0$开始, 如$p_0(x)\sim\mathcal N(\mathbf 0,\mathbf I)$, 令$p_1(x)$和目标分布$q(x)$大致相等. Flow matching就是去匹配这样一条路径, 从$p_0$"流动"向$p_1$.

Flow matching的目标函数为:
$$\mathcal L(\theta)=\mathbb E_{t,p_t(x)}\|v_t(x)-u_t(x)\|^2_2$$
简单而言, Flow matching就是训练一个$v_t(x)$对$u(x)$的回归, 然后就可以使用$v_t(x)$生成probability path $p_t$. 然后就可以采样$x\sim p_t(x)$.

由于$p_t$和$u_t$未知, 因此Loss无法计算.

### Constructing $p_t$, $u_t$ from conditional probability paths and vector fields

给定sample $x_1$, 使用$p_t(x|x_1)$表示一个条件概率路径. 完成计算后使用积分来得出边缘分布, 从而得出probability path.

$p_t(x|x_1)$需要满足:
- $t=0$时, $p_0(x|x_1)=p(x)$即完全噪声的分布, 与$x_1$无关
- $t=1$时, $p_1(x|x_1)$是在$x=x_1$附近的分布(如, $p_1(x|x_1)=\mathcal N(x|x_1,\sigma^2\mathbf I)$). 也就是说, $p_1(x|x_1)\approx q(x_1)$

那么积分为:
$$p_t(x)=\int p_t(x|x_1)q(x_1)dx_1$$
特别的:
$$p_1(x)=\int p_1(x|x_1)q(x_1)dx_1\approx q(x)$$
同样的, 可以对$u_t(x|x_1)$求积分:
$$u_t(x)=\int u_t(x|x_1)\frac{p_t(x|x_1)q(x_1)}{p_t(x)}dx_1$$
其中$u_t(\cdot|x_1)$是generate $p_t$的向量场.

### Conditional Flow Matching

由于积分还是无法计算, 因此提出了一个更加简单的目标函数:

$$\mathcal L_{CFM}(\theta)=\mathbb E_{t,q(x_1),p_t(x|x_1)}\|v_t(x)-u_t(x|x_1)\|_2^2$$
只要能够计算$p(x|x_1)$和$u_t(x|x_1)$就可以无偏估计. 由于是在单个sample上进行采样, 因此很容易计算.

证明了$\nabla_\theta\mathcal L_{CFM}(\theta)=\nabla_\theta\mathcal L_{FM}(\theta)$, 因此优化CFM(Conditional Flow Matching)在期望上等同于优化FM(Flow Matching).

# Implementation

```python
# 导入库
import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
from zuko.utils import odeint

# 定义OTFlowMatching类
class OTFlowMatching:
    def __init__(self, sig_min=0.001):
        self.sig_min = sig_min
        self.eps = 1e-5

    def psi_t(self, x, x_1, t):
        """条件流函数"""
        return (1 - (1 - self.sig_min) * t) * x + t * x_1

    def loss(self, v_t, x_1):
        """计算条件流匹配损失"""
        t = (torch.rand(1, device=x_1.device) + 
             torch.arange(len(x_1), device=x_1.device) / len(x_1)) % (1 - self.eps)
        t = t[:, None].expand(x_1.shape)
        x_0 = torch.randn_like(x_1)
        v_psi = v_t(t[:,0], self.psi_t(x_0, x_1, t))
        d_psi = x_1 - (1 - self.sig_min) * x_0
        return torch.mean((v_psi - d_psi) ** 2)

# 定义条件向量场模型
class CondVF(nn.Module):
    def __init__(self, net):
        super().__init__()
        self.net = net

    def forward(self, t, x):
        return self.net(t, x)

    def wrapper(self, t, x):
        t = t * torch.ones(len(x), device=x.device)
        return self(t, x)

    def decode(self, x_0):
        """从先验分布解码到数据分布"""
        return odeint(self.wrapper, x_0, 0., 1., self.parameters())

# 定义神经网络模型
class Net(nn.Module):
    def __init__(self, in_dim, out_dim, h_dims, n_frequencies):
        super().__init__()
        self.n_frequencies = n_frequencies
        ins = [in_dim + 2 * n_frequencies] + h_dims
        outs = h_dims + [out_dim]
        self.layers = nn.ModuleList([
            nn.Sequential(nn.Linear(in_d, out_d), nn.LeakyReLU()) 
            for in_d, out_d in zip(ins, outs)])
        self.top = nn.Linear(out_dim, out_dim)

    def time_encoder(self, t):
        """时间编码"""
        freq = 2 * torch.pi * torch.arange(self.n_frequencies, device=t.device)
        t = freq * t[..., None]
        return torch.cat((t.cos(), t.sin()), dim=-1)

    def forward(self, t, x):
        t_enc = self.time_encoder(t)
        x = torch.cat((x, t_enc), dim=-1)
        for layer in self.layers:
            x = layer(x)
        return self.top(x)

# 训练流程
def train(model, v_t, dataset):
    # 数据准备
    dataset = make_swiss_roll(n_points)[..., [0,2]]  # 示例数据集
    dataloader = DataLoader(dataset, batch_size=2048)
    
    optimizer = torch.optim.Adam(v_t.parameters(), lr=1e-3)

    # 训练循环
    for epoch in range(n_epochs):
        for batch in dataloader:
            x_1 = batch[0].to(device)
            loss = model.loss(v_t, x_1)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

# 采样生成样本
def sample(v_t, n_samples=10000):
    with torch.no_grad():
        x_0 = torch.randn(n_samples, 2, device=device)
        x_1_hat = v_t.decode(x_0)
    return x_1_hat.cpu().numpy()
```

Usage:

```python
# 初始化
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = OTFlowMatching()
net = Net(2, 2, [512]*5, 10).to(device)
v_t = CondVF(net)

# 训练
train(model, v_t, dataset)

# 采样和可视化
samples = sample(v_t)
plt.hist2d(samples[:,0], samples[:,1], bins=128)
```