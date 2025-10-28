---
type: system
tags:
  - system/linux
done: true
topic:
 - "[[System]]"
---
# 更改用户名

首先更改用户名称:
```shell
sudo usermod -l <new_name> <old_name>
```

然后更新用户目录:
```shell
sudo usermod -d /home/<new_name> -m <new_name>
```

注意, 可能有很多地方都会用到这个用户名, 比如说`ln`的软链接, miniconda的shell.fish等等
