# 更改默认的终端模拟器

```shell
sudo update-alternatives --config x-terminal-emulator
```

上面那个好像是没有作用的

需要用下面这个：

```shell
gsettings set org.gnome.desktop.default-applications.terminal exec $(which terminal)
gsettings set org.gnome.desktop.default-applications.terminal exec-arg "-x"
```

你需要把terminal改成你的终端，如，`wezterm`，或者`terminator`。当然，直接改成绝对路径也可以。

# 更改默认终端

注意区分终端terminal和终端模拟器terminal-emulator的区别。终端模拟器是gui壳子，内部运行的是终端。

使用下面指令更改默认终端（注意需要重启）：

```shell
sudo chsh -s $(which shell)
```

shell是终端的名字，如`zsh`,`sh`,`bash`等等
