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

每个层级都是使用.framework编译成动态库, 使用[[Git]]管理. 在主程序中通过Bundle进行动态加载, 并维护一个Module List, 用于后续的任务. 注意每一个模块都是一个独立的项目, 并不存在将某个项目通过SPM硬编码添加的过程.

模块内部含有Features, 每个Features有不同的actions.

只有Features可能会提供subview(可选, 也可能不提供). features的作用是一个模块下所有可能的效果, 比如translator下的“词典”feature, “翻译”feature. 这些feature可能会执行一些操作, 也可能会让页面展示一个新的view. 这些配置通过每个feature的handler进行处理, 数据传递通过AppState传递给数据中心, 然后主程序通过读取AppState的内容, 去判断是否需要执行操作(如展示view)

actions指的是footer中可选的, 针对features执行的操作.

数据统一管理. 所有的数据放在AppState中.

其中, protocol, plugins, app都可能会需要用到package dependencies,如Defaults, KeyboardShortcuts, Sause, Expression等. 注意不要造成重复依赖.

### Protocol

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
- subview: AnyView?, 在handler中向AppState传递, 用于在主程序的GUI中展示. 部分feature不需要展示features.
- handler: func, 用于处理逻辑
- searchable: Bool, 是否能够在MainModule中搜索. 注意, 所有的搜索均是

Action Protocol:
- id
- name
- icon
- prefix
- shortcut
- handler

#### AppState

AppState保存所有的数据状态. 具体需要保存什么内容请你根据我上述的描述进行设计.

AppState判断权限(App主程序, MainModule, 其他Plugins), 然后按照权限提供数据的访问接口. 通过AppState, 可以获取某一个变量当前的最新值, 或者订阅一个变量(监听其变化值), 或者对某些值通过接口进行修改. 提供的接口需要按照权限进行判断是否成功获取.

注意, AppState需要跨模块传输数据, 并且数据需要是多Module之间同步的.

