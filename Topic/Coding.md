---
type: skills
tags:
  - topic
  - code
  - cli
---
# Coding

各种编程语言的小技巧, 以及课程

```base
filters:
  and:
    - file.hasTag("code")
    - or:
        - file.inFolder("Develop")
        - file.inFolder("Knowledges")
        - file.inFolder("Lecture")
views:
  - type: cards
    name: All Notes related to Coding
    order:
      - file.name
      - type
      - file.tags
      - file.path
      - file.ctime
      - file.mtime
      - done

```
