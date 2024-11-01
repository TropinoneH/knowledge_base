# 高级动画

> 基础: 你需要知道怎么调用@keyframe, 以及keyframe的基本属性, 如infinite, 等等<blockquote 

##  transition

当`transition-property`对应的属性变化的时候, 会通过这个`transition`对应的配置变化.

相当于是给这个`property`添加了一个`onChange`监听, 然后根据`duration`和`timing-function`进行动画



hover: 选择器, 当鼠标悬浮的时候会触发

```css
button {
    height: 90px;
    width: 200px;
    color: white;
    border: none;
    background-color: blue;
}
button:hover {
    background-color: green
}
```

但是直接写上会导致变换过快, 所以需要用一个transition来转换颜色

需要添加两个属性: `transition-property`, `transition-duration`, 可以简写:` transition <property> <duration> <timing-fucntion> <delay>`:

```css
button {
    height: 90px;
    width: 200px;
    color: white;
    border: none;
    background-color: blue;
    transition-property: background-color;
    transition-duration: .5s;
    /*transition: blackground .5s ease;*/
}
button:hover {
    background-color: green
}
```

1. `transition-duration`
    时间单位也可以设置成ms, 毫秒
2. `transition-timing-function`

    ease: 缓降曲线, 开始快, 中间慢, 结束快

    linear: 线性

    ease-in: 开始时慢, 结束之前快

    ease-out: 开始时快, 结束前慢下来

    ease-in-out: 类似ease, 但是有些不同
    
3. `transition-delay`

    延迟, 单位是秒或毫秒, 延迟之后才开始动画

4. `transition-property`

    这个是表示变换的属性, 是可以填写多个的.

    或者如果想要把所有的属性监听, 那么可以使用`all`

如果想要使用`transition`简写多个`transition-property`, 那么需要用`,`隔开

### 可以使用transition的属性

没有中间值的属性, 如position, font-family等

直接去网上搜索就可以

## transform

参数:

1. `transform-origin`

   变化原点, 上下左右中心以及对角一共九个方向. 默认是`center`

   这个也可以填百分比数字. 表示从左上开始, 向右移动第一个百分比的长度, 向下移动第二个百分比的高度.

   当然也可以是其他表示长度的数字, 如`px`, `vh/vw`等等

### scale

缩放, 可以直接填参数. 一个参数表示x, y放大相同倍数, 填两个表示x, y分别放大倍数. 想放大Z轴, 需要使用`scale3d`

细分可以有`scaleX()`, `scaleY()`, 以及3d下的`scaleZ()`

$x>1$是放大, $0<x<1$是缩小

### translate

移动, 同上

细分可以有`translateX()`, `translateY()`, 以及3d下的`translateZ()`

右下是正值, 左上是负值

### rotate

旋转, `rotate(<deg>)`, 度数需要添加单位`deg`. 大于0是顺时针旋转

还有一个单位是`turn`, 表示一整圈, 顺时针旋转

### skew

倾斜, 也是倾斜某一个角度. 和上面的相同, 有`skewX()`, `skewY()`, 3d的`skewZ()`

