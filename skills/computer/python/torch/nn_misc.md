# torch.nn

## Linear

一个简单的线性映射, 或者也可以认为是一个投影

需要预先设置输入输出的维度, 但是可以使用`LazyLinear`来懒惰设置输入输出的dim

注意, 这里面的`weight`的shape和feature的dim正好是反过来的. 如, `nn.Linear(in_dim, out_dim)`, 那么这个`Linear`层的`weight.shape=(out_dim, in_dim)`
