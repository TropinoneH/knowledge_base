---
type: system
tags:
  - software/file-system
  - system/linux
  - cli
done: true
topic:
 - "[[System]]"
---
# 分区

在windows中, 分区使用[[Windows Partition|partition]]

在[[Btrfs]]文件系统中, 分区使用[[Btrfs#分卷挂载|subvol]]

后续的文件均以 #system/linux 为主

# 查看空间

## 展示硬盘空间

```shell
df -h <path>
```

如果不添加`<path>`, 那么默认展示全部disk的空间. 一般而言, 令`<path>`为当前路径, 展示当前disk的剩余空间:
```shell
df -h .
```

## 查看文件夹占用空间

默认的 #system/linux 不提供文件夹的大小, 而是展示`inodes`的大小(4kb). 使用下面的指令可以在shell中查看文件夹的占用空间:
```shell
du -h --max-depth 1 .
```

其中:
- `-h`表示转换成`MB`, `KB`, `GB`等单位来表示文件占用
- `--max-depth 1`表示只展示当前路径下文件夹的占用, 不需要展示更深的层级
- `.`是路径, 战绩当前路径下的占用

但是这个效率低, 需要一段时间进行查询搜索文件占用大小, 而且没有TUI或者GUI. 因此可以使用下面的一些工具进行TUI的展示:
- [ncdu](https://dev.yorhel.nl/ncdu), recommend
- [gdu](https://github.com/dundee/gdu)
- ...

## 查看文件占用空间

直接使用`ls`即可查看:
```shell
ls -alh
```
