# Electron基础

> 技术架构:
>
> Chromium+Nodejs+Native API

进程:

一个程序只能有一个主进程, 但是可以有多个渲染进程.

主进程仅需Native API的交互, 顺便使用IPC进行与渲染进程的交互. 主进程可以去管理所有的渲染进程

渲染进程进行网页的展示, 用户的交互等等. 但是与本机的交互需要在主进程进行, 渲染进程是在浏览器沙盒中运行的

## 实例项目

```shell
# 克隆项目
git clone https://github.com/electron/electron-quick-start.git
# 进入文件夹
cd electron-quick-start
# 安装依赖并运行
npm install && npm start
```

<h3>package.json</h3>

入口程序: `main.js`

启动参数: `start: "electron ."`

```json
{
    "name": "react",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "main": "electron/main.ts",
    "scripts": {
        "dev": "vite react --port 8080 --host",
        "build": "cd react && tsc && vite build --outDir ../react/dist",
        "lint": "eslint react --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview",
        "electron": "electron ."
    },
    "dependencies": {
        "@ant-design/icons": "^5.2.6",
        "@mdi/js": "^7.2.96",
        "@mdi/react": "^1.6.1",
        "@reduxjs/toolkit": "^1.9.5",
        "antd": "^5.8.6",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-redux": "^8.1.2",
        "react-router": "^6.15.0",
        "react-router-dom": "^6.15.0"
    },
    "devDependencies": {
        "@types/node": "^20.5.9",
        "@types/react": "^18.2.15",
        "@types/react-dom": "^18.2.7",
        "@typescript-eslint/eslint-plugin": "^6.0.0",
        "@typescript-eslint/parser": "^6.0.0",
        "@vitejs/plugin-react": "^4.0.3",
        "electron": "^26.1.0",
        "concurrently": "^8.2.1",
        "cross-env": "^7.0.3",
        "eslint": "^8.45.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.3",
        "prettier": "^3.0.3",
        "sass": "^1.66.1",
        "typescript": "^5.0.2",
        "vite": "^4.4.5"
    }
}

```

<h3>main.js</h3>

```js
// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

// 创建窗口, 并创建一个界面(用index.html加载展示), 是一个渲染进程
function createWindow () {
  // 创建一个窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 把index.html加载进这个程序中
  mainWindow.loadFile('index.html')

  // 打开devTools, 或者进入按Ctrl+Shift+i
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

## 初始化项目

```shell
# 新建文件夹
mkdir electron-app
cd electron-app
# 初始化
npm init vite
# 添加electron
npm install --dev electron
```

创建`main.js`之后进入文件

```js
const {app, BrowserWindow} = require('electron')

// 当app启动之后执行窗口创建的操作
app.whenReady().then(() => {
    const mainWin = new BrowserWindow({
        width: 600,
        height: 400,
    })

    // 加载自定义的页面
    mainWin.loadFile("index.html")

    // 只是为了输出调试, 表示这个窗口已经关闭了
    mainWin.on('close', () => console.log('close~~~'))
})

app.on('window-all-closed', () => {
    console.log('all closed~~~')
    app.quit()
})
```

## 生命周期

ready: app初始化成功, 进行窗口创建等

dom-ready: web-content初始化成功, 可以对dom的元素进行操作

did-finish-load: 导航完成时会触发. 在dom-ready之后, 由web-content进行调用. 指的是选项卡的渲染器停止渲染的时候调用

ready-to-show: 有的时候会有创建完成窗口但是窗口的内容还没加载好的情况, 这个时候需要调用ready-to-show进行展示.

close: 窗口关闭时进行触发

closed: 窗口关闭之后触发

window-all-closed: 所有的窗口都关闭之后触发.

before-quit: 在关闭窗口之前调用

will-quit: 所有窗口都关闭之后, 应用程序即将退出的时候触发.

quit: 当所有窗口都关闭时触发

> 注意: 
>
> 其实electron是把窗口退出分成了三个步骤, 首先是before-quit, 然后是will-quit, 最后是quit. 如果没有监听window-all-closed, 那么这三个事件有意义. 但是如果监听了这window-all-closed, 那么这三个事件就会产生影响.
>
> 如果监听了window-all-closed, 那么需要手动将应用程序退出, 不会直接触发quit的那三个事件

closed: 窗口全部都关闭之后, 窗口的实例全部销毁, 应用程序正在退出, 要删除窗口的引用

对应: 

```
ready: app.whenReady().then(() => {}) 或者 app.on('ready', ()=>{})
dom-ready: mainWin.webContent.on('dom-ready', ()=>{})
did-finish-load: mainWin.webContent.on('did-finish-load', ()=>{})
ready-to-show: mainWin.on('ready-to-show', ()=>{})
close, closed: mainWin.on('xxx', ()=>{})
window-all-closed, before-quit, will-quit, quit: app.on('xxx', ()=>{})
```

> 注意:
>
> 是先执行窗口的close->closed, 然后再去找主进程的window-all-closed
>
> 一般来说, 需要再窗口的close中进行将窗口销毁, 一般是用mainWin = null直接将窗口丢给GC垃圾回收处理

```js
function createWindow(){
    let mainWin = new BrowserWindow({
        width: 600,
        height: 400,
        // 这个是为了防止还没有加载好就进行展示, 结果展示空白的页面
        show: false,
    })

    mainWin.loadFile('index.html')
    // 必须把这个放在下面
    mainWin.on('ready-to-show', () => {
        console.log("web is ready to show")
        // 展示
        mainWin.show()
    })

    mainWin.on('close', () => {
        console.log("mainWindow is closed.")
        mainWin = null
    })
    main
    mainWin.webContents.on('did-finish-load', () => console.log("webContent finished load."))
    mainWin.webContents.on('dom-ready', () => console.log("dom ready"))
}
app.whenReady().then(() => {
    console.log('app ready')
    createWindow()
})
app.on('window-all-closed', () => console.log("window all closed"))
app.on('before-quit', () => console.log("before quit"))
app.on('will-quit', () => console.log('will quit'))
app.on('quit', () => console.log('quit'))
```

## 窗口配置

```typescript
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        show: true, // 是否展示
        width: 800, // 宽度, 还有minWidth, maxWidth
        height: 600, // 高度, 还有minHeight, maxHeight
        title: "Title", // 窗口标题, 但是加载的html会覆盖这里的这个title属性
        icon: "<filepath>", // app的图标
        frame: false, // 是否显示窗口周围的标签栏和菜单栏 可以用于自定义菜单栏
        transparent: true, // 窗口是否透明
        autoHideMeunBar: true, // 是否隐藏菜单栏
        webPreferences: { // 为了安全起见, 不允许渲染进程调用主进程的内容. 但是由于我们是自己编写, 所以允许
            nodeIntegration: true, // 能够让渲染进程也使用node环境
        }
    })
}
```

## 编程式操作窗口

```typescript
// 在渲染进程中, 使用remote获取当前窗口
const mainWin = remote.getCurrentWindow()
// 关闭窗口
mainWin.close()
// 判读是否最大化了, 如果不是, 那么就最大化
if(!mainWin.isMaximized()) {
    // 最大化
    mainWin.maximize()
} else {
    // 回到初始状态
    mainWin.restore()
}
// 最小化
if (!mainWindow.isMinimized()) {
    mainWin.minimize()
}
```

## 阻止窗口关闭

```typescript
window.onbeforeunload = () => {
    // 这里可以做一些关闭前的逻辑
    // 返回true表示关闭, 返回false表示不关闭
    return false
}
```

## 创建新窗口

```typescript
const { remote } = require("electron")

let subWin = remote.BrowserWindow({
    width: 400,
    height: 300,
    parent: remote.getCurrentWindow(), // 设置父窗口
    modal: true // 是否是模态窗口
})
```

## 自定义菜单栏

先创建一个菜单的模板

```typescript
const menuTemplate = [
    {
        label: "file",
        submenu: [
            {
                label: "open",
                click () {
                    console.log("click open file")
                }
            },
            {
                type: "separator"
            },
            {
                label: "about",
                role: "about"
            }
        ]
    },
    {
        label: "edit"
    }
]
```

然后根据这个菜单栏创建一个菜单:

```typescript
// 根据模板创建菜单
const menu = Menu.buildFromTemplate(menuTemplate)
// 将菜单应用到Application上
Menu.setApplicationMenu(menu)
```

[关于menu的详细介绍](https://www.electronjs.org/docs/latest/api/menu-item)

设置自定义快捷键: 给menu添加一个属性, `accelerator: "ctrl + o"`这样就行.

### 程序式创建菜单

```typescript
const {remote} = require("electron")
const Menu = remote.Menu
const MenuItem = remote.MenuItem

// 创建菜单项
const fileMenu = new MenuItem({label: "file", type: "normal"})
const editMenu = new MenuItem({label: "edit", type: "normal"})

// 创建菜单
const menu = new Menu()
menu.append(fileMenu)
menu.append(editMenu)

// 将菜单添加给application
Menu.setApplicationMenu(menu)
```

## 自定义右键菜单

还是用到了`remote.Menu`

```typescript
const contextTemplate = [
    {label: "Run code"},
    {label: "转到定义"},
    {type: "separator"},
    {
        label: "其他功能",
        click () {
            console.log("click others")
        }
    }
]

const contextMenu = Menu.buildFromTemplate(contextTemplate)

window.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("contextmenu", (ev) => {
        // 这个是渲染进程里的
        ev.preventDefault()
        menu.popup({window: remote.getCurrentWindow()})
    }, false)
})
```

## 主进程与渲染进程的通信

使用`ipcMain`和`ipcRenderer`

注意, `ipcRenderer`可以发送也可以接收(监听), 但是`ipcMain`只能接收(监听), 然后通过回调函数`(ev, data) => {}`的`ev`来发送.

想要在主进程发送消息给渲染进程, 只能是获取到渲染进程对应的窗口之后再进行发送.

### 渲染进程发送消息

- 发送异步消息

    在渲染进程中

    ```typescript
    const {ipcRenderer} = require("electron")

    // send: channel通道名, args[]参数(可以有多个)
    ipcRenderer.send("msg1", "come from render thread, an async msg")
    ```

    然后在主进程中接收消息

    ```typescript
    ipcMain.on("msg1", (ev, data) => {
        // 在主进程中的
        console.log(data)
        // 再重新给渲染进程发送一个消息
        ev.sender.send("msg1Re", "come from main thread, async msg")
    })
    ```

    渲染进程接收消息

    ```typescript
    ipcRenderer.on("msg1Re", (ev, data) => {
        // 在渲染进程中的
        console.log(data)
    })
    ```

- 发送同步消息

  ```typescript
  const val = ipcRenderer.sendSync("msg2", "sync messsage")
  console.log(val)
  ```
  
  接收
  
  ```typescript
  ipcMain.on("msg2", (ev, data) => {
      console.log(data)
      ev.returnValue = "return msg"
  })
  ```

### 主进程发送消息

可以是在菜单栏里面添加一个click函数, 然后点击这个函数的时候触发这个发送信息

```typescript
click() {
    BrowserWindow.getFocusedWindow().webContents.send("msg3", "send from main thread")
}
```

渲染进程接收:

```typescript
ipcRenderer.on("msg3", (ev, data) => {
    console.log(data)
})
```

### 多个渲染进程之间的通信

1. 利用主进程

   渲染进程1

   ```typescript
   ipcRenderer.send("msg1", "thread 1")
   ```

   主进程

   ```typescript
   ipcMain.on("msg1", (ev, data) => {
       const mainWindow = BrowserWindow.fromId(mainWinId)
       mainWindow.webContents.send("msg2", data)
   })
   ```

   渲染进程2 (需要是能和mainWinId对应起来的窗口)

   ```typescript
   ipcRenderer.on("msg2", (sv, data) => {
       console.log(data)
   })
   ```

   

2. 利用localStorage

   ```typescript
   // 发送信息之后存入到localStorage里面, 需要的时候取出来
   localStorage.setItem("key", "value")
   // 取出
   const val = localStorage.getItem("key")
   ```

设置父窗口:

- 由于在创建主窗口的时候的`mainWin`是在函数内部的, 所以在函数的外部获取不到这个窗口. 所以创建一个`let mainWinId  = null`来保存主窗口的id, 在创建的时候使用`mainWinId = mainWin.id`保存, 然后再创建子窗口的配置项里面填上`parent: BrowserWindow.fromId(mainWinId)`即可
