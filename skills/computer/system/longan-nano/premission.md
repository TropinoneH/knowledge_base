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
