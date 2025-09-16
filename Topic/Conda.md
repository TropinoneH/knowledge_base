---
type: command
tags:
  - topic
  - code/python
done: false
---
# Conda

conda是一个多环境管理程序, 可以将虚拟环境与系统环境隔离, 为不同项目配置不同环境, 防止环境冲突

```base
filters:
  and:
    - file.inFolder("Knowledges")
    - file.name.startsWith("Conda")
views:
  - type: cards
    name: Conda
    order:
      - file.name
      - file.tags
      - file.path
      - file.ctime
      - file.mtime
      - done

```