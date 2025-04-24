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

> [!note]
> # Convergence Rate
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

%% TODO %%

## Convex and Smooth Problem

majorization-minimization

> [!tip] Theorem
> 如果是$L$-smooth的, 那么有: $\eta=\frac{1}{L}$
> $$f(\mathbf x^{t+1}-\mathbf x^t)\leq-\frac{1}{2L}\|\nabla f(\mathbf x^t)\|_2^2$$

> [!tip] Theorem
> 如果是convex且$L$-smooth的, 那么有: $\eta=\frac{1}{L}$
> $$\|\mathbf x^t-\mathbf x^*\|\leq\|\mathbf x^{t-1}-\mathbf x^*\|-\frac{1}{L^2}\|\nabla f(\mathbf x^{t-1})\|_2^2$$
> $$f(\mathbf x^t)-f(\mathbf x^*)\leq\frac{2L\|\mathbf x^0-\mathbf x^*\|}{t}$$

## Non-convex Problem

> [!tip] Theorem
> - for general: $$\min_{0\leq k<t}\|\nabla f(\mathbf x^k)\|_2\leq\sqrt{\frac{2L(f(\mathbf x^0)-f(\mathbf x^*))}{t}}$$
> - for convex: $$\min_{\frac{t}{2}\leq k<t}\|\nabla f(\mathbf x^k)\|_2=\frac{4L\|\mathbf x^0-\mathbf x^*\|_2}{t}$$


# Gradient methods for Constrained Problems

Frank-Wolfe algorithm:
1. $\mathbf y^t:=\mathop{\arg\min}_{x\in\mathcal C}\langle\nabla f(\mathbf x^t),\mathbf x^t\rangle$
2. $\mathbf x^{t+1}=(1-\eta_t)\mathbf x^t+\eta_t\mathbf y^t$

over a convex set: $f(x^t)+\langle\nabla f(x^t),x-x^t\rangle$. 步长类似[[#Exact Line Search]]: $\eta_t=\frac{2}{t+2}$

对于non-convex:

%% TODO %%

## Projected Gradient Method

%% TODO %%

