---
type: command
tags:
  - ssh
  - software
done: true
topic:
  - "[[SSH]]"
---
# SCP

支持单文件，多文件，文件夹。

1. 上传
   ```shell
   scp -P <remote-port> <-r> <local-file-position> <username>@<remote-address>:<remote-file-position>
   ```
   使用`<-r>`如果上传的是文件夹
2. 下载
   ```shell
   scp -P <remote-port> <-r> <username>@<remote-address>:<remote-file-position> <local-file-position>
   ```
   使用`<-r>`下载文件夹

压缩文件：`-C`
