---
tags:
  - algorithm
  - paper
  - RL
  - LLM
  - DL
aliases:
  - "ToRL: Scaling Tool-integrated RL"
---
# ToRL

> [!paper]-
> ![[2503.23383v1_ToRL.pdf]]

一个from-scratch的RL训练, 允许模型通过广泛的探索找到最佳的工具利用策略

## Dataset

数学奥赛级别的问题
- [NuminaMATH](http://faculty.bicmr.pku.edu.cn/~dongbin/Publications/numina_dataset.pdf)
- [MATH](https://arxiv.org/abs/2103.03874)
- [DeepScaleR](https://arxiv.org/abs/2502.11886)

## Tool Integrated Reasoning(TIR)

使用TIR取代CoT, 增加精准计算能力

使用tool integrated reasoning可以调用外部程序. TIR的一个trajectory为:
$$s_k=(r_1,c_1,o_1,\cdots,r_k,c_k,o_k)$$
其中, $r_i$表示自然语言推理, $c_i$表示生成的代码, $o_i$表示外部$c_i$得到的结果. 生成过程表示为:
1. $(r_k,c_k)=\text{LLM}(q\oplus s_{k-1})$
2. $o_k=I(c_k)$
3. $s_k=s_{k-1}\oplus r_k\oplus c_k\oplus o_k$

其中query $q$, $I$是外部的代码解释器

## ToRL

将[[#Tool Integrated Reasoning(TIR)|TIR]]直接与LLM使用RL结合, without prior fine-tuning.

### TIR Rollout Framework

使用`Qwen2.5-Math`作为[[Transformer]] LLM backend

当识别到$'''\text{output}$的时候, 会停止输出, 并调用外部程序执行代码, 将结果$\text{Observation}$返回给LLM, 并拼接成$'''\text{output}\backslash n\text{Observation}\backslash n'''$, 然后LLM继续生成自然语言

### Design Choices of ToRL

**Tool Call Frequency Control**

防止使用CPU进行执行代码导致GPU空闲时间过长, 设置超参数$C$, 当调用代码次数超过$C$时, 强制使用纯文本推理

**Execution Environment Selection**

使用[Sandbox Fusion](https://bytedance.github.io/SandboxFusion/), 提供隔离的环境

**Error Message Processing**

让Sandbox Fusion生成不含有文件的报错信息并只提取最后一行(为了减少上下文长度)

**Sandbox Output Masking**

计算loss的时候, 屏蔽Sandbox输出(即, $\text{Obversation}$)

### Reward Design

成功回答问题, reward$+1$, 否则, reward$-1$

引入基于代码的惩罚: 如果代码不可执行, 则reward$-0.5$