# ssh初级

使用：

```shell
ssh <username>@<address> -p <port>
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
