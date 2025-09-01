---
type: skills
tags:
  - MacOS
  - swift
  - software/Xcode
  - code
done: true
---
# Create New Local Packages

假设目标结构如下(参考[[QueryTools]]):
```
QueryTools
├── QueryTools (主 App 代码)
├── Packages
│   ├── AppSearch
│   ├── QueryToolsCore
│   └── QueryToolsProtocol
└── Products
```

其中`AppSearch`, `QueryToolsCore`, `QueryToolsProtocol`是创建的Libraries.

1. 右键(辅助按键)点击最顶层的QueryTools这个project name
2. 创建新的group, 输入名称Packages. 这样才能创建一个Folder在Root下.
3. 在menubar中, `File -> New -> Package...` 打开创建界面, 创建一个新的package
	1. 默认选择`Multiplatform`的Library, 然后点击Next
	   ![[Pasted image 20250824202350.png|380]]
	2. Testing System可以不添加
	   ![[Pasted image 20250824202415.png|380]]
	3. 改名字, 然后选择安装的路径(这里可以选择在Packages下, 也可以选择在其他的位置)
	4. 可以去掉Source Control, 也可以添加, 作为submodule
	5. 在Add to中, 选择QueryTools. 下方的Group尽量选择之前路径相同的文件夹
	   ![[Pasted image 20250824202121.png|380]]
4. 这个时候可以在左侧看到创建的packages.
5. 点击左侧边栏最顶层的project, 在`TARGETS`中找到QueryTools(AppName), 在`General`一栏中找到`Frameworks, Libraries, and Embedded Content`, 点击加号
   ![[Pasted image 20250824202514.png|750]]
6. 选择需要的Library(按住Command进行多选), 点击Add添加到当前的项目中
   ![[Pasted image 20250824203528.png|750]]

# Fetch from Remote

在Xcode的menubar中, 找到 `File -> Add Package Dependencies...`, 在右上角输入swift packages的github url
![[Pasted image 20250824204425.png|825]]

如果已经存在第三方依赖, 可以右键点击`Package Dependencies`选择添加依赖
![[Pasted image 20250824204642.png|237]]