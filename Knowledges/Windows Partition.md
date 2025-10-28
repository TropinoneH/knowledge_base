---
type: system
tags:
  - system/windows
  - system/linux
done: false
topic:
  - "[[System]]"
---
# 修复Partition

适用于索引丢失等情况. 如果可以确认数据没有丢失只是索引丢失, 可以使用下面的指令进行修复:
```powershell
chkdsk /f
```

# 双系统挂载问题

如果使用`nautilus`或者`dolphin`无法直接[[Mount]]一个partition, 首先检测下面的指令能否正常挂载:
```bash
sudo mount /dev/nvme0n<*>p<*> <path/to/mount>
```

如果上面的指令可以正常挂载, 那么可以认为是这个分区被认为是`dirty`的. 可以使用这个指令去掉`dirty`的标记:
```bash
sudo ntfsfix --clear-dirty /dev/nvme0n<*>p<*>
```

注意, ntfsfix这个指令只能简单的清理, 不能修复索引问题. 索引问题还是需要[[#修复Partition|chkdsk]]进行修复