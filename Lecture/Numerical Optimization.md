---
type: lecture note
tags:
  - lecture
  - math
  - algorithm
teacher:
  - 石野
ClassID: SI152
done: true
---
# Preliminaries

[[LinearAlgebra]]

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
\begin{matrix}
\text{minimize}&2x_1&-&x_2&+&4x_3\\
\text{subject to}&x_1&+&x_2&&&+&x_4&\leq&2\\
&&&3x_2&-&x_3&&&=&5\\
&&&&&x_3&+&x_4&\geq&3\\
&x_1&&&&&&&\geq&0\\
&&&&&x_3&&&\geq&0
\end{matrix}
$$
其中, $x_i,i\in\{1,2,3,4\}$是变量, 是用于最小化方程$2x_1-x_2+4x_3$的变量, 但是同时需要满足**subject to**的约束条件(线性方程或者线性不等式的集合).

我们可以将线性方程(不等式)用向量乘法来表示出来, 如$\mathbf a=(1,1,0,1),\mathbf x=(x_1,x_2,x_3,x_4)$, 那么第一个约束就可以是$a^\top x\leq2$

我们将系数$a$称作**cost vector**, 我们期望去最小化**cost function**: $\mathbf c^\top \mathbf x=\sum_ic_ix_i$

于是我们可以把线性规划写成如下形式:
$$
\begin{matrix}
\text{minimize}&\mathbf c^\top \mathbf x\\
\text{subject to}&\mathbf a_1\mathbf x&\leq&\mathbf b_1\\
&\mathbf a_2\mathbf x&\geq& b_2\\
&\mathbf a_3\mathbf x&=&b_3\\
&x_{j_1}&\geq&0&j_1\in\mathbf N_1\\
&x_{j_2}&\leq&0&j_2\in\mathbf N_2
\end{matrix}
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
\begin{matrix}\text{minimize}&\mathbf c^\top x\\\text{subject to}&\mathbf {Ax}&\geq&\mathbf b\end{matrix}
$$

### Standard form

$$
\begin{matrix}\text{minimize}&\mathbf c^\top\mathbf x\\\text{subject to}&\mathbf{Ax}&=&\mathbf b\\&\mathbf x&\geq&0\end{matrix}
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
\begin{matrix}\text{minimize}&\max(\mathbf c_i^\top\mathbf x+d_i)\\\text{subject to}&\mathbf {Ax}&\geq&b\end{matrix}\ \ \ \Rightarrow\ \begin{matrix}\text{minimize}&z\\\text{subject to}&z&\geq&\mathbf c_i^\top\mathbf x+d_i\\&\mathbf {Ax}&\geq&\mathbf b\end{matrix}
$$
其中, 决定变量为$z$和$\mathbf x$

> 使用分段函数能够便捷的模拟一个真实的convex的函数. 但是会引入不可导点(两端函数连接的地方), 有不连续导数, 会导致函数不平滑.

对于绝对值函数$|\mathbf x|$而言, 可以使用类似的方法来规约:

1. 将绝对值替换为$\max\{\mathbf x,-\mathbf x\}$
2. 引入新的变量替换掉$\max$函数: $\forall i,x_i\leq z_i,-x_i\leq z_i$

或者用另外一种方法:

1. 引入两个新的变量: 使用$x_i^++x_i^-$替换$|x_i|$, 满足$x_i^+,x_i^-\geq0$. 其中, 原始的$x_i=x_i^+-x_i^-$.
2. 需要添加额外的约束条件, $x_i^+$和$x_i^-$中至少有一个为0

# Geometry of linear programming

## Polyhedra and convex set

> [!info] Definition
>
> 1. Polyhedron是一个集合$\{\mathbf x\in\mathbb R^n|\mathbf{Ax}\geq \mathbf b\},\mathbf A\in\mathbb R^{m\times n},b\in\mathbb R^n$
> 2. 如果一个集合$S\subset\mathbb R^n$存在一个常量$K$满足所有$S$中的元素的所有components的绝对值都小于等于$K$, 那么我们称$S$是**有界的(bounded)**
> 3. 如果一个向量$\mathbf a\in\mathbb R^n$, 一个标量$b$, 那么
>     - $\{\mathbf x\in\mathbb R^n|\mathbf a^\top \mathbf x=b\}$称为**超平面(hyperplane)**
>     - $\{\mathbf x\in\mathbb R^n|\mathbf a^\top \mathbf x\geq b\}$称为**半空间(halfspace)**

之前的[[#Variants of the linear programming problems|feasible set]]中有提到可以将所有的约束规约成$\mathbf{Ax}\geq\mathbf b$的形式, 那么我们可以把Polyhedron看成一个feasible set. 相似的, 我们可以将$\{\mathbf x\in\mathbb R^n|\mathbf {Ax}=\mathbf b,\mathbf x\geq0\}$当成Polyhedron的标准形式

超平面hyperplane可以看成是有界(bounded)的半空间.

hyperplane的表达中的向量$\mathbf a$可以认为是该plane的法向量. 假设该平面与法向量$\mathbf a$的交点是$\mathbf x_0$, 那么对于任意一个非$\mathbf x_0$的点$\mathbf x$, 都有
$$
\mathbf a^\top(\mathbf x-\mathbf x_0)=0\Rightarrow \mathbf a^\top\mathbf x-\mathbf a^\top\mathbf x_0=0\Rightarrow\mathbf a^\top\mathbf x=\mathbf a^\top\mathbf x_0\Rightarrow\mathbf a^\top\mathbf x=\mathbf b
$$
![[Pasted image 20250303154326.png]]

上图是一个polyhedron $\{\mathbf x\in\mathbb R^2|\mathbf a_i^\top\mathbf x\geq\mathbf b_i,i=1,2,3,4,5\}$

### Convex Set

> [!info] Definition
>
> 1. 对于一个集合$S$, 如果有$\mathbf x,\mathbf y\in S$满足$\lambda\mathbf x+(1-\lambda)\mathbf y\in S,\lambda\in[0,1]$, 那么我们称$S$为**凸集(convex set)**
> 2. 假设有一组向量$\mathbf x_1,\cdots,\mathbf x_n$, 有对应的一组和为$1$的标量$\lambda_1,\cdots,\lambda_n,s.t.\sum_i\lambda_i=1$.
>     - 我们称$\sum_{i=1}^n\lambda_i\mathbf x_i$为**convex combination**
>     - 上述所有向量$\mathbf x_i$的**凸面体(convex hull)**即为所有的向量的convex combination组成的集合

注意到$\lambda\mathbf x+(1-\lambda)\mathbf y$实际上是$\mathbf x$和$\mathbf y$的加权平均, 是$\mathbf {xy}$连线上的一个分割点. convex set就是判断这条线段是否也在集合中

> [!tip] Theorem
>
> 1. convex set的交集(intersection)还是convex set
> 2. 每一个polyhedron都是convex set
> 3. 一个convex set中有限元素的convex combination还是属于该convex set
> 4. 有限个向量的convex hull是一个convex set

## Extreme points, vertices, and basic feasible solution

> [!info] Definition
>
> 假设$P$是多面体Polyhedron
>
> 1. 如果一个向量$\mathbf x\in P$无法在$P$中找到两个向量$\mathbf y,\mathbf z\in P$满足$\lambda\mathbf y+(1-\lambda)\mathbf z=\mathbf x,\lambda\in[0,1]$, 那么我们称这个向量$\mathbf x$为**极点(extreme point)**
> 2. 如果一个向量$\mathbf x\in P$, $\exists\mathbf c$满足$\mathbf c^\top\mathbf x<\mathbf c^\top\mathbf y,\forall\mathbf y\in P,\mathbf y\neq\mathbf x$, 那么我们称向量$\mathbf x$为**顶点(vertex)**

![[Pasted image 20250304193335.png]]

向量$\mathbf x$是无法使用两个都在$P$内的点表示的, 但是$\mathbf x$本是是属于$P$的.

![[Pasted image 20250305154032.png]]

> [!info] Definition
>
> 1. 如果一个向量$\mathbf x^*$满足对于某些$i\in M_1,M_2,M_3,\mathbf a_i^\top\mathbf x=b_i$, 那么我们称对应的约束条件为**积极约束(active constrains)**
> 2. 对于一个Polyhedron $P$, 通过等式和不等式来约束. 假设有一个向量$\mathbf x^*\in\mathbb R^n$,
>     - 如果所有的等式约束都是积极的, 并且有$n$个约束是线性独立的, 那么我们称向量$\mathbf x^*$为**基础解(basic solution)**
>     - 若$\mathbf x^*$是basic solution并满足所有的约束, 那么我们称这个向量为**基本可行解(basic feasible solution)**

如果积极约束有$n$个, 对应$n$个未知变量, 那么如果这$n$个线性方程是线性独立的, 那么这个线性规划系统有解

> [!tip] Theorem
>
> 假设向量$\mathbf x^*\in\mathbb R^n$, 集合$I=\{i|\mathbf a^\top_i\mathbf x=b_i\}$是$\mathbf x^*$的积极约束的下标, 那么下列说法是等价的(知一推其他)
>
> 1. 存在$n$个向量, 属于集合$\{\mathbf a^\top_i|i\in I\}$中, 是线性独立的
> 2. 所有$\{\mathbf a_i|i\in I\}$中的向量能够张成(span)整个$\mathbb R^n$空间, 也就是说, 所有的$\mathbb R^n$中的向量可以使用$\mathbf a_i$的线性组合表示出
> 3. 线性系统$\mathbf a_i^\top\mathbf x=b_i,i\in I$有唯一解

或者说是约束是线性独立(linear independent)的, 即$\mathbf a_i$是linear independent的.

现在定义**corner point**的定义: 存在$n$个linear independent的active constrains的feasible solution. 通过寻找$n$个linear independent的active constrains, 我们有一个unique的解$\mathbf x^*$, 但是这个不一定是feasible的, 因为可能会违反inactive constrains

> [!info] Definition
>
> 假设Polyhedron $P$被线性等式和不等式定义, 假设$\mathbf x^*$是$P$中的一个元素
>
> 1. 若满足: 1. 所有等式均为active solution 2. 在所有对$\mathbf x^*$的constrains中, 有$n$个是linear independent的. 那么我们称$\mathbf x^*$是**基本解(basic solution)**
> 2. 若$\mathbf x^*$是basic solution, 并且满足所有的constrains, 那么我们称$\mathbf x^*$为**基本可行解(basic feasible solution)**

如果只有$m$个constrains定义Polyhedron, 并且$m<n$, 那么可以认为这个Polyhedron没有basic solution或者basic feasible solution

> [!tip] Theorem
>
> 假设非空的Polyhedron $P$, 假设$\mathbf x^*\in P$, 那么下列条件是等价的:
>
> 1. $\mathbf x^*$是vertex
> 2. $\mathbf x^*$是extreme point
> 3. $\mathbf x^*$是basic feasible solution
>
> 推论: 假设有finite linear inequality constrains, 那么有finite basic or basic feasible solution

### Adjacent basic solution

两个$\mathbb R^N$上的不同的basic solution, 如果有$n-1$个linear equality constrains共同active, 那么我们称这两个basic solution为adjacent的.

如果两个adjacent的basic solution都是feasible的, 那么这两个点的连线称为feasible set的**边(edge)**

## Polyhedra in standard form

假设Polyhedron $P=\{\mathbf x\in\mathbb R^n|\mathbf {Ax}=\mathbf b,\mathbf x\geq0\}$, 其中$\mathbf A\in\mathbb R^{m\times n}$, $m$是行数, 表示equality约束的个数. 假设$\mathbf A$的$m$行都是linear independent的, 由于每一行都是$n$维的, 我们可以认为说$m\leq n$(为了保证线性独立). 那么我们可以说当$P$非空时, 可以丢弃$A$的线性相关行的冗余约束.

对于任何的basic solution, 都有$n$个linear independent active constrains. 此外, 如果要满足约束$\mathbf {Ax}=\mathbf b$, 那么这提供了$m$个active constrains. 由于我们假设了$m\leq n$并且这$m$个约束都是linear independent的, 我们还需要$n-m$个与$\mathbf {Ax}=\mathbf b$提供的$m$个约束也独立的线性约束. 因此我们会选择$n-m$个变量$x_i$创建等式$x_i=0$, 即满足约束$\mathbf x\geq0$. 为了让$x_i=0$也是linear independent, 我们对$x_i$的选择是有特定方案的.

> [!info] Definition
>
> 1. 考虑$\mathbf {Ax}=\mathbf b$和$\mathbf x\geq0$, 假设$\mathbf A$是row-independent的. 假设basic solution $\mathbf x\in\mathbb R^n$, 当且仅当有$\mathbf {Ax}=\mathbf b$时, 存在索引(indices)$B(1),\cdots,B(m)$, 满足:
>     - 列$A_{B(1)},\cdots,A_{B(m)}$是linear independent的
>     - 如果$i\neq B(1),\cdots,B(m)$, 那么$x_i=0$

那么对于[[#Standard form|Standard Form]]的Polyhedron可以用这个方式求解:

1. 找$m$个linear independent column: $\mathbf A_{B(1)},\cdots,\mathbf A_{B(m)}$
2. 令$x_i=0,\forall i\neq B(1),\cdots,B(m)$
3. 解方程$\mathbf {Ax}=\mathbf b$, 求解$x_{B(1)},\cdots,x_{B(m)}$

如果上述方法构建的basic solution是非负的, 那么我们可以认为是一个feasible basic solution.

变量$x_{B(i)}$称为**基本变量(basic variables)**, 其他的是**非基本变量(nonbasic)**. 我们称列$A_{B(i)}$为**基本列(basic column)**, 并且他们是linear independent的, 因此他们组成了$\mathbb R^m$的一组基. 我们假定不同的基有不同的索引, 但是如果顺序不同不认为是不同的基.

将$m$个基本列组合在一起, 我们获得了一个$\mathbf B\in\mathbb R^{m\times m}$, 称为基矩阵, 是可逆的, 因为所有column linear independent, 因此是满秩的.
$$
\mathbf B=\begin{bmatrix}\vert&\cdots&\vert\\A_{B(1)}&\cdots&A_{B(m)}\\\vert&\cdots&\vert\end{bmatrix} ,\quad\quad\quad\mathbf x_B=\begin{bmatrix}x_{B(1)}\\\vdots\\x_{B(m)}\end{bmatrix}
$$

解基本方程$\mathbf{Bx}_B=\mathbf b$有$\mathbf x_B=\mathbf B^{-1}\mathbf b$

假设有$\mathbf A_{B(p)}=\mathbf A_{B(q)}$, 那么两组基$\{\cdots,B(p),\cdots\}$和$\{\cdots,B(q),\cdots\}$是完全相同的, 但是不是相同的基, 因为indices不同

### Correspondence of bases and basic solutions

一组基唯一确定一个基本解. 但是不同的基可能确定了相同的基本解.

### Adjacent basic solution and adjacent base

相似的, 如果两组bases共享除了一个basic column以为所有的basic column, 我们称这两组bases为相邻的

相邻的basic solution总是从相邻的bases中获得. 同样, 如果相邻的bases获取*不同的*basic solution, 那么也是相邻的.

### The full row rank assumption on $\mathbf A$

> [!tip] Theorem
>
> 假设有非空Polyhedron $P=\{\mathbf x|\mathbf {Ax}=\mathbf b,\mathbf x\geq0\}$, $\mathbf A\in\mathbb R^{m\times n}$, 有$\mathbf a_1^\top,\cdots,\mathbf a_m^\top$是$\mathbf A$的行向量. 假设$\text{rank}{\mathbf A}=k<m$且行$\mathbf a_{i_1}^\top,\cdots,\mathbf a_{i_k}^\top$是linear independent的. 假设有一个Polyhedron $Q=\{\mathbf x|\mathbf a_{i_1}^\top\mathbf x=b_{i_1},\cdots,\mathbf a_{i_k}^\top\mathbf x=b_{i_k},\mathbf x\geq0\}$, 那么可以认为$P=Q$

注意, Q其实是标准形式的, 可以写成$Q=\{\mathbf x|\mathbf {Dx}=\mathbf f,\mathbf x\geq0\}$, 其中$\mathbf D\in\mathbb R^{k\times n}$是$\mathbf A$的一个子矩阵, $\mathbf f\in\mathbb R^k$是$\mathbf b$的$k$维子向量.

因此我们可以得出结论, 只要是非空的feasible set, 那么可以将标准形式的线性规划问题简化为一个等价的具有相同feasible set的标准形式问题, 并且该问题的所有约束都是linear independent的.

## Degeneracy

可能会存在有多个active constrains的情况, 但是线性独立的约束最多不超过$n$个. 在这种情况下, 我们有了一个**退化(degeneracy)**的basic solution.

> [!info] Definition
>
> 若一个basic solution $\mathbf x\in\mathbb R^n$的active constrains超过$n$个, 那么我们称这个$\mathbf x$是**退化(degeneracy)**的.

在二维空间中, 一个degeneracy的basic solution基本上是三条或以上的直线的交点. 

### Degeneracy in standard form polyhedra

> [!info] Definition
>
> 标准形式Polyhedron $P=\{\mathbf x|\mathbf {Ax}=\mathbf b,\mathbf x\geq0\},\mathbf A\in\mathbb R^{m\times n}$有basic solution $\mathbf x$. 假设$\mathbf x$有超过$n-m$个分量为$0$, 那么$\mathbf x$是一个degeneracy的basic solution.

### Degeneracy is not a purely geometric property

在一个特定标准形式表示下degeneracy的basic feasible solution在另一个表示下可能是非退化的。然而，可以证明，如果一个basic feasible solution在一个特定的标准形式表示下是退化的，那么它在同一多面体的每个标准形式表示下都是退化的

## Existence of extreme points

> [!info] Definition
>
> 一个Polyhedron $P\subset\mathbb R^n$, 如果存在一个向量$\mathbf x\in P$和一个非$0$向量$\mathbf d\in\mathbf R^n$, 满足$\mathbf x+\lambda\mathbf d\in P$对于任意的标量$\lambda$, 那么$P$包含一条直线.

> [!tip] Theorem
>
> 假设$P=\{\mathbf x\in\mathbb R^n|\mathbf a_i^\top\mathbf x\geq b_i,i=1\cdots,m\}$, 下列说法是等价的:
>
> 1. $P$至少有一个extreme point
> 2. $P$不包含直线
> 3. 存在来自$\mathbf a_i,i=1,\cdots,m$的$n$个向量是linear independent的
>
> Corollary
>
> 每个非空有界的Polyhedron至少有一个basic feasible solution

## Optimality of extreme points

> [!tip] Theorem
>
> 考虑在Polyhedron $P$上最小化$\mathbf c^\top\mathbf x$的线性规划问题. 假设Polyhedron至少有一个extreme point, 至少有一个最优解. 那么$P$上的extreme point就是$\mathbf c^\top\mathbf x$的最优解
>
> 如果不存在最优解, 那么最小值一定是$-\infty$, 否则最优解一定是其中一个extreme points
>
> Corollary
>
> 一个线性规划求解$\mathbf c^\top\mathbf x$的最小值, 要么是$-\infty$, 要么存在一个最优解

## Representation of bounded polyhedra

> [!tip] Theorem
>
> 一个非空的**有界的(bounded)** polyhedron $P$是其所有的extreme points组成的convex hull

# The Simplex Method

## Optimality conditions

> [!info] Definition
>
> 假设$\mathbf x$是polyhedron $P$的一个元素. 假设$\mathbf d\in\mathbb R^n$满足$\mathbf x+\theta\mathbf d\in P$, $\theta$是一个正标量, 那么我们称$\mathbf d$为**可行方向(feasible direction)**

我们假设$\mathbf x$是线性规划的[[#Correspondence of bases and basic solutions|basic feasible solution]], 设$B(1),\cdots,B(m)$是basic variable的索引, 设basic matrix $\mathbf B=\begin{bmatrix}\vert&\cdots&\vert\\A_{B(1)}&\cdots&A_{B(m)}\\\vert&\cdots&\vert\end{bmatrix}$. 特别的, 对于nonbasic variable有$x_i=0$, 对于basic variables有$\mathbf x_B=(x_{B(1)},\cdots,x_{B(m)})$, 满足$\mathbf x_B=\mathbf B^{-1}\mathbf b$

我们考虑通过一个nonbasic variable($x_j=0$), 并将其数值增加到positive value $\theta$, 同时保持其他的nonbasic variable仍为$0$, 从而将$\mathbf x\to\mathbf x+\theta\mathbf d$. 此时从代数上而言, $d_j=1$而其他nonbasic variable对应的$d_i=0$, 而basic variable对应的变量$\mathbf d_B=(d_{B(1)},\cdots,d_{B(m)})$. 

由于我们只关注feasible solution, 因此我们希望有$\mathbf A(\mathbf x+\theta\mathbf d)=0$, 由于可行解$\mathbf {Ax}=\mathbf b$, 因此有$\theta\mathbf {Ad}=\mathbf{Ad}=0$. 其中,
$$
\mathbf {Ad}=\sum_{i=1}^n\mathbf A_id_i=\mathbf A_j+\sum_{i=1}^m\mathbf A_{B(i)}d_{B(i)}=\mathbf {Bd}_B+\mathbf A_j=0
$$
由于$\mathbf B$是可逆的, 因此有$\mathbf d_B=-\mathbf B^{-1}\mathbf A_j$

其中$\mathbf d$被称为第$j$个**基准方向(basic direction)**. 这个条件下我们一定能满足active constrains. 对于$\mathbf x\geq0$这个约束, nonbasic只有$x_j$上升了, 其他的都还是$0$, 因此只有basic variable是可能有negative的.

而对于basic variable, 有两种可能:

1. basic feasible solution如果不是degeneracy的, 那么$\theta$足够小时, $\mathbf d$是一个feasible direction
2. basic feasible solution如果是degeneracy的, 那么会被引向infeasible solution

现在研究在$\mathbf d$方向上移动对cost function的影响. 假设$\mathbf d$是第$j$个basic direction, 那么$\mathbf c^\top\mathbf d$由$\mathbf c^\top_B\mathbf d_B+c_j$给出, 其中$\mathbf c_B=(c_{B(1)},\cdots,c_{B(m)})$

> [!info] Definition
>
> 1. 假设basic solution $\mathbf x$, basic matrix $\mathbf B$, $\mathbf c_B$是basic variable的成本向量. 对于每一个$j$都有$\bar c_j=c_j-\mathbf c_B^\top\mathbf B^{-1}\mathbf A_j$, 定义为**缩减成本(reduced cost)**
> 2. 若basic matrix $\mathbf B$满足 1. $\mathbf B^{-1}\mathbf b\geq0$.     2. $\mathbf {\bar c}^\top=\mathbf c^\top-\mathbf c_B^\top\mathbf B^{-1}\mathbf A\geq\mathbf 0^\top$, 那么我们称$\mathbf B$为最优的

> [!tip] Theorem
>
> 假设basic feasible solution $\mathbf x$对应的basic matrix $\mathbf B$, 有对应的reduced cost $\bar c_j$, 那么
>
> 1. $\bar c_j\geq0$, 那么$\mathbf x$是optimal的
> 2. 若$\mathbf x$是optimal且没有degeneracy的, 那么$\bar c_j\geq0$

## Implementations of the simplex method

### 字典序

按照顺序对vector逐元素比较.

e.g. $(0,4,5,6)<(1,0,0,0)$因为第一个元素$0<1$

### Bland Rule

enter basis后是目标值减小的variable中, 选择*指标*最小的enter

exit basis后保持feasible的variable中, 选择*指标*最小的exit

### 实现

对于maximize的问题, 我们首先需要转换成minimize的问题, 然后再求解

求解流程:

我们一般将non basic variable组成一个basis, 因为他们是Identity Matrix(见initial tableau)
1. 将一般形式的LP转换成standard form
2. 写出一个initial simplex tableau
3. 选择一个basic variable, 作为enter basis(Bland Rule)
   选取方法: 找到negative的$\mathbf r_i^\top$, 并选择最小(最负)的那一个: $r_q, q=\mathop{\arg\min}\limits_j\{r_j|r_j<0,j=0\cdots,n\}$
4. 选择一个nonbasic variable, 作为exit basis
   选取方法: 
   - 如果这一列都是negative or zero, 那么停止, 最值无界
   - 找到比值最小的一个: $p=\mathop{\arg\min}\limits_j\{\frac{\bar b_j}{u_{jq}}|u_{jq}>0,j=1,\cdots,m\}$
   - 注意, 如果有比值相等的情况, 使用字典序找到最小的那一个.
5. 消元(或者说叫做转轴)
6. 重复上述操作, 直到$\mathbf r^\top$没有negative为止.

e.g.

$$\begin{align*}
\max \qquad &-3x_1 + 5x_2 + 2x_3 + x_4\\
\text{s.t.} \qquad & x_1 + x_2 + x_3 \leq 4\\
&4x_1-x_2 +x_3+2x_4 \leq 6\\
&-x_1+x_2 + 2x_3 + 3x_4 \leq 12\\
&x_j \geq 0, \quad j = 1, 2, 3, 4.
\end{align*}$$

Solution:

Turn into standard form:
$$\begin{aligned}
\min \quad & 3x_1 -5x_2 -2x_3 -x_4 \\
\text{s.t.} \quad
& x_1 + x_2 + x_3 + x_5 = 4, \\
& 4x_1 -x_2 +x_3 +2x_4 + x_6 = 6, \\
& -x_1 +x_2 +2x_3 +3x_4 + x_7 = 12, \\
& x_i \geq 0,\quad i=1,2,3,4,5,6,7.
\end{aligned}$$
then we can generate the simplex initial tableau:
$$
\begin{array}{c|ccccccc|c}
& x_1 & x_2 & x_3 & x_4 & x_5 & x_6 & x_7 & \mathbf B^{-1}\mathbf b\\
\hline
x_5 & 1 & \boxed{1} & 1 & 0 & 1 & 0 & 0 & 4 \\
x_6 & 4 & -1 & 1 & 2 & 0 & 1 & 0 & 6 \\
x_7 & -1 & 1 & 2 & 3 & 0 & 0 & 1 & 12 \\
\hline
r^\top & 3 & -5 & -2 & -1 & 0 & 0 & 0 & 0 \\
\end{array}
$$
> [!tip]
> 我们选择这个是因为:
> 1. 选择$q=\mathop{\arg\min}\limits_i\{r_i|r_i<0\}$, 即在$\{-5, -2, -1\}$中选择了最小的那个$r_2=-5$
> 2. 选择$p=\mathop{\arg\min}\limits_i\{\frac{\bar b_i}{u_{i2}}|u_{i2}>0\}$, 即$\{\frac{4}{1}=4,\frac{12}{1}=12\}$中选择了最小的$\frac{\bar b_1}{u_{12}}=\frac{4}{1}=4$
> 3. 使用消元法进行消元
> 4. 注意更新了左侧的basis, 从$\begin{bmatrix}x_5\\x_6\\x_7\end{bmatrix}$变成了$\begin{bmatrix}\boxed{x_2}\\x_6\\x_7\end{bmatrix}$

after update:
$$
\begin{array}{c|ccccccc|c}
 & x_1 & x_2 & x_3 & x_4 & x_5 & x_6 & x_7 & \mathbf B^{-1}\mathbf b\\
\hline
x_2 & 1 & 1 & 1 & 0 & 1 & 0 & 0 & 4 \\
x_6 & 5 & 0 & 2 & 2 & 1 & 1 & 0 & 10 \\
x_7 & -2 & 0 & 1 & \boxed{3} & -1 & 0 & 1 & 8 \\
\hline
r^\top & 8 & 0 & 3 & -1 & 5 & 0 & 0 & 20 \\
\end{array}
$$
> [!tip]
> 同理, 因为这里只有一个$r_4=-1$是negative, 因此只能是$q=4$
> 
> 然后, 我们选择$p=\mathop{\arg\min}\limits_i\{\frac{\bar b_i}{u_{i4}|u_{i4}>0}\}$, 即$\{\frac{10}{2}=5,\frac{8}{3}\}$中选择最小的$\frac{\bar b_3}{u_{34}}=\frac83$
> 
> 消元, 更新左侧的basis, 从$\begin{bmatrix}x_2\\x_6\\x_7\end{bmatrix}$变成了$\begin{bmatrix}x_2\\x_6\\\boxed{x_4}\end{bmatrix}$

after update:
$$
\begin{array}{c|ccccccc|c}
 & x_1 & x_2 & x_3 & x_4 & x_5 & x_6 & x_7 & \mathbf B^{-1}\mathbf b\\
\hline
x_2 & 1 & 1 & 1 & 0 & 1 & 0 & 0 & 4 \\
x_6 & \frac{19}{3} & 0 & \frac43 & 0 & \frac53 & 1 & -\frac23 & \frac{14}3 \\
x_4 & -\frac23 & 0 & \frac13 & 1 & -\frac13 & 0 & \frac13 & \frac83 \\
\hline
r^\top & \frac{22}3 & 0 & \frac{10}3 & 0 & \frac{14}3 & 0 & \frac13 & \frac{68}3 \\
\end{array}
$$
> [!tip]
> 当$\mathbf r^\top$中不存在任何的negative的时候, 我们认为求解已经结束.
> 
> 右侧的数字和左侧的basis对应, 就是最后的解. 这个时候, 下方的$\mathbf r^\top$的$0$应该正好和左侧的basis对的上, 否则就是一个degeneracy的solution.

## Convergence and Degeneracy

# Duality Theorem

## Motivate

可以看作是**拉格朗日乘子法(Lagrange Multiplier method)** 的延伸.

> [!tip]
> Lagrange Multiplier method:
> $$\begin{matrix}\min&x^2+y^2\\\text{subject to}x+y=1\end{matrix}$$
> 
> introduce a Lagrange multiplier $p$ and form the Lagrangean $\mathcal L(x,y,p)=x^2+y^2+p(1-x-y)h$
> 
> 当保持$k$不变的时候, 该问题可以通过求解$\frac{\partial \mathcal L}{\partial x}=0$和$\frac{\partial\mathcal L}{\partial y}=0$来求解: 
> $$x=\frac p2,y=\frac p2$$
> 然后将$x$,$y$代入原始约束$x+y=1$求解$p=1$

允许约束被违反, 但是违反是有代价($p$)的. 当我们想要最小化$\mathcal L$的时候, 我们必然需要考虑违反约束所带来的成本.

## Dual Problem

考虑一个Standard form的Linear programming:
$$\begin{matrix}\min&\mathbf c^\top\mathbf x\\\text{subject to}&\mathbf {Ax}=\mathbf b\\&\mathbf x\geq0\end{matrix}$$
我们称之为**原始问题(primal problem)**.

引入**松弛问题(relax problem)**, 将约束条件变成惩罚项:
$$\begin{matrix}\min&\mathbf c^\top\mathbf x-\mathbf p^\top(\mathbf b-\mathbf {Ax})\\\text{subject to}&\mathbf x\geq0\end{matrix}$$
其中$\mathbf p$和$\mathbf b$维度相同.

令$g(\mathbf p)$为relax problem的optimal solution, 有
$$g(\mathbf p)=\min_{\mathbf x\geq0}\left[\mathbf c^\top\mathbf x+\mathbf p^\top(\mathbf b-\mathbf {Ax})\right]\leq\mathbf c^\top\mathbf x^*+\mathbf p^\top(\mathbf b-\mathbf {Ax^*})=\mathbf c^\top\mathbf x^*$$
其中$\mathbf x^*$是primal problem的optimal solution. 因此我们可以认为$g(\mathbf p)$给定了原始问题的cost function的lower bound. 于是我们只需要求解$g(\mathbf p)$的最大值即可:
$$\begin{matrix}\max&g(\mathbf p)\\\text{subject to}&\text{No Constrains}\end{matrix}$$

我们注意到$g(\mathbf p)=min_{\mathbf x\geq0}\left[\mathbf c^\top\mathbf x+\mathbf p^\top(\mathbf b-\mathbf {Ax})\right]=\mathbf p^\top\mathbf b+\min\limits_{\mathbf x\geq0}(\mathbf c^\top-\mathbf p^\top\mathbf {A})\mathbf x$, 其中:
$$\min_{\mathbf x\geq0}(\mathbf c^\top-\mathbf p^\top\mathbf A)\mathbf x=\left\{\begin{matrix}\mathbf 0,&\text{if }\mathbf c^\top\mathbf x+\mathbf p^\top(\mathbf b-\mathbf {Ax})\geq\mathbf0^\top\\-\infty,&\text{otherwise}\end{matrix}\right.$$
我们在最大化$g(\mathbf p)$的时候, 只需要考虑不等于$-\infty$的值, 因此dual problem和如下linear programming没有区别:
$$\begin{matrix}\max&\mathbf p^\top\mathbf b\\\text{subject to}&\mathbf p^\top\mathbf A\leq\mathbf c^\top\end{matrix}$$

因此我们得到了dual problem的一般形式:
$$
\begin{matrix}
\begin{matrix}\min&\mathbf c^\top\mathbf x\\\text{subject to}&a_ix\geq b_i&i\in M_1\\&a_ix\leq b_i&i\in M_2\\&a_ix=b_i&i\in M_3\\&x_j\geq0&j\in N_1\\&x_j\leq0&j\in N_2\\&x_j\text{ free}&j\in N_3\end{matrix}&\quad&
\begin{matrix}\max&\mathbf p^\top\mathbf b\\\text{subject to}&p_i\geq0&i\in M_1\\&p_i\leq0&i\in M_2\\&p_i\text{ free}&i\in M_3\\&\mathbf p^\top\mathbf A_j\leq c_j&j\in N_1\\&\mathbf p^\top\mathbf A_j\geq c_j&j\in N_2\\&\mathbf p^\top\mathbf A=c_j&j\in N_3\end{matrix}
\end{matrix}
$$

| primal problem | minimize                                              | maximize                                              | dual problem |
| -------------- | ----------------------------------------------------- | ----------------------------------------------------- | ------------ |
| constrains     | $\begin{matrix}\geq b_i\\\leq b_i\\=b_i\end{matrix}$  | $\begin{matrix}\geq0\\\leq0\\\text{free}\end{matrix}$ | variables    |
| variables      | $\begin{matrix}\geq0\\\leq0\\\text{free}\end{matrix}$ | $\begin{matrix}\leq c_j\\\geq c_j\\=c_j\end{matrix}$  | constrains   |
|                |                                                       |                                                       |              |
对于特殊形式, 可以使用矩阵表示(e.g. [[#Standard form|Standard form]]):
$$
\begin{matrix}
\begin{matrix}\min&\mathbf c^\top\mathbf x\\\text{subject to}&\mathbf {Ax}=\mathbf b\\&\mathbf x\geq0\end{matrix}&\quad&
\begin{matrix}\max&\mathbf p^\top\mathbf b\\\text{subject to}&\mathbf p^\top\mathbf A\leq\mathbf c^\top\\\text{}\end{matrix}
\end{matrix}
$$
$$
\begin{matrix}
\begin{matrix}\min&\mathbf c^\top\mathbf x\\\text{subject to}&\mathbf {Ax}\geq\mathbf b\\&\text{}\end{matrix}&\quad&
\begin{matrix}\max&\mathbf p^\top\mathbf b\\\text{subject to}&\mathbf p^\top\mathbf A=\mathbf c^\top\\&\mathbf p\geq0\end{matrix}
\end{matrix}
$$
e.g.
$$
\begin{array}{lcc}
\min & x_1 + 2x_2 + 3x_3 & \max & 5p_1 + 6p_2 + 4p_3 \\
\text{subject to} & -x_1 + 3x_2 = 5 & \text{subject to} & p_1 \text{ free} \\
& 2x_1 - x_2 + 3x_3 \geq 6 & & p_2 \geq 0 \\
& x_3 \leq 4 & & p_3 \leq 0 \\
& x_1 \geq 0 & & -p_1 + 2p_2 \leq 1 \\
& x_2 \leq 0 & & 3p_1 - p_2 \geq 2 \\
& x_3 \text{ free}, & & 3p_2 + p_3 = 3. \\
\end{array}
$$
$$
\begin{array}{lccc}
\min & -5x_1 - 6x_2 - 4x_3 & \max & -p_1 - 2p_2 - 3p_3 \\
\text{subject to} & x_1 \text{ free} & \text{subject to} & p_1 - 3p_2 = -5 \\
& x_2 \geq 0 & & -2p_1 + p_2 - 3p_3 \leq -6 \\
& x_3 \leq 0 & & -p_3 \geq -4 \\
& x_1 - 2x_2 \geq -1 & & p_1 \geq 0 \\
& -3x_1 + x_2 \leq -2 & & p_2 \leq 0 \\
& -3x_2 - x_3 = -3, & & p_3 \text{ free}. \\
\end{array}
$$
> [!tip] Theorem
> 如果将一个问题转换为其对偶问题, 然后将对偶问题的等价最小化问题 再次对偶一次, 得到原始问题的等价最大化问题.

## The Duality Theorem

> [!tip] Theorem
> 弱对偶定理: $\mathbf c^\top\mathbf x\geq\mathbf p^\top\mathbf b$, 其中$\mathbf x$是原始问题可行解, $\mathbf p$是对偶问题可行解

> [!tip] Corollary
> 1. 如果$\mathbf c^\top\mathbf x=\mathbf p^\top\mathbf b$, 那么$\mathbf x$是原始问题最优解, $\mathbf p$是对偶问题最优解
> 2. 如果原始问题最优成本为$+\infty$, 那么对偶问题无解
> 3. 如果对偶问题最优成本为$-\infty$, 那么原始问题无解

> [!tip] Theorem
> 强对偶定理:
> 4. 如果primal problem和dual problem中有一个有解, 则另一个问题也有解, 且最优值相等.
> 5. 设$\mathbf x^*$是primal的optimal solution, $\mathbf B$是primal的optimal basis, $\mathbf p^*$是dual的optimal solution, 则:
>    $$\mathbf p^*=(\mathbf c_B^\top\mathbf B^{-1})^\top$$

primal problem --> dual problem --> introduce relax variable, turn to standard form --> simplex solve

primal problem的simplex解出来的松弛变量对应的$r^\top_i$的值就是dual problem solution.

对偶单纯形法: 
- 适用范围: 需要同时满足两个条件, 使普通单纯形法无法使用
  1. 将$\geq$乘$-1$转成$\leq$之后, 导致$b$列有负值
  2. 同时, 在$r^\top$行全部大于0
- 求解流程: 实现类似[[#Implementations of the simplex method#实现|单纯形法]], 但是改了

  我们一般将non basic variable组成一个basis, 因为他们是Identity Matrix(见initial tableau)
  1. 转换成Dual problem
  2. 将primal problem的$\geq0$的constrains乘$-1$, 然后写出initial simplex tableau
  3. 选择一个basic variable, 作为enter basis(Bland Rule)
     选取方法: 对于$\bar b_i\geq0$的, 选择第$i$个变量$x_i$.
  4. 选择一个non-basis variable, 作为exit basis
     选取方法: 
     - 如果这一列都是positive or zero, 那么停止, 最值无界
     - 找到比值最小的一个: $p=\mathop{\arg\min}\limits_j\{\frac{r^\top_j}{-u_{jq}}|u_{jq}<0,j=1,\cdots,m\}$
     - 注意, 如果有比值相等的情况, 使用字典序找到最小的那一个.
  5. 消元(或者说叫做转轴)
  6. 重复上述操作, 直到$\mathbf r^\top$没有negative为止.

e.g.
$$\begin{aligned}
\min \quad & 12x_1 +16x_2 +15x_3 \\
\text{s.t.} \quad
& 2x_1 + 4x_2 \geq2, \\
& 2x_1+5x_3\geq3, \\
& x_i \geq 0,\quad i=1,2,3.
\end{aligned}$$
Turn into standard form, with $\leq$ constrains:
$$\begin{aligned}
\min \quad & 12x_1 +16x_2 +15x_3 \\
\text{s.t.} \quad
& -2x_1 - 4x_2+x_4 =-2, \\
& -2x_1-5x_3+x_5=-3, \\
& x_i \geq 0,\quad i=1,2,3,4,5.
\end{aligned}$$
generate initial simplex table:
$$\begin{array}{c|ccccc|c}
 & x_1 & x_2 & x_3 & x_4 & x_5 & \mathbf B^{-1}\mathbf b\\
\hline
x_4 & -2 & -4 & 0 & 1 & 0 & -2 \\
x_5 & -2 & 0 & \boxed{-5} & 0 & 1 & -3 \\
\hline
r^\top & 12 & 16 & 15 & 0 & 0 & 0 \\
\end{array}$$
> [!tip]
> 选择这个是因为:
> 1. 找$\mathbf B^{-1}\mathbf b$的最小负数, 选择$-3$对应的$x_5$
> 2. 找$\frac{r^\top_j}{-u_{jq}}$最小的一项, 选择$\min(6,,3)=3$, 选择$x_5$为exit basis, $x_3$为enter basis, $-5$是对应的值

The second simplex table:
$$\begin{array}{c|ccccc|c}
 & x_1 & x_2 & x_3 & x_4 & x_5 & \mathbf B^{-1}\mathbf b\\
\hline
x_4 & \boxed{-2} & -4 & 0 & 1 & 0 & -2 \\
x_3 & \frac25 & 0 & 1 & 0 & -\frac15 & \frac35 \\
\hline
r^\top & 6 & 16 & 0 & 0 & 3 & -9 \\
\end{array}$$
> [!tip]
> 选择这个是因为:
> 1. $\mathbf B^{-1}\mathbf b<0$只有一个
> 2. 选择$\min(3,4,)=3$, 选择$x_4$为exit basis, $x_1$为enter basis, $-2$是对应的值

The third simplex table:
$$\begin{array}{c|ccccc|c}
 & x_1 & x_2 & x_3 & x_4 & x_5 & \mathbf B^{-1}\mathbf b\\
\hline
x_1 & 1 & 2 & 0 & -\frac12 & 0 & 1 \\
x_3 & 0 & -\frac45 & 1 & \frac15 & -\frac15 & \frac15 \\
\hline
r^\top & 0 & 4 & 0 & 3 & 3 & -15 \\
\end{array}$$
Therefore, $(x_1,x_2,x_3,x_4,x_5)^\top=(1,0,\frac15,0,0)^\top$, the optimal cost is $15$.

# Convex Set

## Affine Set

> [!info] Definition
> 一个集合$\mathcal C\subset\mathbb R^n$满足任意不同两点$x_1,x_2\in\mathcal C,\theta\in\mathbb R$, 且$\theta x_1+(1-\theta)x_2\in\mathcal C$, 则这个集合是affine的
> 
> 即, 如果任意两点连线表示的直线上的所有点都在这个set中, 那么这个set是affine set

这个定义可以扩展到多个点: $x_1,\cdots,x_k$的affine combination $\theta_1x_1+\cdots+\theta_kx_k$ where $\sum_{i=1}^k\theta_i=1$也是属于affine set的.

> [!info] Definition
> 1. affine dimension: 一个affine hull的维度定义为affine dimension
> 2. relative interior: 闭包仿射(closure affine C)的内部, 记作$\mathbf{relint }C=\{x\in C|B(x,r)\cap\mathbf{aff }C\subset C\text{ for some }r>0\}$
>    
>    其中$B(x,r)=\{y|\|y-x\|\leq r\}$表示relative boundary

## Convex Set

> [!info] Definition
> 一个集合$\mathcal C\subset\mathbb R^n$满足任意不同两点$x_1,x_2\in\mathcal C,\theta\in[0,1]$, 且$\theta x_1+(1-\theta)x_2\in\mathcal C$, 则这个集合是convex的
> 
> 即, 如果任意两点连线上的所有点都在这个set中, 那么这个set是convex set
> 
> 注意与affine set区分, affine set要求整个直线都在这个set里面, 但是convex只要求连线线段在set中

> [!info] Definition
> convex hull: $\mathbf{conv}C=\{\theta_1x_1+\cdots+\theta_kx_k|x_i\in C,\theta_i\geq0,i=i,\cdots,k,\sum_i\theta_i=1\}$

## Cones

> [!info] Definition
> 1. $\forall x\in C,\theta\geq0$, 如果满足$\theta x\in C$, 那么C是cone, 或者non-negative homogeneous(非负齐次)
> 2. $\forall x_1,x_2\in C,\theta_1,\theta_2\geq0$, 如果$\theta_1x_1+\theta_2x_2\in C$, 那么$C$是convex cone
> 3. $\{\theta_1x_1+\cdots+\theta_kx_k|\theta_i\geq0,x_i\in C,i=1,\cdots,k\}$称为conic cone(锥包). 即所有点的conic combination的集合


## Operation that Preserve Convexity

1. Insertion
   如果$S_1,\cdots,S_k$都是convex的, 那么$S_1\cap\cdots\cap S_k$也是convex的
2. affine function
   如果$f:\mathbb R^n\mapsto\mathbb R^m$是affine的($f(x)=\mathbf{Ax+b},\mathbf A\in\mathbb R^{m\times n},\mathbf b\in\mathbb R^m$)
3. perspective and linear-fractional function:
   - perspective function: $P(x,t)=\frac xt,\quad\quad\text{dom}P=\{(x,t)|t\geq0\}$
   - Linear-fractional function: $f(x)=\frac{\mathbf{Ax+b}}{\mathbf c^\top\mathbf x+d},\quad\quad\text{dom}P=\{x|\mathbf c^\top\mathbf x+d>0\}$

# Convex Function

> [!info] Definition
> convex functino:
> $$f(\theta x+(1-\theta)y)\leq\theta f(x)+(1-\theta)f(y)$$

examples:

in $\mathbb R$:
- $ax+b$
- $|x|^p$, $p\geq1$
- $x^p$, $p\geq1$ or $p\leq0$
- $e^{ax}$
- $x\log x$
Concave: $\log x$, $ax+b$, $x^p$ for $0\leq p\leq1$

in $\mathbb R^n$:
- $\mathbf a^\top\mathbf x+b$
- $\|x\|_k$
- quadratic function: $f(x)=\mathbf x^\top\mathbf{Px}+2\mathbf q^\top\mathbf x+r$ is concave if and only if $P\preceq0$
- geometric mean: $f(x)=\left(\prod_{i=1}^nx_i\right)^\frac1n$ is concave on $\mathbb R_{++}^n$
- $\log\sum_ie^{x_i}$ is concave on $\mathbb R^n$
- $f(\mathbf x,y)=\frac{\mathbf x^\top\mathbf x}{y}$ is concave on $\mathbb R^n\times\mathbb R_{++}$

in $\mathbb R^{n\times n}$:
- affine function: $f(\mathbb X)=\text{tr}(\mathbb A\mathbb X)+b$ is concave and convex on $\mathbb R^{n\times n}$
- Logarithmic Determinant Function: $f(\mathbf X)=\log\det\mathbf X$ is concave on $\mathbb S^n=\{\mathbb X\in\mathbb R^{n\times n}|\mathbf X\succeq0\}$
- maximum eigenvalue function: $f(\mathbf x)=\lambda_\text{max}(\mathbf X)=\sup_{y\neq0}\frac{\mathbf y^\top\mathbf{Xy}}{\mathbf y^\top\mathbf y}$ is convex on $\mathbb S^n$

> [!info] Definition
> epigraph: $\text{epi}f=\{(\mathbf x,t)\in\mathbb R^{n+1}|\mathbf x\in\text{dom}f,f(\mathbf x)\leq t\}$

## Restriction of a Convex Function to a Line

> [!tip] Theorem
> let $f:\mathbb R^n\mapsto\mathbb R$ and $g:\mathbb R\mapsto\mathbb R$ is $g(t)=f(\mathbf x+t\mathbf v)$.
> 
> $f$ is convex if and only if $g$ is convex for $\forall\mathbf x\in\text{dom}f,\mathbf v\in\mathbb R^n$

## First and Second Order Condition

Gradient:
$$\nabla f(\mathbf x)=\begin{bmatrix}\frac{\partial f(\mathbf x)}{\partial x_1}&\cdots&\frac{\partial f(\mathbf x)}{\partial x_n}\end{bmatrix}^\top\in\mathbb R^n$$

Hessian:
$$\nabla^2f(\mathbf x)=\left(\frac{\partial^2f(\mathbf x)}{\partial x_i\partial x_j}\right)_{ij}\in\mathbb R^{n\times n}$$

> [!info] Definition
> - First order condition: 有convex的domain的可微函数$f$, 当且仅当$f(\mathbf y)\geq f(\mathbf x)+\nabla f(\mathbf x)^\top(\mathbf y-\mathbf x)$的时候是convex的
> - Second order condition: convex domain的二次可微的函数$f$, 当且仅当$\nabla^2f(\mathbf x)\succeq0$的时候是convex的


## Some Other Convexity
### Quasi-Convexity

一个函数$f:\mathbb R^n\mapsto\mathbb R$是quasi-convexity的, 当且仅当$\text{dom}f$是convex的且sublevel set $S_\alpha=\{x\in\text{dom}f|f(x)\leq\alpha\}$对于任何$\alpha$都是convex的

### Log-Convexity

$$f(\theta x+(1-\theta)y)\geq f(x)^\theta f(y)^{1-\theta}$$

### Convexity w.r.t. Generalized Inequalities

$f:\mathbb R^n\mapsto\mathbb R$如果$\text{dom}f$是convex的且满足
$$\forall \mathbf x,\mathbf y\in\text{dom}\mathbf f,0\leq\theta\leq1,\mathbf f(\theta\mathbf x+(1-\theta)\mathbf y)\preceq_K\theta \mathbf f(\mathbf x)+(1-\theta)\mathbf f(\mathbf y)$$
那么称$f$是K-convex的

# Convex Problem

[[#Standard form|Standard form]]: 
$$\begin{matrix}\text{minimize}&f_0(x)\\\text{subject to}&f_i(x)\leq0&i=1,\cdots,m\\&h_i(x)=0&i=1,\cdots,p\end{matrix}$$
[[#Extreme points, vertices, and basic feasible solution|feasibility]]:
- 如果一个点$x\in\text{dom}f$满足所有的constraints, 那么称这个点是feasible的. 否则是infeasible
- 如果一个问题, 至少有一个点是feasible的, 那么称该问题为feasible的. 否则是infeasible

[[#Optimality of extreme points|optimal]]:
$$p^*=\inf\{f_0(x)|f_i(x)\leq0,i=1,\cdots,m,\quad h_i(x)=0,i=1,\cdots,p\}$$
- 如果问题是infeasible的, 那么$p^*=\infty$
- 如果问题是无边界的(unbounded below), 那么$p^*=-\infty$

### Stationary Point

> [!info] Definition
> 如果$\nabla f(\mathbf x)=0$, 那么称$\mathbf x$为stationary point

> [!tip] Theorem
> 1. 如果一个stationary point $\mathbf x$, 对于其neighborhood $\mathcal B\subset\mathbb R^n$, 满足$f(\mathbf y)\geq f(\mathbf x),\forall\mathbf y\in\mathcal B$, 那么$\mathbf x$是local minimization
> 2. 如果一个stationary point $\mathbf x$, 有$\forall\mathbf y\in\text{dom}f$, 满足$f(\mathbf y)\geq f(\mathbf x)$, 那么$\mathbf x$是global minimization
> 3. 如果一个stationary point $\mathbf x$, 对于其neighborhood $\mathcal B\subset\mathbb R^n$, 满足$f(\mathbf z)\leq f(\mathbf x)\leq f(\mathbf y),\mathbf{y,z}\in\mathcal B$, 并且$\lambda_\text{min}(\nabla^2f(\mathbf x))\leq0$ 那么称$\mathbf x$为Saddle point


## Convex Optimization Problem

standard form:
$$\begin{matrix}\text{minimize}&f_0(x)\\\text{subject to}&f_i(x)\leq0&i=1,\cdots,m\\&\mathbf{Ax}=\mathbf b\end{matrix}$$

其中, $f_0,f_1,\cdots,f_m$都是convex的. 等式约束(equality constraints)都是[[#Affine Set|affine]]的

对于一个convex problem, 其local optimal就是global optimal.

> [!tip] Theorem
> 一个可行解(feasible point)$\mathbf x$是optimal的 当且仅当
> $$\nabla f(\mathbf x)^\top(\mathbf y-\mathbf x)\geq0,\forall\text{ feasible }y$$


## Quasi-Convex Optimization Problem

standard form:
$$\begin{matrix}\text{minimize}&f_0(x)\\\text{subject to}&f_i(x)\leq0&i=1,\cdots,m\\&\mathbf{Ax}=\mathbf b\end{matrix}$$
其中, $f_0$是[[#Quasi-Convexity]]的, $f_1,\cdots,f_m$都是convex的. 等式约束(equality constraints)都是[[#Affine Set|affine]]的

将$f_0$使用epigraph $\phi_t(x)$表示:
$$f_0(x)\leq t\Leftrightarrow\phi_t(x)\leq0$$
e.g.:
Assume $p(x)$ is convex, $q(x)$ is concave and $p(x)\geq0$, $q(x)>0$.
$$f(x)=\frac{p(x)}{q(x)}\Leftrightarrow\phi_t(x)=p(x)-tq(x)$$
for $t\geq0$, $\phi_t(x)$ is convex in $x$
$\frac{p(x)}{q(x)}\leq t$ if and only if $\phi_t(x)\leq0$

## Some Other Solver

### LP(Linear Programming)

$$\begin{matrix}\text{minimize}&\mathbf c^\top\mathbf x+d\\\text{subject to}&\mathbf {Gx}\leq\mathbf h\\&\mathbf{Ax}=\mathbf b\end{matrix}$$
Convex Problem: affine的objective function and constraints.

### QP(Quadratic Programming)

$$\begin{matrix}\text{minimize}&\frac12\mathbf x^\top\mathbf {Px}+\mathbf q^\top\mathbf x+r\\\text{subject to}&\mathbf {Gx}\leq\mathbf h\\&\mathbf{Ax}=\mathbf b\end{matrix}$$

convex problem: assume $P\in\mathbb S^n_+\succeq0$, convex quadratic objective function and affine constraints

### QCQP(Quadratically Constrained QP)

$$\begin{matrix}\text{minimize}&\frac12\mathbf x^\top\mathbf {P_0x}+\mathbf q_0^\top\mathbf x+r_0\\\text{subject to}&\frac12\mathbf x^\top\mathbf {P_ix}+\mathbf q_i^\top\mathbf x+r_i\leq0&i=1,\cdots,m\\&\mathbf{Ax}=\mathbf b\end{matrix}$$

convex problem: assume $P\in\mathbb S^n_+\succeq0$, convex quadratic objective function and constraints

### SOCP(Second-Order Cone Programming)

$$\begin{matrix}
\text{minimize}&\mathbf f^\top\mathbf x\\
\text{subject to}&\|\mathbf A_i\mathbf x+\mathbf b_i\|\leq\mathbf c_i^\top\mathbf x+\mathbf d_i&i=1,\cdots,m\\
&\mathbf{Fx}=\mathbf g
\end{matrix}$$

convex problem: linear objective and [[#First and Second Order Condition|second-order]] cone constraints
- 如果$\mathbf A_i$是行向量, 那么会退化成[[#LP(Linear Programming)]]
- 如果$\mathbf c_i=0$, 那么会退化成[[#QCQP(Quadratically Constrained QP)]]

### Generalized Inequality Constraints

$$\begin{matrix}
\text{minimize}&f_0(\mathbf x)\\
\text{subject to}&\mathbf f_i(\mathbf x)\preceq_{K_i}\mathbf 0&i=1,\cdots,m\\
&\mathbf {Ax}=\mathbf b
\end{matrix}$$
其中, $f_0$是convex objective function, $\mathbf f_i$是[[#Convexity w.r.t. Generalized Inequalities|K-Convex]]的

**Conic Form Problem**
$$\begin{matrix}
\text{minimize}&\mathbf c^\top\mathbf x\\
\text{subject to}&\mathbf {Fx}+\mathbf g\preceq\mathbf 0\\
&\mathbf{Ax}=\mathbf b
\end{matrix}$$
### SDP(Semidefinite Problem)

$$\begin{matrix}
\text{minimize}&\mathbf c^\top\mathbf x\\
\text{subject to}&x_1\mathbf F_1+\cdots+x_n\mathbf F_n\preceq\mathbf G\\
&\mathbf{Ax}=\mathbf b
\end{matrix}$$
convex problem: linear objective function and linear matrix inequality(LMI) constraints

注意到多个LMI可以写成一个LMI, 因此有:
- [[#LP(Linear Programming)]] and equivalent [[#SDP(Semidefinite Problem)]]:
  $$\begin{matrix}\text{minimize}&\mathbf c^\top\mathbf x\\\text{subject to}&\mathbf{Ax}\preceq\mathbf b\end{matrix}\quad\quad\equiv\quad\quad\begin{matrix}\text{minimize}&\mathbf c^\top\mathbf x\\\text{subject to}&\text{diag}(\mathbf{Ax}-\mathbf b)\preceq\mathbf 0\end{matrix}$$
- [[#SOCP(Second-Order Cone Programming)]] and equivalent [[#SDP(Semidefinite Problem)]]:
  $$\begin{matrix}\text{minimize}&\mathbf f^\top\mathbf x\\\text{subject to}&\|\mathbf A_i\mathbf x+\mathbf b_i\|\leq\mathbf c^\top_i\mathbf x+\mathbf d_i&i=1,\cdots,m\end{matrix}$$
  $$\equiv\begin{matrix}\text{minimize}&\mathbf f^\top\mathbf x\\\text{subject to}&\begin{bmatrix}(\mathbf c^\top_i\mathbf x+\mathbf d_i)\mathbf I&\mathbf A_i\mathbf x+\mathbf b_i\\\mathbf A_i\mathbf x+\mathbf b_i&c^\top_i\mathbf x+\mathbf d_i\end{bmatrix}\preceq\mathbf0&i=1,\cdots,m\end{matrix}$$

**Eigenvalue minimization**:
$$\begin{matrix}\text{minimize}&\lambda_\max(\mathbf A(\mathbf x))\end{matrix}$$
其中, $\lambda_\max$指的是$\mathbf A(\mathbf x)=\mathbf A_0+\mathbf x_1\mathbf A_1+\cdots+\mathbf x_n\mathbf A_n$的最大的特征值, 因此有$\lambda_\max(\mathbf A(\mathbf x))\leq t\Leftrightarrow\mathbf A(\mathbf x)\preceq t\mathbf I$

因此, 可以转成等效SDP:
$$\begin{matrix}\text{minimize}&t\\\text{subject to}&\mathbf A(\mathbf x)\preceq t\mathbf I\end{matrix}$$
# Lagrangian

$$\begin{matrix}\text{minimize}&f_0(\mathbf x)\\\text{subject to}&f_i(\mathbf x)\leq0&i=1,\cdots,m\\&h_i(\mathbf x)=0&i=1,\cdots,n\end{matrix}$$

定义Lagrangian方程为:
$$\mathcal L(\mathbf x,\mathbf\lambda,\mathbf\nu)=f_0(\mathbf x)+\sum\lambda_if_i(\mathbf x)+\sum\nu_ih_i(\mathbf x)$$
### Lagrangian Dual Function

> [!tip] Theorem
> 下界:
> $$f_0(\widetilde{\mathbf x})\geq\mathcal L(\widetilde{\mathbf x},\mathbf\lambda,\mathbf\nu)\geq\inf_{x\in\mathcal D}\mathcal L(x,\mathbf\lambda,\mathbf\nu)=g(\mathbf\lambda,\mathbf\nu)$$

拉格朗日对偶优化问题:
$$\begin{matrix}\mathop{\text{minimize}}\limits_{\mathbf\lambda}&g(\mathbf\lambda,\mathbf\nu)\\\text{subject to}&\mathbf\lambda\succeq\mathbf 0\end{matrix}$$
## KKT Condition

**primal feasibility**

原始条件可行:
$$\begin{matrix}f_i(\mathbf x)]\leq0,i=1,\cdots,m\\h_i(\mathbf x)=0,i=1,\cdots,n\end{matrix}$$

**dual feasibility**

对偶的Lagrangian multiplier非负:
$$\mathbf\lambda\succeq\mathbf0$$

**complementary slackness**

$$\lambda_if_i(\mathbf x^*)=0,i=1\cdots,m$$

**zero gradient for Lagrangian with respect to x**

$$\nabla_\mathbf xf_0(\mathbf x)+\sum\nabla_\mathbf x\lambda_if_i(\mathbf x)+\sum\nabla_\mathbf x\nu_ih_i(\mathbf x)=0$$

# Differentiable Unconstrained Minimization

$$\begin{matrix}\min&f(\mathbf x)\\\text{subject to}&\mathbf x\in\mathbb R^n\end{matrix}$$
其中$f$可微

## Convergence Rate

计算方法:

假设给定[[#Piecewise linear convex objective functions|objective function]]能够转换成一个序列$r_k$, 计算极限
$$q=\lim_{k\to\infty}\frac{r_{k+1}}{r_k}$$

convergence rate就是$q$.

### Convergence Type

- $q=0$: superlinearly
- $0<q<1$: linearly
- $q=1$: sublinearly
- $q>1$: non-convergence

> [!example] Convergence Rate of [[#Quadratic Minimization]]
> 
> 假设$\lambda_1(\mathbf Q)$是$\mathbf Q$的最大的eigenvalue, $\lambda_n(\mathbf Q)$是最小eigenvalue, 那么可以认为:
> $$r=\frac{\lambda_1(\mathbf Q)}{\lambda_n(\mathbf Q)}=\frac{\max_x\lambda_1(\nabla^2f(\mathbf x))}{\min_x\lambda_n(\nabla^2f(\mathbf x))}$$
> 
> $\eta_t\equiv\eta=\frac{2}{\lambda_1(\mathbf Q)+\lambda_n(\mathbf Q)}$, 那么
> $$\|\mathbf x^t-\mathbf x^*\|_2\leq\left(\frac{\lambda_1(\mathbf Q)-\lambda_n(\mathbf Q)}{\lambda_1(\mathbf Q)+\lambda_n(\mathbf Q)}\right)^t\|\mathbf x^0-\mathbf x^*\|_2=\varepsilon$$
> Convergence Analysis:
> $$\begin{aligned}1.&\|\mathbf x^t-\mathbf x^*\|_2\leq\varepsilon\\2.&\|f(\mathbf x^t)-f(\mathbf x^*)\|_2\leq\varepsilon\\3.&\|\nabla f(\mathbf x)\|_2\leq\varepsilon\end{aligned}$$
> Convergence Rate:
> 1. sublinear: $T>\frac{1}{\varepsilon^k},o(\frac{1}{\varepsilon^k})$
> 2. linear: $T>\log\frac{1}{\varepsilon}, o(\log\frac{1}{\varepsilon})$
> 3. quadratic(super linear): $T>\log(\log\frac{1}{\varepsilon}),o(\log(\log\frac{1}{\varepsilon}))$
> 
> Iteration Function:
> 4. sublinear: $\|\mathbf x^t-\mathbf x^*\|_2\leq\frac{1}{t^{\frac{1}{k}}}\|\mathbf x^0-\mathbf x^*\|_2$
> 5. linear: $\|\mathbf x^t-\mathbf x^*\|_2\leq\|\mathbf x^{q-1}-\mathbf x^*\|_2\Rightarrow\|\mathbf x^t-\mathbf x^*\|_2\leq q^t\|\mathbf x^0-\mathbf x^*\|_2$
> 6. quadratic: $\|\mathbf x^t-\mathbf x^*\|_2\leqq\|\mathbf x^{q-1}-\mathbf x^*\|^2_2$
> 
## Iterative descend algorithm

从$x_0$开始, 构造序列$\{\mathbf x^t\}$满足$f(\mathbf x^{t+1})<f(\mathbf x^t),t=0,1,\cdots$

下降方向(descend direction) $d$ 满足:
$$f'(\mathbf x;\mathbf d):=\lim_{\tau\downarrow0}\frac{f(\mathbf x+\tau\mathbf d)-f(\mathbf x)}{\tau}=\nabla f(\mathbf x)^\top\mathbf d\leq0$$

每一次迭代中, 有$\mathbf x^{t+1}=\mathbf x^t-\eta\mathbf d^t$, 其中$\mathbf d^t$是在$\mathbf x^t$的时候的descend direction, $\eta$是步长.

在[[Mechain Learning|机器学习]]中, $f$通常是loss函数, $\mathbf x$通常是loss函数中的参数, $\eta$是学习率

> [!note]
> Steepest Descend 最陡下降法
> - 最快优化objective function的方向:
> $$\mathop{\arg\min}_{\mathbf d:\|\mathbf d\|_2\leq1}f'(\mathbf x;\mathbf d)=\mathop{\arg\min}_{\mathbf d:\|\mathbf d\|_2\leq1}\nabla f(\mathbf x)^\top\mathbf d=-\|\nabla f(\mathbf x)\|_2$$
> $$-\|\nabla f(\mathbf x)\|\cdot\|d\|_2\leq\langle\nabla f(\mathbf x),\mathbf d\rangle\leq\|\nabla f(\mathbf x)\|\cdot\|d\|_2$$

## Quadratic Minimization

$$\begin{matrix}\min&f(\mathbf x):=\frac12(\mathbf x-\mathbf x^*)^\top\mathbf Q(\mathbf x-\mathbf x^*)\\\text{subject to}&\mathbf Q\succ0\end{matrix}$$

该方程的梯度为$\nabla f(\mathbf x)=\mathbf Q(\mathbf x-\mathbf x^*)$

参数更新:
$$x^{t+1}=(\mathbf I-\eta_t\mathbf Q)\mathbf x^t+\eta_t\mathbf Q\mathbf x^*$$

step size($\eta$) rule:
$$
\begin{aligned}
&\mathbf x^{t+1}-\mathbf x^*=(\mathbf I-\eta_t\mathbf Q)(\mathbf x^t-\mathbf x^*)\\
\Rightarrow & \|\mathbf x^{t+1}-\mathbf x^*\|\leq\|\mathbf I-\eta_t\mathbf Q\|\cdot\|\mathbf x^t-\mathbf x^*\|\\
\Rightarrow&\|\mathbf I-\eta\mathbf Q\|=\frac{\lambda_1(\mathbf Q)-\lambda_n(\mathbf Q)}{\lambda_1(\mathbf Q)+\lambda_n(\mathbf Q)}\\
\Rightarrow&\eta\equiv\eta_t=\frac{2}{\lambda_1(\mathbf Q)+\lambda_n(\mathbf Q)}
\end{aligned}
$$

### Exact Line Search

$\eta_t=\mathop{\arg\min}_{\eta\geq0}f(\mathbf x^t-\eta\nabla f(\mathbf x^t))$

假设有$g^t=\nabla f(\mathbf x^t)=\mathbf Q(\mathbf x^t-\mathbf x^*)$, 那么$\eta_t=\frac{{g^t}^\top g^t}{{g^t}^\top\mathbf Qg^t}$

Kantorovich's inequality:
$$\frac{\|\mathbf y\|^4_2}{(\mathbf y^\top\mathbf Q\mathbf y)(\mathbf y^\top\mathbf Q^{-1}\mathbf y)}\geq\frac{4\lambda_1(\mathbf Q)\lambda_n(\mathbf Q)}{(\lambda_1(\mathbf Q)+\lambda_n(\mathbf Q))^2}$$
## Smooth problem

$\mu$-strong和$L$-smooth定义:
$$0\preceq\mu\mathbf I\preceq\nabla^2f(\mathbf x)\preceq L\mathbf I$$
或者:
$$\lambda_n(\mathbf Q)\mathbf I\preceq\mathbf Q\preceq\lambda_1(\mathbf Q)\mathbf I$$

> [!tip] Theorem
> 对于$\mu$-strong和$L$-smooth的问题, 有:
> - step size: $\eta=\frac{2}{\mu+L}$ (v.s. $\frac{2}{\lambda_1+\lambda_n}$)
> - contraction rate: $\frac{\kappa-1}{\kappa+1},\kappa=\frac{L}{\mu}$ (v.s. $\frac{\lambda_1-\lambda_n}{\lambda_n+\lambda_1}$)

iteration complexity: $o(\frac{\log\frac{1}{\varepsilon}}{\log\frac{\kappa-1}{\kappa+1}})$

$$f(\mathbf x^t)-f(\mathbf x^*)\leq\frac{L}{2}\left(\frac{\kappa-1}{\kappa+1}\right)^{2t}\|\mathbf x^0-\mathbf x^*\|_2$$

### Backtracking Line Search

Armijo Condition:
$$f(\mathbf x^t-\eta\nabla f(\mathbf x^t))<f(\mathbf x^t)-\alpha\eta\|\nabla f(\mathbf x^t)\|_2^2,0<\alpha<1$$

algorithm:
1. initialize $\eta=1$, $0<\alpha<\frac{1}{2}$, $0<\beta<1$
2. while $f(\mathbf x^t-\eta\nabla f(\mathbf x^t))<f(\mathbf x^t)-\alpha\eta\|\nabla f(\mathbf x^t)\|_2^2$, do:
	- $\eta\leftarrow\beta\eta$

上界: $f(\mathbf x^t)-\eta\|\nabla f(\mathbf x^t)\|_2^2+\frac{L\eta^2}{2}\|\nabla f(\mathbf x^t)\|_2^2$

> [!tip] Theorem
> $$f(\mathbf x^t)-f(\mathbf x^*)\leq(1-\min\{2\mu\alpha,\frac{2\beta\alpha\mu}{L}\})^t(f(\mathbf x^0)-f(\mathbf x^*))$$

收敛性:
$$\|\mathbf x^t-\mathbf x^*\|\leq\frac{\kappa-1}{\kappa+1}\|\mathbf x^{t-1}-\mathbf x^0\|$$

### Regularity Condition

$\mu$-strong + $L$-smooth

$$\eta\equiv\eta_t=\frac{1}{L}$$
$$\|\mathbf x^t-\mathbf x^*\|\leq(1-\frac{\mu}{L})^t\|\mathbf x^0-\mathbf x^*\|$$
### Polyak-Lojasiewicz Condition

$$\|\nabla f(\mathbf x)\|_2^2\geq2\mu(f(\mathbf x)-f(\mathbf x^*))$$

$$f(\mathbf x^t)-f(\mathbf x^*)\leq(1-\frac{\mu}{L})^t(f(\mathbf x^0)-f(\mathbf x^*))$$

### Over-parameterized linear regression

over-parameterize: model dimension > sample size

定义
$$f(x)=\frac12\sum_{i=1}^m(\mathbf a_i^\top\mathbf x-y_i)^2=\frac12(\mathbf {AX}-\mathbf Y)^2$$
有
$$\nabla f(x)=0\Leftrightarrow\mathbf X=(\mathbf A^\top\mathbf A)^{-1}\mathbf A^\top\mathbf Y$$
$$\nabla^2f(x)=\sum_{i=1}^m\mathbf a_i\mathbf a_i^\top$$
认为如果$\mathbf A=[\mathbf a_1,\cdots,\mathbf a_m]^\top\in\mathbf R^{m\times n}$, 其rank为$m$, 且满足step size $\eta_t\equiv\eta=\frac1{\lambda_{\text{max}}(\mathbf{AA}^\top)}$, 有:
$$f(\mathbf x^t)-f(\mathbf x^*)\leq\left(1-\frac{\lambda_{\text{min}}(\mathbf{AA}^\top)}{\lambda_{\text{max}}(\mathbf{AA}^\top)}\right)^t(f(\mathbf x^0)-f(\mathbf x^*)),\forall t$$

## Convex and Smooth Problem

### L-smooth

majorization-minimization

> [!tip] Theorem
> 如果是$L$-smooth的, 且有: $\eta=\frac{1}{L}$
> $$f(\mathbf x^{t+1})\leq f(\mathbf x^t)-\frac{1}{2L}\|\nabla f(\mathbf x^t)\|_2^2$$
> $$\|\mathbf x^t-\mathbf x^*\|\leq\|\mathbf x^{t-1}-\mathbf x^*\|-\frac{1}{L^2}\|\nabla f(\mathbf x^{t-1})\|_2^2$$
> $$f(\mathbf x^t)-f(\mathbf x^*)\leq\frac{2L\|\mathbf x^0-\mathbf x^*\|}{t}$$

## Non-convex Problem

> [!tip] Theorem
> - for general: $$\min_{0\leq k<t}\|\nabla f(\mathbf x^k)\|_2\leq\sqrt{\frac{2L(f(\mathbf x^0)-f(\mathbf x^*))}{t}}$$
> - for convex: $$\min_{\frac{t}{2}\leq k<t}\|\nabla f(\mathbf x^k)\|_2=\frac{4L\|\mathbf x^0-\mathbf x^*\|_2}{t}$$

# Gradient methods for Constrained Problems

## Frank-Wolfe algorithm
1. $\mathbf y^t:=\mathop{\arg\min}_{x\in\mathcal C}\langle\nabla f(\mathbf x^t),\mathbf x^t\rangle$
2. $\mathbf x^{t+1}=(1-\eta_t)\mathbf x^t+\eta_t\mathbf y^t$

over a convex set: $f(x^t)+\langle\nabla f(x^t),x-x^t\rangle$. 步长类似[[#Exact Line Search]]: $\eta_t=\frac{2}{t+2}$

对于non-convex:
$$\begin{matrix}\text{minimize}&-\mathbf x^\top\mathbf{Qx}\\\text{subject to}&\|\mathbf x\|_2\leq1\end{matrix}$$
有:
$$\begin{aligned}\mathbf y^t&=\mathop{\arg\min}_{\mathbf x:\|\mathbf x\|_2\leq1}\langle\nabla f(\mathbf x^t),\mathbf x\rangle=-\frac{\nabla f(\mathbf x^t)}{\|\nabla f(\mathbf x^t)\|_2}=\frac{\mathbf{Qx}^t}{\|\mathbf{Qx}^t\|_2}\\\Rightarrow\mathbf x^{t+1}&=(1-\eta_t)\mathbf x^t+\eta_t\frac{\mathbf{Qx}^t}{\|\mathbf{Qx}^t\|_2}\end{aligned}$$

### Convergence

> [!tip] Theorem
> 假设$f$是convex的, 且是[[#L-smooth]]的, 假设有$\eta_t=\frac{2}{t+2}$, 那么有:
> $$f(\mathbf x^t)-f(\mathbf x^*)\leq\frac{2Ld_{\mathcal C}^2}{t+2}$$
> 其中$d_{\mathcal C}=\sup_{\mathbf x,\mathbf y\in\mathcal C}\|\mathbf x-\mathbf y\|_2$

对于compact约束集合, 效率可以达到 $\varepsilon$-accuracy, 在$O(\frac1\varepsilon)$个迭代中

> [!example]
> 假设有集合$\mathcal C$是$\mu$-convex的, 假设$\forall\lambda\in[0,1]$, $\forall x,z\in\mathcal C$, 定义$\mathcal B(\mathbf a,r):=\{\mathbf y | \|\mathbf y-\mathbf a\|_2\leq r\}$, 那么有:
> $$\mathcal B(\lambda\mathbf x+(1-\lambda)\mathbf z,\frac{\mu}{2}\lambda(1-\lambda)\|\mathbf x-\mathbf z\|_2^2)\in\mathcal C$$

> [!tip] Theorem
> 假设$f$是convex and L-smooth的, 假设$\mathcal C$是$\mu$-strongly convex的, 那么$0\leq c\leq\|\nabla f(\mathbf x)\|_2,\forall x\in\mathcal C$
## Projected Gradient Method

将一个在集合外的点映射到集合中

> [!note] Definition
> Euclidean projection(quadratic minimization):
> $$\mathcal P_C(\mathbf x):=\mathop{\arg\min}_{\mathbf z\in C}\|\mathbf x-\mathbf z\|_2^2$$

循环:
$$\mathbf x^{t+1}=\mathcal P_C(\mathbf x^t-\eta_t\nabla f(\mathbf x^t))$$

> [!tip] Theorem
> 假设有集合$\mathcal C$是close且[[#Convex Set|convex]]的, 那么有:
> $$(\mathbf x-\mathcal P_{\mathcal C}(\mathbf x))^\top(\mathbf z-\mathcal P_{\mathcal C}(\mathbf x))\leq0,\quad\forall\mathbf z\in\mathcal C$$

![[Pasted image 20250506150835.png]]

从上图可知, 有$-\nabla f(\mathbf x^t)^\top(\mathbf x^{t+1}-\mathbf x^t)\geq0$, 即$\mathbf x^{t+1}-\mathbf x^t$和最速下降的方向是正相关的

## Strongly Convex

> [!tip] Theorem
> 假设$\mathbf x^*\in\text{int}(\mathcal C)$, 假设$f$是$\mu$-strongly convex且L-smooth的. 令$\eta_t=\frac{2}{\mu+L},\kappa=\frac{L}{\mu}$, 有
> $$\|\mathbf x^t-\mathbf x^*\|_2\leq\left(\frac{\kappa-1}{\kappa+1}\right)^t\|\mathbf x_0-\mathbf x^*\|_2$$

一些其他情况参见[[#Smooth problem]]

# Non-differentiable Problems

## (Projected) Sub-gradient Method

> [!info] Definition
> 当且仅当$\mathbf g$满足
> $$f(\mathbf z)\geq f(\mathbf x)+\mathbf g^\top(\mathbf z-\mathbf x),\forall\mathbf z$$
> 的时候, 称之为sub-gradient

$$\mathbf x^{t+1}=\mathcal P_{\mathcal C}(\mathbf x^t-\eta_tg^t)$$
其中$g^t$是$f$的任意的sub-gradient

> [!tip] Theorem
> $$\partial f(ax)=a\partial f(x)\quad\forall a>0$$
> $$\partial(f_1+f_2)=\partial f_1+\partial f_2$$
> $$\partial f(\mathbf{Ax}+\mathbf b)=\mathbf A^\top\partial f(\mathbf{Ax}+\mathbf b)$$
> chain rule: $\partial g\circ f=g'(f)\partial f$
> 
> composition: $f(\mathbf x)=h(f(\mathbf x_1),\cdots,f(\mathbf x_m))$, 假设$\mathbf q=\nabla h(\mathbf y)|_{\mathbf y=[f_1(\mathbf x),\cdots,f_n(\mathbf x)]}$, 且$\mathbf g_i\in\nabla f_i(\mathbf x)$, 那么有: $q_1\mathbf g_1+\cdots+q_n\mathbf g_n(\mathbf x)\in\partial f(\mathbf x)$
> 
> pointwise maximum: 如果有$f(\mathbf x)=\max_{1\leq i\leq k}f_i(\mathbf x)$, 那么有: $\partial f(\mathbf x)=\text{conv}\left\{\cup\{\partial f_i(\mathbf x)|f_i(\mathbf x)=f(\mathbf x)\}\right\}$, $\text{conv}$指的是[[#Convex Set|convex hull]] of subdifferentials of all active functions
> 
> pointwise supremum: 对于$f(\mathbf x)=\sup_{\alpha\in\mathcal F}f_\alpha(\mathbf x)$, 有: $\partial f(\mathbf x)=\text{closure}(\text{conv}\left\{\cup\{\partial f_\alpha(\mathbf x)|f_\alpha(\mathbf x)=f(\mathbf x)\}\right\})$, [[#Affine Set|closure]]的定义参见闭包仿射部分

> [!example]
> 假设有norm: $f(\mathbf x)=\|\mathbf x\|$, 对于$\mathbf g$满足$\|\mathbf g\|_*\leq1$, 有
> $$\mathbf g\in\partial f(0)$$
> 其中, $\|\cdot\|_*$是原始norm的对偶: $\|\mathbf x\|_*=\sup_{\mathbf z:\|\mathbf z\|\leq1}\langle\mathbf z,\mathbf x\rangle$

> [!example]
> l1-norm:
> $$f(\mathbf x)=\|\mathbf x\|_1=\sum_{i=1}^n|x_i|$$
> 因为
> $$\partial f_i(\mathbf x)=\left\{\begin{matrix}\text{sgn}(x_i)\mathbf e_i&\text{if }x_1\neq0 \\ [-1,1]\cdot\mathbf e_i&\text{if }x_i=0\end{matrix}\right.$$
> 因此有
> $$\sum_{i:x_i\neq0}\text{sgn}(x_i)\mathbf e_i\in\partial f(\mathbf x)$$

### Fundamental inequality for projected sub-gradient methods

#### majorization-minimization

找到另一个函数majorizes $\|\mathbf x^{t+1}-\mathbf x^*\|_2^2$, 然后优化这个函数

> [!tip] Lemma
> Projected sub-gradient 更新规则 满足:
> $$\|\mathbf x^{t+1}-\mathbf x^*\|_2^2\leq\underbrace{\underbrace{\|\mathbf x^t-\mathbf x^*\|_2^2}_{\text{fixed}}-2\eta_t(f(\mathbf x^t)-f^{\text{opt}})+\eta_t^2\|\mathbf g^t\|_2^2}_{\text{majorizing function}}$$

#### [[#Polyak-Lojasiewicz Condition|Polyak]]'s step size rule

推荐的step size: $\eta_t=\frac{f(\mathbf x^t)-f^{\text{opt}}}{\|\mathbf g^t\|_2^2}$, 其error reduction为:
$$\|\mathbf x^{t+1}-\mathbf x^*\|_2^2\leq\|\mathbf x^t-\mathbf x^*\|_2^2-\frac{(f(\mathbf x^t)-f(\mathbf x^*))^2}{\|\mathbf g^t\|_2^2}$$

当已知$f^{\text{opt}}$的时候很有用

[[#Convergence Rate|Convergence Rate]]是sublinear, 

> [!tip] Theorem
> 假设$f$是convex且$L_f$-Lipschitz continuous的. 那么projected sub-gradient method 应用Polyak's step size有:
> $$f^{\text{best},t}-f^{\text{opt}}\leq\frac{L_f\|\mathbf x^0-\mathbf x^*\|_2}{\sqrt{t+1}}$$

> [!tip] Theorem
> 假设$f$是convex且$L_f$-Lipschitz continuous的. 那么projected sub-gradient method, 但是没有应用Polyak's step size, 有:
> $$f^{\text{best},t}-f^{\text{opt}}\leq\frac{L\|\mathbf x^0-\mathbf x^*\|_2+L_f^2\sum_{i=0}^t\eta_i^2}{2\sum_{i=0}^t\eta_i}$$

summary:
![[Pasted image 20250506162641.png]]

# Convex-concave saddle point problems

![[#Stationary Point|saddle point]]
