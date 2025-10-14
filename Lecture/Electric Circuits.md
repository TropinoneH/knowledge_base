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
> [!PDF|note] [[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=4&selection=11,1,16,18&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4]]
> > 𝑏 – number of branches
> 
> $b=5$
> 
> 有五个组件, 每个组件作为一个branch

> [!PDF|note] [[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=4&selection=20,0,24,15&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4]]
> > 𝑛 – number of nodes
> 
> $n=3$
> 
> 看上去有4个交点, 但是实际上这里的两个交点可以合并, 看成一个交点:
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=4&rect=141,248,303,343&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4|100]]
> 
> 因此实际上是3个node

> [!PDF|note] [[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=4&selection=28,0,32,15&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4]]
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
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=36&rect=547,331,584,408|EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis, p.36|100]]
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
> $$i_1-i_2=6$$
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

## 电容

平行班电容器:
![[EE111-F25Lec5-1st-Order Circuits.pdf#page=5&rect=14,242,439,445|EE111-F25Lec5-1st-Order Circuits, p.5]]

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
> 第一段电流:
> $$i=C\cdot\frac{dv}{dt}=0.6\times5=$$