---
type: command
tags:
  - cli
  - cooperate
done: true
---
# Preliminaries

[[Git Init|创建]]或者[[Git Clone|克隆]]一个仓库到本地

# Branch

在一个仓库中, 可以有多个分支.

每个分支有不同的功能, 如:
- 主分支`master`或者`main`
- 专门用于发布的`release`
- 专门用于特定特性开发的分支`dev-...`, 或者`feat-...`, 或者直接写明feature
- ...

分支之间相互不干扰, 可以完全不同.

可以将一个分支[[Git Merge|合并]]到另一个分支中, 可能会用到[[Git PullRequest|pull request]]
## Rename Branch

使用下面的命令重命名分支:
```bash
git branch -M <new_name>
```

## Change Branch

使用[[Git Checkout|checkout]]命令切换分支:

![[Git Checkout#Checkout Branch]]

在切换的过程中, 如果修改的内容没有commit, 可能会引发冲突, 导致[[Git Merge|合并]]失败, 需要手动解决冲突.

有两个可行操作:
- 进入编辑器中解决冲突.
	- 大部分编辑器提供了现代化的GUI界面可以通过点击的方式解决冲突
	- [[neovim]]可以通过插件 [DiffView](https://github.com/sindrets/diffview.nvim) 打开GUI界面进行合并
	- 纯文本的编辑器([[vim]], [[nano]]等)可能需要手动修改文字的方式进行合并. 纯文本的格式为:
```
<<<<<<< HEAD  
// Code from the current branch (HEAD)  
=======  
// Code from the branch being merged  
>>>>>>> branch-name
```
- 直接abort, 退出合并模式, 保留原始的修改, 不切换分支. 进行commit之后再切换

## Create Branch

根据当前的commit创建新分支:
```bash
git branch <new_branch>
```

通过commit创建:
```bash
git branch <new_branch> <commit_hash>
```
