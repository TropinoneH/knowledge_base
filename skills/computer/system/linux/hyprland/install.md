# 安装准备
准备一个u盘，用于装载arch安装程序

下载一个arch的镜像（最新版即可，滚动更新）

烧录进u盘中

# 安装arch

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
