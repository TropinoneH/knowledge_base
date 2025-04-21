---
tags:
  - algorithm
  - paper
  - LLM
  - RL
aliases:
  - "Rethinking RL Scaling for Vision Language Models: A Transparent, From-Scratch Framework and Comprehensive Evaluation Scheme"
---
# MAYE

> [!paper]-
> ![[2504.02587v2_MAYE.pdf]]

RL 增强 LLM 推理能力

## Preparation
### Data

关注数学推理问题.

分为两个子类型, text-dominant(使用[mm_math5k](https://arxiv.org/abs/2404.05091) dataset)和vision-dominant(使用[geometry3k](https://openreview.net/forum?id=iX7eHHE5Tx) dataset):
![[Pasted image 20250421232341.png]]
### Algorithm

Loss为:
$$
\mathcal L^{\text{CLIP}}(\theta)=\mathbb E_{[q\sim P(q),o_q\sim\pi_{\theta_{\text{old}}}(o|q)]}\frac{1}{|o_q|}\sum_{t=1}^{|o_q|}\left\{\min\left[\text{prob}_t\hat A_t,\text{clip}(\text{prob}_t,1-\epsilon,1+\epsilon)\right]-\beta_{\text{loss}}\mathbb D_{\text{KL}}[\pi_\theta\|\pi_{\text{ref}}]\right\}
$$
$$\text{prob}_t=\frac{\pi_\theta(o_{q,t}|q,o_{q,<t})}{\pi_{\theta_{\text{old}}}(o_{q,t}|q,o_{q,<t})}$$
$$\hat A_t=\sum_{k=t}^{|o_q|}\gamma^{k-t}\left\{\underbrace{\mathbf I(o_{q,t}=\text{[EOS]})r(q,o_q)}_{\text{Rule-based reward}}-\underbrace{\beta_{\text{rew}}\mathbb D_{\text{KL}}[\pi_\theta(o_{q,t}|q,o_{q,<t})\|\pi_{\text{ref}}(o_{q,t}|q,o_{q,<t})]}_{\text{Token-level KL reward}}\right\}$$
其中
- $P(q)$是输入的queries的distribution
- $o_q$表示sequence of response tokens
- $\epsilon$通过$\text{clip}$将$\text{prob}_t$限制在$[1-\epsilon,1+\epsilon]$之内
- $\hat A$表示估计的$\text{token}_t$的estimated advantage, 表示是否是好token
- $\gamma$是discount factor, 令$\gamma=1$取消discount
- $\mathbb D_{\text{KL}}$使用[k3 formulation](http://joschu.net/blog/kl-approx.html), 提供unbiased estimation

令$\beta_{\text{rew}}=0$以取消对reward的KL散度的约束, 只应用对policy distribution的KL散度惩罚项
### Reward Function

作为Rule-based signal指导RL training

- 正确的answer获得`+1`, 错误的answer获得`0`
- secondary language reward: 使用English回答问题
  - 防止multi-lingual drift
- 取消format rewards, 不对格式做约束

### Model

使用`Qwen-2/2.5-VL-Instruct`

## MAYE Framework

![[Pasted image 20250421235425.png]]
### Setup

冻结connector(projector), ViT, 只训练LLM backend([[Transformer]])

- [Hydra](https://github.com/facebookresearch/hydra)管理ocnfiguration
- [FSDP2](https://arxiv.org/abs/2304.11277)用于分布式训练
- [vLLM](https://arxiv.org/abs/2309.06180)用于收集多模态

### Data Flow

将text data和vision data给tokenize
### Response Collection

生成Response. 分布式训练的话会涉及到GPU数据reduce
### Trajectory Collection

收集需要的token ids, 拼接query token ids和response token ids, 重新计算[[Transformer#Masked Softmax Operation|attention mask]]和[[Transformer#Positional Encoding|position encoding]]

为了防止out of memory, 只保留response的`logprobs`, 因为RL用不着query的`logprobs`
### Policy Update

基于保存的trajectories进行RL更新policy model. 使用[[#Algorithm]]中的公式计算Loss
## MAYE Scheme

**Training Set Metrics**
1. Accuracy curves: 反应algorithm和data preparation的正确性和有效性
2. Response length: 输出的长度, 反应模型的output pattern, 包括细节和推理深度的等级

**Validation & Test Set Metrics**
1. Accuracy curves: 输出随训练episode增加的准确性曲线
	- `pass@8`: `temperature=1.0`, `top_p=1.0`, 评估上限
	- `pass@1`: `temperature=0.6`, `top_p=1.0`, 评估真实性能, 并防止重复或不连贯的输出
	- `pass@1`: `temperature=0.01`, `top_p=0.001`. 评估真实性能, VLM的基准setup
2. Accuracy tabs: 最终模型的准确度表格

**Reflection Metrics**
1. Words count: "顿悟时刻"("aha moments"), 反应RL训练的有效性, 通过计算"反思词"("reflective words")在generation step中的频率来反映:
	- `["re-check", "re-evaluate", "re-examine", "re-think", "recheck", "reevaluate", "reexamine", "reevaluation", "rethink", "check again", "think again", "try again", "verify", "wait", "yet"]`
2. Ratio curves: 随训练进行, 展示reflective words的频率:
	- reflection ratio: $\frac{\mathcal N_{ref}}{\mathcal N}$
	- reflection ratio in correct answers: $\frac{\mathcal N_{ref+}}{\mathcal N_+}$
	- reflection ratio in incorrect answers: $\frac{\mathcal N_{ref}-\mathcal N_{ref+}}{\mathcal N-\mathcal N_+}$
	- correct ratio in reflection texts: $\frac{\mathcal N_{ref+}}{\mathcal N_{ref}}$
	- correct ratio in no reflection texts: $\frac{\mathcal N_+-\mathcal N_{ref+}}{\mathcal N-\mathcal N_{ref}}$

