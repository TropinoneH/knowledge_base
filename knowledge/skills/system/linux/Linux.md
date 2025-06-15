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
#### 联网

使用`iwctl`进行连接WiFi, 或者直接连接有线网(推荐)
```shell
 station <name> scan
 station <name> get-networks
 station <name> connect <essid>
```
#### 修改时区

```shell
timedatectl set-utp true
timedatectl status
```
#### 分盘

使用`fdisk -l`查看分区，找到想要挂在的盘，记录分区编号（一般都是`/dev/nvme0n1px`，其中`x`表示数字）

使用`cfdisk /dev/nvme0n1`进入tui界面, 进行分盘.

一般分盘swap需要16G, 主目录自由分盘. 不需要手动创建`/home`的分盘(后续可以使用btrfs的subvolume进行区分)

![[Pasted image 20250615034145.png]]
找到对应的free space, 然后new(按下<kbd>Enter</kbd>键选择下方的菜单, 左右键切换下方的菜单, 上下键切换上方的partition)

然后对于new的partition可以选择type, swap分区需要选择`Linux swap`类型, 普通的目录保持`Linux filesystem`即可
#### 格式化

对于swap分区(以上图为例, 注意硬盘和partition的序号):
```shell
# create swap partition
mkswap /dev/nvme0n1p<*>
# mount swap
swapon /dev/nvme0n1p<*>
```

对于`Linux filesystem`分区, 这里使用[[#btrfs]]作为文件系统:
```shell
mkfs.btrfs -f /dev/nvme0n1p<*>
```

> [!warning]
> 这个操作会强制抹掉所有内容, 谨慎操作
#### 挂载

使用[[Commands#mount|mount]]指令

```shell
# mount main filesystem
mount /dev/nvme0n1p<*> /mnt
# mount efi partition
mount /dev/nvme0n1p1 /mnt/efi --mkdir
```

注意efi分区的挂载路径`/mnt/efi`是可以改的, 只要在`/mnt`里即可, 但是[[#配置grub启动项|后面]]需要注意路径
#### 安装基础软件

arch linux的安装是基于[[Commands#pacman|Pacman]]的, 包括`pacstrap`也是使用pacman进行安装. 因此所有对pacman的配置都会起作用.

**换源**(加速):

使用`nano`(因为启动盘中没有自带[[VIM]])编辑`/etc/pacman.d/mirrorlist`, 添加两行(最上面):
```
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
```

**修改pacman.conf配置**:

编辑`/etc/pacman.conf`文件:
1. 解除`Color`一行的注释: 允许pacman安装指示界面有颜色
2. 解除`ParallelDownloads = 5`一行的注释: 允许并行下载. 在下载小文件的时候能够利用大宽带
3. Optional: 添加一行`ILoveCandy`: 变成进度条吃豆人的样式
4. 取消掉`[multilib]`和下一行`Include = /etc/pacman.d/mirrorlost`的注释: 允许`multilib`这个库的软件安装
![[Pasted image 20250615183711.png]]
![[Pasted image 20250615183717.png]]

**开始安装对应软件**:
```shell
pacstrap -K /mnt base base-devel linux linux-headers linux-firmware nano vim sudo intel-ucode bluez bluez-utils grub efibootmgr os-prober networkmanager resolvconf iwd dhcpcd ntfs-3g btrfs-progs
```
- `base`, `base-devel`: 基础安装包, 包含一些编译命令, 如`makepkg`, `make`等
- `linux`, `linux-headers`, `linux-firmware`: [[Linux]]本体和硬件管理. 还有别的版本如`linux-zen`+`linux-zen-headers`性能优化内核 / `linux-lts`+`linux-lts-headers` 长期支持的内核 [等等](https://wiki.archlinux.org/title/Kernel)
- `nano`, `vim`: editor
- `sudo`: permission control
- `intel-ucode`/`amd-ucode`: 对于不同CPU的架构, 安装对应的ucode. microcode为CPU提供安全性和bug的补丁
- `bluez`, `bluez-utils`: 蓝牙
- `grub`, `efibootmgr`, `os-prober`: grub相关, 配置开机BIOS相关内容
- `networkmanager`, `resolvconf`, `iwd`, `dhcpcd`: 网络配置
- `ntfs-3g`, `btrfs-progs`: 文件系统驱动
#### 配置自动挂载

在启动的时候, 所有linux的文件(以及内核等)都存在与`/dev/nvme0n1p<*>`中. 想要运行linux, 需要进入这个盘, 所以在启动的时候需要挂载这个盘才能正常进入linux. 包括一些swap分区和efi分区, 都需要在启动的时候自动挂载. 因此使用`genfstab`命令配置自动挂载:
```shell
genfstab -U /mnt >> /mnt/etc/fstab
```
注意此时还是在U盘的启动配置中, 没有进入[[#Arch Linux]]本体
### 配置Arch Linux

安装完基础软件之后, 需要配置linux系统, 使其能够正常运行.

使用`arch-chroot`以root身份进入linux系统(`/mnt`是之前挂载系统的位置):
```shell
arch-chroot /mnt
```
#### 时区

由于是双系统, 因此windows和linux的时区设置可能有所不同, 详细问题解决方案参考[[#Localtime和Universal Time对不上|时区问题]]

设置对应地区的时间(中国时区设置为Shanghai):
```shell
# setup time zone
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localetime
# sync hardware clock
hwclock --systohc
```
上述命令需要root权限, 但是由于是`arch-chroot`进入的系统, 本是是root身份, 因此无需`sudo`
#### 更改语言

编辑`/etc/locale.gen`文件, 取消需要生成文字的类型前的注释:
![[Pasted image 20250615170948.png]]

(推荐使用`en_US.UTF-8 UTF-8`和`zh_CN.UTF-8 UTF-8`)

然后生成对应的locale信息:
```shell
locale-gen
```

然后编辑`/etc/locale.conf`, 写入需要的语言, 如:
```
LANG=en_US.UTF-8
```
#### 修改用户信息

**首先修改hostname**: 在文件`/etc/hostname`写入的内容就是`hostname`, 是这台计算机的名称

**修改root用户的password**:
```shell
# run this command with root user
passwd
```

**创建新用户**:
```shell
useradd -m -G wheel -s /bin/fish <username>
```
表示创建一个`wheel` group的用户`<username>`, 默认的shell是`/bin/fish`. 如果没有设个shell, 可能会报一个警告, 但是无需理会

**修改新用户的密码**(这个新用户是日常使用的用户):
```shell
passwd <username>
```

**修改用户权限**: 使用`visudo`, 是使用vim对`/etc/sudoers`文件的编辑, 但是配备了语法检查:
```shell
visudo
# or
vim /etc/sudoers
```
将`%wheel ALL=(ALL:ALL) ALL`这一行的注释删除:
![[Pasted image 20250615180919.png]]
#### 配置内核initramfs

initramfs: initial RAM filesystem

在启动过程中, 会将内核和initramfs的内容加载. 使用initramfs的原因是: 对于不同的文件系统和磁盘布局, 需要不同的内核模块, 因此使用initramfs进行内核模块的加载

编辑`/etc/mkinitcpio.conf`, 找到`HOOKS`部分, 添加brtfs:
![[Pasted image 20250615181559.png]]

后期配置nvidia的时候会再次修改这个文件

在每次修改配置之后, 需要手动生成一边initramfs:
```shell
mkinitcpio -P
```
#### 配置grub启动项

在启动的时候, 需要给内核传递参数. 比如说, nvidia显卡的modeset, 等等.

包括启动grub界面的美化, 也需要配置.

**配置启动项**:

编辑`/etc/default/grub`文件, 然后去掉最后一行的`GRUB_DISABLE_OS_PROBER=false`的注释(让disable os-prober=false, 即允许os-prober):
![[Pasted image 20250615182155.png]]

**安装grub**:
```shell
grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id=grub
```

> [!tip]
> 1. `target`对应的是电脑型号, 如果是32bit的电脑, 使用x86-efi
> 2. `efi-directory`对应的是之前`/dev/nvme0n1p1` mount的位置, 即windows system盘挂载的位置.
> 3. `bootloader-id`可以任意取, 但是不能是`EFI`等, 推荐使用`grub`, `GRUB`, `Grub`等等

**应用grub配置**:

在修改`/etc/default/grub`文件之后, 必须应用这个配置, 写入到bios中, 才能真正使用这个配置:
```shell
grub-mkconfig -o /boot/grub/grub.cfg
```

> [!tip]
> 1. 如果你是第一次运行这个命令, 那么`grub.cfg`文件是不存在的, 但是`/boot/grub`文件夹一定存在, 可能和`bootloader-id`有关
> 2. 第一次可能找不到windows的boot manager, reboot之后重新运行上述命令即可找到(可能需要`sudo`权限)

现在可以重新启动, 即可进入user用户使用linux
### 添加桌面环境

部分必要软件:
```shell
# update index database and upgrade softwares
sudo pacman -Syyu
# install softwares
sudo pacman -S git zsh fish openssh
# chinese font
sudo pacman -S adobe-source-han-sans-cn-fonts
```
#### Nvidia

> "F\*\*k you, Nvidia!"

对于N卡用户, linux的支持非常不友好, 需要巨多配置:

##### 检查显卡

```shell
lspci -k | grep -A 2 -E "(VGA|3D)"
```

如果这里出现了问题(点名amd显卡), 那么可能是没有安装对应驱动
##### 安装nvidia驱动

```shell
sudo pacman -S nvidia-dkms nvidia-utils nvidia-settings
```

##### 配置nvidia驱动

修改`/etc/default/grub`: 在`GRUB_CMDLINE_LINUX`中写入`nvidia_drm.modeset=1`, 然后运行`sudo grub-mkconfig -o /boot/grub/grub.cfg`:
![[Pasted image 20250615185548.png]]

修改`/etc/mkinitcpio.conf`, 在`MODULES`中写入`nvidia nvidia_modeset nvidia_uvm nvidia_drm`, 然后在`HOOKS`中删除`kms`:
![[Pasted image 20250615185747.png]]
![[Pasted image 20250615185800.png]]

然后重新生成initramfs:
```shell
sudo mkinitcpio -P
```

现在linux的配置基本完成, 可以在`tty`中使用. 但是没有gui桌面环境. 下面开始配置window manager:
#### Hyprland

```shell
sudo pacman -S hyprland kitty sddm
```

然后开启`sddm`:
```shell
sudo systemctl enable sddm
```

> [!tip]
> 注意这里`sddm`默认WM(左上角)的是`Hyprland(...)`, 需要点击下拉框换成`Hyprland`才能正常进入
#### I3wm

使用`lightdm`作为启动界面:
```shell
# xorg server, using x11 environment
sudo pacman -S xorg xorg-server
# install startup page and i3
sudo pacman -S lightdm i3status i3
# install necessary softwares
sudo pacman -S alacritty rofi feh picom polybar
```

然后开启`lightdm`:
```shell
sudo systemctl enable lightdm
```
#### Swaywm

> [!warning]
> 未经验证

使用sddm:
```shell
# using wayland, auto install dependencies
sudo pacman -S sway sddm
```

> [!bug]
> 这里使用sddm会有问题(似乎是对于nvidia显卡), 需要使用--unsupported-gpu才能进入
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

## 分卷挂载

使用[[Commands#mount|mount]]命令, 使用options:
```shell
sudo mount -o subvol=/<vol_name> /dev/nvme0n<*>p<*> </path/to/mount>
```

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


# 更改用户名

首先更改用户名称:
```shell
sudo usermod -l <new_name> <old_name>
```

然后更新用户目录:
```shell
sudo usermod -d /home/<new_name> -m <new_name>
```

注意, 可能有很多地方都会用到这个用户名, 比如说`ln`的软链接, miniconda的shell.fish等等

# 修改hostname

尝试直接使用`hostnamectl`:
```shell
hostnamectl <new-hostname>
```

如果没有这个命令, 可以编辑`/etc/hostname`文件, 里面写的就是hostname.

然后, 查看`/etc/hosts`文件, 可能也需要更改.

修改hostname之后, 部分软件可能无法打开:
1. `google-chrome-stable`: 删除locked profile即可:
   ```shell
   rm ~/.config/google-chrome/SingletonLock ~/.config/google-chrome/SingletonCookie ~/.config/google-chrome/SingletonSocket
   ```