---
type: system
tags:
  - error
  - system/linux/ubuntu
  - cli
done: false
topic:
  - "[[System]]"
---
## create from docker

`command not found` 常见于从[[Docker]]中创建一个最简单的ubuntu镜像后. 这个image没有任何的环境. 因此许多的命令需要安装.

#### apt-add-repository
```bash
apt install software-properties-common
```

#### pip install evdev
安装evdev的时候如果报错`linux/input.h`和`linux.input-event-codes.h`未找到, 可以安装下面的命令:
```bash
apt install build-essential
```

