[课程视频](https://www.bilibili.com/video/BV1vS4y1R76b)

[项目](file://D:/files/html/react/router-study)

创建: `yarn create vite .`

# 初始化

```shell
yarn add react-router react-router-dom
```

然后去`main.tsx`中把`<App />`用`import {BrowserRouter} from "react-router-dom"`的`<BrowserRouter></BrowserRouter>`给包起来

# 基础使用

```tsx
import {Route, Routes} from "react-router";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path={"/login"} element={<Login />}/>
        <Route path={"/"} element={<Home />}/>
      </Routes>
    </>
  )
}

export default App
```

# 嵌套路由

```tsx
<Route path={"/"} element={<HomeLayout />}>
    <Route index element={<Home />} />
    <Route path={"about"} element={<About />}/>
</Route>
```

index表示直接就是父路由的path.

>  注意:
>
>  1. `<HomeLayout/>`里面有一个`<Outlet/>`, 这个是展示子路由对应界面的. 如果没有这个, 那么直接不会展示.
>  2. 子路由的path如果以`/`开头, 那么表示绝对路由; 或者不以`/`开头, 表示相对路由. 如果子路由是绝对路由且不属于父路由的下面, 那么会直接报错, 程序啥也不展示

# 路由跳转

第一种写法:

```tsx
const navigate = useNavigate()
const login = () => {
    navigate("/login")
}

return <button onClick={login}>登录</button>
```

第二种写法:

```tsx
return <Link to="/login">登录</Link>
```

或者:

```tsx
return <NavLink to="/login">登录</NavLink>
```

# 路由地址和路由参数

又称作: 动态路由

使用`useParams()`

路由配置

```tsx
<Route path={"user"} element={<User />}>
    <Route path={"detail/:id"} element={<UserDetail />} />
</Route>
```

跳转链接配置

```tsx
import {Link, Outlet} from "react-router-dom";
import {List} from "antd";

const User = () => {
    return <div>
        User
        <br/>
        <List>
            <List.Item>
                <Link to={"/user/detail/1"}>user 1</Link>
                <Link to={"/user/detail/2"}>user 2</Link>
                <Link to={"/user/detail/3"}>user 3</Link>
                <Link to={"/user/detail/4"}>user 4</Link>
            </List.Item>
        </List>
        <br/>
        <Outlet />
    </div>
}

export default User
```

获取路由地址参数:

```tsx
import {useParams} from "react-router";

const UserDetail = () => {
    const params = useParams()
    return <div>
        User Detail {params.id}
    </div>
}

export default UserDetail
```

# 集中式渲染路由

使用`router/index.tsx`集中管理路由

创建路由:

```tsx
import {RouteObject} from "react-router";
import HomeLayout from "../pages/HomeLayout.tsx";
import Home from "../pages/Home.tsx";
import About from "../pages/About.tsx";
import User from "../pages/User.tsx";
import UserDetail from "../pages/UserDetail.tsx";

const routes: RouteObject[] = [
    {
        path: "/", element: <HomeLayout/>, children: [
            {path: "home", element: <Home/>},
            {path: "about", element: <About/>},
            {
                path: "user", element: <User/>, children: [
                    {path: "detail/:id", element: <UserDetail/>}
                ]
            }
        ]
    }
]

export default routes
```

使用: 回到`App.tsx`中, 就是之前写`<Routes></Routes>`嵌套的文件

```tsx
import {useRoutes} from "react-router";
import routes from "./router";

function App() {
    return useRoutes(routes) // 非常简练
}

export default App
```

# 页面懒加载

```tsx
const Home = lazy(() => import("../..."))
```

然后需要在`main.tsx`里面的`<App />`外面包上一层`<React.Suspense></React.Suspense>`, 或者直接在`App.tsx`的`useRoutes`外面包上一层.

`<Suspense></Suspense>`可以提供一个参数`fallback`, 用于在加载的过程中展示的内容, 必须是`JSX.Element`类型的, 或者`ReactNode`类型的.

# 路由匹配

获取当前的路由来做菜单高亮(`antd`的`Menu`)

```tsx
const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([])
const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>([])
const [isInit, setIsInit] = useState(false)
const {pathname} = useLocation()
useEffect(() => {
    const pathArr: string[] = []
    const matched = matchRoutes(routes, pathname)
    if (!matched) {
        return
    }
    matched.map((item) => {
        const path = item.route.path
        if (path) {
            pathArr.push(path)
        }
    })
    setDefaultSelectedKeys(pathArr)
    setDefaultOpenKeys(pathArr)
    setIsInit(true)
}, [pathname])
if (!isInit) {
    return <></>
}
```

# 参数获取

就是path中的`?query=...`

使用`useSearchParams()`

```tsx
const [query, _] = useSearchParams()
console.log(query.get("param")) // 获取key=param的一个string参数
console.log(query.getAll("repeat")) // 获取所有的key=repeat的string[], 也就是说可以传入多个相同的键.
```

# 路由守卫

`react-router`没有任何方法能够实现路由守卫, 所以只能说是在`useEffect`中做路由匹配.

网上找的代码, 没经过验证

```tsx
import { message } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { routers } from "./index";

const AuthRoute = ({ children, auth }: any) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("blogToken") || "";
  const loginState = useSelector((state: any) => state.public.loginState);
  const mathchs = matchRoutes(routers, location);

  const isExist = mathchs?.some((item) => item.pathname == location.pathname);

  useEffect(() => {
    if (token == "" && auth) {
      message.error("token 过期，请重新登录!");
      navigate("/login");
    }
    // 这里判断条件是：token 存在并且是匹配到路由并且是已经登录的状态
    if (token && isExist && loginState == "login") {
      // 如果你已经登录了，但是你通过浏览器里直接访问login的话不允许直接跳转到login路由，必须通过logout来控制退出登录或者是token过期返回登录界面
      if (location.pathname == "/" || location.pathname == "/login") {
        navigate("/home");
      } else {
        // 如果是其他路由就跳到其他的路由
        navigate(location.pathname);
      }
    }
  }, [token, location.pathname]);

  return children;
};
export default AuthRoute;
```

# 路由重定向

直接使用`<Navigate to={"..."} />`进行跳转
