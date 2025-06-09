---
tags:
  - paper
  - LLM
  - DL
  - Vision
aliases:
  - "VideoTree: Adaptive Tree-based Video Representation for LLM Reasoning on Long Videos"
publish: CVPR 2025
---
# Video Tree

> [!paper]-
> ![[2405.19209v3_VideoTree.pdf]]

motivate:
1. 信息冗余, 大量查询无关信息
2. 查询没有粒度的区分. 部分信息密集区域可能需要更细粒度的时序理解

## Method

### Adaptive Breadth Expansion

![[Pasted image 20250520204421.png]]

**Visual Clustering**

根据semantic similarity对视频帧进行聚类以减少冗余.

定义视频帧序列$V=(F_1,\cdots,F_n)$, 其中$F_i$是时间步$i$处的frame, $n$是视频长度. 使用pretrained visual encoder ([EVA-CLIP-18B](https://arxiv.org/abs/2402.04252)) 提取features $f_i=E(F_i)\in\mathbb R^d$. 然后使用K-means根据features进行[[Fit#聚类|cluster]].

**Cluster Captioning**

使用Captioner对每一个cluster的keyframe(cluster中心的frame)或者keyframe及周围的frame转换为文本描述, 将这些文本描述作为相应cluster的关键语义描述.

**Relevance Scoring**

使用LLM的推理能力来评估提取信息是否足以回答给定的query.

- 输入: Captioning $\{t_i|i=1,\cdots,k\}$和query $q$.
- 输出: 相关性分数$\{r_i|i=1,\cdots,k\}$, $r_i$是第$i$个cluster的分数. 分成三个级别:
	1. not relevant
	2. somewhat relevant
	3. highly relevant

设置$\text{rele\_num\_thresh}$, 作为阈值, 决定Adaption过程是否停止. 设置聚类数量的最大值$\text{max\_breadth}$以避免无限循环.

### Relevance-Guided Depth Expansion

对于Somewhat Relevant的cluster, 将其重新聚类成$w$个sub-cluster, $w$为树的branch width.

对于highly relevant的cluster, 将其重新聚类成具有$w$宽度的两级树, 同时保留前一级别的信息

### LLM Video Reasoning

inference的时候, 从树的root节点开始遍历, 扩展到叶子节点, 从tree的所有cluster中提取keyframe, 并使用captioner生成caption. 然后将这些keyframe的caption按照时间顺序排序, 并连接成一个视频的文本描述.

最终, 向LLM提供基于文本的视频描述.