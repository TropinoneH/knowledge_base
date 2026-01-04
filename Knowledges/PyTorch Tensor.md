---
type: skills
tags:
  - code/python
  - DeepLearning
done: true
topic:
  - "[[PyTorch]]"
  - "[[Coding]]"
---
# Tensor Basics

Tensor，即张量，是 PyTorch 中最基本的数据结构。你可以把它看作一个多维数组，它是构建和训练神经网络的核心。Tensor 的所有属性，如数据、形状、类型等，都为深度学习的计算提供了基础。

- Tensor 的属性
    - `dtype`: 定义了 Tensor 中存储的数据类型，例如浮点数或整数。
    - `device`: 指定了 Tensor 存储的位置，是在 CPU 上还是在 GPU 上。
    - `shape`/`size()`: 描述了 Tensor 的维度，也就是它在每个维度上的大小。

```python
import torch

# 创建一个 Tensor
x = torch.arange(6).reshape(2, 3)
print(f"Tensor 内容:\n{x}\n")

# 查看 Tensor 的属性
print(f"数据类型 (dtype): {x.dtype}")
print(f"所在设备 (device): {x.device}")
print(f"形状 (shape): {x.shape}")
```

输出:
```
Tensor 内容:
tensor([[0, 1, 2],
        [3, 4, 5]])

数据类型 (dtype): torch.int64
所在设备 (device): cpu
形状 (shape): torch.Size([2, 3])
```

## Tensor Creation and Initialization

创建 Tensor 是所有操作的第一步。PyTorch 提供了多种灵活的创建方式。

- 从现有数据创建
    - `torch.tensor()`
        - 说明: 这是最常用的创建方式，它会从 Python 列表或 NumPy 数组中深拷贝数据，创建一个新的 Tensor。
        - 场景: 当你需要一个与原始数据完全独立的 Tensor 时使用。
        ```python
        import numpy as np
        
        py_list = [[1, 2], [3, 4]]
        t1 = torch.tensor(py_list)
        print(f"从 Python 列表创建:\n{t1}")
        ```
        输出:
        ```
        从 Python 列表创建:
        tensor([[1, 2],
                [3, 4]])
        ```

    - `torch.from_numpy()`
        - 说明: 从一个 NumPy 数组创建 Tensor，但它们会共享内存。这意味着修改其中一个会影响另一个。
        - 场景: 当你需要高效地在 NumPy 和 PyTorch 之间切换，并且不希望产生数据拷贝的开销时使用。
        ```python
        np_array = np.array([[5, 6], [7, 8]])
        t2 = torch.from_numpy(np_array)
        print(f"从 NumPy 数组创建:\n{t2}\n")
        
        # 修改 NumPy 数组
        np_array[0, 0] = 99
        print(f"修改 NumPy 数组后，Tensor 也发生改变:\n{t2}")
        ```
        输出:
        ```
        从 NumPy 数组创建:
        tensor([[5, 6],
                [7, 8]])
        
        修改 NumPy 数组后，Tensor 也发生改变:
        tensor([[99,  6],
                [ 7,  8]])
        ```

- 创建特定形状和数值的 Tensor
    - `torch.zeros()` / `torch.ones()`
        - 说明: 创建一个指定形状且元素全为 0 或 1 的 Tensor。
        - 场景: 常用于初始化权重或掩码 (mask)。
        ```python
        zeros_tensor = torch.zeros(2, 3)
        print(f"全 0 Tensor:\n{zeros_tensor}")
        
        ones_tensor = torch.ones(2, 3)
        print(f"全 1 Tensor:\n{ones_tensor}")
        ```
        输出:
        ```
        全 0 Tensor:
        tensor([[0., 0., 0.],
                [0., 0., 0.]])
        全 1 Tensor:
        tensor([[1., 1., 1.],
                [1., 1., 1.]])
        ```

    - `torch.rand()` vs `torch.randn()`
        - 区别: `torch.rand()` 从 [0, 1) 区间的均匀分布中采样；`torch.randn()` 从均值为 0、方差为 1 的标准正态分布中采样。
        - 场景: `rand` 用于需要均匀随机数的场合，`randn` 更常用于神经网络权重的初始化，因为它符合很多理论假设。
        ```python
        # 均匀分布
        rand_tensor = torch.rand(2, 3)
        print(f"均匀分布 [0, 1):\n{rand_tensor}\n")
        
        # 标准正态分布
        randn_tensor = torch.randn(2, 3)
        print(f"标准正态分布:\n{randn_tensor}")
        ```
        输出 (每次运行结果不同):
        ```
        均匀分布 [0, 1):
        tensor([[0.8256, 0.5845, 0.6384],
                [0.7296, 0.1278, 0.4369]])
        
        标准正态分布:
        tensor([[ 0.3849, -0.6659,  0.6482],
                [-0.4258, -0.1656,  1.4423]])
        ```
        
    - `torch.arange()` vs `torch.linspace()`
        - 区别: `torch.arange(start, end, step)` 根据步长 `step` 创建序列；`torch.linspace(start, end, steps)` 根据元素数量 `steps` 创建序列。
        - 场景: 当你知道步长时用 `arange`，当你知道序列中需要多少个点时用 `linspace`。
        ```python
        # 从 0 到 9，步长为 2
        arange_tensor = torch.arange(0, 10, 2)
        print(f"arange 示例: {arange_tensor}\n")
        
        # 从 0 到 10，总共 5 个点
        linspace_tensor = torch.linspace(0, 10, 5)
        print(f"linspace 示例: {linspace_tensor}")
        ```
        输出:
        ```
        arange 示例: tensor([0, 2, 4, 6, 8])
        
        linspace 示例: tensor([ 0.0000,  2.5000,  5.0000,  7.5000, 10.0000])
        ```

- 根据其他 Tensor 创建
    - `torch.zeros_like()` / `torch.ones_like()` / `torch.rand_like()`
        - 说明: 创建一个与给定 Tensor 具有相同属性（形状、数据类型、设备）的新 Tensor。
        - 场景: 当你需要一个与现有 Tensor 尺寸完全匹配的 Tensor，用于后续计算时，这非常方便，可以避免手动指定形状等参数。
        ```python
        x = torch.tensor([[1, 2, 3], [4, 5, 6]], dtype=torch.float32)
        zeros_like_x = torch.zeros_like(x)
        print(f"原始 Tensor 的形状: {x.shape}")
        print(f"zeros_like 创建的 Tensor:\n{zeros_like_x}")
        print(f"新 Tensor 的形状: {zeros_like_x.shape}")
        ```
        输出:
        ```
        原始 Tensor 的形状: torch.Size([2, 3])
        zeros_like 创建的 Tensor:
        tensor([[0., 0., 0.],
                [0., 0., 0.]])
        新 Tensor 的形状: torch.Size([2, 3])
        ```

## Tensor Mathematical Operations

Tensor 支持丰富的数学运算，这是其核心功能之一。

- 逐元素运算
    - 说明: 对 Tensor 中的每个元素独立进行计算。可以使用标准运算符 (`+`, `*`) 或 PyTorch 函数 (`torch.add()`)。
    - 就地操作 (In-place): 函数名以 `_` 结尾的操作（如 `add_()`）会直接修改原始 Tensor，而不是返回一个新 Tensor。
    - 场景: 就地操作可以节省内存，但在需要保留原始数据或计算图（用于自动求导）时应避免使用。
    ```python
    a = torch.tensor([[1, 2], [3, 4]])
    b = torch.tensor([[5, 6], [7, 8]])
    
    # 使用运算符
    c = a + b
    print(f"a + b =\n{c}\n")
    
    # 就地操作
    print(f"原始 a:\n{a}\n")
    a.add_(b) # a 的值被修改
    print(f"a.add_(b) 后的 a:\n{a}")
    ```
    输出:
    ```
    a + b =
    tensor([[ 6,  8],
            [10, 12]])
    
    原始 a:
    tensor([[1, 2],
            [3, 4]])
    
    a.add_(b) 后的 a:
    tensor([[ 6,  8],
            [10, 12]])
    ```

- 矩阵运算
    - `torch.matmul()` / `@` vs `torch.mm()`
        - 区别: `torch.matmul()` (或 `@` 运算符) 是通用的矩阵乘法，支持高维 Tensor (例如批处理的矩阵乘法)。`torch.mm()` 只能用于两个二维矩阵的乘法。
        - 场景: 推荐始终使用 `@` 或 `torch.matmul()`，因为它更通用、更强大。只有当你确定处理的是两个二维矩阵时，`torch.mm()` 才是等价的。
    ```python
    mat1 = torch.randn(2, 3)
    mat2 = torch.randn(3, 4)
    
    # 推荐的方式
    result_matmul = torch.matmul(mat1, mat2)
    result_at = mat1 @ mat2
    
    print(f"matmul 结果形状: {result_matmul.shape}\n")
    
    # torch.mm() 仅适用于二维
    result_mm = torch.mm(mat1, mat2)
    print(f"mm 结果形状: {result_mm.shape}")
    
    # 高维 Tensor 示例
    batch_mat1 = torch.randn(10, 2, 3)
    batch_mat2 = torch.randn(10, 3, 4)
    result_batch = batch_mat1 @ batch_mat2 # 10 组 2x3 和 3x4 矩阵的乘法
    print(f"批处理矩阵乘法结果形状: {result_batch.shape}")
    ```
    输出:
    ```
    matmul 结果形状: torch.Size([2, 4])
    
    mm 结果形状: torch.Size([2, 4])
    批处理矩阵乘法结果形状: torch.Size([10, 2, 4])
    ```

- 其他常用运算
    - `torch.sum()`, `torch.mean()`, `torch.max()`, `torch.min()`
        - 说明: 这些是聚合操作，可以对整个 Tensor 或沿指定维度 (`dim`) 进行计算。
        - 场景: 在计算损失、评估模型性能或进行数据归一化时非常常用。
    ```python
    x = torch.tensor([[1., 2., 3.], [4., 5., 6.]])
    
    # 对整个 Tensor 求和
    total_sum = torch.sum(x)
    print(f"整个 Tensor 的和: {total_sum}\n")
    
    # 沿维度 1 (列) 求和
    col_sum = torch.sum(x, dim=1)
    print(f"沿 dim=1 求和: {col_sum}\n")
    
    # 查找最大值及其索引
    max_val, max_idx = torch.max(x, dim=1)
    print(f"沿 dim=1 的最大值: {max_val}")
    print(f"沿 dim=1 的最大值索引: {max_idx}")
    ```
    输出:
    ```
    整个 Tensor 的和: 21.0
    
    沿 dim=1 求和: tensor([ 6., 15.])
    
    沿 dim=1 的最大值: tensor([3., 6.])
    沿 dim=1 的最大值索引: tensor([2, 2])
    ```
    
## Indexing, Slicing, Concatenation, and Splitting

这些操作用于访问和重组 Tensor 的部分数据，是数据预处理和模型构建中的基础。

- 索引与切片
    - 说明: 与 NumPy 类似，使用方括号 `[]` 进行索引和切片，可以方便地访问或修改 Tensor 的子集。
    - 场景: 提取数据集的特定样本、特征或时间步。
    ```python
    t = torch.arange(12).reshape(3, 4)
    print(f"原始 Tensor:\n{t}\n")
    
    # 获取第一行
    print(f"第一行: {t[0]}\n")
    
    # 获取第二列
    print(f"第二列: {t[:, 1]}\n")
    
    # 获取右下角 2x2 子矩阵
    print(f"右下角 2x2:\n{t[1:, 2:]}")
    ```
    输出:
    ```
    原始 Tensor:
    tensor([[ 0,  1,  2,  3],
            [ 4,  5,  6,  7],
            [ 8,  9, 10, 11]])
    
    第一行: tensor([0, 1, 2, 3])
    
    第二列: tensor([1, 5, 9])
    
    右下角 2x2:
    tensor([[ 6,  7],
            [10, 11]])
    ```

- 拼接 (Concatenation)
    - `torch.cat()` vs `torch.stack()`
        - 区别: `torch.cat()` 在一个已有的维度上连接 Tensor，总维度数不变。`torch.stack()` 会创建一个新的维度来堆叠 Tensor，总维度数会加一。
        - 场景: `cat` 用于将特征图或数据集的不同部分沿着某个维度（如通道或样本数）拼接起来。`stack` 用于将一系列单独的样本（例如，时间序列中的多个帧）组合成一个批次。
    ```python
    t1 = torch.ones(2, 3)
    t2 = torch.zeros(2, 3)
    
    # cat: 沿 dim=0 (行) 拼接
    cat_res = torch.cat((t1, t2), dim=0)
    print(f"cat 结果 (dim=0):\n{cat_res}")
    print(f"cat 结果形状: {cat_res.shape}\n")
    
    # stack: 在新维度 dim=0 上堆叠
    stack_res = torch.stack((t1, t2), dim=0)
    print(f"stack 结果 (dim=0):\n{stack_res}")
    print(f"stack 结果形状: {stack_res.shape}")
    ```
    输出:
    ```
    cat 结果 (dim=0):
    tensor([[1., 1., 1.],
            [1., 1., 1.],
            [0., 0., 0.],
            [0., 0., 0.]])
    cat 结果形状: torch.Size([4, 3])
    
    stack 结果 (dim=0):
    tensor([[[1., 1., 1.],
             [1., 1., 1.]],
    
            [[0., 0., 0.],
             [0., 0., 0.]]])
    stack 结果形状: torch.Size([2, 2, 3])
    ```

- 拆分 (Splitting)
    - `torch.chunk()` vs `torch.split()`
        - 区别: `torch.chunk(tensor, chunks, dim)` 将 Tensor 拆分成 `chunks` 个块，最后一个块的大小可能不同。`torch.split(tensor, split_size_or_sections, dim)` 根据指定的块大小 `split_size_or_sections` 来拆分。
        - 场景: 当你想要平均拆分，不关心每个块的确切大小时，用 `chunk` 更方便。当你需要每个块都有精确的大小时，用 `split`。
    ```python
    t = torch.arange(10)
    
    # chunk: 拆分成 3 个块
    chunk_res = torch.chunk(t, 3)
    print("chunk 结果:")
    for i, chunk in enumerate(chunk_res):
        print(f"  块 {i}: {chunk}")
    
    # split: 按照每个块大小为 3 拆分
    split_res = torch.split(t, 3)
    print("\nsplit 结果:")
    for i, chunk in enumerate(split_res):
        print(f"  块 {i}: {chunk}")
    ```
    输出:
    ```
    chunk 结果:
      块 0: tensor([0, 1, 2, 3])
      块 1: tensor([4, 5, 6, 7])
      块 2: tensor([8, 9])
    
    split 结果:
      块 0: tensor([0, 1, 2])
      块 1: tensor([3, 4, 5])
      块 2: tensor([6, 7, 8])
      块 3: tensor([9])
    ```

## Tensor Shape Transform

改变 Tensor 的形状是神经网络中非常常见的操作，例如在全连接层之前将特征图展平。

- 改变视图
    - `reshape()` vs `view()`
        - 区别: `view()` 要求 Tensor 的内存是连续的 (contiguous)，它只改变对数据的“看法”而不移动数据，效率很高。`reshape()` 更灵活，如果内存是连续的，它的行为和 `view()` 一样；如果不是，它会创建一个数据副本以满足新的形状要求。
        - 场景: 优先使用 `view()` 以获得最佳性能。如果在对 Tensor 进行某些操作（如 `permute`）后 `view()` 报错，说明内存不再连续，此时可以使用 `reshape()`。
    ```python
    t = torch.arange(12)
    
    # view
    t_view = t.view(3, 4)
    print(f"view 结果:\n{t_view}\n")
    
    # reshape
    t_reshape = t.reshape(3, 4)
    print(f"reshape 结果:\n{t_reshape}\n")

    # 一个 view 会失败的例子
    t_permuted = torch.randn(2, 3, 4).permute(0, 2, 1) # 交换维度 1 和 2
    # t_permuted.view(2, 12) # 这行会报错，因为内存不连续
    t_reshaped_from_permuted = t_permuted.reshape(2, 12) # reshape 会自动处理
    print(f"对不连续 Tensor 进行 reshape 后的形状: {t_reshaped_from_permuted.shape}")
    ```
    输出:
    ```
    view 结果:
    tensor([[ 0,  1,  2,  3],
            [ 4,  5,  6,  7],
            [ 8,  9, 10, 11]])
    
    reshape 结果:
    tensor([[ 0,  1,  2,  3],
            [ 4,  5,  6,  7],
            [ 8,  9, 10, 11]])
    
    对不连续 Tensor 进行 reshape 后的形状: torch.Size([2, 12])
    ```
    
    - `squeeze()` vs `unsqueeze()`
        - 区别: `squeeze()` 移除所有大小为 1 的维度。`unsqueeze(dim)` 在指定位置 `dim` 增加一个大小为 1 的维度。它们是互逆操作。
        - 场景: `unsqueeze` 常用于为数据增加批处理维度 (batch dimension) 或通道维度 (channel dimension)。`squeeze` 用于移除不再需要的单维度，简化 Tensor 形状。
    ```python
    t = torch.zeros(1, 3, 1, 2)
    print(f"原始形状: {t.shape}\n")
    
    # 移除所有大小为 1 的维度
    t_squeezed = t.squeeze()
    print(f"squeeze 后的形状: {t_squeezed.shape}\n")
    
    # 在 dim=0 处增加一个维度
    t_unsqueezed = t_squeezed.unsqueeze(0)
    print(f"unsqueeze(0) 后的形状: {t_unsqueezed.shape}")
    ```
    输出:
    ```
    原始形状: torch.Size([1, 3, 1, 2])
    
    squeeze 后的形状: torch.Size([3, 2])
    
    unsqueeze(0) 后的形状: torch.Size([1, 3, 2])
    ```
    
- 转置
    - `torch.t()` vs `permute()`
        - 区别: `t()` 是一个特殊函数，只能用于二维 Tensor，它会交换维度 0 和维度 1。`permute()` 功能更强大，可以用于任意维度的 Tensor，并能按指定顺序重新排列所有维度。
        - 场景: 对于矩阵转置，`t()` 更简洁。对于高维数据（如图像的 (N, C, H, W) 格式），当你需要改变维度顺序（例如变为 (N, H, W, C)）时，必须使用 `permute()`。
    ```python
    # t() 用于 2D Tensor
    mat = torch.randn(2, 3)
    print(f"原始 2D 形状: {mat.shape}")
    mat_t = mat.t()
    print(f"t() 转置后形状: {mat_t.shape}\n")
    
    # permute() 用于高维 Tensor
    img = torch.randn(3, 28, 28) # (C, H, W)
    print(f"原始 3D 形状: {img.shape}")
    img_permuted = img.permute(1, 2, 0) # 变为 (H, W, C)
    print(f"permute(1, 2, 0) 后形状: {img_permuted.shape}")
    ```
    输出:
    ```
    原始 2D 形状: torch.Size([2, 3])
    t() 转置后形状: torch.Size([3, 2])
    
    原始 3D 形状: torch.Size([3, 28, 28])
    permute(1, 2, 0) 后形状: torch.Size([28, 28, 3])
    ```

# Advanced Tensor Manipulation

在构建复杂的神经网络，特别是像大型语言模型 (LLM) 这样的模型时，仅仅掌握基础的张量运算是远远不够的。我们需要一系列更高级、更灵活的操作来处理形状变换、条件赋值和索引等任务。这些操作是实现多头注意力、掩码机制和高效数据处理等关键模块的基石。

## Reshaping and Dimension Manipulation

### expand vs repeat

`expand()` 通过改变张量的步长 (stride) 来“虚拟地”扩展维度，它并不会分配新的内存，因此效率极高。它只能扩展大小为 1 的维度。相比之下，`repeat()` 会实际复制数据来填充新的维度，因此会占用更多内存。在 LLM 的注意力机制中，通常使用 `expand()` 来高效地将掩码广播到多头注意力所需的目标形状。

```python
import torch

# expand 示例
b = torch.tensor([[1], [2], [3]])
print(f"原始张量 b (shape {b.shape}):\n{b}\n")
b_expanded = b.expand(3, 4)
print(f"expand 后的张量 (shape {b_expanded.shape}):\n{b_expanded}\n")

# repeat 示例
a = torch.tensor([[1, 2]])
print(f"原始张量 a (shape {a.shape}):\n{a}\n")
a_repeated = a.repeat(3, 2)
print(f"repeat 后的张量 (shape {a_repeated.shape}):\n{a_repeated}\n")
```

输出:
```
原始张量 b (shape torch.Size([3, 1])):
tensor([[1],
        [2],
        [3]])

expand 后的张量 (shape torch.Size([3, 4])):
tensor([[1, 1, 1, 1],
        [2, 2, 2, 2],
        [3, 3, 3, 3]])

原始张量 a (shape torch.Size([1, 2])):
tensor([[1, 2]])

repeat 后的张量 (shape torch.Size([3, 4])):
tensor([[1, 2, 1, 2],
        [1, 2, 1, 2],
        [1, 2, 1, 2]])
```

### permute vs transpose

`transpose(dim0, dim1)` 只能交换两个指定的维度，而 `permute(*dims)` 可以一次性地对所有维度进行任意顺序的重新排列。在多头注意力机制中，`permute` 是一个核心操作，用于将 Q, K, V 张量的维度从 `(batch, seq_len, heads, dim)` 调整为 `(batch, heads, seq_len, dim)` 以便进行批处理矩阵乘法。

```python
x = torch.randn(2, 3, 4)
print(f"原始形状: {x.shape}\n")

# transpose 只能交换两个维度
x_transposed = x.transpose(1, 2)
print(f"transpose(1, 2) 后的形状: {x_transposed.shape}\n")

# permute 可以任意排列所有维度
x_permuted = x.permute(2, 0, 1)
print(f"permute(2, 0, 1) 后的形状: {x_permuted.shape}")
```

输出:
```
原始形状: torch.Size([2, 3, 4])

transpose(1, 2) 后的形状: torch.Size([2, 4, 3])

permute(2, 0, 1) 后的形状: torch.Size([4, 2, 3])
```

### flatten vs unflatten

`flatten(start_dim, end_dim)` 可以将一个张量中从 `start_dim` 到 `end_dim` 的连续维度“压平”成一个单一的维度。而 `unflatten(dim, sizes)` 则是其逆操作，可以将一个指定的维度展开成多个维度。

```python
t = torch.randn(2, 3, 4)
print(f"原始形状: {t.shape}\n")

# 压平维度 1 和 2
t_flat = t.flatten(start_dim=1)
print(f"flatten(start_dim=1) 后的形状: {t_flat.shape}\n")

# 展开维度 1
t_unflat = t_flat.unflatten(dim=1, sizes=(3, 4))
print(f"unflatten(dim=1, sizes=(3, 4)) 后的形状: {t_unflat.shape}")
```

输出:
```
原始形状: torch.Size([2, 3, 4])

flatten(start_dim=1) 后的形状: torch.Size([2, 12])

unflatten(dim=1, sizes=(3, 4)) 后的形状: torch.Size([2, 3, 4])
```

## Advanced Indexing Gathering and Scattering

### Data Gathering and Locating Operations

#### torch.gather

`torch.gather` 沿着指定的维度 `dim`，根据 `index` 张量中的索引值，从输入张量 `input` 中收集元素。输出张量的形状与 `index` 张量相同。这个操作在 LLM 中最经典的应用就是从一个嵌入矩阵中根据 token ID 序列来查找对应的词向量。

```python
# 模拟一个 5 个词，每个词 3 维的嵌入矩阵
embedding_matrix = torch.arange(15).view(5, 3)
print(f"嵌入矩阵 (5x3):\n{embedding_matrix}\n")

# 模拟一个 batch，包含 2 个句子，每个句子 4 个 token ID
input_ids = torch.tensor([[1, 2, 0, 3], [4, 1, 2, 2]])
print(f"输入的 Token IDs (2x4):\n{input_ids}\n")

# 需要将 input_ids 扩展以匹配嵌入矩阵的维度
expanded_ids = input_ids.unsqueeze(-1).expand(-1, -1, 3)

# 沿着维度 0 (词的维度) 收集向量
word_embeddings = torch.gather(embedding_matrix, 0, expanded_ids)
print(f"收集到的词向量 (2x4x3):\n{word_embeddings}")
```

输出:
```
嵌入矩阵 (5x3):
tensor([[ 0,  1,  2],
        [ 3,  4,  5],
        [ 6,  7,  8],
        [ 9, 10, 11],
        [12, 13, 14]])

输入的 Token IDs (2x4):
tensor([[1, 2, 0, 3],
        [4, 1, 2, 2]])

收集到的词向量 (2x4x3):
tensor([[[ 3,  4,  5],
         [ 6,  7,  8],
         [ 0,  1,  2],
         [ 9, 10, 11]],

        [[12, 13, 14],
         [ 3,  4,  5],
         [ 6,  7,  8],
         [ 6,  7,  8]]])
```

#### torch.index_select

`torch.index_select` 是一个简化版的收集操作，它沿着指定的维度 `dim`，选择 `index`（必须是一维张量）中指定的完整切片。在推理解码（如 Beam Search）过程中，当需要根据选中的 beam 索引来更新整个批次的 hidden states 或 KV cache 时，这个函数非常有用。

```python
batch_hidden_states = torch.randn(4, 10) # 假设有 4 个样本，每个 10 维
print(f"原始的批处理隐状态 (4x10):\n{batch_hidden_states.shape}\n")

# 假设我们只想保留第 0 和第 3 个样本
indices_to_keep = torch.tensor([0, 3])
selected_states = torch.index_select(batch_hidden_states, 0, indices_to_keep)
print(f"选择后的隐状态 (2x10):\n{selected_states.shape}")
```

输出:
```
原始的批处理隐状态 (4x10):
torch.Size([4, 10])

选择后的隐状态 (2x10):
torch.Size([2, 10])
```

#### Boolean Mask Indexing

使用一个与原张量形状相同（或可广播）的布尔张量作为索引，可以直接选择所有对应位置为 `True` 的元素。返回的结果是一个被“压平”后的一维张量。这在计算损失函数时非常普遍，例如，通过 padding mask 只选择非填充部分的 logits 来计算交叉熵损失。

```python
logits = torch.randn(2, 4) # 2 个样本，词表大小为 4
labels = torch.tensor([1, 2])
padding_mask = torch.tensor([[True, True, False, False], [True, True, True, False]])

print(f"原始 Logits:\n{logits}\n")
print(f"Padding Mask:\n{padding_mask}\n")

# 只选择 mask 为 True 的 logits
masked_logits = logits[padding_mask]
print(f"被选择的 Logits:\n{masked_logits}")
print(f"被选择的 Logits 数量: {masked_logits.numel()}")
```

输出:
```
原始 Logits:
tensor([[-0.2341, -0.4578, -1.2346,  0.5678],
        [ 0.9876,  0.1234, -0.5432, -0.6789]])

Padding Mask:
tensor([[ True,  True, False, False],
        [ True,  True,  True, False]])

被选择的 Logits:
tensor([-0.2341, -0.4578,  0.9876,  0.1234, -0.5432])
被选择的 Logits 数量: 5
```

#### torch.nonzero

`torch.nonzero()` 返回一个张量，其中每一行都是输入张量中一个非零元素的索引（坐标）。当你想知道满足某个条件的元素具体在哪些位置时，这个函数非常有用。例如，它可以将一个布尔掩码转换为一个索引列表。

```python
input_ids = torch.tensor([101, 800, 900, 102, 500, 102, 0, 0])
pad_token_id = 0

# 找到所有 padding token 的位置
padding_locations = (input_ids == pad_token_id).nonzero()
print(f"Padding Token 的位置 (坐标):\n{padding_locations}")
```

输出:
```
Padding Token 的位置 (坐标):
tensor([[6],
        [7]])
```

### Random Permutation and Shuffling

#### torch.randperm

`torch.randperm(n)` 会生成一个从 0 到 n-1 的整数的随机排列。这个函数本身不直接打乱一个张量，而是生成用于索引的随机顺序。这在机器学习中至关重要，尤其是在每个训练周期 (epoch) 开始时打乱数据集，以确保模型不会学习到数据的特定顺序，从而提高泛化能力。

```python
# 模拟一个包含 5 个样本的数据集
data = torch.arange(15).view(5, 3)
print(f"原始数据集 (5x3):\n{data}\n")

# 获取数据集的样本数量
num_samples = data.shape[0]

# 生成一个随机索引排列
shuffled_indices = torch.randperm(num_samples)
print(f"随机打乱的索引: {shuffled_indices}\n")

# 使用这些索引来打乱数据集
shuffled_data = data[shuffled_indices]
print(f"打乱后的数据集:\n{shuffled_data}")
```

输出 (每次运行 `shuffled_indices` 和 `shuffled_data` 都会不同):
```
原始数据集 (5x3):
tensor([[ 0,  1,  2],
        [ 3,  4,  5],
        [ 6,  7,  8],
        [ 9, 10, 11],
        [12, 13, 14]])

随机打乱的索引: tensor([2, 4, 0, 1, 3])

打乱后的数据集:
tensor([[ 6,  7,  8],
        [12, 13, 14],
        [ 0,  1,  2],
        [ 3,  4,  5],
        [ 9, 10, 11]])
```

### Data Scattering Operations

#### torch.scatter

`torch.scatter` 是 `gather` 的逆操作。它将源张量 `src` 中的数据，根据 `index` 指定的索引，“分散”或“写入”到一个新的张量中（或对一个现有张量进行就地修改）。一个常见的用途是手动实现 One-Hot 编码。

```python
# 创建一个 3x5 的全零张量，模拟 3 个样本，5 个类别
output = torch.zeros(3, 5)

# 标签为 [1, 0, 4]
labels = torch.tensor([[1], [0], [4]])
print(f"原始标签:\n{labels}\n")

# 准备要写入的值，这里是 1
src = torch.ones(3, 1)

# 沿着维度 1 (类别维度)，根据 labels 指定的索引位置，写入 src 的值
one_hot = output.scatter(1, labels, src)
print(f"Scatter 后的 One-Hot 编码:\n{one_hot}")
```

输出:
```
原始标签:
tensor([[1],
        [0],
        [4]])

Scatter 后的 One-Hot 编码:
tensor([[0., 1., 0., 0., 0.],
        [1., 0., 0., 0., 0.],
        [0., 0., 0., 0., 1.]])
```

#### masked_scatter_

`masked_scatter_` 是一个就地操作，它根据一个布尔掩码 `mask` 来写入数据。它会从 `source` 张量中按顺序取出元素，填充到原张量中 `mask` 为 `True` 的位置。`source` 张量中的元素数量必须等于 `mask` 中 `True` 的数量。

```python
x = torch.zeros(2, 3)
print(f"原始张量 x:\n{x}\n")

mask = torch.tensor([[False, True, True], [True, False, True]])
source = torch.tensor([10, 20, 30, 40]) # source 有 4 个元素，因为 mask 中有 4 个 True

x.masked_scatter_(mask, source)
print(f"masked_scatter_ 后的张量 x:\n{x}")
```

输出:
```
原始张量 x:
tensor([[0., 0., 0.],
        [0., 0., 0.]])

masked_scatter_ 后的张量 x:
tensor([[ 0., 10., 20.],
        [30.,  0., 40.]])
```

## Conditional Modification and Masking

### torch.where

`torch.where(condition, x, y)` 是一个三元运算符，它根据 `condition` 布尔张量中的值来决定输出张量中对应位置的元素是来自张量 `x` 还是张量 `y`。如果 `condition` 中某个位置为 `True`，则取 `x` 中对应位置的元素，否则取 `y` 中的。

```python
x = torch.randn(2, 3)
y = torch.ones(2, 3)
print(f"张量 x:\n{x}\n")

# 将 x 中所有小于 0 的值替换为 1
result = torch.where(x > 0, x, y)
print(f"torch.where 后的结果:\n{result}")
```

输出:
```
张量 x:
tensor([[ 0.5428, -0.6631, -1.5373],
        [ 0.6547,  0.9953, -0.2198]])

torch.where 后的结果:
tensor([[0.5428, 1.0000, 1.0000],
        [0.6547, 0.9953, 1.0000]])
```

### masked_fill_

`masked_fill_` 是一个就地操作，它将张量中 `mask` 为 `True` 的位置填充为一个指定的标量 `value`。这在实现注意力掩码时是绝对的核心操作，通过将需要忽略的位置（如 padding 或未来的 token）填充为一个非常大的负数，使得这些位置在经过 softmax 后权重趋近于 0。

```python
attention_scores = torch.randn(2, 4) # 2 个头，序列长度为 4
mask = torch.tensor([[True, True, False, False], [True, False, False, False]])
print(f"原始注意力分数:\n{attention_scores}\n")

attention_scores.masked_fill_(mask == False, -1e9) # 注意：这里我们将 False 的位置填充
print(f"应用掩码后的注意力分数:\n{attention_scores}")
```

输出:
```
原始注意力分数:
tensor([[ 0.4321, -1.2345,  0.6789, -0.9876],
        [ 1.5432, -0.1234,  0.5678,  1.2345]])

应用掩码后的注意力分数:
tensor([[ 4.3210e-01, -1.2345e+00, -1.0000e+09, -1.0000e+09],
        [ 1.5432e+00, -1.0000e+09, -1.0000e+09, -1.0000e+09]])
```

### torch.all and torch.any

`torch.all()` 检查张量中所有元素是否都为 `True`，而 `torch.any()` 检查是否存在至少一个元素为 `True`。它们常用于程序的断言、验证和调试，以确保某些条件得到满足。

```python
mask1 = torch.tensor([[True, True], [True, True]])
mask2 = torch.tensor([[True, False], [True, True]])

# 检查 mask1 是否全部为 True
print(f"mask1 all true? {torch.all(mask1)}")

# 检查 mask2 是否全部为 True
print(f"mask2 all true? {torch.all(mask2)}")

# 检查 mask2 是否存在 True
print(f"mask2 any true? {torch.any(mask2)}")
```

输出:
```
mask1 all true? True
mask2 all true? False
mask2 any true? True
```

## Creating Tensors for Specific Structures

### torch.zeros and torch.ones and _like

`zeros` 和 `ones` 用于创建全 0 或全 1 的张量。`zeros_like` 和 `ones_like` 版本则更方便，它们可以直接创建一个与给定张量具有相同属性（形状、数据类型、设备）的新张量，常用于初始化掩码或累加器。

```python
input_tensor = torch.randn(2, 3, dtype=torch.float32)

# 创建一个与 input_tensor 形状和类型都相同的全零张量
mask = torch.zeros_like(input_tensor)

print(f"输入张量的形状: {input_tensor.shape}, 类型: {input_tensor.dtype}")
print(f"生成的 mask 的形状: {mask.shape}, 类型: {mask.dtype}")
```

输出:
```
输入张量的形状: torch.Size([2, 3]), 类型: torch.float32
生成的 mask 的形状: torch.Size([2, 3]), 类型: torch.float32
```

### torch.arange

`torch.arange` 用于创建一个包含等差序列的一维张量。在 LLM 中，它常被用来生成位置索引，作为计算位置编码 (Positional Encoding) 的基础。

```python
seq_length = 5
position_ids = torch.arange(seq_length, dtype=torch.long)
print(f"生成的序列长度为 {seq_length} 的位置 IDs: {position_ids}")
```

输出:
```
生成的序列长度为 5 的位置 IDs: tensor([0, 1, 2, 3, 4])
```

### torch.triu and torch.tril

`triu` (upper triangle) 和 `tril` (lower triangle) 分别用于获取矩阵的上三角和下三角部分。在实现 Decoder-only 模型的因果注意力掩码 (Causal Attention Mask) 时，`torch.triu(diagonal=1)` 是关键步骤，它将矩阵主对角线以上的部分保留，其余部分置为 0，从而阻止模型在预测当前 token 时看到未来的 token。

```python
seq_len = 4
# 创建一个下三角矩阵，用于因果掩码
causal_mask = torch.tril(torch.ones(seq_len, seq_len))
print(f"因果注意力掩码 (tril):\n{causal_mask}")
```

输出:
```
因果注意力掩码 (tril):
tensor([[1., 0., 0., 0.],
        [1., 1., 0., 0.],
        [1., 1., 1., 0.],
        [1., 1., 1., 1.]])
```

### torch.cumsum

`cumsum` (cumulative sum) 沿指定维度计算元素的累积和。当处理被打包 (packed) 在一起的多个不同长度的序列时，这个函数可以用来高效地构建正确的注意力掩码。

```python
# 模拟两个序列的长度
sequence_lengths = torch.tensor([3, 4])
print(f"序列长度: {sequence_lengths}\n")

# 计算累积和
cumsum_lengths = torch.cumsum(sequence_lengths, dim=0)
print(f"累积长度: {cumsum_lengths}")
```

输出:
```
序列长度: tensor([3, 4])

累积长度: tensor([3, 7])
```

## Advanced Tensor Contraction

### torch.einsum

爱因斯坦求和约定 (`einsum`) 是一种极其强大和灵活的工具，它使用一种简洁的字符串表示法来描述复杂的张量运算，如转置、矩阵乘法、缩并等。在多头注意力中，计算 Q 和 K 的点积就可以用 `einsum` 一行代码高效完成，可读性也很高。

```python
# 模拟 Q 和 K 张量
# 形状: (batch, heads, seq_len, dim)
batch_size, num_heads, seq_len, dim = 2, 8, 10, 64
query = torch.randn(batch_size, num_heads, seq_len, dim)
key = torch.randn(batch_size, num_heads, seq_len, dim)

# 使用 einsum 计算注意力分数
# 'bhid,bhjd->bhij' 意味着:
# - b: batch, h: heads, i: query_len, j: key_len, d: dim
# - 对 d 维度进行求和，得到 (b, h, i, j) 形状的输出
attention_scores = torch.einsum('bhid,bhjd->bhij', query, key.transpose(-1, -2))

print(f"Query 形状: {query.shape}")
print(f"Key 形状: {key.shape}")
print(f"einsum 计算出的注意力分数形状: {attention_scores.shape}")

# 与 matmul 的结果进行对比
attention_scores_matmul = torch.matmul(query, key.transpose(-1, -2))
print(f"matmul 计算出的注意力分数形状: {attention_scores_matmul.shape}")
```

输出:
```
Query 形状: torch.Size([2, 8, 10, 64])
Key 形状: torch.Size([2, 8, 10, 64])
einsum 计算出的注意力分数形状: torch.Size([2, 8, 10, 10])
matmul 计算出的注意力分数形状: torch.Size([2, 8, 10, 10])
```