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
## 架构

分不同的模块, 每个模块是独立的. 每个模块使用Swift Packages的方式独立开发, 遵循同一个protocol(这个也可以是一个local Swift Packages), 最终在一个统一的架构中进行展示. 注意, 每一个Module都要是一个完全独立的项目, 不要在同一个项目中进行开发.

大致分为多个模块, QueryTools本身, protocol, 和其他modules. [[Xcode Add Packages#Create New Local Packages|创建packages]]的方式为: 在project root下创建一个新的group `Packages`, 选择menubar的File -> New -> Package..., 创建Multiplatform的Library, 并添加到TARGETS -> QueryTools中.
- QueryTools本身提供主要的框架, 提供各种API, UI窗口的管理, 主要的程序入口
- protocol提供Modules和QueryTools之间的交互
- Modules复制具体的功能实现
	- module id(unique)
	- module name
	- module icon
	- prefix
	- settings view
	- features. 每个features都有:
		- feature name
		- settings(使用Defaults进行管理, 每个module管理自己的settings)
		- content view
		- footer包含的内容:
			- return-key事件的描述("启动App", "打开文件位置", "复制结果到剪切板", ...)
			- 以及actions, 详情见[[#Footer]]部分
		- header view:
			- 一般是search bar(详情参见[[#SearchBar]]), 里面需要配置placeholder和下拉框的内容
			- - 但是也可以不存在或者是其他内容

有两个主要的窗口, 一个Search Window(Main Window), 一个Settings Window.
- Search Window是主要的窗口, 使用NSPanel, .borderless, .fullSizeContentView, .nonactivatingPanel.
	- 当失去焦点的时候自动隐藏窗口
	- 拦截Cmd+Q, 不退出, 而是隐藏窗口
	- 在这里拦截escape(使用cancelOperation).
	- 在这里拦截所有的key press, 但是我希望你不是直接去监听按键按下而是类似cancelOperation这种事件的拦截, 因为有的按键并不是针对这个SearchWindow的, 比如说使用中文输入法的时候的return, arrow key等.
	- 不改变原来窗口的焦点
	- 在打开的时候可能会获取之前Window的ID(句柄?引用?), 在Window Manager Module中可能会有用
        - 在打开的时候触发事件, 在隐藏的时候触发事件
- Settings Window
	- 分成两栏
		- 左侧是所有的module, 是导航栏. 玻璃效果的透明度略低
		- 右侧是选中module的具体设置, 所有的设置由每个module自己控制. 玻璃效果的blur效果略高
	- 每个module有自己的SettingsView, 这个Window只是展示
	- 使用Defaults持久化
	- 每次设置之后, 热更新, 包括UI和功能(触发事件)

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

所有global共享的数据全部放在一个singleton模式的`ObservableObject`下, 使用`@Publisher`或者`Combine`进行监听和热更新, 比如说, 当前启用的模块`activeFeature: (any Feature)?`, 当前选中的结果索引`selectedIndex: Int?`, 所有的搜索结果`queryResults`, 当前搜索的内容`currentQuery`. 每个模块中进行更新数据的时候都是对这个`@ObservedObject`进行修改, 所有与数据相关的内容都是对这个进行读取.

注意, 你可能会需要将部分属性设置为`private(set)`, 然后使用`set...`这种公共接口进行设置, 以保证安全性.

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

## Packages
- https://github.com/Clipy/Sauce 所有键盘的keycode统一
- https://github.com/sindresorhus/KeyboardShortcuts 全局快捷键管理, 提供recorder
- https://github.com/sindresorhus/Defaults.git 持久化设置
- https://github.com/sindresorhus/LaunchAtLogin 配置launch at login
- https://github.com/sparkle-project/Sparkle 软件更新

## Modules

### MainView

GeneralSettings:
- 搜索的方式: fuzzy, exact, regex
- 全局启动的快捷键: KeyboardShortcut
- 确认搜索的快捷键(默认是Return)
- debounce duration
- 每个feature展示多少条结果
- enabled module
- module priority(一个顺序, 这个顺序是module priority的顺序)
- Footer的actions中每个action的快捷键

实际上MainView并不能算是一个额外的Module.

- SearchBar:
	- 没有左侧按钮
	- Placeholder: Search for anything...
	- 右侧展示下拉框, 里面是所有activated modules, 与设置联通
- ContentView: 在进入SearchWindow的时候, 展示其他所有已经被激活的Module的所有subview(feature)的entry(每个module一个section, 分开)
- Footer的actions:
	- 进入feature entry
	- 取消激活
	- Divider()
	- input

默认按照每个module一个section的分栏展示每个module的每个features的entries.

如果输入了任何内容(currentQuery != ""):
- 如果输入的是module prefix + space, 那么搜索该module的所有feature的entry
- 如果输入的是feature prefix + space, 那么直接进入该feature
- 如果都不属于上面两种, 查询所有的feature(需要判断feature是否support这个query), 给出每个feature的最符合的三条记录(这个数量在settings中可以设置), 按照module priority的顺序

如果什么也没有搜索, 那么直接展示所有的features的entries. 这个通过监听展示main window的事件, 进行自动调用搜索(在最开始打开的时候, 进行一次搜索, currentQuery == "", 返回所有的features entries)

搜索结果的UI设置:
- 一个横条
	- 左侧显示Icon, 紧挨着是name(module/prefix/result), 然后紧挨着是灰色小字表示来源(module name)
	- 右侧展示类型, 如, module entry, feature entry, `<feature name>` result, 等
- 其他的结果由其他Module自行决定.

### App Search

Settings:
- 可以选择搜索的方式: fuzzy, exact, regex
- Footer的actions中每一个action的快捷键

搜索并展示app. 可以搜索App的kMDItemDisplayName, 可以搜索kMDItemAlternativeNames.

只有一个feature: search
- 最上方是Search Bar, 左侧有一个按钮(有个Image: 左箭头), Placeholder是“Search for apps...”, 右侧一个下拉框, 里面可以选择搜索的方式(与设置关联)
- 展示的部分分成上下两部分, 上部分展示最近使用的app(数量可以在设置中配置), 下部分按照category的方式分类展示, 按照category的字典序排序category, 每个category中按照app的kMDItemDisplayName的字典序排序.
	- 每个App的展示方式为: 展示App的Icon,  然后在icon的下方展示小字App Display Name

Footer的actions:
- 打开app
- 在finder中打开
- Divider()
- 复制app display name
- 复制App文件路径
- Divider()
- input

### Calendar

Settings:
- Footer的actions中每一个action的快捷键

和`提醒事项.app`打通, 读取所有的提醒事项, 按照日期和所属分类来将其渲染到calendar中

一个feature:
- 展示日期和事项
	- 展示calendar(格子), 每个格子内展示提醒事项
	- 每个事项在日期内分条渲染, 渲染的背景颜色与提醒事项中的分类的颜色相同
	- 渲染的时候不考虑开始/截止时间, 只考虑日期, 但是在同一个日期内渲染的时候按照开始时间的顺序从上到下展示

Footer的actions可以操作的选项有:
- 在`提醒事项.app`中打开
- 添加事项
	- 进入一个新的subview
	- 不需要Search Bar, 直接是一个view, 通过按Tab和Shift Tab在不同的输入框内跳转
	- 可以配置的属性与`提醒事项.app`一致
- 修改事项
	- 进入新的subview, 这个subview同上
- 完成事项
	- 在`提醒事项.app`中标记为已完成
- 删除事项
	- 直接弹窗询问是否删除
- Divider()
- input

### Calculator

Settings:
- Footer的actions中每一个action的快捷键

使用Foundation的Expression库进行计算(或者说, NSExpression). 你需要实现:
- 加减乘除
- 幂次(可能需要实现`**`或者`^`操作符, 和`pow(x,y)`函数), 开根(`sqrt(x)`函数)
- bool运算
	- 一些bool symbol, 如true, false, 等
	- 一些bool operator, 如 `|`(or `||`), `&`(or `&&`), `??`, `cond ? x : y`

单位转换有两个思路, 一个是调用url, 但是需要有网络; 一个是手动实现所有的转换方案, 但是麻烦; 还有一个是调用现有的swift库, 但是我不知道有哪些是可用的, 你需要搜索, 可能没有.

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

Settings:
- 轮训NSPasteboard的时间
- 搜索方式: fuzzy, exact, regex
- 默认排序方式: 首次复制时间, 上次使用时间, 复制的次数
- 需要记录的类型: 文字, 图片, 文件/文件夹
- Footer的actions中每一个action的快捷键

使用sqlite进行储存所有的clipboard history.

分成多个类型, 

一个feature: history
- 分成两栏, 左侧是所有的item, one line的preview; 右侧是选中的item的详细的内容
- 左侧展示: 来源app icon, preview, 上一次使用的时间, 复制的次数
- 右侧展示:
	- header: 来源app icon, 来源app display name, 首次复制时间, 上次使用时间, 复制次数
	- Content: 如果类型是文字, 那么使用NSText展示文本内容; 如果类型是image, 那么展示这个image(注意缩放); 如果类型是file(或者folder), 那么展示path和缩略图, 以及一些可能存在的file的属性(kMD属性)

Footer的actions:
- 如果是文字, 那么展示“编辑”
- 如果是文件, 那么展示“在finder中打开”
- 删除item
- Divider()
- input

### Finder

Settings:
- 搜索的方式: fuzzy, exact, regex
- Footer的actions中每一个action的快捷键

一个feature, subview为:
- 有一个Search Bar
	- 左侧一个按钮(Image: 左箭头), 表示退出当前的module回到MainView
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

### Settings

一个feature(subview), 多个功能: 打开System Settings.app里面的不同设置界面. 最好能够动态读取System Settings里面有哪些设置, 然后打开对应的panel

### System

多个feature:
- 输入/输出音量控制, 输出/输出设备切换,
- 亮度控制(需要包括外接显示器的亮度)
- ...(请你帮我思考还有哪些设置可以控制)

### Translate

两个feature:
- dictionary, 针对单个单词的字典, 调用苹果自己的dict.app
- translate, 针对一整句话进行翻译, 可能需要api

### Web Browser

Settings:
- 用什么browser
- 用什么搜索引擎

三个feature:
- 在指定搜索引擎中搜索, 如果是url, 那么打开url(多一个选项)
- 搜索并打开历史记录(safari)
- 搜索并打开收藏(safari)

### Window Manager

一个feature, 有多个功能(query results):
1. 搜索window(按照title, app, ...)
2. 置顶window(active window)
3. 将窗口平铺于...(可以配置不同的布局, grid布局的不同的位置)
4. ...(请你帮我思考还有哪些窗口的控制)

## 要求

请你阅读上面所有的需求文档(部分Modules没有写完, 缺少一些UI/设置/功能的配置, 你可以帮我自行完成)

你需要根据需求文档, 写出一份实施细则, 具体到每个部分的每个文件有什么功能, 需要完成什么功能, 需要实现什么API接口. 将这个实施细则使用markdown的todo list的形式给出. 这个todo list的顺序是实施的顺序, 这个todo list作为大纲.

你需要尽可能详细写, 无需考虑输出限制, 你需要尽可能详细给出每个模块的所有需要实现的内容, 尽可能补全需要实现的内容, 并且要保证有极高的可拓展性. 在你进行输出todo list的时候, 你需要考虑全局, 考虑所有的模块的开发, 尽可能不要留下“空白”或者“占位符”, 一次性将全部需要实现的属性给出.

我希望文件架构为:
1. 创建一个Group: Packages, 所有的swift package放在这里
2. 在QueryTools中, Core放核心组件, App放启动相关的(AppDelegate, QueryToolsApp, 等等, 以及生命周期相关的内容), UI放界面(里面可以放SearchView, SettingsView, Components, 等等), Utils(放工具相关的内容), 等等. 这些都是文件夹而不是group.