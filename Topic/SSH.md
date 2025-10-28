---
type: command
tags:
  - topic
  - cli
  - ssh
---
# SSH

一个远程连接的协议/软件, 根据密码或者密钥连接访问另一个配置了sshd的电脑.

```base
filters:
  and:
    - topic.containsAny(link("SSH"))
views:
  - type: cards
    name: SSH
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime

```
