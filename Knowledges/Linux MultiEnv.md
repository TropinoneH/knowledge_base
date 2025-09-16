---
type: command
tags:
  - cli
  - system/linux/archlinux
  - system/linux/ubuntu
done: false
---
# Update-Alternatives

[[Dual-System Install Ubuntu|Ubuntu]]自带一个update-alternatives命令, 可以更新ubuntu的环境管理.

管理的原理为: 创建一个软链接, 使用update-alternatives命令将不同的环境(版本)的软件链接到软链接的位置. 因此只需要将软链接的目标位置加入`$PATH`中即可

## Cuda

如果电脑上安装了多个Cuda环境，可以直接在zshrc里面引用`/usr/local/cuda/bin`作为cuda的目录，然后就可以通过下面的指令切换Cuda：

```shell
sudo update-alternatives --config cuda
```

如果是新安装了一个Cuda，那么需要通过下面的指令进行识别：

```shell
sudo update-alternatives --install "/usr/local/cuda" "cuda" "<path/to/cuda/folder>" <priority>
```

`<priority>`指的是默认的权重，`<path/to/cuda/folder>`通常是`/usr/local/cuda-xx.x`这样的路径

## Java

首先先下载对应版本的java包，通常是使用`wget`来下载。

解压安装包，然后将解压后的文件夹移动到`/usr/lib/jvm/java-xx-openjdk-amd64`文件夹下，其中`xx`表示版本号。

然后通过`update-alternatives`来设置默认的java对应的版本：

```shell
sudo update-alternatives --install "/usr/bin/java" "java" "/usr/bin/jvm/java-xx-openjdk-amd64/bin/java" <priority>
```

其中，`<priority>`需要替换成优先级，优先级越高，auto模式就会优先调用。

# [[ArchLinux Install|ArchLinux]]-Java

使用[[Pacman]]作为包管理工具，可以直接下载对应版本的`java`：

```shell
sudo pacman -S jdk8-openjdk
# or use java 17
sudo pacman -S jdk17-openjdk
```

安装多个版本的java可以使用自带的`archlinux-java`进行环境管理。

```shell
# use status for checking current java environment
archlinux-java status
# set current java environment
archlinux-java set <Java-env>
# unset current java environment
archlinux-java unset
```

# Conda

![[Conda#Conda]]