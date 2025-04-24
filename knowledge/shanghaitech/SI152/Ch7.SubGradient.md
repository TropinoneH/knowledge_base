---
tags:
  - tutorial
  - algorithm
  - math
aliases:
  - Numerical Optimization - SubGradient Method
---
# Non-differentiable Problems

## (Projected) Sub-gradient Method

> [!info] Definition
> 当且仅当$\mathbf g$满足
> $$f(\mathbf z)\geq f(\mathbf x)+\mathbf g^\top(\mathbf z-\mathbf x),\forall\mathbf z$$
> 的时候, 称之为sub-gradient

$$\mathbf x^{t+1}=\mathcal P_{\mathcal C}(\mathbf x^t-\eta_tg^t)$$
其中$g^t$是$f$的任意的sub-gradient

