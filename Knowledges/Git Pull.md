---
type: command
tags:
  - cli
  - cooperate
done: false
---
# Fetch

本地储存四部分内容, [[Git Cache#Git Architecture|本地缓存]]的三部分(workspace, staging area, local repo)以及一个远程仓库分支的引用(使用[[Git Init#设置远程仓库|git remote设置的]])

使用`git fetch`能更新本地的远程分支的引用, 但是不更新本地的local repo. 即, 更新远程commit的索引, 但是这个索引对应的什么内容不更新.

# Pull

`git pull`相当于[[#Fetch|git fetch]]和[[Git Merge|git merge]]的结合: 首先使用`git fetch origin/master`更新索引, 然后使用`git merge origin/master`将远程的更新合并到本地仓库中

可以设置合并的方式: 使用[[Git Merge#Merge|merge]]或者使用[[Git Merge#Rebase|rebase]](`git pull --rebase`)进行合并.