# 初始化

```shell
npx create-nuxt-app@2.15 {项目名} # 创建一个nuxt的文件,保证创建的额是nuxt2而不是nuxt3
create-nuxt-app v2.15.0
✨  Generating Nuxt.js project in .
? Project name study_nuxt
? Project description my first nuxt project, study SSR
? Author name Tropinone
? Choose programming language JavaScript
? Choose the package manager Npm
? Choose UI framework Vuetify.js # 可以不选,后面再安装
? Choose custom server framework Express # 选择自习需要的
? Choose Nuxt.js modules (Press <space> to select, <a> to toggle all, <i> to invert selection) # 可以不选
? Choose linting tools (Press <space> to select, <a> to toggle all, <i> to invert selection) # 可以不选
? Choose test framework None # 选None
? Choose rendering mode Universal (SSR) # 直接选这个就行,是后端的SSR渲染.另一个选项直接就是vue的单页面前端渲染模式.
? Choose development tools Semantic Pull Requests # VSCode推荐另一个
```

> 官网: [`nuxt`](https://www.nuxtjs.cn/guide)

在SSR模式下,渲染到前端的直接就是页面,而不是想`vue`的`id="app"`然后用各种类名来封装的,是通过js注入来改变div的样式,这样会导致搜索引擎爬虫找不到相应的资源,会导致引擎的排行下降甚至消失.

用SSR会将前端直接渲染成html再显示,这样搜索引擎就能找到了.

# 开始

## 运行

```shell
npm run dev # 开发时的运行
npm run build # 打包
npm run start # 放在服务端的,开始工作,必须先build(有.nuxt目录)才能开始工作.
```

## 目录



```
assets: 存放不编译的资源
components: 组件
layouts: 默认有个default布局
middleware: 中间件
pages: 相当于路由,文件夹同名的vue是父组件,将文件夹下的组件渲染到router-view里
plugins: 插件
server:
static: 静态文件,可以通过路由/{文件名}来获取
store: vuex的
```

> 在`vue`中引入static或assets中的文件可以通过~/assets/{文件名}或~/static/{文件名}来引入
>
> 或者直接用`require('@/assets/{文件名}')`等等

> 应用layout需要在script里面的`export default`中加上layout:名字

### static

存放不用经过编译的本地资源文件, 想要读取这里的文件可以直接通过`/{文件名}`的路径直接读取.

TODO: 验证文件和页面的路径冲突时该如何选择

### Layout

类似于是一个view,然后用`<nuxt />`来表示展示的子页面

所有的在pages下的页面都会默认应用`default.vue`的布局

类似于`router-link`, 这里的跳转用的是`nuxt-link`

### Pages

#### 动态路由

用`_id.vue`来表示这里的id是动态传递的, 通过context里的`params`来接受_id.

想要动态传参需要在路径中加上&a=1, 通过`query`来读取

## 生命周期

```
IncomingRequest                                                            服务端
->nuxtServerInit(Store action, 服务器初始化)                             nuxt渲染
->middleWare(中间件) <-----------------------------------------------|
	(nuxt.config.js,matching layout, matching pages&children)       |
->validate() (参数校验)                                          (navigate)
->asyncData&fetch(渲染之前读取异步数据,初始化之前就运行)             (<nuxt-link>)
->Render(渲染)	---------------------------------------------------|
->setup                                                                 vue渲染
->beforeCreated
->created
->...
```

### `nuxtServerInit`

在store中创建index.js(会和`vuex`冲突?不会,本来这个就是个`vuex`的组件,默认在用了),在里面写

```javascript
export const actions = {
  nuxtServerInit(store, context) {
    //初始化东西到store中
    console.log('nuxtServerInit', store, context)//注意,这里的log是输出到服务器的终端而不是浏览器的控制台
  }
}
```

在这里做一些初始化store的信息

### `middleWare`

在请求发出后尚未开始加载之前

#### 1.全局定义

在nuxt.config.js文件中,需要重启配置

找到nuxt.config.js里的`module.exports={}`,在里面加上`router:{}`来配置中间件

在`router:{}`中写middleware:'{所有的要运行的中间件名字}',名字就是在`middleWare`文件夹下的文件名

比如在`middleWare`文件夹下有auth.js文件,可以写
```javascript
/*
** 跳转路由之前, middleware是要运行的中间件的名称
*/
router:{
  middleware: 'auth'
},
```

然后可以写auth.js

```javascript
export default ({store, route, redirect, params, query, req, res}) => {
  //参数可以填context,包含所有的上下文信息
  //store状态管理实例,route单条路由信息,redirect后端跳转,params客户端请求参数,query数据,req请求头,res完整的请求体
  //可以用来做全局守卫业务(路由守卫在这里!)
  console.log('middleware')
  // redirect('/login') // 这个是跳转(傻逼nuxt)
}

```

#### 2.页面级定义

在layout或者在某个页面中,然后可以在`export default { middleware: 'auth' }`

#### 3.页面中创建中间件

```javascript
export default {
    middleware(){
        //这里写middleware的一些操作
    }
}
```

### `validate`

中间件之后, 加载之前, 验证参数是否合法.

```javascript
export default {
    validate({params, query}){
        //校验业务, 返回值是真或假, 表示通过或否
        console.log('validate')
        // 如果是false, 就直接返回到error的布局页面(nuxt默认的404页面)
        return true
    }
}
```

### `asyncData`和`fetch`

开始渲染之前, 获取变量的函数

```javascript
export default{
    asyncData(context){
        // 返回给组件的, 异步获取数据
        return {...}
    },
    fetch({store}){
        //一般是给vuex获取数据的
        //给store提交数据
    }
}
```

### `Vue`渲染

```javascript
export default{
    // CSR+SSR, 但是最好不要尝试拿任何一边的内容
    beforeCreate(){
        //创建之前
    },
    created(){
        //创建的时候
        //这里好像能拿到this, this指向组件
    },
    //CSR, 在服务端和客户端都会渲染, log会显示在服务端和浏览器
    beforeMount(){
        //挂载之前
    },
    mounted(){
        //挂载完毕
    },
    beforeUpdate(){
        //更新前
    },
    updated(){
        //更新时
        //如果是在调试工具(Vue专属调试工具,在浏览器上安装的)更新数据,那么如果不渲染(显示在页面上,那么是不会触发updated.但是如果是在代码中更新,那么不管是否渲染都会触发updated)
    },
    beforeDestroy(){
        //卸载前
    },
    destroyed(){
        //卸载后
    },
    //这两个只在客户端渲染, log只在浏览器打印
    activated(){
        //激活时
    },
    deactivated(){
        //失活后
    }
}
```

### 渲染时机

在服务端渲染, 所以不会在客户端(即浏览器)的`console`中打印, 只会在服务端打印输出.

> 注意
>
> 在服务端渲染的钩子函数不能访问到客户端, 即无法获取window对象. 只有在Vue渲染之后才能拿到window对象
>
> 在服务端跑的对象可以拿到context
>
> 服务端的this指向undefined

# 路由

约定式路由, 在pages文件夹下自动产生的路由.

文件夹就是路径, 文件夹同名的`Vue`页面就是相当于父页面. 父页面也不用`vue`的`router-view`而是用`nuxt`的`<nuxt />`

跳转: `to="/nnn/mmm/1&a=12?b=143"`或`:to="{name:'', params:{id:1}, query:{a:12, b:143}}"`

name:目录-子目录-文件名, params: 键值对应文件名

> 注意: 在创建动态路由页面时, 要把组件的名字去掉下划线, 否则会报错

## 展示区

如果想要在子路由下跳转后不显示父页面的内容, 可以删掉文件夹同名的`vue`文件, 然后在文件夹下创建`index.vue`文件, 然后将原来的文件夹同名`vue`文件中的内容改到`index.vue`中即可. 这样就会在跳转到子页面的时候把父页面隐藏. 

注意, 如果文件夹下没有`index.vue`页面, 那么`nuxt`会选择一个页面直接渲染到`<nuxt />`里面. 也就是说假如说文件目录如下:

```
|pages
|-goods
|--_id.vue
|-goods.vue
```

在`/goods`路径下会显示`goods-id`的页面, 只要加上`index.vue`就行, 这个文件中不用做任何修改.

## 拓展路由

在`nuxt.config.js`中找到router配置项,然后添加函数`extendRoutes(routes, resolve)`如下:

```javascript
router:{
    extendRoutes(routes, resolve){
        //resolve是提供的一个函数, 用于将磁盘上的一些内容返回给路由
        routes.push({
            name:'name',
            path:'/path',
            component: resolve(__dirname,"pages/index.vue")
            //这里的__dirname是提个魔术方法, 提供当前文件的路径, 然后找到pages/index.vue并返回给路由
            //这里也可以设置meta等等
        })
    }
}
```

## 参数校验

在动态路由中, 为了防止传递错误的参数, 应用参数校验进行再一次的检验.

```javascript
validate({params, query}){
    //校验传递的参数是一个数字而不是其他的什么
    //注意, 在参数校验时, 按住ctrl然后点击路由的跳转方式只会返回一个string的类型. 所以推荐使用正则表达式的方法去进行验证.如: return /^\d+$/.test(params.id)
    return typeof params.id === 'number'
}
```

## 配置错误页面

在layout文件夹下创建`error.vue`, 然后在里面接受错误信息error

```javascript
export default{
    //传递参数error:{statusCode, message}
    props: ['error'],
}
```

然后可以在页面上展示出来:

```vue
<template>
	<div v-if="error.statusCode">
        {{error.message}}
    </div>
</template>
```

## 路由守卫

### 前置

依赖中间件`middleware`

1. 全局守卫: 使用nuxt.config.js来只想`middleware`

2. 组件独享守卫: 在布局或页面使用`middleware`

```javascript
export default ({store, route, redirect, params, query, req, res}) => {
    //全局守卫业务:
    //store状态树信息 route目标路由信息 redirect强制跳转
    //params, query校验参数合理性 req请求头 res请求返回体
    redirect('/login') //强制跳转
}
```

### 后置

1. `vue`的`beforeRouteLeave`钩子函数

2. 在plugins文件夹下创建新文件`router.js`, 在`nuxt.config.js`中, 在plugins选项下添加router:`'~/plugins/router'`. 这样就能运行plugins.

在`router.js`中暴露函数:

```js
export default ({app, redirect, params, query, store}) => {
    // app是vue实例, redirect强制跳转
    //app有实例属性router, 那么就可以使用客户端的一些router跳转
    // 这里的log会在后台打印
    console.log('插件')
    //前置守卫
    app.router.beforeEach((to, from, next) => {
        //这个就是熟悉的Vue路由守卫
        //但是这里的next只能使用next(true)或next(false),但是不能用next('/login')等跳转路由的用法. 想要跳转只能用redirect
        next(true)
    })
    //后置守卫
    app.router.afterEach((to, from) => {})
}
```

在组件中守卫可以这样定义:

```js
export default{
    beforeRouteLeave(to, from, next){
        let leave = window.confirm('是否选择离开');
        next(leave)
    }
}
```

## meta信息

对于单个页面的meta信息:

```js
export default{
    head: () => ({
        meta: {title: 'title', author: 'visitor'}
    })
}
```

# 全局`css`

在`nuxt.config.js`中找到`css:[]`, 然后输入全局`css`的路径(如:`assets/css/global.css`)

# 数据交互

## 请求数据与跨域

```shell
# 安装axios和proxy
npm install @nuxtjs/axios @nuxtjs/proxy --save
```

然后再`nuxt.config.js`里的modules里面加上`'@nuxtjs/axios'`即可应用`axios`

更新:

不要用proxy配置!!!你会变得不幸!!!快去用后端自己的配置!!!

### 同域资源

下面的例子`axios`用到了[静态资源的读取](###static), 是直接读取的本地资源文件

读取方法:

```js
async asyncData({$axios}){
    let res = await $axios({url: '/data/list.json'})
    //已经在static目录下创建了data/list.json, 所以可以通过这种方式直接读取到list.json
    return {
        //通过return将数据返回给Vue组件, 只有return之后才能调用到这个变量
    }
}
```

```js
async fetch({$axios}){
    let res = await $axios({url: '/data/list.json'})
}
```

### 跨域资源

在`nuxt.config.js`中的`module.exports`里面创建一个`axios:{}`和`proxy:{}`的对象

```js
module.exports:{
    axios:{
        proxy: true, //这里保证已经安装了proxy模块
        prefix: '/api', //这个是baseUrl. 所有请求发出时默认佩戴的前缀
    },
    proxy:{
        '/api/':{
            target: '...', // 跨域的目标地址
            changeOrigin: true,
            pathRewrite:{
                // '^/api':'' // 替换, 可以不写
            }
        }
    }
}
```

### 全局拦截器

在plugins文件夹下创建文件`axios.js`, 然后添加到`nuxt.config.js`的plugins中:

```js
module.exports:{
    plugins:{
        {
            src: '~/plugins/axios',
            ssr: true, // 服务端渲染, 这样的话所有的log都会在后台打印
        }
    }
}
```

然后去`axois.js`中:

```js
export default function({$axios, redirect, route, store}){
    //配置基本配置信息
    //请求超时信息
    $axios.defaults.timeout = 30000
    //请求拦截
    $axios.onRequest(config => {
        config.headers.token = '114514'
        return config
    })
    //响应拦截
    $axios.onResponse(res => {
        if(res.code === '401'){
            redirect('/login')
        }
        return res
    })
    //错误处理
    $axios.onError(err => {
        //处理: ...
        return err
    })
}
```

## Loading页面的配置

在`nuxt.config.js`中找到`loading:{}`, 可以在这里面添加属性, 或者指定`Vue`组件

就是在最顶上的地方有一个加载条, 可以定义颜色及高度等信息.

或者这样: `loading: '~/components/loading'`

`loading.vue`:

```vue
<template>
  <div v-if="loading">Loading...</div>
</template>

<script>
export default {
  name: "loading",
  data:() => ({
    loading: false,
  }),
  methods:{
      // 注意这里面的两个函数不能更改, 这是nuxt约定好的
    start(){
      this.loading = true
    },
    finish(){
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
```

在跳转时, 先出现loading再出现目标页面的跳转

## `Vuex`

**模块方式**: `store`目录下的每一个`js`文件都会被转换为自定义状态树[被指定命名的子模块](https://vuex.vuejs.org/zh/guide/modules.html)

> 当然, `index.js`是根模块

**Classic方式**(不建议使用): `store/index.js`返回创建`Vuex.Store`实例的方法

在对某一个模块发出请求的时候, 要加上模块名. 如:

```js
this.$store.commit('{模块名}/{方法名}', {载荷}) //给mutations
this.$store.dispatch('{模块名}/{方法名}', {载荷}) //给actions
```

### 状态持久化

`localStorage`或`sessionStorage`或`cookies`, 在登录时同步, 然后强制刷新时通过`nuxtServerInit`钩子取出数据存到`vuex`中, `axios`拦截器读取`axios`添加token

可以使用插件`cookie-universal-nuxt`, 这样就能直接使用`this.$cookie`来对cookie进行读写

> 需要在`nuxt.config.js`里面的modules添加`'cookie-universal-nuxt'`
