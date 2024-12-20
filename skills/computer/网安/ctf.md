# 一.开始前的准备

> 网安ctf(Capture The Flag, 也叫作夺旗赛)
>
> 白帽子

## 1.环境: `Java`, `Python`, `PHP`

Java用来跑一些程序,Python编写自动化脚本,PHP写测试

## 2.软件: 

```
至少要安装kali(VMWare)
```

```
Burpsuite, 专门用来网络流量拦截代理,可以对数据包进行处理
Wireshark, 专门用于抓包,网络流量拦截,将抓的包转成.pcap文件
```

## 3.ctf相关

### ctf赛制

通过题目找到Flag(旗子),并提交判定获取分数,最终按照分数来评定排名

flag存在于远程服务器,一个复杂的软件,也可能隐藏在一段通过密码算法或协议加密的数据,或是一组网络流量及音频视频文件中.选手需要综合利用自己掌握的安全技术,并辅以快速学习新知识,通过获取服务器权限,分析并破解软件或是设计解密算法等不限定途径来获取flag

>通过密码算法或协议加密的数据: 密码学
>
>网络流量: Wireshark
>
>音频: 画出波形并分析,可能是摩斯电码

### ctf题目类型

1. web安全

> 通过浏览器访问题目服务器的网站,寻找网站漏洞(sql注入,xss,文件上传,包含漏洞,xxe,ssrf,命令执行,代码审计等等),利用网站漏洞获取服务器的部分或全部权限,那倒flag,通常包含分值最大的web渗透题

```
xss: 跨站脚本
文件上传: 上传了一个木马,可以在服务器被执行
代码审计: 可能会很难,要去分析PHP代码来反向写脚本
```

2. 逆向工程

> 题目就是一个软件,但通常没有源码,需要利用工具对这个软件进行反编译,甚至是反汇编,从而理解内部逻辑和原理,找出与flag计算相关的算法并破解这个算法,从而获取flag

```
需要对安卓开发,软件开发有着一定的了解
```

3. 漏洞挖掘与漏洞利用

> 就是所谓的二进制(最难的一类题)
>
> 访问一个本地或远程的二进制服务程序,通过逆向工程找出程序中可能存在的漏洞,并利用漏洞拿到远程服务器的部分或全部权限,拿到flag

4. 密码学

> 分析题目中的密码算法与协议,利用算法或协议的漏洞来计算密钥或对密文进行解密,从而获取到flag

```
编码: base64
加密算法: 凯撒密码等等
摘要算法: MD5, SHA, SHA1, SHA2等等
一般利用在线的解码工具或者解码的软件工具解码,但是很多时候会给你多次加密的密文,这时候就要判断加密的算法是什么,然后层层解密
```

5. 调查取证

> 也叫作杂项
>
> 一些很杂的东西.技术点不会特别高,但是非常杂.比如说需要用到ps/绘声绘影/二维码扫码工具等等(说的就是你,geekpie!)(可以简单可以难:很多知识点杂糅在一起)
>
> 一般是用来入门的,只需要多了解一点,多刷点题就行(?)

6. 移动安全

> 对安卓和IOS的理解,对逆向工程的了解(但是通常会归类到逆向工程中去)

```
windows: .exe
Android: .apk
Mac: .dmg
```

### ctf备战思路

| 学习方向 | 需要掌握的技能 |
| -------- | :-------------  -------------: |
| 基础知识 | Linux基础,`计算机组成原理,操作系统原理(这两个无所谓)`,网络协议分析 |
| A方向 | PWN+Reverse+Crypto\|IDA工具(f5插件),逆向工程,密码学,缓冲区溢出 |
| B方向 | Web+Misc\|网络安全,内网渗透,数据库安全,信息收集能力 |

Web方向:

```
操作系统(linux)           HTTP协议                   数据库的基本操作(CRUD)
网络技术(HCNA,CCNA)       Web开发框架(可以不用懂)       SQL语句(CRUD)
编程(拔高)				  Web安全测试(可以不用懂)       数据库优化
^
计算机基础         ->     Web应用     ->              数据库 ->       刷题
```

靶场:(没有测试,不知道死了多少)

```
http://hackinglab.cn
http://www.shiyanbar.com/ctf/practice(推荐)(死了)
https://www.ichunqiu.com/competition
http://	oj.xctf.org.cn
https://www.jarvisoj.com
www.hetianlab.com
http://captf.com
https://ctftime.org
http://ctf.bugku.com/login(推荐)
```

HackGames:

```
SQL: http://redtiger.labs.overthewire.org
xss: http://prompt.ml/0
xss: http://xss-quiz.int21h.jp
白帽学院CTF挑战赛: http://www.baimaoxueyuan.com/ctf(好像死了)
红客闯关赛: http://hkyx.myhack58.com(也死了好像)
hackgame: http://monyer.com/game
```

# 二.杂项

## 1.文件操作隐写

>  mp3 mp4频谱图

首先要知道图片的类型, 这样才能去操作

```shell
# 判别文件类型:
# kali中
file <文件名字> # 可以用这个来识别文件类型
# 常见文件头
FFD8FFE1 JPG
89504E47 PNG
47494638 GIF
49492A00 TIFF(tif)
424DC001 BMP
504B0304 ZIP
52617221 RAR
38425053 PSD(Photoshop)
7B5C707466 RTF
3C3F786D6C XML
68746D6C3E HTML
255044462D312E PDF
57415645 WAVE(wav)
4D3C2B1A PCAP(pcap,流量数据包)
37FF5301 bat
# windows中推荐下载 010editor, 可以直接查看文件的hex16进制编码,然后分析前几位数据码, 看看和哪一个文件头对上,对不上的话再换一个(可能文件会有损坏)
```

## 2.图片隐写术

## 3.压缩文件处理

> 压缩文件的修复, 加密(真加密(有密码), 伪加密(只是更改了某一个字段)), 修复

## 4.流量取证技术

> 数据通信中,流量代表所有的数据



> 还有磁盘取证,内存取证(没有涉及)
