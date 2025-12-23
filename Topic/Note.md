---
type: skills
tags:
  - topic
  - software
  - code/markdown
---
```base
filters:
  and:
    - topic.contains(link("Note"))
views:
  - type: cards
    name: Note
    order:
      - file.name
      - tags
      - type
      - done
      - file.ctime
      - file.mtime

```
