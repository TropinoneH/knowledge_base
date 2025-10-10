---
type: skills
tags:
  - system/windows
  - web
done: true
---
- 入站: 外部的流量访问本机
- 出站: 本机的信息流量向外部发送
- 参考网站: [csdn](https://blog.csdn.net/wangjunlei/article/details/134287042)

# Firewall

默认windows的防火墙是全部打开的, 会阻止全部的port的入站流量. 部分的程序会请求打开某个端口的入站规则(有一个UWP弹窗, 询问是否允许某程序访问公共网络).

上述所有的内容都放在了防火墙的规则集合里面.

如果想开放某个port的入站, 可以这样:
![[Pasted image 20251011000933.png]]

然后默认, 选择TCP, 端口指定需要放流量的端口, 选择“允许连接”, 选择合适的网络:

![[Pasted image 20251011001130.png]]
![[Pasted image 20251011001139.png]]
![[Pasted image 20251011001149.png]]

即可新建一个端口

Linux防火墙: [[Linux Firewall|this]]
