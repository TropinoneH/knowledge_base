---
type: command
tags:
  - cli
  - cooperate
done: true
---
# Ignore

`.gitignore`一般存在于[[Git Init#创建新的git仓库|Git Repo]]的根目录下, 可以忽略文件或文件夹, 不追踪其修改, 不提交到远程仓库.

一般而言, 使用`.gitignore`忽略编译生成的文件、日志文件、依赖库、个人配置等.

## Syntax

匹配规则

- `*.log` → 忽略所有 `.log` 文件
- `/config.json` → 忽略仓库根目录下的 `config.json`
- `build/` → 忽略 `build` 目录及其中的所有内容
- `!important.log` → 取消忽略某个文件（即使上面有 `*.log`）

> [!tip]+ 通配符
> - `*` 匹配任意字符串
> - `?` 匹配单个字符
> - `**/` 递归匹配子目录


例子：

```gitignore
# 忽略所有 .pyc 文件
*.pyc

# 忽略 node_modules 目录
node_modules/

# 忽略 logs 目录下的所有文件，但保留其中的 keep.log
logs/*
!logs/keep.log
```

## Configure `.gitignore`

有几种层次的配置：

1. **项目级**
    - 在项目根目录下的 `.gitignore` 是最常见的。
    - 通常会被提交到仓库中，让团队成员共享。
2. **全局级**
    - 忽略当前用户电脑上的所有仓库中的某些文件。
    - 配置方法：
        ```bash
        git config --global core.excludesfile ~/.gitignore_global
        ```
        然后在 `~/.gitignore_global` 里写规则，比如：
        ```gitignore
        .DS_Store
        Thumbs.db
        ```
3. **本地级（不共享给他人）**
    - `.git/info/exclude` 文件，只在本地生效，不会被提交。

---

## Ignore Files already in Git Repo

关键点：**Git 只会忽略未被追踪的文件**。如果文件已经被提交到仓库，单纯在 `.gitignore` 里添加规则是无效的。

1. 先把文件从 Git 的索引（暂存区）中[[Git Cache#Remove from Staging Area|移除]]，但保留在本地： 
    ```bash
    git rm -r --cached <file_or_dir>
    ```
    例如：
    ```bash
    git rm -r --cached node_modules
    ```
2. 把对应的规则加到 `.gitignore` 文件里：
    ```gitignore
    node_modules/
    ```
3. 提交更改：
    ```bash
    git add .gitignore
    git commit -m "chore: update gitignore"
    ```

这样，以后该文件或目录就不会再被追踪。

## Check Ignore

检查某个文件是否被忽略：
```bash
git check-ignore -v <filename>
```
