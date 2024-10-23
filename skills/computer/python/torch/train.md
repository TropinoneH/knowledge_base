# train state

首先要有一个继承自`torch.nn.Module`的Model. 可以有forward, 也可以没有. 不过如果要调用`__call__`(直接调用Model的实例化, 如: `m=Model();out=m(**data)`), 需要实现forward函数

训练开始之前, 需要指定哪一些参数是需要训练的, 一些不需要计算更新的常量, 使用`parameter.requires_grad_(False)`取消梯度, 可以冻结, 停止loss的backward. 能够降低一部分梯度计算图的显存占用.

开始训练之后, 需要调用`model.train()`标志表示是训练阶段.

一个常见的训练循环为:

```python
class Model(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = torch.nn.Linear(10, 10)
        self.relu = torch.nn.ReLU()
        self.softmax = torch.nn.Softmax
    def forward(self, data):
        x = self.linear(x)
        x = self.relu(x)
        x = self.softmax(x)

model = Model()
# train loop
for epoch in trange(total_epoch):
    for batch in tqdm(dataloader):
        optimizer.zero_grad()
        outputs = model(batch)
        loss = loss_func(outputs)
        loss.backward()
        optimizer.step()
    scheduler.step()
```

# eval state

在进行验证测试的时候, 需要首先将模型的`eval()`模式打开, 然后可以在`@torch.no_grad()`的decorator下进行验证

如:

```python
model = Model()
model = model.cuda().eval()

with torch.no_grad():
    outputs = model(data)
```
