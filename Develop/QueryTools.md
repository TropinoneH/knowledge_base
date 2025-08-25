---
type: project
tags:
  - swift
  - app
  - GUI
  - MacOS
  - software/Xcode
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
- Settings Window
	- 分成两栏
		- 左侧是所有的module, 是导航栏. 玻璃效果的透明度略低
		- 右侧是选中module的具体设置, 所有的设置由每个module自己控制. 玻璃效果的blur效果略高
	- 每个module有自己的SettingsView, 这个Window只是展示
	- 使用Defaults持久化
	- 每次设置之后, 热更新, 包括UI和功能

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

所有global共享的数据全部放在一个singleton模式的`ObservableObject`下, 使用`@Publisher`或者`Combine`进行监听和热更新, 比如说, 当前启用的模块`activeModule`, 当前选中的结果索引`selectedIndex`, 所有的搜索结果`queryResults`, 当前搜索的内容`currentQuery`. 每个模块中进行更新数据的时候都是对这个`@ObservedObject`进行修改, 所有与数据相关的内容都是对这个进行读取.

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
- enabled module
- module priority
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

如果输入内容, 对于只有一个subview的module, 匹配module对应feature的
### App Search

Settings:
- 可以选择搜索的方式: fuzzy, exact, regex
- Footer的actions中每一个action的快捷键

搜索并展示app. 可以搜索App的kMDItemDisplayName, 可以搜索kMDItemAlternativeNames.

只有一个subview: search
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

一个subview:
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

两个subview:
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

一个subview: history
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

一个subview:
- 搜索
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

一个subview, 多个功能: 打开System Settings.app里面的不同设置界面. 最好能够动态读取System Settings里面有哪些设置, 然后打开对应的panel

### System

多个subview:
- 输入/输出音量控制, 输出/输出设备切换,
- 亮度控制(需要包括外接显示器的亮度)
- ...(请你帮我思考还有哪些设置可以控制)

### Translate

两个subview:
- dictionary, 针对单个单词的字典, 调用苹果自己的dict.app
- translate, 针对一整句话进行翻译, 可能需要api

### Web Browser

Settings:
- 用什么browser
- 用什么搜索引擎

三个subview:
- 在指定搜索引擎中搜索, 如果是url, 那么打开url(多一个选项)
- 搜索并打开历史记录(safari)
- 搜索并打开收藏(safari)

### Window Manager

一个subview, 有多个action(query results):
1. 搜索window(按照title, app, ...)
2. 置顶window(active window)
3. 将窗口平铺于...(可以配置不同的布局, grid布局的不同的位置)
4. ...(请你帮我思考还有哪些窗口的控制)

## 要求

请你阅读上面所有的需求文档(部分Modules没有写完, 缺少一些UI/设置/功能的配置, 你可以帮我自行完成)

你需要根据需求文档, 写出一份实施细则, 具体到每个部分的每个文件有什么功能, 需要完成什么功能, 需要实现什么API接口. 将这个实施细则使用markdown的todo list的形式给出. 这个todo list的顺序是实施的顺序, 这个todo list作为大纲. 注意, 你只需要在最细节的一条内容中添加`- [ ]`即可, 无需全部添加

你需要尽可能详细写, 无需考虑输出限制, 你需要尽可能详细给出每个模块的所有需要实现的内容, 尽可能不全需要实现的内容. 在你进行输出todo list的时候, 你需要考虑全局, 考虑所有的模块的开发, 一次性将全部需要实现的属性给出.

# QueryTools App 实施细则

使用 #software/Xcode 进行创建

## 1. 项目设置与核心架构 (Project Setup & Core Architecture)

- **项目初始化**
    - [x] 创建名为 `QueryTools` 的新 macOS App 项目.
    - [x] 在项目根目录下创建 `Packages` Group.
    - [x] 集成项目依赖 (Swift Packages):
        - [x] `File` -> `Add Packages...` -> `https://github.com/Clipy/Sauce`
        - [x] `File` -> `Add Packages...` -> `https://github.com/sindresorhus/KeyboardShortcuts`
        - [x] `File` -> `Add Packages...` -> `https://github.com/sindresorhus/Defaults.git`
        - [x] `File` -> `Add Packages...` -> `https://github.com/sindresorhus/LaunchAtLogin`
        - [x] `File` -> `Add Packages...` -> `https://github.com/sparkle-project/Sparkle`

- **协议模块 (`QueryKit` Protocol Module)**
    - [x] 创建本地 Swift Package `QueryKit`.
    - **`QueryKit/Sources/QueryKit/QueryModule.swift`**
        - [x] 定义 `QueryModule` protocol, 作为所有模块的入口.
            ```swift
            public protocol QueryModule {
                var id: String { get } // unique module id
                var name: String { get }
                var icon: Image { get }
                var prefix: String? { get }
                var features: [ModuleFeature] { get }
                func settingsView() -> AnyView
            }
            ```
    - **`QueryKit/Sources/QueryKit/ModuleFeature.swift`**
        - [x] 定义 `ModuleFeature` protocol, 描述模块提供的具体功能.
            ```swift
            public protocol ModuleFeature {
                var name: String { get }
                func headerView(globalState: GlobalState) -> AnyView?
                func contentView(globalState: GlobalState) -> AnyView
                func footer(globalState: GlobalState) -> ModuleFooter
            }
            ```
    - **`QueryKit/Sources/QueryKit/ModuleFooter.swift`**
        - [x] 定义 `ModuleFooter` struct, 用于配置Footer UI.
            ```swift
            public struct ModuleFooter {
                let returnAction: ModuleAction
                let otherActions: [ModuleAction]
            }
            ```
    - **`QueryKit/Sources/QueryKit/ModuleAction.swift`**
        - [x] 定义 `ModuleAction` struct, 用于封装所有可执行动作.
            ```swift
            public struct ModuleAction {
                let name: String
                let shortcut: KeyboardShortcuts.Name? // 与 KeyboardShortcuts 集成
                let handler: () -> Void
            }
            ```

- **数据中心 (Data Hub)**
    - [x] 在 `QueryTools` 主项目中创建 `Core` Group.
    - **`Core/GlobalState.swift`**
        - [x] 创建一个 `final class GlobalState: ObservableObject`, 采用单例模式.
        - [x] `@Published var currentQuery: String = ""`
        - [x] `@Published var queryResults: [Any] = []` // 泛型结果
        - [x] `@Published var selectedIndex: Int = 0`
        - [x] `@Published var activeModule: QueryModule? = nil`
        - [x] `@Published var isMainWindowVisible: Bool = false`
        - [x] `private(set) var loadedModules: [QueryModule] = []`
        - [x] `public func loadModules()`
        - [x] `public func performSearch(query: String)`
        - [x] `public func setActiveModule(_ module: QueryModule)`

- **事件中心 (Event Hub)**
    - **`Core/Notifications.swift`**
        - [x] 使用 `Notification.Name` 扩展定义所有全局事件.
            - [x] `static let escapeKeyPressed`
            - [x] `static let returnKeyPressed`
            - [x] `static let arrowUpKeyPressed`
            - [x] `static let arrowDownKeyPressed`
            - [x] `static let mainWindowWillShow`
            - [x] `static let mainWindowDidHide`
            - [x] `static let settingsDidChange(forModule: String)`

## 2. 通用UI组件与主窗口 (Common UI & Main Windows)

- **通用UI (`QueryTools/UI/Common`)**
    - **`KeyboardKeyView.swift`**
        - [ ] 创建 `KeyboardKeyView: View`.
        - [ ] 支持 `modifier` (显示SF Symbol) 和 `key` (显示大写字母) 两种模式.
        - [ ] 实现玻璃效果背景 (material background).
        - [ ] 可配置大小.
    - **`SearchBarView.swift`**
        - [ ] 创建 `SearchBarView: View`.
        - [ ] 包含一个 `TextField` (input).
        - [ ] 实现 `onEditingChanged` 和 `onCommit` 回调.
        - [ ] 实现焦点自动保持逻辑 (使用 `@FocusState`).
        - [ ] 左侧可选的返回按钮 (`Image(systemName: "arrow.left")`).
        - [ ] 右侧可选的 `Picker` 下拉框.
        - [ ] 可配置的 `placeholder` 文本.
    - **`FooterView.swift`**
        - [ ] 创建 `FooterView: View`.
        - [ ] 左侧展示模块图标和 `feature` 名称.
        - [ ] 右侧垂直分割线隔开两个按钮.
        - [ ] 实现 "Return Key" 按钮, 包含文本和 `KeyboardKeyView`.
        - [ ] 实现 "Actions" 按钮, 点击后弹出 `ActionsPopoverView`.
    - **`ActionsPopoverView.swift`**
        - [ ] 创建 `ActionsPopoverView: View` 用于展示actions列表.
        - [ ] 实现玻璃效果背景.
        - [ ] 顶端包含一个搜索框, 用于过滤 `actions`.
        - [ ] 列表展示所有可用的 `ModuleAction`.
        - [ ] 实现外部点击或按 `Esc` 关闭逻辑.

- **主搜索窗口 (Search Window)**
    - **`Windows/SearchWindow.swift`**
        - [ ] 创建 `SearchWindow: NSPanel`, 设置 styleMask: `.borderless`, `.fullSizeContentView`, `.nonactivatingPanel`.
        - [ ] 实现 `canBecomeKey` 返回 `true` 但不激活其他应用.
        - [ ] 实现失去焦点时自动隐藏 (`windowDidResignKey`).
    - **`Windows/SearchWindowManager.swift`**
        - [ ] 管理 `SearchWindow` 的显示和隐藏.
        - [ ] 拦截 Cmd+Q, 改为隐藏窗口.
        - [ ] 监听全局快捷键以显示窗口.
    - **`UI/Main/MainView.swift`**
        - [ ] 作为 `SearchWindow` 的根 `View`.
        - [ ] 顶部包含 `SearchBarView`.
        - [ ] 中间是 `ContentView`, 根据 `activeModule` 动态展示内容.
        - [ ] 底部是 `FooterView`.
        - [ ] 实现键盘事件拦截 (通过 `NSViewController` 的 `cancelOperation` 等).

- **设置窗口 (Settings Window)**
    - **`Windows/SettingsWindow.swift`**
        - [ ] 创建一个标准的 `NSWindow`.
    - **`UI/Settings/SettingsView.swift`**
        - [ ] 作为 `SettingsWindow` 的根 `View`.
        - [ ] 使用 `NavigationSplitView` 创建两栏布局.
        - [ ] 左侧 `Sidebar` 列表展示所有 `loadedModules`.
        - [ ] 右侧 `Detail` 区域展示 `selectedModule.settingsView()`.
        - [ ] 应用玻璃效果, 并按要求调整透明度和模糊度.

## 3. 主程序逻辑 (QueryTools App Logic)

- **`QueryToolsApp.swift`**
    - [ ] App 入口, 初始化 `GlobalState` 和 `SearchWindowManager`.
    - [ ] 注册全局快捷键.
    - [ ] 加载 `Sparkle` 更新器.
    - [ ] 配置 `LaunchAtLogin`.
- **`Core/ModuleManager.swift`**
    - [ ] 负责发现和加载所有模块 (Swift Packages).
    - [ ] 提供一个接口获取所有已启用的模块列表.
    - [ ] 处理模块的优先级排序.
- **`Core/SearchEngine.swift`**
    - [ ] 实现主搜索逻辑.
    - [ ] 当 `currentQuery` 改变时, 进行 `debounce` 处理.
    - [ ] 检查 `query` 是否匹配模块 `prefix`.
        - [ ] 如果匹配, 则将搜索范围限定在该模块内, 并设置 `activeModule`.
        - [ ] 如果不匹配, 则在所有模块的 `features` 中进行全局搜索.
    - [ ] 更新 `GlobalState.queryResults`.

## 4. 模块开发 (Modules Development)

### MainView (作为核心功能实现)

- **`UI/Main/MainContentView.swift`**
    - [ ] 当 `activeModule` 为 `nil` 时展示此视图.
    - [ ] 以 `Section` 形式分组展示所有已启用模块的 `feature` 入口.
- **`Core/GeneralSettings.swift`**
    - [ ] 使用 `Defaults` 创建持久化设置.
        - [ ] `enum SearchMode: String, Codable { case fuzzy, exact, regex }`
        - [ ] `Defaults.Key<SearchMode>("searchMode", default: .fuzzy)`
        - [ ] `Defaults.Key<Double>("debounceDuration", default: 0.2)`
        - [ ] `Defaults.Key<[String]>("enabledModules", default: ["AppSearch", ...])`
        - [ ] `Defaults.Key<[String: Int]>("modulePriority", default: [:])`
        - [ ] 定义 `KeyboardShortcuts.Name` 用于 Return 和 Actions 快捷键.
- **`UI/Settings/GeneralSettingsView.swift`**
    - [ ] 提供UI来修改上述所有 `GeneralSettings`.
    - [ ] 使用 `KeyboardShortcuts.Recorder` 来录制快捷键.

---

### App Search Module

- **Package & Protocol**
    - [ ] 创建本地 Swift Package `AppSearchModule`.
    - [ ] 实现 `QueryModule` protocol.
- **Settings**
    - [ ] `AppSearchSettings.swift`: 使用 `Defaults` 存储搜索方式, 最近使用App数量.
    - [ ] `AppSearchSettingsView.swift`: 提供UI进行设置.
- **Logic**
    - [ ] `AppSearchService.swift`:
        - [ ] 使用 `NSMetadataQuery` 或 `Spotlight` 搜索 `kMDItemContentType == "com.apple.application-bundle"`.
        - [ ] 搜索 `kMDItemDisplayName` 和 `kMDItemAlternativeNames`.
        - [ ] 缓存搜索结果以提高性能.
        - [ ] 提供获取最近使用App的接口 (`NSWorkspace.shared.runningApplications`).
- **Views**
    - [ ] `AppSearchView.swift` (Feature ContentView):
        - [ ] 上半部分使用 `ScrollView` + `LazyVGrid` 展示最近使用的App.
        - [ ] 下半部分使用 `List` 展示按 `Category` 分组的搜索结果.
        - [ ] `AppItemView.swift`: 展示单个App的图标和名称.

---

### Calendar Module

- **Package & Protocol**
    - [ ] 创建本地 Swift Package `CalendarModule`.
    - [ ] 实现 `QueryModule` protocol.
- **Logic**
    - [ ] `ReminderService.swift`:
        - [ ] 使用 `EventKit`框架访问用户的提醒事项.
        - [ ] 请求日历/提醒事项访问权限.
        - [ ] 提供接口获取指定日期范围内的所有提醒事项.
        - [ ] 提供增、删、改、完成提醒事项的接口.
- **Views**
    - [ ] `CalendarView.swift` (Feature ContentView):
        - [ ] 实现一个日历网格视图.
        - [ ] `CalendarDayCell.swift`: 在每个单元格中渲染当天的提醒事项.
        - [ ] `ReminderItemView.swift`: 用提醒事项分类的颜色作为背景, 展示标题.
    - [ ] `EditReminderView.swift` (用于添加/修改的Subview):
        - [ ] 创建表单, 包含标题、备注、日期、优先级等输入框.
        - [ ] 实现 Tab 和 Shift+Tab 的焦点切换.

---

### Calculator Module

- **Package & Protocol**
    - [ ] 创建本地 Swift Package `CalculatorModule`.
    - [ ] 实现 `QueryModule` protocol.
- **Logic**
    - [ ] `CalculatorEngine.swift`:
        - [ ] 封装 `NSExpression` 进行数学计算.
        - [ ] 扩展 `NSExpression` 以支持 `**` (幂) 和 `sqrt()` (开根) 等自定义函数.
        - [ ] 实现布尔运算逻辑.
    - [ ] `UnitConverterService.swift`:
        - [ ] 使用 `Foundation` 的 `Unit` 和 `Dimension` 类型进行单位转换. (这是内置库, 无需网络)
        - [ ] 建立一个可支持的单位转换列表.
- **Views**
    - [ ] `CalculationView.swift` (计算 Subview):
        - [ ] 无输入时, 展示帮助信息 (支持的运算符和函数).
        - [ ] 输入有效时, 显示计算结果.
        - [ ] 输入无效时, 显示错误提示.
    - [ ] `UnitConverterView.swift` (单位转换 Subview):
        - [ ] 无输入时, 分类展示支持的单位和占位符.
        - [ ] 根据输入内容实时进行转换并展示结果.

---

### Clipboard Module

- **Package & Protocol**
    - [ ] 创建本地 Swift Package `ClipboardModule`.
    - [ ] 实现 `QueryModule` protocol.
- **Data**
    - [ ] `ClipboardDatabase.swift`:
        - [ ] 使用 `GRDB.swift` 或 `SQLite.swift` 库来管理 `sqlite` 数据库.
        - [ ] 设计数据表: `id`, `content_type` (text, image, file), `data`, `source_app`, `first_copied_at`, `last_used_at`, `copy_count`.
- **Logic**
    - [ ] `ClipboardManager.swift`:
        - [ ] 使用 `Timer` 轮询 `NSPasteboard`.
        - [ ] 检测剪贴板内容变化, 并将新内容存入数据库.
        - [ ] 提供搜索和排序数据库记录的接口.
- **Views**
    - [ ] `ClipboardHistoryView.swift` (Feature ContentView):
        - [ ] 使用 `NavigationSplitView` 实现两栏布局.
        - [ ] 左侧 `List` 展示预览条目 (`ClipboardItemRowView`).
        - [ ] 右侧 `DetailView` 展示选中项的详细内容, 根据类型 (文字/图片/文件) 渲染不同视图.

---

### Finder Module

- **Package & Protocol**
    - [ ] 创建本地 Swift Package `FinderModule`.
    - [ ] 实现 `QueryModule` protocol.
- **Logic**
    - [ ] `FinderSearchService.swift`:
        - [ ] 使用 `NSMetadataQuery` 进行文件搜索.
        - [ ] 根据下拉框选择, 配置搜索范围 (`kMDQueryScopeHome`, `kMDQueryScopeComputer`).
        - [ ] 提供获取文件 `metadata` 和 `preview` (使用 `QuickLookThumbnailing`) 的接口.
- **Views**
    - [ ] `FinderSearchView.swift` (Feature ContentView):
        - [ ] 使用 `NavigationSplitView` 实现两栏布局.
        - [ ] 左侧展示最近文件列表和搜索结果.
        - [ ] 右侧 `FileDetailView` 展示预览和详细的元数据.

---

### System & Settings Modules (合并简化)

- **Package & Protocol**
    - [ ] 创建本地 Swift Package `SystemModule`.
    - [ ] 实现 `QueryModule` protocol.
- **Logic**
    - [ ] `SystemActionService.swift`:
        - [ ] **设置跳转**: 使用 `NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.keyboard")!)` 打开系统设置特定面板.
        - [ ] **音量/亮度**: 使用 `CoreAudio` (可能需要三方库简化) 和 `CoreDisplay` 控制.
        - [ ] **系统操作**: 使用 `AppleScript` 执行 `sleep`, `shutdown`, `restart`, `toggle dark mode`, `toggle DND` 等操作.
        - [ ] **网络**: 使用 `CoreWLAN` 框架控制Wi-Fi.
        - [ ] **蓝牙**: 使用 `IOBluetooth` 框架控制蓝牙设备.
- **Views**
    - [ ] `SystemActionsView.swift` (Feature ContentView):
        - [ ] 作为一个 `List`, 展示所有可用的系统操作 (如 "Sleep", "Toggle Dark Mode", "Open Sound Settings").
        - [ ] 每个列表项都是一个可执行的动作.

---

### Translate & Web Browser Modules (合并简化, 依赖外部应用)

- **Package & Protocol**
    - [ ] 创建本地 Swift Package `WebModule`.
    - [ ] 实现 `QueryModule` protocol.
- **Logic**
    - [ ] `WebActionService.swift`:
        - [ ] **搜索引擎**: 根据用户设置拼接搜索URL (e.g., `https://www.google.com/search?q=...`), 使用 `NSWorkspace.shared.open()` 打开.
        - [ ] **URL判断**: 检查输入是否为合法的URL, 如果是则直接打开.
        - [ ] **历史/收藏**: 使用 `AppleScript` 或直接读取 `~/Library/Safari/History.db` 和 `Bookmarks.plist` 文件. (需要处理沙盒权限)
        - [ ] **翻译/词典**: 使用URL Scheme打开词典应用 (`dict://word`) 或跳转到谷歌翻译页面.
- **Views**
    - [ ] `WebSearchView.swift` (Feature ContentView):
        - [ ] `List` 展示搜索结果/历史/收藏.
        - [ ] 根据输入内容动态生成 "Search with Google for '...'" 或 "Open URL '...'" 等选项.

---

### Window Manager Module

- **Package & Protocol**
    - [ ] 创建本地 Swift Package `WindowManagerModule`.
    - [ ] 实现 `QueryModule` protocol.
- **Logic**
    - [ ] `WindowService.swift`:
        - [ ] 使用 **Accessibility API** (`AXUIElement`) 来获取所有窗口信息 (app, title) 并对其进行操作 (移动, 缩放, 置顶).
        - [ ] **权限请求**: 实现请求辅助功能权限的逻辑.
        - [ ] **布局管理**: 实现预设的布局算法 (左半屏, 右半屏, 居中, 最大化).
        - [ ] **多显示器**: 使用 `NSScreen.screens` 获取显示器信息, 实现窗口跨显示器移动.
- **Views**
    - [ ] `WindowManagerView.swift` (Feature ContentView):
        - [ ] `List` 展示所有可执行的窗口管理动作 (如 "Center Front Window", "Move to Left Half").
        - [ ] 同时可以有一个搜索框, 搜索当前打开的窗口并进行切换.