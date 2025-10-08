---
type: system
tags:
  - topic
  - system
---

```base
filters:
  and:
    - file.hasTag("system")
    - file.inFolder("Knowledges")
views:
  - type: cards
    name: Systems
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime
  - type: cards
    name: ArchLinux
    filters:
      and:
        - file.hasTag("system/linux/archlinux")
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime
  - type: cards
    name: Ubuntu
    filters:
      and:
        - file.hasTag("system/linux/ubuntu")
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime
  - type: cards
    name: Windows
    filters:
      and:
        - file.hasTag("system/windows")
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime
  - type: cards
    name: MacOS
    filters:
      and:
        - file.hasTag("system/MacOS")
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime

```
