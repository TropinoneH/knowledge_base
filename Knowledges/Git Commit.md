---
type: command
tags:
  - cli
  - cooperate
done: true
topic:
 - "[[Git]]"
---
# Preliminaries

需要首先[[Git Init#配置用户名和邮箱|配置用户名和邮箱]]

# Git Add

## add files

修改之后, 需要将修改的内容放到git缓冲区中.

添加指定路径的文件:
```bash
git add <path>
```
这里的`path`可以是folder也可以是file, 可以有修改也可以没有. 但是如果当前的缓冲区中没有任何修改, 那么后续的commit会出错.

> [!tip]+ 常用命令
> 将当前文件夹下所有修改的文件添加到git缓冲区:
> ```bash
> git add .
> ```

将当前整个git repo的修改的文件添加:
```bash
git add -A
```

## add hunks

通过下面的指令, 进入tui界面, 添加hunks:
```bash
git add -p
```

TUI:
![[Pasted image 20250828165452.png|494]]
输入字母, 然后按下回车, 对该hunk进行操作. 每个字母的含义为:
- `y`: yes, stage this hunk
- `n`: no, not stage
- `q`: quit
- `a`: stage this hunk and all later hunks in this file
- `d`: do not stage this hunk and all later hunks in this file
- `e`: manually edit this hunk in git editor:
  ![[Pasted image 20250828165858.png|460]]
- `?`: help
# Commit Changes

如果缓冲区中有修改, 可以将修改commit到stage区:
```bash
git commit -m "<commit_message>"
```

使用commit的时候会生成当前commit的hash, 可以[[Git Checkout|切换]]到hash对应的commit中. 这个hash与用户名, 用户邮箱, commit messages, git changes等相关

可以使用editor进行commit提交:
```bash
git commit -e
```
editor中展示:
```
# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch master
# Your branch is up to date with 'fork/master'.
#
# Changes to be committed:
#       modified:   settings.ts
#
# Untracked files:
#       pnpm-lock.yaml
#
<add commit messages here>
```
然后保存退出editor, 即可添加commit

# 修改commit

## 修改commit message

使用下面的代码进行修改commit:
```bash
git commit --allow-empty --amend --only -m "<new_message>"
```

## 将新的修改添加到上一条commit中

首先将修改后的内容添加到git缓冲区中:
```bash
git add <path/to/changes>
```

然后将这个修改附加到上一条commit中(只能是最近的上一条):
```bash
git commit -a --no-edit
```

## 将一条commit合并到之前的commit中

如果需要将新的修改合并到多条之前, 使用下方的方法:

将修改创建一个临时的commit:
```bash
git commit --fixup <commit_hash>
# equal to: `git commit -m "fixup! <messages>"`
```
这里的`commit_hash`是你希望合并到的commit的hash

此时检查[[Git Log#Show commit|log]]的结果应该是:
```
<hash4> fixup! bbb
<hash2> ccc
<hash2> bbb
<hash1> aaa
```

然后, 进行交互式rebase:
```bash
git rebase -i HEAD~3
```
其中, `HEAD~3`的意思是, 使用相对commit信息, 使用距离当前`HEAD`最近的三个commit进行rebase

此时会打开一个editor, 内容应该如下所示:
```
pick <hash2> bbb
pick <hash3> ccc
pick <hash4> fixup! bbb

# Rebase ...
#
# Commands:
# p, pick = use commit
# f, fixup = like "squash", but discard this commit's log message
# s, squash = use commit, but meld into previous commit
```

将`fixup!`的commit移动到合并目标的下方, 并将`pick`改成`f`或者`fixup`, 结果如下:
```
pick <hash2> bbb
f <hash4> fixup! bbb
pick <hash3> ccc

# Rebase ...
#
# Commands:
# p, pick = use commit
# f, fixup = like "squash", but discard this commit's log message
# s, squash = use commit, but meld into previous commit
# ...
```

保存并退出editor, 此时会自动触发rebase.

rebase之后的[[Git Log#Show commit|log]]应该为:
```
<new_hash3> ccc
<new_hash2> bbb # <- this commit include the fixup commit
<hash1> aaa
```

此时合并结束.

如果要[[Git Push|上传远程]], 可能需要使用`--force`或者`--force-with-release`强制推送