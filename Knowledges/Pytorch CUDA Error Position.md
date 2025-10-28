---
type: skills
tags:
  - code/python
  - error
done: true
topic:
  - "[[PyTorch]]"
  - "[[Coding]]"
---
# CUDA Multi-Thread

在[[PyTorch]]调用[[Cuda]]进行计算的时候, 顺序是这样的:
1. 读取python代码
2. 将python代码对应的操作加入到计算列表中(如, `torch.mm(X, Y)`). 这一行代码并不立即执行, 而是等到CUDA计算线程排队结束之后再计算(如果需要立刻读取, 那么会将优先级提前)
3. 继续读取下一行python代码
4. 当需要读取计算结果的时候, 将计算结果从CUDA中返回

此时会导致: 当上一条指令结束的时候, CUDA并没有完成计算. 因此CUDA的报错位置可能会出现偏移. 如:
```python
hidden_state = self.mlp(hidden_state)
hidden_state = hidden_state[window_index, :, :] # 真正的Error在这里, out of index
hidden_state = hidden_state.reshape(-1, self.seq_len)
rotary_pos_emb = rotary_pos_emb[window_index, :, :] # 报错在这一行
```

报错信息:
```
E1020 16:04:42.428073   63878 local_device_state.cc:130] Error when closing device: INTERNAL: CUDA error: Could not synchronize CUDA stream: CUDA_ERROR_ASSERT: device-side assert triggered
2025-10-20 16:04:42.428134: E external/xla/xla/stream_executor/cuda/cuda_stream.cc:233] stream not idle on destroy: INTERNAL: CUDA error: : CUDA_ERROR_ASSERT: device-side assert triggered
2025-10-20 16:04:42.428165: E external/xla/xla/stream_executor/cuda/cuda_stream.cc:238] failed to destroy CUDA stream for executor 0x7fe708001460: INTERNAL: CUDA error: : CUDA_ERROR_ASSERT: device-side assert triggered
...
/pytorch/aten/src/ATen/native/cuda/IndexKernel.cu:93: operator(): block: [98,0,0], thread: [122,0,0] Assertion `-sizes[i] <= index && index < sizes[i] && "index out of bounds"` failed.
/pytorch/aten/src/ATen/native/cuda/IndexKernel.cu:93: operator(): block: [98,0,0], thread: [123,0,0] Assertion `-sizes[i] <= index && index < sizes[i] && "index out of bounds"` failed.
...
```

这个实际上就是CUDA的index out of array

## Error Location

为了精准定位到真正报错的代码, 需要添加一个环境变量: `CUDA_LAUNCH_BLOCKING=1`:
```bash
CUDA_LAUNCH_BLOCKING=1 python train.py
```

此时报错会精准定位在错误的代码处
