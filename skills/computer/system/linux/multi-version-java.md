# 多个java版本的切换

首先先下载对应版本的java包，通常是使用`wget`来下载。

解压安装包，然后将解压后的文件夹移动到`/usr/lib/jvm/java-xx-openjdk-amd64`文件夹下，其中`vv`表示版本号。

然后通过`update-alternatives`来设置默认的java对应的版本：

```shell
sudo update-alternatives --install "/usr/bin/java" "java" "/usr/bin/jvm/java-xx-openjdk-amd64/bin/java" prior
```

其中，`prior`需要替换成优先级，优先级越高，auto模式就会优先调用。

第一个参数表示目标软连接的位置（相当于将你自己的版本直接存在了`/usr/bin/java`里面）

第二个参数用于后续快捷调整java版本（相当于label）

第三个参数是新安装的java位置

# update-alternatives

这个命令不仅仅只适用于java的多版本指定，也适用于其他多版本应用的切换，如python

但是这个只是在`/usr/bin`里面创建了一个软连接，而不是直接修改默认配置，所以x-terminal-emulator可能用不了
