---
type: skills
tags:
  - system/linux/ubuntu
  - cli
  - software/terminal
done: true
topic:
  - "[[System]]"
---
# 更改默认的终端模拟器

首先使用[[Linux MultiEnv#Update-Alternatives|Update Alternatives]]指令切换默认的`x-terminal-emulator`
```shell
sudo update-alternatives --config x-terminal-emulator
```

这个是用于更改x-terminal-emulator这个的选项，但是默认打开的终端不是在这里打开的，而是下面的这两行命令更改：

```shell
gsettings set org.gnome.desktop.default-applications.terminal exec $(which terminal)
gsettings set org.gnome.desktop.default-applications.terminal exec-arg "-x"
```

你需要把terminal改成你的终端，如，`wezterm`，或者`terminator`。当然，直接改成绝对路径也可以。