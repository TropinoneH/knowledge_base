---
type: lecture notes
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
> 使用网孔电流:
> 
> 对于左侧的mesh:
> $$-15+5i_1+10(i_1-i_2)+10=0$$
> 对于右侧的mesh:
> $$-10-10(i_1-i_2)+6i_2+4i_2=0$$
> 解得:
> $$i_1=i_2=1A$$
> 
> ![[EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis.pdf#page=36&rect=547,331,584,408|EE111-F25Lec2-Kirchhoff-and-Node_Mesh_analysis, p.36|30]]
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

