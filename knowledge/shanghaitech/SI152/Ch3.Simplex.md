---
tags:
  - algorithm
  - tutorial
  - math
aliases:
  - Numerical Optimization - Simplex
---
# The Simplex Method

## Optimality conditions

> [!info] Definition
>
> 假设$\mathbf x$是polyhedron $P$的一个元素. 假设$\mathbf d\in\mathbb R^n$满足$\mathbf x+\theta\mathbf d\in P$, $\theta$是一个正标量, 那么我们称$\mathbf d$为**可行方向(feasible direction)**

我们假设$\mathbf x$是线性规划的[[Ch2.Geometry_of_Linear_Programming#Correspondence of bases and basic solutions|basic feasible solution]], 设$B(1),\cdots,B(m)$是basic variable的索引, 设basic matrix $\mathbf B=\begin{bmatrix}\vert&\cdots&\vert\\A_{B(1)}&\cdots&A_{B(m)}\\\vert&\cdots&\vert\end{bmatrix}$. 特别的, 对于nonbasic variable有$x_i=0$, 对于basic variables有$\mathbf x_B=(x_{B(1)},\cdots,x_{B(m)})$, 满足$\mathbf x_B=\mathbf B^{-1}\mathbf b$

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

