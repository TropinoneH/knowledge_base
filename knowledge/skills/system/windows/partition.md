---
tags:
  - tutorial
  - windows
---
# 修复磁盘索引问题

在需要修复的盘的路径下, 使用下面指令:

```powershell
chkdsk /f
```

# 双系统 linux挂载

使用[[Linux#Arch Linux|Arch]]挂载ntfs时, 可能会遇到下面的情况:

1. 使用nautilus或者dolphin无法正确[[Commands#mount|mount]]某一个盘
2. 使用`sudo mount /dev/nvme0n<*>p<*> </path/to/mounted>`可以正常挂载

可能是由于这个盘被误判定为"dirty"的情况. 使用[[Commands#ntfsfix|ntfsfix命令]]清除dirty标记:

```shell
sudo ntfsfix --clear-dirty /dev/nvme0n<*>p<*>
```