# 多显示器黑屏

如果NVIDIA驱动下外置显示器黑屏，请考虑：

```shell
sudo systemctl enable nvidia-suspend
sudo systemctl enable nvidia-resume
sudo systemctl enable nvidia-hibernate
```

在`/etc/mkinitcpio.conf`中, 找到HOOKS, 删除resume, 添加systemd. 找到MODULE, 添加xhci_hcd. 需要安装`paru -S upd72020x-fw`

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
