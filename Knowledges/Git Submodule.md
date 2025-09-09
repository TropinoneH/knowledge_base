---
type: command
tags:
  - cli
  - cooperate
done: true
---
# Submodule

如果一个git repo中需要嵌套另一个git repo, 可以使用submodule的方式进行嵌入

## Add Submodule

```bash
git submodule add [-b <branch>] <remote_url> <path/to/repo>
```

在`path/to/repo`的位置[[Git Clone|clone]]一个远程仓库, 并添加为submodule. 所有的submodule保存在git repo根目录的`.gitmodules`中.

可以通过`-b`指定分支

> [!tip]+ Tips
> 有的时候, `path/to/repo`已经在[[Git Cache|缓存]]中存在(原来就有一个文件夹). 这个时候应该先从cache中移除这个文件夹:
> 
> ![[Git Cache#Remove from Staging Area]]

## Sync URL

> [!info] 注意
> 这个不会更新repository

在将repo[[Git Clone|克隆]]到本地之后, 如果远程的repo将submodule的url改变了(如, 更改成了fork的仓库), 需要更新本地的submodule指向的url.

但是git不允许远程仓库修改本地的配置(`.git/config`), 只有`.gitmodules`修改了, 因此需要使用下面的指令进行更新, 以保证[[#Update]]的正确性:
```bash
git submodule sync
```

## Update

相当于对每一个submodule进行[[Git Pull|pull]]操作:
```bash
git submodule update
```

### Solve Clone Error

有的时候, 使用[[Git Clone#Clone|克隆]]的时候忘记使用`-r`或者`--recursive`参数, 导致submodule没有拉取. 这个时候可以通过下面的命令重新拉取:
```bash
git submodule update --init --recursive
```

## Commit

由于直接[[Git Clone|clone]]的仓库的submodule的[[Git Branch|分支]]是固定的[[Git Commit|commit hash]], 因此在提交commit的时候需要首先[[Git Checkout|切换]]到合适的分支(以master为例):
```bash
cd path/to/submodule
git checkout <branch:master>
git add <path/to/changes:.>
git commit -m "<message>"
git push
####################
cd path/to/git/root
git add path/to/submodule
git commit -m "update submodule: <submodule>" # or other messages you like
git push
```

但是如果在[[Git Checkout|checkout]]之前就已经[[Git Commit#Git Add|添加]]了commit, 那么需要用下面的命令进行补错:
```bash
cd path/to/submodule
git add .
git commit -m "message"
git checkout master
# supposed that the commit hash is <commit_hash>
git branch <new_branch> <commit_hash>
git merge <commit_hash>
git push
# same
cd path/to/git/root
git add path/to/submodule
git commit -m "<message>"
git push
```