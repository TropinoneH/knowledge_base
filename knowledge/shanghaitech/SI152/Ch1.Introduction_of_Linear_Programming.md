---
tags:
  - algorithm
  - tutorial
  - math
aliases:
  - Numerical Optimization - Introduction
---
# Preliminaries

[[Linear Algebra]]

> [!tip] Theorem
>
> 对于方阵$\mathbf A$, 下列的说法是相等的(知一推其他)
>
> 1. $\mathbf A$是可逆的(invertible)
> 2. $\mathbf A^\top$是可逆的
> 3. $|\mathbf A|\neq0$
> 4. $\mathbf A$的行是线性独立的
> 5. $\mathbf A$的列是线性独立的
> 6. 对于任意一个向量$\mathbf b$, 线性系统$\mathbf {Ax}=\mathbf b$都有特定的解
> 7. 存在一个向量$\mathbf b$, 线性系统$\mathbf {Ax}=\mathbf b$都有特定的解
# Introduction

## Variants of the linear programming problems

线性规划的一般形式:
$$
\matrix{
\text{minimize}&2x_1&-&x_2&+&4x_3\\
\text{subject to}&x_1&+&x_2&&&+&x_4&\leq&2\\
&&&3x_2&-&x_3&&&=&5\\
&&&&&x_3&+&x_4&\geq&3\\
&x_1&&&&&&&\geq&0\\
&&&&&x_3&&&\geq&0
}
$$
其中, $x_i,i\in\{1,2,3,4\}$是变量, 是用于最小化方程$2x_1-x_2+4x_3$的变量, 但是同时需要满足**subject to**的约束条件(线性方程或者线性不等式的集合).

我们可以将线性方程(不等式)用向量乘法来表示出来, 如$\mathbf a=(1,1,0,1),\mathbf x=(x_1,x_2,x_3,x_4)$, 那么第一个约束就可以是$a^\top x\leq2$

我们将系数$a$称作**cost vector**, 我们期望去最小化**cost function**: $\mathbf c^\top \mathbf x=\sum_ic_ix_i$

于是我们可以把线性规划写成如下形式:
$$
\matrix{
\text{minimize}&\mathbf c^\top \mathbf x\\
\text{subject to}&\mathbf a_1\mathbf x&\leq&\mathbf b_1\\
&\mathbf a_2\mathbf x&\geq& b_2\\
&\mathbf a_3\mathbf x&=&b_3\\
&x_{j_1}&\geq&0&j_1\in\mathbf N_1\\
&x_{j_2}&\leq&0&j_2\in\mathbf N_2
}
$$
其中, $a_1,a_2,a_3$是系数矩阵, $b_1,b_2,b_3$是向量. $N_1,N_2$是两个集合, 表示需要满足约束的$x_i$的index

我们成$x_i$称作**决定变量(decision variables)**, 一个满足所有约束的向量$\mathbf x$成为一个**可行解(feasible solution)**. 所有的可行解组成一个集合, 称这个集合为**可行集(feasible set)**或者**可行域(feasible region)**

我们将需要最小化的方程称作**目标方程(objective function)**或者**cost function**, 能够使得目标方程最小化的可行解称为**最优可行解(optimal feasible solution)**, 此时的目标函数的值称作**最优消耗(optimal cost)**.

>如果对于任意的实数$K$都能找到一个可行解$\mathbf x$, 使得$\mathbf c^\top \mathbf x\leq K$, 那么可以认为optimal cost为$-\infty$, 是无下限的(unbounded below)

对于求最大化的情况, 我们先转换成$-\mathbf c^\top \mathbf x$, 然后求最小值.

对于约束条件中的$\leq$情况, 我们做类似的处理, 转换成$(-\mathbf a_i)^\top \mathbf x\geq-\mathbf b_i$. 对于$x_j\leq0$和$x_j\geq0$, 我们可以看作是$a^\top x\geq0$的特殊情况. 对于等式$\mathbf a^\top \mathbf x=\mathbf b$, 我们可以转换为$\mathbf a^\top \mathbf x\geq\mathbf b$和$\mathbf a^\top \mathbf x\leq\mathbf b$同时满足.

于是转换结束之后我们可以得到所有条件都是$\mathbf a^\top \mathbf x\geq\mathbf b$的形式. 将所有的向量$\mathbf a^\top $拼接, 我们得到了一个矩阵:
$$
\mathbf A=\begin{bmatrix}-&a_1^\top &-\\&\vdots&\\-&a_m^\top &-\end{bmatrix}
$$
因此我们的线性规划的形式转换为:
$$
\matrix{\text{minimize}&\mathbf c^\top x\\\text{subject to}&\mathbf {Ax}&\geq&\mathbf b}
$$

### Standard form

$$
\matrix{\text{minimize}&\mathbf c^\top\mathbf x\\\text{subject to}&\mathbf{Ax}&=&\mathbf b\\&\mathbf x&\geq&0}
$$

我们可以认为约束条件是一个线性组合: $\mathbf{Ax}=\sum_i\mathbf A_ix_i=\mathbf b$.

将一般形式规约到标准形式:

1. 消除*自由的*变量: 自由变量是一个变量没有单独的约束(如$x\leq0$或$x\geq0$). 我们需要用两个额外的变量代替: 用$x_i^+-x_i^-$代替$x_i$, 并满足约束$x_i^+\geq0,x_i^-\geq0$.
2. 消除不等式约束: 将不等式转换为等式. 引入新的变量: $\mathbf a^\top \mathbf x\leq\mathbf b\Rightarrow\mathbf a^\top \mathbf x+s=\mathbf b$, 满足$s\geq0$. 以及$\mathbf a^\top\mathbf x\geq\mathbf b\Rightarrow\mathbf a^\top\mathbf x-s=\mathbf b$, 满足$s\geq0$

如此可以将一般形式的线性规划转换为标准形式, 为后续求解做准备. 一般形式一般与用推到线性规划的数学理论问题.

## Piecewise linear convex objective functions

> [!info] Definition
>
> 如果一个函数$f:\mathbb R^n\mapsto\mathbb R$满足$\forall \mathbf x,\mathbf y\in\mathbb R^n,\lambda\in[0,1]$都有$f(\lambda\mathbf x+(1-\lambda)\mathbf y)\leq\lambda f(\mathbf x)+(1-\lambda)f(\mathbf y)$, 那么我们称函数$f$为convex(凸)的
>
> 如果$f:\mathbb R^n\mapsto\mathbb R$满足$\forall \mathbf x,\mathbf y\in\mathbb R^n,\lambda\in[0,1]$都有$f(\lambda\mathbf x+(1-\lambda)\mathbf y)\geq\lambda f(\mathbf x)+(1-\lambda)f(\mathbf y)$, 那么我们称函数$f$为concave(凹)的

注意, $\lambda\mathbf x+(1-\lambda)\mathbf y$就是在$\mathbf x$和$\mathbf y$两点连线上的一点.

对于线性规划而言, 所有的函数都是线性函数, 那么不论是concave还是convex, 他们的判断方法都从不等式变成了等式$f(\lambda\mathbf x+(1-\lambda)\mathbf y)=\lambda f(\mathbf x)+(1-\lambda)f(\mathbf y)$, 并且如果是convex, 那么一定是concave; 反之亦然.



一个函数$f$如果是convex的, 那么$-f$一定是concave的.

如果是一个**仿射函数(affine function)**$f(\mathbf x)=a_0+\sum_{i=i}^na_ix_i$, 那么该函数一定同时是convex和concave的.



当$f(\mathbf x)\leq f(\mathbf y)$, 其中$\mathbf y$是$\mathbf x$的邻域时, 我们称一个可行解$\mathbf x$是**局部最小化(local minimize)**

当$f(\mathbf x)\leq f(\mathbf y),\forall \mathbf y$时, 我们称一个可行解$\mathbf x$是**全局最小化(global minimize)**

对于convex函数, local minimize就是global minimize

> [!tip] Theorem
>
> 假设$f_1,\cdots,f_m:\mathbb R^n\mapsto\mathbb R$都是convex的函数, 那么函数$f(\mathbf x)=\max_{i=1,\cdots,m}f_i(\mathbf x)$也是convex的

其中$f(\mathbf x)=\max_{i=1,\cdots,m}f_i(\mathbf x)$被称为**分段函数(piecewise function)**. 分段函数也有时候用于模仿一个convex的幂次函数.

我们可以把一个目标函数为分段线性函数的线性规划规约成一个标准形式的线性规划:
$$
\matrix{\text{minimize}&\max(\mathbf c_i^\top\mathbf x+d_i)\\\text{subject to}&\mathbf {Ax}&\geq&b}\ \ \ \Rightarrow\ \matrix{\text{minimize}&z\\\text{subject to}&z&\geq&\mathbf c_i^\top\mathbf x+d_i\\&\mathbf {Ax}&\geq&\mathbf b}
$$
其中, 决定变量为$z$和$\mathbf x$

> 使用分段函数能够便捷的模拟一个真实的convex的函数. 但是会引入不可导点(两端函数连接的地方), 有不连续导数, 会导致函数不平滑.

对于绝对值函数$|\mathbf x|$而言, 可以使用类似的方法来规约:

1. 将绝对值替换为$\max\{\mathbf x,-\mathbf x\}$
2. 引入新的变量替换掉$\max$函数: $\forall i,x_i\leq z_i,-x_i\leq z_i$

或者用另外一种方法:

1. 引入两个新的变量: 使用$x_i^++x_i^-$替换$|x_i|$, 满足$x_i^+,x_i^-\geq0$. 其中, 原始的$x_i=x_i^+-x_i^-$.
2. 需要添加额外的约束条件, $x_i^+$和$x_i^-$中至少有一个为0