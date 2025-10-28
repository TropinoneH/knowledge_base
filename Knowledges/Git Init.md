---
type: command
tags:
  - cli
  - cooperate
done: true
topic:
 - "[[Git]]"
---
# 前置需求

## 配置用户名和邮箱

这个是commit的用户信息, 会展示在github或其他gitlab平台上的commit history中.

```bash
git config --global user.name "<username>"
git config --global user.email "<email@server>"
```

## (可选) 配置默认分支

```bash
git config --global init.defaultBranch
```

或者使用编辑器:

```bash
git config --global -e
```

进入editor, 编辑git config. 写入:
```gitconfig
[init]
	defaultBranch = master
```
## (可选) 配置ssh

![[SSH Login#Generate Key]]

# 创建新的git仓库

进入需要创建git仓库的文件夹, 使用下面的指令新建git repo:
```bash
git init
```

# 设置远程仓库

如果有远程仓库, 可以通过下面命令列出:
```bash
git remote -v
```

添加远程仓库:
```bash
git remote add <remote_name> <remote_url>
```

一般而言, `remote_name`是origin, `remote_url`是github仓库(或者其他的gitlab平台仓库)的url, 可以使用ssh: `git@github.com:<username>/<repo>`

修改远程仓库: 如果需要修改现存的remote仓库(如, 远程仓库重命名等), 可以使用下面的命令修改已存在的remote url:
```bash
git remote set <remote_name> <remote_url>
```

# 设置上游仓库

![[Git Push#Push]]