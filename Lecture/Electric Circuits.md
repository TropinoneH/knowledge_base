---
type: lecture note
tags:
  - lecture
  - electric
teacher: 邹新波
ClassID: EE111
done: false
---
# Lecture 01
> [!note]- slide
> ![[EE111-F25Lec1-Introduction-&-Circuit-Terminology.pdf]]

exercise: 
![[EE111-F25Lec1-Introduction-&-Circuit-Terminology.pdf#page=32&rect=54,91,634,425|EE111-F25Lec1-Introduction-&-Circuit-Terminology, p.32]]

计算功率:

$p_2$, $p_3$计算较为简单, 已有电压和电流, 是[[EE111-F25Lec1-Introduction-&-Circuit-Terminology.pdf#page=22|Passive Sign Convention]], 直接计算:
$$p_2=5A\times12V=50W$$
$$p_3=6A\times8V=48W$$
出入电流应该相等, 因此$p_1$可以计算. 但是注意对于[[EE111-F25Lec1-Introduction-&-Circuit-Terminology.pdf#page=19|电压源]]/[[EE111-F25Lec1-Introduction-&-Circuit-Terminology.pdf#page=20|电流源]]需要看成反向, 因此加负号:
$$p_1=-5A\times20V=-100W$$
并联电路的电压相等, 因此$p_4$可以计算:
$$p_4=-1A\times8V=-8W$$

# Lecture 02
> [!note]- slide
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf]]

## Kirchhoff's Law
示例:
> [!PDF|blue] [[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=4&selection=9,1,16,18&color=blue|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4]]
> > 𝑏 – number of branches
> 
> $b=5$
> 
> 有五个组件, 每个组件作为一个branch

> [!PDF|blue] [[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=4&selection=18,0,24,15&color=blue|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4]]
> > 𝑛 – number of nodes
> 
> $n=3$
> 
> 看上去有4个交点, 但是实际上这里的两个交点可以合并, 看成一个交点:
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=4&rect=141,248,303,343&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4|100]]
> 
> 因此实际上是3个node

> [!PDF|blue] [[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=4&selection=26,0,32,15&color=blue|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4]]
> > l – number of loops
> 
> $l=6$
> 
> 一共有三个小回路, 两个中回路, 一个大回路. 全部回路均计算

### Kirchhoff's Current Law (KCL)

![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=7&rect=166,74,406,275&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.7|201]]
有$i_2$, $i_5$的电流流出, 可以看作是有$-i_2-i_5$的电流流入. 由Kirchhoff's Laws得知:
$$i_1+i_3+i_4-i_2-i_5=0$$
> [!info]- proof
> 电荷守恒: 在一定时间内流入和流出的电荷相等:
> $$\int(i_1+i_3+i_4)dt=\int(i_2+i_5)dt$$

注意, 实际上做题的时候可能完全未知电流的方向, 但是这个无关紧要, 因为计算的结果含有符号. 因此如果结果为负数, 即为流向相反.

KCL中, 无需针对一个真实的"node", 可以针对一个黑盒. 这个黑盒内部无所谓是什么, 只要这个黑盒的流入流出电荷守恒即可:
![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=9&rect=366,108,588,291&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.9|173]]

$$i_1+i_2-i_3-i_4=0$$


| ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=10&rect=60,125,237,409&color=note\|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.10\|120]] | ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=10&rect=352,128,660,399&color=note\|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.10\|240]] |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| $i=50mA$, 因为输入输出相等                                                                                                                            | $$-i+5\mu A+2\mu A=0\Rightarrow i=7\mu A$$                                                                                                     |

### Kirchhoff's Votage Law (KVL)

> [!note] Definition
> 一个Loop的电压和为零

> [!note]- proof
> 取两个相近的中间没有其他branch(或者元器件)的点.
> 
> 走最近的路径: 两点之间没有元器件, 可以认为$P=VI=0\times I=0$, 因此电势相等.
> 
> 因此走任意loop外圈的电压和均为0(电势差为0)

> [!example]+ 
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=11&rect=204,129,512,327&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.11|328]]
> 
> $$-v_1+v_2+v_3-v_4+v_5=0$$
> 
> 一个写正负的方法是:
> 1. 首先假设一下每个元件的电压正负极
> 2. 顺时针走loop
> 3. 走的过程中, 首先遇到`-`就在该元件对应电压上加负号(相减), 首先遇到`+`就给对应电压使用正号(相加)

> [!example] [[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=13|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.13]]
> Path 1: $$-v_a+v_2+v_b=0$$
> 
> Path 2: $$-v_b-v_3+v_c=0$$
> 
> Path 3: $$-v_a+v_2-v_3+v_c=0$$

## 分压/分流
### Voltage Division

> [!example] 
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=14&rect=83,266,341,431&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.14|530]]
> 
> KVL: $$-v+v_1+v_2=0$$
> $$v_1=i\cdot R_1$$
> $$v_2=i\cdot R_2$$
> $$v=i\cdot(R_1+R_2)$$
> 
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=14&rect=394,261,638,441&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.14]]
> 
> $$v=i\times R_{eq}$$
> $$R_{eq}=R_1+R_2$$
> $$\Rightarrow v_1=\frac{R_1}{R_1+R_2}v,v_2=\frac{R_2}{R_1+R_2}v$$
> 正比分压
> $$\Rightarrow \frac{v_1}{v_2}=\frac{R_1}{R_2}$$

### Parallel Resistors

> [!example] 
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=16&rect=38,236,307,431&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.16|519]]
> 
> $$i_1=\frac{v}{R_1},i_2=\frac{v}{R_2}$$
> KCL: $$i=i_1+i_2=v(\frac{1}{R_1}+\frac{1}{R_2})$$
> 
> 等效:
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=16&rect=347,236,595,435&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.16|519]]
> $$i=\frac{v}{R_{eq}}$$
> $$\Rightarrow R_{eq}=\frac{1}{R_1}+\frac{1}{R_2}=\frac{R_1R_2}{R_1+R_2}$$
> $$G_{eq}=G_1+G_2$$

### Current Division
> [!example] 
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=17&rect=383,294,647,482&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.17|519]]
> 
> 反比分流
> $$\frac{i_1}{i_2}=\frac{R_2}{R_1}$$

## Delta-wye Conversion

将一个环形的电路转换成Y字型的等效电路, 便于分析

Y字型的电路中, 有:
![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=23&rect=58,276,248,419|EE111-F25Lec2-Kirchhoff and Node_Mesh_analysis, p.23|416]]
$$R_{12}(Y)=R_1+R_3$$

在三角形(环形)的电路中, 有:
![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=23&rect=66,74,260,220|EE111-F25Lec2-Kirchhoff and Node_Mesh_analysis, p.23|413]]
$$R_{12}(\Delta)=R_b\|(R_a+R_c)=\frac{R_b(R_a+R_c)}{R_a+R_b+R_c}$$

令$R_{12}(Y)=R_{12}(\Delta)$, 有:
$$R_{12}=R_1+R_3=\frac{R_b(R_a+R_c)}{R_a+R_b+R_c}$$
同理, 有:
$$R_{13}=R_1+R_2=\frac{R_c(R_a+R_b)}{R_a+R_b+R_c}$$
$$R_{34}=R_2+R_3=\frac{R_a(R_b+R_c)}{R_a+R_b+R_c}$$

联立上述三个方程组, 可以求解得:
$$\begin{aligned}R_1&=\frac{R_bR_c}{R_a+R_b+R_c}\\R_2&=\frac{R_cR_a}{R_a+R_b+R_c}\\R_3&=\frac{R_aR_b}{R_a+R_b+R_c}\end{aligned}$$

对于一个三角形连接和Y字型连接, 如果所有的电阻的阻值相同, 则称这个电路为“balance”的. 并且, 三角形和Y字型电路的等效阻值之间有这个关系:
![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=24&rect=233,38,433,91|EE111-F25Lec2-Kirchhoff and Node_Mesh_analysis, p.24]]

## Node Analysis
> [!example]
> 在未知$v_1,v_2$的情况下求解电路: 假设未知数$v_1,v_2$, 使用KCL设置方程组, 求解$v_1,v_2$
> ![[Pasted image 20250923084823.jpeg]]

节点法求解:
![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=27&rect=56,136,686,425|EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis, p.27]]

> [!example]
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=28&rect=12,244,304,433|EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis, p.28]]
> 假设三个节点对应的电压分别为$v_1,v_2,v_3$
> 
> 假设对于最上面的$4\Omega$的电阻有$i_1$的电流, 对于中间$8\Omega$的电阻有$i_2$的电流, 最下面$4\Omega$的电阻有$i_3$的电流. 假设所有的电阻都是左正右负(上正下负).
> 
> 对于$N_1$:
> $$3=i_x+i_1=\frac{v_1-v_2}{2}+\frac{v_1-v_3}{4}$$
> 对于$N_2$:
> $$i_x=i_2+i_3\Rightarrow\frac{v_1-v_2}{2}=\frac{v_2-v_3}{8}+\frac{v_2-0}{4}$$
> 对于$N_3$:
> $$i_1+i_2=2i_x\Rightarrow\frac{v_1-v_3}{4}+\frac{v_2-v_3}{8}=2\times\frac{v_1-v_2}{2}$$
> 联立求解, 得:
> $$\begin{aligned}v_1&=4.8\\v_2&=2.4\\v_3&=-2.4\end{aligned}$$

如果遇到电压源的时候, 需要设一个新的未知数$i_v$, 然后同样的, 使用[[#Kirchhoff's Current Law (KCL)|KCL]]求解:
- 有关电压源部分的方程:
	- $i_1+i_v=i_3=\frac{v_a=0}{R_3}$
	- $i_2=i_5+i_4=i_5+\frac{V_b-0}{R_4}$

或者使用[[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=31|超级节点法]]进行求解: 把整个$V_a,V_{LL},V_b$当成一个大的节点, 然后看电流计算KCL:
- $i_1+i_2=i_3+i_4=\frac{V_a-0}{R_3}+\frac{V_b-0}{R_4}$
- 这个实际上就是上面的普通节点法的联立消元的结果

## Mesh Analysis

网孔法

### Independent Loop

Independent Loop 独立回路: 如果包含一条回路, 且这条回路不被其他回路包含, 那么这个是独立回路.

如:
![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=33&rect=48,118,321,283&color=note|EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis, p.33]]

按照顺序找:
1. 最左侧的最小的回路: 三个元器件都没有被使用, 是独立回路
2. 中间的最小回路: 右侧的$3\Omega$的元器件没被使用, 是独立回路
3. 最右侧的最小回路: 右侧的电流源没被使用, 是独立回路
4. 其他的回路(大的回路)都不是独立回路了, 因为所有元器件都被用过了

注意, 如果是 `左->右->中` 的顺序会发现中间的最小回路不是独立回路了. 但是实际上他们还是一个独立回路组(三个最小回路都是独立回路), 因为只要满足一个顺序就可以了

实际上, 独立回路也可以是包含一个大的回路, 但是总数不变:
- 假设有$b$个branches
- 假设有$n$个nodes
- 假设有$l_{ind}$个独立回路
- 则有: $l_{ind}=b-(n-1)$

独立回路的作用: 联立方程的时候, 不能联立非独立回路, 因为线性相关会导致缺少求解的关系

### Mesh

最小的回路.

所有最小回路会组成独立回路组

- Step 1: 找到mesh, 给每个mesh假定一个mesh current, 假定方向和大小(未知数)
- Step 2: 对每个mesh使用KVL, 对于共享元件, 按照mesh电流的方向计算电流之差
- 解方程, 得到mesh currents

> [!example]
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=36&rect=419,251,692,447|EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis, p.36]]
> 
> Step 1: mesh, $i_1$, $i_2$
> 
> Step 2: Apply KVL:
> 
> > [!info]- 使用支路电流
> > 左侧:
> > $$-15+5I_1+10I_3+10=0$$
> > 右侧:
> > $$-10-10I_3+6I_2+4I_2=0$$
>
> 使用网孔电流:
> 
> 对于左侧的mesh:
> $$-15+5i_1+10(i_1-i_2)+10=0$$
> 对于右侧的mesh:
> $$-10-10(i_1-i_2)+6i_2+4i_2=0$$
> 解得:
> $$i_1=i_2=1A$$
> 
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=36&rect=547,331,584,408&color=blue|EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis, p.36|100]]
> 注意, 此时中间的$I_3=i_1-i_2=0$, 因此中间的$10\Omega$的电阻处流经电流为$0A$, 那么这里是断路. 同时注意到右侧mesh的总电势为$10V$, 那么注意到中间的电压源为$10V$恒压电压源, 这处电路的两侧电势相等, 因此也是短路. 那么这个$10\Omega$电阻就同时为短路和断路.

![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=37&rect=330,101,502,238&color=note|EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis, p.37]]
这里由于没有其他的电流, 因此在这个mesh中网孔电流和电流源应该是相等的, 方向相反(注意图中标注的$i_2$是顺时针)

> [!example] 对于共享电流源
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=38&rect=376,266,663,420&color=note|EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis, p.38]]
> KVL: 假设电流源的电压为$V_A$
> 
> 对于左侧:
> $$-20+6i_1+2(i_1-i_2)-V_A=0$$
> 对于右侧:
> $$V_A-2(i_1-i_2)+10i_2+4i_2=0$$
> 此时有两个mesh两个方程, 但是有三个未知数. 需要再找一个方程.
> 
> 考虑电流源的电流, 有:
> $$i_12-i_1=6$$
> 联立求解.

Supermesh方法: 将多个mesh合成一个更大的mesh. 但是注意, 在一个supermesh之后, 里面还是有多个mesh current在转:
![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=39&rect=62,269,668,436&color=note|EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis, p.39]]
可以列出方程:
$$-20+6i_1+10i_2+4i_2=0$$
这样可以避开中间的电流源的电压.

这个和上面KVL联立方程消元之后的结果一致.

# Lecture 03
> [!note]- slide
> ![[EE111-F25Lec3-Circuit Theorem.pdf]]

线性系统:
![[EE111-F25Lec3-Circuit Theorem.pdf#page=4&rect=43,60,665,420|EE111-F25Lec3-Circuit Theorem, p.4]]

> [!example] 使用齐次性求解电路
> ![[EE111-F25Lec3-Circuit Theorem.pdf#page=5&rect=36,268,358,430|EE111-F25Lec3-Circuit Theorem, p.5]]
> 假设了最初是的电流为$1A$, 或者说可以假设$u_1$的电压为$120V$
> $$i_1=1A$$
> $$v_c=10V$$
> $$v_b=v_c+1\times2=12V$$
> $$i_2=\frac{v_b-0}{5}=2.4A$$
> KCL: $$i_3=i_1+i_2=3.4A$$
> ...

## Superposition

1. 找一个需要分析的source
2. 将其他的source归零("Turn off"), 电流源$\rightarrow0A$, 电压源$\rightarrow0V$
3. 分析
4. 对其他需要分析的source重复

> [!example] 使用可加性求解
> ![[EE111-F25Lec3-Circuit Theorem.pdf#page=10&rect=28,0,700,443|EE111-F25Lec3-Circuit Theorem, p.10]]
> 
> 只保留电流源的时候的电路电流为:
> $$I_1=\frac{R_1}{R_1+R_2}\cdot I_0=\frac{1}{3}I_0=2A$$
> 
> 只保留电压源的时候电路电流为(KVL):
> $$5I_2+10I_2+V_0=0\Rightarrow I_2=\frac{-45}{15}=-3A$$
> 
> 因此完整电路中的电流$I$为:
> $$I=I_1+I_2=2A-3A=-1A$$

Superposition可以计算得出每一个电压源/电流源对相应的影响

可以知道如果想要改变响应, 修改哪一个源的数值能够最快改变. 因为可以将最终的结果(目标电压/电流)写成 系数$\times$电源输入 的累和的形式. 如上面的example, 可以写成$I=\frac{1}{3}I_0-\frac{1}{15}V_0$

注意, 叠加定理可以叠加电流, 可以叠加电压, 但是功率**不能**叠加

## Thevenin's Theorem

当电路分析中, 只有一个元器件的参数是变化的(变量, 或者叫做"load", 负载), 其他的元器件的参数是固定的, 测试可以使用Thevenin定理: **一个两个端子的电路(包含电阻, 线性相关/不相关的电源), 可以使用一个电压源和一个电阻串联来表达**

计算等效电路的方法:
1. 分析得到端子处的电压
2. [[EE111-F25Lec3-Circuit Theorem.pdf#page=21&selection=34,1,47,18&color=note|deactivate]]所有的独立源
3. 化简计算得到等效组织

> [!example] 
> ![[EE111-F25Lec3-Circuit Theorem.pdf#page=20&rect=390,257,717,400|EE111-F25Lec3-Circuit Theorem, p.20]]
> 
> 使用Thevenin's Theorem, 将$R_2$之外的电路化简, 得:
> ![[Pasted image 20250928093011.jpeg]]

> [!example] 
> ![[EE111-F25Lec3-Circuit Theorem.pdf#page=22&rect=91,183,266,392|EE111-F25Lec3-Circuit Theorem, p.22]]
>
> 等效电压源的电压时开路的电压. 此时这个电路本身就是开路状态, 直接求开路电压即可.
> 
> 将最下面的node接地, 使用节点法进行求解a,b两点的节点电压$v_a,v_b$:
> - 对节点a使用KCL: $$\frac{16-v_a}{50}=\frac{v_a}{50}+\frac{v_a-v_b}{30}$$
> - 对节点b使用KCL: $$\frac{v_a-v_b}{30}+4=\frac{v_b}{35}$$
> 
> 解得$$u_{oc}=v_a-v_b=-44V$$
>
> 将电路的独立源turn off, 计算阻值, 有:
> $$R_{ab}=[(50\|50)+35]\|30=20\Omega$$
> 则$R_{eq}=R_{ab}=20\Omega$

> [!attention] 注意
> Thevenin Equivalent方法不适用于有受控源(非独立源)的情况: 电压不会受到影响, 但是等效阻值会受到影响

### OC电压SC电流法
对于含有受控源的电路, 可以使用[[EE111-F25Lec3-Circuit Theorem.pdf#page=23|这个方法]](开路电压短路电流法)进行计算:
![[EE111-F25Lec3-Circuit Theorem.pdf#page=23|EE111-F25Lec3-Circuit Theorem, p.23]]

第一步是相同的, 计算得到开路电压

但是第二步的时候, 先不去计算等效电阻:
1. 首先假设在开路的两个端子连接一个导线形成短路
2. 此时有KVL: $R_{eq}=\frac{u_{oc}}{i_{ic}}$, 这里需要注意一下$u_{oc}$和$i_{sc}$的

### External Source Method
但是部分的电路不能用上面两个方法:
![[EE111-F25Lec3-Circuit Theorem.pdf#page=28&rect=251,308,603,471|EE111-F25Lec3-Circuit Theorem, p.28]]

使用第三种方法(鲁棒性更强):
![[EE111-F25Lec3-Circuit Theorem.pdf#page=26|EE111-F25Lec3-Circuit Theorem, p.26]]

第一步仍然是相同的, 使用求解等效电压(开路电压)

第二步是在外部新加上一个电压源, 同时关闭内部的所有电源, 有$v_{ex}$, 输出的电流为$i_{ex}$. 求解这两个的值, 得到$R_{eq}=\frac{v_{ex}}{i_{ex}}$

### I-V characteristic

在正常的电路中, 可以将一个正常电路分成两个Thevenin电路, 两个Thevenin分别有自己的I-V性质:
![[EE111-F25Lec3-Circuit Theorem.pdf#page=29&rect=49,206,645,447|EE111-F25Lec3-Circuit Theorem, p.29]]

两个电路有两个I-V函数, 找到交点即为电路的解

## Norton's Theorem
![[EE111-F25Lec3-Circuit Theorem.pdf#page=30|EE111-F25Lec3-Circuit Theorem, p.30]]

和[[#Thevenin's Theorem]]类似, 不过一个是用电压源串联电阻, 一个是电流源并联电阻

因此Norton's Theorem也有三种不同的方法, 与Thevenin's完全一致.

## Source Transfer

> [!example] 
> ![[EE111-F25Lec3-Circuit Theorem.pdf#page=34&rect=54,192,673,445|EE111-F25Lec3-Circuit Theorem, p.34]]
> 
> $$P_L=V_L\cdot I_L=\left(\frac{V_{TH}}{R_{TH}+R_L}\right)^2\cdot R_L$$
> 导数为零的时候有最大的功率:
> $$\frac{\partial P_L}{\partial R_L}=0\Rightarrow R_L=R_{TH}$$
> $$\Rightarrow P_{L\text{max}}=...$$


> [!example] 
> ![[EE111-F25Lec3-Circuit Theorem.pdf#page=35&rect=45,246,672,443|EE111-F25Lec3-Circuit Theorem, p.35]]
> 计算第二问的时候, 总功率$P_{total}$需要使用原先电路来计算, 不能使用等效的电路. “等效”是对外等效, 对内可能不等效(功率是内部性质)

# Lecture 04
> [!note]- slide
> ![[EE111-F25Lec4-Operational Amplifiers.pdf]]

## 运算放大器

![[EE111-F25Lec4-Operational Amplifiers.pdf#page=6&rect=206,28,593,234|EE111-F25Lec4-Operational Amplifiers, p.6|433]]
$$v_0=Av_d=A(v_2-v_1)$$

将电压放大了$A$倍. 但是放大的倍数不能无限增大. 如果超过一定限制, 那么会达到最大值(输出电压不能超过供电电压, “钳制”):

![[EE111-F25Lec4-Operational Amplifiers.pdf#page=7&rect=67,35,350,356|EE111-F25Lec4-Operational Amplifiers, p.7|279]]

一个理想的放大的倍数$A$是无穷大的. 虽然在现实器件中无法做到, 但是$A$仍然很大($10^5\sim10^8$).

![[EE111-F25Lec4-Operational Amplifiers.pdf#page=9&rect=428,59,714,487|EE111-F25Lec4-Operational Amplifiers, p.9|382]]

认为输出的电压源是一个受控电压源, 有:
$$v_0=\frac{R_i}{R_i+R_o}\cdot A(v_2-v_1)$$
在理想的放大器中, 希望$R_o=0$, 因此实际上$R_o$越小越好

**虚短虚断**:
![[EE111-F25Lec4-Operational Amplifiers.pdf#page=9&rect=54,137,414,426|EE111-F25Lec4-Operational Amplifiers, p.9|454]]

在运算放大器中, 常使用KCL. 因为KVL的回路是不完整的, 运放内部是无法看到的.

> [!example] 
> ![[EE111-F25Lec4-Operational Amplifiers.pdf#page=11&rect=18,244,349,490|EE111-F25Lec4-Operational Amplifiers, p.11]]
> 求, $\frac{v_o}{v_s}$
> 
> 两个节点n节点(negative)和p节点(positive), 以及一个feedback(可以去找一下[[Introduction to Control#Control]]这一部分)
> 
> 根据虚短虚断: $v_n=v_p=0,i_n=i_p=0$
> 
> 对n点KCL:
> $$i_1+i_2+i_n=0$$
> $$\frac{v_n-v_s}{R_s}+\frac{v_n-v_o}{R_f}+0=0$$
> $$\frac{-v_s}{R_s}+\frac{-v_o}{R_f}=0$$
> $$\frac{v_o}{v_s}=-\frac{R_f}{R_s}$$
> 
> 在$R_L$处的电流不一定等于$i_2$, $i_L=\frac{v_0-0}{R_L}$与电阻有关. 因为$R_L$是随意的, 因此可能有$i_L\neq i_2$. $i_L$和$i_2$的差由运放的输出补齐
> 
> 注意, 这里可以看到输入和输出的比例为$-\frac{R_f}{R_s}$, 说明电压时反向的
> 
> $A$仍然成立, 但是这里有一个feedback, 不再是开环控制. $A(v_2-v_1)$是开环控制的计算

这里是"[[EE111-F25Lec4-Operational Amplifiers.pdf#page=11&rect=18,244,349,490|Inverting]]"的原因是电压源的正极连接了运放的负极. [[EE111-F25Lec4-Operational Amplifiers.pdf#page=14&rect=24,198,366,486|下面是"Non-Inverting"]]的原因是输入电压源的正极连接运放正极.

> [!example] 
> ![[EE111-F25Lec4-Operational Amplifiers.pdf#page=13&rect=195,142,493,349|EE111-F25Lec4-Operational Amplifiers, p.13]]
> 
> 由于运放的输入都是没有电流的, 因此$20k\Omega$的输入电流都给到了$40k\Omega$.

> [!example] 
> ![[EE111-F25Lec4-Operational Amplifiers.pdf#page=14&rect=24,198,366,486|EE111-F25Lec4-Operational Amplifiers, p.14]]
> 求, $\frac{v_o}{v_{in}}$
> 
> 由于虚短虚断, 因此输入的两极的电压是相同的, 都是$v_{in}$
> 
> 在负极节点处的KCL:
> $$\frac{v_o-v_{in}}{R_2}=\frac{v_{in}-0}{R_1}$$
> $$\frac{v_o}{v_{in}}=\frac{R_1+R_2}{R_1}$$
> 
> 是一个同向的放大器

> [!example] 
> ![[EE111-F25Lec4-Operational Amplifiers.pdf#page=15&rect=22,267,442,490|EE111-F25Lec4-Operational Amplifiers, p.15]]
> > 是[[EE111-F25Lec4-Operational Amplifiers.pdf#page=14&rect=24,198,366,486|上面的电路]]的一个改版, 令$R_1\to\infty$, $R_2\to0$
> 
> 或者说只看这一个电路自己:
> 
> $$v_o=v_2=v_{in}\Rightarrow\frac{v_o}{v_{in}}=1$$
> 
> 是电压跟随器.


电压跟随器的原因:

前面已经有一个电压源了, 为什么这里还需要一个运放: Buffer

![[EE111-F25Lec4-Operational Amplifiers.pdf#page=16&rect=19,286,338,419|EE111-F25Lec4-Operational Amplifiers, p.16]]
这种情况下, 如果长时间运行, 会导致电压源漂移(?), 分压变成了$v_o=\frac{R_L}{R_L+R_s}v_s$

![[EE111-F25Lec4-Operational Amplifiers.pdf#page=16&rect=19,101,331,260|EE111-F25Lec4-Operational Amplifiers, p.16]]
使用运放, 那么会有虚短虚断, 导致$R_s$不起作用(因为电流为0, 电压为0, 直接看成导线即可). 那么这个时候的$v_o=v_s$.

### Negative Feedback

在运放反馈的时候, 大部分都是往负极去连接反馈(inverted input), 称作负反馈

目的: 自我调整:
![[EE111-F25Lec4-Operational Amplifiers.pdf#page=18&rect=156,167,582,427|EE111-F25Lec4-Operational Amplifiers, p.18]]

### Summing Amplifier

加法器运放:
![[EE111-F25Lec4-Operational Amplifiers.pdf#page=19&rect=346,145,657,360|EE111-F25Lec4-Operational Amplifiers, p.19]]
$$v_+=(-\frac{R_f}{R_1}v_1-\frac{R_f}{R_2}v_2-\frac{R_f}{R_3}v_3)$$

### Difference Amplifier

减法器运放:
![[EE111-F25Lec4-Operational Amplifiers.pdf#page=21&rect=10,233,342,420|EE111-F25Lec4-Operational Amplifiers, p.21]]
$$v_o=\frac{R_2\frac{1+R_1}{R_2}}{R_1\frac{1+R_3}{R_4}}v_2-\frac{R_2}{R_1}v_1$$

### Cascaded Op Amps

级联: 多个OA直接相乘:
![[EE111-F25Lec4-Operational Amplifiers.pdf#page=23&rect=64,216,664,327|EE111-F25Lec4-Operational Amplifiers, p.23]]
$$A=A_1\cdot A_2\cdot A_3$$

# Lecture 05
> [!note]- slide
> ![[EE111-F25Lec5-1st-Order Circuits.pdf]]

电容和电感

## Capacity

平行板电容器:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=5&rect=14,242,439,445|EE111-F25Lec5-1st-Order Circuits, p.5]]

C 单位: F (法拉利).

“电容(capacity)”: 储存多少电荷的能力:
$$C=\frac{Q}{V}=\frac{dQ}{dV}$$
$$i=\frac{dQ}{dt}=\frac{CdV}{dt}$$
$$\begin{aligned}dV(t)&=\frac{1}{C}\cdot i(t)dt\\\int_{V(-\infty)}^{V(t)}dV(t)&=\int_{-\infty}^t\frac{1}{C}\cdot i(t)dt\\V(t)-V(-\infty)&=\int_{-\infty}^t\frac{1}{C}\cdot i(t)dt\\V(t)&=\int_{-\infty}^t\frac{1}{C}\cdot i(t)dt\end{aligned}$$
也是一个[[#Lecture 03|线性元件]]. 最后的一行可以认为是: 最终的电压应该和历史所有的电荷的流入流出都有关系, 所有历史上的电荷的移动才有最终的电压

根据积分性质, 可以有:
$$\begin{aligned}V(t)&=\int_{-\infty}^t\frac{1}{C}\cdot i(t)dt\\&=\int_{-\infty}^{t_0}\frac{1}{C}\cdot i(t)dt+\int_{t_0}^t\frac{1}{C}\cdot i(t)dt\\&=V(t_0)+\int_{t_0}^t\frac{1}{C}\cdot i(t)dt\end{aligned}$$
可以认为是在$t_0$时间节点做了一次“结算”.

> [!PDF|] [[EE111-F25Lec5-1st-Order Circuits.pdf#page=6&selection=12,4,12,23|EE111-F25Lec5-1st-Order Circuits, p.6]]
> >  instantaneous power 
> 
> $$p(t)=v(t)\cdot i(t)=v(t)\cdot C\cdot \frac{dv(t)}{dt}$$

> [!PDF|] [[EE111-F25Lec5-1st-Order Circuits.pdf#page=6&selection=16,4,16,17|EE111-F25Lec5-1st-Order Circuits, p.6]]
> > energy stored 
> 
> $$\begin{aligned}E(t)&=\int_{-\infty}^tp(t)dt\\&=\int_{-\infty}^tv(t)\cdot C\cdot\frac{dv(t)}{dt}dt\\&=\int_{v(-\infty)}^{v(t)}v(t)\cdot Cdv(t)\\&=\frac{1}{2}C\cdot v^2(t)\end{aligned}$$

> [!example] 
> ![[EE111-F25Lec5-1st-Order Circuits.pdf#page=7&rect=32,274,423,442|EE111-F25Lec5-1st-Order Circuits, p.7]]
> 
> 电压源: 直流电压源. 可以认为电容会让电路变成开路状态. 注意, [[EE111-F25Lec5-1st-Order Circuits.pdf#page=7&rect=257,287,288,355&color=red|这个地方]]虽然有一个元器件, 但是由于还有一个电容, 因此这里没有任何的电流, 没有任何的电压差. 可以认为[[EE111-F25Lec5-1st-Order Circuits.pdf#page=7&rect=257,287,288,355&color=red|这里]]直接是一个导线.
> 
> 计算$v_1,v_2$电压差: 分压直接看对应的电阻的阻值.
> 
> 如, $v_2$连接在[[EE111-F25Lec5-1st-Order Circuits.pdf#page=7&rect=348,321,417,375&color=blue|这个电阻]]的两侧, 因此分压应该和这个电阻相同:
> $$v_2=\frac{50k\Omega}{20+30+50k\Omega}\times20V=10V$$
> $v_1$和[[EE111-F25Lec5-1st-Order Circuits.pdf#page=7&rect=348,321,417,375&color=blue|这个电阻]]和[[EE111-F25Lec5-1st-Order Circuits.pdf#page=7&rect=197,394,264,438&color=blue|这个电阻]]的两侧, 因此:
> $$v_1=\frac{50+30}{20+30+50}\times20=16V$$

> [!example] 
> ![[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=18,271,381,428|EE111-F25Lec5-1st-Order Circuits, p.8]]
> [[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=104,298,171,361&color=blue|第一段电流]]:
> $$i=C\cdot\frac{dv}{dt}=0.6\times5=3\mu A$$
> [[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=165,338,235,370&color=blue|第二段]]:
> $$i=C\cdot\frac{dv}{dt}=C\cdot0=0$$
> [[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=226,324,258,361&color=blue|第三段]]:
> $$i=C\cdot\frac{dv}{dt}=0.6\times-5=-3\mu A$$
> [[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=255,316,325,344&color=blue|第四段]]: 同第二段, 电流为$0$
> 
> ---
> 
> ![[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=20,107,369,271|EE111-F25Lec5-1st-Order Circuits, p.8]]
> 由于每一段斜率都为$0$, 因此每一段电流均为$0$
> 
> ---
> 
> ![[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=389,236,704,403|EE111-F25Lec5-1st-Order Circuits, p.8]]
> 
> [[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=466,281,527,364&color=blue|储存能量]], [[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=556,243,611,316&color=blue|释放能量]]
> 
> ---
> 
> ![[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=416,56,698,225|EE111-F25Lec5-1st-Order Circuits, p.8]]
> [[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=454,79,518,182&color=blue|储能]], [[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=509,157,574,182&color=blue|等待(idle)]], [[EE111-F25Lec5-1st-Order Circuits.pdf#page=8&rect=557,94,587,179&color=blue|释能]]
> 
> ---
> 
> 这些图片的时间都是对应的, 是同一个电路相同时间坐标系下的图, 因此可以对称看.

注意, 电压不能突变. 由于电流$i=C\cdot\frac{dv}{dt}$, 那么如果电压突变, 微分变成$\infty$, 导致功率$p=v\cdot i=\infty$, [[EE111-F25Lec5-1st-Order Circuits.pdf#page=9&rect=484,81,651,224|这个]]是不被允许的. ^3bcbad

![[EE111-F25Lec5-1st-Order Circuits.pdf#page=10&rect=30,99,396,392|EE111-F25Lec5-1st-Order Circuits, p.10]]
串联. 使用KVL:
$$\begin{aligned}v_s&=v_1+v_2+v_3\\&=\frac{1}{C_1}\int_{-\infty}^ti_s(t)dt+\frac{1}{C_2}\int...+\frac{1}{C_3}\int...\\&=\left(\frac{1}{C_1}+\frac{1}{C_2}+\frac{1}{C_3}\right)\int_{-\infty}^ti_s(t)dt\\\Rightarrow C_{eq}&=\left(\frac{1}{C_1}+\frac{1}{C_2}+\frac{1}{C_3}\right)^{-1}\\\frac{v_1}{v_s}&=\frac{\frac{1}{C_1}}{\frac{1}{C_{eq}}}=\frac{C_{eq}}{C_1}\end{aligned}$$

![[EE111-F25Lec5-1st-Order Circuits.pdf#page=11&rect=35,91,407,429|EE111-F25Lec5-1st-Order Circuits, p.11]]
并联. 使用KCL:
$$\begin{aligned}i_s&=i_1+i_2+i_3\\&=C_1\frac{dv}{dt}+C_2\frac{dv}{dt}+C_3\frac{dv}{dt}\\\Rightarrow C_{eq}&=C_1+C_2+C_3\\\frac{i_1}{i_s}&=\frac{C_1}{C_{eq}}\end{aligned}$$

## Inductor

电感, 或者称为线圈:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=13&rect=54,203,602,436|EE111-F25Lec5-1st-Order Circuits, p.13]]
$L$的单位: H (Heng, 亨利). 真实世界中一般都是$nH$, 纳亨.

线圈会产生感应电动势, 感应电动势的方向由线圈的绕法和电流方向共同决定(楞次定律). 在电路中, 不考虑电感线圈的绕法; 画图中, 使用电压电流的关系来表示方向
$$v=L\frac{di}{dt}$$
考虑[[#Capacity|电感]], 公式只是换了符号: 二元性.

使用积分形式:
$$\begin{aligned}di&=\frac{1}{L}vdt\\\int_{(i(-\infty)}^{i(t)}di&=\int_{-\infty}^t\frac{1}{L}v(t)dt\\i(t)-i(-\infty)&=\frac{1}{L}\int_{-\infty}^tv(t)dt\\i(t)&=\frac{1}{L}\int_{-\infty}^tv(t)dt\\&=i(t_0)+\int_{t_0}^tv(t)dt\end{aligned}$$

> [!PDF|] [[EE111-F25Lec5-1st-Order Circuits.pdf#page=14&selection=12,4,12,19|EE111-F25Lec5-1st-Order Circuits, p.14]]
> > power delivered 
> 
> $$p(t)=v(t)i(t)=L\frac{di(t)}{dt}i(t)$$

> [!PDF|] [[EE111-F25Lec5-1st-Order Circuits.pdf#page=14&selection=16,4,16,17|EE111-F25Lec5-1st-Order Circuits, p.14]]
> > energy stored
> 
> same as [[EE111-F25Lec5-1st-Order Circuits.pdf#page=6&selection=16,4,16,17|Capacity]]:
> $$E(t)=\frac{1}{2}L\cdot i^2(t)$$

> [!example] 
> ![[EE111-F25Lec5-1st-Order Circuits.pdf#page=15&rect=57,303,327,436|EE111-F25Lec5-1st-Order Circuits, p.15]]
> 
> [[EE111-F25Lec5-1st-Order Circuits.pdf#page=15&rect=377,316,409,409&color=blue|第一段]]: 电流爬升, $\frac{di}{dt}>0$. $i>0$, 因此电压$v>0$, $p>0$
> 
> [[EE111-F25Lec5-1st-Order Circuits.pdf#page=15&rect=401,317,439,414&color=blue|第二段]]: $i>0$, $\frac{di}{dt}<0$, 因此电压$v<0$, $p<0$
> 
> [[EE111-F25Lec5-1st-Order Circuits.pdf#page=15&rect=433,297,455,324&color=blue|第三段]]: $i<0$, $\frac{di}{dt}<0$, 因此$v>0$, $p>0$
> 
> [[EE111-F25Lec5-1st-Order Circuits.pdf#page=15&rect=452,297,488,324&color=blue|第四段]]: $i<0$, $\frac{di}{dt}>0$, 因此$v<0$, $p<0$

同理, 对于电感而言, 电流是不能突变的.

串联:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=17&rect=39,107,397,430|EE111-F25Lec5-1st-Order Circuits, p.17]]

并联:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=18&rect=38,50,427,389|EE111-F25Lec5-1st-Order Circuits, p.18]]

电容在直流源作用下是断路, 电感在直流源的作用下是短路.
> [!example] 
> ![[EE111-F25Lec5-1st-Order Circuits.pdf#page=19&rect=26,85,381,420|EE111-F25Lec5-1st-Order Circuits, p.19]]

总结:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=20&rect=56,51,675,410|EE111-F25Lec5-1st-Order Circuits, p.20]]

## Natural response of RC circuits

- RC电路: 只包含[[EE111-F25Lec5-1st-Order Circuits.pdf#page=22&selection=14,0,19,1|电源, 电阻和电容]]的电路 
- RL电路: 只包含[[EE111-F25Lec5-1st-Order Circuits.pdf#page=22&selection=31,0,36,1|电源, 电阻和电感]]的电路

![[EE111-F25Lec5-1st-Order Circuits.pdf#page=23&rect=400,269,659,389|EE111-F25Lec5-1st-Order Circuits, p.23]]
用于研究在没有其他电源的时候, 电容(或者电感)充满电之后的行为.
- 开关处于1号位置的时候(称[[EE111-F25Lec5-1st-Order Circuits.pdf#page=23&rect=404,150,694,265|t=0-]])为充电
- 开关位于2号位置的时候(称[[EE111-F25Lec5-1st-Order Circuits.pdf#page=23&rect=422,15,593,136|t=0+]]), 只存在电容(或电感), 此时为"Natural Response". 刚切换的时候, 电容身上的电压仍然为$v_s$, 因为[[#^3bcbad|电压不能突变]]: $v_c(0^-)=v_c(0^+)=v_s$

分析[[EE111-F25Lec5-1st-Order Circuits.pdf#page=24&rect=53,299,232,439|0+]]的时候, 根据KCL:
$$i=\frac{v_R}{R}=C\frac{dv_t}{dt}$$
KVL:
$$v_R+v_C=0$$
$$\Rightarrow\frac{dv_t}{dt}=\frac{-v_C}{R\cdot C}$$
$$\frac{dv_t}{dt}+\frac{1}{RC}\cdot v_C=0$$
解微分方程(齐次一阶常系数微分方程):
$$v_C(t)=A\cdot e^{\frac{1}{RC}t}$$
$$\begin{aligned}v_C(0^+)&=v_s\\\Rightarrow A&=v_s\\\Rightarrow v_C(t)&=v_s\cdot e^{\frac{1}{RC}t}\end{aligned}$$

> [!tip]- 齐次一阶常系数微分方程解的形式
> 求解$\frac{dx}{dt}+ax=0$
> 
> 通解的形式应该为:
> $$x(t)=Ae^{-at}$$

因此电压随时间变化的图像为:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=25&rect=48,275,491,433|EE111-F25Lec5-1st-Order Circuits, p.25]]
时间常数: $\tau=RC$, 表示衰减的速度. $RC$越大, 衰减越慢

那么电流的图为:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=25&rect=43,69,428,234|EE111-F25Lec5-1st-Order Circuits, p.25]]
$$i=C\cdot\frac{dv_C(t)}{dt}=C\cdot v_s\cdot(-\frac{1}{RC})\cdot e^{-\frac{1}{RC}t}=-\frac{v_s}{R}\cdot e^{-\frac{1}{RC}t}$$
注意对于电容而言, 电流允许有突变, 但是电压不允许突变

> [!example] 
> ![[EE111-F25Lec5-1st-Order Circuits.pdf#page=31&rect=42,196,323,333|EE111-F25Lec5-1st-Order Circuits, p.31]]
> 
> 并联电阻: $R=\frac{5\times(8+12)}{5+8+12}=4\Omega$
> $$\Rightarrow v_c(t)=v_s\cdot e^{-\frac{1}{RC}t}=15e^{-\frac{5}{2}t}$$
> 
> 分压:
> $$v_x(t)=\frac{12}{8+12}v_C(t)=9e^{-\frac{5}{2}t}$$
> 
> $$i_x(t)=\frac{v_x(t)}{R_x}=\frac{3}{4}e^{-\frac{5}{2}t}$$
> or 使用分流:
> $$i_C(t)=-\frac{v_C(0)}{R}e^{-\frac{1}{RC}t}=-\frac{15}{4}e^{-\frac{5}{2}t}$$
> $$i_x(t)=\frac{5}{5+8+12}i_C(t)=-\frac{3}{4}e^{-\frac{5}{2}t}$$

## Natural response of RL circuits

![[EE111-F25Lec5-1st-Order Circuits.pdf#page=27&rect=191,315,501,450|EE111-F25Lec5-1st-Order Circuits, p.27]]
类似的, 分成两个阶段:
- 充电阶段([[EE111-F25Lec5-1st-Order Circuits.pdf#page=27&rect=43,169,331,307|t=0-]]): 给L充电. 此时所有电流都会给电感身上. (可以理解为, 电感是导线, 让R两侧电势差为0, 因此电流不走R只走L)
- 放点([[EE111-F25Lec5-1st-Order Circuits.pdf#page=27&rect=48,43,339,170|t=0+]]): $R_0$有突变, 出现电流; 电感的电流不能突变, 因此$t=0^+$的时候的电流仍然等于$t=0^-$的时候的电流状态. 同时, $R$这个电阻身上的电流从0突变成$i_L(0^+)$的值.

分析[[EE111-F25Lec5-1st-Order Circuits.pdf#page=28&rect=26,305,319,447|0+]]: 假设参考方向[[EE111-F25Lec5-1st-Order Circuits.pdf#page=28&rect=163,397,232,440&color=blue|如图]]:

电流不突变:
$$i_L(0^+)=i_L(0^-)$$KVL:
$$L\cdot\frac{di_L}{dt}+i_LR=0$$
$$\Rightarrow\frac{di_L}{dt}+\frac{R}{L}\cdot i_L=0$$
$$\Rightarrow i_L(t)=I_s\cdot e^{-\frac{R}{L}t}$$
图:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=29&rect=39,174,318,433|EE111-F25Lec5-1st-Order Circuits, p.29]]

同时可得:
$$v_L(t)=L\frac{di_L(t)}{dt}=L\cdot I_s\cdot(-\frac{R}{L})e^{-\frac{R}{L}t}=-I_sRe^{-\frac{R}{L}t}$$
时间常数$\tau=\frac{L}{R}$

> [!example] 
> ![[EE111-F25Lec5-1st-Order Circuits.pdf#page=32&rect=25,50,685,429|EE111-F25Lec5-1st-Order Circuits, p.32]]
> 
> 首先求开关闭合时电流:
> $$i_L(0^-)=\frac{12}{4+12}\frac{40}{2+\frac{4\times12}{4+12}}=6A$$
> 
> 开关断开时:
> $$\frac{R}{L}=\frac{\frac{(12+4)\times16}{12+6+16}}{2}=4$$
> $$\Rightarrow i_L(t)=i_L(0^-)e^{-\frac{R}{L}t}=6e^{-4t}$$

## Step Response
### RC Circuits

一个直流电源突然接入RC电路中.

[[Introduction to Control#^1a68f2|阶跃相应]]:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=35&rect=51,178,315,341|EE111-F25Lec5-1st-Order Circuits, p.35]]

在电路中, 可以认为是:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=35&rect=141,25,575,171|EE111-F25Lec5-1st-Order Circuits, p.35]]
是$v_0\cdot u(t)$

![[EE111-F25Lec5-1st-Order Circuits.pdf#page=37&rect=6,242,426,448|EE111-F25Lec5-1st-Order Circuits, p.37]]
KVL:
$$\begin{aligned}v_s&=v_R+v_C\\&=i_R\cdot R+v_C\\&=C\cdot\frac{dv_c}{dt}\cdot R+v_c\end{aligned}$$
$$\frac{dv_c}{dt}+\frac{1}{RC}v_C=\frac{v_s}{RC}$$
齐次方程, $v'_c(t)=Ae^{-\frac{t}{RC}}$,
$$\begin{aligned}v_c(t=0^+)&=v_0\\&=Ae^{0^+}+v_s\\\Rightarrow v_C(t)&=v_s+(v_0-v_s)e^{-\frac{t}{RC}}\end{aligned}$$
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=39&rect=14,66,656,447|EE111-F25Lec5-1st-Order Circuits, p.39]]
(假定$v_s>v_0$)

完全响应: [[#Natural response of RC circuits|自然响应]]+强制响应(有独立源影响)
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=41&rect=81,128,620,403|EE111-F25Lec5-1st-Order Circuits, p.41]]
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=42&rect=40,190,672,485|EE111-F25Lec5-1st-Order Circuits, p.42]]

### RL Circuit
类似的, 完全响应:
$$i(t)=\frac{v_s}{R}+(i_0-\frac{v_s}{R})e^{-\frac{R}{L}t}$$
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=44&rect=17,90,679,421|EE111-F25Lec5-1st-Order Circuits, p.44]]

## Summary
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=46|EE111-F25Lec5-1st-Order Circuits, p.46]]

> [!example] 
> ![[EE111-F25Lec5-1st-Order Circuits.pdf#page=48&rect=53,167,680,431|EE111-F25Lec5-1st-Order Circuits, p.48]]
>
> $$t<0\Rightarrow v_c(t=0^-)=v_{5k\Omega}=\frac{5}{5+3}\times24=15V$$
> $$t>0\Rightarrow \text{成为开路, 因此 }v_c(t=\infty)=30V$$
> $$\begin{aligned}v_c(t)&=v_c(\infty)+[v_c(0)-v_c(\infty)]e^{-\frac{t}{RC}}\\&=30-15e^{-\frac{t}{2}}\end{aligned}$$

# Lecture 06
> [!note]- slide
> ![[EE111-F25Lec6-2nd-Order Circuits-Part1.pdf]]

# Lecture 07
> [!note]- 
> ![[EE111-F25Lec7-Phasor.pdf]]


> [!PDF|] [[EE111-F25Lec7-Phasor.pdf#page=1&selection=18,0,18,25]]
> 
> AC: Alternating Current, 一种有规律变化的电流.
> 
> 在本节课中特指正弦电流源或者正弦电压源. ([[EE111-F25Lec7-Phasor.pdf#page=1&selection=20,19,20,29|sinusoidal]]包含sin函数和cos函数的波形. 因为这些只有$\frac{\pi}{2}$的相位差)

> [!PDF|] [[EE111-F25Lec7-Phasor.pdf#page=3&selection=8,0,8,23]]
> > 使用正弦函数的原因
> 
> - 在自然界中很多现象都是正弦的
> - 正弦信号非常容易产生和变换
> - 容易使用数学工具处理 (三角函数的性质)
> 
> 根据[[EE111-F25Lec7-Phasor.pdf#page=3&selection=44,0,44,16|傅立叶分析]], 周期函数可以被表达成多个正弦函数之和

![[EE111-F25Lec7-Phasor.pdf#page=4&rect=347,183,567,385|284]]

正弦函数有三个要素:
- peak value(magnitude) 波峰 $V_m$
- angular frequency 角频率 $\omega$
- phase angle 相位角 $\omega t+\theta$. 这里更关注的是t=0时的初始的相位角 initial phase angle: $\theta$
	- 在这里我们关注$\theta\in[-180^\circ,180^\circ]$的范围

了解三个要素之后可以得到原始的三角函数$v(t)=V_m\cos(\omega t+\theta)$
- $\omega=2\pi f$
- $f=\frac{1}{T}$

常见三角变换:
![[EE111-F25Lec7-Phasor.pdf#page=5&rect=376,127,701,464|333]]

![[EE111-F25Lec7-Phasor.pdf#page=6&rect=23,113,706,481|482]]
左加右减, $v_3(t)$是领先其他两者的.

> [!example] 
> ![[EE111-F25Lec7-Phasor.pdf#page=7&rect=37,335,714,489]]
> 
> $t>0$时, 使用[[#Kirchhoff's Votage Law (KVL)]]:
> $$L\frac{di(t)}{dt}+Ri(t)=V_m\cos(\omega t+\phi)$$
> $$\Rightarrow\frac{di(t)}{dt}+\frac{R}{L}i(t)=\frac{V_m}{L}\cos(\omega t+\phi)$$
> 求解一个标准的微分方程:
> 1. general solution: $i_G=A\cdot e^{-\frac{R}{L}t}$
> 2. 找到一个particular solution: $i_p=B\cdot\cos(\omega t+c)$
> 3. 将ps代入微分方程:$$-B\cdot\omega\cdot\sin(\omega t+c)+\frac{R}{L}\cdot B\cdot\cos(\omega t+c)=\frac{V_m}{L}\cos(\omega t+\phi)$$
> 4. 令$t=0$, 有:
> $$\begin{aligned}-B\cdot\omega\sin c+\frac{R}{L}B\cos(c)&=\frac{V_m}{L}\cos\phi\\ B\cdot\sqrt{\omega^2+\frac{R^2}{L^2}}&=\frac{V_m}{L}\\ B&=\frac{V_m}{\sqrt{R^2+\omega^2L^2}}\end{aligned}$$
> $$\cos(c+\theta)=\cos\phi\Rightarrow c=\phi-\arctan(\frac{\omega L}{R})$$
> 5. $$i=i_G+i_p=\frac{-V_m}{\sqrt{R^2+\omega^2L^2}}\cos(\phi-\theta)e^{-\frac{R}{L}t}+\frac{V_m}{\sqrt{R^2+\omega^2L^2}}\cos(\omega t+\phi-\theta)$$
^4a2f2b

使用时域方法求解过于繁琐, 因此要找到一个方法去处理这个电路.

## Phasor

结合Magnitude+Phase

将三角函数使用欧拉公式$e^{\pm j\phi}=\cos\phi\pm j\sin\phi$转换成复指数:$$v(t)=V\cos(\omega t+\phi)=Re\{Ve^{j\phi}e^{j\omega t}\}$$

![[EE111-F25Lec7-Phasor.pdf#page=11&rect=158,50,537,349|290]]
复数坐标的投影: $\mathbf V=Ve^{j\phi}=V\cos\phi+jV\sin\phi$

或者使用极坐标的方式: $\mathbf V=V\angle\phi$

![[EE111-F25Lec7-Phasor.pdf#page=12&rect=16,80,694,486]]

复数运算:
![[EE111-F25Lec7-Phasor.pdf#page=14|EE111-F25Lec7-Phasor, page 14]]
![[EE111-F25Lec7-Phasor.pdf#page=15|EE111-F25Lec7-Phasor, page 15]]

卡西欧991可以直接计算复数的加减. 在菜单中的第二项可以计算角度或复数(角度使用shift+eng, 复数直接按eng)

![[EE111-F25Lec7-Phasor.pdf#page=18&rect=136,332,604,413]]
如果有周期的振荡(有$\omega\neq0$), 可以有双向箭头. 但是如果不是一个周期振荡的函数, 那么不能双向转换.

> [!example] 
> ![[EE111-F25Lec7-Phasor.pdf#page=19&rect=56,334,459,423]]
> 
> 1. $$i=6\cos(50t-40^\circ)\Rightarrow i=6\angle-40$$
> 2. 需要首先将$\sin$转换成$\cos$:
> 	- 首先画图, 坐标轴向右为$\cos$正方向, 向下为$\sin$正方向.
> 	- 原始为$-4\sin(\omega t+50^\circ)$, 那么为: 上方$-\sin$轴上找到$-4$点, 逆时针旋转$50^\circ$.
> 	- 这个向量距离$\cos$正轴的夹角为$50^\circ+90^\circ=140^\circ$, 那么转换成$\cos$应该为$4\cos(\omega t+140^\circ)$
> 	- 这个方法与$\omega$无关. 只需要画图
> 	
> 	最终有: $v=4\angle140$

![[EE111-F25Lec7-Phasor.pdf#page=21&rect=35,75,585,430]]
时域与频域的转变: 时域求导频域乘$j\omega$, 时域积分频域除$j\omega$
![[EE111-F25Lec7-Phasor.pdf#page=22&rect=23,17,391,434|377]]

## Phasor Relationships
### Resistor
![[EE111-F25Lec7-Phasor.pdf#page=23&rect=495,249,704,422|157]]![[EE111-F25Lec7-Phasor.pdf#page=23&rect=505,72,700,234|161]]
假设电压电流为:
$$\begin{aligned}i&=I_m\cos(\omega t+\phi)=I_m\angle\phi\\v&=RI_m\cos(\omega t+\phi)=RI_m\angle\phi\end{aligned}$$

这里可以看出来, 对于同一个电阻, 电压和电流的相位角是相通的, 只有数值模长不同. 因此电阻:$R=\frac{\overset{\cdot}{V}}{\overset{\cdot}{I}}$, 在时域和频域是相通的
$$\Rightarrow V=RI$$
### Inductors

$$\begin{aligned}i&=I_m\cos(\omega t+\phi)=I_m\angle\phi\\v&=L\frac{di}{dt}=\omega LI_m\cos(\omega t+\phi+90^\circ)=j\omega L\cdot I_m\angle\phi\\&=j\omega L\cdot i\end{aligned}$$
电压领先电流$90^\circ$

$$\Rightarrow V=j\omega LI$$
![[EE111-F25Lec7-Phasor.pdf#page=24&rect=483,240,675,427|120]]![[EE111-F25Lec7-Phasor.pdf#page=24&rect=466,31,695,173|139]]

### Capacitors
$$\begin{aligned}v&=V_m\cos(\omega t+\phi)=V_m\angle\phi\\i&=C\frac{dv}{dt}=\omega CV_m\cos(\omega t+\phi+90^\circ)=j\omega CV_m\angle\phi\\&=j\omega\cdot v\end{aligned}$$
$$\Rightarrow V=\frac{I}{j\omega C}$$
![[EE111-F25Lec7-Phasor.pdf#page=25&rect=501,239,669,397|131]]![[EE111-F25Lec7-Phasor.pdf#page=25&rect=447,57,672,199|195]]

### Impedance

首先总结: 领先的一项为可以突变的一项(对于[[#Phasor Relationships#Capacitors|电容]]和[[#Phasor Relationships#Inductors|电感]]而言)

定义阻抗$Z$:
$$Z=\frac{V}{I}$$
![[EE111-F25Lec7-Phasor.pdf#page=26&rect=57,265,668,432]]

阻抗依赖于频率$\omega$. 阻抗不是一个phasor(phasor要求有一个振荡, 要求相位角一直变化), 但是阻抗通常是一个复数, 并满足欧姆定律:
$$V=IZ,Z=\frac{V}{I}$$
![[EE111-F25Lec7-Phasor.pdf#page=28&rect=61,31,662,438]]

> [!example] 
> ![[EE111-F25Lec7-Phasor.pdf#page=29&rect=38,342,712,486]]
> 
> $$\begin{aligned}L\frac{di}{dt}+Ri&=V_m\cos(\omega t+\phi)\\L\cdot j\omega\overset{\cdot}{I}+R\cdot\overset{\cdot}{I}&=V_m\angle\phi\\(j\omega L+R)\overset{\cdot}{I}&=V_m\angle\phi\\\overset{\cdot}{I}&=\frac{V_m\angle\phi}{j\omega L+R}=\frac{V_m\angle\phi}{\sqrt{R^2+\omega^2L^2}\angle\theta}\\&=\frac{V_m}{\sqrt{R^2+\omega^2L^2}}\angle\phi-\theta\\\Rightarrow i(t)&=\frac{V_m}{\sqrt{R^2+\omega^2L^2}}\cos(\omega t+\phi-\theta)\end{aligned}$$
> 其中, $\theta=\arctan\frac{\omega L}{R}$
> 
> 参考[[#^4a2f2b]], 使用频域求解更加方便

# Lecture 08
> [!note]- slide
> ![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf]]

在phasor domain(频域)也能满足KVL和KCL

## Series & Parallel Impedance
电阻和阻抗可以理解成相同的东西. 串联电阻相加$\Leftrightarrow$串联阻抗相加
![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=7&rect=44,32,669,339]]

![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=9&rect=40,17,547,443|210]]
可以把电阻/电感/电容转换成阻抗然后变成一个元器件:
$$\begin{aligned}Z_1&=R+j\omega L\\Z_2&=R+\frac{1}{j\omega C}\\Z_3&=j\omega L+\frac{1}{j\omega C}\end{aligned}$$

并联:
$$\frac{1}{Z_{eq}}=\frac{1}{Z_1}+\frac{1}{Z_2}+\cdots$$

![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=11&rect=35,26,658,487]]

## Delta-Wye in Phasor Domain

![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=13&rect=51,87,677,405|496]]

## AC Phasor Analysis General Procedure

求解一个电路的步骤:
1. 将激励转换成cos的形式(对应phasor的标准形式)
2. 将电路转换成phasor domain(电路的电阻/电感/电容转换成阻抗)
3. 使用phasor domain的KCL或/和KVL列方程
4. 求解未知数
5. 将phasor domain的公式转换到原始的时域中

![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=17&rect=429,7,709,531|173]]

> [!example] 
> 对于上面一题的详细过程
> 
> ![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=16&rect=14,32,414,400|176]]![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=17&rect=5,29,412,404|175]]

> [!example] 
> ![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=18&rect=49,208,511,393]]
> 
> 转换成phasor domain:
> $$\left\{\begin{matrix}\text{电压源: }V=20\angle0^\circ=20\\\text{受控源: }I_x=\angle0^\circ i_x\\\text{电容: }Z_C=\frac{1}{j\omega C}=-j2.5\\\text{电感: }Z_L=j\omega L=j4\end{matrix}\right.$$
> ![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=18&rect=69,20,505,183]]
> 
> 使用KCL:
> $$\frac{20-V_1}{10}=\frac{V_1}{-j2.5}+\frac{V_1-V_2}{j4}$$
> $$\frac{V_1-V_2}{j4}+2I_x=\frac{V_2}{j2}$$
> $$I_x=\frac{V_1}{-j2.5}$$
> 三个未知数, 两个KCL方程, 一个电容的欧姆定律. 求解得到:
> $$I_x=7.59\angle108.4^\circ\Rightarrow i_x(t)=7.59\cos(4t+108.4^\circ)$$

> [!example]- 使用Mesh Current求解phasor domain
> 求$i_0(t)$: ![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=20&rect=74,228,435,439]]
> 
> ![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=21&rect=122,53,477,218

可以使用[[#Superposition|叠加定理]]求解:
> [!example]- superposition
> ![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=22&rect=55,53,611,439]]

注意, 在使用superposition的时候, 需要进行判断是否是同一个$\omega$. 在上述例题中, 阻抗是相同的, 因此可以认为两个电源的$\omega$是相同的.

> [!example]- 当电源的$\omega$不同时使用superposition
> ![[Pasted image 20251125093602.jpeg]]
> 
> 针对D.C.电压源:
> $$\omega=0\Rightarrow Z_C=\frac{1}{j\omega C}\to\infty,Z_L=j\omega L\to0$$
> 和之前的说法一样, 对于直流源, 电容等于断路, 电感等于短路. 此时电路只剩下一个直流源$5V$和一个$1\Omega$电阻和$4\Omega$电阻串联:
> $$v_0^1(t)=\frac{1}{1+4}\cdot-5=-1V$$
> 
> 对于振荡电压源: $\omega=2$, $V=10\angle0^\circ=10$
> - 电感: $Z_L=j\omega L=4j$
> - 电容: $Z_C=\frac{1}{j\omega C}=-5j$
> 
> $$V_0^2=\frac{1}{1+4j+\text{并联的阻抗}}\cdot10=2.498\angle-30.79^\circ$$
> $$v_0^2(t)=2.498\cos(2t-30.79^\circ)$$
> > [!tip]- 图片
> > ![[Pasted image 20251125093620.jpeg]]
> 
> 对于振荡电流源: $\omega=5$, $I=2\angle-90^\circ$
> - 电感: $Z_L=j\omega L=10j$
> - 电容: $Z_C=\frac{1}{j\omega C}=-2j$
> 
> $$I^3_0=\frac{10j}{10j+1+\text{并联的阻抗}}I_s=\frac{10j}{10j+1+\frac{-8j}{4-2j}}2\angle-90^\circ$$
> $$V_0^3=I^3_0\cdot 1=2.328\angle-80^\circ$$
> $$v_0^3(t)=2.328\cos(5t-80^\circ)$$
> 
> > [!tip]- 图片
> > ![[Pasted image 20251125093711.jpeg]]
> 
> $$\Rightarrow v_0(t)=v_0^1(t)+v_0^2(t)+v_0^3(t)=-1+2.498\cos(2t-30.79^\circ)+2.328\cos(5t-80^\circ)$$

### Thevenin for Phasor Domain

[[#Thevenin's Theorem]]在phasor domain也可以使用:
![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=24|EE111-F25Lec8-AC-SteadyStateAnalysis, page 24]]

Norton和Thevenin的转换也是[[#Source Transfer|相同的]]:
$$V_s=Z_sI_s\Leftrightarrow I_s=\frac{V_s}{Z_s}$$

Omp也相同:
![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=26|EE111-F25Lec8-AC-SteadyStateAnalysis, page 26]]

## Phasor Diagram

![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=29&rect=45,173,586,388]]

对于电容:
$$Z_C=\frac{1}{j\omega C}=\frac{V_C}{I_C}$$
$$I_C=j\omega CV_C=\omega C\angle90^\circ\cdot|V_c|\angle\phi$$

> [!example] 
> ![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=30&rect=340,367,643,490]]
> 
> 计算得到电流:
> $$I=\frac{V_s}{R+j\omega L-\frac{j}{\omega C}}=2e^{j66.87^\circ}$$
> 
> - 电阻: $V_R=R\cdot I_R=R\angle0^\circ\cdot I_R$
> - 电感: $V_L=j\omega LI_L=\omega L\angle90^\circ\cdot2\angle66.87^\circ=2\omega L\angle156.87^\circ=4\angle156.87^\circ$
> - 电容: $V_C=\frac{1}{j\omega C}I_C=8\angle-90^\circ\cdot2\angle66.87^\circ=16\angle-23.13^\circ$
> 
> 因此, 如果认为都是向量, 有: $V_s=V_R+V_L+V_C$
> ![[EE111-F25Lec8-AC-SteadyStateAnalysis.pdf#page=30&rect=305,40,665,279]]



