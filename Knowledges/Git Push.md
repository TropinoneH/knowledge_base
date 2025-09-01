---
type: command
tags:
  - cli
  - cooperate
done: true
---
# Preliminaries

![[Git Init#设置远程仓库|设置远程仓库]]

# Push

在任何[[Git Commit|commit提交]]之后, 可以使用下面的方法将本地的[[Git Branch|分支]]推送到远程:
```bash
git push <remote_name> <local_branch>:<remote_branch>
```

如果`local_branch`和`remote_branch`相同, 可以只输入一次:
```bash
git push <remote_name> <branch>
```

每次推送都需要输入`remote_name`和`branch`, 可以设置上游来免于重复输入:
```bash
git push -u <remote_name> <branch>
```

后续的推送会自动读取upstream, 命令可以简化:
```bash
git push
```
