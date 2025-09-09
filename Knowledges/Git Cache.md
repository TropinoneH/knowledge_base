---
type: command
tags:
  - cli
  - cooperate
done: true
---
# Git Architecture

Git 管理文件时有三层：

1. **工作区 (Working Directory)**
    - 你实际看到和编辑的文件（本地目录里的代码）。
2. **暂存区 (Staging Area / Index / Cache)**
    - 记录哪些文件将会进入下一个 commit。
    - 通过 `git add` 把工作区的改动放入暂存区。
3. **版本库 (Repository / .git/objects)**
    - 历史提交记录，持久化存储。
    - 远程仓库, 多人合作

```mermaid
graph LR

工作区-->|git add|a(暂存区)
a-->|git push|repository
```

# file state

文件可能处于以下几种状态：
- **未追踪 (untracked)**：Git 没有管理这个文件。
- **已追踪 (tracked, unchanged)**：文件在版本库中，当前没有改动。
- **已修改 (modified)**：文件在工作区被改动，但还没 `git add`。
- **已暂存 (staged)**：文件改动被 `git add` 放进了 cache。
- **已提交 (committed)**：暂存区的内容被 `git commit` 保存到版本库。

# Command

## Add to Staging Area

![[Git Commit#Git Add]]
## Remove from Staging Area
```bash
git rm --cached <file>
```

- 移除文件在 cache 的记录，但不会删除工作区的文件。
- 常用于[[Git Ignore#Ignore Files already in Git Repo|让已有的文件被 .gitignore 忽略]]

```bash
git rm <file>
```

- 移除 cache 中的记录，同时删除工作区的文件。 

## Reset Staging Area

```bash
git reset <file>
```

- 让文件从 cache 回到工作区已修改的状态（取消暂存）    
- 例子：
    ```bash
    git reset main.py
    ```

## Check Status

```bash
git status
```

- 显示哪些文件在缓存区，哪些只在工作区。

## Check Files in Staging Area

```bash
git ls-files --stage
```

- 显示当前缓存区里有哪些文件、对应的哈希值和权限。
