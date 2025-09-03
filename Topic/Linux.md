---
type: system
tags:
  - system/linux
  - topic
done: false
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
```
