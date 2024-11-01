# Propositional Logic

**Truth tables for coonnectives**

|   P   |   Q   | $\neg$ P | P$\wedge$Q | P$\vee$Q | P$\Rightarrow$Q | P$\Leftrightarrow$Q |
| :---: | :---: | :------: | :--------: | :------: | :-------------: | :-----------------: |
| **F** | **F** |    T     |     F      |    F     |        T        |          T          |
| **F** | **T** |    T     |     F      |    T     |        T        |          F          |
| **T** | **F** |    F     |     F      |    T     |        F        |          F          |
| **T** | **T** |    F     |     T      |    T     |        T        |          T          |

![image-20241017224807542](./04-Propositional%20Logic.assets/image-20241017224807542.png)

## Inference Rule

推理: 两个model为true的时候一定能推出下面的为true:
$$
\text{if }p_1=\neg q_1\\
\frac{p_1\or p_2\or\cdots\or p_n,\ \ \ q_1\or\cdots\or q_m}{p_2\or\cdots p_n\or q_2\or\cdots\or q_m}
$$
e.g. 请推导出$\text{KB}\models\alpha$

1. to prove $\text{KB}\models\alpha$, consider use contradiction by shown $\text{KB}\and\neg\alpha$ is unsatisfiable
2. expand $\text{KB}$ and $\alpha$ to CNF
3. use Inference rule:

![image-20241023130607187](./04-Propositional%20Logic.assets/image-20241023130607187.png)

## Horn Logic

首先将所有的Knowledge Base转写成$\Rightarrow$的格式($p_1\and\cdots\and p_n\Rightarrow q$)

### Forward chain

$q$所需要的前提($p_1,\cdots,p_n$)的个数$n$作为需要证实的数量.

如果$q$的证明有两条路线, 那么这两条路线需要的证据是分开计算的.

只要有一条路线的证据数量被满足($p_1\and\cdots\and p_n$为True), 那么认为$q$也为True

![image-20241023131641700](./04-Propositional%20Logic.assets/image-20241023131641700.png)

initial:
$$
P\Rightarrow Q\qquad1\\
L\and M\Rightarrow P\qquad2\\
B\and L\Rightarrow M\qquad2\\
A\and P\Rightarrow L\qquad2\\
A\and B\Rightarrow L\qquad2\\
\text{agenda: }[A,B]
$$
step 1:
$$
P\Rightarrow Q\qquad1\\
L\and M\Rightarrow P\qquad2\\
B\and L\Rightarrow M\qquad2\\
A\and P\Rightarrow L\qquad1\\
A\and B\Rightarrow L\qquad1\\
\text{agenda: }[B]
$$
step 2:
$$
P\Rightarrow Q\qquad1\\
L\and M\Rightarrow P\qquad2\\
B\and L\Rightarrow M\qquad1\\
A\and P\Rightarrow L\qquad1\\
A\and B\Rightarrow L\qquad0\\
\text{agenda: }[L]
$$
step 3:
$$
P\Rightarrow Q\qquad1\\
L\and M\Rightarrow P\qquad1\\
B\and L\Rightarrow M\qquad0\\
A\and P\Rightarrow L\qquad1\\
A\and B\Rightarrow L\qquad0\\
\text{agenda: }[M]
$$
step 4:
$$
P\Rightarrow Q\qquad1\\
L\and M\Rightarrow P\qquad0\\
B\and L\Rightarrow M\qquad0\\
A\and P\Rightarrow L\qquad1\\
A\and B\Rightarrow L\qquad0\\
\text{agenda: }[P]
$$
step 5:
$$
P\Rightarrow Q\qquad0\\
L\and M\Rightarrow P\qquad0\\
B\and L\Rightarrow M\qquad0\\
A\and P\Rightarrow L\qquad0\\
A\and B\Rightarrow L\qquad0\\
\text{agenda: }[Q]
$$
Then, we can obtain the final $Q$ by knowledge base

### Backward chain

找到需要证明的内容, 然后找如果要证明这个命题需要证明哪些

不断回溯, 知道找到已证明(true)的内容

# First-Order Logic

Pros of Propositional Logic:

- 比较简单

- 支持命题操作比较多

- 可以将简单的逻辑组合, 推导出新的知识

  $B_{1,1}\and P_{1,2}\Rightarrow B_{1,1}$

- 上下文无关 context-independent

Cons of Propositional Logic:

- 很难表述一个单独的单词
- 很难表述数字
- 很难表示关系
- Generalizations, patterns, regularities can’t easily be represented (e.g., “all triangles have 3 sides”)



一阶谓词逻辑

假设world包含:

- Object: 人, 房子, 颜色, ...
- Relations: red, round, prime, bigger than, ...
- Functions: father of, best friend of, ...

假设了world中存在一些事实



Basic Element

Logic Symbols:

- Connectives $\neg,\and,\or,\Rightarrow,\Leftrightarrow$
- Quantifiers $\forall,\exists$
- Variables
- Equality $=$

Non-Logic Symbols:

- Constants `KingJohn, 2 (numbers), ShanghaiTech, ...`
- Predications `Brother, >, ...`
- Functions `Sqrt, LeftLegOf, ...`



Atomic Sentences: `Predicate(term1, term2, ...)` or `term1 = term2`

Term: `Constants` or `Variables` or `Function(term1, term2, ...)`

一个原子语句`Function(term1, term2, ...)`是正确的当且仅当object `term1, term2, ...`是在`Predicate`所描述的`relation`中



Model的数量是infinity的

## Inference

- Universal  Instantiation
  $$
  \frac{\forall x\ \alpha}{\text{Subst}(\{x/g\},\alpha)}
  $$
  e.g. $\forall x,\ \text{King}(x)\and \text{Greedy}(x)\Rightarrow\text{Evil}(x)$ 可以推出 $\text{King}(\text{anyone})\and\text{Greedy(anyone)} \Rightarrow \text{Evil(anyone)}$ 

- Exists Instantiation
  $$
  \frac{\exists x\ \alpha}{\text{Subst}(\{x/k\},\alpha)}
  $$
  e.g. $\exists x,\ \text{Crown}(x)\and\text{OnHead}(x,\text{John})$ 可以推出 $\text{Crown}(C_1)\and\text{OnHead}(C_1,\text{John})$

  被称为Skolemization, 其中$C_1$称为Skolem symbol

一般使用$\Rightarrow$和$\forall$配合, 一般使用$\and$和$\exists$配合

### Unify

![image-114514](./04-Propositional%20Logic.assets/image-20241018104940642.png)

$\mathbf{Unify}(\alpha,\beta)=\theta\iff\alpha\theta=\beta\theta$

第四行的表示的原因是两个sentence, 表示的变量名重复但是表示的含义不同. 因此需要标准化: 不同变量需要有不同变量名

为了`Unify`$\text{Know(John,$x$)}$和$\text{Know($y, z$)}$, 需要给变量赋值. 其中两种为:

- $\theta=\{y/\text{John}, x/z\}$ or $\theta=\{y/\text{Jonh},x/\text{John},y/\text{John}\}$

有一个最泛化的Unify的方式:

- $\text{MGU}=\{y/\text{John},x/z\}$

## Horn Logic

Generalized Modus Pones(`GMP`):
$$
\frac{p_1',\cdots,p_n',\qquad p_1\and\cdots p_n\Rightarrow q}{q\theta}\qquad\text{where $p'_i\theta=p_i\theta$ for all $i$}
$$
e.g.

$(\text{King}(x)\and\text{Greedy}(x)\Rightarrow\text{Evil}(x))$, $\text{King(John})$, $\text{Greedy(y)}$

- $p'_1$ is $\text{King(John)}$, $p_1$ is $\text{King}(x)$
- $p'_2$ is $\text{Greedy(y)}$, $p_2$ is $\text{Greedy}(x)$
- Therefore, $\theta=\{x/\text{John}, y/\text{John}\}$
- $q$ is $\text{Evil}(x)$, $q\theta$ is $\text{Evil(John)}$

### Forward Chaining

e.g.

> The US law says that it is a crime for an American to sell weapons to hostile nations. The country Nono, an enemy of America, has some missiles, and all of its missiles were sold to it by Colonel West, who is American.
> Prove that Col. West is a criminal.

![image-20241030130921561](./04-Propositional%20Logic.assets/image-20241030130921561.png)

![image-20241030131001445](./04-Propositional%20Logic.assets/image-20241030131001445.png)

![image-20241030131434438](./04-Propositional%20Logic.assets/image-20241030131434438.png)

![image-20241030131443437](./04-Propositional%20Logic.assets/image-20241030131443437.png)

![image-20241030131022869](./04-Propositional%20Logic.assets/image-20241030131022869.png)

前向推理的性质:

- 对于一阶Horn Logic而言, FC是complete的
- 如果一阶谓词逻辑(FOL)没有function(Datalog), 那么FC在有限步数内终止
- 一般而言, 如果$\alpha$没有entail, 那么FC可能不会终止.
  - 这是不可避免的

### Backward Chaining

![image-20241030131455794](./04-Propositional%20Logic.assets/image-20241030131455794.png)

![image-20241030131504421](./04-Propositional%20Logic.assets/image-20241030131504421.png)

![image-20241030131512571](./04-Propositional%20Logic.assets/image-20241030131512571.png)

![image-20241030131519840](./04-Propositional%20Logic.assets/image-20241030131519840.png)

![image-20241030131527978](./04-Propositional%20Logic.assets/image-20241030131527978.png)

后向推理的性质:

- 使用DFS进行搜索. 搜索的空间占用和证明所需要的大小呈线性关系
- 通过检查当前目标和堆栈中的每个目标, 避免无限循环
- 通过缓存当前的结果, 避免重复子目标

### Resolution(Inference Rule)

$$
\frac{l_1\or\cdots\or l_k,\qquad m_1\or\cdots\or m_n}{(l_2\or\cdots\or l_k\or m_2\or\cdots\or m_n)\theta}\\\\
\text{where }\mathbf{Unify}(l_1,\neg m_1)=\theta
$$

> e.g.
> $$
> \frac{\neg\text{Rich}(x)\or\text{Unhappy(x)}\qquad\text{Rich(Ken)}}{\text{Unhappy(Ken)}}\\
> \text{with }\theta=\{x\text{/Ken}\}
> $$

## Conversion to CNF

$$
\forall x[\forall y\text{ Animal}(y)\Rightarrow\text{ Loves}(x,y)]\Rightarrow\exists y\text{ Loves}(y,x)
$$

1. Eliminate biconditionals and implications
   $$
   \forall x[\neg\forall y\ \neg\text{Animal}(y)\or\text{Loves}(x,y)]\or[\exists y\text{ Loves}(y,x)]
   $$

2. Move $\neg$ inwards:

   - $\neg\forall x\ p\equiv\exists x\ \neg p$
   - $\neg\exists x\ p\equiv\forall x\ \neg p$

   $$
   \forall x[\exists y\text{ Animal}(y)\and\neg\text{Loves}(x,y)]\or[\exists y\text{ Loves}(y,x)]
   $$

3. Standardize variables: 对于每一个语句, 都需要使用不同的变量
   $$
   \forall x[\exists y\text{ Animal}(y)\and\neg\text{Loves}(x,y)]\or[\exists z\text{ Loves}(z,x)]
   $$

4. Skolemize: 将变量替换成一个特定的值
   $$
   \forall x[\text{Animal}(F(x))\and\neg\text{Loves}(x, F(x))]\or\text{Loves}(G(x),x)
   $$

5. Drop universal quantifierfs:
   $$
   [\text{Animal}(F(x))\and\neg\text{Loves}(x,F(x))]\or\text{Loves}(G(x),x)
   $$

6. Distribute $\or$ over $\and$
   $$
   [\text{Animal}(F(x))\or\text{Loves}(G(x),x)]\and[\neg\text{Loves}(x,F(x))\or\text{Loves}(G(x),x)]
   $$
   
