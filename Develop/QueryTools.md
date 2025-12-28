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

其中, protocol, plugins, app都可能会需要用到package dependencies,如Defaults, KeyboardShortcuts, Sauce, Expression等. 注意不要造成重复依赖.

### File Architecture

```
QueryToolsWorkspace (not project)
|-- Cores (not project)
|------ ... (files in ModuleProtocol)
|---- MainModule (project)
|------ ... (module implementation)
|-- Frameworks (not project)
|---- Defaults.framework (all dependencies built by self, and copy to here)
|------ ...
|---- ModuleProtocol.framework (Product after build)
|------ ...
|---- MainModule.framework
|------ ...
|-- QueryTools (project, main entry)
|---- ... (files in main app)
```

ModuleProtocol, 每一个module, QueryTools程序主入口, 这些project之间相互完全不知道. QueryTools会搜索Libs中的所有`.framework` (当release的时候换一个位置, 换成`QueryTools.app`这个app文件夹内部的一个路径), 并自动加载Frameworks中的所有内容.

在Release的时候, 有一个设置界面, 会给出所有的可用的Module. 可以选择某一个module, 然后app会自动从网络中下载该module编译之后的`.framework`文件到module加载目录, 并且调用函数load这个module

### Dependencies

- [Defaults](https://github.com/sindresorhus/Defaults): 持久化
- [KeyboardShortcuts](https://github.com/sindresorhus/KeyboardShortcuts): 快捷键, 全局快捷键
- [Sauce](https://github.com/Clipy/Sauce): 适配不同的Keyboard的keycode
- [Sparkle](https://github.com/sparkle-project/Sparkle): 更新
- [LaunchAtLogin](https://github.com/sindresorhus/LaunchAtLogin-Modern): 配置 开机启动
- [SwiftyBeaver](https://github.com/SwiftyBeaver/SwiftyBeaver): 美化log输出, 配置release时的log file

部分在ModuleProtocol,Modules和App主体中都用到的依赖使用脚本构建:
> [!info]- build shell
> ```shell
> #!/bin/bash
> 
> # ==============================================================================
> # 配置区域
> # ==============================================================================
> BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
> SOURCES_DIR="$BASE_DIR/Packages"
> OUTPUT_DIR="$BASE_DIR/Frameworks"
> TEMP_BUILD_DIR="$BASE_DIR/TempBuild"
> 
> # 清理旧的构建产物
> rm -rf "$OUTPUT_DIR"
> rm -rf "$TEMP_BUILD_DIR"
> mkdir -p "$OUTPUT_DIR"
> mkdir -p "$TEMP_BUILD_DIR"
> 
> echo "📂 工作目录: $BASE_DIR"
> echo "🚀 开始构建流程..."
> 
> # ==============================================================================
> # 构建函数
> # ==============================================================================
> build_package() {
>     LIB_NAME=$1
>     SCHEME_NAME=$2
> 
>     # 统一使用 NO，依靠后续的手动 Patch 解决 Module 问题。
>     # 这样兼容性最好，不会报 Library Evolution 错误。
>     USE_DISTRIBUTION=${3:-NO}
> 
>     PKG_PATH="$SOURCES_DIR/$LIB_NAME"
>     LIB_DERIVED_DATA="$TEMP_BUILD_DIR/$LIB_NAME"
> 
>     echo ""
>     echo "----------------------------------------------------"
>     echo "📦 正在构建: $LIB_NAME"
>     echo "----------------------------------------------------"
> 
>     if [ ! -d "$PKG_PATH" ]; then
>         echo "❌ 错误: 找不到源码目录 $PKG_PATH"
>         return
>     fi
> 
>     cd "$PKG_PATH" || exit
> 
>     # [特殊处理] SwiftyBeaver 自带 xcodeproj 会干扰 SPM 构建，必须删除
>     if [ -d "$LIB_NAME.xcodeproj" ]; then
>         echo "⚠️  检测到 .xcodeproj，正在移除以强制使用 Package.swift..."
>         rm -rf "$LIB_NAME.xcodeproj"
>     fi
> 
>     # 1. 执行 xcodebuild
>     # 注意：这里我们只指定 destination generic/platform=macOS
>     xcodebuild build \
>         -scheme "$SCHEME_NAME" \
>         -destination "generic/platform=macOS" \
>         -configuration Release \
>         -derivedDataPath "$LIB_DERIVED_DATA" \
>         BUILD_LIBRARY_FOR_DISTRIBUTION="$USE_DISTRIBUTION" \
>         SKIP_INSTALL=NO \
>         >/dev/null 2>&1
> 
>     # 检查构建结果
>     if [ $? -ne 0 ]; then
>         echo "❌ 构建失败！尝试输出详细日志..."
>         xcodebuild build \
>             -scheme "$SCHEME_NAME" \
>             -destination "generic/platform=macOS" \
>             -configuration Release \
>             -derivedDataPath "$LIB_DERIVED_DATA" \
>             BUILD_LIBRARY_FOR_DISTRIBUTION="$USE_DISTRIBUTION"
>         return
>     fi
> 
>     # 2. 定位 Framework 产物
>     # SPM 的产物路径可能有所不同，按优先级查找
>     FRAMEWORK_SOURCE="$LIB_DERIVED_DATA/Build/Products/Release/PackageFrameworks/$LIB_NAME.framework"
> 
>     if [ ! -d "$FRAMEWORK_SOURCE" ]; then
>         FRAMEWORK_SOURCE="$LIB_DERIVED_DATA/Build/Products/Release/$LIB_NAME.framework"
>     fi
> 
>     if [ ! -d "$FRAMEWORK_SOURCE" ]; then
>         echo "❌ 致命错误: 无法在构建产物中找到 $LIB_NAME.framework"
>         return
>     fi
> 
>     echo "✅ 编译成功，正在处理 Framework 结构..."
> 
>     # 3. [关键修复] 自动修补 Swift Modules
>     # 当 BUILD_LIBRARY_FOR_DISTRIBUTION=NO 时，Framework 缺 Modules 文件夹
>     # 我们需要从 DerivedData 里把 .swiftmodule 文件夹拷进去
> 
>     FRAMEWORK_MODULES_DIR="$FRAMEWORK_SOURCE/Modules"
>     GENERATED_MODULE_DIR="$LIB_DERIVED_DATA/Build/Products/Release/$LIB_NAME.swiftmodule"
> 
>     if [ ! -d "$FRAMEWORK_MODULES_DIR" ]; then
>         if [ -d "$GENERATED_MODULE_DIR" ]; then
>             echo "🔧 正在修补缺失的 Modules (解决 'No such module' 错误)..."
>             mkdir -p "$FRAMEWORK_MODULES_DIR"
>             cp -R "$GENERATED_MODULE_DIR" "$FRAMEWORK_MODULES_DIR/"
>         else
>             echo "⚠️  警告: 未找到生成的 .swiftmodule，如果是纯 ObjC 库则忽略。"
>         fi
>     fi
> 
>     # 4. 复制到最终目录
>     cp -R "$FRAMEWORK_SOURCE" "$OUTPUT_DIR/$LIB_NAME.framework"
>     echo "🎉 $LIB_NAME.framework 已输出。"
> }
> 
> # ==============================================================================
> # 执行任务
> # ==============================================================================
> 
> # 参数1: 文件夹名
> # 参数2: Scheme名 (通常与文件夹名相同，但可以通过 swift package describe 查看)
> 
> build_package "Defaults" "Defaults"
> build_package "KeyboardShortcuts" "KeyboardShortcuts"
> build_package "Sauce" "Sauce" "YES"
> build_package "SwiftyBeaver" "SwiftyBeaver"
> 
> # ==============================================================================
> # 结束
> # ==============================================================================
> 
> # 清理临时文件 (可选，注释掉以方便 Debug)
> rm -rf "$TEMP_BUILD_DIR"
> 
> echo ""
> echo "----------------------------------------------------"
> echo "✅ 所有任务完成！"
> echo "📁 Frameworks 已生成在: $OUTPUT_DIR"
> echo "----------------------------------------------------"
> echo "👉 现在的 .framework 内部已包含 Modules 文件夹。"
> echo "👉 请回到 Xcode，先 Clean Build Folder，然后重新编译。"
> 
> ```

其他的仅在App中用到的依赖只需要在App中通过xcode添加依赖即可

### Protocol

Module Protocol:
- id
- name
- icon
- prefix
- features
- settings
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

注意, shortcut使用KeyboardShortcuts(是一个Swift第三方库), 用这个进行快捷键绑定.

注意, Module的settings应该包含全部的设置, 包括module和features的设置, 应该能够设置module, features以及actions的 prefix, shortcut(如果有). 这些应该使用Defaults进行持久化, 每一次启动的时候读取设置并更新对应的member variable

#### Logger

你需要实现一个logger, 全局维护一个实例, 在App, Plugins中共享, 使用SwiftyBeaver这个库输出log信息.

当debug时, 输出所有level的信息. 当Release的时候, 只输出Warn和Error的信息到log file的位置. log file的位置应该是一个写死的位置. 当文件大小超过某一定上限的时候清理一部分log信息

#### AppState

AppState保存所有的数据状态. 具体需要保存什么内容请你根据我上述的描述进行设计.

AppState判断权限(App主程序, MainModule, 其他Plugins), 然后按照权限提供数据的访问接口. 通过AppState, 可以获取某一个变量当前的最新值, 或者订阅一个变量(监听其变化值), 或者对某些值通过接口进行修改. 提供的接口需要按照权限进行判断是否成功获取.

注意, AppState需要跨模块传输数据, 并且数据需要是多Module之间同步的.

使用Singleton形式, 在ModuleProtocol这个framework中创建public static的shared. 强制要求所有的Modules都do not embed ModuleProtocol, 只有在QueryTools这个主程序中才sign & embed ModuleProtocol

#### NotifyCenter

通知中心. 使用Swift原生的API进行配置通知的调度.

需要实现:
1. 单例模式, 全局调用, 使用public static创建shared
2. 实现函数进行权限申请
3. 实现函数进行发送通知 (如果权限申请成功. 如果没有, 那么不发送)
