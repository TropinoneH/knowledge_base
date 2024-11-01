# 准备

下载环境: 为什么不用`GoLand`???

>  注意: Go是一种强类型变量语言, 但是不需要分号, 需要大括号

# 创建工程

直接创建

## 第一份代码

```go
package main
import "fmt" // 系统包,用于打印输出

func main(){ // 主入口
    fmt.Println("hello world!") // Println的ln是最后换行的意思
}
```

## 变量

```go
// var开头, 中间放变量名, 然后放变量类型
//命名规则是驼峰法
var name string = "111"
var name type = <typeof>
/*
type:stirng int float32 float64 bool ptr(指针) 切片(?), func(函数)
*/
//同时定义多个变量:
var(
    age int
    address string
)
//或者:
var a, b *int
// 没有赋值那就会使用默认值:string: "", int:0, bool:false, 指针: nil, float: 0.0
// 简便赋值方法:(但是只能在函数内部)
a := 1 // 可以直接这么写, :=自动推到类型

// swap, 可以直接使用类似python的,=,
a, b = b, a
// 匿名变量_, 类似python
a, _ = myFunc(1)
// 别瞎jb乱定义变量, 变量定义之后没使用会报错
//全局变量: 类似c++的写法
//同时有局部变量和全局变量会有限使用局部变量(就近原则)
```

## 常量

```go
const <name> <type> = <value> // 显式赋值
const <name> = <value> // 隐式赋值

//iota: 内置的常量计数器
{	
    const c1 = "132"
	const PI float32 = 3.14159265358979
	const (
		a = iota
		b
		c = "a"
		d
		e = 114514
		f
		g = iota
		h
	)
	fmt.Println(c1, PI, a, b, c, d, e, f, g, h)
}
/*输出:
132 3.1415927 0 1 a a 114514 114514 6 7
*/
```

# 函数

```go
func myFunc01(<参数>)(<返回值类型>){
    return <返回值>
}
```



# 常用库

```Go
import "fmt"

fmt.Println() // 打印, 最后产生回车, 就是java的println, python的print
fmt.Printf("",) // 打印, 就是c++的printf
/*format:
%T 打印类型
%s 字符串
%d 整数
%f 浮点数
%p 地址, 但是传的参数一定要是一个指针(或加上取址符号'7')
*/
```



