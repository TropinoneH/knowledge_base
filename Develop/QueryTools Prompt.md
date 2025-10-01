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

> [!tip]- prompt
>
> ## 需求
> 
> 我现在正在开发一个类似MacOS26的Spotlight, 或者说类似raycast的程序, 有多种功能. 使用alt+space唤起一个窗口, 然后根据输入的内容执行不同的命令.
> 
> 我下面将会给你这个程序的需要实现的内容, 请你阅读所有的内容, 然后尝试梳理一份完整的开发需求出来.
> 
> 这份开发需求包括:
> 1. 程序的架构设计
> 	1. 文件架构: 文件夹结构, 每个文件的作用
> 	2. 程序架构: 继承, 模块化设计, 数据统一管理, 事件驱动
> 	3. 视图架构: 需要哪些窗口, 哪些subview, 如何进行嵌套
> 2. 数据流动的设计
> 	1. 数据统一管理, 使用数据中心的singleton
> 	2. 数据如何更新
> 	3. 数据更新之后, 发送全局
> 	4. 全局根据数据热更新, 包括重绘UI等
> 	5. 你需要在阅读整个需求之后, 统合所有可能需要在全局传递的数据, 在数据管理中心进行管理. 你需要根据需求进行设计每个数据的类型, 判断数据是否有必要放在数据中心.
> 3. 需求设计
> 	1. 文件之间的依赖关系, 我希望能尽可能少的依赖, 尽可能解耦合
> 	2. 每个文件需要实现哪些内容, 给出完整的内容, 尽可能详细, 使用markdown的TODO list的格式列出来. 注意, 只给嵌套的最深处的一条加上TODO list, 嵌套的外层不需要加上Todo List的标志. 注意, `- [ ]`不要和`-`共用, 在生成todo list的时候不要加上list的前缀
> 	3. 结合上一个需求, 定制一个实现顺序, 按照这个顺序(大纲)进行开发
> 
> 请你完善这个需求文档.
> 
> ## 程序要求
> 
> 分不同的**模块**, 每个模块是独立的. 每个模块使用Swift Packages的方式独立开发, 遵循同一个protocol(这个也可以是一个local Swift Packages), 最终在一个统一的架构中进行展示. 注意, 每一个Module都要是一个完全独立的项目, 不要在同一个项目中进行开发.
> 
> module之间的交互使用**事件驱动**, 所有的数据交流均通过Notification.
> 
> 大致分为多个模块, QueryTools本身, protocol, 和其他modules. [[Xcode Add Packages#Create New Local Packages|创建packages]]的方式为: 在project root下创建一个新的group `Packages`, 选择menubar的File -> New -> Package..., 创建Multiplatform的Library, 并添加到TARGETS -> QueryTools中.
> 
> - QueryTools本身提供主要的框架, 提供各种API, UI窗口的管理, 主要的程序入口
> - protocol提供Modules和QueryTools之间的交互, 提供必须要的API接口
> - Features是一个entry, 或者说是Module提供的一个功能
> 	- feature id(unique, UUID)
> 	- feature name
> 	- prefix(可以留空)
> 	- actions(这个是footer中的action, 配置了这个feature能执行什么操作)
> 		- 一般至少包含return-key event
> 			- 这个action中配置执行的操作: 跳转到新的feature, 或者说是调用函数, 或者说打开新的app, 等等
> 			- 跳转feature的做法是, 在这个action的回调函数中, 发送一个Notification来更新DataCenter的`activeFeature`
> 		- 其他的action由每个feature自己配置
> 		- 这里的actions一般指的是, 当这个feature被选中, 没有被activated的时候, 可以对这个feature执行的actions
> 		- 但是部分的Module会有自己的配置(如, calendar,clipboard,等), 这些Module没有feature, 因此feature actions指的就是module的搜索结果的actions. 这类module会特殊说明, 注意区分
> 	- subview, 配置每个feature自己的subview
> 		- 一个完整的subview, 包含 header,content,footer 三者中至少一个
> 		- 每个feature都有不同的subview. 有的时候有相同的结构, 可以通过创建一个private的公共view集成
> 		- 有的feature可能不存在subview, 因为return-key执行结束之后会隐藏NSPanel(即, MainWindow). 这种功能性的feature不需要也不存在subview
> 		- 如果不存在subview, 那么设置为默认的 AnyView(EmptyView())
> - Modules负责具体的功能实现
> 	- module id(unique, UUID)
> 	- module name
> 	- module icon
> 	- prefix(可以留空)
> 	- actions, 是footer中的action, 一般只包括return-key的handler(跳转subview)和打开该Module的设置两个. 部分Module可能有更多的.
> 		- 这里这个actions的意义是, 当在更高层级选中这个module的时候(一般而言只有在MainModule的搜索的时候才会选中), 展示的actions
> 		- return-key的作用是, 跳转到MainModule的module feature(发送Notification), 然后在MainModule的feature中展示自己Module的subview
> 		- 后续如果没有说明, 那么module的actions为 return-key的action和打开设置面板并跳转到当前module的设置界面 这两个action
> 	- settings view, 根据每个module的setting进行设置
> 	- subview, 这里的subview根据Modules每个模块自己的定义, 去展示
> 		- 展示Module相关的功能, 会在MainModule中的module feature这个Feature中进行展示
> 		- 默认的subview为一个搜索界面, 展示所有的属于这个module的features, 并可以通过搜索框进行搜索
> 	- features
> 
> 程序的主入口提供两个窗口, 但是这两个窗口不提供任何的展示, 所有需要展示的内容均通过Module的subview(或者settings view)提供. 这两个窗口仅作为展示的框架:
> 1. 主窗口:
> 	- 使用NSPanel, 无边框, 不存在标题栏, 使用.nonactivatingPanel
> 	- 当失去焦点的时候自动隐藏
> 	- 不获取窗口焦点, 或者说不改变原来窗口的焦点
> 	- 拦截Cmd+Q, 不会退出而是隐藏窗口(即, 当监测到app退出事件的时候, 拦截这次事件, 转换为隐藏窗口)
> 	- 打开的时候需要获取之前window的id(或者说, 句柄,引用, 等), 在window manager module中可能会使用
> 	- 在对应生命周期触发对应的事件(Notification)
> 	- 拦截并捕获key press事件, 并发送一个Notification
> 		- 找到firstResponser, 判断是否是textfield, 如果是, 那么判断是否`hasMarkedText()`, 如果为true, 那么说明有输入法正在输入, 此时不触发Notification, 不拦截key press
> 		- 如果上面的判断为false, 那么捕获key press, 并发送Notification.
> 2. settings window
> 	- 使用液态玻璃的设计方法(MacOS 26)
> 	- 分成两栏, 参考最新版MacOS26的设置界面
> 		- 左侧是所有的module
> 		- 右侧是选中的module的设置
> 		- 左侧的module通过读取`allModules`获取, 右侧的设置全部由module自己的settings view控制
> 	- 使用`Defaults`库进行持久化
> 	- 每次设置之后热更新, 重新触发UI和功能(在事件中触发)
> 
> ### 事件驱动
> - Escape Key Press
> - Return Key Press
> - UpArrow Key Press
> - DownArrow Key Press
> - LeftArrow Key Press
> - RightArrow Key Press
> - MainView Show
> - MainView Hide
> - Perform Search
> - After Search
> - Settings Update
> - ...
> 
> 上述的事件可能没有用, 还有一些事件是Module独享的, 后续你需要自己添加. 我希望你能够将每个Module完全隔离, 保证不会重命名, 也不会相互干扰.
> 
> 使用NotificationCenter进行事件监听, 在每个Module中独立处理这些事件.
> 
> ### 数据集中管理
> 
> 所有的数据存放在一个singleton下面. 所有其他Modules对DataCenter内数据的修改通过Notification发送请求, 由DataCenter内部处理数据更新. 使用ObservableObject+Published的方式将变量发布, 让其他的Modules能够读取每个变量是否更新, 以完成热更新.
> 
> 使用`.environment(...)`将这个数据管理的singleton注入到最顶层的environment中.
> 
> ### 通用UI设置
> 
> #### Keyboard 展示
> 
> 使用玻璃效果(opacity+blur)作为background, 展示key. 如果是modifiers, 展示对应的icon. 如果是key, 那么展示大写字母.
> 
> 每一个展示框只展示一个modifier或者key, 默认值有相同的大小(可以通过传参的方式修改)
> 
> #### SearchBar
> 
> 默认分成三个小部分.
> 
> 有TextField作为input, 默认焦点持续存在. 如果焦点丢失, 在下一渲染帧重新获取焦点.
> 
> 如果进入的Module不是MainView, 那么左侧有一个button(icon image: 左箭头), 表示退出这个subview回到MainView
> 
> 按照不同的Module的要求, 右侧可能会有下拉框.
> 
> 当输入了module prefix + 空格之后, 会自动跳转到对应的module(搜索该module的所有的feature. 这个feature由module管理和控制. 但是这个还是存在于MainView页面中)
> 
> #### Footer
> 
> 在content view下面有footer. 默认footer由三部分组成:
> - 左侧是module icon + module feature name
> - 中间使用Spacer()隔开
> - 右侧是两个按钮使用vertical Divider()隔开:
> 	- 左侧按钮展示return键的作用(可以在general设置中修改对应按键)
> 		- 文本描述由module定义.
> 		- 紧挨着文本, 展示Keyboard
> 		- 按钮背景全透明, 当鼠标hover的时候, 展示一个highlight
> 		- 点击的功能和按下return是一样的
> 	- 右侧按钮展示“actions”, 紧挨着是快捷键的展示(快捷键也是由general settings中定义)
> 		- 每个module会定义不同的actions. 具体的功能和actions的快捷键由每个模块自行定义
> 		- 当点击按钮或者触发(key shortcut)的时候, 弹窗弹出来一个窗口(上拉框):
> 			- blur+opacity背景
> 			- 展示所有的actions(module定义)
> 			- 不管什么actions, 一定有一个搜索框input, 能够根据action name进行搜索. 搜索的方式由general settings中定义
> 			- 当弹出的时候, 直接将焦点聚焦在弹窗的input中, 无视SearchBar的聚焦(如果有SearchBar)
> 			- 如果鼠标点击了弹窗之外(或者触发Escape Key Press, 或者再次按下Cmd+k), 则隐藏这个弹窗, 并归还焦点(如果有SearchBar, 那么焦点回到SearchBar. 如果没有, 则焦点回到第一个可以获取焦点的位置.)
> 
> #### Others
> 
> 为了复用性, 你需要阅读整个需求文档, 从中提取出来可能会大量复用的组件. 但是注意, 你需要平衡复用性和个性化的需求.
> 
> ## Packages
> - https://github.com/Clipy/Sauce 所有键盘的keycode统一
> - https://github.com/sindresorhus/KeyboardShortcuts 全局快捷键管理, 提供recorder
> - https://github.com/sindresorhus/Defaults.git 持久化设置
> - https://github.com/sindresorhus/LaunchAtLogin 配置launch at login
> - https://github.com/sparkle-project/Sparkle 软件更新
> 
> ## Modules
> 
> ### MainModule(MainView)
> 
> #### GeneralSettings
> - 搜索的方式: fuzzy, exact, regex
> - 全局启动的快捷键: KeyboardShortcut
> - 确认搜索的快捷键(默认是Return)
> - debounce duration
> - 每个module展示多少条结果(这个需要针对每个module设置)
> - enabled module
> - 展示顺序
> 	- module priority
> 		- 可以拖动的module排序, 记录module priority
> 	- recent usage: 按照 上次使用的时间长度的log 和 使用次数 进行加权
> - Footer的actions中每个action的快捷键
> 
> 不需要给MainModule设置任何prefix, MainModule的module和所有features不参与搜索
> 
> #### subview
> 
> 不存在默认的module subview. 默认情况会使用default feature的subview
> 
> #### features
> - default feature
> 	- SearchBar
> 		- 没有左侧按钮
> 		- Placeholder: Search for anything...
> 		- 右侧展示下拉框, 里面是所有activated modules, 与设置联通
> 	- ContentView
> 		- 在进入SearchWindow的时候, 展示其他所有已经被激活的Modules的entries和所有Modules的features的entries
> 		- 默认按照每个module一个section, 分别展示module的entry和自己features的entries.
> 		- 这个不是左右分栏, 是上下分section, 使用上下键进行选择
> 	- Footer的actions:
> 		- 进入feature entry
> 		- 取消激活
> 		- Divider()
> 		- input
> - module feature
> 	- 什么也没有
> 	- 完全用于展示对应module的subview
> 	- actions: 是对应Module的actions
> 
> 搜索结果(entries)的UI设置:
> - 一个横条
> 	- 左侧显示Icon, 紧挨着是name, 如果是feature, 那么紧挨着是灰色小字表示来源(module name)
> 	- 右侧展示类型, 如, module entry, feature entry, 等
> 
> ### App Search
> 
> #### Settings
> - 可以选择搜索的方式: fuzzy, exact, regex
> - 展示"最近使用过的app"的数量
> - Footer的actions中每一个action的快捷键
> - module和每个feature的prefix
> 
> 搜索并展示app. 可以搜索App的kMDItemDisplayName, 可以搜索kMDItemAlternativeNames.
> 
> #### subview
> 
> module subview:
> - 最上方是Search Bar, 左侧有一个按钮(有个Image: 左箭头), Placeholder是“Search for apps...”, 右侧一个下拉框, 里面可以选择搜索的方式(与设置关联)
> - 展示的部分分成上下两部分, 上部分展示最近使用的app(数量可以在设置中配置, 展示的顺序为: (上次使用时间距现在的时长的log)和(使用次数)的加权平均), 下部分按照category的方式分类展示, 按照category的字典序排序category, 每个category中按照app的kMDItemDisplayName的字典序排序.
> 	- 每个App的展示方式为: 展示App的Icon,  然后在icon的下方展示小字App Display Name
> 	- 详情参考spotlight的application模块
> - 如果有输入搜索的内容, 那么改变展示方式:
> 	- 每个结果都是一个横条的entries
> 	- 左侧icon, 紧挨着是name
> 	- 右侧从左到右分别是: category, last used time
> 
> #### feature
> 
> 这个module中, feature是动态的, 每个app作为一个feature.
> 
> 需要检测是否有新的app安装/卸载, 然后更新feature.
> 
> 别人写的搜索方法的一个参考:
> ```swift
> func scanApplicationsWithOrderPreservation() {
> 	DispatchQueue.global(qos: .userInitiated).async {
> 		var found: [AppInfo] = []
> 		var seenPaths = Set<String>()
> 		// 使用并发队列加速扫描
> 		let scanQueue = DispatchQueue(label: "app.scan", attributes: .concurrent)
> 		let group = DispatchGroup()
> 		let lock = NSLock()
> 		
> 		// 扫描所有应用
> 		for path in self.applicationSearchPaths {
> 			group.enter()
> 			scanQueue.async {
> 				let url = URL(fileURLWithPath: path)
> 				
> 				if let enumerator = FileManager.default.enumerator(
> 					at: url,
> 					includingPropertiesForKeys: [.isDirectoryKey],
> 					options: [.skipsHiddenFiles, .skipsPackageDescendants]
> 				) {
> 					var localFound: [AppInfo] = []
> 					var localSeenPaths = Set<String>()
> 					
> 					for case let item as URL in enumerator {
> 						let resolved = item.resolvingSymlinksInPath()
> 						guard resolved.pathExtension == "app",
> 							  self.isValidApp(at: resolved),
> 							  !self.isInsideAnotherApp(resolved) else { continue }
> 						if !localSeenPaths.contains(resolved.path) {
> 							localSeenPaths.insert(resolved.path)
> 							localFound.append(self.appInfo(from: resolved))
> 						}
> 					}
> 					
> 					// 线程安全地合并结果
> 					lock.lock()
> 					found.append(contentsOf: localFound)
> 					seenPaths.formUnion(localSeenPaths)
> 					lock.unlock()
> 				}
> 				group.leave()
> 			}
> 		}
> 		
> 		group.wait()
> 		
> 		// 去重和排序 - 使用更安全的方法
> 		var uniqueApps: [AppInfo] = []
> 		var uniqueSeenPaths = Set<String>()
> 		
> 		for app in found {
> 			if !uniqueSeenPaths.contains(app.url.path) {
> 				uniqueSeenPaths.insert(app.url.path)
> 				uniqueApps.append(app)
> 			}
> 		}
> 		
> 		// 保持现有应用的顺序，只对新增应用按名称排序
> 		var newApps: [AppInfo] = []
> 		var existingAppPaths = Set<String>()
> 		let refreshedMap = Dictionary(uniqueKeysWithValues: uniqueApps.map { ($0.url.path, $0) })
> 
> 		for app in self.apps {
> 			guard let refreshed = refreshedMap[app.url.path] else { continue }
> 			newApps.append(refreshed)
> 			existingAppPaths.insert(app.url.path)
> 		}
> 
> 		let newAppPaths = uniqueApps.filter { !existingAppPaths.contains($0.url.path) }
> 		let sortedNewApps = newAppPaths.sorted { $0.name.localizedCaseInsensitiveCompare($1.name) == .orderedAscending }
> 		newApps.append(contentsOf: sortedNewApps)
> 		
> 		DispatchQueue.main.async {
> 			self.processScannedApplications(newApps)
> 			
> 			// 扫描完成后生成缓存
> 			self.generateCacheAfterScan()
> 		}
> 	}
> }
> ```
> 你需要从中吸取思路, 无需完全照抄, 无需实现全部功能, 只需要实现我提到的功能
> 
> 每个feature的id是app的bundle-id, name是app的display name, icon是app的icon, 不存在subview
> 
> features的Footer的actions:
> - 打开app (return-key action)
> - 在finder中打开
> - 设置这个feature的prefix
> - Divider()
> - 复制app display name
> - 复制App文件路径
> - Divider()
> - input
> 
> ### Calendar
> 
> #### Settings
> - Footer的actions中每一个action的快捷键
> - module和每个feature的prefix
> 
> 和`提醒事项.app`打通, 读取所有的提醒事项的内容, 按照日期和所属分类来将其渲染到calendar中
> 
> #### subview
> 
> module subview:
> - search view存在, 左侧有一个按钮(有个Image: 左箭头), Placeholder是“calendar actions...”, 右侧不存在别的内容
> - 中间的content view分成上下两部分:
> 	- 上半部分渲染日历与日程:
> 		- 展示格子版calendar, 每一天是一个格子. 默认聚焦在“今天”的格子上
> 		- 每个todo事项在日期内分条渲染, 渲染的背景颜色与提醒事项中的分类的颜色相同
> 		- 渲染的时候不考虑开始/截止时间, 只考虑日期, 但是在同一个日期内渲染的时候按照开始时间的顺序从上到下展示
> 	- 下半部分根据选中的日期, 展示当天的todo
> 		- 如果选中的日期有todo, 那么下半部分才会显示(liquid glass的方式浮在上一层layer中), 如果选中的日期没有日程, 那么不显示下半部分
> 
> 由于这个module不存在features, 下面的所有actions均针对日期
> - return-key actions: 添加一个提醒事项
> 	- 打开一个弹窗(不算是弹窗, 而是创建一个新的view(z-index在最前面, 使用liquid glass), 在这个view中进行编辑)
> 	- 不需要Search Bar, 直接是一个view, 通过按Tab和Shift Tab在不同的输入框内跳转
> 	- 可以配置的属性与`提醒事项.app`一致
> - footer actions:
> 	- 在`提醒事项.app`中打开
> 	- 修改事项
> 		- 询问修改哪一个事项(如果只有一个, 那么不需要询问直接选中唯一的一个即可. 如果没有任何事项, 那么这一项内容不可选), 然后进入subview
> 		- subview: 与修改提醒事项的subview(return-key action的subview)相同
> 	- 完成事项
> 		- 询问选择这一天的哪一个事项(如果只有一个, 那么不需要询问直接选中唯一的一个即可. 如果没有任何事项, 那么这一项内容不可选)
> 		- 标记某个事项已完成, 同步给`提醒事项.app`
> 		- 不进入subview, 直接执行操作, 不隐藏窗口, 维持原来的状态
> 	- 删除事项
> 		- 询问选择具体要删除这一天的哪一个事项(如果只有一个, 那么不需要询问直接选中唯一的一个即可. 如果没有任何事项, 那么这一项内容不可选)
> 		- 弹窗询问, 是否删除这个提醒事项
> 		- 不进入subview, 直接执行操作, 不隐藏窗口, 维持原来的状态
> 	- Divider()
> 	- 修改feature的prefix
> 	- Divider()
> 	- input
> ### Calculator
> 
> #### Settings
> - Footer的actions中每一个action的快捷键
> - 每个feature的prefix
> 
> 使用Foundation的Expression库进行计算(或者说, NSExpression). 你需要实现:
> - 加减乘除
> - 幂次(可能需要实现`**`或者`^`操作符, 和`pow(x,y)`函数), 开根(`sqrt(x)`函数)
> - bool运算
> 	- 一些bool symbol, 如true, false, 等
> 	- 一些bool operator, 如 `|`(or `||`), `&`(or `&&`), `??`, `cond ? x : y`
> 
> 单位转换有两个思路, 一个是调用url, 但是需要有网络; 一个是手动实现所有的转换方案, 但是麻烦; 还有一个是调用现有的swift库, 但是我不知道有哪些是可用的, 你需要搜索, 可能没有.
> #### subview
> 
> 默认的module subview
> 
> #### features
> 
> 两个feature:
> - 计算
> 	- 没有query的时候, 展示help界面, 给出所有支持的运算符和函数
> 	- 如果有query且是vaild的, 那么展示结果
> 	- 如果query是invalid的, 那么提示错误信息
> - 单位转换(可能涉及到需要请求url)
> 	- 输入内容, content view中左侧是根据输入内容的展示(如, now, date, 等转换成真正日期或时间), 右侧是转换的结果
> 	- 如果没有输入, 展示help界面, 给出所有支持的占位符(如, now, date, 等)和所有可以执行的转换(如, to amarican, to cm, to meter, 等). 按照类型分section展示.
> Footer的actions:
> - 复制到剪切板
> - Divider()
> - input
> ### Clipboard
> 
> #### Settings
> - 轮训NSPasteboard的时间
> - 搜索方式: fuzzy, exact, regex
> - 默认排序方式: 首次复制时间, 上次使用时间, 复制的次数
> - 需要记录的类型: 文字, 图片, 文件/文件夹
> - 自动删除多长时间之前的记录
> 	- 不删除
> 	- 7天
> 	- 1个月
> 	- ...
> - Footer的actions中每一个action的快捷键
> 
> 使用sqlite进行储存所有的clipboard history.
> 
> 分成多个类型, 文字类型,图片类型,文件类型, 等等
> 
> #### subview
> 
> 注意, 这个module不存在feature. 在MainModule搜索的使用, 也只能搜索到这个Module的entry而搜索不到这个module的features.
> 
> 这个module的subview为:
> - header: 
> - 分成两栏, 左侧是所有的item, one line的preview; 右侧是选中的item的详细的内容
> - 左侧展示: 来源app icon, preview, 上一次使用的时间, 复制的次数
> - 右侧展示:
> 	- header: 来源app icon, 来源app display name, 首次复制时间, 上次使用时间, 复制次数
> 	- Content: 如果类型是文字, 那么使用NSText展示文本内容; 如果类型是image, 那么展示这个image(注意缩放); 如果类型是file(或者folder), 那么展示path和缩略图, 以及一些可能存在的file的属性(kMD属性)
> 
> Footer的actions:
> - 如果是文字, 那么展示“编辑”, 否则变灰色, 不可用
> - 如果是文件, 那么展示“在finder中打开”, 否则变灰色, 不可用
> - 删除item
> - Divider()
> - input
> 
> ### Finder
> 
> #### Settings
> - 搜索的方式: fuzzy, exact, regex
> - Footer的actions中每一个action的快捷键
> 
> #### subview
> 一个feature, subview为:
> - 有一个Search Bar
> 	- 左侧一个按钮(Image: 左箭头), 表示退出当前的module回到MainModule
> 	- 右侧一个下拉框, 是搜索的范围: This Mac, User(username)
> 	- Placeholder: Search files...
> - 左侧是最近使用的文件, 展示略缩图和名称
> - 右侧是details, 上半部分展示文件内容的preview(不同的文件类型使用不同的preview, 如果类型未知则展示略缩图), 下半部分展示metadata, 如, name, path, type, size, create time, last modified time, last opened time
> 
> Footer的actions:
> - open
> - open by
> 	- 与系统中的`right click->打开方式`相同
> - reveal in finder
> - Share
> 	- 与系统中的`right click->共享...`相同
> - Divider()
> - copy file name
> - copy file path
> - Divider()
> - input
> 
> ### Media Controller
> 
> #### Settings
> - Footer的actions中每一个action的快捷键
> 
> #### subview
> 
> module subview为:
> - 一个Search Bar
> 	- 左侧为按钮(Image: 左箭头), 表示退出当前的module回到MainModule
> 	- 右侧不展示内容
> 	- Placeholder: Media Controllers
> - 左侧是可以选择的控制(所有的features. 下面每个都是一个features, 均没有subview, return-key action是其功能, 还有一个其他的action是设置feature的prefix)
> 	- 暂停 / 播放
> 	- 上一首
> 	- 下一首
> 	- 增加音量, 后面加上一个数字(通过string解析成number的方式尝试解析, 如果失败则弹出一个错误提示), 表示将音量的百分比增加多少
> 	- 减少音量, 后面加上一个数字(通过string解析成number的方式尝试解析, 如果失败则弹出一个错误提示), 表示将音量的百分比降低多少
> 	- 设置音量为, 后面加上一个数字(通过string解析成number的方式尝试解析, 如果失败则弹出一个错误提示), 表示将音量的百分比设置为多少
> 	- 静音 / 解除静音
> 	- 打开当前媒体来源
> 	- 在finder中展示(如果是文件), 如果不是文件, 那么这一条feature不显示
> 	- 切换playlist
> 	- 前进一段时间, 后面加上一个数字(通过string解析成float number的方式尝试解析, 如果失败则弹出一个错误提示), 表示将当前的时间前进多少秒
> 	- 后退一段时间, 后面加上一个数字(通过string解析成float number的方式尝试解析, 如果失败则弹出一个错误提示), 表示将当前的时间后退多少秒
> 	- 播放循环设置
> 		- 单曲循环
> 		- 列表循环
> 		- 随机
> 		- 单曲播放(播完暂停)
> 
> 注意, 这里的所有设置均针对MacOS系统设置, 不针对独立的软件
> 
> ### Settings
> 
> 默认module subview, 多个features: 打开System Settings.app里面的不同设置界面. 最好能够动态读取System Settings里面有哪些设置, 然后打开对应的panel
> 
> ### System
> 
> 一个module subview
> 
> 多个feature:
> - 输入/输出音量控制, 输出/输出设备切换,
> - 亮度控制(需要包括外接显示器的亮度)
> - ...(请你帮我思考还有哪些设置可以控制)
> 
> ### Translate
> 
> #### Settings
> - translate的api
> - Footer的actions中每一个action的快捷键
> 
> #### subview
> 
> 默认的module subview
> 
> #### features
> 
> 两个feature:
> - dictionary, 针对单个单词的字典, 调用苹果自己的dict.app
> 	- subview:
> 		- header: 一个输入框输入单词, 然后进行搜索
> 		- content: 一个界面, 展示dictionary的返回结果
> 		- footer: 没有action的footer
> - translate, 针对一整句话进行翻译, 可能需要api
> 	- subview
> 		- header: 一个左箭头表示退出, 不需要别的内容, 不需要输入框
> 		- content: 左右两个文本框, 在左边输入, 右边输出翻译结果
> 		- footer: 没有action的footer
> 
> ### Web Browser
> 
> #### Settings
> - 用什么browser
> - 用什么搜索引擎
> - Footer的actions中每一个action的快捷键
> - features的prefix
> 
> #### subview
> 
> 默认 module subview
> 
> #### features
> 
> 三个feature:
> - 在指定搜索引擎中搜索, 如果是url, 那么打开url(多一个选项)
> - 搜索并打开历史记录(safari)
> - 搜索并打开收藏(safari)
> 
> ### Window Manager
> 
> #### Settings
> - 搜索窗口的搜索方式
> 	- fuzzy
> 	- exact
> 	- regex
> - 配置允许哪些平铺方式(多选)
> 	- 二等分
> 	- 三等分
> 	- 四等分
> 	- ...
> - Footer的actions中每一个action的快捷键
> 
> #### subview
> 
> 默认的module subview
> 
> #### features
> 
> features:
> 1. 搜索window(按照title, app, ...)
> 2. 置顶window(active window)
> 3. 将窗口平铺于...(可以配置不同的布局, grid布局的不同的位置)
> 4. ...(请你帮我思考还有哪些窗口的控制)
> 
> ## 使用逻辑
> 
> 首先, 第一次打开MainWindow(NSPanel, 注意不是MainModule)的时候, 激活MainModule的default feature(设置DataCenter的`activeFeature`), 将焦点自动聚焦在输入框中(执行MainModule自己的逻辑)
> 
> 有两种不同的选择:
> 1. 直接输入文字进行搜索. 具体的搜索逻辑在后续给出
> 	1. 如果选中的是Module, 那么按下回车键, 可以跳转到该Module的subview(在MainModule的feature中展示subview)
> 		1. 跳转到MainModule中的modules feature中(设置`activeFeature`)
> 		2. 根据对应module展示subview, 并执行相关的初始化设置
> 		3. 在这个界面, 搜索module的feature, 或者进行其他的一些内容的设置
> 			1. 可以通过上下键切换
> 			2. 可以搜索feature, 并选中(默认选中第一项)
> 			3. 对于Media controller或者calendar等modules, 可以点击或者执行其他操作, 不仅仅是搜索
> 		4. 默认选中第一个feature
> 		5. 对于分栏展示的Module subview, 使用 tab / shift+tab 切换栏(可以在设置中修改). 
> 			1. 默认选中第一个可选中的控件(按钮, 输入框等), 切换的时候记录之前选中的控件. 当第二次切换回去的时候, 焦点回到记录中的控件上.
> 			2. 使用上下左右键在当前栏中进行切换
> 			3. 这些的实现可能需要一个新的view或者控件或者布局
> 		6. 选中feature之后, 在footer中展示feature可执行的操作
> 	2. 如果选中的是feature, 有两种情况:
> 		1. 按下enter键, 触发return-key的event, 根据event的handler执行操作
> 			- 可能是切换feature(`activeFeature`), 展示该feature的subview并执行初始化
> 			- 可能是直接执行操作, 然后隐藏窗口(不进入subview, 或者该feature不存在subview)
> 		2. 如果是Cmd+enter键, 打开actions的弹窗(上拉框, 详情参考下面给你的raycast的图), 可以搜索actions, 或者直接使用快捷键执行action
> 2. 可以上下键选择, 选择不同的entry. entry由MainModule管理
> 
> 当NSPanel失去焦点的时候, 隐藏面板; 部分action也会隐藏面板
> 
> 搜索逻辑:
> 1. 根据module设置中的设置, 使用fuzzy/exact/regex进行搜索.
> 2. 搜索的内容为prefix和name, 如果settings中有额外配置, 那么按照settings中的配置执行
> 3. 搜索首先关注prefix, prefix需要全字匹配, 如果匹配成功, 那么将结果置顶, 然后是按照匹配准确率进行排序的内容(fuzzy的score, exact/regex的匹配结果, 这样的顺序)
> 	- 注意, prefix可能为空, 此时直接跳过搜索prefix这一步即可
> 4. 注意, 部分module会自己配置可供搜索的内容. 在fuzzy find的时候, Module可能会自定义一个权重, 将不同内容的搜索分数加权平均得到最终的score> 

> [!tip]- requirements
> 
> ## QueryTools 开发需求文档
> 
> 本文档旨在为类似 Raycast/Spotlight 的程序 `QueryTools` 提供一份全面的架构设计和开发需求。
> 
> ### 1. 程序的架构设计
> 
> #### 1.1. 文件架构 (文件夹结构)
> 
> 建议采用以 Swift Packages 为核心的 Monorepo 结构，所有模块和核心组件都作为本地包存在于一个代码仓库中。
> 
> ```plaintext
> QueryTools/
> ├── QueryTools.xcodeproj/         # 主工程文件
> ├── QueryTools/                     # App Target 的主目录
> │   ├── AppDelegate.swift         # App生命周期管理, 全局快捷键, 窗口管理
> │   ├── Assets.xcassets/          # 资源文件
> │   ├── Entitlements/             # 权限配置
> │   ├── Info.plist                # 配置文件
> │   ├── Core/                     # 核心逻辑
> │   │   ├── DataCenter.swift      # Singleton数据中心
> │   │   ├── NotificationManager.swift # 通知名称管理
> │   │   └── Enums.swift           # 全局枚举 (如搜索类型)
> │   └── UI/                       # 主窗口和设置窗口
> │       ├── MainWindow.swift        # NSPanel 的实现和管理
> │       ├── SettingsWindow.swift    # 设置窗口的实现和管理
> │       └── RootView.swift          # App的主SwiftUI视图, 根据DataCenter渲染
> ├── Packages/                       # 所有本地 Swift Packages
> │   ├── ModuleProtocol/             # 模块间交互的协议
> │   │   └── Sources/ModuleProtocol/
> │   │       └── Module.swift        # 定义 Module 和 Feature 协议
> │   ├── SharedUI/                   # 可复用的UI组件
> │   │   └── Sources/SharedUI/
> │   │       ├── KeyboardKeyView.swift
> │   │       ├── SearchBarView.swift
> │   │       ├── FooterView.swift
> │   │       └── ...
> │   ├── MainModule/                 # 主模块 (默认启动)
> │   │   └── Sources/MainModule/
> │   │       └── MainModule.swift
> │   ├── AppSearchModule/            # App搜索模块
> │   ├── CalendarModule/             # 日历模块
> │   ├── CalculatorModule/           # 计算器模块
> │   ├── ClipboardModule/            # 剪贴板模块
> │   ├── FinderModule/               # Finder模块
> │   ├── MediaControlModule/         # 媒体控制模块
> │   ├── SettingsModule/             # 系统设置模块
> │   ├── SystemModule/               # 系统控制模块
> │   ├── TranslateModule/            # 翻译模块
> │   ├── WebBrowserModule/           # 浏览器模块
> │   └── WindowManagerModule/        # 窗口管理模块
> └── README.md
> ```
> 
> -   **`QueryTools/` (App Target)**: 程序入口，负责窗口管理、生命周期、加载所有模块、创建 `DataCenter` 单例。
> -   **`Packages/`**: 包含所有功能模块和共享代码，每个都是独立的 Swift Package。
>     -   **`ModuleProtocol`**: 核心协议包，所有模块都依赖它，定义了模块和功能（Feature）必须实现的接口，实现解耦。
>     -   **`SharedUI`**: 包含跨模块复用的 SwiftUI 组件，如 `SearchBarView`, `FooterView` 等。
>     -   **`[ModuleName]Module/`**: 每个具体功能的实现，完全独立。
> 
> #### 1.2. 程序架构
> 
> -   **继承与协议**:
>     -   程序的核心是 `ModuleProtocol` 包中定义的 `Module` 和 `Feature` 协议。
>     -   所有功能模块（如 `AppSearchModule`）都必须实现 `Module` 协议。
>     -   `Module` 内部管理一个或多个 `Feature`，每个 `Feature` 都实现 `Feature` 协议。
>     -   这种设计使得主程序 `QueryTools` 无需知道任何具体模块的实现细节，只需与 `Module` 协议交互即可。
> 
> -   **模块化设计**:
>     -   每个功能模块都是一个独立的 Swift Package，拥有自己的源文件、资源和逻辑。
>     -   主程序在启动时动态加载所有 `Packages/` 目录下的模块。
>     -   模块之间的依赖关系应严格遵守：`Module -> ModuleProtocol`，`QueryTools -> ModuleProtocol`。模块之间**严禁**相互依赖。
> 
> -   **数据统一管理**:
>     -   所有跨模块共享的状态和数据都由 `DataCenter` 这个 `ObservableObject` 单例统一管理。
>     -   `DataCenter` 通过 SwiftUI 的 `.environmentObject()` 注入到顶层视图中，所有子视图都能访问。
> 
> -   **事件驱动**:
>     -   模块间通信、模块与主程序的通信、UI事件的响应，全部通过 `NotificationCenter` 实现。
>     -   例如，当用户按下回车键，`MainWindow` 会捕获该事件并发送一个 `returnKeyPressed` 通知。所有对此事件感兴趣的模块都可以监听并作出响应。
>     -   定义一个 `NotificationManager.swift` 文件，用静态常量统一定义所有通知的 `Notification.Name`，避免使用魔法字符串。
> 
> #### 1.3. 视图架构
> 
> -   **`MainWindow` (NSPanel)**:
>     -   作为所有模块主视图的容器。
>     -   其内容是一个 `RootView` (SwiftUI)。
>     -   `RootView` 监听 `DataCenter` 中的 `activeFeature` 变量。
>     -   当 `activeFeature` 改变时，`RootView` 会动态地渲染对应 `Feature` 的 `subview`。
>     -   **嵌套关系**: `NSPanel -> NSHostingView -> RootView -> activeFeature.subview`
> 
> -   **`SettingsWindow`**:
>     -   一个标准的 `NSWindow`。
>     -   内容是 `SettingsView` (SwiftUI)。
>     -   `SettingsView` 使用 `NavigationView` 或 `NavigationSplitView` 实现两栏布局。
>         -   左侧栏 (`Sidebar`): 遍历 `DataCenter.allModules`，生成模块列表。
>         -   右侧栏 (`Detail`): 根据左侧选中的模块，显示该模块的 `settingsView`。
>     -   **嵌套关系**: `NSWindow -> NSHostingView -> SettingsView (NavigationSplitView) -> (Sidebar, DetailView -> selectedModule.settingsView)`
> 
> -   **`Actions Panel`**:
>     -   这不是一个独立的窗口，而是一个浮动在 `activeFeature.subview` 上方的 `View`。
>     -   其可见性由 `DataCenter` 的 `isActionsPanelVisible` 变量控制。
> 
> ### 2. 数据流动的设计
> 
> #### 2.1. 数据中心 (Singleton)
> 
> `DataCenter.swift` 文件定义了程序的全局状态。
> 
> ```swift
> import SwiftUI
> import Combine
> 
> final class DataCenter: ObservableObject {
>     static let shared = DataCenter()
> 
>     // MARK: - App State
>     @Published var isMainWindowVisible: Bool = false
>     @Published var isActionsPanelVisible: Bool = false
>     @Published var activeFeature: (any Feature)? = nil // 当前激活的Feature
> 
>     // MARK: - Modules & Features
>     @Published var allModules: [any Module] = [] // 所有加载的模块实例
>     @Published var enabledModuleIDs: [UUID] = [] // 用户启用的模块ID (持久化)
> 
>     // MARK: - Search & Results
>     @Published var currentQuery: String = "" // 当前搜索框的文本
>     @Published var searchResults: [any SearchResultItem] = [] // 主模块的搜索结果
>     @Published var selectedResultIndex: Int = 0 // 当前选中的结果索引
> 
>     private var cancellables = Set<AnyCancellable>()
> 
>     private init() {
>         // 在这里加载所有模块
>         loadModules()
>         // 监听其他模块发来的数据更新请求通知
>         setupSubscribers()
>     }
> 
>     private func loadModules() {
>         // 伪代码: 实际通过某种机制动态加载
>         self.allModules = [
>             MainModule(), AppSearchModule(), CalendarModule(), /* ... */
>         ]
>         // 读取Defaults, 设置activeFeature为MainModule的defaultFeature
>     }
> 
>     private func setupSubscribers() {
>         // 示例：监听切换Feature的通知
>         NotificationCenter.default.publisher(for: .changeActiveFeature)
>             .compactMap { $0.object as? any Feature }
>             .receive(on: DispatchQueue.main)
>             .assign(to: \.activeFeature, on: self)
>             .store(in: &cancellables)
> 
>         // 监听其他所有数据更新通知...
>     }
> }
> 
> // 搜索结果的统一协议
> protocol SearchResultItem: Identifiable {
>     var id: UUID { get }
>     var name: String { get }
>     var icon: Image { get }
>     // ... 其他通用属性
> }
> ```
> 
> #### 2.2. 数据更新流程
> 
> 1.  **触发源**: 用户的操作（如键盘输入）、模块的后台任务（如剪贴板轮询）、系统事件。
> 2.  **发送通知**: 触发源通过 `NotificationCenter.default.post()` 发送一个通知，通知的 `name` 在 `NotificationManager` 中预定义，`object` 或 `userInfo` 中携带需要更新的数据。
>     *   *示例*: 用户选中一个 App 并按下回车，`AppSearchModule` 发送通知 `NotificationCenter.default.post(name: .hideMainWindow, object: nil)`。
> 3.  **数据中心处理**: `DataCenter` 在 `setupSubscribers()` 方法中监听所有相关的通知。当收到通知时，它会执行对应的逻辑来更新自己的 `@Published` 属性。
> 4.  **UI 热更新**:
>     -   由于 SwiftUI 视图通过 `.environmentObject(DataCenter.shared)` 注入了数据中心实例。
>     -   当 `DataCenter` 中任何一个 `@Published` 属性发生变化时，所有依赖该属性的 SwiftUI 视图都会自动重新渲染。
>     -   *示例*: `DataCenter` 更新了 `activeFeature`，`RootView` 检测到变化，立即丢弃旧的 `subview` 并渲染新的 `activeFeature.subview`。
> 
> #### 2.3. 数据中心管理的全局数据
> 
> | 变量名 | 类型 | @Published | 作用 |
> | :--- | :--- | :---: | :--- |
> | `isMainWindowVisible` | `Bool` | ✅ | 控制主窗口 (NSPanel) 的显示和隐藏。 |
> | `isActionsPanelVisible` | `Bool` | ✅ | 控制当前 Feature 的 Actions 浮层是否显示。 |
> | `activeFeature` | `(any Feature)?` | ✅ | 当前正在主窗口中展示的 Feature。UI渲染的核心驱动。 |
> | `allModules` | `[any Module]` | ✅ | 程序启动时加载的所有模块实例。用于设置界面等。 |
> | `enabledModuleIDs` | `[UUID]` | ✅ | 持久化的用户启用的模块ID列表。 |
> | `modulePriorities` | `[UUID]` | ✅ | 持久化的模块排序列表。 |
> | `currentQuery` | `String` | ✅ | 搜索框的当前文本，用于驱动搜索。 |
> | `searchResults` | `[any SearchResultItem]` | ✅ | 主模块（MainModule）的搜索结果列表。 |
> | `selectedResultIndex` | `Int` | ✅ | `searchResults` 中当前高亮选中的项目索引。 |
> | `lastActiveWindowID` | `Any?` | ❌ | （非Published）记录主窗口激活前的前台窗口句柄。 |
> 
> ### 3. 需求设计
> 
> #### 3.1. 文件依赖关系
> 
> -   **`QueryTools` (App Target)**:
>     -   依赖 `ModuleProtocol` 来与模块交互。
>     -   依赖所有具体的 `[ModuleName]Module` 包，以便在 `DataCenter` 中实例化它们。
>     -   依赖 `SharedUI` 来使用通用组件。
> -   **`ModuleProtocol` (Package)**:
>     -   无外部依赖。是依赖链的根基。
> -   **`SharedUI` (Package)**:
>     -   可能依赖 `ModuleProtocol` (例如，Footer需要显示Module信息)。
> -   **`[ModuleName]Module` (Package)**:
>     -   必须依赖 `ModuleProtocol`。
>     -   可以依赖 `SharedUI`。
>     -   **严禁**依赖 `QueryTools` App Target。
>     -   **严禁**依赖其他 `[ModuleName]Module`。
> 
> 这种设计保证了模块的独立性和可移植性。
> 
> #### 3.2. 各文件/模块实现内容
> 
> ##### `ModuleProtocol` (Package)
> 
> ```swift
> import SwiftUI
> 
> public protocol Module {
>     var id: UUID { get }
>     var name: String { get }
>     var icon: Image { get }
>     var prefix: String? { get }
>     var features: [any Feature] { get }
>     var actions: [any Action] { get }
>     var subview: AnyView { get }
>     var settingsView: AnyView { get }
> }
> 
> public protocol Feature {
>     var id: UUID { get }
>     var name: String { get }
>     var prefix: String? { get }
>     var actions: [any Action] { get }
>     var subview: AnyView { get }
> }
> 
> public protocol Action {
>     var name: String { get }
>     var shortcut: KeyEquivalent? { get } // 用于显示
>     func perform()
> }
> 
> // 默认实现，简化模块开发
> public extension Module {
>     var subview: AnyView { AnyView(EmptyView()) } // 默认无subview
>     // ... 其他默认实现
> }
> ```
> 
> ##### `QueryTools` (App Target)
> 
> -   **`AppDelegate.swift`**:
>     -   注册和管理 `KeyboardShortcuts` 的全局快捷键。
>     -   初始化 `Sparkle` 进行软件更新。
>     -   配置 `LaunchAtLogin`。
>     -   拦截 `applicationShouldTerminate` 事件，改为隐藏窗口。
> -   **`MainWindow.swift`**:
>     -   创建 `NSPanel` 并设置样式（无边框, `nonactivatingPanel`）。
>     -   实现 `becomesKey` 和 `resignsKey` 来处理焦点变化，并发送 `mainWindowDidShow`/`mainWindowDidHide` 通知。
>     -   重写 `keyDown(with:)` 方法，捕获键盘事件，检查输入法状态 (`hasMarkedText`)，然后发送相应的键盘事件通知 (如 `.upArrowKeyPressed`)。
>     -   在显示前回获取当前活动窗口的引用。
> -   **`SettingsWindow.swift`**:
>     -   创建 `NSWindow` 并设置液态玻璃效果 (`Vibrant` material)。
>     -   加载 `SettingsView` 作为其 `contentView`。
> -   **`DataCenter.swift`**:
>     -   实现上述“数据中心”一节的所有功能。
>     -   负责在 `init` 中加载所有模块。
> -   **`RootView.swift`**:
>     -   使用 `@EnvironmentObject var dataCenter: DataCenter` 获取全局状态。
>     -   根据 `dataCenter.activeFeature` 来渲染 `activeFeature.subview`。
>     -   包裹在 ZStack 中，以便于在上层渲染 `Actions Panel` 等浮动视图。
> 
> ##### `SharedUI` (Package)
> 
> -   **`SearchBarView.swift`**:
>     -   接收 `Binding<String>` 用于文本输入。
>     -   接收 `placeholder: String`。
>     -   接收可选的 `onBack: (() -> Void)?`，如果提供，则显示左侧返回按钮。
>     -   接收可选的 `dropdownContent: () -> some View`，如果提供，则显示右侧下拉框。
>     -   内部管理 `TextField` 的焦点。
> -   **`FooterView.swift`**:
>     -   接收 `module: Module` 和 `feature: Feature` 来显示左侧信息。
>     -   接收 `returnAction: Action` 和 `otherActions: [Action]` 来构建右侧按钮。
> -   **`KeyboardKeyView.swift`**:
>     -   接收 `key: String` 或 `modifier: NSEvent.ModifierFlags` 来显示键盘按键的玻璃效果UI。
> 
> ##### `MainModule` (Package)
> 
> -   **`MainModule.swift`**:
>     -   实现 `Module` 协议。
>     -   提供 `GeneralSettings` 的 `settingsView`。
>     -   管理两个 `Feature`：`defaultFeature` 和 `moduleFeature`。
> -   **`DefaultFeature.swift`**:
>     -   `subview` 包含 `SearchBar` 和搜索结果列表 `ContentView`。
>     -   `SearchBar` 的下拉框内容为所有已启用的模块。
>     -   `ContentView` 根据 `DataCenter.searchResults` 渲染列表，每个结果是一个 section。
> -   **`ModuleFeature.swift`**:
>     -   这是一个特殊的 “宿主” Feature。
>     -   它的 `subview` 会动态地从一个变量（可能需要扩展 `DataCenter` 或通过通知传递）中获取要展示的 `Module.subview` 并渲染它。当用户从主搜索列表选择一个模块时，`activeFeature` 会切换到 `MainModule` 的 `moduleFeature`，同时需要告知它应该渲染哪个模块的 `subview`。
> 
> ---
> 
> ##### 对其他模块的概要设计
> 
> 篇幅所限，这里对部分模块进行关键点设计说明。
> 
> -   **App Search Module**:
>     -   `AppScanner.swift`: 使用 `NSMetadataQuery` 或用户提供的 `scanApplications` 方法来异步搜索应用。使用 `FilePresenter` 或 `FSEvents` 来监听 `/Applications` 目录的变化，实现应用的动态增删。
>     -   `AppFeature.swift`: 每个 App 实例就是一个 `Feature`。`id` 为 `bundleIdentifier`。`subview` 为 `EmptyView()`，因为它的主要操作（打开）会隐藏主窗口。
>     -   `actions`: 实现“在Finder中打开”、“复制路径”等功能。
> 
> -   **Calendar Module**:
>     -   **无 `Feature`**: 这个模块不提供传统的 `Feature` 列表。它的 `subview` 就是其核心功能。
>     -   **`EventKit` 集成**: 使用 `EventKit` 框架来请求访问权限并读取用户的提醒事项。
>     -   **`CalendarView.swift`**: 自定义日历视图。可以使用 `Calendar` 和 `DateComponents` 生成月份网格。使用 `@State` 或 `@Binding` 跟踪选中的日期。
>     -   **`TodoListView.swift`**: 根据选中的日期，过滤并显示当天的提醒事项。
>     -   **`AddTodoView.swift`**: 一个浮动在 `subview` 之上的视图，用于创建新的提醒事项。
> 
> -   **Clipboard Module**:
>     -   **`ClipboardManager.swift`**: 使用 `Timer` 定时轮询 `NSPasteboard`。当检测到变化时，读取数据并存入 `SQLite` 数据库。
>     -   **`DatabaseManager.swift`**: 使用 `GRDB.swift` 或 `SQLite.swift` 库来封装数据库的增删改查操作。
>     -   **`ClipboardSubView.swift`**: 使用 `NavigationSplitView` 实现两栏布局。左侧是历史记录列表，右侧是选中项的详情预览。`NSTextView` 用于文本，`NSImageView` 用于图片，`QLPreviewView` 可用于文件预览。
> 
> -   **System Module**:
>     -   `Feature` 列表:
>         -   **亮度控制**: 需要与 `CoreDisplay` 框架交互，这可能需要一些私有 API 或第三方库来实现对外接显示器的控制。
>         -   **音量控制**: 使用 `CoreAudio` 来控制系统音量和切换设备。
>         -   **其他建议**:
>             -   切换深色/浅色模式 (AppleScript 或 `Defaults` 命令)。
>             -   清空废纸篓 (AppleScript)。
>             -   弹出所有磁盘。
>             -   触发截图/录屏。
>             -   休眠/重启/关机。
>             -   切换 Wi-Fi / 蓝牙。
> 
> -   **Window Manager Module**:
>     -   **`Accessibility API`**: 核心技术。需要请求系统的辅助功能权限来获取和修改窗口的位置和大小。
>     -   `AXUIElement` 是与窗口交互的关键对象。
>     -   `Feature` 列表:
>         -   **搜索窗口**: 遍历所有正在运行的应用 (`NSRunningApplication`) 及其拥有的窗口，根据标题进行匹配。
>         -   **平铺窗口**: 计算目标屏幕的 frame，然后根据预设的布局（如左半屏 `CGRect(x: 0, y: 0, width: screen.width / 2, height: screen.height)`）来设置窗口的 `kAXPositionAttribute` 和 `kAXSizeAttribute`。
>         -   **其他建议**:
>             -   移动窗口到下一个/上一个显示器。
>             -   最大化窗口。
>             -   居中窗口。
>             -   将窗口移动到屏幕四角。

