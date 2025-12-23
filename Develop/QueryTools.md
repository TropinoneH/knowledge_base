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

分为三个不同的层级: protocol, plugins, app. protocol提供plugins的协议和数据交换协议, plugins实现protocol并为app提供各种功能, app作为程序主入口搜索并加载指定文件夹中的plugins然后提供可视化界面.

每个层级都是使用.framework编译成动态库, 使用[[Git]]管理. 在主程序中通过Bundle进行动态加载, 并维护一个Module List, 用于后续的任务.

模块内部含有Features, 每个Features有不同的actions.

只有Features可能会提供subview(可选, 也可能不提供). features的作用是一个模块下所有可能的效果, 比如translator下的“词典”feature, “翻译”feature. 这些feature可能会执行一些操作, 也可能会让页面展示一个新的view. 这些配置通过每个feature的handler进行处理, 数据传递通过AppState传递给数据中心, 然后主程序通过读取AppState的内容, 去判断是否需要执行操作(如展示view)

actions指的是footer中可选的, 针对features执行的操作.

数据统一管理. 所有的数据放在AppState中.

其中, protocol, plugins, app都可能会需要用到package dependencies,如Defaults, KeyboardShortcuts, Sause, Expression等. 注意不要造成重复依赖.

## Protocol

Module Protocol:
- id
- name
- icon
- prefix
- features
- setting view: 设置界面. 主程序通过搜索所有的App

Feature Protocol:
- id
- name
- icon
- prefix
- shortcut
- actions
- subview
- handler: 
- searchable: Bool, 是否能够在MainModule中搜索

Action Protocol:
- id
- name
- icon
- prefix
- shortcut
- handler