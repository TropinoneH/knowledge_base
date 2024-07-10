# ssh初级

使用：

```shell
ssh <username>@<address> -p <port>
```

## 作为服务器

安装server端：

```shell
sudo apt-get install openssh-server
```

配置sshd文件，位于`/etc/ssh/sshd_config`。只需要注意一下Port需要更改即可

更改完配置需要重启服务：

```shell
sudo systemctl restart sshd
```

使用下面的命令检查状态：

```shell
sudo systemctl status sshd
```

# 端口转发

```shell
ssh -L <local-port>:<remote-address>:<remote-port> <username>@<address> -p <port>
```

一般而言，remote-address直接使用`127.0.0.1`即可

如果是将本地的端口转发给远程的机器，只需要将`-L`改成`-R`即可

```shell
ssh -R <remote-port>:<local-address>:<local-port> <username>@<address> -p <port>
```

相似的，`<local-address>`一般是`127.0.0.1`

# scp

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
