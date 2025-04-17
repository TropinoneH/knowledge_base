---
tags:
  - system
  - linux
  - tutorial
---
# Ubuntu

## 安装双系统

- 首先进入windows，创建一个系统盘（需要一个u盘，不同太大，2-4g即可），烧录linux系统
- 进入磁盘管理（<kbd>Win+X</kbd>，然后找到`磁盘管理`，或者按键<kbd>K</kbd>），分割新的盘，方法：右键选中要分盘的内容$\rightarrow$压缩卷（主力推荐250G以上，体验只需要50G左右即可）
- 然后将制作好的系统盘插入插口，重启电脑。（这一步推荐电脑不要连接任何的外界设备）
> [!tip]
> 需要注意的是，重启之前要关闭`BitLocker`，并且推荐使用混合显卡输出或者直接使用核显
- 进入BIOS，在启动选项中，找到u盘的位置，并将其的优先级设置为最高（目的是让系统的UEFI从u盘启动）
- 选择`try or install ubuntu`
- 默认，一直到选择如何安装界面。选择最小安装（推荐），下一步推荐使用`Something else`选项，手动设置启动盘的选项
- 找到新分的区域，分盘，将16384(16G)的空间分配给交换区（Logistic，ext4，swap，当然，内存越大swap越小即可），然后剩下的都可以直接分给`/`分区（Logistics，ext4，`/`）
- 默认，提示拔出u盘后按下<kbd>enter</kbd>，然后强制关机即可
- 重启后即可进入ubuntu界面

## Ubuntu 键盘fn功能区

关于fn功能区的问题，有的时候腹灵键盘的fn区无法正常使用，这个时候可以通过一些手段强制让fn分区编程F键而不是功能键（当然，按住<kbd>fn</kbd>之后还是功能键）

更改方法如下：

```shell
echo options hid_apple fnmode=2 | sudo tee -a /etc/modprobe.d/hid_apple.conf
sudo update-initramfs -u -k all
reboot # 重启之后生效
```

然后就可以正常使用了。

## 更改默认的终端模拟器

```shell
sudo update-alternatives --config x-terminal-emulator
```

这个是用于更改x-terminal-emulator这个的选项，但是默认打开的终端不是在这里打开的，而是下面的这两行命令更改：

```shell
gsettings set org.gnome.desktop.default-applications.terminal exec $(which terminal)
gsettings set org.gnome.desktop.default-applications.terminal exec-arg "-x"
```

你需要把terminal改成你的终端，如，`wezterm`，或者`terminator`。当然，直接改成绝对路径也可以。

# Arch Linux

## 安装双系统

准备一个u盘，用于装载arch安装程序

下载一个arch的镜像（最新版即可，滚动更新）

烧录进u盘中

### 安装arch

修改bios进入u盘搭载的安装辅助镜像

1. 联网。使用iwctl连接。

   ```shell
     station <name> scan
     station <name> get-networks
     station <name> connect <essid>
   ```

   或者更推荐使用网线连接。

2. 修改时区

   ```shell
   timedatectl set-utp true
   timedatectl status
   ```

3. 分盘

   使用`fdisk -l`查看分区，找到想要挂在的盘，记录分区编号（一般都是`/dev/nvme0n1px`，其中`x`表示数字）

   使用`cfdisk /dev/nvme0n1`进入tui界面

## 多显示器黑屏

如果NVIDIA驱动下外置显示器黑屏，请考虑：

```shell
sudo systemctl enable nvidia-suspend
sudo systemctl enable nvidia-resume
sudo systemctl enable nvidia-hibernate
```


在`/etc/modprobe.d/nvidia.conf`中加入:

```
options nvidia NVreg_PreserveVideoMemoryAllocations=1
options nvidia NVreg_TemporaryFilePath=/var/tmp
```

然后在`/etc/default/grub`的启动参数(`GRUB_CMDLINE_LINUX`)里面添加`resume=UUID=<swap-uuid>`

运行下面的命令更新grub启动参数：

```shell
sudo grub-mkconfig -o /boot/grub/grub.cfg
sudo mkinitcpio -P
```

# Commands

refer [[Commands|this]]

# 时区

windows在进入Linux后可能会出现时间错乱的问题，是由于双系统时区问题导致。

使用下面的命令修复：

```shell
sudo apt-get install ntpdate
sudo ntpdate -u time.windows.com
sudo hwclock --localtime --systohc
```

如果是arch，可以考虑使用这个：

```shell
sudo timedatectl set-local-rtc true
```

## Localtime和Universal Time对不上

考虑时间对应的问题。首先将时区信息重新加载：

```shell
sudo rm /etc/localtime
sudo ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
sudo hwclock --systohc
```

# 更改默认终端

注意区分终端terminal和终端模拟器terminal-emulator的区别。终端模拟器是gui壳子，内部运行的是终端。

使用下面指令更改默认终端（注意需要重启）：

```shell
sudo chsh -s $(which <shell>)
```

`<shell>`是终端的名字，如`zsh`,`sh`,`bash`等等

# 更新Icon
## 更改gtk图标

默认的图标位置在`/usr/share/icons/`

可以通过更改`/usr/share/icons/default/index.theme`来更改默认图标

如果在图标中找不到对应的`iconName`那么会到hicolor里面去寻找(fallback)

## 手动更新图标缓存

使用命令

```shell
gtk-update-icon-cache <path/to/icons: /usr/share/icons>
gtk4-update-icon-cache <path/to/icons: /usr/share/icons>
```

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


