---
type: skills
tags:
  - cpp
  - python
  - DeepLearning
  - code
---
# Torch Export

如果需要使用`libtorch_cpu`或者其他`libtorch_*`使用C++调用[[PyTorch]]的module, 那么必须使用`torch.jit`导出为torch ScriptModule

> [!abstract]+ ScriptModule v.s. nn.Module
> | 特性 | `torch.save(model.state_dict())` | `torch.jit.save(traced_model)` |
> | :--- | :--- | :--- |
> | 主要用途 | 训练过程中的检查点、在Python中恢复模型 | 模型部署，跨平台（C++,移动端）推理 |
> | 保存内容 | 仅模型权重（Python字典） | 模型的结构（计算图）+ 权重 |
> | 文件格式 | Python `pickle` | 自定义的二进制Torch Script格式 |
> | Python依赖 | 强依赖：加载时必须有原始的模型类定义代码 | 无依赖：文件是自包含的，无需原始代码 |
> | C++可用性 | 完全不可用 | 原生支持，通过 `torch::jit::load()` 加载 |
> | 性能 | Python原生执行 | 可进行图优化，通常推理速度更快 |
> | 加载方式 (Python) | `model.load_state_dict(torch.load(PATH))` | `model = torch.jit.load(PATH)` |
> | 加载方式 (C++) | - | `module = torch::jit::load(PATH);` |

导出的方式为:

```python
import torch

class NetModule(torch.nn.Module):
	"""
	Module Network
	"""
	def __init__(self, ...):
		...
	
	def forward(self, inputs, ...):
		...
		

model = NetModule(...)

"""
after training, or load state dict
"""

model.load_state_dict(state_dict)
model.eval()
model.to("cpu") # 对于`libtorch_cpu.so`而言, 必须全部的tensor都在cpu上

example_input = torch.randn(..., device="cpu")

script_model = torch.jit.trace(model, example_input) # 这个必须要求实现了forward函数, 并且推理使用forward函数.

script_model.save("path...")
```

# C++ Use ScriptModule

## Load Module

首先, 将`libtorch_cpu.so`的路径加入到`LD_LIBRARY_PATH`中, 让[[CMake]]能找到

然后, 在CMakeLists.txt中加载`libtorch`:
```cmake
find_package(Torch REQUIRED)
message(STATUS "Found PyTorch: ${TORCH_LIBRARIES}")
set(USE_PYTORCH ON)

# Link PyTorch to the library instead of the executable
if(USE_PYTORCH)
  target_link_libraries(model_loader_lib PUBLIC "${TORCH_LIBRARIES}")
  target_compile_definitions(model_loader_lib PRIVATE USE_PYTORCH)
endif()
```

最后, 在合适的位置调用:
```c++
#include <torch/torch.h>
#include <torch/script.h>

torch::jit::script::Module model = torch::jit::load("<path/to/script/model>");
model.eval();
```

## Inference

需要通过vector转换为`torch::Tensor`进行推理.

```C++
std::vector<float> input = {...};

try {
	// 转换输入为 torch tensor
	torch::Tensor input_tensor = torch::from_blob(
		const_cast<float*>(input.data()), 
		{1, static_cast<long>(input.size())}, 
		torch::kFloat
	).clone();
	
	// 推理
	std::vector<torch::jit::IValue> inputs;
	inputs.push_back(input_tensor);
	
	torch::jit::IValue output = torch_model_.forward(inputs);
	torch::Tensor output_tensor = output.toTensor();
	
	// 转换输出为 vector
	output_tensor = output_tensor.cpu();
	std::vector<float> result(output_tensor.data_ptr<float>(), 
							 output_tensor.data_ptr<float>() + output_tensor.numel());
	
	return result;
} catch (const std::exception& e) {
	std::cerr << "PyTorch inference error: " << e.what() << std::endl;
	return {};
}
```