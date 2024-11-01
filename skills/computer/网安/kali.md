# 一.安装

略

# 二.kali配置

[配置apt软件源](https://www.cnblogs.com/qm-zy/p/16508085.html)

[kali初始配置](https://blog.csdn.net/mangoJohn/article/details/116616264)

[解决高分辨率屏幕字体显示过小的问题](https://blog.csdn.net/mi2shao/article/details/125146083?spm=1001.2101.3001.6650.8&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-8-125146083-blog-104300747.pc_relevant_multi_platform_whitelistv4&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-8-125146083-blog-104300747.pc_relevant_multi_platform_whitelistv4&utm_relevant_index=13)

[kali安装中文输入法](https://blog.csdn.net/weixin_45631954/article/details/118228100?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-118228100-blog-121921091.t5_layer_eslanding_D_4&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-118228100-blog-121921091.t5_layer_eslanding_D_4&utm_relevant_index=1)

# 三.Nmap

> `nmap`又称上帝之眼,是扫描的工具,可以快速查看对方`ip`地址的机器的操作系统,开放端口,版本号,也可以配合脚本扫描对方的漏洞,是渗透测试里的重要工具.

## 1.使用

> 查找本机IP: `sudo ifconfig -a`, 找到`inet`选项后面的就是本机`ip`

输入`nmap <ip地址>`就可以扫描`ip`了

但是好像扫描的端口不全.我扫描自己的服务器好像扫出来开放的端口不对劲

```shell
#符号和含义:
PORT #端口
STATE #端口状态
SERVICE #端口服务
open #端口开放状态
closed #端口是关闭状态的
filtered #端口被防火墙IDS/IPS屏蔽,无法扫描状态
unfiltered #端口未被屏蔽,但是是否开放还需要进一步确定
#在扫描过程中按下Space空格键可以查看扫描的进度
```

## 2.参数

```shell
-sS #使用TCP SYN扫描
-sV #扫描版本号
-T4 #快速扫描方式
#快速扫描方式从T0-T5,级别也高,扫描速度越快(T5最高)
-A #全面扫描
#还可以直接扫描整个网段:
nmap <IP地址>/24 #/24 似乎是表示这是一个24位的网段
--top-ports 100 <ip地址> #扫描最可能开放的100个端口
--script=脚本名 #一般用vuln
```

## 3.报错

[You requested a scan type which requires root privileges.](https://blog.csdn.net/a792245795/article/details/121951721)

# 四.xhydra

## 1.介绍

可以利用他来进行对协议进行口令/账号/密码的爆破

支持FTP/MYSQL/SMTP/SSH/TELNET

xhydra是hydra的GUI界面,功能更加强大