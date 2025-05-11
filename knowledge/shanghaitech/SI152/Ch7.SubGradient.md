---
tags:
  - tutorial
  - algorithm
  - math
aliases:
  - Numerical Optimization - SubGradient Method
---
前置: [[Ch5.Convex]]
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
> pointwise maximum: 如果有$f(\mathbf x)=\max_{1\leq i\leq k}f_i(\mathbf x)$, 那么有: $\partial f(\mathbf x)=\text{conv}\left\{\cup\{\partial f_i(\mathbf x)|f_i(\mathbf x)=f(\mathbf x)\}\right\}$, $\text{conv}$指的是[[Ch5.Convex#Convex Set|convex hull]] of subdifferentials of all active functions
> 
> pointwise supremum: 对于$f(\mathbf x)=\sup_{\alpha\in\mathcal F}f_\alpha(\mathbf x)$, 有: $\partial f(\mathbf x)=\text{closure}(\text{conv}\left\{\cup\{\partial f_\alpha(\mathbf x)|f_\alpha(\mathbf x)=f(\mathbf x)\}\right\})$, [[Ch5.Convex#Affine Set|closure]]的定义参见闭包仿射部分

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

#### [[Ch6.Gradient#Polyak-Lojasiewicz Condition|Polyak]]'s step size rule

推荐的step size: $\eta_t=\frac{f(\mathbf x^t)-f^{\text{opt}}}{\|\mathbf g^t\|_2^2}$, 其error reduction为:
$$\|\mathbf x^{t+1}-\mathbf x^*\|_2^2\leq\|\mathbf x^t-\mathbf x^*\|_2^2-\frac{(f(\mathbf x^t)-f(\mathbf x^*))^2}{\|\mathbf g^t\|_2^2}$$

当已知$f^{\text{opt}}$的时候很有用

[[Ch6.Gradient#Convergence Rate|Convergence Rate]]是sublinear, 

> [!tip] Theorem
> 假设$f$是convex且$L_f$-Lipschitz continuous的. 那么projected sub-gradient method 应用Polyak's step size有:
> $$f^{\text{best},t}-f^{\text{opt}}\leq\frac{L_f\|\mathbf x^0-\mathbf x^*\|_2}{\sqrt{t+1}}$$

> [!tip] Theorem
> 假设$f$是convex且$L_f$-Lipschitz continuous的. 那么projected sub-gradient method, 但是没有应用Polyak's step size, 有:
> $$f^{\text{best},t}-f^{\text{opt}}\leq\frac{L\|\mathbf x^0-\mathbf x^*\|_2+L_f^2\sum_{i=0}^t\eta_i^2}{2\sum_{i=0}^t\eta_i}$$

summary:
![[Pasted image 20250506162641.png]]

# Convex-concave saddle point problems

[[Ch5.Convex#Stationary Point|saddle point]]
