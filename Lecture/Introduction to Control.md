---
type: lecture note
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

# Lecture 01

> [!note]- slides
> ![[EE160-Lec1-Introduction2FeedbackControl.pdf]]

## Control Theory

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

控制:
- Dynamics: 这个系统本身的变化方向. 如:
	- $\frac{d}{dt}x=\pm1$: 恒定增长/减小
	- $\frac{d}{dt}x=\pm x$: 指数增长/减小
	- $\frac{d}{dt}x=x^2$: 非线性增长/减小
- Goal: 期望系统达成的目标. 如, 让$x\to0$, 并稳定下来
- Input: 重点的部分. 要设计一个输入(Control System), 使得整个系统达到我们的Goal:
	- $\frac{d}{dt}x=x^2+u$
	- $u$是Control Input. 前面的是Dynamics

但是更常见的系统是一个二阶系统(加速度, ...):
![[EE160-Lec1-Introduction2FeedbackControl.pdf#page=20&rect=34,318,319,469|409]]

为了防止过冲(有加速度, 一阶系统仅能做到靠近, 但是无法确保不会“过冲”(overshoot)或者震荡)

### Feedback Control

反馈(feedback): 需要知道输出才能知道控制, 即输入$u$是$x$的函数

#### Negative Feedback

负反馈. 输出越大, 输入越小(或者越负). 防止输出爆炸

e.g.
![[EE160-Lec1-Introduction2FeedbackControl.pdf#page=22&rect=275,330,570,435|230]]
根据图中的关系写表达式:
- $Y=D_2+P(U+D_1)$: 最终的输出
- $U=CE$: 由控制器$C$发出的信号, 用于控制最终的输出
- $E=R-Y$: Error误差, 期望的目标$R$(或者叫Reference)和输出$Y$之间的差异

将$U$替换, 得到最终的输出的公式:
$$\begin{aligned}Y&=D_2+P(U+D_1)\\&=D_2+P(C(R-Y)+D_1)\\&=D_2+PCR-PCY+PD_1\end{aligned}$$
$$\Rightarrow Y=\frac{PC}{1+PC}R+\frac{P}{1+PC}D_1+\frac{1}{1+PC}D_2$$

此处可以理解为:
- $C$是一个转换器, 希望得到的是$R$, 有误差$E$, 经过$C$使得最终的输出$Y$接近$R$.
- 这个系统的目的是让输出$Y$追随目标$R$

使$C=\infty$, 可以令$\frac{PC}{1+PC}R\to R$, 最终$Y\overset{C\to\infty}{=\mathrel{\mkern-3mu}=}R$. 即, 如果让控制的增益能够达到无限, 那么系统会忽视其他的组件, 直接复制Reference.

但是实际上这个是理想的系统, 真实世界中由于 能量不是无限的, 因此令$C\to\infty$是不可能达成的.
# Lecture 02
> [!note]- slide
> ![[EE160-Lec2-MathModels.pdf]]

## Linear System

[[EE160-Lec2-MathModels.pdf#page=3&selection=28,0,28,11|齐次性]]: $\alpha h(x)=h(\alpha x)$
![[EE160-Lec2-MathModels.pdf#page=3&rect=5,179,247,308|254]]

[[EE160-Lec2-MathModels.pdf#page=3&selection=32,0,32,13|可加性]]: $h(x)+h(y)=h(x+y)$
![[EE160-Lec2-MathModels.pdf#page=3&rect=258,144,499,305|244]]

[[EE160-Lec2-MathModels.pdf#page=3&selection=38,1,39,15|时不变性]]: $\matrix{x(t)\rightarrow\text{system}\rightarrow y(t)\\\Downarrow\\x(t+t_0)\rightarrow\text{system}\rightarrow y(t+t_0)}$
![[EE160-Lec2-MathModels.pdf#page=3&rect=503,146,839,306|254]]

### Linear Operator

线性操作. 对一个线性系统做线形操作, 得到的系统仍然是线性的.
- $\alpha x(t)$
- $\frac{1}{\alpha}x(t)$
- $\int x(t)dt$
- $\frac{d}{dt}x(t)$
- $x_1(t)+x_2(t)$
- $x_1(t)-x_2(t)$

## Laplace Transform

激励函数(Excitation Functions): 在未知系统的时候, 创建一个冲击函数作为输入, 然后根据输出去分析这个系统的构成
- 冲击函数: $\delta(t)$: $\int_{0^-}^{0^+}\delta(t)dt=1$
- 阶跃函数: $u(t)=\left\{\matrix{1&t>0\\0&t<0}\right.$ ^1a68f2

Laplace Transform:

定义$s=\sigma+j\omega$:
$$\mathcal L[f(t)]=F(s)=\int_{0^-}^{\infty}f(t)e^{-st}dt$$

常见的Laplace[[EE160-Lec2-MathModels.pdf#page=7&rect=14,89,318,342|变换]]和[[EE160-Lec2-MathModels.pdf#page=8&rect=400,103,832,418|逆变换]]:

| $f(t)$                                                    | $F(s)$                          |
| :-------------------------------------------------------- | :------------------------------ |
| $\delta(t)$                                               | $1$                             |
| $u(t) = \begin{cases} 1 & t > 0 \\ 0 & t < 0 \end{cases}$ | $\frac{1}{s}$                   |
| $tu(t)$                                                   | $\frac{1}{s^2}$                 |
| $t^n u(t)$                                                | $\frac{n!}{s^{n+1}}$            |
| $e^{-at}u(t)$                                             | $\frac{1}{s+a}$                 |
| $\sin \omega t u(t)$                                      | $\frac{\omega}{s^2 + \omega^2}$ |
| $\cos \omega t u(t)$                                      | $\frac{s}{s^2 + \omega^2}$      |

| Theorem                                                                                     | Name                    |
| :------------------------------------------------------------------------------------------ | :---------------------- |
| $\mathscr{L}[f(t)] = F(s) = \int_{0-}^{\infty} f(t)e^{-st}dt$                               | Definition              |
| $\mathscr{L}[kf(t)] = kF(s)$                                                                | Linearity theorem       |
| $\mathscr{L}[f_1(t) + f_2(t)] = F_1(s) + F_2(s)$                                            | Linearity theorem       |
| $\mathscr{L}[e^{-at}f(t)] = F(s+a)$                                                         | Frequency shift theorem |
| $\mathscr{L}[f(t-T)] = e^{-sT}F(s)$                                                         | Time shift theorem      |
| $\mathscr{L}[f(at)] = \frac{1}{a}F\left(\frac{s}{a}\right)$                                 | Scaling theorem         |
| $\mathscr{L}\left[\frac{df}{dt}\right] = sF(s) - f(0-)$                                     | Differentiation theorem |
| $\mathscr{L}\left[\frac{d^2f}{dt^2}\right] = s^2F(s) - sf(0-) - f'(0-)$                     | Differentiation theorem |
| $\mathscr{L}\left[\frac{d^n f}{dt^n}\right] = s^n F(s) - \sum_{k=1}^{n} s^{n-k}f^{k-1}(0-)$ | Differentiation theorem |
| $\mathscr{L}\left[\int_{0-}^{t} f(\tau)d\tau\right] = \frac{F(s)}{s}$                       | Integration theorem     |
| $f(\infty) = \lim_{s \to 0} sF(s)$                                                          | Final value theorem     |
| $f(0+) = \lim_{s \to \infty} sF(s)$                                                         | Initial value theorem   |


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

![[EE160-lec2.pdf#page=24&rect=329,277,468,392|EE160-lec2, p.22|132]]

其中:
- $x(t)$是状态向量
- $\overset{\cdot}{x}(t)$是一阶导数
- $y$是输出向量
- $u$是输入向量, 或者说control vector
- $\mathbf{A}$是系统矩阵
- $\mathbf{B}$是输入矩阵
- $\mathbf{C}$是输出矩阵
- $\mathbf{D}$是前馈矩阵

![[EE160-lec2.pdf#page=25&rect=20,271,477,437|EE160-lec2, p.23]]
$$\overset{\cdot}{x}=\begin{bmatrix}\frac{1}{C_1}&\frac{1}{C_1}&-\frac{1}{C_1}\\-\frac{1}{L}&0&0\\\frac{1}{C_2}&0&-\frac{1}{C_2}\end{bmatrix}\cdot x+\begin{bmatrix}0\\1\\0\end{bmatrix}\cdot v_i(t)$$
$$y=\begin{bmatrix}0&0&1\end{bmatrix}x$$

![[EE160-lec2.pdf#page=25&rect=497,319,921,438|EE160-lec2, p.23]]
$$\overset{\cdot}{z}=\begin{bmatrix}0&1&0&0&0&0\\-1&-1&0&1&0&0\\0&0&0&1&0&0\\0&1&-1&-1&1&0\\0&0&0&0&1&0\\0&0&1&0&-1&-1\end{bmatrix}\cdot z+\begin{bmatrix}0\\1\\0\\0\\0\\0\end{bmatrix}\cdot f(t)$$
$$y=\begin{bmatrix}0&0&0&0&1&0\end{bmatrix}z$$
$$\text{where: }z=\begin{bmatrix}x_1&\overset{\cdot}{x}_1&x_2&\overset{\cdot}{x}_2&x_3&\overset{\cdot}{x}_3&\end{bmatrix}^\top$$

### Transfer Function to State Space Model

二级结论: 对于分母的幂次严格大于分子的转移函数, 有:

![[EE160-lec2.pdf#page=26&rect=457,28,943,274|EE160-lec2, p.24]]

> [!example]+
> ![[EE160-lec2.pdf#page=29&rect=41,369,787,455|EE160-lec2, p.27]]
> $$$$

### State Space Model to Transfer Function

![[EE160-lec2.pdf#page=30&rect=634,207,906,295|EE160-lec2, p.28]]

> [!example]+ 
> ![[EE160-lec2.pdf#page=32&rect=206,317,703,437|EE160-lec2, p.30]]
> $$sI-A=\begin{bmatrix}s+4&1.5\\-4&s\end{bmatrix}$$
> $$adj(sI-A)=\begin{bmatrix}s&-1.5\\4&s+4\end{bmatrix}$$
> $$det(sI-A)=s(s+4)+6$$
> $$(sI-A)^{-1}=\frac{ajd(sI-A)}{det(sI-A)}=\frac{\begin{bmatrix}s&-1.5\\4&s+4\end{bmatrix}}{s^2+4s+6}$$
> $$T(s)=\begin{bmatrix}1.5&0.625\end{bmatrix}\frac{\begin{bmatrix}s&-1.5\\4&s+4\end{bmatrix}}{s^2+4s+6}\begin{bmatrix}2\\0\end{bmatrix}=\frac{3s+5}{s^2+4s+6}$$

### Diagonal State Space Repr

对角SSM表达:
![[EE160-lec2.pdf#page=34|EE160-lec2, p.32]]

> [!example] 
> ![[EE160-lec2.pdf#page=35&rect=15,327,579,441|EE160-lec2, p.33]]
> 
> Solution:
> ![[EE160-lec2.pdf#page=35&rect=33,28,921,205|EE160-lec2, p.33]]
> ![[EE160-lec2.pdf#page=35&rect=603,319,953,469|EE160-lec2, p.33|287]]
> ![[EE160-lec2.pdf#page=35&rect=565,218,763,312|EE160-lec2, p.33|203]]
> 使用[[#State Space Model to Transfer Function|之前]]的解法:
> $$\begin{aligned}Y&=C(sI-A)^{-1}Bu\\&=\begin{bmatrix}2&3\end{bmatrix}\begin{bmatrix}s+3&-1\\-1&s+3\end{bmatrix}^{-1}\begin{bmatrix}1\\2\end{bmatrix}u\\&=\begin{bmatrix}2&3\end{bmatrix}\frac{\begin{bmatrix}s+3&1\\1&s+3\end{bmatrix}}{s^2+6s+8}\begin{bmatrix}1\\2\end{bmatrix}u\\&=\frac{8s+31}{s^2+6s+8}u=\left(\frac{}{s+2}+\frac{}{s+4}\right)u\end{aligned}$$
> 

## Solution of the State Space Model

![[EE160-lec2.pdf#page=37&rect=89,439,213,473|EE160-lec2, p.37|184]]
转化到频域:
![[EE160-lec2.pdf#page=37&rect=22,354,285,389|EE160-lec2, p.37|355]]

## Block Diagram

框图:
![[EE160-lec2.pdf#page=40|EE160-lec2, p.40]]

信号都是在频域中的

串联: 频域相乘:
![[EE160-lec2.pdf#page=40&rect=157,44,485,159|EE160-lec2, p.40]]
并联: 频域相加:
![[EE160-lec2.pdf#page=40&rect=492,44,840,245|EE160-lec2, p.40]]

![[EE160-lec2.pdf#page=41&rect=609,49,887,286|EE160-lec2, p.41]]
注意符号

- 叠加原理: ![[EE160-lec2.pdf#page=42&rect=420,349,769,482|EE160-lec2, p.42]]
- 齐次原理: ![[EE160-lec2.pdf#page=42&rect=223,46,504,272|EE160-lec2, p.42]]

> [!example] 
> ![[EE160-lec2.pdf#page=43&rect=328,162,943,476|EE160-lec2, p.43]]
> 
> Solution: 化简框图, 得:
> ![[EE160-lec2.pdf#page=44&rect=292,59,639,476|EE160-lec2, p.44]]

# Lecture 03
> [!note]- slide
> ![[EE160-lec3.pdf]]

![[EE160-lec3.pdf#page=3&rect=314,37,935,425|EE160-lec3, p.3]]

## Routh Table
![[EE160-lec3.pdf#page=19|EE160-lec3, p.19]]

## Routh-Hurwitz Criterion
劳斯判据

%% TODO %%

## Steady State Error
稳态误差($e_2(\infty)$)

![[EE160-lec3.pdf#page=28&rect=613,45,943,460|EE160-lec3, p.28|278]]


