---
type: system
tags:
  - system/linux
  - system/linux/archlinux
  - cli
done: true
---
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

使用[[Mount|mount]]指令

```shell
# mount main filesystem
mount /dev/nvme0n1p<*> /mnt
# mount efi partition
mount /dev/nvme0n1p1 /mnt/efi --mkdir
```

注意efi分区的挂载路径`/mnt/efi`是可以改的, 只要在`/mnt`里即可, 但是[[#配置grub启动项|后面]]需要注意路径
#### 安装基础软件

arch linux的安装是基于[[Pacman]]的, 包括`pacstrap`也是使用pacman进行安装. 因此所有对pacman的配置都会起作用.

**换源**(加速):

使用`nano`(因为启动盘中没有自带[[vim]])编辑`/etc/pacman.d/mirrorlist`, 添加两行(最上面):
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
```conf
# Misc options
#UseSyslog
Color
#NoProgressBar
CheckSpace
#VerbosePkgLists
ParallelDownloads = 5
DownloadUser = alpm
#DisableSandbox
ILoveCandy
...
[multilib]
Include = /etc/pacman.d/mirrorlist
```


**开始安装对应软件**:
```shell
pacstrap -K /mnt base base-devel linux linux-headers linux-firmware nano vim sudo intel-ucode bluez bluez-utils grub efibootmgr os-prober networkmanager resolvconf iwd dhcpcd ntfs-3g btrfs-progs
```
- `base`, `base-devel`: 基础安装包, 包含一些编译命令, 如`makepkg`, `make`等
- `linux`, `linux-headers`, `linux-firmware`: [[System]]本体和硬件管理. 还有别的版本如`linux-zen`+`linux-zen-headers`性能优化内核 / `linux-lts`+`linux-lts-headers` 长期支持的内核 [等等](https://wiki.archlinux.org/title/Kernel)
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

由于是双系统, 因此windows和linux的时区设置可能有所不同, 详细问题解决方案参考[[Linux Timezone|时区问题]]

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
```
...
#zh_CN.GBK GBK
zh_CN.UTF-8 UTF-8
#zh_CN GB2312
...
```

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
```
## Uncomment to allow members of group wheel to execute any command
%wheel ALL=(ALL:ALL) ALL
```
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

## 添加桌面环境

部分必要软件:
```shell
# update index database and upgrade softwares
sudo pacman -Syyu
# install softwares
sudo pacman -S git zsh fish openssh
# chinese font
sudo pacman -S adobe-source-han-sans-cn-fonts
```
### Nvidia

> "F\*\*k you, Nvidia!"

对于N卡用户, linux的支持非常不友好, 需要巨多配置:

#### 检查显卡

```shell
lspci -k | grep -A 2 -E "(VGA|3D)"
```

如果这里出现了问题(点名amd显卡), 那么可能是没有安装对应驱动
#### 安装nvidia驱动

```shell
sudo pacman -S nvidia-dkms nvidia-utils nvidia-settings
```

#### 配置nvidia驱动

修改`/etc/default/grub`: 在`GRUB_CMDLINE_LINUX`中写入`nvidia_drm.modeset=1`, 然后运行`sudo grub-mkconfig -o /boot/grub/grub.cfg`:
```
GRUB_CMDLINE_LINUX="nvidia_drm.modeset=1"
```

修改`/etc/mkinitcpio.conf`, 在`MODULES`中写入`nvidia nvidia_modeset nvidia_uvm nvidia_drm`, 然后在`HOOKS`中删除`kms`:
```conf
MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)
...
HOOKS=(base udev autodetect microcode modconf keyboard keymap consolefont block filesystem btrfs fsck)
```

然后重新生成initramfs:
```shell
sudo mkinitcpio -P
```

现在linux的配置基本完成, 可以在`tty`中使用. 但是没有gui桌面环境. 下面开始配置window manager:
### Hyprland

```shell
sudo pacman -S hyprland kitty sddm
```

然后开启`sddm`:
```shell
sudo systemctl enable sddm
```

> [!tip]
> 注意这里`sddm`默认WM(左上角)的是`Hyprland(...)`, 需要点击下拉框换成`Hyprland`才能正常进入
### I3wm

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
### Swaywm

> [!warning]
> 未经验证

使用sddm:
```shell
# using wayland, auto install dependencies
sudo pacman -S sway sddm
```

> [!bug]
> 这里使用sddm会有问题(似乎是对于nvidia显卡), 需要使用--unsupported-gpu才能进入
