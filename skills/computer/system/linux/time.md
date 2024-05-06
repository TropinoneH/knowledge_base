# 时区

windows在进入ubuntu后可能会出现时间错乱的问题，是由于双系统时区问题导致。

使用下面的命令修复：

```shell
sudo apt-get install ntpdate
sudo ntpdate -u time.windows.com
sudo hwclock --localtime --systohc
```
