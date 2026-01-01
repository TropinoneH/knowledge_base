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

## Linear Time Invariant System

[[EE160-Lec2-MathModels.pdf#page=3&selection=28,0,28,11|齐次性(homogenity)]]: $\alpha h(x)=h(\alpha x)$
![[EE160-Lec2-MathModels.pdf#page=3&rect=5,179,247,308|254]]

[[EE160-Lec2-MathModels.pdf#page=3&selection=32,0,32,13|可加性(superposition)]]: $h(x)+h(y)=h(x+y)$
![[EE160-Lec2-MathModels.pdf#page=3&rect=258,144,499,305|244]]

[[EE160-Lec2-MathModels.pdf#page=3&selection=38,1,39,15|时不变性(time invariance)]]: $\matrix{x(t)\rightarrow\text{system}\rightarrow y(t)\\\Downarrow\\x(t+t_0)\rightarrow\text{system}\rightarrow y(t+t_0)}$
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

[[EE160-Lec2-MathModels.pdf#page=6&selection=16,0,16,21|激励函数]](Excitation Functions): 在未知系统的时候, 创建一个冲击函数作为输入, 然后根据输出去分析这个系统的构成
- 冲击函数: $\delta(t)$: $\int_{0^-}^{0^+}\delta(t)dt=1$
- 阶跃函数: $u(t)=\left\{\matrix{1&t>0\\0&t<0}\right.$ ^1a68f2
- Ramp函数: $tu(t)$
- Parabola函数: $\frac{1}{2}t^2u(t)$
- Sinusoid函数: $\sin(\omega t)$

![[EE160-Lec2-MathModels.pdf#page=6&rect=465,90,826,482|490]]

### Laplace Transform

定义$s=\sigma+j\omega$:
$$\mathcal L[f(t)]=F(s)=\int_{0^-}^{\infty}f(t)e^{-st}dt$$

常见的Laplace[[EE160-Lec2-MathModels.pdf#page=7&rect=14,89,318,342|变换]]:

| $f(t)$                                                    | $F(s)$                          |
| :-------------------------------------------------------- | :------------------------------ |
| $\delta(t)$                                               | $1$                             |
| $u(t) = \begin{cases} 1 & t > 0 \\ 0 & t < 0 \end{cases}$ | $\frac{1}{s}$                   |
| $tu(t)$                                                   | $\frac{1}{s^2}$                 |
| $t^n u(t)$                                                | $\frac{n!}{s^{n+1}}$            |
| $e^{-at}u(t)$                                             | $\frac{1}{s+a}$                 |
| $\sin \omega t u(t)$                                      | $\frac{\omega}{s^2 + \omega^2}$ |
| $\cos \omega t u(t)$                                      | $\frac{s}{s^2 + \omega^2}$      |

常见的Laplace[[EE160-Lec2-MathModels.pdf#page=8&rect=400,103,832,418|变换的操作]], 即复合函数的Laplace变换:

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
| $\mathscr{L}\left[\frac{df}{dt}\right] = sF(s) - f(0-)$                                       | Differentiation theorem |
| $\mathscr{L}\left[\frac{d^2f}{dt^2}\right] = s^2F(s) - sf(0-) - f'(0-)$                      | Differentiation theorem |
| $\mathscr{L}\left[\frac{d^n f}{dt^n}\right] = s^n F(s) - \sum_{k=1}^{n} s^{n-k}f^{k-1}(0-)$      | Differentiation theorem |

> [!example] 
> 计算$e^{-3t}t\cdot u(t)$的Laplace Transform:
> 
> $$\mathcal L[e^{-3t}f(t)]=F(s+a)$$
> $$\mathcal L[t\cdot u(t)]=\frac{1}{s^2}$$
> $$\Rightarrow\mathcal L[e^{-3t}t\cdot u(t)]=\frac{1}{(s+3)^2}$$

> [!example] 
> 计算Laplace Inverse Transform: $F_1(s)=\frac{s^3+2s^2+6s+7}{s^2+s+5}$
> $$\begin{aligned}F_1(s)&=\frac{s^3+2s^2+6s+7}{s^2+s+5}\\&=\frac{s(s^2+s+5)+(s^2+s+5)+2}{s^2+s+5}\\&=s+1+\frac{2}{s^2+s+5}\\&=s+1+\frac{\sqrt{\frac{19}{4}}}{(s+\frac{1}{2})^2+\frac{19}{4}}\cdot\frac{2}{\sqrt{\frac{19}{4}}}\end{aligned}$$
> $$\Rightarrow\mathcal L^{-1}[F_1(s)]=\frac{d\delta(t)}{dt}+\delta(t)+e^{-\frac{1}{2}t}\sin\sqrt{\frac{19}{4}}t\cdot u(t)\cdot\frac{2}{\sqrt{\frac{19}{4}}}$$

> [!example] 
> 根据微分方程求解Laplace Inverse Transform: $\frac{d^2y}{dt^2}+12\frac{dy}{dt}+32y=32u(t)$
> 
> 对两侧使用Laplace Transform, 得:
> $$s^2F(s)-sy(0^-)-y'(0^-)+12(sF(s)-y(0^-))+32F(s)=32\frac{1}{s}$$
> 因为初始状态下$y$为0, 有:
> $$\begin{aligned}s^2F(s)+12sF(s)+32F(s)&=\frac{32}{s}\\\\ F(s)&=\frac{32}{s(s^2+12s+32)}\\&=32\cdot\frac{1}{s}\cdot\frac{1}{4}(\frac{1}{s+4}-\frac{1}{s+8})\\&=8\cdot\frac{1}{3}(\frac{1}{s}-\frac{1}{s+4})-8\cdot\frac{1}{7}(\frac{1}{s}-\frac{1}{s+8})\\\\\Rightarrow y(t)&=\frac{8}{3}u(t)-\frac{8}{3}e^{-4t}u(t)-\frac{8}{7}u(t)+\frac{8}{7}e^{-8t}u(t)\\&=\frac{32}{21}u(t)-\frac{8}{3}e^{-4t}u(t)+\frac{8}{7}e^{-8t}u(t)\end{aligned}$$

> [!tip]- 裂项的求法
> $$F(s)=\frac{1}{s(s+2)^2}$$
> 裂项之后的结果为:
> $$F(s)=\frac{A}{s}+\frac{B}{s+2}+\frac{C}{(s+2)^2}$$
> 注意, 高次项裂项需要把低次项都写出来
> 
> 然后计算系数(对列项后的结果进行操作):
> $$\begin{aligned}\text{let $s=0$, we have: }A&=sF(s)\\&=\frac{s}{s(s+2)^2}\\&=\frac{1}{(s+2)^2}\\A&=\frac{1}{4}\\\\\text{let $s=-2$, we have: }C&=(s+2)^2F(s)\\&=\frac{1}{s}\\C&=-\frac{1}{2}\end{aligned}$$
> 对于$B$, 需要用求导的方式进行计算:
> $$\begin{aligned}\text{let $s=-2$, we have: }B&=[(s+2)^2F(s)]'\\&=-\frac{1}{s^2}\\B&=-\frac{1}{4}\end{aligned}$$

> [!example] 
> ![[EE160-Lec2-MathModels.pdf#page=11&rect=28,457,367,480]]
> $$\begin{aligned}\mathcal L[f(t)]=F(s+5)=\frac{1}{s+5}\end{aligned}$$
> 
> ![[EE160-Lec2-MathModels.pdf#page=11&rect=392,458,819,481]]
> $$\begin{aligned}F(s)&=\frac{10}{s(s+2)(s+3)^2}\\&=\frac{}{s}+\frac{}{s+2}+\frac{}{s+3}+\frac{}{(s+3)^2}\end{aligned}$$
> 注意, 高次项在裂项的时候需要使用重根, 不能省略$\frac{C}{s+3}$这一项

## Transfer Function

转移函数是一个线性时不变([[#Linear System|LTI]])的函数. 定义为: 在 **零初始化** 的状态下, 系统的输入量与输出量的[[#Laplace Transform]]之比:
$$G(s)=\frac{\mathcal L\{\text{Output}\}(s)}{\mathcal L\{\text{Input}\}(s)}$$

从微分方程转换:
1. 将两侧通过Laplace Transform转换成频域
2. 写成$G(s)=\frac{C(s)}{R(s)}=\frac{\cdots}{\cdots}$的形式
![[EE160-Lec2-MathModels.pdf#page=13&rect=30,99,825,477]]

> [!example]
> ![[EE160-Lec2-MathModels.pdf#page=14&rect=30,412,607,475]]
> $$G(s)=\frac{s^2+4s+3}{s^3+3s^2+7s+5}$$
> 
> ![[EE160-Lec2-MathModels.pdf#page=14&rect=31,275,602,352]]
> $$\frac{d^2c}{dt^2}+6\frac{dc}{dt}+2c=2\frac{dr}{dt}+r$$
> 
> ![[EE160-Lec2-MathModels.pdf#page=14&rect=32,144,526,215]]
> $$c(t)=\frac{1}{32}-\frac{1}{16}e^{-4t}+\frac{1}{32}e^{-8t}$$

## System Examples

对于电路系统:
![[EE160-Lec2-MathModels.pdf#page=16&rect=17,111,828,488]]

一个RLC振荡电路 [[Electric Circuits#RC Circuits]] [[Electric Circuits#RL Circuit]]

对于一个物理弹簧:
![[EE160-Lec2-MathModels.pdf#page=17&rect=9,132,790,480]]

电机转子:
![[EE160-Lec2-MathModels.pdf#page=18&rect=25,83,826,486]]

## State Space Model

状态: $x$, 一个线性无关的向量

SSM将整个系统的所有的方程, 整理成了两个部分:
- 状态方程: $\overset{\cdot}{x}=\mathbf{A}x(t)+\mathbf{B}u(t)$
	- 状态的变化速度 = 物理规律$\times$当前的状态$+$外部影响力$\times$外部输入
- 输出: $y=\mathbf{C}x(t)+\mathbf{D}u(t)$
	- 测量的结果 = 观测能力$\times$当前的状态$+$外部对测量值的影响力$\times$外部输入

其中:
- $x(t)$是状态向量
- $\overset{\cdot}{x}(t)$是一阶导数
- $y$是输出向量
- $u$是输入向量, 或者说control vector
- $\mathbf{A}$是系统矩阵
- $\mathbf{B}$是输入矩阵
- $\mathbf{C}$是输出矩阵
- $\mathbf{D}$是前馈矩阵

![[EE160-Lec2-MathModels.pdf#page=25&rect=16,299,410,445]]
$$\overset{\cdot}{x}=\begin{bmatrix}\frac{1}{C_1}&\frac{1}{C_1}&-\frac{1}{C_1}\\-\frac{1}{L}&0&0\\\frac{1}{C_2}&0&-\frac{1}{C_2}\end{bmatrix}\cdot x+\begin{bmatrix}0\\1\\0\end{bmatrix}\cdot v_i(t)$$
$$y=\begin{bmatrix}0&0&1\end{bmatrix}x$$

![[EE160-Lec2-MathModels.pdf#page=25&rect=435,340,812,442]]
$$\overset{\cdot}{z}=\begin{bmatrix}0&1&0&0&0&0\\-1&-1&0&1&0&0\\0&0&0&1&0&0\\0&1&-1&-1&1&0\\0&0&0&0&1&0\\0&0&1&0&-1&-1\end{bmatrix}\cdot z+\begin{bmatrix}0\\1\\0\\0\\0\\0\end{bmatrix}\cdot f(t)$$
$$y=\begin{bmatrix}0&0&0&0&1&0\end{bmatrix}z$$
$$\text{where: }z=\begin{bmatrix}x_1&\overset{\cdot}{x}_1&x_2&\overset{\cdot}{x}_2&x_3&\overset{\cdot}{x}_3&\end{bmatrix}^\top$$

### O.D.E to State Space Model

原始O.D.E方程:
$$\frac{d^ny}{dt^n}+a_{n-1}\frac{d^{n-1}y}{dt^{n-1}}+\cdots+a_1\frac{dy}{dt}+a_0y=b_0u$$

首先定义: $x_1=y$, $x_2=\frac{dy}{dt}$, $\cdots$, $x_n=\frac{d^{n-1}y}{dt^{n-1}}$

有:

则SSM: $\dot x=Ax+Bu$ 可以转换成:
$$\begin{bmatrix}\dot x_1\\\dot x_2\\\vdots\\\dot x_n\end{bmatrix}=A\begin{bmatrix}x_1\\x_2\\\vdots\\x_n\end{bmatrix}+Bu$$

由于$\dot x_1=x_2$, $\dot x_{m-1}=x_m$, 则A的上部分为:
$$\begin{bmatrix}0&1&0&\cdots&0\\0&0&1&\cdots&0\\&&\vdots\\0&0&0&\cdots&1\\?&?&?&\cdots&?\end{bmatrix}$$
根据原始的O.D.E, 有: $\dot x_n+a_{n-1}x_n+\cdots+a_0x_1=b_0u$, 因此$\dot x_n=-a_{n-1}x_n-\cdots-a_0x_1+b_0u$, 因此完整的$A$为:
$$\begin{bmatrix}0&1&0&\cdots&0\\0&0&1&\cdots&0\\&&\vdots\\0&0&0&\cdots&0\\-a_0&-a_1&-a_2&\cdots&-a_{n-1}\end{bmatrix}$$
完整的$B$为:
$$\begin{bmatrix}0\\0\\\vdots\\b_0\end{bmatrix}$$

因此, 状态方程为:
![[EE160-Lec2-MathModels.pdf#page=26&rect=403,172,816,299|397]]

输出为$y$, 就是$x_1$. 则最终的输出方程为:
![[EE160-Lec2-MathModels.pdf#page=26&rect=437,87,583,171|215]]

### Transfer Function to State Space Model

首先, 将转移函数转换成O.D.E, 然后使用[[#O.D.E to State Space Model]].

对于分子不是常数的转移函数, 引入中间变量.

假设转移函数为$\frac{Y(s)}{U(s)}=\frac{b_{n-1}s^{n-1}+\cdots+b_1s+b_0}{s^n+a_{n-1}s^{n-1}+\cdots+a_1s+a_0}$
1. 引入中间变量$X(s)$, 使得$\frac{X(s)}{U(s)}=\frac{1}{s^n+a_{n-1}s^{n-1}+\cdots+a_1s+a_0}$, $\frac{Y(s)}{X(s)}=b_{n-1}s^{n-1}+\cdots+b_1s+b_0$
2. 构造$$A=\begin{bmatrix}0&1&0&\cdots&0\\0&0&1&\cdots&0\\&&\vdots\\0&0&0&\cdots&1\\-a_0&-a_1&-a_2&\cdots&-a_{n-1}\end{bmatrix},B=\begin{bmatrix}0\\0\\\vdots\\0\\1\end{bmatrix}$$
3. 构造$C$矩阵. 频域的输出为$Y(s)=b_0\cdot X(s)+b_1\cdot sX(s)+\cdots+b_{n-1}\cdot s^{n-1}X(s)$. 因此, 构建矩阵$$C=\begin{bmatrix}b_0&b_1&\cdots&b_{n-1}\end{bmatrix}$$
4. 矩阵$D$依然为0

对于分子分母同幂次的转移方程, 需要构建矩阵$D$. 步骤为:
1. 将转移函数写成如下形式:$$G(s)=\frac{Y(s)}{U(s)}=\beta+\frac{b_{n-1}s^{n-1}+\cdots+b_1s+b_0}{s^n+a_{n-1}s^{n-1}+\cdots+a_1s+a_0}$$
2. 对于后面的真分式, 使用前面的方法获取矩阵$A$, $B$, $C$:$$A=\begin{bmatrix}0&1&0&\cdots&0\\0&0&1&\cdots&0\\&&\vdots\\0&0&0&\cdots&1\\-a_0&-a_1&-a_2&\cdots&-a_{n-1}\end{bmatrix},B=\begin{bmatrix}0\\0\\\vdots\\0\\1\end{bmatrix},C=\begin{bmatrix}b_0&b_1&\cdots&b_{n-1}\end{bmatrix}$$
3. 矩阵$D$为一个常数$D=\begin{bmatrix}\beta\end{bmatrix}$


> [!example]-
> ![[EE160-Lec2-MathModels.pdf#page=27&rect=25,89,353,420]]

### State Space Model to Transfer Function

假设已知:
$$\dot X=AX+BU,Y=CX+DU$$

结论为: 转移函数为
$$T(s)=\frac{Y(s)}{U(s)}=C(sI-A)^{-1}B+D$$

计算矩阵的逆的方法:
$$(sI-A)^{-1}=\frac{\text{adj}(sI-A)}{\det(sI-A)}$$
$\text{adj}$的结果仍然是一个矩阵, $\det$的结果是一个scalar. 最终的结果应该是一个矩阵, shape和$A$相同.

$\text{adj(A)}$的算法为:
![[EE160-Lec2-MathModels.pdf#page=31&rect=25,99,621,210]]


> [!example]+ 
> ![[EE160-Lec2-MathModels.pdf#page=32&rect=179,343,616,444]]
> $$sI-A=\begin{bmatrix}s+4&1.5\\-4&s\end{bmatrix}$$
> $$adj(sI-A)=\begin{bmatrix}s&-1.5\\4&s+4\end{bmatrix}$$
> $$det(sI-A)=s(s+4)+6$$
> $$(sI-A)^{-1}=\frac{ajd(sI-A)}{det(sI-A)}=\frac{\begin{bmatrix}s&-1.5\\4&s+4\end{bmatrix}}{s^2+4s+6}$$
> $$T(s)=\begin{bmatrix}1.5&0.625\end{bmatrix}\frac{\begin{bmatrix}s&-1.5\\4&s+4\end{bmatrix}}{s^2+4s+6}\begin{bmatrix}2\\0\end{bmatrix}=\frac{3s+5}{s^2+4s+6}$$

### Diagonal State Space Repr

> [!note] 引入: 变量的变换
> 
> 对于一个系统而言, SSM不是唯一的. 将变量通过Transform矩阵转换到另一个变量, SSM也会随之改变.
> 
> 如, 令$Z=PX$, 那么SSM变成了:
> $$\dot z=P^{-1}APz+P^{-1}Bu$$
> $$y=CPz+Du$$

使用对角状态空间表达的原因是解耦和, 让变量对最终结果的输出相互独立.

如果没有对角化, 那么$\dot x_1$可能依赖于$x_1,x_2,\cdots$. 对角化之后, $\dot z_1$只和$z_1$以及$u$有关

> [!tip]- 矩阵对角化
> 使用[[LinearAlgebra#Eigenvector|特征向量]]进行矩阵对角化处理:
> $$\det(\lambda I-A)=0$$
> 计算得到所有的特征值. 然后计算特征向量:
> $$A\begin{bmatrix}x_1\\\vdots\\x_n\end{bmatrix}=\lambda_i\begin{bmatrix}x_1\\\vdots\\x_n\end{bmatrix}$$
> 所有的特征向量组成特征矩阵:
> $$P=\begin{bmatrix}x_{11}&\cdots&x_{1n}\\&\vdots\\x_{n1}&\cdots&x_{nn}\end{bmatrix}$$
> 
> 然后对角化矩阵$$\text{Diag}(A)=P^{-1}AP$$

> [!example] 
> ![[EE160-Lec2-MathModels.pdf#page=35&rect=9,349,501,445|443]]
> 
> Solution:
> ![[EE160-Lec2-MathModels.pdf#page=35&rect=672,245,839,335|135]]
> ![[EE160-Lec2-MathModels.pdf#page=35&rect=35,95,783,232|533]]
> ![[EE160-Lec2-MathModels.pdf#page=35&rect=525,350,835,467|279]]
> ![[EE160-Lec2-MathModels.pdf#page=35&rect=496,250,668,331|213]]
> 使用[[#State Space Model to Transfer Function|之前]]的解法:
> $$\begin{aligned}Y&=C(sI-A)^{-1}Bu\\&=\begin{bmatrix}2&3\end{bmatrix}\begin{bmatrix}s+3&-1\\-1&s+3\end{bmatrix}^{-1}\begin{bmatrix}1\\2\end{bmatrix}u\\&=\begin{bmatrix}2&3\end{bmatrix}\frac{\begin{bmatrix}s+3&1\\1&s+3\end{bmatrix}}{s^2+6s+8}\begin{bmatrix}1\\2\end{bmatrix}u\\&=\frac{8s+31}{s^2+6s+8}u=\left(\frac{}{s+2}+\frac{}{s+4}\right)u\end{aligned}$$
> 

> [!example]- 
> ![[EE160-Lec2-MathModels.pdf#page=36&rect=45,208,410,468]]
> ![[EE160-Lec2-MathModels.pdf#page=36&rect=433,341,820,470]]

## Solution of the State Space Model

根据SSM的公式, 求解时域的表达式.

假设SSM的状态方程为:
$$\dot x=Ax+Bu$$

最终的结果为:
![[EE160-Lec2-MathModels.pdf#page=38&rect=321,177,767,361]]
其中:
![[EE160-Lec2-MathModels.pdf#page=38&rect=425,99,806,142]]

## Block Diagram

框图:
![[EE160-Lec2-MathModels.pdf#page=40&rect=56,294,572,482]]
信号都是在频域中的.
- 箭头指向某一个框(System), 然后得到输出, 这个过程是做了乘法(以上图中的b为例): $C(s)=R(s)G(s)$
- 箭头指向一个圈(或者一个operator), 指的是按照符号进行相加减, 然后得到输出(如上图中的c)

串联: 频域相乘:
![[EE160-Lec2-MathModels.pdf#page=40&rect=141,94,425,202]]
并联: 频域相加:
![[EE160-Lec2-MathModels.pdf#page=40&rect=427,96,730,271]]
反馈: 输出影响输入:
![[EE160-Lec2-MathModels.pdf#page=41&rect=518,173,782,315]]
等价于: ![[EE160-Lec2-MathModels.pdf#page=41&rect=581,105,720,150|135]]
### 化简

注意符号
- [[#Linear Time Invariant System|叠加原理(superposition)]]: ![[EE160-Lec2-MathModels.pdf#page=42&rect=493,178,789,419]]
- 齐次原理: ![[EE160-Lec2-MathModels.pdf#page=42&rect=145,219,397,418]]

> [!example] 
> ![[EE160-Lec2-MathModels.pdf#page=43&rect=286,209,828,478]]
> 
> Solution: 化简框图, 得:
> ![[EE160-Lec2-MathModels.pdf#page=44&rect=256,98,541,474]]

# Lecture 03
> [!note]- slide
> ![[EE160-Lec3-StabilityAndPerformance.pdf]]

## Poles and Zeros

![[EE160-Lec3-StabilityAndPerformance.pdf#page=3&rect=280,93,820,434]]

响应:
- 强迫响应([[EE160-Lec3-StabilityAndPerformance.pdf#page=4&selection=6,21,6,36|force response]]): 由于外界输入引起的响应 (输入函数的极点)
- 自然响应([[EE160-Lec3-StabilityAndPerformance.pdf#page=4&selection=10,41,10,49|natural response]]): 由于系统本身的性质而产生的响应 (转移函数的极点)

极点 $p = \sigma + j\omega$ 的位置决定了 $e^{(\sigma + j\omega)t} = e^{\sigma t} (\cos \omega t + j \sin \omega t)$ 的形态：

| 极点的位置 (在 s 平面上) | 数学形式 ($p$)                | 自然响应的时间函数形式 ($e^{pt}$)                | 物理表现 (参考 [[EE160-Lec3-StabilityAndPerformance.pdf#page=8&rect=329,60,698,536\|Lecture 3, Page 8]]) |
| :-------------- | :------------------------ | :------------------------------------ | :------------------------------------------------------------------------------------------------- |
| **负实轴上** (左半平面) | $p = -\sigma$             | $e^{-\sigma t}$                       | **单调衰减**。系统受到冲击后平滑地回到零，不震荡（过阻尼）。                                                                   |
| **原点**          | $p = 0$                   | $e^{0t} = 1$ (阶跃)                     | **常数/积分**。系统保持当前状态不恢复。                                                                             |
| **正实轴上** (右半平面) | $p = +\sigma$             | $e^{+\sigma t}$                       | **单调发散**。系统不稳定，数值趋向无穷大。                                                                            |
| **左半平面共轭复数**    | $p = -\sigma \pm j\omega$ | $e^{-\sigma t} \cos(\omega t + \phi)$ | **衰减震荡**。系统会震荡，但振幅随 $e^{-\sigma t}$ 逐渐减小，最终趋于稳定（欠阻尼）。                                              |
| **虚轴上共轭复数**     | $p = 0 \pm j\omega$       | $\cos(\omega t + \phi)$               | **等幅震荡**。系统像永动机一样不停震荡，不衰减也不发散（临界稳定）。                                                               |
| **右半平面共轭复数**    | $p = +\sigma \pm j\omega$ | $e^{+\sigma t} \cos(\omega t + \phi)$ | **发散震荡**。震荡幅度越来越大，系统不稳定。                                                                           |

### Typical System

一阶系统只有一个极点, 通常是一个实数.

二阶系统有两个极点, 但是这两个极点不一定是什么, 可能是共轭的也可能是相同的.
- Natural frequency $\omega_n$
- Damping ratio $\zeta$
- 假设传递函数为$G(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_ns+\omega_n^2}$

![[EE160-Lec3-StabilityAndPerformance.pdf#page=9&rect=374,89,715,373]]

#### Performance Metrics

指示系统的性能指标.
- 上升时间$T_r$: 指示反应速度
- 峰值时间$T_p$: 上升到最大值的时间
- 超调量$\%OS$ overshoot: 冲过头了多少
- 调节时间$T_s$: 需要多久稳定下来

$$T_p=\frac{pi}{\omega_n\sqrt{1-\zeta^2}}=\frac{\pi}{\omega_d}$$
$$T_s=\frac{4}{\zeta\omega_n}=\frac{4}{\sigma_d}$$
$$\%OS=e^{-(\frac{\zeta\pi}{\sqrt{1-\zeta^2}})}\times100\%$$



## Routh Table

![[EE160-Lec3-StabilityAndPerformance.pdf#page=19]]

## Routh-Hurwitz Criterion
劳斯判据

%% TODO %%

## Steady State Error
稳态误差($e_2(\infty)$)

![[EE160-Lec3-StabilityAndPerformance.pdf#page=28&rect=613,45,943,460|278]]


