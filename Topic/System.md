---
type: system
tags:
  - topic
  - system
---

```base
filters:
  and:
    - file.hasTag("System/MacOS")
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
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime
  - type: cards
    name: Windows
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime
  - type: cards
    name: MacOS
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime

```
