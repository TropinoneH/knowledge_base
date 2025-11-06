---
type: command
tags:
  - cli
  - code/python
  - web
done: true
topic:
  - "[[Coding]]"
---
# Wandb

Weights & Biases (wandb) 是一个面向机器学习开发者的平台, 用于跟踪、可视化和管理您的机器学习实验. 把它想象成一个实验日志本, 但功能更强大、更具协作性.

主要功能包括:
- 实验跟踪: 自动记录代码、超参数、模型指标 (如损失和准确率) 以及系统指标 (如CPU/GPU使用率).
- 数据可视化: 将记录的指标实时转换成交互式图表, 方便您分析模型性能.
- 协作与报告: 轻松与团队成员分享您的实验结果, 并将发现汇总到报告中.
- 超参数调优: 使用 W&B Sweeps 自动化超参数搜索过程, 以找到模型的最佳配置.
- 数据集与模型版本管理: 使用 W&B Artifacts 对数据集和模型进行版本控制, 确保实验的可复现性.

通过在您的代码中集成 wandb, 所有实验数据都会被保存在本地一个名为 `wandb` 的目录中, 并自动同步到 wandb 的云端服务器或您自己的私有服务器上.

# Upload Parameters

在Python代码中与wandb交互主要通过 `wandb.init()` 和 `wandb.log()` 两个核心函数.

- `wandb.init()`: 初始化一个新的实验运行 (run). 您应该在训练脚本的开头调用它.
- `wandb.log()`: 在一个运行中记录数据. 您可以在训练循环的每一步或任何您想记录数据的地方调用它.

## `wandb.init()`

这个函数用于开始一次新的运行并配置其元数据. 很多配置项都可以通过一个字典传递.

- `project`: (字符串, 可选) 您希望将此次运行记录到的项目名称.
- `entity`: (字符串, 可选) 拥有该项目的实体, 通常是您的用户名或团队名.
- `config`: (字典, 可选) 一个用于存储超参数和元数据的字典. 这里记录的信息在后续分析实验时非常有用.

示例代码:
```python
import wandb
import random

# 使用一个字典来定义配置
config_dict = {
  "learning_rate": 0.01,
  "epochs": 10,
  "architecture": "CNN"
}

# 初始化一个新的运行
run = wandb.init(
  project="my-awesome-project",
  config=config_dict
)

# 也可以在初始化后访问和修改config对象
# run.config.dropout = 0.2
```

## `wandb.log()`

这个函数用于记录随时间变化的数据, 如模型的损失或准确率. 它接受一个字典作为参数, 字典的键是您想要记录的指标名称, 值是对应的指标值.

- 每次调用 `wandb.log()` 默认代表一个新的步骤 (step). wandb 会使用这个步骤作为图表的默认x轴.

示例代码:
```python
# 在训练循环中记录指标
for epoch in range(run.config.epochs):
  # 模拟训练过程
  loss = random.uniform(0, 1)
  acc = 1 - loss

  # 使用字典记录多个指标
  log_dict = {
    "loss": loss,
    "accuracy": acc,
    "epoch": epoch
  }
  wandb.log(log_dict)

# 结束运行
run.finish()
```

## Nested Dict

为了更好地组织您的指标, 您可以使用带有 `/` 的键来模拟嵌套结构. 这有助于在wandb的UI界面上将相关的图表分组.

```python
# 记录训练和验证指标
train_loss = 0.2
val_loss = 0.3
train_acc = 0.9
val_acc = 0.85

wandb.log({
  "train/loss": train_loss,
  "train/accuracy": train_acc,
  "validation/loss": val_loss,
  "validation/accuracy": val_acc
})
```

# cli

wandb 提供了一个强大的命令行界面 (CLI) 来管理您的账户和实验.

## command

- `wandb login`: 登录您的wandb账户. 您需要提供从您的用户设置页面获取的API密钥. 这是使用wandb前通常需要执行的第一个命令.
- `wandb init`: 在当前目录中交互式地配置一个新的项目. 它会询问您项目名称、实体等信息.

## sync

- `wandb sync <path>`: 这是将本地离线运行数据上传到云端的关键命令.
  - 如果您在没有网络连接或通过设置 `mode="offline"` 运行脚本, 数据会保存在本地的 `wandb/offline-run-*` 目录中.
  - 要上传一个特定的离线运行, 请提供该运行目录的完整路径: `wandb sync wandb/offline-run-20251106_083000-abcdef12`.
  - 要上传当前目录下 `wandb` 文件夹内的所有未同步运行, 可以使用: `wandb sync --sync-all`.
- `wandb offline`: 将全局状态设置为离线模式, 之后的所有运行都将只保存在本地.
- `wandb online`: 将全局状态切换回在线模式, 新的运行将实时同步到云端.

## Sweeps and Agent

- `wandb sweep <config.yaml>`: 根据一个YAML配置文件初始化一个超参数搜索任务 (Sweep).
- `wandb agent <sweep_id>`: 启动一个代理 (agent) 来执行指定的 Sweep 任务. 代理会从wandb服务器获取超参数组合, 运行训练脚本, 并将结果报告回去.
