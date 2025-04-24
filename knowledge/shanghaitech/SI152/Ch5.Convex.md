---
tags:
  - algorithm
  - math
  - tutorial
aliases:
  - Numerical Optimization - Convex
---
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

standard form: 
$$\begin{matrix}\text{minimize}&f_0(x)\\\text{subject to}&f_i(x)\leq0&i=1,\cdots,m\\&h_i(x)=0&i=1,\cdots,p\end{matrix}$$
feasibility:
- 如果一个点$x\in\text{dom}f$满足所有的constraints, 那么称这个点是feasible的. 否则是infeasible
- 如果一个问题, 至少有一个点是feasible的, 那么称该问题为feasible的. 否则是infeasible

optimal value:
$$p^*=\inf\{f_0(x)|f_i(x)\leq0,i=1,\cdots,m,\quad h_i(x)=0,i=1,\cdots,p\}$$
- 如果问题是infeasible的, 那么$p^*=\infty$
- 如果问题是无边界的(unbounded below), 那么$p^*=-\infty$

Stationary Point:

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

### Some Other Solver

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
