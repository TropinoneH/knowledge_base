---
tags:
  - paper
  - DL
  - algorithm
  - EmbodiedAI
aliases:
  - "GraspNet-1Billion: A Large-Scale Benchmark for General Object Grasping"
publish: CVPR 2020
---
# GraspNet-1B

> [!paper]-
> ![[1912.13470_GraspNet-1B.pdf]]

问题:
1. 抓取的表示方法不同
2. 抓取数据少, 标注稀疏

目的:
1. 提供与真实世界传感器视觉感知 高度一致的数据
2. 密集精确的标注
3. 以统一的方式评估具有不同表示方法的抓取姿态

## Data Annotation

**6D Pose Annotation**

这个是对于每一个object的pose的标注:
$$P_i^j=\text{cam}_i^{-1}\text{cam}_0P_0^j$$
由于有$\text{cam}$标注, 只需要有第一帧的标注即可获取后续的标注. 其中, $P_i^j$是第$j$个object在frame $i$时的6D姿态, $\text{cam}_i$是在$i$时的相机姿态.

**Grasp Pose Annotation**

使用two-stage的方式自动化标注.

## Metrics

针对单个grasp pose的true positive

对于clustered scene, 使用Precision@k

为了避免dominated by similar grasp poses或者grasp poses from single object, 在评估之前使用pose-NMS.