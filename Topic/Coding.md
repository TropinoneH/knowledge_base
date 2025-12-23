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
    - or:
        - file.inFolder("Develop")
        - file.inFolder("Knowledges")
        - file.inFolder("Lecture")
    - or:
        - file.hasTag("code")
        - topic.contains(link("Coding"))
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
  - type: cards
    name: Python
    filters:
      and:
        - file.tags.contains("code/python")
    order:
      - file.name
      - type
      - file.tags
      - file.path
      - file.ctime
      - file.mtime
      - done
  - type: cards
    name: C/Cpp
    filters:
      or:
        - file.tags.contains("code/cpp")
        - file.tags.contains("code/c")
    order:
      - file.name
      - type
      - file.tags
      - file.path
      - file.ctime
      - file.mtime
      - done
  - type: cards
    name: Markdown
    filters:
      and:
        - file.tags.contains("code/markdown")
    order:
      - file.name
      - type
      - file.tags
      - file.path
      - file.ctime
      - file.mtime
      - done
  - type: cards
    name: Rust
    filters:
      and:
        - file.tags.contains("code/rust")
    order:
      - file.name
      - type
      - file.tags
      - file.path
      - file.ctime
      - file.mtime
      - done
  - type: cards
    name: Swift
    filters:
      and:
        - file.tags.contains("code/swift")
    order:
      - file.name
      - type
      - file.tags
      - file.path
      - file.ctime
      - file.mtime
      - done
```
