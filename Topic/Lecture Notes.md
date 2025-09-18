---
type: lecture notes
tags:
  - lecture
done: false
---
# All Lectures

```base
filters:
  and:
    - file.inFolder("Lecture")
    - type == "lecture notes"
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
