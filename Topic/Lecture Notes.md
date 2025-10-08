---
type: lecture note
tags:
  - topic
  - lecture
---
# All Lectures

```base
filters:
  and:
    - file.inFolder("Lecture")
    - type == "lecture note"
views:
  - type: cards
    name: Lectures
    order:
      - file.name
      - file.tags
      - ClassID
      - teacher
      - file.ctime
      - file.mtime
      - done

```
