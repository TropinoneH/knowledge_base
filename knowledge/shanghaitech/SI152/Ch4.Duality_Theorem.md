---
tags:
  - algorithm
  - math
  - tutorial
aliases:
  - Numerical Optimization - Duality Theorem
---
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
$$\matrix{\max&g(\mathbf p)\\\text{subject to}&\text{No Constrains}}$$

我们注意到$g(\mathbf p)=min_{\mathbf x\geq0}\left[\mathbf c^\top\mathbf x+\mathbf p^\top(\mathbf b-\mathbf {Ax})\right]=\mathbf p^\top\mathbf b+\min\limits_{\mathbf x\geq0}(\mathbf c^\top-\mathbf p^\top\mathbf {A})\mathbf x$, 其中:
$$\min_{\mathbf x\geq0}(\mathbf c^\top-\mathbf p^\top\mathbf A)\mathbf x=\left\{\matrix{\mathbf 0,&\text{if }\mathbf c^\top\mathbf x+\mathbf p^\top(\mathbf b-\mathbf {Ax})\geq\mathbf0^\top\\-\infty,&\text{otherwise}}\right.$$
我们在最大化$g(\mathbf p)$的时候, 只需要考虑不等于$-\infty$的值, 因此dual problem和如下linear programming没有区别:
$$\matrix{\max&\mathbf p^\top\mathbf b\\\text{subject to}&\mathbf p^\top\mathbf A\leq\mathbf c^\top}$$

因此我们得到了dual problem的一般形式:
$$
\matrix{
\matrix{\min&\mathbf c^\top\mathbf x\\\text{subject to}&a_ix\geq b_i&i\in M_1\\&a_ix\leq b_i&i\in M_2\\&a_ix=b_i&i\in M_3\\&x_j\geq0&j\in N_1\\&x_j\leq0&j\in N_2\\&x_j\text{ free}&j\in N_3}&\quad&
\matrix{\max&\mathbf p^\top\mathbf b\\\text{subject to}&p_i\geq0&i\in M_1\\&p_i\leq0&i\in M_2\\&p_i\text{ free}&i\in M_3\\&\mathbf p^\top\mathbf A_j\leq c_j&j\in N_1\\&\mathbf p^\top\mathbf A_j\geq c_j&j\in N_2\\&\mathbf p^\top\mathbf A=c_j&j\in N_3}
}
$$

| primal problem | minimize                             | maximize                             | dual problem |
| -------------- | ------------------------------------ | ------------------------------------ | ------------ |
| constrains     | $\matrix{\geq b_i\\\leq b_i\\=b_i}$  | $\matrix{\geq0\\\leq0\\\text{free}}$ | variables    |
| variables      | $\matrix{\geq0\\\leq0\\\text{free}}$ | $\matrix{\leq c_j\\\geq c_j\\=c_j}$  | constrains   |
对于特殊形式, 可以使用矩阵表示(e.g. [[Ch1.Introduction_of_Linear_Programming#Standard form|Standard form]]):
$$
\matrix{
\matrix{\min&\mathbf c^\top\mathbf x\\\text{subject to}&\mathbf {Ax}=\mathbf b\\&\mathbf x\geq0}&\quad&
\matrix{\max&\mathbf p^\top\mathbf b\\\text{subject to}&\mathbf p^\top\mathbf A\leq\mathbf c^\top\\\text{}}
}
$$
$$
\matrix{
\matrix{\min&\mathbf c^\top\mathbf x\\\text{subject to}&\mathbf {Ax}\geq\mathbf b\\&\text{}}&\quad&
\matrix{\max&\mathbf p^\top\mathbf b\\\text{subject to}&\mathbf p^\top\mathbf A=\mathbf c^\top\\&\mathbf p\geq0}
}
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
> 1. 如果primal problem和dual problem中有一个有解, 则另一个问题也有解, 且最优值相等.
> 2. 设$\mathbf x^*$是primal的optimal solution, $\mathbf B$是primal的optimal basis, $\mathbf p^*$是dual的optimal solution, 则:
>    $$\mathbf p^*=(\mathbf c_B^\top\mathbf B^{-1})^\top$$

primal problem --> dual problem --> introduce relax variable, turn to standard form --> simplex solve

primal problem的simplex解出来的松弛变量对应的$r^\top_i$的值就是dual problem solution.

对偶单纯形法: 
- 适用范围: 需要同时满足两个条件, 使普通单纯形法无法使用
  1. 将$\geq$乘$-1$转成$\leq$之后, 导致$b$列有负值
  2. 同时, 在$r^\top$行全部大于0
- 求解流程: 实现类似[[Ch3.Simplex#实现|Simplex]], 但是改了

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