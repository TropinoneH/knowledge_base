# 创建环境

直接到unity hub中选择编辑器,然后直接下载安卓支持就行

下载Android Studio并配置环境(上网找教程)

# 实时debug

在手机上下载Unity Remote(Apple也可以), 然后用数据线连接到电脑, 手机打开Unity Remote(注意安卓手机要打开开发者模式->USB调试), 然后在编辑->项目设置->编辑器找到设备选项,找到手机的那个选项即可

# 编译

先到编辑->首选项->外部工具,查看安装的`SDK`,`NDK`有没有成功,没有那就重启Unity

编辑->项目设置->玩家(Player)中,设置公司名称,产品名称,在分辨率中,将旋转设置成只允许右横屏左横屏; 在其他设置中找到包名写`com.公司名.项目名(可以自己起)`; 在发布设置中点击密钥库管理器,选择密钥库->创建新的密钥(放在单独的`AndroidKeyStore`文件夹中),输入password,Alias,password,并点击生成->添加密钥

转到 文件->生成设置->Android, 勾选导出项目, 点击导出, 选一个文件夹

使用Android Studio打开刚刚导出的文件夹, 构建->Generator...啥的选项, 选择APK->下一步, 选择刚刚在unity中创建的KeyStore文件,输入密钥,然后选择文件名,再输入密钥(测试环境我设置的都是111111), 然后构建就行. 构建完成之后会弹出一个通知, 可以点击然后转到location(好像是)然后就可以打开APK包的位置了.

# Unity移动端的触屏控制

## 一.Touch

```c#
Touch t = Input.GetTouch(int index);//获取编号为index的触点
Touch[] tList = Input.touches();//获取所有的触点列表
int count = Input.touchCount;//获取所有触点个数
t.phase;//TouchPhase的枚举,Begin(开始),Ended(结束),Canceled(不知道),move(移动,好像是),st...(长按且不移动,但是忘了怎么拼了...有强大的IDE来帮忙补全~)
t.position;//触点的位置,世界坐标,左下角为0,0
Camera.main.ScreenToWorldPoint(new Vector3(oldPos.x, oldPos.y,
                            -Camera.main.transform.position.z));//将世界坐标转换成窗口坐标(就是unity的坐标)
```

