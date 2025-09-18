---
type: lecture notes
tags:
  - lecture
  - electric
  - Robot
teacher:
  - 陈嘉豪
  - 李正浩
ClassID: EE160
done: false
---
# Preliminaries

Kernal:
$$F(\alpha)=\int_a^bf(t)K(\alpha,t)dt$$

- 傅立叶: $K(\omega,t)=e^{-j\omega t}$
- Laplace: $K(s,t)=e^{-st}$

Eigenvalues:

Kernel of matrix $A$ is null space of matrix $A$:
$$N(A)=null(A)=\{x\in\mathbb R|Ax=0\}$$
当零空间只有平凡解的时候, 是可逆的. 反之, 那么矩阵不可逆

$$det(A)=\prod\lambda_i$$


O.D.E:

$$\frac{dx}{dt}=\lambda x$$
$$\frac{dx}{x}=\lambda dt$$
$$\int_0^t\frac{1}{x}dx=\int_0^t\lambda dt$$
$$\ln|x(t)|-\ln|x(0)|=\lambda(t-0)$$
$$x(t)=x(0)e^{\lambda t}$$

Lecture 01
===

> [!note]- slides
> ![[ee160-lec1.pdf]]

Control Theory 研究以下三类问题:

System Identification Problem:
```mermaid
graph LR
Input-->?-->Outputs
```

Simulation Problem
```mermaid
graph LR
Input-->System-->?
```

Control Problem
```mermaid
graph LR
?-->System-->Outputs
```

## Control

反馈(feedback): 需要知道输出才能知道控制, 即输入$u$是$x$的函数

![[ee160-lec1.pdf#page=22|ee160-lec1, p.22]]

![[ee160-lec1.pdf#page=22&rect=315,312,406,405|ee160-lec1, p.22|100]]
$$E=R-Y$$

![[ee160-lec1.pdf#page=22&rect=382,339,466,392|ee160-lec1, p.22|100]]
$$U=CE$$

![[ee160-lec1.pdf#page=22&rect=462,338,654,419|ee160-lec1, p.22|211]]
$$Y=D_2+P(U+D_1)$$

上面三个公式组成了输出$Y$, 输入$U$与输出$Y$有关, 因此这个是一个反馈的系统

将中间变量全部消除, 得到:
$$Y=D_2+P(D_1+C(R-Y))$$
由于两侧都有输出$Y$, 因此移动并合并, 得到:
$$Y=\frac{PC}{1+PC}R+\frac{P}{1+PC}D_1+\frac{1}{1+PC}D_2$$
即: [[ee160-lec1.pdf#page=23|ee160-lec1, p.23]]

![[ee160-lec1.pdf#page=24&rect=313,315,684,445|ee160-lec1, p.24]]

此处可以理解为:
- $C$是一个转换器, 希望得到的是$R$, 有误差$E$, 经过$C$使得最终的输出$Y$接近$R$. 使$C=\infty$, 可以令$\frac{PC}{1+PC}R\to R$, 最终$Y\overset{C\to\infty}{=\mathrel{\mkern-3mu}=}R$
- 这个系统的目的是让输出$Y$追随目标$R$

# Lecture 02
> [!note]- slide
> ![[ee160-lec2.pdf]]

## Linear System

> [!PDF|note] [[ee160-lec2.pdf#page=3&selection=29,0,29,11&color=note|ee160-lec2, p.3]]
> > homogeneity
> 
> 齐次性:
> $$a h(x)=h(a x)$$

> [!PDF|note] [[ee160-lec2.pdf#page=3&selection=33,0,33,13&color=note|ee160-lec2, p.3]]
> > superposition
> 
> 叠加性:
> h(x_1)+h(x_2)=h(x_1+x_2)

> [!PDF|note] [[ee160-lec2.pdf#page=3&selection=40,0,42,10&color=note|ee160-lec2, p.3]]
> > time-invariance
> 
> 时不变:
> ```mermaid
> graph LR
> a("h(x)")-->f[System]-->b("y(x)")
> c("h(x-t0)")-->e[System]-->d("y(x-t0)")
> ```

> [!PDF|note] [[ee160-lec2.pdf#page=4&selection=18,0,18,13&color=note|ee160-lec2, p.4]]
> > True or False
> 
> True, 是一个线性系统, 但是是时变的

## Laplace Transform

冲击函数: $\delta(t)$: $\int_{0^-}^{0^+}\delta(t)dt=1$

阶跃函数: $u(t)$

Laplace Transform:
$$\mathcal L[f(t)]=F(s)=\int_{0^-}^{\infty}f(t)e^{-st}dt$$
常见的Laplace Transform:
![[ee160-lec2.pdf#page=7&rect=17,29,363,322&color=note|ee160-lec2, p.7]]

常见的Laplace Transform Theorems:
![[ee160-lec2.pdf#page=8&rect=456,32,951,409&color=note|ee160-lec2, p.8]]

> [!example] 
> 计算$e^{-3t}t\cdot u(t)$的Laplace Transform:
> 
> $$\mathcal L[e^{-3t}f(t)]=F(s+a)$$
> $$\mathcal L[t\cdot u(t)]=\frac{1}{s^2}$$
> $$\Rightarrow\mathcal L[e^{-3t}t\cdot u(t)]=\frac{1}{(s+3)^2}$$

> [!example] 
> ![[ee160-lec2.pdf#page=9&rect=28,329,300,411&color=note|ee160-lec2, p.9]]
> $$\begin{aligned}F_1(s)&=\frac{s^3+2s^2+6s+7}{s^2+s+5}\\&=\frac{s(s^2+s+5)+(s^2+s+5)+2}{s^2+s+5}\\&=s+1+\frac{2}{s^2+s+5}\\&=s+1+\frac{\sqrt{\frac{19}{4}}}{(s+\frac{1}{2})^2+\frac{19}{4}}\cdot\frac{2}{\sqrt{\frac{19}{4}}}\end{aligned}$$
> $$\Rightarrow\mathcal L^{-1}[F_1(s)]=\frac{d\delta(t)}{dt}+\delta(t)+e^{-\frac{1}{2}t}\sin\sqrt{\frac{19}{4}}t\cdot u(t)\cdot\frac{2}{\sqrt{\frac{19}{4}}}$$

> [!example] 
> ![[ee160-lec2.pdf#page=10&rect=37,56,626,164&color=note|ee160-lec2, p.10]]
> 
> 对两侧使用Laplace Transform, 得:
> $$s^2F(s)-sy(0^-)-y'(0^-)+12(sF(s)-y(0^-))+32F(s)=32\frac{1}{s}$$
> 因为初始状态下$y$为0, 有:
> $$\begin{aligned}s^2F(s)+12sF(s)+32F(s)&=\frac{32}{s}\\\\ F(s)&=\frac{32}{s(s^2+12s+32)}\\&=32\cdot\frac{1}{s}\cdot\frac{1}{4}(\frac{1}{s+4}-\frac{1}{s+8})\\&=8\cdot\frac{1}{3}(\frac{1}{s}-\frac{1}{s+4})-8\cdot\frac{1}{7}(\frac{1}{s}-\frac{1}{s+8})\\\\\Rightarrow y(t)&=\frac{8}{3}u(t)-\frac{8}{3}e^{-4t}u(t)-\frac{8}{7}u(t)+\frac{8}{7}e^{-8t}u(t)\\&=\frac{32}{21}u(t)-\frac{8}{3}e^{-4t}u(t)+\frac{8}{7}e^{-8t}u(t)\end{aligned}$$

> [!tip] 裂项的求法
> $$F(s)=\frac{1}{s(s+2)^2}$$
> 裂项之后的结果为:
> $$F(s)=\frac{A}{s}+\frac{B}{s+2}+\frac{C}{(s+2)^2}$$
> 注意, 高次项裂项需要把低次项都写出来
> 
> 然后计算系数:
> $$\begin{aligned}A&=sF(s)\\&=\frac{s}{s(s+2)^2}\\&=\frac{1}{(s+2)^2}\\\text{let $s=0$, we have: }A&=\frac{1}{4}\\\\ C&=(s+2)^2F(s)\\&=\frac{1}{s}\\\text{let $s=-2$, we have: }C&=-\frac{1}{2}\end{aligned}$$
> 对于$B$, 需要用求导的方式进行计算:
> $$\begin{aligned}B&=[(s+2)^2F(s)]'\\&=-\frac{1}{s^2}\\\text{let $s=-2$, we have: }B&=-\frac{1}{4}\end{aligned}$$

> [!example] 
> ![[ee160-lec2.pdf#page=11&rect=36,451,415,478&color=note|ee160-lec2, p.11]]
> $$\begin{aligned}\mathcal L[f(t)]=F(s+5)=\frac{1}{s+5}\end{aligned}$$
> 
> ![[ee160-lec2.pdf#page=11&rect=447,452,936,476&color=note|ee160-lec2, p.11]]
> $$\begin{aligned}F(s)&=\frac{10}{s(s+2)(s+3)^2}\\&=\frac{}{s}+\frac{}{s+2}+\frac{}{s+3}+\frac{}{(s+3)^2}\end{aligned}$$
> 注意, 高次项在裂项的时候需要使用重根, 不能省略$\frac{C}{s+3}$这一项

> [!example]
> ![[ee160-lec2.pdf#page=14&rect=31,406,688,472&color=note|ee160-lec2, p.14]]
> $$G(s)=\frac{s^2+4s+3}{s^3+3s^2+7s+5}$$
> 
> ![[ee160-lec2.pdf#page=14&rect=37,243,689,331&color=note|ee160-lec2, p.14]]
> $$\frac{d^2c}{dt^2}+6\frac{dc}{dt}+2c=2\frac{dr}{dt}+r$$
> 
> ![[ee160-lec2.pdf#page=14&rect=38,92,602,174&color=note|ee160-lec2, p.14]]
> $$c(t)=\frac{1}{32}-\frac{1}{16}e^{-4t}+\frac{1}{32}e^{-8t}$$

## System Examples

对于电路系统:
![[ee160-lec2.pdf#page=16&rect=190,353,511,470&color=note|ee160-lec2, p.16]]
