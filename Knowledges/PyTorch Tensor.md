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