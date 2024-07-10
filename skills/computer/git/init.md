# 创建账号

使用下面的命令创建一个基本的git用户

```shell
git config --global user.name <username>
git config --global user.email <email>
```

# 创建私钥公钥

```shell
ssh-keygen -o
```

配置一般保存在`~/.ssh`里面，`~/.ssh/id_rsa`是私钥，`~/.ssh/id_rsa.pub`是公钥。

将公钥上传至github的ssh配置里面即可使用ssh进行clone

# github连接不通

clone使用ssh通道报错443

> 使用`ssh -T git@github.com`进行测试

在`~/.ssh/config`里面添加一个新的Host:

```
Host github.com
  User git
  Hostname ssh.github.com
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/id_rsa
  Port 443
```

然后测试应该就可以了。
