---
type: command
tags:
  - cli
  - software
  - system
done: false
topic:
  - "[[Coding]]"
---
# SH

最基本的shell, 可玩性很差

# Bash

比最基本的shell稍微高级一点, 但是可玩性很差.

不能根据已经输入的内容快速查找, 但是存在历史记录(可以通过<kbd>Ctrl+R</kbd>进行搜索历史记录)

## Syntax

### Shebang and Comments

#### Interpreter Declaration

脚本文件的第一行通常指定解释器路径，这被称为 Shebang。这告诉系统使用哪个程序来执行该文件的内容。

```bash
#!/bin/bash
echo "Hello World"
```

#### Comments

单行注释以井号开头，解释器会忽略该行井号之后的所有内容。

```bash
# 这是一行注释
echo "Code" # 这也是注释
```

### Variables

#### Variable Assignment

变量赋值时，变量名、等号和值之间不能包含任何空格。如果值包含空格，必须使用引号包裹。

```bash
name="User Name"
count=10
```

#### Variable Access

引用变量值时，需要在变量名前加上美元符号。推荐使用花括号包裹变量名，以界定变量名的边界，防止歧义。

```bash
echo $name
echo "${name}Info"
```

#### Read-only Variables

使用 readonly 命令可以将变量定义为只读，后续无法修改该变量的值。

```bash
readonly PI=3.14
# PI=3.1415 将会导致错误
```

#### Unsetting Variables

使用 unset 命令可以删除变量，但无法删除只读变量。

```bash
my_var="test"
unset my_var
```

#### Special Variables

Shell 提供了一些预定义的特殊变量，用于获取脚本参数和状态信息。

`$0` 表示当前脚本的文件名。
`$n` 表示传递给脚本的第 n 个参数，例如 `$1` 是第一个参数。
`$#` 表示传递给脚本的参数个数。
`$*` 表示传递给脚本的所有参数，作为一个整体字符串。
`$@` 表示传递给脚本的所有参数，每个参数作为独立的字符串。
`$?` 表示上一个命令的退出状态，0 表示成功，非 0 表示失败。
`$$` 表示当前 Shell 进程的 ID。

```bash
echo "Script name: $0"
echo "First argument: $1"
echo "Argument count: $#"
echo "Last status: $?"
```

### String Operations

#### String Length

使用井号获取字符串的长度。

```bash
str="abcdef"
echo ${#str}
# 输出: 6
```

#### Substring Extraction

可以通过指定起始位置和长度来提取子字符串。索引从 0 开始。

```bash
str="Hello World"
echo ${str:0:5}
# 输出: Hello
```

#### String Replacement

可以替换字符串中的内容。使用单斜杠替换第一个匹配项，使用双斜杠替换所有匹配项。

```bash
str="apple banana apple"
echo ${str/apple/orange}
# 输出: orange banana apple
echo ${str//apple/orange}
# 输出: orange banana orange
```

#### Default Value Substitution

如果变量未定义或为空，可以返回一个默认值，但不会修改原变量。

```bash
echo ${undefined_var:-DefaultValue}
```

### Arrays

#### Array Definition

Bash 支持一维数组，不需要限定大小。

```bash
array_name=(value0 value1 value2)
# 或者单独赋值
nums[0]=10
nums[1]=20
```

#### Array Access

读取数组元素时需要使用花括号。使用 `@` 或 `*` 可以获取数组中的所有元素。

```bash
echo ${array_name[0]}
echo ${array_name[@]}
```

#### Array Length

获取数组元素的个数或特定元素的长度。

```bash
echo ${#array_name[@]}
# 获取第一个元素的字符串长度
echo ${#array_name[0]}
```

### Arithmetic Operations

#### Double Parentheses

双圆括号结构是进行整数运算最常用的方法，支持 C 语言风格的运算符。

```bash
a=10
b=20
result=$((a + b))
echo $result
((a++))
echo $a
```

#### Let Command

let 命令用于执行算术运算。

```bash
let "sum = 3 + 5"
echo $sum
```

#### Expr Command

expr 是一个用于求值的命令行工具，运算符之间必须有空格，乘号需要转义。

```bash
val=`expr 2 + 2`
mul=`expr 2 \* 2`
```

### Conditional Expressions

#### File Test Operators

用于检测文件的属性。

`-e file` 检测文件是否存在。
`-d file` 检测文件是否是目录。
`-f file` 检测文件是否是普通文件。
`-r file` 检测文件是否可读。
`-w file` 检测文件是否可写。
`-x file` 检测文件是否可执行。

```bash
file="./test.sh"
if [ -x "$file" ]; then
    echo "File is executable"
fi
```

#### Integer Comparison

用于比较两个整数的大小。

`-eq` 等于。
`-ne` 不等于。
`-gt` 大于。
`-lt` 小于。
`-ge` 大于等于。
`-le` 小于等于。

```bash
a=10
b=20
if [ $a -lt $b ]; then
    echo "a is less than b"
fi
```

#### String Comparison

用于比较字符串。注意在方括号中使用字符串变量时，建议加上双引号。

`=` 检测两个字符串是否相等。
`!=` 检测两个字符串是否不相等。
`-z` 检测字符串长度是否为 0。
`-n` 检测字符串长度是否不为 0。

```bash
str1="abc"
str2="def"
if [ "$str1" != "$str2" ]; then
    echo "Strings are different"
fi
```

#### Logical Operators

用于组合多个条件。

`!` 非运算。
`-o` 或运算。
`-a` 与运算。

```bash
if [ $a -lt 20 -o $b -gt 100 ]; then
    echo "Condition met"
fi
```

#### Double Brackets

双中括号提供了更高级的特性，支持模式匹配和正则表达式，且不需要转义大于号和小于号，逻辑运算符可以直接使用 `&&` 和 `||`。

```bash
if [[ $a -lt 20 || $b -gt 100 ]]; then
    echo "Advanced condition met"
fi
```

### Control Flow Statements

#### If Statement

基本的条件判断结构，包含 if, then, elif, else, fi。

```bash
if [ "$1" == "start" ]; then
    echo "Starting..."
elif [ "$1" == "stop" ]; then
    echo "Stopping..."
else
    echo "Usage: $0 {start|stop}"
fi
```

#### Case Statement

用于多重分支选择，类似于其他语言的 switch。每个模式以右括号结束，每个分支块以双分号结束。

```bash
case "$1" in
    "start")
        echo "Starting service"
        ;;
    "stop")
        echo "Stopping service"
        ;;
    *)
        echo "Unknown command"
        ;;
esac
```

#### For Loop

用于遍历列表或序列。

```bash
# 遍历列表
for val in 1 2 3 4 5
do
    echo "Value: $val"
done

# C 语言风格
for ((i=0; i<5; i++))
do
    echo "Index: $i"
done
```

#### While Loop

当条件为真时执行循环体。

```bash
count=0
while [ $count -lt 3 ]
do
    echo "Count: $count"
    ((count++))
done
```

#### Until Loop

执行循环体直到条件为真（即条件为假时执行）。

```bash
count=0
until [ $count -gt 2 ]
do
    echo "Count: $count"
    ((count++))
done
```

### Functions

#### Function Definition

可以使用 function 关键字或直接使用函数名加圆括号定义。

```bash
function my_func() {
    echo "Hello from function"
}

# 或者
other_func() {
    echo "Another function"
}
```

#### Return Value

函数可以通过 return 语句返回一个整数状态码（0-255），通过 `$?` 获取。如果需要返回字符串或数据，通常通过 echo 输出，并在调用处使用命令替换捕获。

```bash
sum() {
    return $(($1 + $2))
}

sum 2 5
echo "Sum result code: $?"
```

### Input and Output

#### Output Redirection

将命令的标准输出保存到文件。

`>` 覆盖模式。
`>>` 追加模式。

```bash
echo "Content" > file.txt
echo "More content" >> file.txt
```

#### Input Redirection

从文件读取输入传给命令。

```bash
wc -l < file.txt
```

#### Error Redirection

将标准错误输出重定向。文件描述符 1 代表标准输出，2 代表标准错误。

```bash
# 重定向错误到文件
command 2> error.log
# 将错误重定向到标准输出
command > output.txt 2>&1
```

#### Pipes

使用管道符将前一个命令的输出作为下一个命令的输入。

```bash
cat file.txt | grep "search_term"
```

#### Here Document

用于将多行文本块传递给命令。

```bash
cat << EOF > output.txt
Line 1
Line 2
EOF
```

### Parameter Expansion

#### Brace Expansion

用于生成任意字符串。

```bash
echo file{1..3}.txt
# 输出: file1.txt file2.txt file3.txt
```

#### Command Substitution

将命令的输出赋值给变量。推荐使用 `$()` 格式。

```bash
date_str=$(date +%F)
# 或者使用反引号
path_str=`pwd`
```

# Zsh

比较高级的脚本. 能够兼容绝大多数的Bash和Sh的指令.

安装方法:
- MacOS自带zsh, 且默认使用zsh
- Windows难以安装. 可以通过git的shell去替换部分文件去安装
- Linux:
	- Ubuntu: `apt install zsh`
	- OpenSUSE: `zypper install zsh`
	- Arch Linux: `pacman -S zsh`
	- ...

详细内容请查看[这里](https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH)

推荐的配置是使用[oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh).

## Oh-My-Zsh

安装方法:
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```
或者使用wget:
```shell
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

启动的时候, 会进行一些询问并默认创建一个配置文件在`~/.zshrc`. 启动zsh的时候, 会默认运行这个配置文件中的所有代码.

如果使用Oh-My-Zsh启动, 那么里面会存在部分只有Oh-My-Zsh才有的配置, 如themes, plugins等等.

### Theme

另一个叫法是prompt, 指的是命令行的提示符.

omz自带了部分的主题, 详情在[Theme](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes/6443ad96899b5f4b752e240f07bc70e40e815ce2)

如果需要安装外部的主题, OMZ也有部分外部主题的预览: [Extern Theme](https://github.com/ohmyzsh/ohmyzsh/wiki/External-themes)

安装方法:
```shell
git clone <theme_repo>
mv <theme_repo> ~/.oh-my-zsh/themes
```
然后将zshrc里面的THEME的值修改成`<theme_repo>`即可

### Plugins

插件是oh-my-zsh的最重要的一环. 自动补全、语法高亮等功能均由插件提供

builtin的插件提供了一些方法如git缩写等功能, 但是更多的功能需要第三方的插件提供

##### syntax highlight

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

然后在`~/.zshrc`的plugins数组中加入`zsh-syntax-highlighting`

##### auto suggestions

基于语法的自动补全.

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

然后在`~/.zshrc`的plugins数组中加入`zsh-autosuggestions`

##### fzf tab

需要安装[[FZF]]命令. 这个插件会在尝试补全的时候触发fzf的界面而不是tab选择的界面, 能更好的选择候选项: [fzf-tab](https://github.com/Aloxaf/fzf-tab)

```shell
git clone https://github.com/Aloxaf/fzf-tab ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/fzf-tab
```

然后在`~/.zshrc`的plugins数组中加入`fzf-tab`. 这个可能会和auto suggestions冲突, 因此推荐关闭其中之一

## Syntax

### Array Indexing and Expansion

Zsh 的数组索引默认从 1 开始，这与 Bash 从 0 开始的规则不同。此外，Zsh 读取数组所有元素时非常简洁，直接使用变量名即可，无需像 Bash 那样必须使用 `[@]` 或 `[*]`。

```zsh
list=(alpha beta gamma)
# 获取第一个元素
echo $list[1]
# 输出: alpha

# 获取所有元素
echo $list
# 输出: alpha beta gamma

# 反向索引，-1 表示最后一个元素
echo $list[-1]
# 输出: gamma
```

### Associative Arrays

Zsh 创建和赋值关联数组的语法更为直观。定义关联数组后，赋值时可以直接按照 `key value` 的顺序排列。

```zsh
typeset -A user_info
user_info=(name "Developer" lang "Zsh" shell "Unix")

echo $user_info[name]
# 输出: Developer

# 输出所有值
echo $user_info
# 输出: Developer Zsh Unix (顺序可能不固定)

# 输出所有键
echo ${(k)user_info}
# 输出: name lang shell
```

### Recursive Globbing and Qualifiers

Zsh 原生支持强大的文件名生成功能。`**` 用于递归匹配子目录，括号内的修饰符用于筛选特定类型的文件或按特定规则排序。`(.)` 仅匹配普通文件，`(/)` 仅匹配目录，`(om)` 按修改时间排序。

```zsh
# 递归列出当前目录及子目录下所有的 .txt 文件
ls **/*.txt

# 仅列出当前目录下的目录
print *(/)

# 列出当前目录下最近修改的一个文件
ls *(om[1])
```

### Variable Modifiers

Zsh 允许在变量扩展时直接使用类似 History Expansion 的修饰符来处理路径或字符串格式，例如 `:h` 获取头部（目录），`:t` 获取尾部（文件名），`:r` 去除扩展名，`:u` 转大写。

```zsh
file_path="/usr/local/bin/script.sh"

echo $file_path:h
# 输出: /usr/local/bin

echo $file_path:t
# 输出: script.sh

echo $file_path:t:r:u
# 输出: SCRIPT
```

### Floating Point Arithmetic

Zsh 的内置算术运算模块可以直接处理浮点数，无需调用 `bc` 或 `awk` 等外部工具。

```zsh
# Bash 中 $(( 10 / 3 )) 结果为 3
echo $(( 10.0 / 3 ))
# 输出: 3.3333333333333335

float_val=1.5
(( float_val += 2.2 ))
echo $float_val
# 输出: 3.7
```

### Short Form Loops

对于简单的单命令循环，Zsh 提供了一种简写的语法，省略了 `do` 和 `done` 关键字。

```zsh
# 遍历通配符匹配的文件
for f (*.zsh) echo "Compiling $f"

# 遍历数值列表
for i ({1..3}) print "Count $i"
```

### Multiple Redirection

Zsh 支持将一个流同时重定向到多个目的地（Multios），这相当于内置了 `tee` 命令的功能。

```zsh
echo "Log Entry" > console.log > backup.log
# 内容会被同时写入 console.log 和 backup.log

cat file.txt > file1 > file2
```

### Parameter Expansion Flags

Zsh 提供了极其丰富的参数扩展标志，位于变量名之前的括号中。例如 `(s:x:)` 用于分割字符串，`(j:x:)` 用于连接数组，`(U)` 用于大写转换。

```zsh
str="foo,bar,baz"
# 以逗号分割字符串为数组
arr=(${(s:,:)str})
print $arr[2]
# 输出: bar

# 将数组用连字符连接为字符串
echo ${(j:-:)arr}
# 输出: foo-bar-baz
```

# Fish

fish初始默认含有[[#auto suggestions]]和[[#syntax highlight]]两个功能. 或者说, 这两个功能就是仿照fish来完成的.

因此, fish基本上可以说是开箱即用的甜品shell

但是fish有一个非常不好的点就是不能使用原始的bahs或者sh的命令. fish有自己的语法, 因此很多zsh或者bash的脚本在fish中完全无法使用

## Syntax

### Variable Assignment and Scoping

Fish Shell 并不使用 `key=value` 的格式进行赋值，而是统一使用 `set` 命令。变量名和值之间使用空格分隔，这消除了 Bash 中关于等号周围空格的严格限制。Fish 引入了通用变量（Universal Variables）的概念，使用 `-U` 标志定义的变量会在该用户的所有当前和未来 Shell 实例中即时共享并持久化，而 `-g` 和 `-l` 分别用于定义全局和局部变量。

```fish
set -l local_var "Only valid in this block"
set -g global_var "Valid in this session"
set -U universal_var "Persists across restarts and sessions"

# 消除变量
set -e local_var
```

### Command Substitution

Fish 彻底放弃了反引号 `` `...` `` 和 Bash 风格的 `$(...)` 语法，仅使用纯圆括号来执行命令替换。这种语法更加简洁，且天然支持嵌套，无需转义。

```fish
set current_date (date +%F)
set files (ls (dirname (status filename)))
echo "Today is $current_date"
```

### Conditionals and Test

Fish 的流程控制结构不使用 `then` 或 `fi` 关键字，而是通过换行符开始代码块，并统一使用 `end` 关键字结束。在条件判断中，Fish 显式使用 `test` 命令或其他可执行命令的退出状态，而不推荐使用方括号 `[...]` 语法。

```fish
if test -f "/etc/hosts"
    echo "Hosts file exists"
else if grep -q "localhost" "/etc/hosts"
    echo "Found localhost"
else
    echo "Not found"
end
```

### Array Handling

在 Fish 中，所有变量本质上都是列表（Arrays）。如果给 `set` 命令传递多个参数，该变量就成为一个列表。列表索引从 1 开始，这与 Zsh 类似但不同于 Bash。访问特定元素使用方括号，统计列表长度使用 `count` 命令。

```fish
set list alpha beta gamma
echo $list[1]
# 输出: alpha

echo $list[-1]
# 输出: gamma

# 切片操作
echo $list[1..2]
# 输出: alpha beta

echo (count $list)
# 输出: 3
```

### Loops

循环结构同样不使用 `do` 和 `done`，而是直接接命令块并以 `end` 结束。`for` 循环可以直接遍历列表或命令替换生成的结果。

```fish
for file in *.txt
    echo "Processing $file"
end

# 结合 seq 命令生成序列
for i in (seq 1 3)
    echo "Count $i"
end
```

### Mathematical Operations

Fish 没有内置类似 Bash `((...))` 的算术扩展语法，而是提供了一个专门的 `math` 命令来处理数学运算。这个命令支持浮点数运算和常见的数学函数。

```fish
set result (math "10 / 3")
echo $result
# 输出: 3.333333

set complicated (math "min(10, 5) * 2")
echo $complicated
# 输出: 10
```

### String Manipulation

Fish 并没有使用复杂的参数扩展符号（如 Bash 的 `${var%pattern}`）来处理字符串，而是提供了一个功能强大的 `string` 内置命令。该命令包含 `match`、`replace`、`split`、`join`、`sub` 等子命令，语法更加易读且统一。

```fish
set str "foo.bar.baz"

# 字符串分割
set parts (string split "." $str)
echo $parts[1]
# 输出: foo

# 字符串替换
echo (string replace "bar" "qux" $str)
# 输出: foo.qux.baz

# 检查前缀
if string match -q "foo*" $str
    echo "Starts with foo"
end
```

### Function Definition and Arguments

函数定义使用 `function` 关键字并以 `end` 结束。Fish 函数不使用 `$1`, `$2` 等位置参数，而是将所有参数放入名为 `$argv` 的列表中。这使得参数处理与普通的列表操作完全一致。

```fish
function say_hello
    if count $argv > 0
        echo "Hello, $argv[1]!"
    else
        echo "Hello, World!"
    end
end

say_hello "Fish User"
```

推荐使用[[Zoxide]]便于文件路径的快速跳转