---
type: skills
tags:
  - system/linux
  - system/windows
  - error
  - cli
done: true
topic:
 - "[[System]]"
---
# Dual-System Timezone Error

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

# Local Time mismatch Universal Time

考虑时间对应的问题。首先将时区信息重新加载：

```shell
sudo rm /etc/localtime
sudo ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
sudo hwclock --systohc
```
