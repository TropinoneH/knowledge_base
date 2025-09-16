---
type: command
tags:
  - cli
  - code/python
done: true
---
# Create Environment

conda可以管理虚拟环境, 与系统环境隔离, 防止环境冲突. conda不仅仅是 #code/python 的环境管理, conda也可以管理其他的环境, 如, #code/cpp , #code/go , #code/java , 等

## Create by Name
```bash
conda create -n <name> python=<version> <other:torch,...>=<version>
```

## Create by Path
```bash
conda create --prefix <path/to/env> python=<version> <other:torch,...>=<version>
```

当指定路径的时候, 无法使用`-n`指定名称, 无法通过[[Conda Activate#Activate by Name|env name的方式激活]]这个环境, 必须通过[[Conda Activate#Activate by Path|路径激活]]这个环境

## Create by Config

如果有提供的[[#Export Environment|config yaml]]文件, 那么可以直接根据这个yaml创建环境:
```bash
conda env create -f <path/to/environment.yml>
```

注意这里是`conda env create`, 之前是`conda create`
# Remove Environment

需要删除一个环境的时候, 使用下面的指令删除一个环境:
```bash
conda env remove -n <env_name>
```

如果是[[#Create by Path]]方式创建的, 那么可以直接删除这个路径即可, 无需使用conda, 因为这个环境没有记录在conda的环境中(这是一个“野生环境”)

# Export Environment

将环境导出为`environment.yml`:
```bash
conda env export > environment.yml
```

可以用于[[#Create by Config|创建环境]]
