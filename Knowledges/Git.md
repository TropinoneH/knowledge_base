---
type: command
tags:
  - cli
  - cooperate
done: false
---
# Git

`git`是一个版本管理命令(软件), 配合github, 私人gitlab等代码托管平台可以实现远程仓库备份和多人合作.

git的版本信息储存在`.git`文件夹下.

还有一些常见的关于git的文件, 如:
- `.gitignore`: [[Git Ignore|忽略]]match的文件
- `.gitmodules`: [[Git Submodule|子模块]], git仓库内嵌仓库
- ...

下面是所有的git相关的note:

```base
filters:
  and:
    - file.inFolder("Knowledges")
    - file.name.startsWith("Git")
views:
  - type: cards
    name: View
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime
    imageFit: ""
    cardSize: 250
```
