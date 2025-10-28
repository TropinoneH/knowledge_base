---
type: system
tags:
  - system/linux
done: true
topic:
 - "[[System]]"
---
# 修改hostname

尝试直接使用`hostnamectl`:
```shell
hostnamectl <new-hostname>
```

如果没有这个命令, 可以编辑`/etc/hostname`文件, 里面写的就是hostname.

然后, 查看`/etc/hosts`文件, 可能也需要更改.

修改hostname之后, 部分软件可能无法打开:
1. `google-chrome-stable`: 删除locked profile即可:
   ```shell
   rm ~/.config/google-chrome/SingletonLock ~/.config/google-chrome/SingletonCookie ~/.config/google-chrome/SingletonSocket
   ```
