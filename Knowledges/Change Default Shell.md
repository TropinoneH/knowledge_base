---
type: command
tags:
  - cli
  - software/shell
  - system
  - ssh
done: true
---
# 更改默认Shell

注意区分Shell和终端模拟器terminal-emulator的区别。终端模拟器是gui壳子, 是一个窗口，内部运行的是Shell。

使用下面指令更改默认终端（注意需要重启）：

```shell
sudo chsh -s $(which <shell>)
```

`<shell>`是终端的名字，如[[Shell#Zsh|zsh]],`sh`,`bash`,[[Shell#Fish Shell|fish]]等等

在切换shell之后, 需要logout然后重新进入才能完成修改, 单纯关闭终端是没有用的.

## SSH修改Shell

在ssh中切换shell之后需要退出重新进入才能默认选择, 不需要重新启动

## shell路径

如果有`sudo`权限, 那么可以直接进行安装shell. 默认安装的shell的时候会把shell的路径写入到`/etc/shells`中. 如果要切换shell, 需要从这个文件中选择一个shell.

如果没有添加到这个文件中, 你可以手动将绝对路径写入这个文件的新的一行中. 然后使用上面的指令即可切换shell.

但是如果没有sudo权限, 自己手动编译shell, 那么这个时候无法将shell的路径写入`/etc/shells`, 此时使用`chsh`无法切换. 只能通过在默认的`~/.bashrc`或者`~/.profile`中直接启动对应的终端才能启动