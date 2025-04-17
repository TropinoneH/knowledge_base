---
tags:
  - tutorial
  - rust
---
after [[RustInstall]]

high relative with [[Syntax]]
# Variable

in rust, we use `let v = value;` to bind a `value` to the variable `v`. We say "bind" instead "assign" because the [[#Ownership]] of rust.
## Basic Type

### Integer

| length                           | type with sign | type without sign |
| -------------------------------- | -------------- | ----------------- |
| 8 bit                            | i8             | u8                |
| 16 bit                           | i16            | u16               |
| 32 bit(most common)              | i32            | u32               |
| 64 bit(`long` type in cpp)       | i64            | u64               |
| 128 bit(`long long` type in cpp) | i128           | u128              |
| different per architecture       | isize          | usize             |

Literal:

| literal             | example       |
| ------------------- | ------------- |
| decimal             | `10`, `10_00` |
| hexadecimal         | `0xff`        |
| octal               | `0o77`        |
| binary              | `0b11`        |
| byte(only for `u8`) | `b'A'`        |

Overflow:

detect overflow only in `DEBUG` mode. `RELEASE` mode will handle overflow with [[CS110#two's-Complement|two's complement wrapping]] rule.

- use `wrapping_*` to handle overflow by `two's complement wrapping` in all mode, e.g. `assert_eq!(255u8.wrapping_add(2), 1)`
- use `checked_*` return `None` when overflow occurred, e.g.
	```rust
	if let Some(add) = 255u8.checked_add(1) {
		println!("255 + 1 = {}", add);
	} else {
		println!("255 + 1 overflowed");
	}
	```
- use `overflowing_*` return the value and a boolean variable indicating overflow, e.g.
  ```rust
	let (val, overflowed) = 255u8.overflowing_add(1)
    println!("255 + 1 = {}, overflowed: {}", val, overflowed);
	```
- use `saturating_*` to limit to not more than the maximum value of the target type or less than the minimum value, e.g.
  ```rust
	assert_eq!(100u8.saturating_add(1), 101);
	assert_eq!(u8::MAX.saturating_add(127), u8::MAX);
	```

### Float

- `f32`: same as `float` type
- `f64`: same as `double` type

implement by [[CS110#Representation of number|IEEE-754]], is the approximation of real number, not exactly.

### NaN

not a number. any operation with `NaN` will return `NaN`.

### Range

Simply use `..=` to generate. Only allowed to use on `integer` or `char`, because they are "distinguishable and continuous"(In fact, they are "discrete").

```rust
for i in 1..=5 {
    println!("{}",i);
}
for i in 'a'..='z' {
    println!("{}",i);
}
```

### Rational and irrational numbers

not in `std` lib. add dependency `num` to `Cargo.toml` to enable them.
```rust
use num::complex::Complex;

fn main() {
	let a = Complex { re: 2.1, im: -1.2 };
	let b = Complex::new(11.1, 22.2);
	let result = a + b;
	
	println!("{} + {}i", result.re, result.im)
}
```

### Char

use `unicode` code set, not `ascii`. so each `Char` occupied 4-byte.

`''` for `Char`, and `""` for String.

### bool

only two value, `true` or `false`

each value occupied 1-byte

### Tuple

totally same as [[SI100B#tuples|python tuple]]

in fact, decompose a tuple is a [[Syntax#match|Pattern Match]].
```rust
let (x, y, z) = (1, 2, 3);
// let (x, y) = (1, 2, 3); // error
/*
error[E0308]: mismatched types
 --> src/main.rs:4:5
  |
4 | let (x, y) = (1, 2, 3);
  |     ^^^^^^   --------- this expression has type `({integer}, {integer}, {integer})`
  |     |
  |     expected a tuple with 3 elements, found one with 2 elements
  |
  = note: expected tuple `({integer}, {integer}, {integer})`
             found tuple `(_, _)`
For more information about this error, try `rustc --explain E0308`.
error: could not compile `playground` due to previous error
*/
```
## Composite Type

### String

**Slice**

same as python, use `[..]` to create a slice(similar with [[#Range]] syntax):
```rust
let s = String::from("hello world");
let hello = &s[0..5];
let world = &s[6..11];

let start_to_second = &s[..2];
let third_to_last = &s[3..];

let whole = &s[..];
```

> [!warning]
> the Chinese character in UTF-8 occupied two byte, so `"中国人不骗中国人"[..2]` will make problems, and `"中国人不骗中国人"[..3]` will make no error.
> 
> all the operation with Chinese character should be careful.

also, array has slice.
```rust
let arr = [0, 1, 2, 3, 4, 5];
let slice = &arr[1..3];
```

**String**

the type of literal string is `&str`, a immutable reference of `str`.

`String` is a complex type.

By default, they are both UTF-8 encoded.

```rust
let s: &str = "Hello, world";
let ss: String = String::from(s); // 通过String::from函数, 将&str类型转换为String类型

let ref_ss: &str = &ss; // 直接取引用就可以把String类型转换成&str类型
let ref_ss_2: &str = ss.as_str(); // 或者使用函数 .as_str进行转换
```

`String` type cannot get char by index. turn into `&str` and then use indexing

**operations**

```rust
let mut s = String::from("hello"); // the variable must be mutable
s.push_str(" world"); // append &str, "hello world"
s.push('!'); // append char, "hello world!"

s.insert_str(5, ", "); // insert &str, "hello,  world!"
s.insert(7, '|'); //insert char, "hello, | world!"

let s2 = String::from("Learn rust, use rust."); // replace is not a in-place function, so there is no need to use a mutable keyword.
let new_s = s2.replace("rust", "RUST"); // "Learn RUST, use RUST." case sensitive.
let new_s2 = s2.replacen("rust", "RUST", 1); // "Learn RUST, use rust." replace n-th.
let mut s3 = String::from("learn rust, use rust."); // replace_range is a in-place function, so must use mutable
s3.replace_range(6..10, "R"); // "learn R, use rust." remove the slice, and replace by &str

let mut s4 = String::from("Please delete this string"); // pop is in-place
let p1 = s4.pop(); // p1 = Some('g') is a Option<char> variable, and s4 = "Please delete this strin"
s4.remove(1); // "Pease delete this strin" in-place, no reture value
s4.truncate(3); // "Pea" in-place, truncate with limited length
s4.clear(); // ""

let mut s5 = String::from("left");
let mut s6 = String::from("right");
let res: String = s5 + &s6; // "leftright" RHS must be &str. (&String automatically de-reference to &str). the result will be immutable
let mut res = res + "!"; // "leftright!" use shadowing to make res mutable
res += "!!!"; // "leftright!!!!"
```

### Struct

Define:
```rust
struct struct_name {
	member1: Type,
	member2: Type,
	member3: Type,
}
struct tuple_struct(Type, Type, Type); // we don't care about the member name, such as Point(f32,f32) or Color(u8,u8,u8)
struct unit_struct; // we don't care about the member.
impl SomeTrait for unit_struct {} // we just care the action of this struct

let mut struct_var1 = struct_name {
	member2: init_val2,
	member1: init_val1,
	member3: init_val3,
} // must initialize all variable, not same order

struct_var1.member3 = new_val3; // update val, the strcut variable must be declared as mutable

let member3 = new_val;

let struct_var2 = struct_name {
	member3,
	..struct_var1,
} // same syntax as typescript object, but `..` must be at the last of struct init
```
> [!warning]
> If `Type` be the composite type such as `String`, after update `struct_var2` by `..struct_var1`, the variable `struct_var1.member*` will be move and borrow.
> 
> If we want to use reference in the struct, we must use [[#Lifetime]] specifier.

use macro `#[derive(Debug)]` to allow debug [[Syntax#Trait|trait]]:
```rust
#[derive(Debug)]
struct test {
	member: i32
}

let a = test {
	member: 5
}

println!("{:?}, {:#?}", a, a);
/* output:
TestS { member: 1 }, TestS {
    member: 1,
}
*/
```

### Enum

```rust
enum Message {
    Quit, // a single type
    Move { x: i32, y: i32 }, // a struct type
    Write(String), // a type bind a value
    ChangeColor(i32, i32, i32), // a tuple struct
}

fn main() {
    let m1 = Message::Quit;
    let m2 = Message::Move{x:1,y:1};
    let m3 = Message::ChangeColor(255,255,0);
}
```

another example is `Option<T>` with [[Syntax#Generics|generics]], use [[Syntax#match|match]] to decomposition:
```rust
enum Option<T> {
	Some(T),
	None
}

let x: Option<i32> = ...;
let res = match x {
	Some(i) => Some(i + 1), // lambda, return anything you want
	None => None, // lambda
};
```

### Array

```rust
let a: [i32; 5] = [1,2,3,4,5]; // Type: [Type; length], fixed length
let i = a[0]; // get element by index
let repeat_arr = [3; 5]; // [3,3,3,3,3] repeat first element
// if the first element doesn't impl a Copy trait, use from_fn
let repeat_str: [String; 8] = std::array::from_fn(|_i| String::from("repeated"));
```

full example:
```rust
fn main() {
	// 编译器自动推导出one的类型
	let one             = [1, 2, 3];
	// 显式类型标注
	let two: [u8; 3]    = [1, 2, 3];
	let blank1          = [0; 3];
	let blank2: [u8; 3] = [0; 3];
	
	// arrays是一个二维数组，其中每一个元素都是一个数组，元素类型是[u8; 3]
	let arrays: [[u8; 3]; 4]  = [one, two, blank1, blank2];
	
	// 借用arrays的元素用作循环中
	for a in &arrays {
		print!("{:?}: ", a);
		// 将a变成一个迭代器，用于循环
		// 你也可以直接用for n in a {}来进行循环
		for n in a.iter() {
			print!("\t{} + 10 = {}", n, n+10);
		}
		
		let mut sum = 0;
		// 0..a.len,是一个 Rust 的语法糖，其实就等于一个数组，元素是从0,1,2一直增加到到a.len-1
		for i in 0..a.len() {
			sum += a[i];
		}
		println!("\t({:?} = {})", a, sum);
	}
}
```

## Collection Type

### Vector

create by macro `vec!` or `Vec::new()`
```rust
let vv: Vec<i32> = Vec::new();
let mut v = vec![1, 2, 3]; // create and assign
let vvv = vec![0; 3];   // 默认值为 0，初始长度为 3
let v_from = Vec::from([0, 0, 0]);
let mut vc = Vec::with_capacity(10); // define capacity, avoid copy

v.push(1); // update

let third: &i32 = &v[2];
match v.get(2) { // .get will return a Option<T>, indicating whether out of bound
    Some(third) => println!("第三个元素是 {third}"),
    None => println!("去你的第三个元素，根本没有！"),
}
```

reference: 
```rust
let mut v = vec![1, 2, 3, 4, 5];

let first = &v[0]; // immutable reference

v.push(6); // error here, this is a mutable reference, conflict with &v[0]

println!("The first element is: {first}");
```

iteration:
```rust
let mut v = vec![1, 2, 3];
for i in &mut v {
    *i += 10
}
```

normal usage:
```rust
let mut v =  vec![1, 2];
assert!(!v.is_empty());         // 检查 v 是否为空

v.insert(2, 3);                 // 在指定索引插入数据，索引值不能大于 v 的长度， v: [1, 2, 3] 
assert_eq!(v.remove(1), 2);     // 移除指定位置的元素并返回, v: [1, 3]
assert_eq!(v.pop(), Some(3));   // 删除并返回 v 尾部的元素，v: [1]
assert_eq!(v.pop(), Some(1));   // v: []
assert_eq!(v.pop(), None);      // 记得 pop 方法返回的是 Option 枚举值
v.clear();                      // 清空 v, v: []

let mut v1 = [11, 22].to_vec(); // append 操作会导致 v1 清空数据，增加可变声明
v.append(&mut v1);              // 将 v1 中的所有元素附加到 v 中, v1: []
v.truncate(1);                  // 截断到指定长度，多余的元素被删除, v: [11]
v.retain(|x| *x > 10);          // 保留满足条件的元素，即删除不满足条件的元素

let mut v = vec![11, 22, 33, 44, 55];
// 删除指定范围的元素，同时获取被删除元素的迭代器, v: [11, 55], m: [22, 33, 44]
let mut m: Vec<_> = v.drain(1..=3).collect();    

let v2 = m.split_off(1);        // 指定索引处切分成两个 vec, m: [22], v2: [33, 44]

let v3 = vec![11, 22, 33, 44, 55];
let slice = &v3[1..=3]; // slice
assert_eq!(slice, &[22, 33, 44]);
```

sort: stable sort will slow a little and need more space.
```rust
let mut vec = vec![1, 5, 10, 2, 15];    
vec.sort_unstable();    
assert_eq!(vec, vec![1, 2, 5, 10, 15]);
```

for float, need use `partial_cmp` to sort:
```rust
let mut vec = vec![1.0, 5.6, 10.3, 2.0, 15f32];    
vec.sort_unstable_by(|a, b| a.partial_cmp(b).unwrap());    
assert_eq!(vec, vec![1.0, 2.0, 5.6, 10.3, 15f32]);
```

for struct, implement `Ord` trait or use `#[derive(Ord, Eq, PartialEq, PartialOrder)]` to sort. the order of compare depends on the order of definition of members:
```rust
#[derive(Debug, Ord, Eq, PartialEq, PartialOrd)]
struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn new(name: String, age: u32) -> Person {
        Person { name, age }
    }
}

fn main() {
    let mut people = vec![
        Person::new("Zoe".to_string(), 25),
        Person::new("Al".to_string(), 60),
        Person::new("Al".to_string(), 30),
        Person::new("John".to_string(), 1),
        Person::new("John".to_string(), 25),
    ];

    people.sort_unstable(); // first compare name, then compare age

    println!("{:?}", people);
}
```

### Hash Map

use [[CS101#hash函数|Hash Function]] to build a [[CS101#HashTable|Hash Table]]
#### create
```rust
use std::collections::HashMap;

// 创建一个HashMap，用于存储宝石种类和对应的数量
let mut my_gems = HashMap::new();

// 将宝石类型和对应的数量写入表中
my_gems.insert("红宝石", 1);
my_gems.insert("蓝宝石", 2);
my_gems.insert("河边捡的误以为是宝石的破石头", 18);

// or by other collection
let teams_list = vec![
	("中国队".to_string(), 100),
	("美国队".to_string(), 10),
	("日本队".to_string(), 50),
];

let mut teams_map = HashMap::new();
// for team in &teams_list {
// 	teams_map.insert(&team.0, team.1);
// }
let teams_map: HashMap<String, i32> = teams_list.into_iter().collect(); // need explicit declare type here
```
#### Query
```rust
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

let team_name = String::from("Blue");
let score: Option<&i32> = scores.get(&team_name); // None for not exist. use reference to avoid movement of onwership

for (key, value) in &scores { // get all key-value pair
    println!("{}: {}", key, value);
}
```
#### Update
```rust
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert("Blue", 10);

// 覆盖已有的值
let old = scores.insert("Blue", 20);
assert_eq!(old, Some(10));

// 查询新插入的值
let new = scores.get("Blue");
assert_eq!(new, Some(&20));

// 查询Yellow对应的值，若不存在则插入新值
let v = scores.entry("Yellow").or_insert(5);
assert_eq!(*v, 5); // 不存在，插入5

// 查询Yellow对应的值，若不存在则插入新值
let v = scores.entry("Yellow").or_insert(50);
assert_eq!(*v, 5); // 已经存在，因此50没有插入
```

## Mutable

the variable is immutable by default. Use keyword `mut` to make the variable mutable.

### Constants

use keyword `const` with explicit type:
```rust
const VERSION: &str = "0.1.0"
```

## Shadowing

```rust
let x = 5;
// 在作用域内对之前的x进行遮蔽
let x = x + 1;
{
	// 在当前的花括号作用域内，对之前的x进行遮蔽
	let x = x * 2;
	println!("The value of x in the inner scope is: {}", x);
}
println!("The value of x is: {}", x);

// 字符串类型
let spaces = "   ";
// usize数值类型 可行的
let spaces = spaces.len();
// 但是mut的变量不能直接绑定, 需要创建新的变量进行遮蔽(shadowing)才行
let mut wrong_example = "  ";
// wrong_example = wrong_example.len(); // 报错: mismatched types
```
## Decomposition

use tuple for decomposition:
```rust
let (m, mut n): (bool,bool) = (true, false); // m = true,不可变; n = false，可变
n = true;

let (a, b, c, d, e);
(a, b) = (1, 2);
// _ 代表匹配一个值，但是我们不关心具体的值是什么，因此没有使用一个变量名而是使用_
// .. 表示多个变量, 和Python NumPy中的...基本完全一样
[c, .., d, _] = [1, 2, 3, 4, 5];
Struct { e, .. } = Struct { e: 5 };
assert_eq!([1, 2, 1, 4, 5], [a, b, c, d, e]);
```
## Ownership

To simplify, each value is owned by a owner. Binding the value to a variable means, make the variable be the owner of the value, which the previous owner will lose the ownership of this value.

rules:
1. each value was owned by a variable, which called owner
2. each value was only able to be owned one variable at the same time, which means each value can only have one owner
3. the value will be dropped when the owner(variable) is going to leave the scope

### Copy and Move

```rust
let x = 1;
let y = x;
```

The upper code is **Copy**, because `x` is variable with [[#Basic Type]] value,

However, this is not copy, but **Move**:
```rust
let s1 = String::from("hello");
let s2 = s1;
```
because `String` is not a Basic Type.

The combination of basic type could always be copied. The immutable reference could be copied, but mutable reference could not be copied.
### Clone

deep copy, or clone

rust will never automatically clone a variable.
```rust
let s1 = String::from("hello");
let s2 = s1.clone();

println!("s1 = {}, s2 = {}", s1, s2);
```

Then, if a type implement copy or clone [[Syntax#Trait|trait]], copy/clone it.

Otherwise, move it, and lose its ownership.
### Reference

normal reference is a pointer:
```rust
let x = 5;
let y = &x;
*y += 5;
println!("{}, {}", x, *y)
```

use reference as function argument type to avoid ownership change. but reference is immutable by default.

use `&mut` to create a mutable reference: `let y = &mut x;`

attention here, there can be only one mutable reference in one scope, and mutable and immutable references cannot exist at the same scope. immutable reference could be many at same scope.

#### Hanging Reference

return a reference in the function:
```rust
fn danger() -> &String {
	let s = String::from("Error");
	&s // compiler error: this function's return type contains a borrowed value, but there is no value for it to be borrowed from.
}
```

need [[#Lifetime]] specifier

or the better way is return `String` directly:
```rust
fn no_danger() -> String {
	let s = String::from("Error");
	s
}
```
### Reference Loop

To determine whether a value is still needed, rust introduce the **Reference Count**.

当创建一个引用(strong reference. 一般而言, 引用默认创建strong reference)的时候, 对应value的reference counter加一. 当这个引用被释放(drop)的时候, reference counter减一. 当reference counter为零的时候, 这个value会被释放掉.

但是如果有引用循环的情况, 会导致问题:
```rust
let x = Rc::new(RefCell::new(ListNode::new("x"))); // The internal counter of x is initialized to 1.
let y = Rc::new(RefCell::new(ListNode::new("y"))); // The internal counter of y is initialized to 1.

x.borrow_mut().next.replace(Rc::clone(&y));
y.borrow_mut().prev.replace(Rc::clone(&x));
// Now x owns y and y owns x. Both counters count to 2.

drop(x); // The counter of x decrements to 1, because y still owns x.
drop(y); // Memory leak here:  We no longer own y, so the counter of y decrement by 1. However x still owns y, so the counter of y still counts to 1. We can neither access x or y, nor drop them. This is memory leak.
```

因此, 使用weak reference, 只创建引用, 不添加引用计数:
```rust
​let mut x = Rc::new(ListNode::new("x"));
​let mut y = Rc::new(ListNode::new("y"));
​// Both counter count to 1
​x.next = Rc::clone(y); // Now y counts to 2.
​y.prev = Rc::downgrade(&x); // But x still counts to 1.
​drop(x);
​// x now counts to 0, so x is dropped.
​// x no longer owns y, so y's reference count decrements by 1.
// We can check this via Rc::strong_count.
​assert_eq!(Rc::strong_count(&y), 1);
​drop(y); // Now y counts to 0, too. No memory leaks, yay!
```

# Lifetime
