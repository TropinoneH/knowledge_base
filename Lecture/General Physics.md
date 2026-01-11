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

> [!tip] 
> 可以参考[[Introduction to Control#Typical System]]里面对Damping的描述

阻力: $f=-\gamma v=-\gamma\frac{dx}{dt}$

新的动力学方程的形式:
$$\frac{d^2x}{dt^2}+2\delta\frac{dx}{dt}+\omega_0^2x=0$$
- 固有频率$\omega_0=\sqrt{\frac{k}{m}}$
- 阻尼系数$\delta=\frac{\gamma}{2m}$

此时, 位移的通解形式应该是:
$$x(t)=A_0e^{-\delta t}\cos(\omega't+\phi)$$
- 振幅会随着时间逐渐减小
- 半衰期 $e^{-\delta t}=\frac{1}{2}$
- 新的角频率 $\omega'=\sqrt{\omega_0^2-\delta^2}$

通解:
- 欠阻尼: $$e^{-\delta t}[A\cos\left(t\sqrt{\omega_0^2-\delta^2}\right)+B\sin\left(t\sqrt{\omega_0^2-\delta^2}\right)]$$
  对于欠阻尼而言, 求解A,B两个常数(利于初值和求导计算):
	- $A=x_0$
	- $B=\frac{v_0+\delta x_0}{\omega_d}$
- 临界阻尼: $$e^{-\delta t}(A+Bt)$$
- 过阻尼: $$e^{-\delta t}[Ae^{t\sqrt{\delta^2-\omega_0^2}}+Be^{-t\sqrt{\delta^2-\omega_0^2}}]$$



能量也会随着时间耗尽:
$$E(t)=E_0e^{-2\delta t}$$
摩擦力功率:
$$P=fv=-2m\delta v^2$$


为了定义一个指标指示“这东西能振多久”, 在$\delta$很小的情况下定义品质因素$Q$:
$$Q\approx\frac{\omega_0}{2\delta}$$

- 过阻尼 $\delta>\omega_0$ 在回到平衡点的过程中停下, 无法回到平衡点
- 临界阻尼 $\delta=\omega_0$ 刚好回到平衡点, 平衡点处速度为0
- 欠阻尼 $\delta<\omega_0$ 做减速周期运动, 在平衡点附近振动, 这个也是上面在求解的内容

# Lecture 10
> [!note]- slide
> ![[PHYS1181-Lec10-PeriodicMotion-2.pdf]]

## 受迫振动

一个谐振子有自己的振动节奏叫做固有频率$\omega_0$. 这个时候有一个外力推动(驱动力$F$), 这个力产生的频率为驱动频率$\omega$

最终的振动形式就是这两种力共同作用的结果:
$$\frac{d^2x}{dt^2}+2\delta\frac{dx}{dt}+\omega_0^2x=\frac{F_0}{m}\cos(\omega t)$$
其中, $F_0$是力的大小, $\omega$是力的频率, 组合起来是驱动力$F$

这就变成了一个非齐次的线性微分方程.

特解: $A\cos(\omega t+\phi)$
- $A=\frac{F_0}{m\sqrt{4\omega^2\delta^2+(\omega^2-\delta^2)^2}}$
- $\tan\phi=\frac{2\omega\delta}{\omega^2-\omega_0^2}$

完整解:
- 欠阻尼: $$e^{-\delta t}[A'\cos\left(t\sqrt{\omega_0^2-\delta^2}\right)+B'\sin\left(t\sqrt{\omega_0^2-\delta^2}\right)]+A\cos(\omega t+\phi)$$
- 临界阻尼: $$e^{-\delta t}(A'+B't)+A\cos(\omega t+\phi)$$
- 过阻尼: $$e^{-\delta t}[A'e^{t\sqrt{\delta^2-\omega_0^2}}+B'e^{-t\sqrt{\delta^2-\omega_0^2}}]+A\cos(\omega t+\phi)$$

其中, 这里面的$A\cos(\omega t+\phi)$就是前面特解的结果. 一般而言求解特解即可(在没有提到初始值的时候)

## 共振

共振是[[PHYS1181-Lec10-PeriodicMotion-2.pdf#page=9&selection=3,0,9,7|当策动力的频率接近于固有频率时，受迫振动的振幅达到最大值的现象]].

极大值应该在$\omega=\sqrt{\omega_0^2-2\delta^2}$的位置, 此时$A_{max}=\frac{F_0}{2m\delta\sqrt{\omega_0^2-\delta^2}}\approx\frac{F_0}{2m\delta\omega_0}$

## 复杂振动的合成

假设有:
$$\left\{\begin{aligned}x_1&=A_1\cos(\omega t+\phi_1)\\x_2&=A_2\cos(\omega t+\phi_2)\end{aligned}\right.$$
最终合成运动$x=x_1+x_2$

对于相同频率的简谐振动:
$$\left\{\begin{aligned}A&=\sqrt{A_1^2+A_2^2+2A_1A_2\cos(\phi_2-\phi_1)}\\\phi&=\arctan\frac{A_1\sin\phi_1+A_2\sin\phi_2}{A_1\cos\phi_1+A_2\cos\phi_2}\end{aligned}\right.$$

对于不同频率的简谐振动:

只关注同相位相同振幅且频率近似的两个简谐振动的叠加.

定义“拍”的频率: $f=|f_2-f_1|=\frac{|\omega_2-\omega_1|}{2\pi}$

这种情况下的合成方程为$x=2A\cos(2\pi\frac{f_2-f_1}{2}t)\cdot\cos(2\pi\frac{f_2+f_2}{2}t)$

# Lecture 11
> [!note]- slide
> ![[PHYS1181-Lec11-MechanicalWave.pdf]]

- 横波: 波的传递方向和振动方向是正交的
- 纵波: 波的传递方向和振动方向是一致的

- 行波: 波形一直在移动, 能看到波峰移动的方向
- 驻波: 波形看上去仅仅在原地上下振动, 看不出来波峰的移动方向 (这个通常是由于两个完全一样的波相向而行撞到一起导致的)

表达式:
$$y(x,t)=A\cos(\omega t-kx+\phi)$$
- $y$: 纵轴位移, $x$: 水平距离, $t$: 时间
- $A$: 振幅, $\omega$: 角频率, $\phi$: 初始相位
- $k$: 波数, 表示空间上的疏密程度 

- 周期 $T$, 频率 $f=\frac{1}{T}$, 角频率 $\omega=\frac{2\pi}{T}=2\pi f$, 这些是和质点的上下振动相关的值
- 波长 $\lambda=\frac{2\pi}{k}$, $k$是波数
- 波速 $u=\frac{\omega}{k}$ : 表示波峰传递的速度. 注意与波上质点上下运动的速度($v=y'$)做区分
- 如果用波长和波速去表示频率: $f=\frac{u}{\lambda}$, 但是数值应该和$f=\frac{1}{T}$是一样的. 因此通常是已知频率去求波长或者波速
- 使用微分方程的形式为(平面波的波动方程): $$\frac{\partial^2y}{\partial t^2}=u^2\frac{\partial^2y}{\partial x^2}$$

## 弦上横波

假设线密度为$\mu$, 张力$F$不变

微元法受力分析得到:
$$\frac{\partial^2y}{\partial t^2}=\frac{F}{\mu}\frac{\partial^2y}{\partial t^2}$$
$$\Rightarrow u=\sqrt{\frac{F}{u}}$$

波速只与介质(绳子)的材质以及张力有关, 与频率/振幅无关

对于声波, 也可以有类似的结论:
$$u=\sqrt{\frac{B}{\rho}}$$
- $B$: 体积模量
- $\rho$: 密度

对于固体长棒:
$$u=\sqrt{\frac{E}{\rho}}$$
- $E$: 杨氏模量

理想气体中:
$$u=\sqrt{\frac{\gamma P}{\rho}}=\sqrt{\frac{\gamma RT}{M}}$$
- 利用理想气体公式$pV=nRT$转换. 空气中的声速只和温度有关, 与压强无关

### 能量

- 动能: 绳子上质点上下振动, 与速度的平方成正比 $(\frac{\partial y}{\partial t})^2$
- 势能: 绳子发生形变产生的弹性势能, 与对x轴的偏导成正比 $(\frac{\partial y}{\partial x})^2$

对于平面的简谐波(行波), 有$\Delta E_k=\Delta E_p$, $\Delta E=\mu\Delta x\omega^2A^2\sin^2(\omega t-kx)$, $\mu$是线密度

即, 对于行波, 在任意时刻动能和势能都相等. 注意这里的势能是与绳子的拉长量有关, 波过来的时候会让绳子倾斜, 倾斜会导致绳子拉长, 这会产生弹性势能

![[PHYS1181-Lec11-MechanicalWave.pdf#page=27&rect=62,53,800,427]]

## 惠更斯原理

衍射: $a\approx\lambda$, $a$是缝的宽度, $\lambda$是波长
![[PHYS1181-Lec11-MechanicalWave.pdf#page=34&rect=41,48,958,510]]
## 驻波

形成条件: 两列**振幅相同、频率相同、振动方向相同**的简谐波，在同一直线上**相向传播**（面对面撞在一起）时，叠加形成驻波

方程:
$$y=2A\cos(kx)\cos(\omega t)$$
做振幅为$2A\cos(kx)$的简谐运动, 角频率为$\omega$

波节(node): 永远不振动的点
波腹(antinode): 振动最剧烈的点

相邻波节和相邻波腹之间的距离都是半波长$\frac{\lambda}{2}$, 相邻的波节和波腹之间的距离为$\frac{\lambda}{4}$

简正模式(normal mode): 两头固定, 找频率:
- 固定两头, 那么只能有整数个半波长
- $L=n\cdot\frac{\lambda}{2}$
- $f=\frac{u}{\lambda}=\frac{nu}{2L}$

## 多普勒效应

波源和接收器均运动:
$$f_L=\frac{v+v_L\cos\theta_L}{v-v_s\cos\theta_s}f_s$$
- $v$是波速, $v_L$是接收器速度, $v_s$是波源速度
- $f_L$是接收器在多普勒效应下的频率
- $f_s$是波源的原始频率

# Lecture 12-14
> [!note]- slides
> ![[PHYS1181-Lec12-Thermodynamics1.pdf]]
> ![[PHYS1181-Lec13-Thermodynamics2.pdf]]
> ![[PHYS1181-Lec14-Thermodynamics3.pdf]]

热学

理想气体方程:
$$pV=nRT$$
理想气体的平均动能:
$$\bar{E_k}=\frac{3}{2}kT=\frac{3nRT}{2N}$$
其中, $k=\frac{R}{N_A}=1.381\times10^{-23}$ J/K ^e2447f

### 平衡态

必要条件:
- 力学平衡: 压强相同
- 热平衡: 冷热程度必须一致, 没有热量流动
- 质量平衡: 又叫做化学平衡, 可逆反应达到平衡

> [!example]- 
> ![[PHYS1181-Lec13-Thermodynamics2.pdf#page=8&rect=45,120,907,347]]
> 不平衡, 因为有热量流动, 从沸水流向冰水. 虽然温度不变但是仍然有热量流动

### 态函数

定义: [[PHYS1181-Lec13-Thermodynamics2.pdf#page=10&selection=2,0,9,1|系统其它（非独立）宏观物理量S都是系统状态参量的函数，称为态函数]]

核心性质：只要起点和终点确定了，无论中间经历了什么过程（路径），其变化量都是固定的

注意, 宏观物体的动能不是态函数, 但是理想气体的分子动能是态函数

### 状态方程

规定一个系统一些热力学参量需要满足的函数关系的方程. 如, $pV=nRT$, 可以认为是$f(p,V,T)$, 在确定$p,V,T$的两者之后, 第三者是固定的, 不是任意的.

### 混合理想气体状态方程

$$\sum p_iV=\sum v_iRT$$

如果要求分压, 可以先根据分子数算百分比, 然后总压$\times$百分比就是分压

## 功和热量
### 功

做功: $W=F\cdot dx$, 注意力的方向和位移的方向

外力对系统做功为$W=-\int_{V_1}^{V_2}pdV$

![[PHYS1181-Lec13-Thermodynamics2.pdf#page=24&rect=78,214,871,450]]
![[PHYS1181-Lec13-Thermodynamics2.pdf#page=24&rect=75,29,871,210]]

系统做功:
1. 对于p-T或者V-T图, 需要先转换成p-V图
2. 分情况算面积:
	1. 如果是单过程一条线, 那么算投影的面积(从起点到终点的p-V线投影到V轴上的面积, 一个近似梯形的图形, 但是斜边是一个曲线)
		1. 如果是等容变化(一条竖线), 那么做功为0
		2. 如果是等压变化(一条水平横线), 那么做功为$p\times|V_2-V_1|$
		3. 如果是一个斜线的变化, 那么做功为梯形的面积. 注意方向, 起点和终点的容积大小
		4. 如果是等温或者绝热过程, 只能使用积分公式去算: 等温$nRT\ln(\frac{V_2}{V_1})$, 绝热$\frac{p_2V_2-p_1V_1}{\gamma-1}$
	2. 如果是循环过程, 围成了一个闭合图形, 那么计算这个闭合图形的面积
3. 确定正负号
	1. 体积变大: 箭头向右, 外界做负功$W<0$
	2. 体积变小: 箭头向左, 外界做正功$W>0$
	3. 顺时针循环: 外界做负功$W<0$, 这个就是热机的热循环图像
	4. 逆时针循环: 外界做正功$W>0$, 这个是制冷剂的热循环图像

### 热量

热容$C=\frac{dQ}{dT}$, 可以延伸定义比热容$c=\frac{C}{m}$和摩尔热容量$C_m$, 这些都不是态函数

热量:
$$Q=\int_{T_i}^{T_f}CdT=\int_{T_i}^{T_f}mcdT$$

虽然功和热量都不是态函数, 但是他们的总和 [[PHYS1181-Lec13-Thermodynamics2.pdf#page=30&selection=0,0,0,6|内能]] 是态函数

- 内能是一种宏观热力学物理量
- 内能是一个相对量,即可选取某参考态的内能为0
- 热学中的内能不包括物体整体运动的机械能(柯尼希定理)
- 内能概念可以推广到非平衡态系统

### 热力学第一定律

$\Delta U=Q+W$

**内能的增加量** 等于 **外界对系统做的功** 以及 **从外界吸收的热量** 的总和
- 温度升高时$\Delta U>0$
- 吸收热量时$Q>0$
- 外界对系统做功时$W>0$

读图做题:
1. 根据$T=\frac{pV}{nR}$算初始和最终状态的温度
2. 计算内能$\Delta U=\nu C_{V,m}(T_2-T_1)$, 这里的$\nu$是气体摩尔数. 无论是等压还是等容, 都可以用这个公式计算内能
3. 根据图像计算做功$W$
4. 除非说时绝热系统$Q=0$, 其他情况很难从图中直接得出, 因此使用第一定律倒推$Q=\Delta U-W$

定义焓: $H=U+pV$, 常见形式为$\Delta H=\Delta(U+pV)$, 这个是态函数

## 热力学第二定律

### 热机效率

注意符号恒为正:
$$\eta=\frac{W'}{Q_1}=\frac{Q_1-Q_2}{Q_1}$$

卡诺热机效率:
$$\eta=1-\frac{T_2}{T_1}$$
- $T_1$是热源的温度, $T_2$是释放热量(排废气)的地方的温度
- 热机效率永远不可能达到$100\%$

制冷剂制冷系数:$\varepsilon=\frac{Q_2}{W}=\frac{Q_2}{Q_1-Q_2}$, 卡诺制冷机的制冷系数: $\eta=\frac{T_2}{T_1-T_2}$

### 熵

用于判断是否是可逆的

定义:
$$dS=\frac{dQ_{rev}}{T}$$
结合第一定律:
$$TdS=dU+pdV$$

对于任意系统, 有$dS\geq\frac{dQ}{T}$, 等号成立的时候为可逆

因此, 对于孤立系统内发生的一切实际过程都是使系统熵增的过程.

# Lecture 15
> [!note]- slide
> ![[PHYS1181-Lec15-molecules.pdf]]

通过统计学对分子进行估计

平均速度: $\bar {v_x}=\frac{\sum v_{xi}}{N}$, 均方速率: $\bar{v_x^2}=\frac{\sum v_{xi}^2}{N}$, 均方根速率: $\sqrt{\bar{v_x^2}}=\sqrt{\frac{\sum v_{xi}^2}{N}}$

分子的平均动能: $\bar\varepsilon_k=\frac{1}{2}m\bar{v^2}=\frac{3}{2}kT$, 考虑这里: [[#^e2447f]]

因此, $\sqrt{\bar{v^2}}=\sqrt{\frac{3RT}{M}}$

# Lecture 16
> [!note]- slide
> ![[PHYS1181-Lec16- Relativity.pdf]]

相对论

洛伦兹变换:
$$x=ut+x'\sqrt{\frac{1-u^2}{c^2}}$$
- 在S参考系中$t$时刻之后, 在S'参考系的x'处的点, 在S参考系中的位置

S参考系$\rightarrow$S'参考系:
- $x'=\gamma(x-ut)$
- $y'=y$
- $z'=z$
- $t'=\gamma(t-\frac{\beta}{c}x)$

S'参考系$\rightarrow$S参考系
- $x=\gamma(x'+ut')$
- $y=y'$
- $z=z'$
- $t=\gamma(t'+\frac{\beta}{c}x')$

其中$\beta\equiv\frac{u}{c},\gamma\equiv\frac{1}{\sqrt{1-\beta^2}}$

“同时”的相对性:
![[PHYS1181-Lec16- Relativity.pdf#page=15&rect=668,122,945,345]]

时钟变慢:
![[PHYS1181-Lec16- Relativity.pdf#page=17&rect=12,38,954,507]]

尺缩效应:
![[PHYS1181-Lec16- Relativity.pdf#page=21&rect=31,55,930,519]]

### 相对论动力学

![[PHYS1181-Lec16- Relativity.pdf#page=37&rect=44,36,522,390]]

![[PHYS1181-Lec16- Relativity.pdf#page=39&rect=42,67,935,518]]

相对论质量:
![[PHYS1181-Lec16- Relativity.pdf#page=40&rect=48,96,938,322]]

![[PHYS1181-Lec16- Relativity.pdf#page=41&rect=38,89,881,522]]

### 质能关系

$$E=mc^2$$

