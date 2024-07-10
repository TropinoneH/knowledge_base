# Ubuntu 键盘fn功能区

关于fn功能区的问题，有的时候腹灵键盘的fn区无法正常使用，这个时候可以通过一些手段强制让fn分区编程F键而不是功能键（当然，按住<kbd>fn</kbd>之后还是功能键）

更改方法如下：

```shell
echo options hid_apple fnmode=2 | sudo tee -a /etc/modprobe.d/hid_apple.conf
sudo update-initramfs -u -k all
reboot # 重启之后生效
```

然后就可以正常使用了。
