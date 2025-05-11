---
tags:
  - tutorial
  - algorithm
  - math
aliases:
  - Numerical Optimization - Gradient Descend
---
# Differentiable Unconstrained Minimization

$$\begin{matrix}\min&f(\mathbf x)\\\text{subject to}&\mathbf x\in\mathbb R^n\end{matrix}$$
其中$f$可微

## Convergence Rate

计算方法:

假设给定[[Ch1.Introduction_of_Linear_Programming#Piecewise linear convex objective functions|objective function]]能够转换成一个序列$r_k$, 计算极限
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

在[[Fit|机器学习]]中, $f$通常是loss函数, $\mathbf x$通常是loss函数中的参数, $\eta$是学习率

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
> 假设有集合$\mathcal C$是close且[[Ch5.Convex#Convex Set|convex]]的, 那么有:
> $$(\mathbf x-\mathcal P_{\mathcal C}(\mathbf x))^\top(\mathbf z-\mathcal P_{\mathcal C}(\mathbf x))\leq0,\quad\forall\mathbf z\in\mathcal C$$

![[Pasted image 20250506150835.png]]

从上图可知, 有$-\nabla f(\mathbf x^t)^\top(\mathbf x^{t+1}-\mathbf x^t)\geq0$, 即$\mathbf x^{t+1}-\mathbf x^t$和最速下降的方向是正相关的

## Strongly Convex

> [!tip] Theorem
> 假设$\mathbf x^*\in\text{int}(\mathcal C)$, 假设$f$是$\mu$-strongly convex且L-smooth的. 令$\eta_t=\frac{2}{\mu+L},\kappa=\frac{L}{\mu}$, 有
> $$\|\mathbf x^t-\mathbf x^*\|_2\leq\left(\frac{\kappa-1}{\kappa+1}\right)^t\|\mathbf x_0-\mathbf x^*\|_2$$

一些其他情况参见[[#Smooth problem]]