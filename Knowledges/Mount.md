---
type: command
tags:
  - cli
  - system/linux
done: true
topic:
 - "[[System]]"
---
# Mount

挂载分区

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

有时候不同类型需要额外安装一些程序, 比如说[[ArchLinux Install|ArchLinux]]中挂载ntfs需要[[Pacman]]安装`ntfs-3g`