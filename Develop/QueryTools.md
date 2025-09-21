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
# QueryTools Requires

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

你需要尽可能详细写, 无需考虑输出限制, 你需要尽可能详细给出每个模块的所有需要实现的内容, 尽可能不全需要实现的内容. 在你进行输出todo list的时候, 你需要考虑全局, 考虑所有的模块的开发, 一次性将全部需要实现的属性给出.
# QueryTools App 实施细则

使用 #software/Xcode 进行创建

## 大纲

1.  **阶段一：项目初始化与核心架构**
    *   创建主项目和核心的Swift Packages。
    *   定义模块间交互的协议。
    *   建立全局数据状态管理中心。
    *   集成第三方基础库。
2.  **阶段二：核心UI与窗口管理**
    *   实现主搜索窗口 (Search Window)。
    *   实现设置窗口 (Settings Window)。
    *   开发通用的UI组件 (SearchBar, Footer, Keyboard View)。
3.  **阶段三：主程序逻辑与模块加载**
    *   实现主视图 (MainView) 的逻辑。
    *   实现模块加载与管理机制。
    *   实现事件分发中心。
4.  **阶段四：模块开发**
    *   按照从易到难的顺序，逐个实现功能模块。每个模块都是一个独立的Swift Package。
5.  **阶段五：打包与发布**
    *   集成应用更新、开机自启等功能。
    *   完成最后的配置和打包。

## 实施细则 (Todo List)

### 阶段一：项目初始化与核心架构

- **1. 创建 Xcode 项目**
	- [x] 创建一个新的 macOS App 项目，命名为 `QueryTools`。
	- [x] 在项目根目录下创建一个名为 `Packages` 的Group，用于存放本地Swift Packages。

- **2. 创建 `ModuleProtocol` Package**
	- [x] 在 `Packages` Group下，创建新的本地Swift Package，命名为 `ModuleProtocol`。
	- **File: `Module.swift`**
		- [x] 定义 `Module` protocol，包含以下属性：
			-   `var id: UUID { get }`
			-   `var name: String { get }`
			-   `var icon: Image { get }`
			-   `var prefix: String? { get }`
			-   `var settingsView: AnyView { get }`
			-   `var features: [any Feature] { get }`
	- **File: `Feature.swift`**
		- [x] 定义 `Feature` protocol，包含以下属性和方法：
			-   `var id: UUID`
			-   `var name: String { get }`
			-   `var prefix: String? { get }`
			-   `func support(for query: String) -> Bool` // 判断该feature是否应该响应当前查询.
			-   `func performQuery() -> [QueryResult]` // 核心函数, 从全局状态管理中心中读取currentQuery, 进行搜索或者其他功能
			-   `var view: AnyView { get }` // 返回该feature的主内容视图
			-   `var headerView: AnyView? { get }` // 可选的头部视图，通常是SearchBar
			-   `var footerView: AnyView? { get }` // 可选的脚部视图
	- **File: `Action.swift`**
		- [x] 定义 `Action` struct，包含：
			-   `var id: UUID`
			-   `var name: String`
			-   `var shortcut: KeyboardShortcuts.Name?` // 可选的快捷键
			-   `var handler: () -> Void` // 执行操作的闭包
	- **File: `QueryResult.swift`**
		- [x] 定义 `QueryResult` struct/class，用于在MainView中展示搜索结果条目。
			-   `var id: UUID`
			-   `var sourceModule: any Module`
			-   `var icon: Image`
			-   `var title: String`
			-   `var subtitle: String?`
			-   `var typeDescription: String` // "Module Entry", "App Result", etc.
			-   `var onSelect: () -> Void` // 选中后执行的操作
			-   `var actions: [Action] { get }` // 定义该feature支持的actions

- **3. 创建全局数据状态管理中心 (`GlobalState`)**
    - [x] 在 `QueryTools` 主项目中，创建 `GlobalState.swift`。
    - [x] 创建一个 `final class GlobalState: ObservableObject`，并实现为单例模式 (`static let shared = GlobalState()`)。
    - [x] 添加 `@Published` 属性：
        -   `@Published var currentQuery: String = ""`
        -   `@Published var queryResults: [QueryResult] = []`
        -   `@Published var activeFeature: (any Feature)?`
        -   `@Published var selectedIndex: Int? = nil`
    - [x] 添加线程安全的方法来更新这些属性。

- **4. 事件驱动中心 (`NotificationManager`)**
    - [x] 在 `QueryTools` 主项目中，创建 `AppEvents.swift`。
    - [x] 使用 `Notification.Name` 扩展，定义所有全局事件：
        -   `static let escapeKeyPressed`
        -   `static let returnKeyPressed`
        -   `static let arrowUpKeyPressed`
        -   `static let arrowDownKeyPressed`
        -   `static let performSearch`
        -   `static let settingsUpdated`
        -   `static let showMainWindow`
        -   `static let hideMainWindow`

- **5. 集成第三方依赖**
    - 在 `QueryTools` 项目中，通过 Swift Package Manager 添加所有依赖：
        - [x] `github.com/Clipy/Sauce`
        - [x] `github.com/sindresorhus/KeyboardShortcuts`
        - [x] `github.com/sindresorhus/Defaults.git`
        - [x] `github.com/sindresorhus/LaunchAtLogin`
        - [x] `github.com/sparkle-project/Sparkle`

### 阶段二：核心UI与窗口管理

- **1. 实现主搜索窗口 (Search Window)**
    - [ ] 创建 `SearchPanel.swift`，继承自 `NSPanel`。
    - [ ] 在 `init` 中设置窗口样式：`.borderless`, `.fullSizeContentView`, `.nonactivatingPanel`。
    - [ ] 重写 `canBecomeKey` 返回 `true`，以接收键盘事件。
    - [ ] 实现失去焦点时自动隐藏的逻辑 (`windowDidResignKey`)。
    - [ ] 创建 `SearchWindowController.swift` 来管理 `SearchPanel` 的生命周期 (显示/隐藏)。
    - [ ] 在 `AppDelegate` 中监听全局快捷键（使用 `KeyboardShortcuts`），触发显示窗口的逻辑。
    - [ ] 在 `SearchPanel` 中重写 `cancelOperation(_:)`，发送 `.escapeKeyPressed` 通知并隐藏窗口。
    - [ ] 实现一个机制来拦截按键事件，并转换为对应的 `Notification`。

- **2. 实现设置窗口 (Settings Window)**
    - [ ] 创建 `SettingsView.swift` (SwiftUI View)。
    - [ ] 使用 `NavigationSplitView` 实现两栏布局。
    - **左侧导航栏:**
        - [ ] 创建一个 `List`，遍历所有已加载的模块 (`ModuleManager.shared.modules`)。
        - [ ] 每个 `NavigationLink` 展示模块的 `icon` 和 `name`。
        - [ ] 应用 `background(.ultraThinMaterial)` 效果。
    - **右侧内容栏:**
        - [ ] 根据左侧的选择，展示对应模块的 `settingsView`。
        - [ ] 应用 `background(.ultraThickMaterial)` 效果以示区别。
    - [ ] 创建 `SettingsWindowController.swift` 来管理设置窗口。

- **3. 开发通用UI组件**
    - **`KeyboardKeyView.swift`**
        - [ ] 创建一个 SwiftUI View，接收一个 `String` 或 `KeyCode`。
        - [ ] 根据输入是 modifier 还是普通按键，展示 SFSymbol 或大写字母。
        - [ ] 应用玻璃效果背景 (`.background(.ultraThinMaterial)`, `opacity`, `blur`)。
        - [ ] 使用 `.frame(width:height:)` 保证默认大小一致。
    - **`SearchBarView.swift`**
        - [ ] 创建一个 SwiftUI View，包含 `HStack`。
        - [ ] **左侧返回按钮 (可选):** 根据传入的 `context` 判断是否显示。
        - **中间 `TextField`:**
            - [ ] 绑定到 `GlobalState.shared.currentQuery`。
            - [ ] 使用 `@FocusState` 保证焦点持续存在。在 `.onChange(of: focusState)` 中，如果焦点丢失则立即重新请求。
        - [ ] **右侧下拉框 (可选):** 接收一个数据源来展示下拉选项。
    - **`FooterView.swift`**
        - [ ] 创建一个 SwiftUI View，接收一个 `activeFeature` 作为参数。
        - [ ] **左侧:** `HStack` 显示 `feature.icon` 和 `feature.name`。
        - [ ] **中间:** `Spacer()`。
        - **右侧:** `HStack` 包含：
            - [ ] **Return 按钮:**
                -   `Button` 内含 `HStack` (文本描述, `KeyboardKeyView`)。
                -   使用 `.buttonStyle(.plain)` 并通过 `.onHover` 控制高亮效果。
                -   `action` 触发 `performReturnAction()`。
            -   `Divider()`。
            - [ ] **Actions 按钮:**
                -   `Button` 内含 `HStack` ("Actions", `KeyboardKeyView` for shortcut)。
                -   `action` 切换 `GlobalState.shared.isActionPanelVisible`。
    - **`ActionPanelView.swift`**
        - [ ] 创建一个 SwiftUI View，作为上拉弹窗。
        - [ ] 使用 `.overlay` 或 `.sheet` 实现。
        - [ ] 背景使用玻璃效果。
        - [ ] 包含一个搜索框，用于过滤 `actions`。
        - [ ] `List` 展示当前 `feature` 的所有 `actions`。
        - [ ] 实现点击外部隐藏和焦点管理逻辑。

### 阶段三：主程序逻辑与模块加载

- **1. 实现模块管理器 (`ModuleManager`)**
    - [ ] 创建 `ModuleManager.swift`，作为单例。
    - [ ] 实现一个 `addModules()` 方法。  
        - `private(set) var allModules: [any Module] = [AppSearchModule(), CalendarModule(), ...]`
        - 在每个Module中调用这个方法, 将自己作为Module添加到`allModules`中.
    - [ ] 从 `Defaults` 读取启用的模块ID和排序，并提供 `enabledModules` 和 `sortedEnabledModules` 属性。

- **2. 实现主视图逻辑 (`MainView` & `MainViewModel`)**
    - [ ] 创建 `MainView.swift`，作为 `SearchPanel` 的 `rootView`。
    - [ ] 创建 `MainViewModel.swift`，`@ObservedObject var globalState = GlobalState.shared`。
    - `MainView` 根据 `globalState` 的状态进行渲染：
        - [ ] 如果 `activeFeature` 不为 `nil`，则显示 `activeFeature.view`。
        - [ ] 如果 `currentQuery` 为空，显示默认界面（所有模块的 `entry`）。
        - [ ] 如果 `currentQuery` 不为空，显示 `queryResults` 列表。
    - 在 `MainViewModel` 中监听 `globalState.$currentQuery`。
        - [ ] 使用 `Combine` 的 `.debounce()` 来防止频繁搜索。
        - [ ] 实现搜索逻辑：
            1.  解析 `query` 是否匹配模块/feature的 `prefix`。
            2.  如果不匹配，则遍历所有 `sortedEnabledModules` 的 `features`。
            3.  调用 `feature.shouldShow(for: query)` 判断是否相关。
            4.  向 feature 请求搜索结果（每个feature自己实现搜索逻辑）。
            5.  汇总、排序并更新 `globalState.queryResults`。

- **3. General Settings**
    - [ ] 创建 `GeneralSettings.swift`，使用 `Defaults` 定义所有全局设置项。
        -   `Key<SearchMode>("searchMode", default: .fuzzy)`
        -   `Key<KeyboardShortcuts.Name?>("globalShortcut", ...)`
        -   `Key<Double>("debounceDuration", default: 0.3)`
        -   `Key<Int>("maxResultsPerFeature", default: 3)`
        -   `Key<[UUID]>("enabledModuleIDs", ...)`
        -   `Key<[UUID]>("modulePriority", ...)`
    - [ ] 创建 `GeneralSettingsView.swift`，提供UI来修改这些设置。这个View将作为"MainView"模块的`settingsView`。

### 阶段四：模块开发 (以App Search为例)

*对每个模块重复以下步骤*

- **1. 创建 `AppSearch` Package**
    - [ ] 在 `Packages` Group下创建新的本地Swift Package `AppSearch`。
    - [ ] 添加 `ModuleProtocol` 作为依赖。

- **2. 实现 `AppSearchModule.swift`**
    - [ ] 创建 `struct AppSearchModule: Module`。
    - [ ] 实现协议要求的所有属性：`id`, `name`, `icon` (e.g., `Image(systemName: "magnifyingglass")`), `prefix` ("app"), `settingsView`, `features`。

- **3. 定义模块设置 (`AppSettings.swift`)**
    - [ ] 创建 `extension Defaults.Keys`，定义 `AppSearch` 专用的设置。
        -   `static let appSearchMode = Key<SearchMode>("appSearchMode", default: .fuzzy)`
        -   `static let recentAppCount = Key<Int>("recentAppCount", default: 5)`
        -   ...

- **4. 实现 `SettingsView.swift`**
    - [ ] 创建 `AppSearchSettingsView: View`。
    - [ ] 提供UI控件（`Picker`, `Stepper`等）来修改 `AppSettings`。

- **5. 实现 `SearchFeature.swift`**
    - [ ] 创建 `struct SearchFeature: Feature`。
    - [ ] 实现协议要求：
        -   `name`: "Search Apps"
        -   `view(for query: String)`: 返回 `AppSearchContentView`。
        -   `headerView`: 返回一个配置好的 `SearchBarView` (placeholder: "Search for apps...")。
        -   `actions`: 定义 "打开", "在Finder中显示" 等 `Action`。
        -   `performReturnAction()`: 实现默认操作，如打开选中的App。

- **6. 实现核心逻辑 (`AppSearcher.swift`)**
    - [ ] 创建 `class AppSearcher`。
    - [ ] 使用 `NSMetadataQuery` 来搜索应用程序。
    - [ ] 设置查询谓词 `NSPredicate(format: "kMDItemContentType == 'com.apple.application-bundle'")`。
    - [ ] 实现方法 `search(for query: String, mode: SearchMode) -> [AppInfo]`。
    - [ ] 实现获取最近使用App的逻辑。

- **7. 实现内容视图 (`AppSearchContentView.swift`)**
    - [ ] 创建 `AppSearchContentView: View`。
    - [ ] 根据`query`是否为空，展示不同的内容。
        -   `query`为空: 上半部分展示最近使用，下半部分按Category分类展示所有App。
        -   `query`不为空: 展示搜索结果列表。
    - [ ] 每个App条目UI：`HStack` (Icon, Display Name)。

---

### 按顺序实现所有模块

*每个模块都遵循上述步骤*

- **Module: Finder**
    - [ ] 核心逻辑: `NSMetadataQuery`，可配置搜索范围。
    - [ ] Preview: 使用 `QuickLookUI.QLPreviewView` 来包装成SwiftUI View。
    - [ ] Metadata: 使用 `MDItem` 属性来获取文件元数据。
- **Module: Calculator**
    - [ ] 核心逻辑: 使用 `NSExpression` 进行计算。
    - [ ] `Feature: 计算`: 解析输入字符串，替换 `^` 为 `**` 或 `pow`，然后交给 `NSExpression`。处理错误并显示。
    - [ ] `Feature: 单位转换`: 使用 `Foundation.Measurement` 和 `UnitConverter` API。Help界面列出所有支持的 `Dimension` 类型。
- **Module: Clipboard**
    - [ ] 核心逻辑: 使用 `Timer` 定期轮询 `NSPasteboard`。
    - [ ] 存储: 使用 `GRDB.swift` (一个SQLite封装库，比CoreData更轻量) 或 `CoreData` 存储历史记录。
    - [ ] UI: 使用 `NavigationSplitView` 实现左侧列表/右侧详情。
- **Module: Calendar**
    - [ ] 核心逻辑: 使用 `EventKit` 框架。
    - [ ] **重要**: 在 `Info.plist` 中添加 `Privacy - Calendars Usage Description` 和 `Privacy - Reminders Usage Description`。
    - [ ] UI: 实现一个自定义的日历格子视图。
- **Module: System**
    - [ ] 音量/亮度: 这部分可能需要调用私有API或通过AppleScript，初始可标记为研究项。
    - [ ] **补充功能**:
        -   `Sleep`, `Restart`, `Shutdown`, `Lock Screen` (通过AppleScript `System Events`)。
        -   `Toggle Dark/Light Mode` (AppleScript)。
        -   `Eject All Disks`。
        -   `Toggle Bluetooth/WiFi` (需要研究)。
- **Module: Window Manager**
    - [ ] 核心逻辑: 使用 `Accessibility API`。
    - [ ] **重要**: 需要引导用户在“系统设置 -> 隐私与安全性 -> 辅助功能”中授权。
    - [ ] 功能实现:
        -   搜索窗口: 遍历`NSWorkspace.shared.runningApplications`，通过AX API获取每个app的所有窗口及其标题。
        -   窗口操作: 使用 `AXUIElement` 的 `AXPosition` 和 `AXSize` 属性来移动和调整窗口大小。
        -   **补充功能**:
            -   居中窗口
            -   最大化窗口
            -   移动到下一个/上一个显示器
            -   隐藏/最小化窗口
- **Module: Web Browser**
    - [ ] 核心逻辑: `NSWorkspace.shared.open(url)`。
    - [ ] 历史/收藏: 需要读取Safari的SQLite数据库 (`~/Library/Safari/History.db`, `Bookmarks.plist`)。这需要处理沙盒或完全磁盘访问权限。
- **Module: Translate**
    - [ ] Dictionary: 使用 `DictionaryServices` API (`DCSCopyTextDefinition`)。
    - [ ] Translate: 需要集成一个网络API。初期可以提供一个跳转到Google翻译或DeepL的Web链接。
- **Module: Settings**
    - [ ] 核心逻辑: 使用 `NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.keyboard"))` 这样的URL Scheme来打开特定的设置面板。
    - [ ] 动态读取: 比较困难，可以先硬编码一个常用设置列表。

### 阶段五：打包与发布

- **1. App 功能集成**
    - [ ] 在 `AppDelegate` 中配置 `LaunchAtLogin`。
    - [ ] 配置 `Sparkle` 的 `SUUpdater`，包括`Info.plist`中的 `SUFeedURL`。
    - [ ] 配置localization数据文件
- **2. App 图标和元数据**
    - [ ] 设计并添加 App Icon (`.icns`)。
    - [ ] 填写 `Info.plist` 的所有元数据，如版本号、版权等。
- **3. 构建与签名**
    - [ ] 配置 App 的签名和证书。
    - [ ] 创建 Archive 并准备分发 (例如，通过 `Developer ID` 签名后打包成 `.dmg`)。