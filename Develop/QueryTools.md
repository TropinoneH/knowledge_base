---
type: project
tags:
  - GUI
  - software/Xcode
  - code/swift
  - system/MacOS
done: false
rate: 🌟🌟🌟🌟
---
> [!tldr]- prompt
>

## 需求

我现在正在开发一个类似MacOS26的Spotlight, 或者说类似raycast的程序, 有多种功能. 使用alt+space唤起一个窗口, 然后根据输入的内容执行不同的命令.

我下面将会给你这个程序的需要实现的内容, 请你阅读所有的内容, 然后尝试梳理一份完整的开发需求出来.

这份开发需求包括:
1. 程序的架构设计
	1. 文件架构: 文件夹结构, 每个文件的作用
	2. 程序架构: 继承, 模块化设计, 数据统一管理, 事件驱动
	3. 视图架构: 需要哪些窗口, 哪些subview, 如何进行嵌套
2. 数据流动的设计
	1. 数据统一管理, 使用数据中心的singleton
	2. 数据如何更新
	3. 数据更新之后, 发送全局
	4. 全局根据数据热更新, 包括重绘UI等
	5. 你需要在阅读整个需求之后, 统合所有可能需要在全局传递的数据, 在数据管理中心进行管理. 你需要根据需求进行设计每个数据的类型, 判断数据是否有必要放在数据中心.
3. 需求设计
	1. 文件之间的依赖关系, 我希望能尽可能少的依赖, 尽可能解耦合
	2. 功能的实现顺序, 我希望能够一次性按顺序生成一个文件的所有内容, 尽可能不要留下占位符或者假数据, 不要写“后续再写”, 不要留下`TODO`
	3. 每个文件需要实现哪些内容, 给出完整的内容, 尽可能详细, 使用markdown的TODO list的格式列出来. 注意, 只给嵌套的最深处的一条加上TODO list, 嵌套的外层不需要加上Todo List的标志. 注意, `- [ ]`不要和`-`共用, 在生成todo list的时候不要加上list的前缀

请你完善这个需求文档.

## 程序要求

分不同的**模块**, 每个模块是独立的. 每个模块使用Swift Packages的方式独立开发, 遵循同一个protocol(这个也可以是一个local Swift Packages), 最终在一个统一的架构中进行展示. 注意, 每一个Module都要是一个完全独立的项目, 不要在同一个项目中进行开发.

module之间的交互使用**事件驱动**, 所有的数据交流均通过Notification.

大致分为多个模块, QueryTools本身, protocol, 和其他modules. [[Xcode Add Packages#Create New Local Packages|创建packages]]的方式为: 在project root下创建一个新的group `Packages`, 选择menubar的File -> New -> Package..., 创建Multiplatform的Library, 并添加到TARGETS -> QueryTools中.

- QueryTools本身提供主要的框架, 提供各种API, UI窗口的管理, 主要的程序入口
- protocol提供Modules和QueryTools之间的交互, 提供必须要的API接口
- Features是一个entry, 或者说是Module提供的一个功能
	- feature id(unique, UUID)
	- feature name
	- prefix(可以留空)
	- actions(这个是footer中的action, 配置了这个feature能执行什么操作)
		- 一般至少包含return-key event
			- 这个action中配置执行的操作: 跳转到新的feature, 或者说是调用函数, 或者说打开新的app, 等等
			- 跳转feature的做法是, 在这个action的回调函数中, 发送一个Notification来更新DataCenter的`activeFeature`
		- 其他的action由每个feature自己配置
		- 这里的actions一般指的是, 当这个feature被选中, 没有被activated的时候, 可以对这个feature执行的actions
		- 但是部分的Module会有自己的配置(如, calendar,clipboard,等), 这些Module没有feature, 因此feature actions指的就是module的搜索结果的actions. 这类module会特殊说明, 注意区分
	- subview, 配置每个feature自己的subview
		- 一个完整的subview, 包含 header,content,footer 三者中至少一个
		- 每个feature都有不同的subview. 有的时候有相同的结构, 可以通过创建一个private的公共view集成
		- 有的feature可能不存在subview, 因为return-key执行结束之后会隐藏NSPanel(即, MainWindow). 这种功能性的feature不需要也不存在subview
		- 如果不存在subview, 那么设置为默认的 AnyView(EmptyView())
- Modules负责具体的功能实现
	- module id(unique, UUID)
	- module name
	- module icon
	- prefix(可以留空)
	- actions, 是footer中的action, 一般只包括return-key的handler(跳转subview)和打开该Module的设置两个. 部分Module可能有更多的.
		- 这里这个actions的意义是, 当在更高层级选中这个module的时候(一般而言只有在MainModule的搜索的时候才会选中), 展示的actions
		- return-key的作用是, 跳转到MainModule的module feature(发送Notification), 然后在MainModule的feature中展示自己Module的subview
		- 后续如果没有说明, 那么module的actions为 return-key的action和打开设置面板并跳转到当前module的设置界面 这两个action
	- settings view, 根据每个module的setting进行设置
	- subview, 这里的subview根据Modules每个模块自己的定义, 去展示
		- 展示Module相关的功能, 会在MainModule中的module feature这个Feature中进行展示
		- 默认的subview为一个搜索界面, 展示所有的属于这个module的features, 并可以通过搜索框进行搜索
	- features

程序的主入口提供两个窗口, 但是这两个窗口不提供任何的展示, 所有需要展示的内容均通过Module的subview(或者settings view)提供. 这两个窗口仅作为展示的框架:
1. 主窗口:
	- 使用NSPanel, 无边框, 不存在标题栏, 使用.nonactivatingPanel
	- 当失去焦点的时候自动隐藏
	- 不获取窗口焦点, 或者说不改变原来窗口的焦点
	- 拦截Cmd+Q, 不会退出而是隐藏窗口(即, 当监测到app退出事件的时候, 拦截这次事件, 转换为隐藏窗口)
	- 打开的时候需要获取之前window的id(或者说, 句柄,引用, 等), 在window manager module中可能会使用
	- 在对应生命周期触发对应的事件(Notification)
	- 拦截并捕获key press事件, 并发送一个Notification
		- 找到firstResponser, 判断是否是textfield, 如果是, 那么判断是否`hasMarkedText()`, 如果为true, 那么说明有输入法正在输入, 此时不触发Notification, 不拦截key press
		- 如果上面的判断为false, 那么捕获key press, 并发送Notification.
2. settings window
	- 使用液态玻璃的设计方法(MacOS 26)
	- 分成两栏, 参考最新版MacOS26的设置界面
		- 左侧是所有的module
		- 右侧是选中的module的设置
		- 左侧的module通过读取`allModules`获取, 右侧的设置全部由module自己的settings view控制
	- 使用`Defaults`库进行持久化
	- 每次设置之后热更新, 重新触发UI和功能(在事件中触发)

### 事件驱动
- Escape Key Press
- Return Key Press
- UpArrow Key Press
- DownArrow Key Press
- LeftArrow Key Press
- RightArrow Key Press
- MainView Show
- MainView Hide
- Perform Search
- After Search
- Settings Update
- ...

上述的事件可能没有用, 还有一些事件是Module独享的, 后续你需要自己添加. 我希望你能够将每个Module完全隔离, 保证不会重命名, 也不会相互干扰.

使用NotificationCenter进行事件监听, 在每个Module中独立处理这些事件.

### 数据集中管理

所有的数据存放在一个singleton下面. 所有其他Modules对DataCenter内数据的修改通过Notification发送请求, 由DataCenter内部处理数据更新. 使用ObservableObject+Published的方式将变量发布, 让其他的Modules能够读取每个变量是否更新, 以完成热更新.

使用`.environment(...)`将这个数据管理的singleton注入到最顶层的environment中.

### 通用UI设置

#### Keyboard 展示

使用玻璃效果(opacity+blur)作为background, 展示key. 如果是modifiers, 展示对应的icon. 如果是key, 那么展示大写字母.

每一个展示框只展示一个modifier或者key, 默认值有相同的大小(可以通过传参的方式修改)

#### SearchBar

默认分成三个小部分.

有TextField作为input, 默认焦点持续存在. 如果焦点丢失, 在下一渲染帧重新获取焦点.

如果进入的Module不是MainView, 那么左侧有一个button(icon image: 左箭头), 表示退出这个subview回到MainView

按照不同的Module的要求, 右侧可能会有下拉框.

当输入了module prefix + 空格之后, 会自动跳转到对应的module(搜索该module的所有的feature. 这个feature由module管理和控制. 但是这个还是存在于MainView页面中)

#### Footer

在content view下面有footer. 默认footer由三部分组成:
- 左侧是module icon + module feature name
- 中间使用Spacer()隔开
- 右侧是两个按钮使用vertical Divider()隔开:
	- 左侧按钮展示return键的作用(可以在general设置中修改对应按键)
		- 文本描述由module定义.
		- 紧挨着文本, 展示Keyboard
		- 按钮背景全透明, 当鼠标hover的时候, 展示一个highlight
		- 点击的功能和按下return是一样的
	- 右侧按钮展示“actions”, 紧挨着是快捷键的展示(快捷键也是由general settings中定义)
		- 每个module会定义不同的actions. 具体的功能和actions的快捷键由每个模块自行定义
		- 当点击按钮或者触发(key shortcut)的时候, 弹窗弹出来一个窗口(上拉框):
			- blur+opacity背景
			- 展示所有的actions(module定义)
			- 不管什么actions, 一定有一个搜索框input, 能够根据action name进行搜索. 搜索的方式由general settings中定义
			- 当弹出的时候, 直接将焦点聚焦在弹窗的input中, 无视SearchBar的聚焦(如果有SearchBar)
			- 如果鼠标点击了弹窗之外(或者触发Escape Key Press, 或者再次按下Cmd+k), 则隐藏这个弹窗, 并归还焦点(如果有SearchBar, 那么焦点回到SearchBar. 如果没有, 则焦点回到第一个可以获取焦点的位置.)

#### Others

为了复用性, 你需要阅读整个需求文档, 从中提取出来可能会大量复用的组件. 但是注意, 你需要平衡复用性和个性化的需求.

## Packages
- https://github.com/Clipy/Sauce 所有键盘的keycode统一
- https://github.com/sindresorhus/KeyboardShortcuts 全局快捷键管理, 提供recorder
- https://github.com/sindresorhus/Defaults.git 持久化设置
- https://github.com/sindresorhus/LaunchAtLogin 配置launch at login
- https://github.com/sparkle-project/Sparkle 软件更新

## Modules

### MainModule(MainView)

#### GeneralSettings
- 搜索的方式: fuzzy, exact, regex
- 全局启动的快捷键: KeyboardShortcut
- 确认搜索的快捷键(默认是Return)
- debounce duration
- 每个module展示多少条结果(这个需要针对每个module设置)
- enabled module
- 展示顺序
	- module priority
		- 可以拖动的module排序, 记录module priority
	- recent usage: 按照 上次使用的时间长度的log 和 使用次数 进行加权
- Footer的actions中每个action的快捷键

不需要给MainModule设置任何prefix, MainModule的module和所有features不参与搜索

#### subview

不存在默认的module subview. 默认情况会使用default feature的subview

#### features
- default feature
	- SearchBar
		- 没有左侧按钮
		- Placeholder: Search for anything...
		- 右侧展示下拉框, 里面是所有activated modules, 与设置联通
	- ContentView
		- 在进入SearchWindow的时候, 展示其他所有已经被激活的Modules的entries和所有Modules的features的entries
		- 默认按照每个module一个section, 分别展示module的entry和自己features的entries.
		- 这个不是左右分栏, 是上下分section, 使用上下键进行选择
	- Footer的actions:
		- 进入feature entry
		- 取消激活
		- Divider()
		- input
- module feature
	- 什么也没有
	- 完全用于展示对应module的subview
	- actions: 是对应Module的actions

搜索结果(entries)的UI设置:
- 一个横条
	- 左侧显示Icon, 紧挨着是name, 如果是feature, 那么紧挨着是灰色小字表示来源(module name)
	- 右侧展示类型, 如, module entry, feature entry, 等

### App Search

#### Settings
- 可以选择搜索的方式: fuzzy, exact, regex
- 展示"最近使用过的app"的数量
- Footer的actions中每一个action的快捷键
- module和每个feature的prefix

搜索并展示app. 可以搜索App的kMDItemDisplayName, 可以搜索kMDItemAlternativeNames.

#### subview

module subview:
- 最上方是Search Bar, 左侧有一个按钮(有个Image: 左箭头), Placeholder是“Search for apps...”, 右侧一个下拉框, 里面可以选择搜索的方式(与设置关联)
- 展示的部分分成上下两部分, 上部分展示最近使用的app(数量可以在设置中配置, 展示的顺序为: (上次使用时间距现在的时长的log)和(使用次数)的加权平均), 下部分按照category的方式分类展示, 按照category的字典序排序category, 每个category中按照app的kMDItemDisplayName的字典序排序.
	- 每个App的展示方式为: 展示App的Icon,  然后在icon的下方展示小字App Display Name
	- 详情参考spotlight的application模块
- 如果有输入搜索的内容, 那么改变展示方式:
	- 每个结果都是一个横条的entries
	- 左侧icon, 紧挨着是name
	- 右侧从左到右分别是: category, last used time

#### feature

这个module中, feature是动态的, 每个app作为一个feature.

需要检测是否有新的app安装/卸载, 然后更新feature.

每个feature的id是app的bundle-id, name是app的display name, icon是app的icon, 不存在subview

features的Footer的actions:
- 打开app (return-key action)
- 在finder中打开
- 设置这个feature的prefix
- Divider()
- 复制app display name
- 复制App文件路径
- Divider()
- input

### Calendar

#### Settings
- Footer的actions中每一个action的快捷键
- module和每个feature的prefix

和`提醒事项.app`打通, 读取所有的提醒事项的内容, 按照日期和所属分类来将其渲染到calendar中

#### subview

module subview:
- search view存在, 左侧有一个按钮(有个Image: 左箭头), Placeholder是“calendar actions...”, 右侧不存在别的内容
- 中间的content view分成上下两部分:
	- 上半部分渲染日历与日程:
		- 展示格子版calendar, 每一天是一个格子. 默认聚焦在“今天”的格子上
		- 每个todo事项在日期内分条渲染, 渲染的背景颜色与提醒事项中的分类的颜色相同
		- 渲染的时候不考虑开始/截止时间, 只考虑日期, 但是在同一个日期内渲染的时候按照开始时间的顺序从上到下展示
	- 下半部分根据选中的日期, 展示当天的todo
		- 如果选中的日期有todo, 那么下半部分才会显示(liquid glass的方式浮在上一层layer中), 如果选中的日期没有日程, 那么不显示下半部分

由于这个module不存在features, 下面的所有actions均针对日期
- return-key actions: 添加一个提醒事项
	- 打开一个弹窗(不算是弹窗, 而是创建一个新的view(z-index在最前面, 使用liquid glass), 在这个view中进行编辑)
	- 不需要Search Bar, 直接是一个view, 通过按Tab和Shift Tab在不同的输入框内跳转
	- 可以配置的属性与`提醒事项.app`一致
- footer actions:
	- 在`提醒事项.app`中打开
	- 修改事项
		- 询问修改哪一个事项(如果只有一个, 那么不需要询问直接选中唯一的一个即可. 如果没有任何事项, 那么这一项内容不可选), 然后进入subview
		- subview: 与修改提醒事项的subview(return-key action的subview)相同
	- 完成事项
		- 询问选择这一天的哪一个事项(如果只有一个, 那么不需要询问直接选中唯一的一个即可. 如果没有任何事项, 那么这一项内容不可选)
		- 标记某个事项已完成, 同步给`提醒事项.app`
		- 不进入subview, 直接执行操作, 不隐藏窗口, 维持原来的状态
	- 删除事项
		- 询问选择具体要删除这一天的哪一个事项(如果只有一个, 那么不需要询问直接选中唯一的一个即可. 如果没有任何事项, 那么这一项内容不可选)
		- 弹窗询问, 是否删除这个提醒事项
		- 不进入subview, 直接执行操作, 不隐藏窗口, 维持原来的状态
	- Divider()
	- 修改feature的prefix
	- Divider()
	- input
### Calculator

#### Settings
- Footer的actions中每一个action的快捷键
- 每个feature的prefix

使用Foundation的Expression库进行计算(或者说, NSExpression). 你需要实现:
- 加减乘除
- 幂次(可能需要实现`**`或者`^`操作符, 和`pow(x,y)`函数), 开根(`sqrt(x)`函数)
- bool运算
	- 一些bool symbol, 如true, false, 等
	- 一些bool operator, 如 `|`(or `||`), `&`(or `&&`), `??`, `cond ? x : y`

单位转换有两个思路, 一个是调用url, 但是需要有网络; 一个是手动实现所有的转换方案, 但是麻烦; 还有一个是调用现有的swift库, 但是我不知道有哪些是可用的, 你需要搜索, 可能没有.
#### subview

默认的module subview

#### features

两个feature:
- 计算
	- 没有query的时候, 展示help界面, 给出所有支持的运算符和函数
	- 如果有query且是vaild的, 那么展示结果
	- 如果query是invalid的, 那么提示错误信息
- 单位转换(可能涉及到需要请求url)
	- 输入内容, content view中左侧是根据输入内容的展示(如, now, date, 等转换成真正日期或时间), 右侧是转换的结果
	- 如果没有输入, 展示help界面, 给出所有支持的占位符(如, now, date, 等)和所有可以执行的转换(如, to amarican, to cm, to meter, 等). 按照类型分section展示.
Footer的actions:
- 复制到剪切板
- Divider()
- input
### Clipboard

#### Settings
- 轮训NSPasteboard的时间
- 搜索方式: fuzzy, exact, regex
- 默认排序方式: 首次复制时间, 上次使用时间, 复制的次数
- 需要记录的类型: 文字, 图片, 文件/文件夹
- 自动删除多长时间之前的记录
	- 不删除
	- 7天
	- 1个月
	- ...
- Footer的actions中每一个action的快捷键

使用sqlite进行储存所有的clipboard history.

分成多个类型, 文字类型,图片类型,文件类型, 等等

#### subview

注意, 这个module不存在feature. 在MainModule搜索的使用, 也只能搜索到这个Module的entry而搜索不到这个module的features.

这个module的subview为:
- header: 
- 分成两栏, 左侧是所有的item, one line的preview; 右侧是选中的item的详细的内容
- 左侧展示: 来源app icon, preview, 上一次使用的时间, 复制的次数
- 右侧展示:
	- header: 来源app icon, 来源app display name, 首次复制时间, 上次使用时间, 复制次数
	- Content: 如果类型是文字, 那么使用NSText展示文本内容; 如果类型是image, 那么展示这个image(注意缩放); 如果类型是file(或者folder), 那么展示path和缩略图, 以及一些可能存在的file的属性(kMD属性)

Footer的actions:
- 如果是文字, 那么展示“编辑”, 否则变灰色, 不可用
- 如果是文件, 那么展示“在finder中打开”, 否则变灰色, 不可用
- 删除item
- Divider()
- input

### Finder

#### Settings
- 搜索的方式: fuzzy, exact, regex
- Footer的actions中每一个action的快捷键

#### subview
一个feature, subview为:
- 有一个Search Bar
	- 左侧一个按钮(Image: 左箭头), 表示退出当前的module回到MainModule
	- 右侧一个下拉框, 是搜索的范围: This Mac, User(username)
	- Placeholder: Search files...
- 左侧是最近使用的文件, 展示略缩图和名称
- 右侧是details, 上半部分展示文件内容的preview(不同的文件类型使用不同的preview, 如果类型未知则展示略缩图), 下半部分展示metadata, 如, name, path, type, size, create time, last modified time, last opened time

Footer的actions:
- open
- open by
	- 与系统中的`right click->打开方式`相同
- reveal in finder
- Share
	- 与系统中的`right click->共享...`相同
- Divider()
- copy file name
- copy file path
- Divider()
- input

### Media Controller

#### Settings
- Footer的actions中每一个action的快捷键

#### subview

不存在feature, 只有一个subview

一个feature, subview为:
- 一个Search Bar
	- 左侧为按钮(Image: 左箭头), 表示退出当前的module回到MainModule
	- 右侧不展示内容
	- Placeholder: Media Controllers
- 左侧是可以选择的控制
	- 暂停 / 播放
	- 上一首
	- 下一首
	- 增加音量, 后面加上一个数字(通过string解析成number的方式尝试解析, 如果失败则弹出一个错误提示), 表示将音量的百分比增加多少
	- 减少音量, 后面加上一个数字(通过string解析成number的方式尝试解析, 如果失败则弹出一个错误提示), 表示将音量的百分比降低多少
	- 设置音量为, 后面加上一个数字(通过string解析成number的方式尝试解析, 如果失败则弹出一个错误提示), 表示将音量的百分比设置为多少
	- 静音 / 解除静音
	- 打开当前媒体来源
	- 在finder中展示(如果是文件), 如果不是文件, 那么这一条feature不显示
	- 切换playlist
	- 前进一段时间, 后面加上一个数字(通过string解析成float number的方式尝试解析, 如果失败则弹出一个错误提示), 表示将当前的时间前进多少秒
	- 后退一段时间, 后面加上一个数字(通过string解析成float number的方式尝试解析, 如果失败则弹出一个错误提示), 表示将当前的时间后退多少秒
	- 播放循环设置
		- 单曲循环
		- 列表循环
		- 随机
		- 单曲播放(播完暂停)

注意, 这里的所有设置均针对MacOS系统设置, 不针对独立的软件

### Settings

一个feature(subview), 多个功能: 打开System Settings.app里面的不同设置界面. 最好能够动态读取System Settings里面有哪些设置, 然后打开对应的panel

### System

多个feature:
- 输入/输出音量控制, 输出/输出设备切换,
- 亮度控制(需要包括外接显示器的亮度)
- ...(请你帮我思考还有哪些设置可以控制)

### Translate

Settings:
- dictionary的来源
	- 苹果自带的dict
	- ...
- translate的api
- Footer的actions中每一个action的快捷键

两个feature:
- dictionary, 针对单个单词的字典, 调用苹果自己的dict.app
- translate, 针对一整句话进行翻译, 可能需要api

### Web Browser

Settings:
- 用什么browser
- 用什么搜索引擎
- Footer的actions中每一个action的快捷键

三个feature:
- 在指定搜索引擎中搜索, 如果是url, 那么打开url(多一个选项)
- 搜索并打开历史记录(safari)
- 搜索并打开收藏(safari)

### Window Manager

Settings:
- 搜索窗口的搜索方式
	- fuzzy
	- exact
	- regex
- 配置允许哪些平铺方式(多选)
	- 二等分
	- 三等分
	- 四等分
	- ...
- Footer的actions中每一个action的快捷键

features:
1. 搜索window(按照title, app, ...)
2. 置顶window(active window)
3. 将窗口平铺于...(可以配置不同的布局, grid布局的不同的位置)
4. ...(请你帮我思考还有哪些窗口的控制)

## 使用逻辑

首先, 第一次打开MainWindow(NSPanel, 注意不是MainModule)的时候, 激活MainModule的default feature(设置DataCenter的`activeFeature`), 将焦点自动聚焦在输入框中(执行MainModule自己的逻辑)

有两种不同的选择:
1. 直接输入文字进行搜索. 具体的搜索逻辑在后续给出
	1. 如果选中的是Module, 那么按下回车键, 可以跳转到该Module的subview(在MainModule的feature中展示subview)
		1. 跳转到MainModule中的modules feature中(设置`activeFeature`)
		2. 根据对应module展示subview, 并执行相关的初始化设置
		3. 在这个界面, 搜索module的feature, 或者进行其他的一些内容的设置
			1. 可以通过上下键切换
			2. 可以搜索feature, 并选中(默认选中第一项)
			3. 对于Media controller或者calendar等modules, 可以点击或者执行其他操作, 不仅仅是搜索
		4. 默认选中第一个feature
		5. 对于分栏展示的Module subview, 使用 tab / shift+tab 切换栏(可以在设置中修改). 
			1. 默认选中第一个可选中的控件(按钮, 输入框等), 切换的时候记录之前选中的控件. 当第二次切换回去的时候, 焦点回到记录中的控件上.
			2. 使用上下左右键在当前栏中进行切换
			3. 这些的实现可能需要一个新的view或者控件或者布局
		6. 选中feature之后, 在footer中展示feature可执行的操作
	2. 如果选中的是feature, 有两种情况:
		1. 按下enter键, 触发return-key的event, 根据event的handler执行操作
			- 可能是切换feature(`activeFeature`), 展示该feature的subview并执行初始化
			- 可能是直接执行操作, 然后隐藏窗口(不进入subview, 或者该feature不存在subview)
		2. 如果是Cmd+enter键, 打开actions的弹窗(上拉框, 详情参考下面给你的raycast的图), 可以搜索actions, 或者直接使用快捷键执行action
2. 可以上下键选择, 选择不同的entry. entry由MainModule管理

当NSPanel失去焦点的时候, 隐藏面板; 部分action也会隐藏面板

搜索逻辑:
1. 根据module设置中的设置, 使用fuzzy/exact/regex进行搜索.
2. 搜索的内容为prefix和name, 如果settings中有额外配置, 那么按照settings中的配置执行
3. 搜索首先关注prefix, prefix需要全字匹配, 如果匹配成功, 那么将结果置顶, 然后是按照匹配准确率进行排序的内容(fuzzy的score, exact/regex的匹配结果, 这样的顺序)
	- 注意, prefix可能为空, 此时直接跳过搜索prefix这一步即可
4. 注意, 部分module会自己配置可供搜索的内容. 在fuzzy find的时候, Module可能会自定义一个权重, 将不同内容的搜索分数加权平均得到最终的score
