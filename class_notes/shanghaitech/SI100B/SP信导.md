# 信号频率表示

## 傅里叶级数

用于算周期函数:$x(t)=\sum_{k=-\infty}^{\infty}a_ke^{jk\omega_0t}=\sum_{k=-\infty}^{\infty}a_ke^{jk(\frac{2\pi}{T})t}$

$a_k$是由傅里叶公式算(?)

在信号处理中,一般把复数的`i`写成`j`

算离散函数:$x[n]=\sum_{k=-\infty}^{\infty}a_ke^{jk\omega_0n}=\sum_{k=-\infty}^{\infty}a_ke^{jk(\frac{2\pi}{N})n}$

离散的情况:$a_k=\sum_{k\in<N>}x[n]e^{-jk\omega_0n}=\sum_{k\in<N>}x[n]e^{-jk(\frac{2\pi}{N})n}$

对于非周期的函数:理解该函数的周期为无穷大,于是这样就能把傅里叶级数推广到傅里叶变换

## 连续傅里叶变换

$X(e^{j\omega})=\sum_{n=-\infty}^\infty x[n]e^{-j\omega n},\omega=\frac{2\pi f}{f_s}$

$x[n]=\frac{1}{2\pi}\int_{-\pi}^\pi X(e^{j\omega})e^{j\omega n}d\omega,\omega=\frac{2\pi f}{f_s}$

$X(j\Omega)=\int^\infty_{-\infty}x(t)e^{-j\Omega t}dt,\Omega=2\pi f$

$x(t)=\frac{1}{2\pi}\int_{-\infty}^\infty X(j\Omega)e^{j\Omega t}dt$

## 信号分析

$$
\sum_{n\in<N>}e^{j(k_1-k_2)\omega_0n}=N(for\ k_1=k_2);\ \ 0(for\ k_1\neq k_2)
$$

这样来对信号进行分析