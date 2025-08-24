---
type: project
tags:
  - swift
  - app
  - GUI
  - MacOS
done: false
---
# 项目实施细则：QueryTools

使用[[Xcode]]进行开发

## Phase 1: 核心架构与基础建设

- **项目初始化**
    - [ ] 创建主 `QueryTools` App 项目 (使用 SwiftUI App Life Cycle)。
    - [ ] 初始化 Git 仓库。
    - [ ] 创建 Swift Packages 目录结构，用于存放本地的 `protocol` 和 `modules`。

- **定义核心协议 (`Protocol` Swift Package)**
    - [ ] 创建一个名为 `QueryToolsCore` 或类似名称的本地 Swift Package。
    - [ ] **`Module.swift`**: 定义 `Module` protocol。
        - [ ] `var id: UUID { get }`: 模块唯一标识。
        - [ ] `var name: String { get }`: 模块名称。
        - [ ] `var icon: Image { get }`: 模块图标。
        - [ ] `var subviews: [ModuleSubview] { get }`: 模块提供的子视图（功能入口）。
        - [ ] `var settingsView: any View { get }`: 模块的设置视图。
        - [ ] `func activate()`: 模块激活时的回调。
        - [ ] `func deactivate()`: 模块禁用时的回调。
    - [ ] **`ModuleSubview.swift`**: 定义子视图协议/结构体。
        - [ ] `var name: String`: 子视图名称。
        - [ ] `var view: any View`: 具体的 SwiftUI View。
        - [ ] `var keywords: [String]`: 用于在主视图中被搜索的关键字。
    - [ ] **`Action.swift`**: 定义 `Action` 结构体，用于Footer。
        - [ ] `var name: String`: Action 名称。
        - [ ] `var shortcut: KeyboardShortcuts.Name?`: 快捷键。
        - [ ] `var perform: () -> Void`: 执行的闭包。

- **核心框架 (`Core` App Target)**
    - [ ] **`App.swift`**:
        - [ ] 程序主入口，设置 `NSApplicationDelegateAdaptor`。
        - [ ] 初始化 `Sparkle` for updates。
        - [ ] 初始化 `LaunchAtLogin`。
    - [ ] **`AppDelegate.swift`**:
        - [ ] 实现 `applicationDidFinishLaunching` 来进行初始化设置。
        - [ ] 实现 `applicationShouldHandleReopen` 来重新显示窗口。
        - [ ] 拦截 `Cmd+Q` ( `applicationShouldTerminate` )，改为隐藏窗口。
    - [ ] **`GlobalDataManager.swift`**:
        - [ ] 创建 `GlobalDataManager` 为 `ObservableObject` 单例。
        - [ ] `@Published var currentQuery: String`: 当前搜索内容。
        - [ ] `@Published private(set) var queryResults: [Any]`: 搜索结果。
        - [ ] `@Published var activeModule: Module?`: 当前激活的模块。
        - [ ] `@Published var selectedIndex: Int`: 当前选中的结果索引。
        - [ ] `func setSearchResults(_ results: [Any])`: 设置搜索结果的公共接口。
    - [ ] **`EventBus.swift`**:
        - [ ] 使用 `NotificationCenter.Name` 扩展，定义所有全局事件。
        - [ ] `static let escapeKeyPressed`, `static let returnKeyPressed`, `static let arrowUp`, `static let settingsUpdated`, 等。
    - [ ] **`ModuleLoader.swift`**:
        - [ ] 负责发现、加载和管理所有启用的 `Module` 实例。
        - [ ] 提供 `enabledModules: [Module]` 和 `allModules: [Module]` 属性。
        - [ ] 监听 `Defaults` 中模块启用状态的变更，动态加载/卸载模块。

- **窗口管理**
    - [ ] **`SearchWindowManager.swift`**:
        - [ ] 创建和管理 `SearchWindow` (`NSPanel`)。
        - [ ] 实现 `NSWindowDelegate`。
        - [ ] `windowDidResignKey`: 失去焦点时自动隐藏。
        - [ ] 配置窗口样式: `.borderless`, `.fullSizeContentView`, `.nonactivatingPanel`。
        - [ ] `showWindow()`: 显示窗口并记录之前的窗口焦点信息。
        - [ ] `hideWindow()`: 隐藏窗口。
    - [ ] **`SearchWindowView.swift`**:
        - [ ] 作为 `NSPanel` 的 `contentView`。
        - [ ] 监听 `cancelOperation(_:)` 来发布 `escapeKeyPressed` 事件。
        - [ ] 注入 `GlobalDataManager` 实例。
        - [ ] 根据 `activeModule` 动态展示 `MainView` 或模块的 `subview`。
    - [ ] **`SettingsWindowManager.swift`**:
        - [ ] 创建和管理 `SettingsWindow` (`NSWindow`)。
    - [ ] **`SettingsWindowView.swift`**:
        - [ ] 实现双栏布局 ( `NavigationView` 或 `HSplitView` )。
        - [ ] 左侧导航栏展示 `ModuleLoader.allModules` 列表。
        - [ ] 右侧根据选择展示对应 `module.settingsView`。
        - [ ] 应用玻璃效果 ( `VisualEffectView` ) 并调整模糊和透明度。

## Phase 2: 通用UI组件与依赖集成

- **集成第三方Packages**
    - [ ] `swift package add` 所有在需求中提到的依赖：Sauce, KeyboardShortcuts, Defaults, LaunchAtLogin, Sparkle。

- **创建 `CommonUI` Swift Package**
    - [ ] **`KeyboardKeyView.swift`**:
        - [ ] 创建一个展示单个按键的 `View`。
        - [ ] Props: `key: KeyCode?`, `modifier: NSEvent.ModifierFlags?`, `width: CGFloat`。
        - [ ] 实现玻璃背景效果 ( `ZStack` + `VisualEffectView` )。
        - [ ] 根据是 modifier 还是 key 显示 SF Symbol 或大写字母。
    - [ ] **`SearchBarView.swift`**:
        - [ ] 创建一个通用的 `View`。
        - [ ] `Binding<String>` 绑定搜索文本。
        - [ ] Props: `placeholder: String`, `showBackButton: Bool`, `showDropdown: Bool`。
        - [ ] `onCommit: () -> Void` 用于 `Return` 键。
        - [ ] `onBack: () -> Void` 用于返回按钮。
        - [ ] 实现 `TextField` 焦点持久化逻辑 (使用 `@FocusState` 和 `.onChange`)。
    - [ ] **`FooterView.swift`**:
        - [ ] 创建一个通用的 `View`。
        - [ ] Props: `moduleIcon: Image`, `moduleName: String`, `returnAction: Action`, `otherActions: [Action]`。
        - [ ] 实现左中右三段式布局。
        - [ ] 实现右侧 "Actions" 按钮的弹窗逻辑 (`.popover` or `.sheet`)。
    - [ ] **`ActionsPopupView.swift`**:
        - [ ] "Actions" 弹窗的 `View`。
        - [ ] 包含一个搜索框和 `List` 展示所有 `actions`。
        - [ ] 实现搜索过滤功能。
        - [ ] 实现焦点自动转移到搜索框。

## Phase 3: 主视图与模块化实现

- **`MainView` (在 Core App Target 中)**
    - [ ] **`GeneralSettingsView.swift`**:
        - [ ] 实现通用设置界面。
        - [ ] `KeyboardShortcuts.Recorder` 用于录制全局快捷键。
        - [ ] Picker 用于选择搜索模式。
        - [ ] Slider/Stepper 用于设置 debounce duration。
        - [ ] 列表和 Toggle 用于启用/禁用模块和调整优先级。
        - [ ] 所有设置都通过 `Defaults` 持久化。
    - [ ] **`MainModuleView.swift`**:
        - [ ] 实现主搜索界面的 `View`。
        - [ ] 包含 `SearchBarView`。
        - [ ] `ContentView`:
            -   当 `currentQuery` 为空时，展示所有已激活模块的 `subview` 入口，按模块 `section` 分组。
            -   当 `currentQuery` 不为空时，对所有模块及其 `subview` 的 `keywords` 进行匹配，展示匹配结果。

- **模块: `AppSearch`**
    - [ ] 创建 `AppSearchModule` Swift Package。
    - [ ] **`AppSearchModule.swift`**: 实现 `Module` 协议。
    - [ ] **`Logic/AppSearcher.swift`**:
        - [ ] 使用 `NSMetadataQuery` 搜索 `kMDItemContentType == "com.apple.application-bundle"`。
        - [ ] 支持对 `kMDItemDisplayName` 和 `kMDItemAlternativeNames` 的搜索。
        - [ ] 实现 fuzzy, exact, regex 搜索逻辑。
    - [ ] **`Views/AppSearchView.swift`**:
        - [ ] 包含 `SearchBarView`。
        - [ ] 上半部分展示最近使用的 App (可通过 `NSWorkspace.shared.runningApplications` 获取)。
        - [ ] 下半部分 `List` / `Grid` 展示搜索结果，按 Category 分组。
        - [ ] 每个 App Item 展示 Icon 和 Display Name。
    - [ ] **`Views/AppSearchSettingsView.swift`**:
        - [ ] 设置搜索方式、最近使用App数量等。
    - [ ] **`Data/AppSearchActions.swift`**:
        - [ ] 定义 "打开", "在Finder中显示", "复制名称", "复制路径" 等 `Action`。

- **模块: `Clipboard`**
    - [ ] 创建 `ClipboardModule` Swift Package。
    - [ ] **`Database/ClipboardManager.swift`**:
        - [ ] 使用 `GRDB.swift` 或 `CoreData` 封装 SQLite 数据库。
        - [ ] 定义 `ClipboardItem` 数据模型 (id, content_type, data, source_app, created_at, last_used_at, copy_count)。
        - [ ] 实现增删改查方法。
    - [ ] **`Logic/PasteboardObserver.swift`**:
        - [ ] 使用 `Timer` 轮询 `NSPasteboard`。
        - [ ] 检查 `changeCount`，当变化时读取内容并存入数据库。
        - [ ] 处理不同类型：`String`, `NSImage`, `NSFilePromiseReceiver`。
    - [ ] **`Views/ClipboardHistoryView.swift`**:
        - [ ] 实现双栏布局。
        - [ ] 左侧 `List` 展示 item 预览 (来源App Icon, 预览文本/缩略图, 时间, 次数)。
        - [ ] 右侧 `DetailView` 展示选中 item 的完整内容。
    - [ ] **`Views/ClipboardSettingsView.swift`**:
        - [ ] 设置轮询时间、搜索方式、排序方式、要记录的数据类型。

- **模块: `Calendar`**
    - [ ] 创建 `CalendarModule` Swift Package。
    - [ ] **`Logic/ReminderManager.swift`**:
        - [ ] 使用 `EventKit` 与提醒事项.app交互。
        - [ ] 实现请求授权的逻辑。
        - [ ] API: `fetchReminders(from:to:)`, `addReminder()`, `updateReminder()`, `completeReminder()`, `deleteReminder()`。
    - [ ] **`Views/CalendarView.swift`**:
        - [ ] 使用 `LazyVGrid` 绘制日历网格。
        - [ ] 在每个日期格内，垂直排列从 `ReminderManager` 获取的提醒事项。
        - [ ] 使用提醒事项分类的颜色作为背景。
    - [ ] **`Views/AddEditReminderView.swift`**:
        - [ ] 创建一个表单 `Form` 用于添加/编辑提醒事项，包含标题、备注、日期、分类等。
    - [ ] **`Data/CalendarActions.swift`**: 定义 "完成", "删除", "编辑" 等 `Action`。

- **模块: `Calculator`**
    - [ ] 创建 `CalculatorModule` Swift Package。
    - [ ] **`Logic/ExpressionEvaluator.swift`**:
        - [ ] 封装 `NSExpression`。
        - [ ] 扩展 `NSExpression` 或预处理字符串以支持 `^` (替换为 `**`) 和 `sqrt` 等。
        - [ ] 实现布尔运算的解析。
    - [ ] **`Views/CalculatorView.swift`**:
        - [ ] 输入为空时展示帮助信息。
        - [ ] 输入有效时实时计算并显示结果。
        - [ ] 捕获 `NSExpression` 的异常并显示错误信息。
    - [ ] **`Views/UnitConverterView.swift`**:
        - [ ] (研究) 寻找一个合适的 Swift 单位转换库，或使用 `Foundation.Measurement`。
        - [ ] 实现输入解析和转换逻辑。
        - [ ] 展示帮助界面。

- **模块: `Finder`**
    - [ ] 创建 `FinderModule` Swift Package。
    - [ ] **`Logic/FileManager.swift`**:
        - [ ] 类似 `AppSearcher`, 使用 `NSMetadataQuery` 搜索文件。
        - [ ] 实现按范围搜索 (This Mac, User)。
    - [ ] **`Views/FileSearchView.swift`**:
        - [ ] 双栏布局。
        - [ ] 左侧展示最近文件（可使用 `NSDocumentController.shared.recentDocumentURLs`）。
        - [ ] 右侧展示选中文件的预览 (使用 `QuickLook` or `QLPreviewView`) 和元数据。

- **模块: `System`**
    - [ ] 创建 `SystemModule` Swift Package。
    - [ ] **`Logic/SystemManager.swift`**:
        - [ ] 音量控制: 使用 `CoreAudio`。
        - [ ] 亮度控制: 搜索外部显示器控制库，如 `DDC.swift`。
        - [ ] 系统操作: 使用 `AppleScript` 或 `NSAppleScript` 执行 "sleep", "restart", "shutdown", "toggle dark mode" 等。
        - [ ] 补充功能：切换 Do Not Disturb, Eject all disks。
    - [ ] **`Views/VolumeControlView.swift`**, **`Views/BrightnessControlView.swift`**, 等。

- **模块: `WindowManager`**
    - [ ] 创建 `WindowManager` Swift Package。
    - [ ] **`Logic/WindowAccessibilityManager.swift`**:
        - [ ] 使用 `Accessibility API` (`AXUIElement`) 获取所有窗口信息 (app, title)。
        - [ ] 实现 API: `listWindows()`, `setWindowFrame()`, `bringToFront()`, `togglePinToTop()`。
    - [ ] **`Views/WindowSearchView.swift`**:
        - [ ] 列表展示所有可管理的窗口。
        - [ ] 提供搜索功能。
    - [ ] **`Data/WindowActions.swift`**:
        - [ ] 补充功能: 最小化、最大化、居中、移动到下一个显示器。
        - [ ] 实现不同 grid 布局的 `Action` (左半屏、右半屏、上四分之一等)。

- **其他模块 (Translate, Web Browser, Settings)**
    - [ ] 按照上述模板，为剩下的模块创建 Swift Package 并实现各自的功能。
    - [ ] `Translate`: 研究调用 Dictionary.app 的方法 (URL Scheme 或 AppleScript)；翻译功能需要寻找第三方 API。
    - [ ] `Web Browser`: 读取 Safari 历史和书签需要访问 `~/Library/Safari` 下的数据库文件，需要处理沙盒和权限问题。
    - [ ] `Settings`: 研究打开特定系统设置面板的 URL Schemes (`x-apple.systempreferences:com.apple.preference.network`)。

## Phase 4: 集成、测试与发布

- **集成**
    - [ ] 在主项目中引入所有本地 Module Packages。
    - [ ] 在 `ModuleLoader` 中注册所有模块。
    - [ ] 确保 `MainView` 和 `SettingsWindowView` 能正确地展示和交互所有模块内容。
- **测试**
    - [ ] 对每个模块进行单元测试和UI测试。
    - [ ] 测试全局快捷键的响应。
    - [ ] 测试窗口的显示、隐藏和焦点管理。
    - [ ] 测试设置的持久化和热更新。
- **打包与发布**
    - [ ] 配置 App Icon。
    - [ ] 配置 Sparkle 的 Appcast URL。
    - [ ] Archive 项目并进行公证 (Notarization)。
    - [ ] 创建发布页面和更新日志。