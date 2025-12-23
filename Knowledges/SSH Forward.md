---
type: command
tags:
  - cli
  - ssh
done: true
topic:
  - "[[SSH]]"
---
# Forward

ssh在[[SSH Login|登陆远程服务器]]之外, 还可以将端口转发.

## Forward Remote Port to Local

将远程(服务器)的端口转发到本地(宿主机):

```bash
ssh -L <local-port>:<remote-address>:<remote-port> <username>@<address> -p <port>
```


用途: 服务器上有程序运行, 将端口暴露. 如果想要在本地也使用这个端口, 使用这个ssh端口转发

> [!example]+ 
> 在远程服务器上启动一个网页服务(如, 使用[[Pnpm]]: `pnpm dev`), 端口在本地的`0.0.0.0:3000`.
> 
> 如果想要在本地调试网页, 需要在本地的浏览器访问这个网页. 因此将远程的端口转发给本地
## Forward Local Port to Remote

将本地(宿主机)的端口转发到远程(服务器):

```bash
ssh -R <remote-port>:<local-address>:<local-port> <username>@<address> -p <port>
```

用途: 本地的程序提供端口, 使用转发, 在远程服务器也能使用

> [!example]+ 
> 本地启动了[[VPN#Clash|clash]], 端口为`7890`.
> 
> 远程使用梯子, 需要将`7890`端口转发到远程, 然后使用`export http_proxy=http://127.0.0.1:7890`使用端口
