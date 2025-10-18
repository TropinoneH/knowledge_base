---
type: project
tags:
  - GUI
  - code/swift
  - system/MacOS
done: false
rate: 🌟🌟🌟🌟
---
# QueryTools
## 架构

分模块开发. 每个模块一个独立的package, 使用[[Git]]管理.

模块内部含有Features, 每个Features有不同的actions.

只有Features可能会提供subview(也可能不提供). features的作用是一个模块下所有可能执行的操作, 比如translator下的“词典”feature, “翻译”feature.

actions指的是footer中可选的, 针对features执行的操作.

数据统一管理. 所有的数据放在AppState中. 所有的数据交换均通过Notifications进行.

## Protocol

Module Protocol:
- id
- name
- icon
- prefix
- features
- setting view

Feature Protocol:
- id
- name
- icon
- prefix
- shortcut
- actions
- subview

Action Protocol:
- id
- name
- icon
- prefix
- shortcut
- handler