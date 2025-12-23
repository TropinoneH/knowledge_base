---
type: skills
tags:
  - topic
  - code/python
  - DeepLearning
  - MachineLearning
  - ReinforcementLearning
  - software
  - cli
---
```base
filters:
  and:
    - topic.contains(link("PyTorch"))
views:
  - type: cards
    name: pytorch
    order:
      - file.name
      - file.tags
      - type
      - done
      - file.ctime
      - file.mtime

```
