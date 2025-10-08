---
type: system
tags:
  - system/linux
  - system/windows
done: true
---
# 双系统进入grub rescue模式

原因: 由于双系统更新或者其他原因导致nvme盘空间移动, grub无法引导boot loader

## 解决方案

### Ubuntu (未经验证)

在grub rescue界面中使用`ls`, 可以列出所有的硬件分区:
```
grub rescue> ls
(hd0) (hd1) (hd1,gpt8) (hd1,gpt7) (hd1,gpt6) (hd1,gpt5) (hd1,gpt4) (hd1,gpt3) (hd1,gpt2) (hd1,gpt1)
```

通过`ls (hd<x>,gpt<y>)`找到`/boot`文件夹所在分区:
```
grub rescue> ls (hd<x>,gpt<y>)/boot/grub
./ ../ x86_64-efi/ grubenv themes/ fonts/ grub.cfg
```

> [!warning]+ 注意
> 这里的分区`(hd<x>,<gpt<y>)`中间不能有任何的空格. 在`grub rescue`模式中所有的命令是strict模式的

> [!info]+ 注意
> 这里使用`ls`可能需要文件系统为`ext<i>`类型才能正常展示.
> 
> 如果不是, 可能需要使用ubuntu镜像u盘进入live os, 然后在里面重新安装grub

设置root, 和`/boot`文件夹路径:
```
grub rescue> set root=(hd<x>,gpt<y>)
grub rescue> set prefix=(hd<x>,gpt<y>)/boot/grub
```

重新配置grub:
```
insmod normal
normal
```

此时能进入正常的grub界面. 但是这个是临时配置的grub启动位置. 需要进入ubuntu中重新配置grub的config:
```bash
sudo update-grub
sudo grub-install /dev/<disk>
```

### ArchLinux

一般ArchLinux使用的都是[[Btrfs]]文件系统. 因此grub rescue模式中无法读取数据

需要使用安装ArchLinux的[[ArchLinux Install|live cd]], 进入live os, [[Btrfs#分卷挂载|挂载]]硬盘到`/mnt`:
```bash
mount -o subvol=/@ /dev/<disk> /mnt
mount -o subvol=/@home /dev/<disk> /mnt/home
mount /dev/<efi_disk> /mnt/efi
```

挂载的路径应该和[[ArchLinux Install#Mount|安装]]的时候一致.

使用[[Btrfs#Check|btrfs检查工具]]进行检测并修复:
```bash
btrfs scrub start /dev/<disk>
```
启动之后使用这个查看是否完成:
```bash
btrfs scrub status /dev/<disk>
```

然后进入arch:
```bash
arch-chroot /mnt
```

重新安装并配置grub:
```bash
grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id=grub
grub-mkconfig -o /boot/grub/grub.cfg
```

重启, 正常运转