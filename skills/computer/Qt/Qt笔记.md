# 一.qt基本用法
## 1.1.界面介绍
打开qt后,最左侧一栏选择welcome(欢迎)选项,可以新建或打开文件,选择application选项,使用CWidget基类,改名等基本操作,创建完成.

下面是初始化时的代码及含义

main.cpp中:

```c++
#include "mywidget.h"
#include <QApplication>    //包含一个应用程序类的头文件
//main函数入口,argc是命令行变量的数量,argv是命令行变量的数组
//所有接收的命令存到argv中
int main(int argc, char *argv[]){
    //a是应用程序对象,有且只有一个
    QApplication a(argc, argv);
    //窗口对象,myWidget->QWidget
    myWidget w;
    //窗口对象默认不会显示,需要调用show函数显示
    w.show();
    // 让应用程序陷入消息循环(死循环,当点击"×"才会关闭)
    //陷入死循环后,该代码行后所有的语句都需要关闭之后才执行,但是已经关闭了,所以不显示出来
    return a.exec();
}
```

.pro文件中:(是工程文件,最好不要修改,连注释也不要加,下面的注释是复制后添加的):

```
QT       += core gui       //qt包含的模块,core核心模块,gui图形模块
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets  //大于qt4版本以上,包含widget模块
CONFIG += c++11
# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    
# disables all the APIs deprecated before Qt 6.0.0
SOURCES += \
    main.cpp \               //源文件
    mywidget.cpp
HEADERS += \              //头文件 
    mywidget.h
FORMS += \
    mywidget.ui
# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target
```

mywidget.h头文件中:

```c++
#ifndef MTWIDGET_H
#define MYWIDGET_H
//作用于#pragma once相同

#include <QWidget>           //包含头文件QWidget
class myWidget : public QWidget{         //继承了一个窗口类
	Q_OBJECT           //宏,允许类中使用信号和槽的机制
public:
	myWidget(QWidget *parent = 0);
	~myWidget();
}
#endif //MYWIDGET_H

mywidget.cpp类的实现:

#include "wywidget.h"
myWidget::myWidget(QWidget){
	: QWidget(parent);         //初始化列表
}
~myWidget::myWidget(){
}
```

## 1.2.快捷键
类名:首字母大写,单词之间首字母大写;

函数名:首字母可以小写,单词之间首字母大写

快捷键:Ctrl+/快速注释掉代码

Ctrl+r运行代码

Ctrl+b编译(小锤子按钮)//不是调试!!!!

Ctrl+滚轮缩放

Ctrl+f查找

Ctrl+o打开

Ctrl+n新建

Ctrl+shift+↑ or ↓ 整行移动(向上移或向下移)

F1 帮助,esc退出;            F1两次:全屏帮助,esc退出         C:\Qt\6.0.4\mingw81_64\bin/assistant.exe,可以一边敲代码一边查找         左栏的帮助按钮

Ctrl+i自动对齐

F4 同名的头文件和源文件的切换

## 1.3.QPushButton的创建

父类:QAbstractButton,父类的父类:QWidget,再父类:QObject,是实例类(实体对象,最抽象的,最上层的,最祖宗的)

需要包含`<QPushButton>`头文件

语法:

```c++
QPushButton * btn = new QPushButton;
btn->setParent(this);//不能用btn->show()因为会使btn以顶层的方式弹出窗口控件,而不是令btn控件依赖于myWidget窗口中,this指btn所要显示的窗体
btn->setText("QString");//显示文字,参数应该是QString型,但是可以const char*型(类型转换)
QPushButton btn2 = new QPushButton("QString",this);//显示,与上文相似
btn2->move(坐标x,坐标y);//移动到坐标处,不是不是不是移动x,y个坐标
btn2->resize(宽,高);//重设大小,用户不可以自己改,但是文字可能显示不全
//题外话:
resize(宽,高);//设置窗口大小,用户可以缩放
setWindowTitle("");//设置窗口标题
setFixedSize(宽,高)//固定窗口大小:用户不可以改变窗口大小
```

如果含有中文时,必须使用UTF-8编码;查看方式:工具(Alt+T)-选项-文本编辑器-行为

QPushButton创建在了堆区(new创建的),但是不用释放,原因如下:

QPushButton的祖宗是QObject类,在创建一个QObject类时,QObject的构造函数会接收QObject指针作为参数,就是parent指针,也就是父对象指针,这相当于创建QObject类时可以提供一个父对象,创建的这个QObject对象会自动加入父对象的children()列表;当父对象析构时,这个类表中所有的对象都会被析构,但是注意,这里的父对象并不是继承意义上的父类.(这种机制在GUI中相当有用,比如说创建了一个按钮,有一个QShortcut就是快捷键作为其子对象,当我们删除按钮时,这个快捷键理应也被删除.)

QWidget是能够在屏幕上显示所有组件的父类;因为QWidget继承自QObject,那么QWidget也继承了这种特性,一个孩子自动的成为父组件的一个子组件.因此,子组件会显示在父组件的坐标系统中,被父组件的边界裁剪.当我们关闭一个界面时,这个界面被析构,这个界面的子组件也会被析构释放掉.

我们把按钮的父亲设置为this,那么当this(窗体)被释放时,按钮也会被释放.

验证释放功能:右键文件名-新建新文件-C++-class-改名(MyPushButton)等基本操作-Base class选QWidget-剩下的不用管

头文件中#include<QDebug>,把#include改成<QPushButton>,继承的类改成public:QPushButton,写上构造函数和析构函数.//好像构造函数已经有了,不用自己再写一个

```c++
//含有explicit(明确的),不能使用隐式转换
源文件中(F4),把继承改了,MyPushButton::MyPushButton(QWidget *parent):QPushButton(parent){
	qDebug() << "构造";     //注意大小写-头文件中Q是大写,函数q是小写
}
//写上析构函数
MyPushButton::~MyPushButton(){
	qDebug<<"析构";
}
然后在mywidget源文件中include"MyPushButton"
在myWidget的构造中写:
//创建一个自己的按钮
MyPushButton myBtn = new MyPushButton;
myBtn->setText("");
myBtn->move(x,y);
myBtn->setParent(this);//好像没有顺序要求(雾
```

析构顺序:走完myWidget的代码,走完子对象的所有析构,走完myWidget的析构

## 1.4.窗口坐标系

与C++graphics或MFC相同//游戏开发的是在左下角为(0,0)点

## 1.5.信号和槽(还记得这个吗,头文件中有一个Q_OBJECT)

### 1.5.1

信号的发送者----发送的具体信号----信号的接受者----信号处理(比如说函数)(这个就是所谓的"槽")

信号槽的优点:松散耦合:信号发送端和接收端是没有关联的,通过connect连接 将两端连接在一起

代码实现:    

```c++
//在mywidget.cpp的构造函数中
//信号的单词:signal,可能在这个类(QPushButton)中没有信号,但是可能在父类中,祖宗类中等
//点击:clicked();    按下的瞬间:pressed();     释放的瞬间:released();      切换:toggled(bool checked)
//信号处理(槽函数),槽的英文:Slot
//关闭窗口:close()
//接着上文的myBtn写,参数:信号发送者(指针),具体信号(函数的地址),接受者(指针),信号处理(也是地址)
//参数二和参数四都需要作用域,就是点击谁,让谁关闭,作用域可以是自己起的类对象名,也能是系统的类名
connect(myBtn,&QPushButton::clicked,this,&myWidget::close);
```

### 1.5.2自定义信号和槽

新建一个文件吧

自定义信号写到类的signals下,没有返回值,只需要声明,不需要实现,可以有参数(可以重载).

槽函数:早期QT必须写在public slots下,高版本可以写在public下或全局函数下.返回值是void,需要实现,可以有参数(可以重载).

想要调用信号,必须使用emit,假如说创建了一个叫tea的指针,必须调用emit tea->hungry();才能发送信号.

创建的对象最好直接贴在this类下,比如说可以在myWidget类中创建两个类对象(以Teacher和Student为例),创建Teacher *tea;和Student *stu;作为类成员属性,然后新建两个指针this->tea = new Teacher(this);和this->stu = new Student(this);然后调用connect将信号和槽连接起来,调用emit即可.

### 1.5.3自定义信号和槽的重载

> 注意:①重载时需要信号和槽都重载一下(如果是不同信号对应不同的槽)(不同信号对应相同的槽也需要)(相同信号对应不同的槽也一样);
> ②connect函数不能分辨你到底想要把哪两个信号连接起来,因为传进去的函数名称无法显示出来带不带参数;指针->地址,而函数指针->函数地址.


函数指针声明方法:

`返回类型(作用域::*指针名称)(参数类型)=&作用域::函数名字;//无参函数必须要写(void)`

于是我们可以`connect(tea,指针名称1,stu,指针名称2);`来把信号和槽的重载连接起来.

> 好像忘了说QDebug了emmm;在<QDebug>中含有函数qDebug(),相当于cout,输出流函数,但是如果打印QString类型时,会加上引号(nmd为什么),需要转换成char*类型(string好像也可以?).

转换方式:需要先转换成`QByteArray(.toUtf8())`然后再转成`char*(.data())`

比如说`QString qtsr;qDebug()<<qstr.toUtf8().data()`即可

想要把自己写的函数和信号connect起来,可以吧函数写到类里面,然后把槽看成这个函数(这个函数可以写在public中,可以正常调用),剩下的就是基本操作.

> 注意:信号也可以作为信号.这样就可以把btn的clicked信号连接到自定义的信号上.

断开信号语法:`disconnect(参数完全相同);`

### 1.5.4拓展

信号可以连接信号,一个信号可以连接多个槽函数,一个槽函数可以有多个信号来连接,信号的参数和槽的参数类型必须一一对应,信号的参数个数可以多于槽函数的参数个数(但是必须类型相同,就是信号的参数必须和槽的已有参数类型相同,其他的参数随意).

注意,clicked不能和有参数的信号连接——因为clicked是无参的(void),所以信号和槽对应参数的类型不同,想要连接只能用函数实现emit的方法来连接.

利用QT4及以前的版本连接信号和槽:

```c++
connect(指针,SIGNAL(信号名(参数类型))),指针,SLOT(槽名(参数类型)));
//参数类型为void时可以不写,更直观,但是类型不做检测(就是类型不一样时不给报错,但是无法运行)
//原因:把信号名看成字符串来去找信号名相同的函数,不会检测小括号中的内容.
//QT5兼容QT4,反之不兼容(废话).
```

## 1.6.lambda表达式

用于匿名函数的定义和声明

如果想要使用LAMBDA表达式,必须要在工程文件中写上CONFIG += c++11(5.4后自动加上了)

用[]标志Lambda的开始,不能省略.

> []中可以有参数:
> 空:没有使用任何函数对象参数
> =:函数体可以使用Lambda所在范围内所有的可见局部变量,包括Lambda所在类的this指针,并且以值传递的方式使用
> &:函数体可以使用Lambda所在范围内所有的可见局部变量,包括Lambda所在类的this指针,并且是引用传递
> this:函数体可以使用Lambda所在类的成员变量(成员属性)//与=类似
a:将a按值传递进行传递.默认是const的,函数体内不能改变a的拷贝,要修改时,可以使用mutable关键字
> &a:将a进行引用传递
> a,&b:将a值传递,b引用传递
> =,&a,&b:除了a和b用引用传递以外,其他的用值传递.
> &,a,b:除了a和b用值传递,其他的用引用传递

推荐用值传递方式

语法:

```c++
[参数](参数类型 参数)mutable->返回值类型{函数体}(参数);
//第一个括号中的是这个函数用到的参数,第二个括号相当于调用,传入了一个参数,可以不加后面的括号,就变成了函数声明.返回值类型为void时可以不写->void;mutable可以不写
```

加上mutable后可以修改值传递的参数的拷贝:`[参数](参数类型 参数)mutable{函数体}(参数);`
注意:修改的不是参数而是参数的拷贝!

Lambda表达式可以作为槽来使用(用声明的格式):`[参数](类型 参数){函数体}`即可,注意还是要保证对应参数类型相同.函数体内部写啥都行.

Lambda有返回值时:`[参数](参数类型 参数)->返回类型{函数体}(参数);`

当使用`[&]`来进行写的操作时(比如说`setText("")`),很可能会报错,原因未知(真的没听出来),所以推荐用`[=]`

当使用Lambda表达式来connect时,如果第三个参数是this,那么可以省第三个参数,直接写Lambda表达式.

## 1.7.QMainWindow

### 1.7.1创建菜单栏:最多有一个
需要包含头文件`<QMenuBar>`

```c++
QMenuBar *指针名 = menuBar();
//返回值是QMenuBar*型,用*bar来接收,本身就创建了一个对象树menuBar
setMenubar(指针名);       //添加显示,但是空菜单不会显示
QMenu * fileMenu = bar->addMenu("文件");//添加一个菜单,返回值是QMenu,用fileMenu来接收
创建菜单项:
QAction *fileNew = fileMenu->setAction("新建");  //返回值是QAction*,可以不接收
fileMenu->addSeparator();//添加分割线,按照代码顺序添加

1.7.2创建工具栏:可以有多个
需要包含头文件<QToolBar>
QToolBar *指针名(这里就用toolbar) = new QToolBar(this);//创建对象树在this上(QMainWindow上)
addToolBar(Qt::默认停靠方位,toolbar);//添加显示
//默认停靠方位:LeftToolBarArea,左侧;RightToolBarArea,右侧;AllToolWidgetArea:全方位;
//TopToolBarArea,上;BottomToolBarArea,下;           类似于一个枚举
toolbar->setAllowedAreas(Qt::默认停靠范围|Qt::默认停靠范围);//设置允许的停靠范围
toolbar->setFloatable(bool);//设置能否浮动
toolbar->setMovable(bool);//能否移动,包括浮动和拖拽,直接不存在拖拽的地方
QAction *指针名 = toolbar->addAction("");//返回值是QAction,可以不接收
toolBar->addAction(fileNew);//这样的话可以与菜单栏共用fileNew选项
添加分割线的函数相同:toolbar->setSeparator();
QPushButton *btn = new QPushButton("aa",this);
toolbar->addWidget(btn);//可以添加按钮
```

### 1.7.3状态栏:最多有一个
需要包含头文件`<QStatusBar>`

```c++
QStatusBar *stBar = statusbar();//创建一个状态栏
setStatusBar(stBar);//设置到窗口中,空的不显示,如果有工具栏靠两侧停靠,那么可以看见工具栏少了一块
QLabel *label = new QLabel("提示信息",this);//创建一个标签,需要包含头文件<QLabel>
stBar->addWidget(label);//默认放左侧
QLabel *label2 = new QLabel("右侧提示信息",this);
stBar->addPermanentWidget(label2);//这个函数将标签默认放到右边
```

### 1.7.4铆接部件(浮动窗口):可以多个
需包含头文件`<QDockWidget>`
```c++
QDockWidget *dockWidget = new QDockWidget("标题",父指针,默认不用管这个参数);//创建
addDockWidget(存在区域,指针,默认参数);
//存在区域:和工具栏的一样,全方位要改成AllDockWidgetArea
//注意由于这个位置是相对于核心区域的,而核心区域未定位时会导致这个浮动窗口所在区域上下相反
dockWidget->setAllowedAeras(允许停靠位置,指针);
```

### 1.7.5设置中心部件:最多一个
`setCentralWidget(指针名);`

### 1.7.6文本编辑器
需要包含头文件`<QTextEdit>`
```c++
QTextEdit * edit = new QTextEdit(this);       
//作为文本编辑的程序而言,可以把这个当做核心部件
```

# 二.资源文件
## 2.1.资源文件

之前的代码可以依靠拖拽的方式添加

### 2.1.1菜单栏
菜单项会直接显示在窗体上.但是菜单项(下拉选项)不能写入中文,但可以通过修改右下角的text选项来显示中文,然后菜单选项会在底部显示出一个叫action(你写的英文名字)的一个控件名

下拉选项后,直接右键,可以选择添加分隔符,与函数setSeparator()作用相同

### 2.1.2工具栏
想创建一个工具栏,可以先选中CMainWidget,然后在右上角右键CMainWidget对象,选择添加

如果想与菜单共用一个对象,可以从底部创建的对象名直接拖拽上去

在工具栏直接右键,可以选择添加分隔符,与函数setSeparator()作用相同

### 2.1.3添加资源文件

想要添加图标(每个控件都可以有图标),选中该控件,右下角找到icon选项,根据路径找到.ico文件,然后直接打开即可

代码实现:

在mainwindow.cpp中会自动创建一个叫做ui的指针,可以通过这个指针找到可视化窗体里所有的控件.

之前添加菜单选项时会添加一个控件名,可以通过ui->控件名->setIcon(QIcon("绝对路径"));函数实现

如果想要使用相对路径,那么需要添加资源文件.首先,将资源图片复制到项目文件夹中,然后新建->Qt->Qt Resource File -choose->改名等基本操作->finish,会创建一个.qrc文件,就是资源文件.但是一旦创建了以后就打不开了,需要右键.qrc文件,Open in Editor就能打开了.

然后在new.qrc文件中下方点添加->添加前缀,如果不想作为区分可以直接用一个/即可.前缀的话可以用于游戏开发时不同类别物品的区分;然后再添加->添加文件,选中想要的文件,选择打开,最后需要编译以下,就会把所有选中的资源文件添加进去了.

资源文件路径名:":+前缀名+文件名"//比如说前缀是/,路径是Image/a.png,那么就是:/Image/a.png
好像QT6.0.4添加,而是直接添加前缀和添加文件两个按钮

# 三.对话框

系统提供的标准对话框:
> QColorDialog:选择颜色的
> QFileDialog:选择文件
> QFontDialog:选择字体
> QInputDialog:允许用户输入一个值,并把值返回
> QMessageDialog:消息(模态)
> QPageSetupDialog:打印机纸张相关
> QPrintDialog:打印机配置
> QPrintPreview:打印预览
> QProgressDialog:显示操作过程

## 3.1实现点击按钮弹出对话框的功能

对话框头文件:`<QDialog>`

对话框分类:模态对话框(打开后不可以再对其他窗口进行操作),非模态对话框(打开后仍然可以再对其他窗口进行操作),模态对话框有一个阻塞的功能.

模态:

```c++
QDialog dlg(this);dlg.exec();//在这一行阻塞,下面的代码都不会实现
dlg.resize(116,30);//大小最好在116*30以上,这样避免可能会弹出警告
非模态://QDialog dlg2(this);dlg2.show();//但是会直接崩掉,没有缓存住这个对象
改变:QDialog *dlg2 = new QDialog(this);dlg2->show();//即可,大小一要改一下
connect(ui->控件名,&QAction::triggered,this,[](){见上文});
//triggered是触发的信号名,就是点击一下就触发;this可省略
非模态对话框是在this释放时释放,所以假如一直新建,那么很可能直接内存泄漏,所以要设置一个属性:
dlg2->setAttribute(Qt::WA_DeleteOnClose);//当关闭时释放
```

## 3.2标准对话框——消息对话框

```c++
QMessageBox::critical(父指针,"标题","显示内容");//错误对话框,模态
QMessageBox::information(this,"标题","显示内容");//信息对话框
QMessageBox::warning(this,"标题","显示内容");
QMessageBox::question(this,"标题","内容",按钮|按钮,默认选中的按钮);//提问对话框,对用户进行询问
//按钮为:QMessageBox::Ok;QMessageBox::Open;QMessageBox::Save;QMessageBox::Cancel
//QMessageBox::Close;QMessageBox::Discard;QMessageBox::Apply;QMessageBox::Reset
//QMessageBox::Help;QMessageBox::Yes;QMessageBox::No;QMessageBox::YesToAll
//QMessageBox::NoToAll;QMessageBox::SaveAll;QMessageBox::Retry;QMessageBox::Ignore
如果想判断是否选了某个按钮:
if(按钮 == QMessageBox::question(this,"标题","内容",按钮|按钮,默认选中的按钮) ){...}else{...}
//其实所有的对话框都是五个参数,只是可以选择不写用默认参数
```

## 3.3其他标准对话框(拓展)

### 3.3.1颜色

头文件`<QColorDialog>`
```c++
QColor color = QColorDialog::getColor(QColor(int r, int g , int b ,int a=255));
//用什么颜色(r,g,b)来打开,返回值就是QColor,a是透明度,255是完全不透明
qDebug() << "r="<<color.red() ;
```

### 3.3.2文件

头文件`<QFileDialog>`

```c++
QString str = QFileDialog::getOpenFileName(this,"标题","默认打开绝对路径","(*.想打开文件的类型的扩展名);;(*.扩展名)");//返回值是QString型,路径要加双斜线,也可以单斜线;最后两个参数可以不加
qDebug() <<str;          //返回值是选取的路径 
```

### 3.3.3字体

头文件`<QFontDialog>`

```c++
QFont font = QFontDialog::getFont(bool型指针,QFont("字体名称",int 字号));
//bool型指针好像没什么用,但是还是得加上,QFont是默认值
qDebug()<<"字体名称"<<font.family().toUtf8().data()<<"字号"<<font.pointSize();
qDebug()<<"是否加粗"<<font.bold()<<"是否倾斜"<<font.italic();
```

# 四.控件

## 4.1按钮
push button不大用来显示图片,tool button一般是用来显示图片的

但toolbutton默认只显示图标不显示文字,选中右下角->toolButtonStyle->ToolButtonTextBesideIcon

选中右下角->autoRaise:只有鼠标浮在按钮上时按钮才会凸起显示

## 4.2单选框radioButton

默认情况下全都放在Widget上会导致无论想要有几组单选按钮,只能有一个按钮被选上.

解决方法:右侧->containers->Group Box,然后将魅族单选按钮分别拖拽进去就行.Group Box可以改名.

Group Box设置默认值:

想要从代码中找到控件,看右上角最上面objectName即可(可以改名)

ui->单选按钮的objectName->setChecked(true);

监听选择:类似于信号槽

`connect(ui->单选按钮的objectName,&QRadioButton::clicked,this,[](){函数体});`

## 4.3多选框:checkBox

也可以用Group Box(分组)来装.

信号:`&QCheckBox::stateChanged//状态改变,选中时是2,未选中时是0`

如果想要1,那么需要在设计界面选中复选框,右下角->最下面的tristate->选上,会出现半选状态,返回值是1

获取状态:`connect(ui->复选框的objectName,&QCheckBox::stateChanged,[=](int state){...});`

## 4.4列表控件listWidget:

可以写东西:

注意是listWidget不是listView

```c++
QListWigetItem *item = new QListWidgetItem("你想写的东西");//自动左对齐,写入一行
ui->列表控件的objectName->addItem(item);
想要设置对齐方式:item->setTextAlignment(对齐方式);
//对齐方式为Qt::AlignLeft左对齐;Qt::AlignRight右对齐;Qt::AlignHCenter水平居中;Qt::AlignJustify适中
//Qt::AlignTop上;Qt::AlignBottom下;Qt::AlignVCenter竖直居中;Qt::AlignBaseline基于一条基线对齐
QStringList list;//相当于c++中list<string>,list容器中放入string内容
list <<"第一行"<<"第二行"<<"第三行"<<"第四行";//左移运算符可以直接分行输入到list容器中
ui->列表控件的objectName->addItems(list);//可以一次性放入多行内容,注意这里有一个s,上面的没有
//这个没法居中显示
```

## 4.5树控件tree Widget

样式:就是名称前的小三角,点击后可以打开子目录(类似于文件夹最左侧)

设置水平的头:
```c++
ui->树控件的objectName->setHeaderLabels(QStringList()<<""<<"");//匿名对象
QTreeWidgetItem *treeItem = new QTreeWidgetItem(QStringList()<<"");
ui->树控件的objectName->addTopLevelItem(指针);//添加最高级节点
高一级的节点名->addChild(指针);
```

## 4.6表格控件

```c++
//首先要设置行列数
ui->表格控件的objectName->setColumnCount(列数);
ui->表格控件的objectName->setHorizontalHeaderLabels(QStringList()<<""<<"");
ui->表格控件的objectName->setRowCount(行数);
ui>表格控件的objectName->setItem(第几行,第几列,new QTableItem(""));
```

但只是初始化了一个

可以使用for循环+QStringList 列表名;+列表名[i]来写,也可以列表名.at(i);//at形式访问会在最后才释放

int型转QSting:`QString::number(int型数据);`

## 4.7其他控件

### 4.7.1Scroll Area

滚动区域,往里面放控件后,放多了后应用布局,会显示滚动条

### 4.7.2Tool Box

改标签:选中->右下角最下面->currentItemText

想要加入标签页:右上角->选中->右键->添加页

每一页可以放不同的控件,可以把每一页缩起来

`ui->栈控件的objectName->setCurrentIndex(索引数);`

### 4.7.3Tab Widget

类似于多网页的.改标签:选中->右下角->currentTabText

新建页方法:右上角->选中->右键->添加页

每一页可以放不同的控件,可以切换不同的页

`ui->栈控件的objectName->setCurrentIndex(索引数);`

### 4.7.4Stacked Widget:栈控件

可以放入不同的控件(包括所有4.7内容里介绍的),右上角有两个小箭头,点击可以切换不同的页面
但是小箭头运行起来不会显示,小箭头是为了开发便捷的.想要切换可以使用按钮来切换,实际开发中常用

先创建一个PushButton,然后添加代码:

```c++
connect(按钮的objectName,&QPushButton::clicked,[=](){
	ui->stackedWidget->setCurrentIndex(int型索引数);
});//索引数从0开始
```

设置默认界面:`ui->栈控件的objectName->setCurrentIndex(索引数);`

### 4.7.5Frame边框
与Widget类似,但更常用Widget

### 4.7.6MDI Area

不知道

### 4.7.7Dock Widget

浮动窗口,详见1.7.4

### 4.7.8QAxWidget

不知道

### 4.7.9Combo Box

下拉框

```c++
ui->下拉框控件的objectName->addItem("名字");//添加下拉框里的选项,默认是第一项
//可以通过按钮来选中:
connect(ui->按钮控件的objectName,&QPushButton::clicked,[=](){
	ui->下拉框控件的objectName->setCurrentIndex(索引数);//相同的,索引数也是从0开始
	ui->下拉框控件的objectName->setCurrentText("名字");//这一条语句也行
});
```

### 4.7.10Font Combo Box

字体下拉框:略

### 4.7.11Text Edit

文本编辑控件,详见1.7.6(也不怎么详)

### 4.7.12Plain Text Edit

文本编辑控件,纯文本,不能加倾斜,加粗,下划线.

### 4.7.13Spin Box

数字选择框,可以通过按钮对数字加减,也可以直接改数字

Double Spin Box:双精度的,带小数,放一块说了吧

### 4.7.14Time Edit

时间

Data Edit:日期

Data/Time Edit:既有时间,有有日期

### 4.7.15Dial

不知道

### 4.7.16Scroll Bar

Horizontal Scroll Bar:水平滑动条

Vertical Scroll Bar:竖直滑动条

Horizontal Slider:水平滑动条
(类似于自制程序MusicPlayer中音量控制的,如果想和Spin Edit配合,需要自己封装,这个后文再讲.)

Vertical Slider:竖直滑动条

### 4.7.17Key Sequence Edit

快捷键

### 4.7.18Label

老常见了,但是侬知道不,可以显示图片,添加资源文件的方法详见2.1.3,但是调用不大一样,如下:

```c++
ui->标签控件的objectName->setPixmap(QPixmap("路径"));//像之前说的,可以绝对路径,可以相对路径
```

QLabel老厉害了,还可以显示动图,但必须是.gif格式,如下:

头文件`<QMovie>`

```c++
QMovie *指针名 = new QMovie("路径");
ui->标签控件的objectName->setMovie(指针);
指针->start();//这样才能开始动
```

可以调出来边框:选中->右下角->frameShape->Box或啥的看着办

### 4.7.19Progress Bar

进度条,经常与其他控件封装,就是进度条去与其他的东西绑定,比如说经验槽等

# 五.自定义控件的封装

写对象树时,其实已经写过自定义控件了,就是那个一点关闭就释放掉的按钮,和父指针(Widget)绑定成了一个自定义控件.

## 5.1添加自定义控件

拖拽的方式来封装(更简单):编辑界面左上角右键文件(就是最顶层的那个文件夹)->添加->Qt->Qt设计师界面类->直接选Widget即可->改名基本文件->生成三个文件,.h,.cpp,.ui

然后在.ui界面封装控件即可

首先,把要封装的控件全拖进去,然后改大小.

如果想在窗体中显示,那么现在窗体中拖进去一个Widget控件(首先保证你刚刚创建的那个文件是Widget类型的)->右键->提升为...->找到提升的类名称->输入你刚刚改的那个文件名,注意是类的名字,而不是文件(.cpp或.h或.ui)的名字->最好点上全局包含->点添加(不是提升!!!!!)->这时才点提升,然后就能看见在右上角显示的刚刚新建的Widget后面的类改成了那个你自己封装的类的名字.

全局包含的好处:你第二次使用提升时,右键后就会直接显示提升为刚刚那个自封装控件.

下面我们进行功能的封装:

我们以Spin Box与Horizontal Slider为例

首先要知道`QSpinBox::valueChanged`是有重载的,一个是`(int)`,另一个是`(QString*)`,那么要用函数指针来制定重载:  

```c++
void(QSpinBox::*spSignal)(int) = &QSpinBox::valueChanged;
connect(ui->数字文本框的objectName,spSignal,ui->滑动条控件的objectName,&QSlider::setValue);
//silder的valueChanged是没有重载的
connect(ui->滑动条控件的objectName,&QSlider::valueChanged,
	ui->数字文本框的objectName , &QSpinBox::setValue);
```

## 5.2提供接口:对这个控件的直接操作

```c++
//需要在那个类的头文件里的public成员中定义函数(就是接口,然后在.cpp文件中实现):
//假如说定义了int getNum()和void setNum(int num)两个函数
void 类名::setNum(int num){
	ui->两个控件的名字都行->setValue(num);//因为两者不管有没有重载,都可以直接设置int
}
int 类名::getNum(){
	return ui->两个控件名都行->value();//value就是获取当前的值,直接就把这个返回回去了 
}
//注意这个得在构造函数外面写
//然后可以用信号和槽来把这个实现
connect(ui->写你相关联的控件,&控件的信号,ui->提升的控件名, [=](){
	//写get或写set都行,但别忘了get有返回值
});
```

# 六.事件QEvent

## 6.1鼠标事件

单独的控件没法实现Event事件,那么我们要对Event事件进行封装,这时我们就可以选择一个c++文件而不是Qt文件,因为我们用不到ui,只需要代码就能实现,设置父类为QWidget,后面在头文件中,把#include后面改成你要提升的控件的所属头文件,把继承改成提升的控件的所属类,在.cpp文件中也有一处要改,就是那个构造函数里冒号后面的改成"提升的控件的所属类(parent)"(不加引号)

然后就可以把你那个想提升的控件提升了.

新建好后在头文件中public里写上鼠标事件:(常用的)(不写是什么了,反正看得懂)

```c++
void enterEvent(QEnterEvent *event);//必须重载,是一个父类QWidget虚函数,参数不用管.他奶奶的,这个参数还必须是QEnterEvent,QEvent还不行,什么sb
void leaveEvent(QEvent *);//参数是什么鬼我也不知道,不用管,完全复制上去即可
vritual void mouseMoveEvent(QMouseEvent *ev);//垃圾,参数类型不能改,而且还不能判断是左键还是右键
virtual void mousePressEvent(QMouseEvent *ev);//哦对了,*后面可加参数,也可以不加,效果一样
virtual void mouseReleaseEvent(QMouseEvent *ev);//如果你重写时没用到,最好还是不写,能少点警告;还有,这三个好像得加上virtual关键字,原理是啥我也不知道,没有继承啊(?),但写实现使可不加
//鼠标移动是得按下后才开始算移动
//最后三个得加上<QMouseEvent>
获取坐标:ev->x(),ev->y(),返回一个int型,这是基于控件的
ev->globalX()和ev->globalY()是不一样的,这是基于整个窗体而言的,注意X和Y一定要大写
//使用QString来把这个全都输出,("%1 %2").arg(ev->x()).arg(ev->y());详见下文x.1
ev->button()来获取鼠标按键,Qt::LeftButton:左键;Qt::RightButton右键;Qt::MidButton:中键
可以利用if(ev->button() == Qt::按键)来判断到底按了哪个键
注意:上述方法只能判断瞬间的操作,而移动是持续状态,不能用上述方法使用,应该用buttons来判断:
if(ev->buttons() & Qt::按键)必须是位与操作符,防止同时按下的操作
如果不想要按下后移动才打印输出,可以在构造函数中输入setMouseTracking(true);但是这时就需要把mouseMoveEvent的判断按键的给注释掉,因为会导致你还得按下正确的按键才打印输出
```

## 6.2计时器事件timerEvent

### 6.2.1timerEvent事件

在widget中重写:`void timerEvent(QTimerEvent *ev);//参数同上`

定义:

```c++
void timerEvent(QTimerEvent *ev){
	static int num = 1;
	ui->一般是标签控件的objectName->setText(QString::number(num++));
}
```

启动定时器(一般在构造函数中写):

```c+
id= startTimer(int间隔毫秒);//其他参数用默认就行,返回值是一个定时器的唯一标志符(int id)
//这样的话就可以实现不同间隔的计时器同时使用,需要把id放到类的public成员中
//然后用if(ev->timerId() == id){}来走代码
```

### 6.2.2定时器类:QTimer

头文件`<QTimer>`

比如想要每隔0.5秒一次

```c++
QTimer *timer = new QTimer(this);
timer->start(int msec);//msec是m毫sec秒
connect(timer,&QTimer::timeout,[=](){
	ui->控件objectName->想干的事;//这样写非常简洁
});
//timeout信号是时间到了后触发一次
```

优点:逻辑性强,想要多个计时器可以直接新建一个类指针即可,不用再搞什么timerId

而且有暂停功能:槽:this,[=](){timer->stop();};恢复:直接start即可

## 6.3event事件分发器(内部机制)

`App->事件过滤器->事件分发器(bool event(QEvent *ev))->{其他事件函数}`

event(QEvent *ev)是一个返回值为bool型的,如果返回一个true,那么事件就会被拦截,所有的事件不会下放给事件处理函数,而是直接自己处理掉,其他不想自己处理的需要`return 父类::event(指针);`

这个指针是那个函数传进来的ev,这行代码是为了把没有拦截的事件全交给父类处理,而这些事件在父类中如何处理我们就不管他了.

但是注意,这里的指针类型是QEvent,之前做的鼠标事件大部分都是QMouseEvent,还有一个傻逼的QEnterEvent类型,那么我们应该进行类型转换,因为是继承关系,所以用静态类型转换即可,不用强制类型转换(当然你想用也可以)`:QMouseEvent *名字 = static_cast<QMouseEvent *>(ev);`

这个ev是event函数传进来的,`QMouseEvent`可以改成任何你想要的类名

这个函数写在你想要的拦截的类里面.比如说我想拦截6.1里的鼠标事件,事件是在myLabel类中的,那就得跑到myLabel类中去声明,定义这个`bool event(QEvent *ev);`这个函数,常规操作一通后就行了.

想要判断到底是那种类型,那么需要函数type(),在QEvent类中,如下
```c++
if(ev->type() == QEvent::事件类型名){...}//这里的事件类型是事件函数的名字(首字母都大写?)
```

实测:这种方法处理器来比正常的调用函数稍慢一点(主要是右键点击,很费鼠标)

## 6.4事件过滤器installEventFilter()

```c++
ui->控件的objectName->installEventFilter(this);//给控件添加事件过滤器
bool eventFilter(QObject *,QEvent *e);//重写声明eventFilter事件,参数名可以后面再写
bool 类名eventFilter(QObject *obj,QEvent *){
	if(obj == ui->控件名){
		if(e->type() == QEvent::事件类型名){...}//这里也要return true
	}
	return QWidget::eventFilter(obj,e);
}
//没什么用但是可以在事件分发器之前截拦
```

## 6.5绘图事件:PrintEvent

头文件`<QPainter>`

### 6.5.1

```c++
void paintEvent(QPaintEvent *);//定义+声明,系统会自动调用,就算空函数也会调用
void paintEvent(QPaintEvent){
	QPainter painter(this);//实例化画家对象,this是指定绘图设备,就是在哪里绘图
	QPen pen(QColor(r,g,b));//QColor的用法去找3.3.3.1和x.4
	pen.setWidth(宽度);//设置画笔宽度,默认是1
	pen.setStyle(Qt::画笔风格);
//画笔风格:SolidLine:实线;DashLine:断续线;DotLine:点线;DashDotLine:点杠线;(自己试试去)
//DashDotDotLine:点点杠线(就是两个点然后一条断线);CustomDashLine:长一道短一道的线
	painter.setPen(pen);//这里的pen和上面的pen可以任意改名,不会有人不知道吧
//画笔必须这样初始化,让画家拿起画笔
	QBrush brush(QColor(参数));//brush画刷,相当于填充工具
	brush.setStyle(Qt::画刷风格);//自己找Assistant的QBrush里面去,一般不用管
	painter.setBrush(brush);
	painter.drawLine(QPoint(x1,y1),QPoint(x2,y2));//在点(x1,y1),(x2,y2)之间画线
	painter.drawEllipse(QPoint(x,y),横轴半轴长,纵轴半轴长);//其实是椭圆,但是椭圆的横纵轴半轴长相同时,就成了一个圆,第一个坐标是圆心坐标
	painter.drawRect(QRect(QPoint(x1,y1),QPoint(x2,y2)));//在两坐标之间画矩形,分别是左上角的点,右下角的点.
	painter.drawRect(QRect(QPoint(x1,y1),QSize()));//知道大小,很少用
	painter.drawRect(QRect(x,y,宽度,高度));//很直观,在坐标x,y处画宽高的矩形
	painter.drawText(QRect(之前的三种参数),"");//画矩形框是为了框出来在哪里写文字
}
//必须是在画东西之前设置画笔,因为画笔风格只能是适用于后面的,但是可以不写画笔,就用默认的
```

### 6.5.2QPainter的高级设置

```c++
QPainter painter(this);
//update():槽函数,可以调用,直接update()即可,清空画布,调用时间间隔短时,不建议这种方法
//repaint():同上,调用:QPaintDevice名->repaint(x,y,width,heigth,bool erase = true);
//如果erase=true,那么在paint之前清空(x,y)宽高为(width,heigth)的区域,间隔时间短时用这个
painter.ellipse(QPoint(100,50),50,50);//画圆
painter.setRenderHint(QPainter::操作参数);//抗锯齿,让图像更好看,但是效率更低
//操作参数:Antialiasing:普通;TextAntialiasing:文本抗锯齿;SmoothPixmapTransform:平滑图像;
//HighQualityAntialiasing:高质量;NonCosmeticDefaultPen:非渗透性荧光笔;
//Qt4CompatiblePainting:Qt4兼容绘画;
painter.ellipse(QPoint(200,50),50,50);//画第二个圆
painter.translate(x,y);//讲话家起始位置移动到(x,y)
painter.save();//把画家状态保存起来,这之后的所有状态都不会改变
painter.restore();//还原状态,这个能解除save,并不会还原到初始状态,画笔位置还在原地
```

### 6.5.3直接画资源文件中的图片

```c++
QPainter painter(QPainterDevice);
painter.drawPixmap(x,y,QPixmap("路径"));//最好是相对路径
//如果手动调用paint,必须要update()一下.
//就是重新调用一遍paint事件,得在paint事件之外写上,否则会陷入死循环
```

### 6.5.4绘图设备

```c++
QPainterDevice的子类为QPixmap,QBitmap,QImage,QPicture
QPixmap专门为图像在屏幕上显示做了优化
QBitmap是QPixmap的子类,他的色深限定为1,可以使用QPixmap的isQBitmap()来确定这个QPixmap是不是一个QBitmap
QImage专门对像素级访问做了优化
QPicture可以记录和重现QPainter的各条命令
```

#### 6.5.4.1QWidget

```c++
//如果想给某个控件绘图的话,必须要使用事件过滤器重写代码:
ui->label->installEventFilter(this);//在label上安装事件过滤器，this指针指定当事件发生时调用当前类中的事件过滤器进行处理
void 类名::myDraw(QLabel * label)//得定义
{
     QPainter painter(label);
     painter.setPen(Qt::gray);
     painter.setBrush(Qt::green);
     painter.drawRect(10,10,20,20);
}
bool eventFilter(QObject *obj, QEvent *event)
{
if(obj == ui->label && event->type() == QEvent::Paint)//发生绘图事件,且是label上发生
     {
             
             myDraw(ui->label);
             return true;
     }
}
```

#### 6.5.4.2QPixmap

头文件`<QPixmap>`

```c++
QPixmap pix(x,y);//设置QPixmap的宽高
QPainter painter(&pix);//直接把pix当做画布,一定要取址!
pix.fill(颜色);//把pix的背景颜色改了,默认是黑色
painter.setPen(QPen(颜色));//颜色可以用QColor,也可以用Qt::颜色名直接写
painter.绘图(参数);//这里就不写具体操作了
pix.save("绝对路径\\pix.png");//这是把pix储存起来,文件操作,不是把pix画在窗体上;重名文件直接覆盖
//这个QPixmap也可以用painter.drawPixmap(x,y,宽,高,pix)来显示
//前提是用QPixmap pix;pix.load("路径");来加载
```

#### 6.5.4.3QImage

头文件`<QImage>`

向img上作画:

```c++
QImage img(宽度,高度,QImage::Format_RGB32);//最后那个参数是格式,这是最常用的,其他的可以去查Assistant
img.fill(颜色);//背景,默认黑色
QPainter painter(&img);//取址取址取址(怨念极大)
//常规画图,就不写了
img.save("路径名");//这里同上,保存成img.png(其实我觉得改名也没什么,最好不要改格式)
修改像素点:
QImage img;
QPainter(this);
img.load("路径");//这个是加载这张图片,最好是资源文件相对路径,如果打开成功,返回true
for(int i = 50;i<=100;i++){
	for(int j=50;j<=100;j++){
		QRgb value = qRgb(r,g,b);//修改像素专用颜色;注意:前面的Q大写,后面的q小写
		img.setPixel(i,j,value);//把(i,j)处的像素改成value的颜色(value是刚刚创建的那个)
	}
}
painter.drawImage(x,y,img);//把img显示出来
```

#### 6.5.4.4QPicture

头文件`<QPicture>`

```c++
QPicture pic;
QPainter painter;
painter.begin(QPainterDevice);//后设置绘图设备,这里用&pic就行.(取址取址取址,艹)
painter.setPen(QPen(颜色));
painter.绘图(参数);//懒得写了
painter.end();//(与上面的painter.begin(参数)对应)画完了,把绘图设备关掉(全部画完之后在写这一行)
pic.save("路径");//这个保存文件的后缀想写什么都可以,因为QPicture自己保存的,自己认识就行
//然后到绘图事件中:
QPicture pict;
pict.load("保存的路径");//加载刚刚保存的文件,把绘图命令输入到pict中
QPainter painter(this);
painter.drawPicture(x,y,pict);//在x,y位置把pict中的命令重现
```

# 七.文件读写QFile

在c中:file;c++中:fstream;Qt中:QFile;

> ps.都是什么鬼

头文件`<QFile>`

## 7.1读写

读取文件内容:

```c++
QFile file("路径");//这个可以是QString,存的是路径名
file.open(QIODevice::打开模式);
//打开模式:NotOpen:?;ReadOnly:只读;WriteOnly:只写;ReadWrite:读写;Append:追加;Truncate:覆盖?;
//Text:文本?;Unbuffered:?;
QByteArray array = file.read();//返回一个QByteArray类型,用array来接收
ui->控件名->setText(array);//也可以,但是如果编码格式是gbk会出现乱码,只能识别utf8
//头文件:<QTextCodec>
QTextCodec *code = QTextCodec::codecForName("编码格式");//写gbk即可
ui->控件名->setText(code->toUnicode(array));//这样就会把array的格式转成刚刚的"编码格式";
//但好像转成"gbk"才能用?
QByteArray array2;
while(!file.atEnd()){//如果没有到文件尾
	array += file.readLine();//把每行的内容读入array中
}
file.open(QIODevice::Append);//如果写的话最好用这个,其他的会直接覆盖掉
file.write(QByteArray);//写入,可以直接用const char*型
file.close();//关闭文件
```

## 7.2文件信息获取

自己查QFileInfo

头文件`<QFileInfo>`

后缀名:`.suffix();`

路径:`.path()或.filePath();`

文件名:`.fileName();`

创建日期:`created() or birthTime();`

最后修改日期:`lastModified();`

最后读取日期:`lastRead();`

> 这三个返回QDateTime型,但是注意,至少在6.0.4版本中QFileInfo就把created改成了birthTime
> QFileInfo info("路径名");//就是文件的路径,其实获取文件路径的两个函数令人很迷惑
> info.created().toString("年/月/日 时:分:秒");//如果不加toString会显示很杂的东西,有很多不需要的信息
> 参数具体:d(1 to 31);dd(01 to 31);ddd(mon. to sun.);dddd(monday to sunday);
> M(1-12);MM(01-12);MMM(jan. to dec.);MMMM(january to december);yy(00-99);yyyy(xxxx)
>> h(0-23);hh(00-23);H(0-23);HH(00-23);m(0-59);mm(00-59);s(0-59);ss(0-59);
> z(毫秒,0-999);zzz(00-999);AP or A(AM or PM,用这个会自动转成12小时制);ap or a(am or pm)


## 7.3 QTextStream

推荐使用这种方式进行文件读写

# N.实例
## n.1登录窗口的创建

窗体标题:选中窗体->右下角->`windowTitle`->改名就行了

禁止改变窗体大小:选中窗体->右下角->`geometry`->改宽高;

还是右下角->`minimumSize&maximumSize`改成一样的,就会被固定住大小

`Display Widgets->label`:标签

`Input->Line Edit`:单行输入框

`Buttons->Push Button:QPushButton`,按钮

### n.1.1布局

但是只是拖拽的话,如果用户改变窗体大小,这些控件位置不会改变.为了赢在更好的用户体验,需要应用布局

Layouts->Vertical Layout:竖直布局

Layouts->Horizontal Layout:水平布局//不推荐上面的两种,因为不灵活

Containers->Widget->选中后上方工具栏可以选择是水平布局还是竖直布局

如果有多行多列的话可以使用栅格布局

用法:将想要绑定在一起(只是空间位置)的控件拖拽到布局里即可

最大的QWidget是QMainWindow本身,也可以选中后在上方该布局.写程序时最好是把主窗体加上布局

但是可能在窗体太大是,控件布局很难看,于是Spacers->两种弹簧,可以放在布局里来维持距离

选中弹簧后在右下角->sizeType,默认是Expanding,意思是可以改变大小,可以改成Fixed,在下面修改属性就可以让弹簧距离保持不变.

打破布局:右上角选中要打破的布局,或选中后在上方工具栏选打破布局

想要改布局的长度或宽度时,选中布局,在右下角找到sizePolicy->水平策略|竖直策略->Fixed即可达到最小适合长度|宽度.

每个控件的边缘都会有9像素的间隙,如果不想要,可以选中后右下角拖到最下面->layout上下左右Margin改成0即可

### n.1.2密码框模式:

选中文本框->右下角echoMode->改就行了

Normal:正常;NoEcho:可以输入,但不会显示出任何东西;Password:用原点来显示;PasswordEchoOnEdit:输入时可看到明文,但是不输入时以密码方式显示.


## n.2翻金币

翻一个金币周围的四个金币会跟着翻转,目标是把所有金币翻成金色

创建一个`QMainWindow`的类作为主窗口,叫做`MainScene`(主场景);

新建两个成员变量,`normalImgPath,pressedImgPath`

### n.2.1按钮特效

自己写一个按钮类,`MyPushButton//C++class`即可

构造函数:

```c++
MyPushButton::MyPushButton(QString str1 , QString str2 = ""){
	//这两个str是为了传递图片的地址用的,第一个是正常显示的图片,第二个是按下时显示的
	this->normalImgPath = str1;
	this->pressedImgPath = str2;
	QPixmap pix;
	bool ret = pix.load(this->normalImgPath);//详见6.5.4.3,虽是QImage,但基本相同
	if(!ret){      //如果打开失败,!ret是true,报告错误信息
		qDebug<<this->normalImgPath<<"fault";//其实可以用QMessageBox::critical
	}
	this->setFixedSize(pix.width(),pix.heigth());//this都是btn,因为是btn调用的这个构造函数
	this->setStyleSheet("QPUshButton{border:Opx;}");//这行代码是说把QPushButton的方形框给去掉,变成不规则图片样式,顺着图片的样式去改变(就是去掉了一些按钮的边边角角,更好的贴和图片)
	this->setIcon(pix);
	this->setIconSize(QSize(pix.width(),pix.heigth()));
}
//别忘了设置父亲setParent(this);//这个是在QMainWindow的构造中调用,this自然指QMainWindow
```

创建两个函数,zoom1()和zoom2();

```c++
void MyPushButton::zoom1(){
	QPropertyAnimation *animation = new QPropertyAnimation(this,"geometry");
//geometry好像是矩形框的意思,告诉他特效创建在矩形框中
	animation->setDuration(毫秒数);//设置持续的时间
	animation->setStartValue(QRect(x,y,width,heigth));//设置开始位置,常用this->x(),this->y(),this->width(),this->heiget(),因为this的动画效果(这里的this是btn,因为是btn调用的这个函数)
	animation->setEndValue(QRect(x,y,width,heigth));//结束时的位置
	animation-setEasingCurve(QEasingCurve::OutBounce);//这个是弹跳动画的意思
	animation->start();//开始执行动画
}
void MyPushButton::zoom2(){
	QPropertyAnimation *animation = new QPropertyAnimation(this,"geometry");
	animation->setDuration(毫秒数);
	animation->setStartValue(QRect(x,y,width,heigth));//设置开始位置
	animation->setEndValue(QRect(x,y,width,heigth));//结束的位置
	animation-setEasingCurve(QEasingCurve::OutBounce);//弹跳动画
	animation->start();//开始执行动画
}
```

在主场景的cpp文件中连接信号和槽:

```c++
MyPushButton *startBtn = new MyPushButton("未按下时图片地址");//第二个参数可以不写,默认值
startBtn->setParent(this);
startBtn->move(x,y);//开始
MyPushButton *backBtn = new MyPushButton(参数);//第二个参数可以不写,默认值
backBtn->setParent(this);
backBtn->move(x,y);//返回
connect(startBtn,&MyPushButton::clicked,[=](){
	startBtn->zoom1();
	startBtn->zoom2();//特效
});
//如果在按钮上面使用了label来显示文字,那么鼠标事件无法穿透label传到btn,需要手动写穿透
label->setAttribute(Qt::WA_TransparentForMouseEvent);
//在上面3.1也有一个setAttribute,是设置关闭时释放的
```

### n.2.2场景的切换

新建一个C++类,名字就叫SceneOne吧,父类是QMainWindow,一定要选上Include QMainWindow

(最好还是QMainWindow或QWidget类,直接用ui来编辑,这里用了C++类,只能用代码来编辑)

在MainScene的头文件中创建实例化对象:`SceneOne *sceneOne = NULL;`

然后在MainScene的构造函数里面初始化:`sceneOne = new SceneOne;`

新加信号:`chooseButtonBack();//选择了返回按钮`

在刚刚的那个连接里的Lambda表达式中继续写:

```c++
QTimer::signalShot(延迟的毫秒数,函数触发者(指针),[=](){    //延迟触发,让动画做完,这第二个参数为this
	this->hide();//设置自身为隐藏
	sceneOne->show();//把场景一显示出来
});
然后在SceneOne的构造函数中新连接一个信号和槽:
connect(backBtn,&MyPushButton::clicked,this[=](){
	emit this->chooseButtonBack();
});
```

最后在MainScene的构造函数中创建一个信号和槽来监听信号:

```c++
connect(sceneOne,&SceneOne::chooseButtonBack,this,[=](){ //这里的sceneOne是上面初始化过的SceneOne的一个实例化类对象
//这里也可以做一个延迟返回,但是懒得写了,看上面的QTImer::signalShot就行,得包含头文件<QTimer>
	sceneOne->hide();
	this->show();
});
//为了保证窗口切换时新窗口出现的位置是一样的,需要在切换窗口的信号和槽的链接的槽函数中写:
新窗口->setGeometry(this->geometry());//就是把this窗口的geometry全交给新窗口
```

### n.2.3按钮图片的切换

重写mousePressEvent事件:

```c++
void MyPushButton::mousePressEvent(QMouseEvent *e){
	if(this->pressedImgPath != ""){
		QPixmap pix;
		bool ret = pix.load(this->pressedImgPath);
		if(!ret){qDebug()<<this->pressedImgPath<<"fualt";}
		this->setFixedSize(pix.width(),pix.heigth());
		this->setStyleSheet("QPUshButton{border:Opx;}");
		this->setIcon(pix);
		this->setIconSize(QSize(pix.width(),pix.heigth()));
	}
	return QPushButton::mousePressEvent(e); //还得把按下的事件交还给父类,触发clicked信号
}
void MyPushButton::mousePressEvent(QMouseEvent *e){
	if(this->normalImgPath != ""){
		QPixmap pix;
		bool ret = pix.load(this->normalImgPath);
		if(!ret){qDebug()<<this->normalImgPath<<"fualt";}
		this->setFixedSize(pix.width(),pix.heigth());
		this->setStyleSheet("QPUshButton{border:Opx;}");
		this->setIcon(pix);
		this->setIconSize(QSize(pix.width(),pix.heigth()));
	}
	return QPushButton::mousePressEvent(e); //还得把释放的事件交还给父类,触发信号
}
```

### n.2.4音效

首先要在工程文件中加上`QT += multimedia            //注释不要写上,这个是包含多媒体的文件`

> 只需要在原本的工程文件中的QT += 的后面加上个multimedia就行
> 

这个时候才能正确包含头文件`<QSound>`

```c++
QSound *名字 = new QSound("路径",this) ;//这个是加载,但是并没有播放
名字->setLoops(次数);//设置循环次数,次数是-1时会无限循环
名字->play();//这个是播放
```

### n.2.5游戏的封装

首先在最左侧一栏最下面找到Debug按键(就是一个电脑的标志,在运行的上面),有一个向右的小三角,点击,选择Release,然后编译,运行一遍看看有没有错误;

然后找到你的文件在文件夹中的位置,找到有一个build-10-Desktop_Qt_6_0_4_MinGW_64_bit-Release的文件夹(之前生成的最后一个单词都是Debug)->release文件夹->.exe文件,打开运行,如果没问题,就把这个exe文件复制到其他文件夹，找到Qt 6.2.2 (MinGW 9.0.0 64-bit)，cd进入生成的exe文件夹，输入windeployqt 名字.exe即可

//我擦，这里不能用powershall，必须找到Qt 6.2.2 (MinGW 9.0.0 64-bit)（就是那个cmd）再输入

想要生成setup.exe,去找NIS Edit,blog.csdn.net/signjing/article/details/7855855

# X:Qt特有的几个代码特性:

## x.1QString:

QString是qt特有的,相当于C++中的string,但是注意了,这个会自动带着引号.去除方法见上文1.5.3,加上.toUtf8().data()即可转换成char*型;

QString的占位符(就是类似于c++中的`&s`,`%d`等)是用%数字来代替的,例子:

```c++
QString str = QString("abc %1 def %2 ").arg(参数一).arg(参数二);
QString str2 =  QString("abc %2 def %1 ").arg(参数一).arg(参数二);//也可以,参数顺序是反着的,但没人会自己找麻烦吧
//然后qDebug就行
```

强制类型转换:`QString::number(int);`

可以强制把int型数据转换成QString型

## x.2QStringList

`QStringList == QList<QString> == List<string>`,就是Qt特有的List容器,操作方法见上文4.4

### x.3QDebug
头文件`<QDebug>`

> 也可以不用包含头文件,好像是在QMainWindow或QWidget中包含了

`qDebug()<<"";`

相当于cout,自动换行,在QtCreator的下面应用程序输出那一栏打印出来

## x.4QColor

```c++
QColor(r,g,b,a);//四个参数分别是啥去找3.3.3.1
Qt::颜色名//这个类似于c++里的那个颜色名,直接抛弃QColor写,注意,一定要把QColor扔了
```

## x.5文件路径

相对路径:以 . 开头,在文件夹下创建

相对资源路径去找2.1.3最后一行

相对路径一个斜线就足够了

绝对路径两个斜线:"D://qt//08"而不是"D:/qt/08"

## x.6

准确来说,这个并不是Qt特有的,只是在qt课程中学到的小技巧:如何用一个循环去创建二位矩阵
宽是4,高是5:

`[i%4][i%5]`即可.

## x.7

创建一个QPushButton时可以使用指针创建,可以在for循环中创建,也可以不维护,只需要连接好信号和槽就行,这样的原理是创建了一个指针,指针被销毁但是指针指向的内容没有被销毁

```c++
for(int i = 0;i < 4;i++){
	QPushButton Btn = new QPushButton(this);
	connect(Btn,&QPushButton::clicked,[=](){...});
}
```

## x.8

修改默认应用图标:

一定要先去网站上转换成ico! 直接改名字改成ico是没有用的! 还会报错!

将转换出来的.ico文件放到与.pro文件同级目录下,在.pro文件中输入`RC_ICONS = 名字.ico`就行了