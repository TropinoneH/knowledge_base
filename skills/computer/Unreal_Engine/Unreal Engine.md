# Unreal Engine

## 目录结构

- _项目名
  - Blueprints 蓝图
  - Maps 地图
  - Materials 材质
  - Meshes 网格体
  - Textures 纹理
  - FXs 粒子与特效
  - Audio音频
  - Cinematics 过场动画
  - Character 角色
    - 角色名
      - Animations 动画
      - Meshes
      - Testures
      - Materials
    - props 资产
      - 资产名
        - Materials
        - Textures

## 物体的快捷操作

- 按下<kbd>Ctrl + Space</kbd>可以快速打开内容目录

- q选择, w移动, e旋转, r缩放, 类似Unity

- 按住<kbd>Alt</kbd>再加上移动/旋转/缩放可以快速复制一个新的物体. 按下<kbd>Ctrl + D</kbd>也可以, 但是会有略微的不对齐(不推荐)

按住<kbd>Ctrl</kbd>可以多选对象

- 右上角有各种设置, 推荐`世界坐标` `网格吸附: 5` `旋转角度: 10` `缩放倍率: 0.25` `摄像机速度: 0.33`(UE5.3)

- 按住鼠标中键拖拽pivot可以临时改变pivot的位置, 下次再选择的时候会消失. => 可以在选中两个物体的时候推拽pivot到正中间然后旋转.

- 快速定位目标: 在大纲中选择你想要查找的物体, 按下<kbd>F</kbd>键, 在展示页面快速定位到这个对象, 或者直接在大纲中双击这个对象

    快速定位到文件: <kbd>Ctrl + B</kbd>快速定位到文件位置

- 可以在`编辑->项目设置->地图和模式`里面设置默认打开地图, 可以设置编辑器默认打开地图和游戏默认打开地图

- 快速添加物体: toolbar(tab下面)里面有一个加号的按钮, 点击, 然后找到想要添加的内容, 添加

    或者找到`窗口->放置Actor`, 把这个面板勾上, 然后在里面找到想要放置的对象, 拖拽到世界里面.

- 玩家控制器: 在`ThirdPersonBP`里面有一个Blueprints, 这里面有`ThirdPersonCharacter`, 是第三人称控制器.

    一个地图默认使用玩家出生点, 但是有一个问题就是玩家出生点不显示玩家的体型, 所以如果想要显示玩家的样子, 就需要把这个玩家控制器拿出来, 换掉出生点. 然后在玩家的属性那里搜索`pawn`, 找到自动控制玩家, 设置成`玩家0`(或者自己选), 这样才能控制玩家.

    但是这样的话会有一个问题, 摄像机预览窗口可能太大, 可以在`编辑->编辑器偏好设置->关卡编辑器->视口->外观`里面找到`摄像机预览大小`然后改小. 或者直接在`编辑->编辑器偏好设置`里面搜索`cam`然后再找就行
    
- 运行游戏的时候按下<kbd>F8</kbd>可以脱离游戏, 进入编辑器模式, 但是还是保持游戏运行状态

- 选中两个对象, 然后`右键->将Actor转换为静态网格体`, 然后就可以把这两个对象合并, 并保持相对大小/位置/旋转不变, 类似Unity里面的给两个对象添加一个父物体然后保存预制体

- 在大纲里面找到一个物体, 最左侧有一个眼睛, 可以关掉, 设置不可见

    但是这样还会在游戏模式里面渲染. 想要取消, 需要把`Details->Rendering->Actor Hidden in Game`勾上

- 按<kbd>G</kbd>取消选中

## 创建第一个蓝图Actor

- Actor: 理解成对象, Unity里面的Object即可

蓝图: 脚本, Unity里面的C#脚本

蓝图注释: 在空白处按住左键, 拖动鼠标选中需要添加注释的节点, 按下<kbd>C</kbd>键, 即可快速添加注释

### Hello World

目标: 展示Text, 然后当玩家进入, 把展示文字改成另一个文字

1. 创建: 在Blueprints里面右键(或者点击那个添加按钮), 选择`蓝图类`, 然后选择父类(最基本的就先选`Actor`), 改名字(最好是写上前缀`BP_`), 保存
2. 双击进入蓝图编辑器(或者选中然后<kbd>Ctrl + E</kbd>)(注意可直接把新生成的页面拖到原来的页面里面去). 选择`视口`, 右侧添加, 添加一个盒子碰撞体(Box Collision)(Unity里面的Collider的trigger为true的时候), 然后添加一个文本渲染组件(Text Render)
3. 更改文本渲染组件的位置, 在文本渲染组件的`细节->文本->文本`里面可以修改渲染的文字
4. 点击编译<kbd>F7</kbd>然后保存即可
5. 在Box Collision里面`细节->事件`找到`当组件重叠时`, 然后添加一个事件, 发现会自动跳转到事件图表界面. 这是一个类似Unity行为树的一个界面. 左键长按移动是连接一条新的线, 如果松开的地方没有匹配, 那么会让你新建一个事件
6. 把Text Render拖拽到这个界面里面, 拉出一个事件叫做Set Text(这时候默认会绑定到Targer上面). 右键value, 选择提升为变量, 就创建出来了一个名字叫做value的变量, 然后可以把这个的默认值设置成你想要变换的值(文字)
7. 编译保存

### 火焰粒子效果

1. 创建一个蓝图, Actor
2. 添加一个Cascade Particle System(旧版的粒子系统), 添加碰撞体(Box Collider)
3. 先设置粒子系统模板是`P_Fire`, 然后设置可视(visible)为false(默认不显示)
4. 添加两个碰撞体事件, 进入退出, 把粒子系统拖拽到面板里面, 链接一个新事件: set visible, 设置`new visible`为true. 退出的时候把这个`new visible`改成false即可
5. 编译保存

## 添加资源

在Epic Games Launcher里面找到库, 最下方有一个保管库, 这里面有所有下载的资源

如果是兼容的版本, 直接点击`添加到工程`即可. 如果不是, 那么可以线创建一个工程(添加进去), 然后再找到那个工程的`content`文件夹, 在里面找到对应的文件夹, 拖拽给你需要的工程即可.

> 所有的游戏资源都应该放在content文件夹下

## 玩家控制高级

### 冲刺

首先在`编辑->project settings->Input->Action Mappings`, 点击加号添加一个设置, 叫做Sprint, 冲刺, 然后设置成<kbd>Left Shift</kbd>

接下来在角色控制蓝图中, 右键, 搜索`Sprint`, 就是刚刚创建的Action的Name, 创建一个新的node节点(叫做`InputAction sprint`)

把Character Move Controller拖拽到编辑器视图里, 拉出来一个事件叫做`set max walk speed`, 设置成1000

再来一个事件, target还是Character Move Controller, 还是`set max walk speed`, 设置成600(默认速度)

把最开始创建的`InputAction sprint`这个节点press设置给1000的那个, release设置给600的那个

### 调整角色移动的参数设置

1. `gravity`设置成2.8
2. `max accelerations`设置成10000
3. 设置`jump z velocity`为900
4. 设置`air control`为0.3

### 视角摇晃

1. 创建新的蓝图, 命名为`BP_WalkShake`, 继承自`LegacyCameraShake`

2. 进入蓝图, 在Details面板里面设置, 

   1. `Oscillation Duration`表示事件发生的时长(设置一个极大的数, 10000000000, 表示这个只要触发就一直发生). 

   2. `Oscillation Blend in/out Time`表示进入退出需要的事件, 平滑动画过渡用的, 不用改. 

   3. `Rot Oscillation`, 表示摇晃的时候的旋转, 一般用不到

   4. `Loc Oscillation`, 表示摇晃的时候的位置变化, 一般用这个多. 模拟走路摇晃的时候设置

      1. `Y`: `Amplitude`(振幅): 5.0, `Frequency`(频率): 7.0, `Initial Offset`(初始偏差): `Random`(不变), `Waveform`(类型): `Sine Wave`(正弦波, 不变)
      2. `Z`: 3.0 - 15.0 - `Zero`(初始偏差为0) - `Sine Wave`

      注意: 还有一个wave form叫做`Perlin Noise`柏林噪声, 随机算法

   5. `FOVOscillation`: 不变

3. 到角色控制器蓝图里面

   1. create node `GetVelocity`,  right click the pin "return value", select `split struct pin`, convert the return value from  a vector to three float value: `X`, `Y`, `Z`.

   2. create two node, `greater`, compare with 50(set the other pin 50.0), connect with return value `X` and `Y`. similarly, create two node `less`, compare with -50.

      this is to determine if you are walking, that is, the velocity is greater than threshold.

   3. create node `OR Boolean`, add pins, then connect the above four pins at the same time.

   4. create node `is Moving On Ground`, use the `AND Boolean` to concatenate the return value of `is Moving On Ground` and `OR Boolean`

   5. create node `Event Tick`, create node `Branch` connected with `Event Tick`, use the return value of the node `AND Boolean` as condition.

   6. create two `Sequence`, respectively connect with out pin of `Branch`, `True` and `False`.

      create two `Do Once`, the input `exec` pin connect with an `Sequence` and the `reset` pin connect with another `Sequence`.

   7. create node `Get Player Camera Manager`, add event called `Start Camera Shake`, select the blueprint you just create(`BP_WalkShake`) at `Shake Class `.

      connect the `Do Once` which connect with the `Sequence` with true condition

      create event `Stop Camera Shake`, connect the `Do Once` which connect with the `Sequence` with the false condition. and the `target` is the return value of `Start Camera Shake`

4. save and complie

## 动画初步

### 移动动画初步

> 这里的动画都是按照最基本的UE小白人来做的. 只是基础做法

1. 创建角色蓝图: 

   `右键->Blueprint->character`, 在里面的Mesh选择`SKM_Quinn`, 就是女性的小白人
   
   添加输入映射, 移动, 跳跃, 视角转换等蓝图(参考`BP_ThirdPersonCharacter`)
   
   添加组件Sprint Arm, 摄像机臂, 设置location的Z=50, `target arm length`=300
   
2. 创建动画蓝图:

   `右键->Animation->Animation Blueprint`, 在父类是`AnimationInstance`下找到`SK_Mannequin`, 创建

   一定要是`AnimationInstance`, 否则没有动画的窗口

   然后去之前创建的角色蓝图里面找到Mesh, 设置Animation为动画`Animation Mode`为`Use Animation Blueprint`, 设置`Anim Class`为创建的那个动画蓝图

3. 创建混合树(混合空间)

   `右键->Animation->Blend Space`, 选择刚刚蓝图的骨骼, 设置`Axis Settings->Horizontal Axis->Name`为Speed, 最小值为0, 最大值600

   把右下角的动画, 找到Idle, Walk,  Run, 拖到下面的那个图里面, 按照0: Idle - 200(左右): Walk - 600: Run的样子拖拽, 就创建了一个混合树(一维的, 但是不提供`Blend Space 1D`了, 所以用2D的模拟)

   按住<kbd>Ctrl</kbd>键, 并在混合窗口移动鼠标即可模拟值的改变, 可以直观看到动画的具体表现

4. 混合动画

   在创建的动画蓝图中右键, state machine创建一个状态机, 连接到`Output Pose`的`Result`口.

   双击进入state machine, 右下角找到Assets Browser标签, 把刚刚创建的混合树拖拽到面板里, 用entry连接

   双击进入混合树, 把Speed拖拽出去, 选择`Promote to variable`(提升为变量)

5. 连接动画与事件

   回到动画蓝图的Event Graph, 有两个node

   - `Event Blueprint Update Animation`: 每一帧动画更新的时候调用
   - `Try Get Pawn Owner`: 获取蓝图所在的`Character Controller`

   先校验是否获取到了蓝图: 连接一个`is Valid`的branch(灰色的那个), 然后把那个每帧调用的那个给连接到`is Valid`的`exec`的pin口. 然后再从`TryGetPawnOwner`的return value获取`Get Velocity`, 然后获取`Velocity Length`

   接下来从`is Valid`的验证通过pin口连接一个`Set Speed`, 或者从左下角的variable那里找到Speed, 拖拽给那一个pin口, 变成了`Set Speed` (直接拖到空白处是提示你去Get还是Set, 按住<kbd>Alt</kbd>拖拽是Set, 按住<kbd>Ctrl</kbd>拖拽是获取这个变量本身, 可以用来比较`Greater`等等)

6. 设置行走与冲刺

   默认是一个600的最大行走速度, 所以没有行走的动画.

   先找到角色蓝图, 找到`Character Movement`, 设置初始`max walk speed`为200(与行走的Blend Space相同),  然后在事件蓝图中, 右键, `Left Shift`, 剩下的就和之前的冲刺逻辑相同, 只不过是设置`max walk speed`为600

7. 获取跳跃

   1. 先在动画蓝图的Event Graph里面添加一个`TryGetPawnOwner`的`GetMovementComponent`, 从这里面获取`isFalling`, 并把这个return value promote to variable(会直接变成set node), 改名为`isAir`, 然后从之前的Set Speed node里面拉出来一个exec连接过来
   
   2. 进入Anim Graph里面, 进入状态机, 拖拽相应动画到编辑器视图, 如: `Jump`, `FailLoop`, `Land`等等, 用state transition连接(连线)
   
   3. 设置状态转移条件
   
      双击进入从blend space进入jump的条件中, `CanEnterTransition`里面拉出来一个value, `isAir`(`Get IsAir`)
   
      > 注意Jump这个动画不要设置循环
      >
      > 可以进入Jump动画, 然后在Jump的Node里面的Details面板找到`loop animation`选项
   
       双击进入Jump到Fail Loop动画的转移条件, 获取上一个动画的剩余时间`Get Relevant Anim Time Remaining`, return value与0.1比较(小于), 然后转换
   
      双击进入Fail Loop到Land的动画, 判断`isAir`为false(`NOT Boolean`), 这时候转换
   
      双击进入Land到Blend Space的过渡, 如jump->loop的条件, land也是不能为loop.
   
   <blockquote alt="danger"><p>这里有bug, 跳起来之后落地会消失, 不知道为什么</p></blockquote>

### 动画重定向

1. 选择原始动画, 右键, Retarget Animation Assets, 选择Duplicate and Retarget Animation Assets/Blueprints
2. 选择一个IK骨骼, 作为转换的目标, 然后在Source的那里选择这个动画原来绑定的对象, 在Retarget那里选择重定向的目标
3. 更改前缀后缀(可以不改), 替换掉原来的名字, 选择保存的地址, 点击创建即可

## 初涉地形

### 地形编辑

<kbd>Shift + 2</kbd>快速打开一个地形编辑器

首先先选择一个合适的材质, 然后设置大小, 最后点击创建, 就可以编辑了

常用工具: 

1. 雕刻 Sculpt

   最常用的, 直接点击会造山, 拉高地形, 按住<kbd>Shift</kbd>再点击会削减地形

   但是通常会让这个地形太突兀

2. 平滑 Smooth

   让棱角变得平滑

3. 侵蚀 Erosion

   让山以一种比较温和自然的方式呈现山脊

4. 水力 Hydro

   没看出来效果, 听说是添加水流运动的效果的

5. 噪声 Noise

   可以调参数, 随机噪点起伏(看不大出来), 更自然(?)

### 植被编辑

<kbd>Shift + 3</kbd>打开植物种植, 有多种类型, 可以多选(一起种植)

可以从文件夹中找到需要的植物, 然后拖拽到选择植物的面板里面, 就可以放置了

选中paint就可以点击放置植物, 按住<kbd>Shift</kbd>可以变成erase清除掉不想要的植物

调整密度: 选中想要调整的植物(可以按住<kbd>Shift</kbd>选中多个, 一起调整), 然后在下面找到Density(密度), 调整成自己喜欢的样子即可

下面还有不同的设置, 比如说缩放等等

## 视觉效果

### 指数级高度雾

关掉自带的雾(那个有的地方调节不对劲), 搜索添加一个`ExponentialHeightFog`指数级高度雾

- Fog Density, 密度, 越大雾越浓. 拖动最大设置到0.5, 但是可以自己手动修改成更大的数值(没必要). 但是设置成1的时候很适合设计一些解密恐怖类的游戏

- Fog Height Falloff是衰减速度, 越大衰减越厉害

- 可以调整颜色, 略微偏脏的感觉可以调整在偏黄棕色, 梦幻一点的可以偏蓝紫色

- volumetric fog 体积雾: 用来给光添加散射

  搜索light, 可以找到光源, 然后可以更改Intensity强度, 颜色, 以及找到Light Shafts(光束)打开, 调整Layer Mask Darkness(遮挡面罩暗度), 调整至0.015, 这样可以产生丁达尔效应

### 天光

将整个天空照亮之后成为一个泛光源, 可以把所有因为直射光源遮挡但是暴露在天空下的地方照亮

一般只能有一个天光源

- 可以设置Intensity Scale强度范围, 可以到很大的数值, 但是一般在1就可以

### 后期处理体积

在`place Actor`(放置Actor)面板中找到visual effects, 找到post process volumn, 添加

- 在Post Process Volume Settings里面有一个infinite extent(无限范围), 表示这个可以处理全部的内容, 而不是特定区域的内容

- 在Lens(透镜)里面

  - 可以找到Bloom, 可以在Intensity(强度)这里设置光强, 需要打上勾才能设置
  - Exposure曝光值, 调整可以改变高光和低光区域的相对亮度, 调低可以增加高光地方的亮度降低背光区域的亮度
  - Chromatic Aberration: 能让画面"质壁分离", 把颜色分离, 调大Intensity可以营造出眩晕或者中毒的特效. Start Offset是调整画面从哪里开始出现这种情况, 调最大就会直接失去这个效果(百分比, 变成了从屏幕外部才开始这个效果)
  - dirt mask: 给镜头蒙上一层脏东西, 调到比较大的值才会显示出来
  - Lens Flares: 打开之后会看到镜头的眩光, 有一束明显的光照(断续, 粒子感), 镜头对准太阳才能看到. 一般用于显示天气晴朗
  - Image Effect: 让四周边角变暗, 可以做那种击中重伤倒地(红色)或者潜入过程(视野受限)等情况. 

- Color Grading颜色分级:

  用于后期的调色功能

  - White Balance白平衡: 一般不动, 摄影相关的可以调整
  - Global: 全局设置
    - Saturation饱和度
    - Contrast对比度
    - Gamma伽马(?): 画面的亮度(类似曝光...?)
    - Gain增益: 还是画面亮度(...?) 不懂
  - 还可以调整其他的比如暗部中部高光部分的特殊调整

## 粒子系统

`右键->Niagara System->New System from Selected Emitter(s)(来自所选发射器的新系统)->下一步`, 然后可以选择想要做的粒子

### 发光灰尘

这里以Hanging Particulars漂浮粒子作为例子(●'◡'●)

1. 选中黄色的那个Hanging Particulates, 找到Emitter Properties, 找到里面的Sim Target(模拟目标), 使用GPU的那个.
2. 找到Spawn Rate, 可以更改生成数量(5000)\
3. Shape Location, 更改Box Size可以更改生成的范围(3000, 3000, 1000)
4. 找到Initialize particle, 调整RGB的数值大于一就可以实现发光, 越大发光越强(5, 5, 12)(泛蓝光). 如果调的很大, 会更梦幻, 详细参照光遇

## 音频系统

导入音频: 只能导入wav/aif文件. mp3不能直接导入. 但是好像.flac可以直接导入

使用: 直接把这个音频文件拖拽到场景中就可以, 是全局的音频文件

### 循环播放的设置

双击进入, 如果没有显示Details面板, 可以`window->Details`来找到这个窗口

然后找到looping循环, 勾上, 保存即可

### 进入某个范围才能听到

打开Allow Spatialization允许空间化(默认打开的), 然后打开Override Attenuation重载衰减即可

## 材质基础

#### 基础知识

在主节点上, 选中, 有一个`Material`的子菜单, 里面有一个混合模式Blend Mode, 表示这个材质的样式. 比如: Opaque不透明, Masked遮罩, Translucent半透明(如, 玉石, 玻璃等)等等

还有一个boolean叫做Two Sides, 因为内部看一个obj是没有材质的(透视), 勾上这个之后, 在里面也可以看到材质

参数:

- Base Color: 基础颜色设置. 
- Metallic: 金属度, 右键然后提升为变量, 设置即可
- Specular: 高光度, 同上
- Roughness: 粗糙度, 同上
- Emissive Color: 自发光, 同上, 设置颜色, 然后数值大于1就是发光

#### 纹理贴图

Base Color可以设置贴图. 按住<kbd>T</kbd>然后点击鼠标左键可以创建一个Texture Sample(贴图采样), 然后把这个的RGB给到Base Color, 然后给这个node设置一下Texture就可以让这个材质球展示这个贴图

但是直接附上的贴图"很平整", 所以要给他做一下法线贴图, 让这个变得凹凸有致

选中刚刚的纹理贴图, 复制一份, rgb连接到Normal这一个参数, 然后修改贴图为对应的法线贴图(eg. 我使用了T_Wood_Pine_D, 对应的法线贴图就是T_Wood_Pine_N)

#### 导入自己的图片作为纹理

一定一定要选中, <kbd>Ctrl + C</kbd>复制, 但是这里不能直接粘贴过去, 而是要在UE中的文件夹中右键, 选择导入到..., 然后直接<kbd>Ctrl + V</kbd>粘贴给文件栏, 而不是直接选中!

这样导入之后, 随便给一个对象拖拽过去, 生成material之后可以<kbd>Ctrl + Z</kbd>撤回, 但是这时候创建的材质还在, 然后就可以修改材质了

#### 贴花

选择主node, 找到Material Domain(材质域), 更改为Deferred Decal延迟贴花, Blend Mode改为Translucent, 然后把texture的a(透明度)连接给主node的opacity即可

这个是可以直接在一个物体上面多加一个贴图而不更改这个物体本身的材质. 可以调整颜色缩放旋转等.

取消贴花: 在需要不接受贴花的物体上的Details里面所搜receives decal, 取消即可

> 取消贴花的原因是, 只要放置下贴花, 所有根贴花重叠的区域都会贴上花. 所以一些不想要贴花的需要手动取消掉

#### 制作法线贴图

需要用到Photoshop

把需要生成法线图的贴图拖进去, 然后`滤镜->3D->生成法线图`即可. 可以调整参数.

然后<kbd>Ctrl + Shift + Alt + W</kbd>导出, 格式用png

然后用相同的方法进行导入, 在材质蓝图界面创建一个Texture Sample的node, 把texture换成法线贴图, 把rgb连接到主节点的normal参数上

## 玩家常见技能设置

### 二段跳

在角色蓝图中选中角色蓝图类(就是左上角的对象列表的根对象), 找到Max Jump Count, 设置成2即可

### 设置CD

1. 在技能的触发之前(就是按键或其他事件出发后)加上一个`DoOnce`节点, 表示只能做一次, 想要做的话只能是有个触发reset的事件
2. `右键->add new Event`, 命名, 把这个事件的触发给到`DoOnce`的reset的pin口
3. 新增一个变量叫做Cd, 设置这个变量的类型为float, 编译后设置默认值
4. 新增节点Delay, 把刚刚的变量赋值给等待时间. 等待结束之后手动触发刚刚设置的事件
5. 把这个技能结束的node连接给Delay节点

### 设置能被玩家拾取的技能石

1. 创建一个蓝图, 重命名, 进入
2. 添加一个Static Mesh(静态网格体), 添加一个Sphere Collision(球形碰撞箱)
3. 添加事件, 当碰撞箱碰撞的时候, 先获取玩家`GetPlayerCharacter`, 然后`SetMaxJumpCount`设置为2(这里以能够二段跳为例)
4. 最后连接`DestroyActor`销毁自身

### 设置上下浮动

1. 创建`Timeline`时间轴, 添加一个float的轨道叫做alpha. 
2. 增加关键帧, (0,0), (1,1), (2,0)
3. 设置为循环, 自动播放, 使用最后一个关键帧(这个是为了能够让这个关键帧首尾相连)

### 萤火(释放萤火虫, 点亮空间)

1. 选择合适的动画, 重定向到骨骼和角色
2. 创建粒子系统: 右键, Niagara System, New System from selected emitter, 找到Omnidirectional Brust(可以发射出一堆粒子), 重命名, 进入
   1. 默认是一堆粒子往下面掉落, 所以把gravity force取消掉
   2. 配置往外发散的距离: 找到Add Velocity From Point, 更改Velocity Speed的max和min (如, 100, 50)
   3. Initialize Particle里面的: 
      1. 生命周期改成8-10秒
      2. Sprite Mode改成1-3(这个是设置粒子的大小缩放)
   4. 由于粒子太过单一, 所以找到Particle Update, 添加一个Curl Noise Force(卷曲噪声)场, 一个向量场, 设置Noise Strength为200, 并把Drag这个选项拖到Curl Noise Force下面, 并设置Drag为2
   5. 设置发光: Scale Color的RGB加大
   6. 给Renderer渲染器这里添加一个Light Renderer光线渲染器, 设置Radius Scale(半径缩放)为200, 并添加一点点颜色
