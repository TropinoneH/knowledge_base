---
tags:
  - algorithm
  - diffusion
  - paper
  - tutorial
  - python
  - DL
aliases:
  - Scalable Diffusion Models with Transformers
---

> [!paper]-
> [[2212.09748v2_DiT.pdf]]

[github project](https://github.com/facebookresearch/DiT)
# DiT

#### 整体架构
1. 潜在空间编码：  
   输入图像通过预训练的VAE编码器压缩到低维潜在空间，例如对于$256\times256$的图像，潜在表示 $z$ 的尺寸为 $32\times32\times4$（下采样因子为8）。
2. 分块（Patchify）：  
   将潜在空间 $z$ 划分为 $p\times p$ 的块（如 $p=2$），每个块通过线性嵌入映射为 $d$ 维的token。例如，$32\times32\times4$ 的潜在空间分块后生成 $T=\frac{32}2^2=256$ 个token，每个token维度为 $d$。
3. 位置编码：  
   对每个token应用ViT风格的正弦-余弦位置编码，以保留空间位置信息。
4. DiT块处理：  
   Token序列输入由多个DiT块组成的Transformer。每个DiT块包含自注意力层、前馈网络（FFN），以及条件注入机制（如adaLN-Zero）。
5. 解码与重构：  
   最终，通过线性解码器将token序列转换回原始潜在空间维度，预测噪声 $\epsilon_\theta$ 和协方差 $\Sigma_\theta$。
6. VAE解码生成图像：  
   去噪后的潜在表示通过VAE解码器生成最终图像。

#### 数据流动详解

**(1) 输入处理：潜在空间分块**
- 输入：潜在空间张量 $z \in \mathbb{R}^{H×W×C}$（例如 $32×32×4$）。
- 分块操作：将 $z$ 划分为 $p×p×C$ 的块，得到 $T = (H/p) × (W/p)$ 个块。
- 线性嵌入：每个块通过可学习的线性层映射为 $d$ 维向量，生成token序列 $X \in \mathbb{R}^{T×d}$。
- 位置编码：对每个token添加位置编码 $P \in \mathbb{R}^{T×d}$，得到输入序列 $X_{\text{in}} = X + P$。

**(2) DiT块的条件处理**
每个DiT块的核心操作如下（以adaLN-Zero为例）：
1. 自注意力层：  
   输入序列通过多头自注意力（MSA）计算全局交互：
   $$X' = \text{LayerNorm}(X_{\text{in}}), \quad X_{\text{attn}} = \text{MSA}(X') + X_{\text{in}}$$
2. 前馈网络（FFN）：  
   通过两层MLP进行非线性变换：
   $$X_{\text{ffn}} = \text{FFN}(\text{LayerNorm}(X_{\text{attn}})) + X_{\text{attn}}$$
3. 条件注入（adaLN-Zero）：  
   - 时间步 $t$ 和类别标签 $c$ 通过嵌入层转换为向量 $e_t$ 和 $e_c$。
   - 合并条件：$e = e_t + e_c$。
   - 动态生成层归一化参数：  
     $$gamma, \beta, \alpha = \text{MLP}(e)$$
   - 替换标准LayerNorm为自适应版本，并应用残差缩放：  
     $$X_{\text{out}} = \alpha \cdot (\gamma \odot \text{Norm}(X_{\text{ffn}}) + \beta) + X_{\text{ffn}}$$
   - 关键设计：$\alpha$ 初始化为零，确保训练初期DiT块近似恒等映射，提升稳定性。
**(3) 解码与噪声预测**
- 最终层归一化：对最后一个DiT块的输出进行归一化。
- 线性解码：每个token通过线性层映射为 $p×p×2C$ 的张量（预测噪声和协方差）。
- 空间重构：将解码后的token重新排列为原始潜在空间尺寸 $H×W×2C$，分割为噪声预测 $\epsilon_\theta$ 和协方差 $\Sigma_\theta$。
**(4) 训练与推理流程**
- 训练：  
  输入带噪声的潜在 $z_t$，DiT预测噪声 $\epsilon_\theta(z_t, t, c)$，损失函数为：
  $$\mathcal{L}_{\text{simple}} = \|\epsilon_\theta(z_t, t, c) - \epsilon\|_2^2$$
  其中 $\epsilon$ 是真实噪声。
- 推理：  
  1. 从随机噪声 $z_T \sim \mathcal{N}(0, I)$ 开始。
  2. 逐步去噪: 
     $$z_{t-1} = \frac{1}{\sqrt{\alpha_t}} \left( z_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}} \epsilon_\theta(z_t, t, c) \right) + \sigma_t \eta$$
     其中 $\eta \sim \mathcal{N}(0, I)$，$\sigma_t$ 为扩散过程方差。
  3. 最终通过VAE解码器生成图像：$x = D(z_0)$。

## Code Implementation

DiT Block based on [[torch]]:

```python
class AdaLNZero(nn.Module):
    """自适应层归一化（adaLN-Zero），动态生成LayerNorm参数并引入残差缩放（α）"""
    def __init__(self, hidden_dim, condition_dim):
        super().__init__()
        # 将条件嵌入（时间步+类别）映射到6倍隐藏维度（γ, β, α各2倍）
        self.mlp = nn.Sequential(
            nn.SiLU(),
            nn.Linear(condition_dim, 6 * hidden_dim, bias=True)
        )
        # 初始化MLP的最后一层权重和偏置为0，确保α初始为0
        nn.init.constant_(self.mlp[-1].weight, 0)
        nn.init.constant_(self.mlp[-1].bias, 0)

    def forward(self, x, condition):
        """
        输入:
            x: [batch_size, seq_len, hidden_dim]
            condition: [batch_size, condition_dim]
        输出:
            modulated_x: [batch_size, seq_len, hidden_dim]
        """
        # 通过MLP生成参数：γ, β, α（每个参数大小为hidden_dim）
        params = self.mlp(condition)  # [batch_size, 6*hidden_dim]
        gamma1, beta1, gamma2, beta2, alpha1, alpha2 = params.chunk(6, dim=-1)
        
        # 对自注意力和FFN的输出分别应用动态参数
        # 注意：此处alpha初始为0，残差连接初始近似恒等映射
        return (
            gamma1.unsqueeze(1),  # [batch_size, 1, hidden_dim]
            beta1.unsqueeze(1),
            gamma2.unsqueeze(1),
            beta2.unsqueeze(1),
            alpha1.unsqueeze(1),
            alpha2.unsqueeze(1)
        )

class DiTBlock(nn.Module):
    """Diffusion Transformer Block，包含自注意力、前馈网络和adaLN-Zero条件注入"""
    def __init__(self, hidden_dim, num_heads, condition_dim):
        super().__init__()
        # 自注意力层
        self.norm1 = nn.LayerNorm(hidden_dim, elementwise_affine=False)  # 禁用原生参数（由adaLN生成）
        self.attn = nn.MultiheadAttention(hidden_dim, num_heads, batch_first=True)
        
        # 前馈网络（FFN）
        self.norm2 = nn.LayerNorm(hidden_dim, elementwise_affine=False)
        self.mlp = nn.Sequential(
            nn.Linear(hidden_dim, 4 * hidden_dim),
            nn.GELU(approximate='tanh'),
            nn.Linear(4 * hidden_dim, hidden_dim)
        )
        
        # 条件注入模块
        self.adaLN = AdaLNZero(hidden_dim, condition_dim)

    def forward(self, x, condition):
        """
        输入:
            x: [batch_size, seq_len, hidden_dim]
            condition: [batch_size, condition_dim]（时间步+类别的嵌入）
        输出:
            x: [batch_size, seq_len, hidden_dim]
        """
        # 获取动态生成的adaLN-Zero参数
        gamma1, beta1, gamma2, beta2, alpha1, alpha2 = self.adaLN(x, condition)
        
        # 自注意力分支
        residual = x
        x = self.norm1(x)  # Pre-LN
        x = x * (1 + gamma1) + beta1  # 动态调整LayerNorm后的特征
        x, _ = self.attn(x, x, x)  # 自注意力计算
        x = alpha1 * x + residual  # 残差连接（alpha初始为0）

        # 前馈网络分支
        residual = x
        x = self.norm2(x)
        x = x * (1 + gamma2) + beta2
        x = self.mlp(x)
        x = alpha2 * x + residual

        return x
```

DiT:

```python
class PatchEmbed(nn.Module):
    """将潜在空间分块并嵌入为Transformer序列"""
    def __init__(self, in_channels=4, patch_size=2, hidden_dim=1152):
        super().__init__()
        self.patch_size = patch_size
        self.proj = nn.Conv2d(in_channels, hidden_dim, 
                            kernel_size=patch_size, 
                            stride=patch_size)  # 使用卷积实现分块

    def forward(self, x):
        # x: [B, C, H, W] -> [B, hidden_dim, H/p, W/p] -> [B, (H*W)/(p^2), hidden_dim]
        x = self.proj(x)  
        x = x.flatten(2).transpose(1, 2)  # 转换为序列
        return x

class DiT(nn.Module):
    """完整的Diffusion Transformer模型"""
    def __init__(self, 
               input_size=32,          # 潜在空间尺寸（默认32x32）
               patch_size=2, 
               in_channels=4, 
               hidden_dim=1152, 
               depth=28,               # DiT-XL的层数
               num_heads=16, 
               class_dim=1000,         # 类别嵌入维度
               learn_sigma=True):      # 是否预测协方差
        super().__init__()
        self.learn_sigma = learn_sigma
        self.num_patches = (input_size // patch_size) ** 2
        
        # 输入分块与位置编码
        self.patch_embed = PatchEmbed(in_channels, patch_size, hidden_dim)
        self.pos_embed = nn.Parameter(torch.randn(1, self.num_patches, hidden_dim) * 0.02
        
        # 时间步和类别嵌入
        self.timestep_embed = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, hidden_dim)
        self.class_embed = nn.Embedding(class_dim, hidden_dim)
        
        # Transformer块堆叠
        self.blocks = nn.ModuleList([
            DiTBlock(hidden_dim, num_heads, hidden_dim * 2)  # 条件维度为2*hidden_dim
            for _ in range(depth)
        ])
        
        # 输出层（预测噪声和协方差）
        self.norm = nn.LayerNorm(hidden_dim, elementwise_affine=False)
        self.out = nn.Linear(hidden_dim, 2 * in_channels * patch_size ** 2)
        
        # 初始化
        nn.init.trunc_normal_(self.pos_embed, std=0.02)
        self.apply(self._init_weights)

    def _init_weights(self, m):
        if isinstance(m, nn.Linear):
            nn.init.trunc_normal_(m.weight, std=0.02)
            if m.bias is not None:
                nn.init.constant_(m.bias, 0)

    def forward(self, x, t, class_labels):
        """
        输入:
            x: 带噪潜在变量 [B, C, H, W]
            t: 时间步 [B]
            class_labels: 类别标签 [B]
        输出:
            预测噪声和协方差 [B, C, H, W]
        """
        B, C, H, W = x.shape
        
        # 分块嵌入
        x = self.patch_embed(x)  # [B, num_patches, hidden_dim]
        x = x + self.pos_embed
        
        # 条件嵌入（时间步 + 类别）
        t_embed = self.timestep_embed(timestep_embedding(t, self.timestep_embed[0].weight.shape[1]))
        class_embed = self.class_embed(class_labels)
        condition = torch.cat([t_embed, class_embed], dim=1)  # [B, 2*hidden_dim]
        
        # 通过Transformer块
        for block in self.blocks:
            x = block(x, condition)
        
        # 输出解码
        x = self.norm(x)
        x = self.out(x)  # [B, num_patches, 2*C*p^2]
        
        # 重组为空间格式
        x = x.reshape(B, H//self.patch_size, W//self.patch_size, 
                    2*C, self.patch_size, self.patch_size)
        x = x.permute(0, 3, 4, 1, 5, 2).reshape(B, 2*C, H, W)
        
        # 分割噪声和协方差预测
        if self.learn_sigma:
            epsilon, sigma = x.chunk(2, dim=1)
            return epsilon, sigma
        else:
            return x

# -------------------------- 扩散工具函数 --------------------------
def timestep_embedding(timesteps, dim):
    """将时间步转换为正弦位置嵌入"""
    half_dim = dim // 2
    emb = torch.log(torch.tensor(10000)) / (half_dim - 1)
    emb = torch.exp(torch.arange(half_dim, device=timesteps.device) * -emb)
    emb = timesteps[:, None] * emb[None, :]
    emb = torch.cat([torch.sin(emb), torch.cos(emb)], dim=1)
    return emb

class GaussianDiffusion(nn.Module):
    """扩散过程管理器"""
    def __init__(self, 
               beta_start=1e-4, 
               beta_end=2e-2, 
               timesteps=1000,
               loss_type="l2"):
        super().__init__()
        self.timesteps = timesteps
        betas = torch.linspace(beta_start, beta_end, timesteps)
        alphas = 1. - betas
        alphas_cumprod = torch.cumprod(alphas, dim=0)
        
        # 注册缓冲区
        self.register_buffer('betas', betas)
        self.register_buffer('alphas_cumprod', alphas_cumprod)
        self.register_buffer('sqrt_alphas_cumprod', torch.sqrt(alphas_cumprod))
        self.register_buffer('sqrt_one_minus_alphas_cumprod', torch.sqrt(1. - alphas_cumprod))
        
    def q_sample(self, x0, t, noise=None):
        """前向扩散过程"""
        if noise is None:
            noise = torch.randn_like(x0)
        sqrt_alpha = self.sqrt_alphas_cumprod[t].view(-1, 1, 1, 1)
        sqrt_one_minus_alpha = self.sqrt_one_minus_alphas_cumprod[t].view(-1, 1, 1, 1)
        return sqrt_alpha * x0 + sqrt_one_minus_alpha * noise

# -------------------------- 示例用法 --------------------------
if __name__ == "__main__":
    # 超参数配置（以DiT-XL/2为例）
    B, C, H, W = 2, 4, 32, 32  # 潜在空间尺寸
    hidden_dim = 1152
    depth = 28
    num_heads = 16
    
    # 构造模型
    model = DiT(
        input_size=H,
        patch_size=2,
        hidden_dim=hidden_dim,
        depth=depth,
        num_heads=num_heads
    )
    diffusion = GaussianDiffusion()
    
    # 虚拟输入
    x0 = torch.randn(B, C, H, W)  # 干净潜在变量
    t = torch.randint(0, 1000, (B,))  # 随机时间步
    labels = torch.randint(0, 1000, (B,))  # 类别标签
    
    # 前向扩散
    noise = torch.randn_like(x0)
    xt = diffusion.q_sample(x0, t, noise)
    
    # 模型预测
    pred_noise, pred_sigma = model(xt, t, labels)
    
    # 损失计算（简化版）
    loss = F.mse_loss(pred_noise, noise)
    print(f"输入尺寸: {xt.shape}")
    print(f"预测噪声尺寸: {pred_noise.shape}")
    print(f"损失值: {loss.item():.4f}")
```