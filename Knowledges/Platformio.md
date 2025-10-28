---
type: software
tags:
  - code/python
  - system
  - system/linux
  - hardware
  - cli
done: true
topic:
  - "[[System]]"
  - "[[Coding]]"
---
# Platformio

用于开发硬件板子的开发程序. 将C++或者汇编语言编译, 然后烧录到硬件板子中.

这个是[[Computer Architecture]]课程的project需要用到的内容, 目前已经遗忘

## how to use platformio

使用[[Python Module#pip|pip]]或者scripts下载:

e.g. [[Python Module#pip|pip]]:

```shell
pip install platformio
```

然后, 运行`platformio`:

```shell
python -m platformio home
```

然后可以在主文件夹下找到一个隐藏文件夹: `~/.platformio`


如果不想通过longan nano进行开发, 可能会需要往这个文件夹中添加一些拓展

and also, you may wan't to use `penv/bin/pio` to develop, such as:

```shell
pio home
```

# Permission problem

```shell
# UDEV Rules for Arduino UNO R4 boards
#
# This will allow reflashing with DFU-util without using sudo
#
# This file must be placed in:
#
#       /etc/udev/rules.d
#
# After this file is installed, physically unplug and reconnect the device.
#
#       Arduino UNO R4
#       --------------
#
SUBSYSTEMS=="usb", ATTRS{idVendor}=="28e9", ATTRS{idProduct}=="0189", GROUP="plugdev", MODE="0666"
SUBSYSTEMS=="usb_device", ATTRS{idVendor}=="28e9", ATTRS{idProduct}=="0189", GROUP="plugdev", MODE="0666"
#
# If you share your linux system with other users, or just don't like the
# idea of write permission for everybody, you can replace MODE:="0666" with
# OWNER:="yourusername" to create the device owned by you, or with
# GROUP:="somegroupname" and mange access using standard unix groups.
#
```

使用上面的脚本，并保存到`/etc/udev/rules.d/<name:platformio-sudo>.rules`这里面

这个脚本中，两个地址是运行`./dfu-util --list`中，`Cannot open ...`的时候显示的地址。如：

```shell
dfu-util: Cannot open DFU device 28e9:0189
```
