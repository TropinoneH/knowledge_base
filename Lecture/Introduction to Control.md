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
> ![[EE160-lec1.pdf]]

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

![[EE160-lec1.pdf#page=22|ee160-lec1, p.22]]

![[EE160-lec1.pdf#page=22&rect=315,312,406,405|ee160-lec1, p.22|100]]
$$E=R-Y$$

![[EE160-lec1.pdf#page=22&rect=382,339,466,392|ee160-lec1, p.22|100]]
$$U=CE$$

![[EE160-lec1.pdf#page=22&rect=462,338,654,419|ee160-lec1, p.22|211]]
$$Y=D_2+P(U+D_1)$$

上面三个公式组成了输出$Y$, 输入$U$与输出$Y$有关, 因此这个是一个反馈的系统

将中间变量全部消除, 得到:
$$Y=D_2+P(D_1+C(R-Y))$$
由于两侧都有输出$Y$, 因此移动并合并, 得到:
$$Y=\frac{PC}{1+PC}R+\frac{P}{1+PC}D_1+\frac{1}{1+PC}D_2$$
即: [[EE160-lec1.pdf#page=23|ee160-lec1, p.23]]

![[EE160-lec1.pdf#page=24&rect=313,315,684,445|ee160-lec1, p.24]]

此处可以理解为:
- $C$是一个转换器, 希望得到的是$R$, 有误差$E$, 经过$C$使得最终的输出$Y$接近$R$. 使$C=\infty$, 可以令$\frac{PC}{1+PC}R\to R$, 最终$Y\overset{C\to\infty}{=\mathrel{\mkern-3mu}=}R$
- 这个系统的目的是让输出$Y$追随目标$R$

# Lecture 02
> [!note]- slide
> ![[EE160-lec2.pdf]]

## Linear System

> [!PDF|note] [[EE160-lec2.pdf#page=3&selection=29,0,29,11&color=note|ee160-lec2, p.3]]
> > homogeneity
> 
> 齐次性:
> $$a h(x)=h(a x)$$

> [!PDF|note] [[EE160-lec2.pdf#page=3&selection=33,0,33,13&color=note|ee160-lec2, p.3]]
> > superposition
> 
> 叠加性:
> h(x_1)+h(x_2)=h(x_1+x_2)

> [!PDF|note] [[EE160-lec2.pdf#page=3&selection=40,0,42,10&color=note|ee160-lec2, p.3]]
> > time-invariance
> 
> 时不变:
> ```mermaid
> graph LR
> a("h(x)")-->f[System]-->b("y(x)")
> c("h(x-t0)")-->e[System]-->d("y(x-t0)")
> ```

> [!PDF|note] [[EE160-lec2.pdf#page=4&selection=18,0,18,13&color=note|ee160-lec2, p.4]]
> > True or False
> 
> True, 是一个线性系统, 但是是时变的

## Laplace Transform

冲击函数: $\delta(t)$: $\int_{0^-}^{0^+}\delta(t)dt=1$

阶跃函数: $u(t)$

Laplace Transform:
$$\mathcal L[f(t)]=F(s)=\int_{0^-}^{\infty}f(t)e^{-st}dt$$
常见的Laplace Transform:
![[EE160-lec2.pdf#page=7&rect=17,29,363,322&color=note|ee160-lec2, p.7]]

常见的Laplace Transform Theorems:
![[EE160-lec2.pdf#page=8&rect=456,32,951,409&color=note|ee160-lec2, p.8]]

> [!example] 
> 计算$e^{-3t}t\cdot u(t)$的Laplace Transform:
> 
> $$\mathcal L[e^{-3t}f(t)]=F(s+a)$$
> $$\mathcal L[t\cdot u(t)]=\frac{1}{s^2}$$
> $$\Rightarrow\mathcal L[e^{-3t}t\cdot u(t)]=\frac{1}{(s+3)^2}$$

> [!example] 
> ![[EE160-lec2.pdf#page=9&rect=28,329,300,411&color=note|ee160-lec2, p.9]]
> $$\begin{aligned}F_1(s)&=\frac{s^3+2s^2+6s+7}{s^2+s+5}\\&=\frac{s(s^2+s+5)+(s^2+s+5)+2}{s^2+s+5}\\&=s+1+\frac{2}{s^2+s+5}\\&=s+1+\frac{\sqrt{\frac{19}{4}}}{(s+\frac{1}{2})^2+\frac{19}{4}}\cdot\frac{2}{\sqrt{\frac{19}{4}}}\end{aligned}$$
> $$\Rightarrow\mathcal L^{-1}[F_1(s)]=\frac{d\delta(t)}{dt}+\delta(t)+e^{-\frac{1}{2}t}\sin\sqrt{\frac{19}{4}}t\cdot u(t)\cdot\frac{2}{\sqrt{\frac{19}{4}}}$$

> [!example] 
> ![[EE160-lec2.pdf#page=10&rect=37,56,626,164&color=note|ee160-lec2, p.10]]
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
> ![[EE160-lec2.pdf#page=11&rect=36,451,415,478&color=note|ee160-lec2, p.11]]
> $$\begin{aligned}\mathcal L[f(t)]=F(s+5)=\frac{1}{s+5}\end{aligned}$$
> 
> ![[EE160-lec2.pdf#page=11&rect=447,452,936,476&color=note|ee160-lec2, p.11]]
> $$\begin{aligned}F(s)&=\frac{10}{s(s+2)(s+3)^2}\\&=\frac{}{s}+\frac{}{s+2}+\frac{}{s+3}+\frac{}{(s+3)^2}\end{aligned}$$
> 注意, 高次项在裂项的时候需要使用重根, 不能省略$\frac{C}{s+3}$这一项

> [!example]
> ![[EE160-lec2.pdf#page=14&rect=31,406,688,472&color=note|ee160-lec2, p.14]]
> $$G(s)=\frac{s^2+4s+3}{s^3+3s^2+7s+5}$$
> 
> ![[EE160-lec2.pdf#page=14&rect=37,243,689,331&color=note|ee160-lec2, p.14]]
> $$\frac{d^2c}{dt^2}+6\frac{dc}{dt}+2c=2\frac{dr}{dt}+r$$
> 
> ![[EE160-lec2.pdf#page=14&rect=38,92,602,174&color=note|ee160-lec2, p.14]]
> $$c(t)=\frac{1}{32}-\frac{1}{16}e^{-4t}+\frac{1}{32}e^{-8t}$$

## System Examples

对于电路系统:
![[EE160-lec2.pdf#page=16&rect=190,353,511,470&color=note|ee160-lec2, p.16]]

## State Space Model

State Space Model由两部分组成, 一个是状态$\overset{\cdot}{x}=\mathbf{A}x(t)+\mathbf{B}u(t)$, 一个是输出$y=\mathbf{C}x(t)+\mathbf{D}u(t)$

![[EE160-lec2.pdf#page=22&rect=329,277,468,392|EE160-lec2, p.22|132]]

其中:
- $x(t)$是状态向量
- $\overset{\cdot}{x}(t)$是一阶导数
- $y$是输出向量
- $u$是输入向量, 或者说control vector
- $\mathbf{A}$是系统矩阵
- $\mathbf{B}$是输入矩阵
- $\mathbf{C}$是输出矩阵
- $\mathbf{D}$是前馈矩阵

![[EE160-lec2.pdf#page=23&rect=20,271,477,437|EE160-lec2, p.23]]
$$\overset{\cdot}{x}=\begin{bmatrix}\frac{1}{C_1}&\frac{1}{C_1}&-\frac{1}{C_1}\\-\frac{1}{L}&0&0\\\frac{1}{C_2}&0&-\frac{1}{C_2}\end{bmatrix}\cdot x+\begin{bmatrix}0\\1\\0\end{bmatrix}\cdot v_i(t)$$
$$y=\begin{bmatrix}0&0&1\end{bmatrix}x$$

![[EE160-lec2.pdf#page=23&rect=497,319,921,438|EE160-lec2, p.23]]
$$\overset{\cdot}{z}=\begin{bmatrix}0&1&0&0&0&0\\-1&-1&0&1&0&0\\0&0&0&1&0&0\\0&1&-1&-1&1&0\\0&0&0&0&1&0\\0&0&1&0&-1&-1\end{bmatrix}\cdot z+\begin{bmatrix}0\\1\\0\\0\\0\\0\end{bmatrix}\cdot f(t)$$
$$y=\begin{bmatrix}0&0&0&0&1&0\end{bmatrix}z$$
$$\text{where: }z=\begin{bmatrix}x_1&\overset{\cdot}{x}_1&x_2&\overset{\cdot}{x}_2&x_3&\overset{\cdot}{x}_3&\end{bmatrix}^\top$$

### Transfer Function to State Space Model

二级结论: 对于分母的幂次严格大于分子的转移函数, 有:

![[EE160-lec2.pdf#page=24&rect=457,28,943,274|EE160-lec2, p.24]]

> [!example]+
> ![[EE160-lec2.pdf#page=27&rect=41,369,787,455|EE160-lec2, p.27]]
> $$$$

### State Space Model to Transfer Function

![[EE160-lec2.pdf#page=28&rect=634,207,906,295|EE160-lec2, p.28]]

> [!example]+ 
> ![[EE160-lec2.pdf#page=30&rect=206,317,703,437|EE160-lec2, p.30]]
> $$sI-A=\begin{bmatrix}s+4&1.5\\-4&s\end{bmatrix}$$
> $$adj(sI-A)=\begin{bmatrix}s&-1.5\\4&s+4\end{bmatrix}$$
> $$det(sI-A)=s(s+4)+6$$
> $$(sI-A)^{-1}=\frac{ajd(sI-A)}{det(sI-A)}=\frac{\begin{bmatrix}s&-1.5\\4&s+4\end{bmatrix}}{s^2+4s+6}$$
> $$T(s)=\begin{bmatrix}1.5&0.625\end{bmatrix}\frac{\begin{bmatrix}s&-1.5\\4&s+4\end{bmatrix}}{s^2+4s+6}\begin{bmatrix}2\\0\end{bmatrix}=\frac{3s+5}{s^2+4s+6}$$

### Diagonal State Space Repr

对角SSM表达:
![[EE160-lec2.pdf#page=32|EE160-lec2, p.32]]

> [!example] 
> ![[EE160-lec2.pdf#page=33&rect=15,327,579,441|EE160-lec2, p.33]]
