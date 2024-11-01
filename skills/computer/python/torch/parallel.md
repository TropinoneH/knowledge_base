# data distribute parallel

torch自带的数据并行.

| 优点                                                                                   | 缺点                    |
| -------------------------------------------------------------------------------------- | ----------------------- |
| 1. 数据并行, 每一个线程上分别有不同的数据, 可以显著减小数据过大导致的一个epoch速度过慢 | 1. 没有切分模型和梯度图 |
| 2. 减轻每一个显卡上的数据量, 减轻显存负担                                              |                         |

```python
import torch.multiprocessing as mp
from torch.nn.parallel import DistributedDataParallel as DDP

def main(rank, **kwargs):
    # rank == 0是main主分支, io操作(save, load, log)尽量只在rank == 0
    model = Model()
    # 这里是将模型分装到不同的显卡上
    model = DDP(model.cuda(), device_ids=[rank], output_device=rank)

    # training loop
    unwrapped_model = model.module
    optimizer = ...
    for epoch in trange(total_epoch, disable=rank != 0):
        for batch in dataloader:
            optimizer.zero_grad()
            output = model(**batch)
            loss = loss_func(output)
            loss.backward()
            optimizer.step()

world_size = torch.cuda.device_count()
mp.spawn(main, args=(**kwargs), n_procs=world_size)
```

# deepspeed



| 优点                                | 缺点                                                        |
| ----------------------------------- | ----------------------------------------------------------- |
| 1. 分多个阶段. 可以极大减少显存占用 | 1. 配置复杂, 需要配合Huggingface的Trainer或者accelerate使用 |

需要写`ds_config.json`:

```json
{
    "fp16": {
        "enabled": "auto",
        "loss_scale": 0,
        "loss_scale_window": 1000,
        "initial_scale_power": 16,
        "hysteresis": 2,
        "min_loss_scale": 1
    },
    "bf16": {
        "enabled": false
    },
    "zero_optimization": {
        "stage": 3,
        "offload_optimizer": {
            "device": "none",
            "pin_memory": true
        },
        "offload_param": {
            "device": "none",
            "pin_memory": true
        },
        "overlap_comm": true,
        "contiguous_gradients": true,
        "sub_group_size": 1e9,
        "reduce_bucket_size": "auto",
        "stage3_prefetch_bucket_size": "auto",
        "stage3_param_persistence_threshold": "auto",
        "stage3_max_live_parameters": 1e9,
        "stage3_max_reuse_distance": 1e9,
        "stage3_gather_16bit_weights_on_model_save": true
    },

    "gradient_accumulation_steps": "auto",
    "gradient_clipping": "auto",
    "steps_per_print": 100,
    "train_batch_size": "auto",
    "train_micro_batch_size_per_gpu": 2,
    "wall_clock_breakdown": false
}
```

huggingface代码使用:

```python
from transformer import Trainer, TrainingArguments
# 不需要显式引用deepspeed
training_args = TrainingArguments(...)

model = Model(logger)

trainer = CustomTrainer(model=model.lm, ...)

trainer.train()
```

在有huggingface Trainer的基础上调用:

```shell
deepspeed --module hf_trainer
# 或者
deepspeed hf_trainer.py
```

修改GPU:

```shell
deepspeed --num_gpus 2 hf_trainer.py
deepspeed --localhost:0,2,3,4 hf_trainer.py
```

注意选项必须写在前面

会在`hf_trainer.py`后面加上一个额外的argument: `--local_rank r`

如果不想要:

```shell
deepspeed --no_local_rank hf_trainer.py
```

# accelerate

| 优点        | 缺点                                         |
| ----------- | -------------------------------------------- |
| 1. 使用简单 | 1. 本身没有分布式, 需要deepspeed或者fsdp配合 |

也是需要`config.yaml`:

```yaml
compute_environment: LOCAL_MACHINE
debug: false
deepspeed_config:
  gradient_accumulation_steps: 1
  gradient_clipping: 1.0
  offload_optimizer_device: cpu
  offload_param_device: cpu
  zero3_init_flag: true
  zero3_save_16bit_model: true
  zero_stage: 3
distributed_type: DEEPSPEED
downcast_bf16: 'no'
enable_cpu_affinity: false
machine_rank: 0
main_training_function: main
mixed_precision: 'no'
num_machines: 1
num_processes: 8
rdzv_backend: static
same_network: true
tpu_env: []
tpu_use_cluster: false
tpu_use_sudo: false
use_cpu: false
```

代码:

```python
from accelerate import Accelerator
import torch

accelerator = Accelerator() # 越早定义越好

model = Model(logger)
dataloader = torch.util.data.Dataloader(Dataset("train"), ...)
optimizer = ...
scheduler = ...

# 这一步相当于将model分布切分到不同的卡上, 具体的策略依照config.yaml中写的
wrapped_model, optimizer, scheduler, dataloader = accelerator.prepare(model, optimizer, scheduler, dataloader) # 顺序无所谓, 只要一一对应
wrapped_model.train()

# train loop
for epoch in trange(total_epoch, disable=not accelerator.is_main_process):
    for batch in tqdm(dataloader, disable=not accelerator.is_main_process):
        with accelerator.no_sync(model):
            optimizer.zero_grad()
            outputs = wrapper_model(**item)
            loss = outputs.loss
            # 原来是loss.backward()
            accelerator.backward(loss)
            optimizer.step()
    scheduler.step()
```

使用:

```shell
accelerate launch --config_file config.yaml --module train
```

> 一个完整的例子:
>
> ```python
> import json
> import time
> import os
> 
> from accelerate import Accelerator
> from peft import get_peft_model_state_dict, set_peft_model_state_dict
> import torch
> import torch.distributed
> from torch.utils.data import DataLoader
> from tqdm import trange, tqdm
> 
> from config.config import config
> from dataset import SistorDataset
> from data_utils import collate_fn_lm_pretrain
> from qwen import Model
> 
> 
> if __name__ == "__main__":
>     accelerator = Accelerator()
>     time_stamp = time.strftime("%Y-%m-%d-%H-%M-%S")
>     accelerator.print("---------Loading Model---------")
>     wrapper_model = Model(accelerator.print)
>     accelerator.print("---------Loading Dataloader---------")
>     dataset = SistorDataset("train")
>     dataloader = DataLoader(
>         dataset,
>         batch_size=config["dataset"]["batch_size"],
>         num_workers=config["dataset"]["num_workers"],
>         persistent_workers=config["dataset"]["persistent_workers"],
>         drop_last=config["dataset"]["drop_last"],
>         collate_fn=lambda batch: collate_fn_lm_pretrain(batch, wrapper_model.tokenizer),
>     )
>     accelerator.print("---------Loading Optimizer---------")
>     optimizer = torch.optim.AdamW(wrapper_model.lm.parameters(), lr=2e-4, betas=[0.9, 0.99], weight_decay=0.0)
>     scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, eta_min=1e-6, T_max=100)
>     # Pretrain Model
>     if config["pretrain"]["checkpoints"]:
>         accelerator.print("---------Loading Pretrain Model---------")
>         set_peft_model_state_dict(wrapper_model.lm, torch.load(config["pretrain"]["checkpoints"]))
>     # Accelerator
>     accelerator.print("---------Loading Accelerator---------")
>     model, optimizer, dataloader, scheduler = accelerator.prepare(wrapper_model.lm, optimizer, dataloader, scheduler)
>     model.train()
> 
>     accelerator.print("---------Training---------")
>     train_info = {}
>     if accelerator.is_main_process and config["save"]:
>         os.makedirs(f"/2022233318/sistor/ckpt/lm_pretrain-{time_stamp}", exist_ok=True)
> 
>     for epoch in trange(100000000, disable=not accelerator.is_local_main_process):
>         loss_dict = {}
>         for idx, item in enumerate(tqdm(dataloader, disable=not accelerator.is_local_main_process)):
>             with accelerator.no_sync(model):
>                 optimizer.zero_grad()
>                 outputs = wrapper_model(**item)
>                 loss = outputs.loss
>                 accelerator.backward(loss)
>                 optimizer.step()
> 
>             verbose = {"outputs": loss.item()}
>             for k, v in verbose.items():
>                 if k not in loss_dict:
>                     loss_dict[k] = v
>                 else:
>                     loss_dict[k] += v
> 
>         scheduler.step()
> 
>         for k, v in loss_dict.items():
>             loss_dict[k] = v / len(dataloader)
>         accelerator.print("---------Saving---------")
>         accelerator.wait_for_everyone()
>         unwrapped_model = accelerator.unwrap_model(model)
>         if config["save"]:
>             accelerator.save(
>                 get_peft_model_state_dict(unwrapped_model, state_dict=accelerator.get_state_dict(model)),
>                 f"/2022233318/sistor/ckpt/lm_pretrain-{time_stamp}/epoch{epoch}.pt",
>             )
>             if accelerator.is_main_process:
>                 train_info["epoch_" + str(epoch)] = {"outputs": loss_dict["outputs"]}
>                 with open(
>                     f"/2022233318/sistor_log/lm_logs/log_{time_stamp}.json",
>                     "w",
>                 ) as f:
>                     json.dump(train_info, f)
> 
> ```

# Misc

<details>
    <summary>手动保存文件</summary>
    <div>
        <p>保存模型一般指的是保存模型的state dict, 加载的时候直接在分布式之前load即可.</p>
        <p>保存的方法为:</p>
		<pre><code>
        # don't return before `wait_for_everyone`
        accelerator.wait_for_everyone()
        state_dict = accelerate.get_state_dict(wrapped_model)
        if torch.distributed.get_rank() != 0:
        	return
        # you must return before use the variable `state_dict`, because this is None in other thread
        accelerator.save(state_dict, "...")
		</code></pre>
    </div>
</details>

<details>
    <summary>多卡loss整合(reduce)</summary>
    <div>
        <p>
            使用<code>torch.distributed.reduce</code>可以快速整合多卡的loss. 同理, 整合的结果只有在main_process中存在, 其他的process都是None
        </p>
        <pre><code>
        loss = ...
        loss_reduced = torch.tensor(loss).float().to(current_process_device)
        dist.all_reduce(loss_reduced) # default reducer is sum
        loss_reduced = loss_reduced / dist.get_world_size()
        if dist.get_rank() != 0:
            return
        </code></pre>
    </div>
</details>

