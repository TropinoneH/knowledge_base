---
type: command
tags:
  - system/linux
  - ssh
  - cli
  - software/nvidia
done: false
topic:
  - "[[System]]"
---
# Slurm

slurm是高性能平台常用的资源管理软件, 使用ubuntu底层的`cgroup`权限分割为用户分配资源

# Login

使用[[SSH Login]]登陆到`登陆节点`. 在登陆节点中, 使用不同的方法([[#SBatch]], [[#SAlloc]], [[#SRun]])去申请节点.

提交[[#Alloc|申请]]之后, 可以使用[[#Info#SQueue|squeue]]命令查看申请队列, 如果申请到的节点

# Info
## SQueue

使用下面的指令展示申请队列的信息:
```bash
squeue
```

要展示更多信息, 使用`-o`配合format:
```bash
squeue -o"%.7i %.9P %.8j %.8u %.2t %.10M %.6D %.3C %.8m %N"
```

## Node Info
### Sinfo

使用下面的指令展示所有的公共的节点:
```bash
sinfo
```

展示指定节点信息:
```bash
sinfo -p <partition> -n <node_name>
```

展示更多信息(可以配合上面的`-p`, `-n`指令):
```bash
sinfo -o "%.13n %.3c %.6m %.4a %.28G %.10T"
```

### SControl
查看节点服务器信息:
```bash
scontrol show node <node_name>
```

查看显卡:
```bash
scontrol show node <node_name> | grep -e "NodeName" -e "CfgTRES" -e "AllocTRES"
```
后面两个参数表示总显卡数量和已申请显卡数量
