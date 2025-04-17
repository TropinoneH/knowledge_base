# Vue

## 1.安装

1. 安装Node.js
  - 下载[node](http://nodejs.cn/download/)
  - 配置环境变量:
    - 系统变量->添加->(NODE_PATH)(`安装目录/node_modules`)
    - 系统变量->修改->Path->加上(`D:\apps\Node.js\`)
    - 用户变量->修改->Path->加上(D`:\apps\Node.js\node_global`)
2. npm配置
   ```shell
   npm config set prefix "${安装目录}\node_global"
   npm config set cache "${安装目录}\node_cache"
   npm config set registry https://registry.npm.taobao.org
   ```
   > [!tip]
   > 请先把文件夹 右键->属性->安全 改成完全操控才能成功
   > 
   > 设置文件再C:/Users/username/.npmrc
3. yarn
  - 下载
    ```shell
npm i -g yarn
    ```
  - 配置
    - 可以使用yarn config list查看
    ```shell
yarn config set global-folder "${Nodejs安装目录}\node_global\yarn_global
yarn config set cache-folder "${Nodejs安装目录}\node_global\yarn_cache
    ```
4. vue
   ```shell
npm install -g @vue/cli
   ```
5. element
  - 官网[element ui](https://element.eleme.cn/#/zh-CN/component/installation)
    去控制台里面
    ```shell
cd <path/to/project>
npm i element-ui -S
    ```
  - 配置
    - 去package.json里面看看有没有一个[[ElementUI|element-ui]]的项,有版本号就是安装成功了
    - 引用:去看`https://element.eleme.cn/#/zh-CN/component/quickstart`,按照指示引用包
6. 安装axios
`npm install axios --save`如果没用,用这个:`npm i axios -S`
7. 安装vuex
  `npm i vuex --save`
8. 查看
  - java -version
  - vue --version/vue -V
  - npm -v
  - yarn -v
  - mvn -v

### 创建第一个项目

在相应文件夹下打开cmd(一定是cmd,不能是powershell!!!)

确保已经创建过[[git]]账号(可以不用[[git#创建私钥公钥|ssh]])

输入`vue create ${项目名}`
选择Manually select features
选Router
取消选中Linter/Formatter
选择2.x
Y
选择In package.json
N
等待即可

## 2.vue项目实战

### 1.项目创建

#### 1.简介

一般使用IntelliJ打开文件夹
- package.json:前端依赖的配置
- public:存放一个index.html静态文件
- src:
	- assets:存放logo
	- component:组件
	- router:路由,index.js存放路由设置
	- views:代码的页面放在views中
	- app.vue是程序的入口
- main.js是全局设置

创建项目时,npm已经帮我们把这些依赖安装好了,所以只需要在cmd中cd{文件名},然后输入npm run serve等待他跑完显示端口,然后打开端口就能打开页面了

或者再上面的有一个运行/调试配置,选择新建一个npm run,参数script输入serve即可.

#### 2.container的初步布置

使用[[ElementUI]]

```vue
<div style="height: 100%">
  <el-container style="height: 100% ;">
    <el-aside width="250px" style="background-color: rgb(238, 241, 246); height: 100%">
      <el-menu :default-openeds="['1', '3']" style="height: 100%">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>导航一</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-menu"></i>导航二</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-setting"></i>导航三</template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="3-1">选项1</el-menu-item>
            <el-menu-item index="3-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="3-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="3-4">
            <template slot="title">选项4</template>
            <el-menu-item index="3-4-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px; border-bottom: 1px solid #ccc; line-height: 60px;">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>

      <el-main>
        <el-table :data="tableData">
          <el-table-column prop="date" label="日期" width="140">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>

</div>
```

```vue
<script>

export default {
  name: 'HomeView',
  components: {

  },
  data(){
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    return {
      tableData: Array(30).fill(item)
    }
  }
}
</script>
```

注意,在el-menu中设置标签`:collapse-transition="false"`可以将菜单本身的动画关闭

## 3.axios的request类的封装

封装:

```javascript
import axios from 'axios'
import router from "@/router";
import {serverIp} from "../../public/config";

const request = axios.create({
    baseURL: `http://${serverIp}:9090`,
    timeout: 30000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    if (user) {
        config.headers['token'] = user.token;  // 设置请求头
    }

    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        // 当权限验证不通过的时候给出提示
        if (res.code === '401') {
            // ElementUI.Message({
            //     message: res.msg,
            //     type: 'error'
            // });
            router.push("/login")
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request
```

在main.js中加上:

```javascript
import request from "@/utils/request";

Vue.prototype.request=request
```



## 4前端项目的改造

### 1.样式改造

删除按钮加上确定对话框.方法:将原来的删除按钮改成弹出框来确定.如:

将

```vue
<el-button type="danger" class="mlr-5">批量删除<i style="margin-left: 5px" class="el-icon-remove-outline" /></el-button>
```

改成

```vue
<el-popconfirm
    confirm-button-text='好的' cancel-button-text='取消'
    icon="el-icon-info"   icon-color="red"
    title="确定删除吗？"
    @confirm="deleteBatch()">
  <el-button type="danger" class="mlr-5" slot="reference">批量删除<i style="margin-left: 5px" class="el-icon-remove-outline" /></el-button>
</el-popconfirm>
```

### 2.提取组件

将HomeVIew.vue重构重命名(`shift+F6`)成Manage.vue

然后新建组件Aside,Header,并将Manage中的相关选项移动到对应组件中

提取之后的组件为:

> 注意:这里的组件仅仅是提取之后的,还有更多的配置或功能还没有完善,仅供参考

Header:

```vue
<template>
<div style="font-size: 12px; line-height: 60px;display: flex">
  <div style="flex: 1px;font-size: 20px;">
    <span :class="collapseBtnClass" style="cursor: pointer" @click="collapse"> </span>
  </div>
  <el-dropdown style="cursor: pointer">
    <span>王小虎</span><i style="margin-left: 5px" class="el-icon-arrow-down"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>个人信息</el-dropdown-item>
      <el-dropdown-item>退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</div>
</template>

<script>
export default {
  name: "Header",
  props:{
    collapseBtnClass:String,
  },
  methods:{
    collapse() {
      // this.$parent.$parent.$parent.$parent.collapse()  // 通过4个 $parent 找到父组件，从而调用其折叠方法
      this.$emit("asideCollapse")
    },
  }
}
</script>

<style scoped>

</style>

```

Aside:

```vue
<template>
  <el-menu :default-openeds="['1', '3']"
           style="height: 100%; overflow-x: hidden;"
           background-color="rgb(48,65,86)"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           class="el-menu-vertical-demo"
           :collapse="isCollapse"
  >
    <div style="height: 60px;line-height: 60px;text-align: center">
      <img src="../assets/logo.png" alt="图标坏了,自己想象吧" style="width: 20px; position: relative; top: 5px;margin-right: 5px">
      <b style="color: white" v-show="logoTextShow">毕业纪念册--后台管理系统</b>
    </div>
    <el-menu-item index="1-1"><i class="el-icon-house" />主页</el-menu-item>
    <el-submenu index="2">
      <template slot="title"><i class="el-icon-menu"></i><span>系统管理</span></template>
      <el-menu-item-group>
        <template slot="title">用户</template>
        <el-menu-item index="2-1"><i class="el-icon-s-custom" /> 用户管理</el-menu-item>
        <el-menu-item index="2-2"><i class="el-icon-setting" /> 权限控制</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props:{
    isCollapse:Boolean,
    logoTextShow:Boolean,
  }
}
</script>

<style scoped>

</style>
```

在router文件夹中,将原先的HoneView的路由改成以下形式:

```javascript
  {
    path: '/',
    name: 'Manage',
    component: () => import("../views/Manage"),
    redirect:"/home",
    children:[
      {path:'home',name:'Home',component:()=>import("../views/Home")},
      {path:'user',name:'User',component:()=>import("../views/User")},
      {......}
    ]
  },
```

### 3.菜单路由的配置

在Aside中,给el-menu加上router标签:

```vue
<el-menu :default-openeds="['1', '3']"
           style="height: 100%; overflow-x: hidden;"
           background-color="rgb(48,65,86)"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           class="el-menu-vertical-demo"
           :collapse="isCollapse"
           router
  >
```

然后把下面的标签的index改成跳转连接的页面的路由(注意是子路由的地址)

我日他妈的,最后还是使用了vuex

所以就不写了.

注意在router/index.js里面要记得引入store包(`import store from './store'`)

## 5.登录界面

```vue
<template>
  <div class="wrapper">
    <div
        style="margin: 200px auto; background-color: #fff; width: 350px; height: 300px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>登 录</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password
                    v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item style="margin: 10px 0; text-align: right">
          <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/register')">注册</el-button>
          <el-button type="primary" size="small" autocomplete="off" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {setRoutes} from "@/router";

export default {
  name: "Login",
  data() {
    return {
      user: {},
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    login() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {  // 表单校验合法
          this.request.post("/user/login", this.user).then(res => {
            if (res.code === '200') {
              localStorage.setItem("user", JSON.stringify(res.data))  // 存储用户信息到浏览器
              localStorage.setItem("menus", JSON.stringify(res.data.menus))  // 存储用户信息到浏览器
              // 动态设置当前用户的路由
              setRoutes()
              this.$message.success("登录成功")

              if (res.data.role === 'ROLE_STUDENT') {
                this.$router.push("/front/home")
              } else {
                this.$router.push("/")
              }
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    }
  }
}
</script>

<style>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #FC466B, #3F5EFB);
  overflow: hidden;
}
</style>

```
