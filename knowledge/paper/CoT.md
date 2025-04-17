---
tags:
  - paper
  - algorithm
  - LLM
  - DL
aliases:
  - Automatic Chain of Thought Prompting in Large Language Models
  - "Tree of Thought: Deliberate Problem Solving with Large Language Models"
  - Reverse Multi-Choice Dialogue Commonsense Inference with Graph-of-Thought
  - "Chain of Draft: Thinking Faster by Writing Less"
---
使用思维链对LLM进行优化.

# Auto CoT

[[2210.03493v1_AutoCoT.pdf]]

## Introduce

zero-shot CoT: 使用简单的提示, 如: `Let's think step by step`, 自动进行推导
- 优点: 省事
- 缺点: 效果不稳定

人工设计CoT: 手动设计prompt, 人工引导
- 优点: 效果好
- 缺点: 费人

## Auto-CoT: Automatic Chain-of-Thought Prompting

1. 使用Sentence-BERT将句子处理成一个向量
2. 使用kmeans算法将向量进行聚类
3. 按照离中心点的距离进行排序

对于每一个cluster, 生成一个示例:
1. 使用Sentence-BERT将句子处理成一个向量
2. 找到该向量对应聚类的中心点
3. 使用zero-shot生成推理链和答案
4. 如果满足要求, 保存

推理新问题的时候: 将示例的上下文拼接在前面, 然后使用zero-shot CoT进行推理

# ToT

[[2305.10601v2_ToT.pdf]]

## Introduce

对于非链式思维方式, 如证明, 需要考虑不同的方向

使用类似搜索算法的方式, 前瞻和回溯

## ToT

每一个节点都是一个状态

思想分解(Thought Decomposition): 足够小

思想生成器(Thought Generator): 给定一个tree state, 生成$k$个candidates, 通过下面两个策略:
1. Sample, 通过prompt进行CoT采样
2. Propose, 通过prompt按顺序生成"想法". 在同一个context中进行propose可以避免重复的回答

状态评估器(State Evaluator): 评估在解决问题方面取得的进展
1. 对每一个state进行估值. 这些值不需要太精确, 只需要大致反映进度即可
2. 对每一个state投票. 给最有希望的方案投票

搜索算法(Search Algorithm): DFS或者BFS

# GoT

[[2312.15291v2_GoT.pdf]]

## Introduce

做选择题, 迷宫
## Rex-GoT

Reverse Exclusion with Graph-of-Thought

三个步骤:
1. 根据上下文信息初步判断, 排除不合理的选项, 提供排除原因
2. 针对每个选项进行详细分析, 同时考虑上下文, 排除的选项和排除的原因
3. 综合前两个步骤中的有效信息, 为GoT选择最佳路径, 确定最终的答案

![[Pasted image 20250407233941.png]]

# CoD

[[2502.18600v1_ChainOfDraft.pdf]]

## Introduce

只记录关键信息, 而不是全部的信息

## Chain-of-Draft Prompting

只记录最基本的中间过程(草稿, Draft)

```
Think step by step, but only keep a minimum draft for each thinking step, with 5 words at most. Return the answer at the end of the response after a separator ####.
```
