---
tags:
  - math
  - tutorial
---
%% TODO %%
# Basic Concepts and Notation

- $\mathbf A\in\mathbb R^{m\times n}$表示一个$m$行$n$列的矩阵. 第一个$m$表示横向一共$m$行, 第二个$n$表示竖列一共$n$列
- $\mathbf x\in\mathbb R^{n}$表示一个$n$行的列向量$\mathbf x$, 如果要表示一个行向量, 那么用$\mathbf x^T$表示
- $\mathbf x_i$表示向量$\mathbf x$的第$i$个元素: $\mathbf x=\begin{bmatrix}x_1\\x_2\\\vdots\\x_n\end{bmatrix}$
- 用$a_{ij}$或$\mathbf A_{ij}$或$\mathbf A_{i,j}$表示矩阵$\mathbf A$的$i$行$j$列个元素
- $a_j$或$\mathbf A_j$表示第$j$列$\mathbf A_j=\begin{bmatrix}\cdots&\vert&\cdots\\\cdots&\mathbf A_j&\cdots\\\cdots&\vert&\cdots\end{bmatrix}$
- $a_i^T$或者$\mathbf A_i^T$表示第$i$行$\mathbf A_j=\begin{bmatrix}&\vdots&\\-&\mathbf A_i^T&-\\&\vdots&\end{bmatrix}$

注意$a_1$和$a_1^T$是两个含义完全不一样的向量. 一个是列向量, 另一个是行向量

# Matrix Multiplication

## Vector-Vector Multiplication

假设$\mathbf {x,y}\in\mathbb R^n$, 那么认为$\mathbf x^T\mathbf y=\begin{bmatrix}x_1&\cdots&x_n\end{bmatrix}\begin{bmatrix}y_1\\\vdots\\y_n\end{bmatrix}=\sum_{i=1}^nx_iy_i$称作向量内积(**Inner product**)

注意, 很显然的是, $\mathbf x^Y\mathbf y=\mathbf y^T\mathbf x$



假设$\mathbf x\in\mathbb R^m,\mathbf y\in\mathbb R^n$, 那么$\mathbf x\mathbf y^T=\begin{bmatrix}x_1y_1&\cdots&x_ny_1\\\vdots&\ddots&\vdots\\x_ny_1&\cdots&x_ny_m\end{bmatrix}$称作矩阵外积(**Outer product**)

## Matrix-Vector Multiplication

假设$\mathbf A\in\mathbb R^{m\times n}, \mathbf x\in\mathbb R^n$, 那么乘积$\mathbf y=\mathbf {Ax}=\begin{bmatrix}-&a_1^T&-\\&\vdots&\\-&a_m^T&-\end{bmatrix}\mathbf x=\begin{bmatrix}-&a_1^T\mathbf x&-\\&\vdots&\\-&a_m^T\mathbf x&-\end{bmatrix}\in\mathbb R^m$

或者写成对x的线性规划的形式: $\mathbf y=\mathbf{Ax}=$