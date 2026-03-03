---
type: project
tags:
  - obsidian
  - code/javascript
done: true
rate: 🌟🌟🌟
---
## Better Link Clicker

[git](https://github.com)

使用[[Obsidian]]的[[Typescript]] API 进行开发, 使用[[Pnpm]]构建
### 环境搭建与项目初始化
- [x] 确保已安装 `Node.js` 和 `npm`。
- [x] 使用 Obsidian 官方提供的插件模板仓库创建一个新的插件项目。
- [x] 在本地克隆你的插件仓库。
- [x] 进入项目目录，运行 `npm install` 安装所需的依赖（如 Obsidian API 的 TypeScript 类型定义）。
- [x] 运行 `npm run dev` 编译插件，并准备在 Obsidian 中进行测试。
- [x] 在你的 Obsidian Vault 的 `.obsidian/plugins` 目录下创建插件文件夹，并将编译好的 `main.js`, `manifest.json`, `styles.css` 文件放入其中。
- [x] 在 Obsidian 的设置中启用该插件以进行调试。

### 核心功能：拦截并处理链接点击事件
- [x] 在 `main.ts` 的 `onload` 方法中，使用 `this.registerDomEvent` 来监听整个工作区 (`document`) 的点击事件。
- [x] 在事件回调函数中，检查被点击的元素或其父元素是否为内部链接。
	- [x] 调研并确定需要处理的所有内部链接相关的 CSS class (例如, `cm-hmd-internal-link`, `is-unresolved`)。
- [x] 在回调函数中，判断 `event.ctrlKey` (对于 Windows/Linux) 或 `event.metaKey` (对于 macOS) 是否被按下。
- [x] **实现 Ctrl/Cmd + 点击逻辑**:
	- [x] 如果 Ctrl/Cmd 被按下，则允许默认的跳转行为。
- [x] **实现直接点击逻辑**:
	- [x] 如果 Ctrl/Cmd 没有被按下，调用 `event.preventDefault()` 来阻止 Obsidian 默认的跳转行为。
	- [x] 实现“编辑链接”的功能。这可能需要将光标定位到链接文本处，这部分可能需要进一步研究 API 来实现精确的光标控制。

### 处理不存在的笔记
- [x] 当用户通过 Ctrl/Cmd + 点击一个链接时，首先获取链接指向的笔记路径。
- [x] 直接判断是否有`span.is-unresolved`的HTML元素来判断文件是否存在。
- [x] **如果文件不存在**:
	- [x] 检查设置中是否允许弹出创建对话框。
	- [x] 如果允许，则创建一个自定义的 `Modal` 弹窗，询问用户是否要创建该文件。
	- [x] 在 Modal 中提供“创建”和“取消”按钮。
	- [x] 如果用户点击“创建”，使用 `this.app.vault.create(filePath, '')` 创建一个新的空文件。
	- [x] 文件创建成功后，使用 `this.app.workspace.getLead("tab").openFile(newFile)` 跳转到新创建的笔记。
- [x] **如果文件存在**:
	- [x] 不阻止, 由obsidian自行处理。

### 开发设置界面
- [x] 创建一个新的 `SettingTab` 子类。
- [x] 在 `main.ts` 中定义一个接口 (interface) 来描述插件的设置数据结构，例如 `interface MyPluginSettings { confirmCreateFile: boolean; }`。
- [x] 实现 `loadSettings` 和 `saveSettings` 方法来加载和保存插件的配置。
- [x] 在 `SettingTab` 的 `display` 方法中，使用 `new Setting(containerEl)` 来添加设置项。
- [x] 添加一个开关 (`addToggle`) 组件，用于控制是否在链接到不存在的笔记时弹出创建文件的确认对话框。
- [x] 将开关组件的值与设置对象中的 `confirmCreateFile` 属性绑定。当开关状态改变时，更新设置对象并调用 `saveSettings`。
- [x] 在 `onload` 方法中，通过 `this.addSettingTab(new MySettingTab(this.app, this))` 来注册设置页面。

### 完善与发布
- [x] 在不同的视图模式（实时预览、源码模式、阅读模式）下全面测试插件功能。
- [x] 确保在 Windows 和 macOS 系统上，Ctrl 和 Cmd 键的逻辑都能正常工作。
- [x] 编写插件的 `README.md` 文件，清晰地说明插件的功能和使用方法。
- [x] 根据 Obsidian 社区的要求，更新 `manifest.json` 中的版本号和信息，准备发布。
- [x] 通过[[Git Push|git 上传]]到远程仓库
- [x] 通过[[Git PullRequest|Github PR]]创建要求更新official formu

## Refactor

- [x] 使用LinkCache进行重建
	- [x] 使用CodeMirror 6获取当前pos
	- [x] 遍历LinkCache, 根据pos判断点击的是否是Link, 是哪一个Link
	- [x] 获取Link的原始信息
	- [x] 根据原始信息解析需要创建的文件位置

# Rebuild

这个插件的核心在于拦截点击事件并根据配置决定跳转、创建或移动光标。大致逻辑可分为几个步骤：

1. **监听点击**
    
    - 注册一个 `click` DOM 事件，捕获所有页面上的鼠标点击，并在处理函数 `handleLinkClick` 中执行后续逻辑。
2. **定位链接**
    
    - 获取当前激活的 Markdown 视图和编辑器。
    - 利用编辑器的 `posAtCoords` 方法把点击坐标转换成文档偏移，再转换为行/列位置。
    - 从元数据缓存中检索所有链接和嵌入（`fileCache.links`、`fileCache.embeds`），循环检查被点击位置是否落在某个链接的范围内。
3. **处理点击**
    
    - 分析按键修饰符（`Keymap.isModEvent`）决定打开目标的位置（新标签、窗口等）以及是否 “跳转”。
    - 如果当前是实时预览模式并且光标已经在链接内，只更新光标位置而不跳转。
    - 根据配置 `jumpOnlyWithModifier` 与平台按键决定是否允许跳转，否则仅将光标移到链接起点。
4. **解析目标**
    
    - 提取链接的基本目标（去掉别名和锚点）。
    - 尝试通过 `metadataCache.getFirstLinkpathDest` 查找已存在的文件。
        - 若存在则直接调用 `workspace.openLinkText` 以合适的目标打开。
    - 若目标文件不存在，则调用 `buildNewFilePath` 按 vault 的 `newFileLocation` 配置生成新路径。
5. **创建 / 打开新文件**
    
    - 根据设置决定是否弹出确认模态框。
    - 使用 `vault.create` 创建空文件，并在指定 leaf（标签/窗口）中打开。
6. **辅助函数**
    
    - 若跳转被禁止或光标需调整，`moveCursorToLinkStart` 将编辑器光标置于链接起始位置。
    - `isCursorInsideLink` 用于检测当前光标是否在链接范围内（查询后避免不必要跳转）。

方法上主要用到的是 Obsidian 的 API（`app.workspace`、`metadataCache`、`vault` 等）、TypeScript 类型保护、字符串处理以及事件/键盘修饰符的判断，形成了一套点击链接时智能跳转或创建文件的功能流程。