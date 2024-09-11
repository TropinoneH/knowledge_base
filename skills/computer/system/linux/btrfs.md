# btrfs
Btrfs是一种文件系统。不同于ext4和ntfs，这种操作系统最大的好处就是可以很方便的备份

## 创建备份

使用命令

```shell
sudo btrfs subvolume snapshot <path/to/backup> <path/to/save> -r
```

通常而言，备份的路径是`/`，表示备份整个盘。如果`/`分区和`/home/`是两个不同的分区，也可以分别备份

参数`-r`表示只读。只有只读的备份才可以移动（将备份转移到其他硬盘上）

快照不会对已经存在的快照递归快照，因此可以放心将快照保存在本地的硬盘上

## 移动备份

```shell
sudo btrfs send <path/to/backup> | sudo btrfs receive <media/path/to/save/backup>
```

这里的`<path/to/save>`是上面`<path/to/save>`的位置，即已经存在的快照的位置

注意，所有保存快照的存储设备都需要是`btrfs`文件系统的。非`btrfs`系统无法保存快照。

## 增量备份

由于向外部存储设备迁移快照，因此可能需要多次进行快照。

增量备份的目的就是基于上一次备份，将本次备份快速传输至外部存储设备。

注意在命令中有`-p`参数

```shell
sudo btrfs send -p <path/to/backup1> <path/to/backup2> | sudo btrfs receive <media/path/to/save/backup>
```

## 删除备份

```shell
sudo btrfs subvolume delete <path/to/backup>
```

## 从备份中恢复

> 注意：这一条内容并未经过测试


