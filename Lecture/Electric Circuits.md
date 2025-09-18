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
> ![[F25Lec1-Introduction & Circuit Terminology.pdf]]

exercise: [[F25Lec1-Introduction & Circuit Terminology.pdf#page=32|F25Lec1-Introduction & Circuit Terminology, p.32]]

计算功率:

$p_2$, $p_3$计算较为简单, 已有电压和电流, 是[[F25Lec1-Introduction & Circuit Terminology.pdf#page=22|Passive Sign Convention]], 直接计算:
$$p_2=5A\times12V=50W$$
$$p_3=6A\times8V=48W$$
出入电流应该相等, 因此$p_1$可以计算. 但是注意对于[[F25Lec1-Introduction & Circuit Terminology.pdf#page=19|电压源]]/[[F25Lec1-Introduction & Circuit Terminology.pdf#page=20|电流源]]需要看成反向, 因此加负号:
$$p_1=-5A\times20V=-100W$$
并联电路的电压相等, 因此$p_4$可以计算:
$$p_4=-1A\times8V=-8W$$

# Lecture 02
> [!note]- slide
> ![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf]]

## Kirchhoff's Law
示例:
> [!PDF|note] [[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=4&selection=11,1,16,18&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4]]
> > 𝑏 – number of branches
> 
> $b=5$
> 
> 有五个组件, 每个组件作为一个branch

> [!PDF|note] [[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=4&selection=20,0,24,15&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4]]
> > 𝑛 – number of nodes
> 
> $n=3$
> 
> 看上去有4个交点, 但是实际上这里的两个交点可以合并, 看成一个交点:
> ![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=4&rect=141,248,303,343&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4|100]]
> 
> 因此实际上是3个node

> [!PDF|note] [[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=4&selection=28,0,32,15&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.4]]
> > l – number of loops
> 
> $l=6$
> 
> 一共有三个小回路, 两个中回路, 一个大回路. 全部回路均计算

### Kirchhoff's Current Law (KCL)

![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=7&rect=166,74,406,275&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.7|201]]
有$i_2$, $i_5$的电流流出, 可以看作是有$-i_2-i_5$的电流流入. 由Kirchhoff's Laws得知:
$$i_1+i_3+i_4-i_2-i_5=0$$
> [!info]- proof
> 电荷守恒: 在一定时间内流入和流出的电荷相等:
> $$\int(i_1+i_3+i_4)dt=\int(i_2+i_5)dt$$

注意, 实际上做题的时候可能完全未知电流的方向, 但是这个无关紧要, 因为计算的结果含有符号. 因此如果结果为负数, 即为流向相反.

KCL中, 无需针对一个真实的"node", 可以针对一个黑盒. 这个黑盒内部无所谓是什么, 只要这个黑盒的流入流出电荷守恒即可:
![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=9&rect=366,108,588,291&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.9|173]]

$$i_1+i_2-i_3-i_4=0$$


| ![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=10&rect=60,125,237,409&color=note\|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.10\|120]] | ![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=10&rect=352,128,660,399&color=note\|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.10\|240]] |
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
> ![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=11&rect=204,129,512,327&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.11|328]]
> 
> $$-v_1+v_2+v_3-v_4+v_5=0$$
> 
> 一个写正负的方法是:
> 1. 首先假设一下每个元件的电压正负极
> 2. 顺时针走loop
> 3. 走的过程中, 首先遇到`-`就在该元件对应电压上加负号(相减), 首先遇到`+`就给对应电压使用正号(相加)

> [!example] [[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=13|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.13]]
> Path 1: $$-v_a+v_2+v_b=0$$
> 
> Path 2: $$-v_b-v_3+v_c=0$$
> 
> Path 3: $$-v_a+v_2-v_3+v_c=0$$

## 分压/分流
### Voltage Division

> [!example] 
> ![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=14&rect=83,266,341,431&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.14|530]]
> 
> KVL: $$-v+v_1+v_2=0$$
> $$v_1=i\cdot R_1$$
> $$v_2=i\cdot R_2$$
> $$v=i\cdot(R_1+R_2)$$
> 
> ![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=14&rect=394,261,638,441&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.14]]
> 
> $$v=i\times R_{eq}$$
> $$R_{eq}=R_1+R_2$$
> $$\Rightarrow v_1=\frac{R_1}{R_1+R_2}v,v_2=\frac{R_2}{R_1+R_2}v$$
> 正比分压
> $$\Rightarrow \frac{v_1}{v_2}=\frac{R_1}{R_2}$$

### Parallel Resistors

> [!example] 
> ![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=16&rect=38,236,307,431&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.16|519]]
> 
> $$i_1=\frac{v}{R_1},i_2=\frac{v}{R_2}$$
> KCL: $$i=i_1+i_2=v(\frac{1}{R_1}+\frac{1}{R_2}$$
> 
> 等效:
> ![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=16&rect=347,236,595,435&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.16|519]]
> $$i=\frac{v}{R_{eq}}$$
> $$\Rightarrow R_{eq}=\frac{1}{R_1}+\frac{1}{R_2}=\frac{R_1R_2}{R_1+R_2}$$
> $$G_{eq}=G_1+G_2$$

### Current Division
> [!example] 
> ![[F25Lec2-Kirchhoff and Node_Mesh_analysis.pdf#page=17&rect=383,294,647,482&color=note|F25Lec2-Kirchhoff and Node_Mesh_analysis, p.17|519]]
> 
> 反比分流
> $$\frac{i_1}{i_2}=\frac{R_2}{R_1}$$

