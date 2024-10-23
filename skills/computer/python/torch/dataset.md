# Dataset

创建一个类, 继承自`torch.utils.data.Dataset`, 需要手动实现`__init__`, `__len__`, `__next__`, `__getitem__`函数.

通过`[]`取值是通过`__getitem__`的返回值拿到的. Dataloader是通过`__next__`拿到的

一个常见的写法是:

```python
class SistorDataset(torch.utils.data.Dataset):
    def __init__(self, phase, **kwargs):
        super().__init__()

        self.phase = phase
        self.curr_iter = 0

    def __len__(self):
        return len(self.all_paths["imu_token"])

    def __next__(self):
        if self.curr_iter >= len(self):
            self.curr_iter = 0
            raise StopIteration()
        else:
            single_data = self.__getitem__(self.curr_iter)
            self.curr_iter += 1

        return single_data

    def __getitem__(self, idx):
        item = self.load_data(idx)

        # {"motion_token": tensor(frame).int, "imu_token": tensor(frame).int, "text": list, "fps": int}
        return item
```

# Dataloader

在训练的时候, 一般是直接提供一个batch的数据. 这个时候会使用`torch.utils.data.Dataloader`来对`Dataset`一次性取多个data.

这个时候, 所有的data会以`batch = [data1, data2, ...]`的形式存在. 如果有`collate_fn`, 那么会运行`collate_fn(batch)`并将返回值作为一个batch的数据给到训练.

`collate_fn`的作用为: 将多个data对齐(为了保证dim相同), 处理成特殊的格式(llm的input_ids, attention_mask, labels等)

一个例子为:

```python
def collate_fn(batch, **kwargs):
    new_data = []
    for data in batch:
        new_data.append(pre_process_func(data, **kwargs))
    return torch.tensor(new_data).to(kwargs.device)

dataloader = torch.utils.data.Dataloader(Dataset(), collate_fn: lambda batch: collate_fn(batch, device=torch.cuda()))

for i in tqdm(dataloader):
    batch = i
    o = model(batch)
    loss = loss_func(o)
    loss.backward()
```
