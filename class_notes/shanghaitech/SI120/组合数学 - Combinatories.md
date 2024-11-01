# 组合数学 - Combinatories

## 前置知识

<h4>函数与集合 - set and function</h4>

1. injection单射: $a\neq b\Rightarrow f(a)\neq f(b)$, 或$f(a)=f(b)\Rightarrow a=b$
2. surjection满射: $\forall b\in B,\exists a\in A, f(a)=b$
3. bijection双射: 同时满足双射和单射

<h4>基数 - Cardinality</h4>

定义1: 令$A$是一个集合, 如果$A$有可数的元素个数, 那么$A$是可数集(finite set). 否则, $A$是无限集(infinite set)

定义: 一个可数集$A$中的基数$|A|$就是$A$中元素的个数.

定义:

1. $|A|=|B|\Leftrightarrow f:A\to B$ 是一个双射
2. $|A|\leq|B|\Leftarrow f:A\to B$ 是一个单射
3. $|A|\leq|B|\Leftarrow f:A\to B$ 是一个单射, 但是不是一个满射

定理: $|A|=|B|,|B|=|C|\Leftarrow |A|=|C|$

例子: $|\mathbb Z^+|=|\mathbb N|=|\mathbb Q|=|\mathbb Q^+|=|\mathbb Z|$, $|\mathbb R|=|\mathbb R^+|=|(0,1)|=|[0,1]|$

<h4>可列和不可列 - Countable and Uncountable</h4>

定义: 如果$|A|<\infty$或者$|A|=|mathbb Z|$, 那么$A$是可列的. 否则, $A$是不可列的

<h4>Schroder-Bernstein Theorem</h4>

用于比较两集合的基数.

定理:  $|A|\geq|B|,|B|\geq|A|\Leftrightarrow|A|=|B|$, 这里可以用单射证明

