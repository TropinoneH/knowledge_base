---
tags:
  - system
  - tutorial
  - linux
---
# Text Editor

## nano

## Vim

[[VIM]]

## NVIM

# Show Capacity
## show disk capacity

```shell
df -lh
```

## show file size

```shell
ls -alh
```

## show folder size

use `ls` cannot show the total size of the folder. `ls` only show the size of the "folder" file: 4k

use the command below to show the size of a folder:

```shell
du -h --max-depth=1 | sort -h
```


# SSH

使用：

```shell
ssh <username>@<address> -p <port>
```

## 作为服务器

安装server端：

```shell
sudo apt-get install openssh-server
```

配置sshd文件，位于`/etc/ssh/sshd_config`。只需要注意一下Port需要更改即可

更改完配置需要重启服务：

```shell
sudo systemctl restart sshd
```

使用下面的命令检查状态：

```shell
sudo systemctl status sshd
```

## 端口转发

```shell
ssh -L <local-port>:<remote-address>:<remote-port> <username>@<address> -p <port>
```

一般而言，remote-address直接使用`127.0.0.1`即可

如果是将本地的端口转发给远程的机器，只需要将`-L`改成`-R`即可

```shell
ssh -R <remote-port>:<local-address>:<local-port> <username>@<address> -p <port>
```

相似的，`<local-address>`一般是`127.0.0.1`

## scp

支持单文件，多文件，文件夹。

1. 上传
   ```shell
   scp -P <remote-port> <-r> <local-file-position> <username>@<remote-address>:<remote-file-position>
   ```
   使用`<-r>`如果上传的是文件夹
2. 下载
   ```shell
   scp -P <remote-port> <-r> <username>@<remote-address>:<remote-file-position> <local-file-position>
   ```
   使用`<-r>`下载文件夹

压缩文件：`-C`

# Git

refer: [[git]]

# Docker

refer: [[docker]]

# Conda

refer: [[miniconda]]

# pip

refer: [[module#pip|pip]]
# pacman & paru

default package manager on ArchLinux, etc.

## manual install pkgs

use `makepkg -si` in the folder with `PKGBUILD` file.

you can manual write the `PKGBUILD` or get aur repo by [[git#clone|clone]]:

```shell
git clone https://aur.archlinux.org/<pkg_name>
```

## pacman

install
```shell
sudo pacman -S <pkg_name>
```

update
```shell
sudo pacman -Sy
```

upgrade
```shell
sudo pacman -Syyu
```

uninstall
```shell
sudo pacman -Rsn <pkg_name>
```

force uninstall(ignore dependency):
> [!danger]
> this may cause lots of error.
> 
> please make sure you clearly know what you are doing
```shell
sudo pacman -Rdd <pkg_name>
```

clean cache:
```shell
sudo pacman -Scc
```

online search (search all pkgs):
```
pacman -Ss <pkg_name>
```

search (with locally installed pkgs):
```shell
pacman -Qs <pkg_name>
```

## Paru

same usage as [[#pacman]].

download pkgs from `aur.archlinux.org`, which is not such official.

# ntfsfix

修复一些基本的ntfs一致性问题, 不是chkdsk(没法修复复杂的问题, 如索引丢失等)

修复分区:
```shell
sudo ntfsfix /dev/nvme0n1p<*>
```

Clear the volume dirty flag if the volume can be fixed and mounted. If the option is not present or the volume cannot be fixed, the dirty volume flag is set to request a volume checking at next mount.
```shell
sudo ntfsfix -d /dev/nvme0n1p<*>
```

# mount

挂载分区.

直接挂载到已有位置(文件夹):
```shell
sudo mount /dev/<disk&part> </path/to/mount>
```

挂载并自动创建文件夹(如果没有):
```shell
sudo mount --mkdir /dev/<disk&part> </path/to/mount>
```

使用option:
```shell
sudo mount --options key1=val1,key2=val2 /dev/<disk&part> </path/to/mount>
```

常用options - btrfs的分卷:
```shell
sudo mount -o subvol=/@,defaults,user /dev/<disk&part> </path/to/mount>
```

指定partition类型:
```shell
sudo -t <type> mount /dev/<disk&part> </path/to/mount>
```
有时候不同类型需要额外安装一些程序, 比如说ntfs需要[[#pacman]]安装`ntfs-3g`

