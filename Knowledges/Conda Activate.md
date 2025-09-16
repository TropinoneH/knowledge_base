---
type: command
tags:
  - cli
  - code/python
done: false
---
# Activate by Name

对于一个常见环境(使用[[Conda Environment#Create by Name|create by name]]的方式创建的环境)而言, 可以有两种方式激活.

一种是常见的激活:

首先要[[Conda Init|初始化]] [[Shell]](只需要运行一次)
```bash
conda init <shell>
```

然后直接激活:
```bash
conda activate <env_name>
```

一种是无需[[Conda Init|初始化]]的激活:

因为`conda init`会导致shell启动慢, 因此可以不初始化, 将所有的初始化放到需要用到`conda`的时候:
```bash
source <path/to/conda>/bin/activate <env_name>
```

但是这个不能给[[Shell#Fish|fish shell]]使用
# Activate by Path
