# 变量类型

## int

## float

```python
3e5
4E3
```

## complex

`5+3j `

> 不是`5+3i`

## String

是列表

列表取值:

```python
str[2:5] # 取值:从3-6取值
str[2:] # 取值:从3-最后
```

方法:

```python
a = "   Hello world    "
print(a.strip()) # "Hello world"去掉开头结尾的空格
print(a.replace("H", "J")) # "Jello world"  但是这个不更改a的值
b = "Hello, world"
print(a.split(",")) # ["Hello", " world"]
print(a.split()) # ["Hello,", "world"]
```

## list

```python
li = ["11", 2, True]
for x in li:
    print(x)

for i in range(0, len(list)):
    print(li[i])
    
li.insert(index, "index")
li.append("append")
```

## tuples

元组,无序,用圆括号来包住

```python
thistuple = ("apple")
for x in thistuple:
    print(x)
    
if "apple" in thistuple:
    print("Yes")
```

## Dictionary

```python
# 字典是无序的
thisdict = {"key1":"1","key2":"2"}
print(thisdict)
print(thisdict["key1"])
thisdict["key1"] = "111"
del thisdict["key1"]
for x in thisdict:
    print(x) # 每次结果顺序不同
    
for x in thisdict.values():
    print(x)
```

## Set

```python
a_set = set([1,2,3,4])
b_set = set([4,5,6,7])
print(a_set | b_set) # {1,2,3,4,5,6,7} union a_set.union(b_set)
print(a_set & b_set) # {4} intersection a_set.intersection(b_set)
print(a_set - b_set) # {1,2,3} difference a_set.difference(b_set)
print(b_set - a_set) # {5,6,7} difference
print(a_set.symmetric_difference(b_set)) #{1,2,3,5,6,7}
print(a_set ^ b_set) # {1,2,3,5,6,7}
```

# 操作符

```python
# 整形的2^32-1以内的整数在内存中存放的地址是一样的
# 还需要仔细了解数据类型存储位置以及数据类型比较相等的算法(是比较地址还是值)
```

# Statements

```python
import ...
```

# 函数

## lambda

```python
# 是傻逼
a = lambda x, y:x+y
# 不能多行, 只能输出一个简单的表达式, 而且不能有其他的函数调用, 自带return
```

## 返回函数的函数

```python
def A(n):
    def B(x):
        return x ** n
    return B

if __name__ == "__main__":
    f = A(2)
    print(f(3))
```

# 报错

## 主动抛出

```python
def Div(x, y):
    assert y != 0, "denominator is 0"
    return x / y

x = int(input())
y = int(input())
print(Div(x, y))
```

```shell
>>> Div( 2, 0)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 2, in Div
AssertionError: denominator is 0
```

## handle

```python
while True:
    try:
        x = int(input())
        break
    except ValueError:  # 输入的值是不能转换成int的
        print("That was no valid number")
```

![shadow](D:\files\笔记\python\Snipaste_2022-10-12_10-41-36.png)

## try

```python
# try-finally
try:
    # TODO:
finally:
    # TODO:释放掉try中生成的一些东西
```

```python
# try-except
try:
    # suite
except :  #可以什么也不加, 也可以在except后加上异常类型
    # handle
else:  # try正常结束的时候执行, 可以不写
finally:  # 可以不写
```

> 注意! 无论是否在函数中执行了return, 只要有try-finally, 那么finally一定会被执行!

# numpy

```python
import numpy as np  # 开数组用的
arr = np.array([1,2,3],[4,5,6])  # 创建
arr.shape  # (2,3),行,列
arr[row, col]  # 输出row,col的值,也可以arr[row][col]
a = np.zeros((2,2))  # [[0,0],[0,0]]
b = np.ones((2,2))  # [[1,1],[1,1]]
c = np.full((2,2),3)  # [[3,3],[3,3]]
d = np.eye(2)  # 创建单位矩阵[[1,0],[0,1]]
e = np.random.random((2,2))  # 2x2随机数矩阵 (0,1)之间(好像是)
```

```python
import numpy as np
a = np.array([[1,2,3,4],[5,6,7,8],[9,10,11,12]])
b = a[:2, 1:3]  # 前两行,第二列第三列[[2,3],[6,7]]
c = a[:1][1:3]  # [5,6,7,8]
# 是传的引用而不是深拷贝
row_1 = a[1, :]  # [5,6,7,8]
r2 = a[1:2,:]  # [[5,6,7,8]]
r3 = a[[1],:]  # 与r2等价
col_1 = a[:, 1]  # [2,6,10]
c2 = a[:,1:2]  # [[2,6,10]]
```

```python
import numpy as np
a = [[1,2,3],[4,5,6],[7,8,9],[10,11,12]]
b = np.array([0,2,0,1])
a[np.range(4), b]  # [1,6,7,11]

c = np.array([[1,2],[3,4],[5,6]])
bool_idx = (a>2) # [[False,True],[T,T],[T,T]]

d = np.array([1,2], dtype=np.float64)  # [1.0, 2.0]
x = np.array([[1,2],[3,4]])
y = np.array([[1,2],[3,4]])
x + y  # 算符重载,[[2,4],[6,8]]
x * y  # 不是正常的矩阵乘法,而是对应位置相乘[[1,4],[9,16]]
x.dot(y)  # 正常的矩阵乘法, x成y的转置
np.dot(x,y)  # 与上面的相同
x@y  # 与上面的相同

m = np.array([[1,2],[3,4]])
np.sum(m, axis=1)  # 求和,列,如果是0的话那么就是按行求和
x.T  # 转置,对自身转置
```

```python
import numpy as np
x = n.array([[1,2,3],[4,5,6],[7,8,9]])
v = np.array([1,0,1])
y = np.empty_like(x)#返回与x相同大小的全零矩阵[[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
for i in range(4):
    y[i, :]=x[i,:]+v
y  # [[2,2,4],[5,5,7],[8,8,10]]

vv = np.tile(v, (4,1))  # [[1,0,1],[1,0,1],[1,0,1],[1,0,1]]
y = x + vv

# boardcasting
y = x + v  # 直接就是加法,补成与x相同大小的矩阵
```

```python
import numpy as np
v = np.array([1,2,3])
w = np.array([4,5])
np.reshape(v,(3,1))*w  # [[4,5],[8,10],[12,15]]
# reshape是把v转成了3x1的矩阵

x = np.array([1,2,3],[4,5,6])
(x.T + w).T  # [[5,6,7],[9,10,11]]
```

```python
import numpy as np
a = np.array([[[1,2,3],[4,5,6]],[[7,8,9],[10,11,12]]])
a[[1,1]] # np.array([a[1],a[1]])
a[[0,0,1],[0,1,1]] # np.array([a[0][0],a[0][1],a[1][1]])
```

# Pandas

> 还得再查查

```python
# Pandas 是对Excel的操作包
a = {'a':0,'b':1}
b = ['a','b']
s = pd.Series(a,b) # 按照b的顺序对索引进行排序,如果对应索引没有值输出NaN
# a    0.0
# b    1.0
# d    NaN
data = {'1':[1,2,3],'2':[4,5,6],'3':[7,8,9]}
frame = pd.DataFrame(data,columns=['1','2','3'])
#    1  2  3
# 0  1  4  7
# 1  2  5  8
# 2  3  6  9
frame.loc([rowNames],[colNames])
frame.iloc([rowIndexs],[colIndexs])
```

