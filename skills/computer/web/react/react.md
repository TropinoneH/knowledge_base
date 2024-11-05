

> 写在最开始:
>
> 推荐使用`cnpm`或者`yarn`, 因为`npm`安装很奇怪, 有的时候会很慢
>
> [课程视频](https://www.bilibili.com/video/BV13h4y177jW/?p=1)
>
> [项目](file://D:\files\html\react\react-study)

# 初始化

## 创建程序

1. ```shell
   npm install create-react-app -g
   ```

2. ```shell
   npx create-react-app <project-name>
   ```

3. 删除掉`./src`下的所有源文件, 创建一个`index.tsx`(反正后缀名是无所谓的

   然后在`index.tsx`中引入所需要的内容

   ```tsx
   import React from 'react'
   import ReactDOM from "react-dom"
   
   ReactDOM.render((
       <></>
   ), document.getElementById("root"))
   ```

4. 如果需要更改端口号, 需要这样写:

   ```shell
   set PORT=8080 && set BROWSER=none react-scripts start
   ```



或者使用`vite`(更好的方法)

1. ```shell
   npm create vite
   ```

   然后选择需要的东西

2. 安装依赖项:

   ```shell
   npm install
   # 安装其他的内容
   npm install @types/node
   ```

3. 更改端口号的话就很简单:

   ```shell
   vite --port 8080
   ```

4. 把`./src`下的所有`css`文件都删掉就行, 记得把`main.tsx`中的`StrictMode`删了, 或者改成`Suspend`后面使用`fallback`页面懒加载的时候用

## `Eslint`和`Prettier`

1. `eslint`

   可以在`.eslintrc.cjs`中的`rule`这个地方配置错误提示信息, 有三种规格, `error`->`warn`->`off`, 从最严重到不提示

2. `prettier`

   是一个格式化插件

   安装: `vscode`可以直接在插件中找, 然后配置.

   至于`webstorm`: 默认安装了prettier插件 `Ctrl+Shift+Alt+P`快速格式化(`IDE`原生的是`Ctrl+Shift+L`)

   `npm install -D prettier`

创建`.prettierrc`文件, 写入以下规则:

```json lines
{
  "semi": false, // 关闭 句末分号
  "singleQuote": false, // 禁止 单引号
  "trailingComma": "none", // 禁止 最后一项后面的逗号
  "tabWidth": 4, // tab键的长度
  "printWidth": 120 // 单行的长度 120字符
}
```



# 初识React

- `react`模块

  `react`是可以在其他环境下开发的, 比如说移动端使用的是`react-native`, 浏览器是用的`react-dom`. 所以`react`和`react-dom`是分开的

- `react-dom`模块

    - `react-dom/client`

      正常的在客户端渲染

    - `react-dom/server`

      SSR模式, 服务端渲染然后再返回前端渲染, 常用于SEO优化(但是正常来说用不到)

- JSX语法

  可以直接写类似html标签的格式. 文件的后缀名一般为`jsx`, `tsx`等.

  一个JSX文件需要export一个function(最好是ES6的箭头函数), 这个function返回一个`JSX.Element`, 就是一个html标签

  一般返回值需要加上一个(), 防止因为换行而导致的return不起作用

    - 流程

      ```tsx
      const App = () => {
          return <div className="app">hello world</div>
      }
      ```

      会被编译器转换成一个object:

      ```json
      {
          "type": "div",
          "props": {
              "className": "app",
              "children": "hello world"
          },
          "key": null,
          "ref": null
      }
      ```

      然后再通过`ReactDOM`给到`document`调用`createElement`和`innerHTML`进行添加

      可以去[html-to-JSX](https://transform.tools/html-to-jsx)这里去看看怎么转换的

    - JSX中使用script

      通过大括号进行引入TypeScript或者JavaScript. 变量也可以这样引入

      注释也是用大括号进行注释的

      > 大括号中不会渲染的内容:   Boolean值, 空字符, null, undefined, object(报错), function(报错)
      >
      > 如何对不渲染的值输出: `JSON.stringify()`, {undefined + ""}

  > 注意:
  >
  > 1. 由于TypeScript和JavaScript中class还有for都是关键字, 所以在写JSX的时候是不允许使用这两个的. 所以代替的是`className`和`htmlFor`.
  > 2. 在JSX中不能使用`-`连接的属性, 需要转换成驼峰命名. `onclick`也不行, 要换成`onClick`. 自定义属性不受此限制.
  > 3. 大括号中不能放if语句(但是可以放三元运算符), for语句, 以及对象和函数
  > 4. 一个return不能有多个标签(只能有一个根标签). 但是可以用一个空标签包起来`<></>`, 或者使用`<Fragment></Fragment>`包起来. 这样就能做到渲染时只存在你写的有内容的部分而不存在空标签. 但是空标签不能加其他属性, Fragment可以添加其他属性

## 样式

- 行间样式

  `<div style={styles}></div>`, 其中`styles`是一个定义着style的对象. 或者这样写: `<div style={{...}}></div>`

- 全局样式

  `import "../styles/global.css"`

- 局部样式引用

  `import style from "../style.module.css"`

  然后再通过类名使用:  `<div className={style.className}></div>`

- `sass`文件

  先下载`sass`预处理器: `npm install sass`

- `classNames`

  添加`className`的时候可能会遇到多个类或者分情况添加类的时候. 这个时候可以使用三元运算符, 但是也可使用一个新的包叫做`classNames`

  安装: `npm install classnames`

  使用:

  ```react
  import classNames from "classnames";
  import style from "../src/assets/styles/global.module.scss";
  
  const App = () => {
      const className = classNames({
          [style.box1]: true
      });
      return (
          <>
              <div className={className}>hello</div>
              <div>world</div>
          </>
      );
  };
  
  export default App;
  ```

  如果是全局样式可以直接使用, 如果是局部样式, 那么需要加上[].

  如果是true, 那么就是有; 如果是false, 那么就不会出现在`className`中

## 事件

都是合成事件, 通过事件委托的方式触发.

传入一个函数, 可以这样写:

```tsx
const App = () => {
    const handler1 = (e) => {
        console.log(e);
    }
    const handler2 = (num) => {
        return (e) => {
            console.log(e, num)
        }
    }
    const handler3 = (e, num) => {
        console.log(e, num)
    }
    return (
    	<>
        	<button onClick={handler1}>1</button>
        	<button onClick={handler2(123)}>2</button>
        	<button onClick={(e) => handler3(e, 123)}>3</button>
        </>
    )
}
```

## 重复渲染

- 原生for/while

  ```tsx
  const App = () => {
  	const list = ["aaa", "bb", "ccc"]
      for(let i = 0; i < list.length; i++){
          list[i] = <li key={i}>list[i]</li>
      }
      return(
      	<ul>
          	{list}
          </ul>
      )
  }
  ```

- map映射

  ```tsx
  const App = () => {
  	const list = ["aaa", "bb", "ccc"]
      return(
      	<ul>
          	{list.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
      )
  }
  ```



## 组件传值

父->子组件传值: 使用props(整体接收 / 解构接收)

```tsx
const Child1 = (props: {className: string, content: string}) => { // 整体接收
    return (
    	<div className={props.className}>props.content</div>
    )
}
const Child2 = ({className, content}: {className: string, content: string}) => { // 结构接收
    return (
        <div className={props.className}>props.content</div>
	)
}

const Parent = () => {
    return (
        <>
            <Child1 className={""} content={"child1"} />
            <Child2 className={""} content={"child2"} />
        </>
    )
}
```

如果传入一个prop但是不加等于, 那么默认就是一个Boolean类型的变量

还可以传递事件: `{onClick}: {onClick: (e: never) => void}` 其中`never`指的是一个你永远不需要知道具体类型的参数

```tsx
const Parent = ({onClick, num}: {onClick: (e: number) => void, num: number}) => {
    return <div onClick={() => onClick(num)}>add number: {num}</div>
}
const App = () => {
    const [num, setNum] = useState(0)
    const handler = (e: number) => {
        setNum(e + 1)
    }
    return <Parent onClick={handler} num={num}/>
}
```

默认情况下, 组件必须是纯函数. 检测方式就是`<React.StrictMode></React.StrictMode>`检测, 通过调用两次函数的方式去检验. 所以使用`useEffect`或者其他的在组件中更改值的方法就会导致与预料中的结果不同的问题

纯函数: 相同的输入会得到相同的输出

## 受控组件和非受控组件

定义: 通过props(父子通信)的方式控制的子组件被称为受控组件. 如果组件之和自己的state有关的组件被称为非受控组件

`React`表单内置了受控组件的行为:

1. value+onChange
2. checked+onChange

如: `<input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>`

# Hook 钩子

以`use`开头的函数, 是一些功能函数

分为内置hook, 自定义hook, 第三方hook

## `useState`

能够保证每一次调用函数(渲染组件), 声明出来的值不会变

因为如果是使用let进行声明, 那么每一次渲染都会重新声明一个新变量, 无法记录数据. 所以使用`const [value, setValue] = useState(initialValue)`进行声明, 使用`setValue`进行修改值(因为`value`是`const`的), 能够记录变量的数据.

- 渲染流程:

    1. 初次渲染(`createRoot().render()`)

    2. 渲染组件(调用根组件)

    3. 提交给真实DOM(`append Child()`). 触发更新时, 先在`react-dom`中比较差异, 然后调用真实DOM更新差异的节点

       ```tsx
       const [val, setVal] = useState(0)
       const handler = () => {
           setVal(val + 1)
           setVal(val + 1) // 没有加2
           setVal(val + 1) // 没有加3, 因为val没变
           console.log(val) // 这里不变, 下一次调用函数(渲染组件)的时候才会变
           // 无论怎么延迟setTimeout都不会变
       }
       ```


<div style="background-color: #ee000066; color: white">
    <h4>
        注意!
    </h4>
	<p>
    这里的<code style="color: black">useState</code>不允许放在在逻辑中, 即不允许放在if判断中. 因为多状态记录(<code style="color: black">useState</code>)是给每个组件开一个对象, 然后<code style="color: black">const [val, setVal] = useState()</code>是根据调用的顺序记录索引, 然后通过索引去判断val是哪一个
    </p>
    <p>
        因此如果你在逻辑中执行了<code style="color: black">const [val, setVal] = useState()</code>, 那么可能会导致调用的setVal和val出现混乱, 导致出现bug.
    </p>
    <p>
        而且!
    </p>
    <p>
        在一次渲染的过程中, 无论如何去调用setVal, 它的val永远都是下一次渲染才会改变! 理解函数作用域!
    </p>
</div>



- 状态队列和自动批处理

  `react`会等到事件处理函数中的所有代码都执行完毕之后再去更新, 当队列都执行完毕之后再去渲染UI, 这种特性就是自动批处理

  但是`setVal`还有另外一种写法, 就是把一个回调函数作为参数.

  ```tsx
  setVal((c) => c + 1)
  setVal((c) => c + 1)
  setVal((c) => c + 1)
  ```

  这种写法与之前的`setVal(val + 1)`不同, 因为这个回调函数传的参数是内部的值, 也就是说多次调用这个可以在一次执行中多次自增. 而之前的写法可以看作`setVal((c) => val + 1)`, 没有用到内部的值

- 状态是不可变的

  即使使用了`let [val, setVal] = useState()`进行初始化, 调用了`val++`之后也不会触发页面的重新渲染. 只有`setVal`之后才会重新渲染.

  注意: 下面的代码有问题, 无法执行:

  ```tsx
  const [list, setList] = useState([
      {id: 1, text: "aaa"},
      {id: 2, text: "bbb"}
  ])
  const handler = () => {
      list.push({id: 3, text: "ccc"}) // 这里直接对list进行修改了, 是不允许的
      setList(list)
  }
  ```

  原因: 修改函数的值如果没有改变, 那么就不会触发渲染(就没有去修改). 因为list在push之后就已经改变了, 所以`setList`进行比较的时候发现list的值没有改变, 所以没有触发渲染.

  如: `useState(0)`然后再`setVal(0)`这种情况下就没有修改.

  ```tsx
  const UseStateStudy = () => {
      const [val, setVal] = useState(0)
      const handleClick = () => {
          setVal(1)
      }
      console.log(123)
      return (
          <div>
              hello
              <button onClick={handleClick}>click</button>
              {val}, {Math.random()}
          </div>
      )
  }
  ```

  这种情况下可以看到, 点击按钮的时候第一次触发了`console.log`, `Math.random()`改变, `val`从0变成1, 但是再次点击(`val==1`, `setVal`不应该触发渲染)的时候又触发了`console.log`, 但是`Math.random()`没有改变. 所以可以得知, 这个第二次出发是一个内部自检的机制

  所以正确的写法是:

  ```tsx
  const [list, setList] = useState([
      {id: 1, text: "aaa"},
      {id: 2, text: "bbb"}
  ])
  const handler = () => {
      setList([...list, {id: 3, text: "ccc"}])
  }
  ```

- 常见的数组对象的解决方案:

  |          | 避免使用                           | 推荐使用               |
    | -------- | ---------------------------------- | ---------------------- |
  | 添加元素 | `push`, `unshift`                  | `concat`, `[...arr]`   |
  | 删除元素 | `pop`, `shift`, `splice`           | `filter`, `slice`      |
  | 替换元素 | `splice`, `arr[i] = ...`(直接赋值) | `map`                  |
  | 排序     | `reverse`, `sort`                  | 先将数组复制一份再排序 |

- 一个工具类: `lodash`, 提供了深拷贝 `npm install lodash`

  ```tsx
  import {cloneDeep} from 'lodash'
  
  const [list, setList] = useState([
      {user: {username: "123", age: 18}, auth: "admin"},
      {user: {username: "321", age: 81}, auth: "normal"}
  ])
  const cloneList = cloneDeep(list) // 但是这个是通过递归的方法调用的, 所以会耗时, 性能有问题.
  ```

  有效避免多层对象嵌套带来的深拷贝浅拷贝的问题(或者直接用`JSON.parse(JSON.stringify())`)

- 另一个工具类: `immer`, 更方便地操作不可变状态(列表, 对象)  优点: 性能更好.

  安装: `npm install immer use-immer`

  使用:

  ```tsx
  import {useImmer} from "use-immer"
  ```

  然后我们就可以利用`useImmer`替代`useState`

  ```tsx
  const [list, setList] = useImmer([
      {id: 1, text: "aaa"},
      {id: 2, text: "bbb"}
  ])
  setList((draft) => {
      // 这里的draft是一个Proxy的对象, 底层拦截, 与之前的list是完全无关的, 所以可以在这里进行修改.
      draft.push({id: 3, text: "ccc"})
  })
  ```



- 惰性初始化

  如果一个值需要经过非常复杂的计算才能得出, 那么可以考虑使用惰性初始化的方式.(使得只在初始化的时候调用函数计算, 更新的时候不去考虑初始化的计算方法)

  ```tsx
  function compute(n: number) {
      console.log(123)
      return (n + 1 + 2) ^ 2
  }
  
  const LazyInitial = () => {
      const [count, setCount] = useState(compute(0))
      const handleClick = () => {
          setCount(count + 1)
      }
      return (
          <div>
              <button onClick={handleClick}>click</button>
              <br/>
              {count}
          </div>
      )
  }
  ```

  这里的`console.log`是初始触发, 但是每一次调用setCount都会重新触发一次.

  改变方法:

  ```tsx
  function compute(n: number) {
      return (n + 1 + 2) ^ 2
  }
  
  const LazyInitial = () => {
      const [count, setCount] = useState(() => compute(0)) // 这里用回调函数的方式避免每次更新都调用compute
      /* ... */
  }
  ```

- 状态共享

  每个组件的state是自己的, 不会对其他组件产生影响.

  解决方案: 把state创建在父组件身上, 然后传props给子组件, 然后子组件就可以共享父组件中的state了. 这种方式叫做状态提升

- 组件状态重置问题

  当组件销毁(隐藏)的时候, 组件内部的信息全部清空, 包括state.

  ```tsx
  const Btn = () => {
      const [count, setCount] = useState(0)
      return (
      	<div>
          	<button onClick={() => setCount(count + 1)}>click</button>
              <br/>
              {count}
          </div>
      )
  }
  
  const App = () => {
      const [show, setShow] = useState(true)
      return (<>
      	<button onClick={() => setShow(!show)}>click</button>
          <br/>
  		{show && <Btn></Btn>}
      </>)
  }
  ```

  当`show`的值改变之后, `Btn`组件会被重置, 里面的state会销毁.

  但是如果组件的位置没有改变, 那么里面的state会被保留, 如: `{style ? <Btn style={{background-color: red}}/> : <Btn/>}`这种情况下切换样式, `Btn`内部的state会被保留下来. 但是假如结构不同, 比如说前面的没有套任何container, 后面的套了一个`div`, 那么里面的state还是会消失. 加上不同的`key`也会重置状态.

## `useRef`

能够让一个普通的变量也有了记忆功能, 不会因为重新渲染组件而失去之前的值. 但是注意, `useRef`的返回值是一个对象Object, 真正的值是使用`.current`获取到的.

`useRef`和`useState`的对比:

| `useRef`                                      | `useState`                                                 |
| --------------------------------------------- | ---------------------------------------------------------- |
| `useRef(initVal)`返回一个`{current: initVal}` | `useState(initVal)`返回`[state, setState]`                 |
| 更新时不会触发重新渲染                        | 更新时会重新渲染                                           |
| 可变: 可以在渲染过程之外修改`.current`的值    | "不可变": 需要使用`setState`并重新渲染来修改               |
| 你不应该在渲染过程中写入或读取`.current`的值  | 你可以随时读取`state`, 但是每次渲染state都有自己不变的快照 |

- 应用案例: 定时器

  ```tsx
  const StudyUseRef = () => {
      const [count, setCount] = useState(0)
  
      const num: React.MutableRefObject<null | NodeJS.Timeout> = useRef(null)
  
      const handler = () => {
          setCount(count + 1)
          num.current && clearInterval(num.current)
          num.current = setInterval(() => {
              console.log(123)
          }, 1000)
      }
  
      return (
          <div>
              hello app
              <button onClick={handler}>count</button>
              <br />
              {count}
          </div>
      )
  }
  ```

  如果不用`useRef`的话, 每渲染一次, 清除的都是本次作用域下的定时器, 而上一次的定时器没有被清除, 导致定时器叠加.

- 操作DOM

  是可以通过`document`原生JavaScript操作DOM, 但是不推荐使用

  在需要操作的虚拟DOM节点加一个`ref={myRef}`, 注意`myRef`的类型推断

  如果想要在逻辑中操作DOM, 那么可以通过一个回调函数的方式调用: `ref={myRef => {myRef.style.background = "red"}}`

### `forwardRef`转发`ref`

如果想要给自定义的组件添加ref, 那么必须要进行转发ref, 否则是拿不到ref的.

语法:

```tsx
<button onClick={() => console.log(ref2.current && ref2.current.value)}>ref2</button>
<br/>
<ForwardRefChild ref={ref2}/>
```

```tsx
const ForwardRefChild = forwardRef((_, ref: React.ForwardedRef<HTMLInputElement>)  => {
    return <input ref={ref}/>
})
```

- 自定义ref暴露出来的element能够执行的方法

  使用`useImperativeHandle(ref, callback)`, 在`callback`中return想要暴露出来的方法

  还是要注意TypeScript类型推断. 可以这样写: `useImperativeHandle(ref as React.Ref<object>, () => ({}))`类似这种方式去写.



## `useEffect`

纯函数处理副作用: 使用`useEffect`

纯函数: 1. 只负责自己的人物, 不会更改在函数调用之前就已经存在的变量或者对象 2. 只要输入相同, 那么输出一定相同

副作用:

1. 函数执行过程中对外部造成的影响称为`aside effect`, 如: ajax调用, DOM操作, 与外部系统同步等等
2. React组件中, 事件操作是可以处理副作用的, 但是有的时候需要初始化处理副作用, 那么就需要`useEffect`钩子函数

正常来说, 如果想要触发一些副作用都是通过事件的方式触发, 但是有些副作用需要在最开始的时候触发, 所以就不能使用事件的方式去调用. 这个时候就用到了`useEffect`钩子函数.

`useEffect`是在return结束之后, 也就是说JSX渲染走完之后再去执行, 所以就避免了一些bug. 如这种的:

```tsx
const App = () => {
    const ref = useEffect<HTMLInputElement>(null) // 或者可以使用React.createRef<HTMLInputElement>()
    ref.current!.focus() // 这里因为ref.current=null所以并没有执行, 因为ref还没有指向input
    useEffect(() => {
        ref.current!.focus() // 这里是可以的, 因为useEffect是在jsx渲染之后执行的
    })
    return <input ref={ref}/>
}
```

注意! 严格模式会触发两次`useEffect`, 所以请关闭`React.StrictMode`

每一次更新都会重新走一遍`useEffect`. 如果想要让`useEffect`只在某一个依赖项改变的时候触发, 可以再传一个参数, 一个列表, 表示当列表内部的值改变的时候会触发对应的`useEffect`. 判断是否改变用的是`Object.is()`函数. 如果是空数组那么就表示只有在初始时会触发, 更新渲染不会触发.

> 注意: 不传参数表示只要更新就调用`useEffect`, 但是传入一个空列表表示只在初始化的时候调用, 更新反而不调用了

> 注意: `Eslint`能够检测, 如果`useEffect`内部用到了某个state, 但是`DependencyList`里面没有这个state, 那么就会产生一个warning. 推荐只要在`useEffect`中用到了某个state, 就要在`DependencyList`里面加上这个变量

如果想要在`useEffect`中使用函数, 那么这个函数最好是定义在`useEffect`内部的. 否则, 就要把这个函数作为依赖项传入依赖列表. 但是简单的传入是不可以的, 因为每一次渲染生成的函数都不满足`Object.is()`, 所以需要用`useCallback`把函数括起来, 然后填入相应的依赖项(`useCallback`是必须要填入第二个参数的), 这样才能保证获取到的是正确的函数.

但是这样会非常麻烦, 所以推荐把函数定义在`useEffect`的内部. (注意区分函数和事件)

### `useEffect`的清理操作

在`useEffect`中可以定义一个return. return的内容是一个函数(() => void), 当第二次调用这个useEffect之前或者在关闭这个`useEffect`之前会调用这个return的函数. 那么就可以在这个函数中做一些数据的清理

## `useLayoutEffect`

和`useEffect`不同的是, `useLayoutEffect`是在渲染之后但是在屏幕更新之前调用的. 所以如果要执行很多DOM操作相关的代码, 应该在`useLayoutEffect`里面执行, 能够避免屏幕闪烁.

但是`useEffect`是一个异步的操作, 性能更好, 但是是在渲染之后屏幕更新之后调用的.

所以如果要执行一些耗时的操作并且需要把结果渲染到UI上, 就使用`useLayoutEffect`

## `useInsertionEffect`

是在DOM更新之前触发的, 所以在这里获取不到DOM的元素. 用处很少, 只在CSS-in-JS库中用到

## `useReducer`

- `reducer`统一状态管理

  对于拥有许多状态更新逻辑的组件来说, 太过于分散的事件处理程序可能会令人不知所措. 对于这种情况, 你可以将组建的所有状态更新逻辑统一整合到一个外部的函数中, 这个函数称为`reducer`

创建reducer:

```tsx
function listReducer(state: { id: number; text: string }[], action: { type: "add" | "remove" | "edit"; id?: number }) {
    switch (action.type) {
        case "add":
            return [...state, { id: 3, text: "ccc" }]
        case "edit":
            return state.map((item: { id: number; text: string }) => {
                return item.id == action.id ? { id: item.id, text: "new " + item.text } : item
            })
        case "remove":
            return state.filter((item: { id: number; text: string }) => {
                return item.id != action.id
            })
    }
}

const StudyUseReducer = () => {
    const [list, dispatch] = useReducer(listReducer, [
        { id: 1, text: "aaa" },
        { id: 2, text: "bbb" }
    ])
    return (
        <ul>
            {list.map((item: { id: number; text: string }) => (
                <>
                    <li key={item.id}>{item.text}</li>
                    <button onClick={() => dispatch({ type: "add" })}>add</button>
                    <button onClick={() => dispatch({ type: "edit", id: item.id })}>edit</button>
                    <button onClick={() => dispatch({ type: "remove", id: item.id })}>remove</button>
                </>
            ))}
        </ul>
    )
}
```

>  注意: reducer函数的返回值和`useReducer`的初始值一定要是相同类型的, 否则TypeScript报错.
>
>  可以通过限定`action.type`来保证

### `useImmerReducer`

`immer`版本:

```tsx
function immerReducer(draft: { id: number; text: string }[], action: { type: "add" | "remove" | "edit"; id?: number }) {
    switch (action.type) {
        case "add": {
            draft.push({ id: 5, text: "eee" }) // 只是这里有区别
            break
        }
        case "edit": {
            const value = draft.find((i) => i.id == action.id)
            value!.text = "new " + value!.text
            break
        }
        case "remove": {
            const index = draft.findIndex((i) => i.id == action.id)
            draft.splice(index, 1)
        }
    }
}
const StudyUseReducer = () => {
    const [list2, listDispatch2] = useImmerReducer(immerReducer, [
        { id: 1, text: "aaa" }, // ...
    ])
    // ...
}
```

## `useContext`

可以向孙子组件传值而不经过子组件.

注意, TypeScript中的createContext一旦在最开始的地方确定了类型, 那么接下来就不能改变类型了.

```tsx
const Context = createContext(0)

const Child2 = () => {
    const num = useContext(Context) // 和上面的createContext创建出来的Context相同
    return <div>{num}</div>
}

const Child1 = () => <Child2 />

const StudyUseContext = () => {
    return (
        <Context.Provider value={3}> {/* 和上面的createContext创建出来的Context相同 */}
            <Child1 />
        </Context.Provider>
    )
}
```

## `useMemo`

- `memo` 跳过渲染

  当父组件更新状态之后, 如果子组件没有用到这个状态, 那么可以让这个子组件不重新渲染(为了性能).

  ```tsx
  const Child = memo(() => {
      return <div>{Math.random()}</div>
  })
  ```

  这个`memo`会自动判断组件是否需要被刷新.

  正常来说是用不到的. 但是如果觉得项目很卡, 这时候才会需要用到memo

- `useMemo`

  ```tsx
  const [msg, _] = useState("hello world")
  const list = [msg.toLowerCase(), msg.toUpperCase()] // 这种情况会触发memo重新渲染, 因为重新创建的列表地址不同
  const list_memo = useMemo(() => [msg.toLowerCase(), msg.toUpperCase()], [msg])
  ```

  `useMemo`需要传入两个参数, 第一个是回调函数, 返回值就是最终的结果; 第二个参数表示依赖项

  这样的话, 传入`list_memo`就能有效避免`memo`多次无效渲染

## `useCallback`

就是`useMemo`的特殊写法, 只是参数变成一个函数(直接读取参数, 而不是读取参数的返回值). 只有依赖改变的时候才是一个新的函数.

## `useTransition`

- `startTransition`

  当一个任务非常耗时(如搜索)的时候, 如果都放到一个事件函数中, 那么可能会导致输入事件等待搜索事件结束后再触发第二次, 导致输入的时候有很明显的卡顿. 这个时候可以使用`startTransition`进行分级, 把优先级高的事件先做完, 然后在考虑优先级低的事件.

  如:

  ```tsx
  const List = ({ query }: { query: string }) => {
      const items: JSX.Element[] = []
      const word = "Hello World"
  
      if (query != "" && word.includes(query)) {
          const arr = word.split(query)
          for (let i = 0; i < 20000; i++) { // 数据量太多, 会很卡
              items.push(
                  <li>
                      {arr[0]}
                      {arr.map((s, index) => {
                          return index == 0 ? "" : (
                              <Fragment key={index}>
                                  <span style={{ color: "red" }}>{query}</span>
                                  {s}
                              </Fragment>
                          )
                      })}
                  </li>
              )
          }
      } else {
          for (let i = 0; i < 20000; i++){
              items.push(<li>{word}</li>)
          }
      }
  
      return <ul>{items}</ul>
  }
  
  const StudyUseTransition = () => {
      const [val, setVal] = useState("")
      const [query, setQuery] = useState("")
      const [pending, startTransition] = useTransition() // 延迟调用
      const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
          const value = (e.target as HTMLInputElement).value
          setVal(value)
          startTransition(() => setQuery(value))
      }
      return (
          <>
              <input type={"text"} value={val} onChange={handleChange} />
              {pending && <div>Loading...</div>}
              {pending || <List query={query} />}
          </>
      )
  }
  ```



## `useDeferredValue`

类似`useTransition`, 但是这个直接自己提供了一个延迟副本:

```tsx
const StudyUseDeferredValue = () => {
    const [val, setVal] = useState("")
    const query = useDeferredValue(val) // 这里有变化
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = (e.target as HTMLInputElement).value
        setVal(value)
    }
    return (
        <>
            <input type={"text"} value={val} onChange={handleChange} />
            <List query={query} />
        </>
    )
}
```

## `useId`

不推荐使用`id`进行对`css`的调用. 但是如果有无障碍的需要的话, 那还是需要用到`id`进行获取描述信息. 但是如果组件复用的话会有id重复的问题, 所以这个时候用到了`useId`这个钩子函数.

```tsx
const password = useId()
return <>
	<label>
		密码: 
    	<input type="password" aria-describedby={password} />
	</label>
	<p id={password}>密码应该包含至少8个字符</p>
</>
```

## `useDebugValue`

在开发这工具中打印一些信息, 但是需要在自定义`Hook`或在第三方`Hook`中使用才行

没啥用

## `useSyncExternalStore`

操作额外的store. 但是如果是第三方库的store或者做SSR的时候, 会用到. 但是一般用不到.

# 自定义和第三方`Hook`

## `aHooks`

[官网](https://ahooks.js.org/zh-CN/hooks/use-request/index)

```shell
npm install ahooks
```



### `useRequest`

发送请求, : `const {data, error, loading} = useRequest(service)`

`service`是一个异步函数, 里面实现的是`ajax`或者`axios`发送请求的过程, `useRequest`获取到的`data`就是这个函数return的内容.

```tsx
const getData = async () => {
    const res = await axios.get("/api/v1/...")
    return res.data.list
}

const App = () => {
    const {data, error, loading} = useRequest(getData)
    if (error) {
        return <div>{error.message}</div>
    }
    if (loading) {
        return <div>loading...</div>
    }
    return <ul>
    	{data.map((item) => <li key={item.id}>{item.name}</li>)}
    </ul>
}
```

这种情况是在最开始的时候就请求一次. 如果想要手动发送请求, 可以这样:

```tsx
const [data, setData] = useState([])
const { run, error, loading } = useRequest(async () => { // 注意: 这里不能结构出来data, 如果结构了就报错.	
    const res = await axios.get("/cart.json")
    return res.data.list
}, {
    manual: true, // 开启手动请求
    onSuccess (res) {
        // 当请求发送成功之后做什么
        console.log(res)
        setData(res)
    },
    refreshDeps: [] // 依赖列表, 如果有变化那就重新发送给请求
})
```

还可以结构出来`refresh`, 用于刷新, 会调用上一次请求所携带的参数, 完全一样的发一次请求

- 高级配置选项:
    1. `pollingInterval: <time>` 轮询, 每隔`<time>`毫秒发送一次请求
    2. `loadingDelay: <time>` 延迟loading变成true的事件, 在轮询过程中防止因为太多loading而造成的闪烁(也就是说在`<time>`毫秒的时间内完成的请求不再变成loading)
    3. `refreshOnWindowFocus: true` 当屏幕重新获取到焦点的时候会重新发送一个请求
    4. `debounceWair: <time>` 防抖, 触发run()之后, 如果在`<time>`毫秒内如果重新触发了run, 那么会等待`<time>`毫秒, 如果没有触发, 才会真正发送请求.
    5. `throttleWait: <time>` 节流, 如果连续快速触发run(), 那么每个`<time>`毫秒才会发送一次请求.
    6. `retryCount: <count>` 错误重试, 如果遇到错误, 会再次重试发送`<count>`次请求

# `antd`

> [官网](https://ant.design/docs/react/introduce-cn)
>
> [国内镜像](https://ant-design.antgroup.com/docs/react/introduce-cn)

安装:

```shell
npm install antd @ant-design/icons
```

## 栅格`Grid`

```tsx
<Row gutter={[10, 10]}> {/*gutter传入一个数组, 第一个参数表示Row下元素的水平间隙, 第二个表示竖直间隙*/}
	<Col xs={12} md={8}>aaa</Col> {/*在中等条件下, 一行三个, 在小的条件下, 一行只有两个*/}
	<Col xs={12} md={8}>bbb</Col>
	<Col xs={12} md={8}>ccc</Col>
</Row>
```