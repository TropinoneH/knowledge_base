---
type: lecture note
tags:
  - lecture
  - math
teacher:
  - 蒋易凡
ClassID: PHYS1181
done: true
---
# Lecture 01

Introduce

# Lecture 02

> [!note]- slide
> ![[PHYS1181-Lec2-Kinematics.pdf]]

# Lecture 03

> [!note]- slide
> ![[PHYS1181-Lec3-Dynamics.pdf]]

# Lecture 04

> [!note]- slide
> ![[PHYS1181-Lec4-Energy.pdf]]

# Lecture 05

> [!note]- slide
> ![[PHYS1181-Lec5-Momentum.pdf]]

# Lecture 06

> [!note]- slide
> ![[PHYS1181-Lec6-RigidBody.pdf]]

# Lecture 07

> [!note]- slide
> ![[PHYS1181-Lec7-stress.pdf]]

# Lecture 08

> [!note]- slide
> ![[PHYS1181-Lec8-Fluids.pdf]]

# Lecture 09

> [!note]- slide
> ![[PHYS1181-Lec9-PeriodicMotion.pdf]]

周期运动: 力的方向指向平衡点, 并且力的大小和距离相关(不一定是线性关系)

简谐运动: 周期运动的一种, 但是力的大小和距离线性相关
$$F_x=-kx$$
$$a_x=\frac{d^2x}{dt^2}=-\frac{k}{m}x $$

求解:
$$F=m\frac{d^2x}{dt^2}=-kx$$
令$\omega^2=\frac{k}{m}$, 有:
$$\frac{d^2x}{dt^2}=-\omega^2x\Rightarrow x=A\cos(\omega t+\phi)$$
- 周期 $T=\frac{2\pi}{\omega}=2\pi\sqrt{\frac{m}{k}}$
- 频率 $f=\frac{1}{T}$
- 角频率 $2\pi f=\omega$

对于初相位和振幅:
- 根据题干得出初始速度和初始相位, 然后在$t=0$时列方程:
  $$\begin{aligned}x_0&=A\cos(\phi)\\v_0&=-\omega A\sin(\phi)\end{aligned}$$
- 求解振幅: 两种方法
	- 如果有能量相关的信息, 可以使用能量守恒, 在振幅$x=\pm A$处速度为0, 势能最大
	- 如果有速度, 位移, 角频率等信息, 可以使用数学公式法: $A=\sqrt{x_0^2+(\frac{v_0}{\omega})^2}$
- 求初相位: $\tan\phi=-\frac{v_0}{\omega x_0}$

## 圆周运动

简谐运动的特殊形式
$$\vec a=-\vec r\omega^2\left\{\begin{aligned}a_x&=-r\omega^2\cos(\theta)=-\omega^2x\\a_y&=-r\omega^2\sin(\theta)=-\omega^2y\end{aligned}\right.$$
$$\vec r=r\hat e_r\left\{\begin{aligned}x&=r\cos(\theta)=r\cos(\omega t)\\y&=r\sin(\theta)=r\sin(\omega t)\end{aligned}\right.$$
$$\frac{d^2x}{dt^2}=-\frac{k}{m}x\Rightarrow\overset{..}{\vec r}=-\frac{k}{m}\vec r$$
可以先算$x$再算$y$最后整合$\vec r=(x,y)$, 用这种方式将圆周运动分解成两个直线的简谐运动

在计算圆周运动的时候, 没有真实存在的$k$, 有的只是一个等效的数值$k=m\omega^2$, 根据向心力计算: 
$$\begin{aligned}F_x&=-F_{\text{向心力}}\cos\theta=-m\omega^2R\cdot\frac{x}{R}=-m\omega^2x\\&=-kx\end{aligned}$$

## 简谐振动的动力学模型

![[PHYS1181-Lec9-PeriodicMotion.pdf#page=9&rect=31,101,929,325]]
- 第一种是最常见最基本的形式
- 第二种常见于给定初速度和初始位置的时候可以快速使用, 因为$t=0$时$A'=x_0$, $B'=\frac{v_0}{\omega}$可以快速得到
- 第三种用于后面的阻尼振动和受迫振动, 因为三角函数求导比较困难

![[PHYS1181-Lec9-PeriodicMotion.pdf#page=10&rect=42,51,947,436]]

## 能量

![[PHYS1181-Lec9-PeriodicMotion.pdf#page=11&rect=83,42,765,419]]

## 角振动, 单摆, 刚体振动

一般而言都会给出扭转系数$\kappa$用于计算扭矩$\tau=\kappa\theta$

| 比较维度                         | 1. 简谐振动 (原型)                                                                      | 2. 角振动 (手表/扭摆)                                                                      | 3. 单摆 (Simple Pendulum)                                                                 | 4. 刚体复摆 (Physical Pendulum)                                                               |
| :--------------------------- | :-------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **典型场景**                     | 弹簧连着滑块                                                                            | 手表摆轮、悬挂的圆盘                                                                          | 细绳挂一个质点                                                                                 | 任意形状的物体挂在钉子上                                                                              |
| **PPT 页码**                   | [[PHYS1181-Lec9-PeriodicMotion.pdf#page=5\|PHYS1181-Lec9-PeriodicMotion, page 5]] | [[PHYS1181-Lec9-PeriodicMotion.pdf#page=13\|PHYS1181-Lec9-PeriodicMotion, page 13]] | [[PHYS1181-Lec9-PeriodicMotion.pdf#page=14\|PHYS1181-Lec9-PeriodicMotion, page 14]]     | [[PHYS1181-Lec9-PeriodicMotion.pdf#page=15\|PHYS1181-Lec9-PeriodicMotion, page 15]]       |
| **运动变量**                     | 位移 $x$ (米)                                                                        | 角度 $\theta$ (弧度)                                                                    | 角度 $\theta$ (弧度)                                                                        | 角度 $\theta$ (弧度)                                                                          |
| **惯性项**                      | 质量 $m$                                                                            | 转动惯量 $I$                                                                            | 转动惯量 $I = mL^2$ <br>(质点绕轴转)                                                             | 转动惯量 $I$ <br>(需通过形状计算)                                                                    |
| **恢复力/力矩**                   | **弹力** $F = -kx$                                                                  | **扭转力矩** $\tau = -\kappa\theta$                                                     | **重力力矩** $\tau = -mgL\sin\theta$                                                        | **重力力矩** $\tau = -mgr_c\sin\theta$                                                        |
| **微振动近似**<br>*(考试关键)*        | **不需要**<br>(本来就是线性的)                                                              | **不需要**<br>(本来就是线性的)                                                                | **需要！**<br>当 $\theta$ 很小时，$\sin\theta \approx \theta$<br>力矩变为 $\tau \approx -mgL\theta$ | **需要！**<br>当 $\theta$ 很小时，$\sin\theta \approx \theta$<br>力矩变为 $\tau \approx -mgr_c\theta$ |
| **等效"劲度系数"**<br>*(对应 k)*     | $k$                                                                               | $\kappa$ (扭转系数)                                                                     | $mgL$                                                                                   | $mgr_c$ <br>($r_c$是重心到轴的距离)                                                               |
| **动力学方程**                    | $\ddot{x} = -\frac{k}{m}x$                                                        | $\ddot{\theta} = -\frac{\kappa}{I}\theta$                                           | $\ddot{\theta} = -\frac{g}{L}\theta$                                                    | $\ddot{\theta} = -\frac{mgr_c}{I}\theta$                                                  |
| **角频率 $\omega$**<br>*(必背公式)* | $\sqrt{\frac{k}{m}}$                                                              | $\sqrt{\frac{\kappa}{I}}$                                                           | $\sqrt{\frac{g}{L}}$                                                                    | $\sqrt{\frac{mgr_c}{I}}$                                                                  |

## 阻尼震动


