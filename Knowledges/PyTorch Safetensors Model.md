---
type: skills
tags:
  - cli
  - code/python
  - DeepLearning
done: true
topic:
  - "[[Coding]]"
  - "[[PyTorch]]"
---
# Install

需要使用[[Python Module#pip|pip]]安装:
```bash
pip install torch safetensors
```

# Save Model

使用[[PyTorch]]进行训练:
```python
import safetensors.torch

model = Model()
train(model, **kwargs)

# save weight
safetensors.torch.save_model(model, "path/to/model.safetensors")
```
# Load Model

如果这个`.safetensors`文件对应的模型为Model, 那么可以:
```python
import safetensors.torch

model = Model()
safetensors.torch.load_model(model, "path/to/model.safetensors")
```

# Inspect

如果不想将模型权重赋值给一个Model, 只希望查看这个模型内部的key, 那么可以使用下面的方法:
```python
from safetensors.torch import load_file

# 你的 safetensors 文件路径
file_path = "path/to/your/model.safetensors"

# 加载整个文件到内存中，返回一个 state_dict
# device="cpu" 确保张量加载到 CPU 上，避免 GPU 显存溢出
state_dict = load_file(file_path, device="cpu")

# state_dict 就是一个字典，可以直接调用 .keys()
all_keys = state_dict.keys()

# 打印所有 keys
print(f"Found {len(all_keys)} tensors.")
for key in all_keys:
    print(key)

# 打印第一个 tensor 的形状作为示例
first_key = list(all_keys)[0]
print(f"\nShape of '{first_key}': {state_dict[first_key].shape}")
```
