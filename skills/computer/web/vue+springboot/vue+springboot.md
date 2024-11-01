# springboot

##  1.介绍

### 1.创建项目

前往`start.spring.io`去生成一个mvn包,用IDEA打开.里面的mvn文件夹/mvn/mvn.cmd/help.md都没有用,可以直接删除.

> 注意:在生成时要注意java的版本,jdk1.8_281是java8版本,别生成错了
>
> 还有就是依赖包:需要Mybatis,MySQL Drive,lombok,至少这三个

修改application.proprieties重命名为application.yml,并贴入一下数据:

```yml
server:
  port: 9090

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/springboot-vue?serverTimezone=GMT%2b8
    username: root
    password: 123456

```

在pom.xml中,在最后面(至少是在`<>buil>...</build>`的后面,`<project>...</project>`里面)加上

```xml
<repositories>
		<repository>
			<id>nexus-aliyun</id>
			<name>nexus-aliyun</name>
			<url>http://maven.aliyun.com/nexus/content/groups/public/</url>
			<releases>
				<enabled>true</enabled>
			</releases>
			<snapshots>
				<enabled>false</enabled>
			</snapshots>
		</repository>
	</repositories>

	<pluginRepositories>
		<pluginRepository>
			<id>public</id>
			<name>aliyun nexus</name>
			<url>http://maven.aliyun.com/nexus/content/groups/public/</url>
			<releases>
				<enabled>true</enabled>
			</releases>
			<snapshots>
				<enabled>false</enabled>
			</snapshots>
		</pluginRepository>
	</pluginRepositories>
```

### 2.安装依赖

#### 1.mybatis-plus

找到`https://baomidou.com/pages/bab2db/#release`

在pom.xml中输入:

```xml
<dependency>
	<groupId>com.baomidou</groupId>
	<artifactId>mybatis-plus-boot-starter</artifactId>
	<version>3.5.1</version>
</dependency>
```

#### 2.swagger

```xml
<!--swagger-->
<dependency>
	<groupId>io.springfox</groupId>
	<artifactId>springfox-boot-starter</artifactId>
	<version>3.0.0</version>
</dependency>

```

> 他妈了个傻逼的注意:swagger3要求springboot在2.6以下(至少是2.5.9)才可能成功

新建一个SwaggerConfig类

```java
package com.example.Springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.oas.annotations.EnableOpenApi;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@EnableOpenApi
public class SwaggerConfig {

    /**
     * 创建API应用
     * apiInfo() 增加API相关信息
     * 通过select()函数返回一个ApiSelectorBuilder实例,用来控制哪些接口暴露给Swagger来展现，
     * 本例采用指定扫描的包路径来定义指定要建立API的目录。
     */
    @Bean
    public Docket restApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("标准接口")
                .apiInfo(apiInfo("Spring Boot中使用Swagger2构建RESTful APIs", "1.0"))
                .useDefaultResponseMessages(true)
                .forCodeGeneration(false)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.example.Springboot.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    /**
     * 创建该API的基本信息（这些基本信息会展现在文档页面中）
     * 访问地址：http://ip:port/swagger-ui/index.html
     */
    private ApiInfo apiInfo(String title, String version) {
        return new ApiInfoBuilder()
                .title(title)
                .version(version)
                .build();
    }
}

```

然后运行项目打开localhost:9090/swagger-ui/index.html即可

##### 补充

如果集成了jwt,需要在InterceptorConfig中的`public void addInterceptors`中registry后面链式编程点上`.excludePathPatterns("/swagger-ui/**", "/swagger-resources/**", "/webjars/**", "/v2/**", "/swagger-ui.html/**")`才可以被放行

> 注意!最终发布之前一定要把swagger拦截下来,否则网站的数据会很不安全

### 3.hutool

```xml
<!-- hutool, 一个静态方法封装的小但是全的java工具类库 -->
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.7.5</version>
</dependency>
```

### 4.springboot四层框架

Entity层：实体层 数据库在项目中的类

> Entity层是实体层，也就是所谓的model，也称为pojo层，是数据库在项目中的类，包含实体类的属性和对应属性的set、get方法。

Mapper层： 持久层 主要与数据库进行交互

> Mapper层，也称Dao层，会定义实际使用到的方法，比如增删改查。数据源和数据库连接的参数都是在配置文件中进行配置的，配置文件一般在同层的XML文件夹中。对数据进行持久化操作。
> Mybatis逆向工程生成的mapper层，其实就是dao层。
> 调用entity层。
> 能够实现对数据的持久化操作。

Service层：业务层 控制业务
> Service层主要负责业务模块的逻辑应用设计。
> 先设计放接口的类，再创建实现的类（impl），然后在配置文件中进行配置其实现的关联。
> 调用mapper层，接收mapper层返回的数据，完成项目的基本功能设计。
> 封装Service层的业务逻辑有利于业务逻辑的独立性和重复利用性。

Controller层：控制层 控制业务逻辑(接口层)
> Controller层负责具体的业务模块流程的控制。
> controller层负责前后端交互，接受前端请求。
> 调用service层，接收service层返回的数据，最后返回具体的页面和数据到客户端。

## 2.运行

### 1.测试连接

当创建好一个项目之后,首先要先测试连接是否成功.

首先建立sql数据库,数据库端口与application.yml中url中localhost:后面的值相同,数据库名称与url中`端口\`后`?`之前名称相同.

注意要打开mysql数据库,即以管理员身份运行cmd中输入

```shell
net start mysql
```

> 注意,执行这条语句必须是以管理员身份运行的cmd中

在`src/main/java/com/example/Springboot/SpringbootApplication.java`中(注意,Springboot是文件的名称),在类外输入标签@RestController,在类内部,输入方法

```java
@GetMapping("/")
public String index(){
   return "good";
}
```

>  注意@RestController和@GetMapping都需要引入头文件,所以推荐使用输入一半按回车的方法,java可以自动生成引用头文件

运行程序,打开浏览器,输入127.0.0.1:9090,如果显示good,说明连接正常无误

---

### 2.测试接口

#### 1.创建实体类

在`src/main/java/com/example/Springboot`中创建软件包entity,创建java类User,User类中定义私有成员变量(尽量跟数据库中的变量一致)

~~然后按`Alt+Insert`组合键,选择`Getter和Setter`,将字段全部选择,点击确认~~

~~但是!!!上述内容全部不用写!!!~~

因为我们引入了一个插件叫做lombok,只需要在类前面打上标签`@Data`即可完成上述工作,而且代码十分简洁(因为是在编译时才会将标签解码,所以平常看上去只是一个@...的标签,很简洁)

如果不想再传输Json包时传输密码,介意给password打上标签`@JsonIgnore`

> 注意,这里还是那个原因,需要引入数据包

```
其他标签:
@NoArgsConstructor创建无参构造
@AllArgsConstructor创建有参构造
```

#### 2.创建接口

在`src/main/java/com/example/Springboot`中创建软件包mapper,创建接口类UserMapper

在类前面加上标签`@Mapper`

里面写上

```java
@Select("SELECT * from sys_user") //这里的sys-user是数据库表的名字
List<User> findAll();
```

测试:

在SpringbootApplication.java中,写上

```java
@Autowired
private UserMapper userMapper;
```

将之前创建的测试函数(index)中将返回值类型改成`List<User>`

然后再将返回值改成`userMapper.findAll();`

最后访问127.0.0.1:9090,看看有没有将所有的数据库内容返回

> 但是注意,想要使用@GetMapping注解那就必须再类前面加上@RestController注解才能使用.即在写任何接口之前都要写上@RestController
>
> 注意之二:正规开发时应该是再新建一个软件包叫做controller(接口),然后在那一个软件包中进行controller的相关开发
>
> 注意之三:当然喽,更规范一点的写法应该是再写一个Service层做业务逻辑处理
>
> 好了,上面的所有就当是没写过把(因为是测试)

---

### 3.common软件包

包括Result请求返回数据模板,Constants请求代码,RoleEnum角色权限枚举

Result:

```java
package com.example.springboot.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 接口统一返回包装类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {

    private String code;
    private String msg;
    private Object data;

    public static Result success() {
        return new Result(Constants.CODE_200, "", null);
    }

    public static Result success(Object data) {
        return new Result(Constants.CODE_200, "", data);
    }

    public static Result error(String code, String msg) {
        return new Result(code, msg, null);
    }

    public static Result error() {
        return new Result(Constants.CODE_500, "系统错误", null);
    }

}
```

Constants:

```java
package com.example.springboot.common;

public interface Constants {

    String CODE_200 = "200"; //成功
    String CODE_401 = "401";  // 权限不足
    String CODE_400 = "400";  // 参数错误
    String CODE_500 = "500"; // 系统错误
    String CODE_600 = "600"; // 其他业务异常

    String DICT_TYPE_ICON = "icon";

    String FILES_KEY = "FILES_FRONT_ALL";

}

```

RoleEnum:

```

```

---

### 4.接口controller

#### 1.接口开发

按照上面注意之二的内容将文件创建,在controller接口层中类名前面写上`@RequestMapping("/user")`

`/user`是接口的路由,也就是说需要从`/user`才能访问到接口

也就是说想要再显示出来之前的那个页面,需要访问`127.0.0.1:9090/user/`才行

> 注意,最后一定要有一个`/`才能正确访问,因为你定义的那个方法的`@GerMappin("/")`的地址是`/`

#### 2.接口测试

使用postman软件

按照指示无脑操作即可.注意保持服务运行

#### 3.service层开发

创建软件包service,创建Java类UserService

在类前面写上注解`@Service`,这就相当于把这个注入到springboot的容器里面.

#### 4.动态serve

在写接口的时候,会发现有的时候需要对sql语句进行判断再执行,就比如:

```java
@Update("UPDATE sys_user SET username=#{username},password=#{password},email=#{email},phone=#{phone},nickname=#{nickname} WHERE id=#{id}")
    int update(User user);
```

这里如果传参并没有传全时,就会导致将所有没有传进来的参数直接修改为NULL,那么想要进行判断,那么我们需要进行动态serve.

1.  在resources文件夹下创建新文件夹mapper
2. 新建文件User.xml
3. 去网上查到mybatis xml的格式,复制开头几行如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.Springboot.mapper.UserMapper"></mapper>
```

注意那个namespace是指的是你的UserMapper的引用(可以右键->复制路径/引用->复制引用即可)

> 记得要去IntelliJ的`插件`里找到MyBatisX并安装,然后你就能在xml文件的`<mapper>`标签处看到一个标记,点击那个可以快捷跳转.

在`<mapper></mapper>`标签中写:

```xml
	<update id="sys_user" >
        <set>
            <if test="username != null">
                username=#{username},
            </if>
<!--            <if test="password!=null">-->
<!--                password=#{password}-->
<!--            </if>-->
            <if test="sex!=null">
                sex=#{sex},
            </if>
            <if test="email!=null">
                email=#{email},
            </if>
            <if test="phone!=null">
                phone=#{phone},
            </if>
            <if test="nickname!=null">
                nickname=#{nickname}
            </if>
        </set>
        <where>id=#{id}</where>
    </update>
```

> 注意:别忘了加上`,`

这里的id是对应的mapper层中的接口名称.如果写对了,那么就会在左侧边栏行数前面出现一个图标(和之前的`<select>`标签旁的那个一样),也是可以快速跳转

既然在xml文件中写了上述内容,那么在UserMapper中就可以删除

```java
@Update("UPDATE sys_user SET username=#{username},password=#{password},email=#{email},phone=#{phone},nickname=#{nickname} WHERE id=#{id}")
```

这一大段内容了.

> 注意,这里可能不允许修改password,因为太危险,一般在另外的地方修改password

然后想要再全局使用刚刚写的xml文件,那么需要在application.yml中加上这样的一条语句:

```yaml
mybatis:
  mapper-locations: classpath:mapper/*.xml #扫描所有xml文件
```

注意,这里的classpath指的是resources文件夹,所以这个的`:`后面没有空格,否则会报错.

#### 5.创建删除接口

UserMapper中:

```java
    @Delete("DELETE FROM sys_user WHERE id=#{id}")
    int deleteById(@Param("id") Integer id);
```

这里的参数前面最好加上`@Param("id")`表示这里的id就是那个参数id

UserController中:

```java
    @DeleteMapping("{/id}")
    public int delete(@PathVariable Integer id){
    	return userMapper.deleteById(id);
    }
```

这里面的`"{/id}"`指的就是传入的参数

注意,controller层中所有的接口路径都不能相同,而且方法名不能相同

#### 6.创建按页码查询功能

##### 基础

@RequestParam标签是将前端传过来的数值映射到参数中.

如:UserController中:

```java
@GetMapping("/page")
    public Map<String, Object> findPage(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize){
        return userService.findPage(pageNum, pageSize);
    }
```

如果前端的路径是`/user/page?pageNum=1&pageSize=10`就是说查询第一页的数据,每一页有十个数据.(`/user`是整个接口层的根路由)

如果是用`@RequestParam(defaultValue = "")`那么可以不传参,用默认参数去调用这个接口

然后再Service层中进行逻辑处理:

```java
    public Map<String, Object> findPage(Integer pageNum, Integer pageSize){
        pageNum = (pageNum - 1) * pageSize;
        Integer total = userMapper.findTotal();
        List<User> data = userMapper.findByPage(pageNum, pageSize);
        Map<String,Object>res = new HashMap<>();
        res.put("total",total);
        res.put("data",data);
        return res;
    }
```

最后在Mapper层中进行对数据库的访问:

```java
    @Select("SELECT * FROM sys_user LIMIT #{pageNum},#{pageSize}")
    List<User> findByPage(Integer pageNum, Integer pageSize);

    @Select("SELECT COUNT(*) FROM sys_user")
    Integer findTotal();
```

> 注意,这里是使用Map进行参数传递,这里用到的total是另外一个mapper请求获取到的.其实还应该获取当前页面和当前页面数据库用户总数,但是这本身就是参数,因此不再去请求获取.

##### 补充

兼顾username的查询:

只列出修改的地方:

UserController:

```java
@GetMapping("/page")
    public Map<String, Object> findPage(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize, @RequestParam(defaultValue="")){
        return userService.findPage(pageNum, pageSize,username);
    }
```

UserService:

```java
    public Map<String, Object> findPage(Integer pageNum, Integer pageSize, String username){
        pageNum = (pageNum - 1) * pageSize;
        username = '%'+username+'%';
        Integer total = userMapper.findTotal(username);
        List<User> data = userMapper.findByPage(pageNum, pageSize, username);
        Map<String,Object>res = new HashMap<>();
        res.put("total",total);
        res.put("data",data);
        return res;
    }
```



UserMapper:

```java
@Select("SELECT * FROM sys_user WHERE username like #{username} LIMIT #{pageNum},#{pageSize}")
    List<User> findByPage(Integer pageNum, Integer pageSize, String username);

    @Select("SELECT COUNT(*) FROM sys_user WHERE username like #{username}")
    Integer findTotal(String username);
```

#### 7.创建批量删除接口

```java
@DeleteMapping("/del/batch/{ids}")
public Result deleteBatch(@PathVariable List<Integer> ids){
    return Result.success(userService.removeByIds(ids));//这里是已经加入mybatis-plus之后的那个大冤种写的
}
```

#### 8.创建登录接口

##### 1.前提

为了不影响实体类的数据,在controller软件包中创建一个新的软件包:dto.

创建新的类UserDTO:接受前端登录请求的参数,放自己要求的数据,加上标签@Getter

创建新的exception软件包,用于处理全局异常.

exception下创建两个类:GlobalExceptionHandle和ServiceException,GEH去获取全局的SE并处理

GEH:

```java
package com.example.springboot.exception;

import com.example.springboot.common.Result;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class GlobalExceptionHandler {
    /**
     * @ExceptionHandler相当于controller的@RequestMapping的方法
     * 如果抛出的是ServiceException则调用这个方法
     * @param se 业务异常
     * @return Result
     */
    @ExceptionHandler(ServiceException.class)
    @ResponseBody
    public Result handle(ServiceException se){
        return Result.error(se.getCode(),se.getMessage());
    }
}

```

SE:

```java
package com.example.springboot.exception;

import lombok.Getter;

@Getter
public class ServiceException extends RuntimeException{
    private String code;

    public ServiceException(String code, String msg){
        super(msg);
        this.code=code;
    }
}
```

##### 2.登录功能的实现

(这是"我是大冤种之二之后的")

UserController:

```java
@PostMapping("/login")
    public Result login(@RequestBody UserDTO userDTO){
        String username = userDTO.getUsername();
        String password = userDTO.getPassword();
        if(StrUtil.isBlank(username) || StrUtil.isBlank(password)){
            return Result.error(Constants.CODE_400,"参数错误");
        }
        return Result.success(userService.login(userDTO));
    }
```

IUserService:

`UserDTO login(UserDTO userDTO);`

UserServiceImpl:

```java
public UserDTO login(UserDTO userDTO){
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("username",userDTO.getUsername());
    queryWrapper.eq("password",userDTO.getPassword());
    User one;
    try{
        one = getOne(queryWrapper);
    }catch (Exception e){
        throw new ServiceException(Constants.CODE_600,"系统错误");
    }
    if(one != null){
        BeanUtil.copyProperties(one,userDTO,true);
        return userDTO;
    }else{
        throw new ServiceException(Constants.CODE_600,"用户名或密码错误");
    }
}
```

### 4.我是大冤种之一：MybatisPlus一键解决分页问题

#### 1.创建配置类

在config软件包中创建MybatisPlusConfig类,内部贴入代码:

```java
/**
 * 新的分页插件,一缓和二缓遵循mybatis的规则,需要设置 MybatisConfiguration#useDeprecatedExecutor = false 避免缓存出现问题(该属性会在旧插件移除后一同移除)
 */
@Bean
public MybatisPlusInterceptor mybatisPlusInterceptor() {
    MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
    interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
    return interceptor;
}
```

然后按`Alt+Enter`直到将所有的包都引入为止.

在给类加上标签`@Configuration`,`@MapperScan("com.example.Springboot.mapper")`

第二个标签相当于是在mapper文件夹下每一个文件前面都加上了@Mapper,将其注入到Springboot容器中.这样可以不用写@Mapper即可.

因为有一个开发规定,配置的东西放到配置类中而非启动项中

> 注意:DBType是数据库类型,这里是MySql

> Tips:还记不记得之前有个大冤种写的一个打印mysql请求参数的命令?那个现在也不管用了!哈哈哈哈哈哈哈!!!!!!!!!!!!!!!!
>
> 修改方法:把那里的mybatis改成mybatis-plus即可
>
> mybatis-plus:
>   mapper-locations: classpath:mapper/*.xml #扫描所有xml文件

#### 2.mapper层

给mapper层的类继承BaseMapper<实例类>

然后就可以将类内部完全删除了!哈!啊!我操他妈的啊!不删除还会报错我操他妈的啊!

#### 3.service层

给类继承ServiceImpl<UserMapper,User>

这里的User是实例类(只是一个例子)

这里面包含了一堆函数,包括save()函数(底层实现是一样的,所以说我是大冤种)

#### 4.实体层

需要加上标签`@TableName(value="sys_user")`

这里的sys_user是我自己的表名,因为如果不加这个mybatis-plus会自动寻找类名转小写之后的表,很可能会找不到.

在实体类内部,给id加上`@TableId(value="id",ype=IdType.AUTO)`,AUTO的原因是数据库的id字段已经设置成自动递增选项了.这里加上value是为了防止实体类中的字段名不叫id

如果想要让实体类中的字段名和数据库中的字段名不同,可以给实体类中的字段加上标签:`@TableField(value="...")`,这个...就是数据库中的匹配的字段名

> 注意:这里会自动将驼峰转成下划线

### 5.我是大冤种之二：mybatisplus的springboot代码一键生成器

#### 1.导入包:mybatis-plus-generator

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.5.1</version>
</dependency>
```

还要导入另一个依赖包:Velocity

```xml
<dependency>
    <groupId>org.apache.velocity</groupId>
    <artifactId>velocity</artifactId>
    <version>1.7</version>
</dependency>
```

#### 2.创建工具类

创建utils软件包,新建java类CodeGenerator,输入psvm创建一个main入口类

创建新的私有函数generator

```java
private static void generator(){
        FastAutoGenerator.create("url", "username", "password")
                .globalConfig(builder -> {
                    builder.author("Tropinone") // 设置作者
                            .enableSwagger() // 开启 swagger 模式
                            .fileOverride() // 覆盖已生成文件
                            .outputDir("D:\\files\\html\\graduation album for web\\springboot\\src\\main\\java\\"); // 指定输出目录
                })
                .packageConfig(builder -> {
                    builder.parent("com.example.springboot") // 设置父包名
                            .moduleName("") // 设置父包模块名
                            .pathInfo(Collections.singletonMap(OutputFile.mapperXml, "D:\\files\\html\\graduation album for web\\springboot\\src\\main\\resources\\mapper\\")); //设置mapperXml生成路径
                })
                .strategyConfig(builder -> {
                                        builder.entityBuilder().enableLombok();//允许使用lombok
                    builder.mapperBuilder().enableMapperAnnotation().build();//在mapper前加上@Mapper
                    builder.controllerBuilder().enableRestStyle().enableHyphenStyle();//使用RestController而不是Controller,并且开启下划线转驼峰
                    builder.addInclude("sys_user") // 设置需要生成的表名
                            .addTablePrefix("t_", "sys_"); //设置过滤表前缀
                })
                .execute();
}
```

然后将第一行的url改成数据库的url(就是在application.yml中的那个),然后输入你自己的数据库用户名以及密码.

下面的那个author改成自己就行,注意在那个文件生成路径中一定要改成自己的项目目录中的java文件夹,父包模块名直接写成`null`就行(没有的话)(而且必须是null,如果是`""`的话会变成两条斜杠)

再将那个设置父包名改成那个什么什么`com.example.什么`的那个,mapperXml的生成路径改成在resources中新建(或者已有)的那个mapper文件夹,最后要加上两个斜杠

最后,把那个生成的表名改成sys_user(就是之前某个大冤种创建的表名),后面接上的过滤前缀就是为了防止生成的spring四层什么的都带有有一个sys\_的前缀("t\_"其实没什么用)

> 注意:文件生成路径和mapperXml的生成路径最后都有两个斜杠
>
> !!!警告!!!开始生成之后将会覆盖掉原来的文件,请注意!为了保证文件不出现错误,请先将原来的文件备份!(备份springboot四层的文件即可,虽然service层不用备份,因为自动生成的是IUserService(以UserService为例))
>
> 我操他妈的注意注意注意!!!所有的Url中的空格不要替代!!!虽然会报错找不到文件,但那是系统文件浏览器自身的问题!!!尽量在项目名称里面不要存在空格!!!!!!!!!

提示`=========文件生成完成!!!=========`然后就会覆盖掉原来的文件

#### 3.模板更改

找到`jetbrains://idea/navigate/reference?project=springboot&fqn=templates`(相对路径)这里面的*.java.vm,然后将它复制到src/resources/template中

controller.java.vm:

```vm
package ${package.Controller};

import org.springframework.web.bind.annotation.*;
import com.example.springboot.common.Result;
import javax.annotation.Resource;
import java.util.List;

import $!{package.Service}.$!{table.serviceName};
import ${package.Entity}.${entity};

#if(${superControllerClassPackage})
import ${superControllerClassPackage};
#end

/**
 * <p>
 * $!{table.comment} 前端控制器
 * </p>
 *
 * @author ${author}
 * @since ${date}
 */

#if(${restControllerStyle})
@RestController
#else
@Controller
#end
@RequestMapping("#if(${package.ModuleName})/${package.ModuleName}#end/#if(${controllerMappingHyphenStyle})${controllerMappingHyphen}#else${table.entityPath}#end")
#if(${kotlin})
class ${table.controllerName}#if(${superControllerClass}) : ${superControllerClass}()#end
#else
#if(${superControllerClass})
public class ${table.controllerName} extends ${superControllerClass} {
#else
public class ${table.controllerName} {
#end

    @Resource
    private ${table.serviceName} ${table.entityPath}Service;

    @PostMapping
    public Result save(@RequestBody ${entity} ${table.entityPath}) {
        return Result.success(${table.entityPath}Service.saveOrUpdate(${table.entityPath}));
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        return Result.success(${table.entityPath}Service.removeById(id));
    }

    @GetMapping
    public Result findAll() {
        return Result.success(${table.entityPath}Service.list());
    }

    @GetMapping("/{id}")
    public Result findOne(@PathVariable Integer id) {
        return Result.success(${table.entityPath}Service.list());
    }

    @GetMapping("/page")
    public Result findPage(@RequestParam(defaultValue = "1") Integer pageNum,
                           @RequestParam(defaultValue = "10") Integer pageSize,
                           @RequestParam(defaultValue = "${table.entityPath}name") String optionValue,
                           @RequestParam(defaultValue = "") String ${table.entityPath}name){
        return Result.success(${table.entityPath}Service.findPage(pageNum, pageSize, optionValue, ${table.entityPath}name));
        }
}

#end

```

service.java.vm:

```vm
package ${package.Service};

import ${package.Entity}.${entity};
import ${superServiceClassPackage};
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * <p>
 * $!{table.comment} 服务类
 * </p>
 *
 * @author ${author}
 * @since ${date}
 */
#if(${kotlin})
interface ${table.serviceName} : ${superServiceClass}<${entity}>
#else
public interface ${table.serviceName} extends ${superServiceClass}<${entity}> {
    IPage<User> findPage(Integer pageNum, Integer pageSize, String optionValue,String username);
}
#end
```

serviceImpl.java.vm:

```vm
package ${package.ServiceImpl};

import ${package.Entity}.${entity};
import ${package.Mapper}.${table.mapperName};
import ${package.Service}.${table.serviceName};
import ${superServiceImplClassPackage};
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

/**
 * <p>
 * $!{table.comment} 服务实现类
 * </p>
 *
 * @author ${author}
 * @since ${date}
 */
@Service
#if(${kotlin})
open class ${table.serviceImplName} : ${superServiceImplClass}<${table.mapperName}, ${entity}>(), ${table.serviceName} {
        public IPage<User> findPage(Integer pageNum, Integer pageSize, String optionValue,String username){
            IPage<User> iPage = new Page<>(pageNum,pageSize);
            QueryWrapper<User> queryWrapper = new QueryWrapper<User>();
            switch (optionValue){
                case "username":
                queryWrapper.like("username",username);
                break;
            case "nickname":
                queryWrapper.like("nickname",username);
                break;
            case "email":
                queryWrapper.like("email",username);
                break;
            case "phone":
                queryWrapper.like("phone",username);
                break;
            case "sex":
                queryWrapper.like("sex",username);
                break;
            }
        return page(iPage,queryWrapper);
    }
}
#else
public class ${table.serviceImplName} extends ${superServiceImplClass}<${table.mapperName}, ${entity}> implements ${table.serviceName} {
        public IPage<User> findPage(Integer pageNum, Integer pageSize, String optionValue,String username){
            IPage<User> iPage = new Page<>(pageNum,pageSize);
            QueryWrapper<User> queryWrapper = new QueryWrapper<User>();
            switch (optionValue){
                case "username":
                queryWrapper.like("username",username);
                break;
            case "nickname":
                queryWrapper.like("nickname",username);
                break;
            case "email":
                queryWrapper.like("email",username);
                break;
            case "phone":
                queryWrapper.like("phone",username);
                break;
            case "sex":
                queryWrapper.like("sex",username);
                break;
            }
        return page(iPage,queryWrapper);
    }
}
#end
```

> 注意:这一版是自己魔改过后的,还必须需要自己新建一个Result类
>
> 注意之二:这三个模板更改必须同时使用,并且请根据自己使用的参数不同进行酌情更改

### 6.跨域问题的后端解决方案

新建一个软件包叫做config,创建类CorsConfig.java

```java
package com.example.Springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    // 当前跨域请求最大有效时长。这里默认1天
    private static final long MAX_AGE = 24 * 60 * 60;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("http://127.0.0.1:8080"); // 1 设置访问源地址
        corsConfiguration.addAllowedHeader("*"); // 2 设置访问源请求头
        corsConfiguration.addAllowedMethod("*"); // 3 设置访问源请求方法
        corsConfiguration.setMaxAge(MAX_AGE);
        source.registerCorsConfiguration("/**", corsConfiguration); // 4 对接口配置跨域设置
        return new CorsFilter(source);
    }
}

```

这里面的设置源地址可以改成允许访问的源地址

> 注意注意注意!!!!日你妈!!!!!localhost!=127.0.0.1!!!!!我屮艸芔茻!!!

### 7.springboot集成jwt

#### 1.简介

Jwt全称是：json web token。它将用户信息加密到token里，服务器不保存任何用户信息。服务器通过使用保存的密钥验证token的正确性，只要正确即通过验证。

优点

1. 简洁: 可以通过URL、POST参数或者在HTTP header发送，因为数据量小，传输速度也很快

2. 自包含：负载中可以包含用户所需要的信息，避免了多次查询数据库；

3. 因为Token是以JSON加密的形式保存在客户端的，所以JWT是跨语言的，原则上任何web形式都支持；

4. 不需要在服务端保存会话信息，特别适用于分布式微服务。


缺点

1. 无法作废已颁布的令牌；
2. 不易应对数据过期。

#### 2.组成

一个`token`分3部分，按顺序为

1. 头部（`header`)
2. 载荷（`payload`)
3. 签证（`signature`)

三部分之间用`.`号做分隔。例如：

`ajdp893jjoijdoqj.jq98wedjqj9203.890qrn8hru3jq9sj`(拿脸滚键盘滚出来的,没有任何实际意义,且不作为参考)

##### 1.header
Jwt的头部承载两部分信息：

声明类型，这里是Jwt
声明加密的算法 通常直接使用 HMAC SHA256
Jwt里验证和签名使用的算法列表如下：

JWS	算法名称
HS256	HMAC256
HS384	HMAC384
HS512	HMAC512
RS256	RSA256
RS384	RSA384
RS512	RSA512
ES256	ECDSA256
ES384	ECDSA384
ES512	ECDSA512
##### 2.playload
载荷就是存放有效信息的地方。基本上填2种类型数据

标准中注册的声明的数据；
自定义数据。
由这2部分内部做base64加密。

标准中注册的声明 (建议但不强制使用)
iss: jwt签发者
sub: jwt所面向的用户
aud: 接收jwt的一方
exp: jwt的过期时间，这个过期时间必须要大于签发时间
nbf: 定义在什么时间之前，该jwt都是不可用的.
iat: jwt的签发时间
jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。
自定义数据:存放我们想放在token中存放的key-value值
##### 3.signature
Jwt的第三部分是一个签证信息，这个签证信息由三部分组成
base64加密后的header和base64加密后的payload连接组成的字符串，然后通过header中声明的加密方式进行加盐secret组合加密，然后就构成了Jwt的第三部分。

#### 3.使用
##### 2.1、项目依赖 pom.xml
```xml
<dependency>
	<groupId>com.auth0</groupId>
	<artifactId>java-jwt</artifactId>
	<version>3.10.3</version>
</dependency>
```
##### 3.2、配置InterceptorConfig

在config中

```java
package com.example.springboot.config;

import com.example.springboot.common.interceptor.JwtInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor())
                .addPathPatterns("/**") //拦截所有请求,通过验证token来判断是否合法
                .excludePathPatterns("/user/login")
          		.excludePathPatterns("/swagger-ui/**", "/swagger-resources/**", "/webjars/**", "/v2/**", "/swagger-ui.html/**");
    }

    @Bean
    public JwtInterceptor jwtInterceptor(){
        return new JwtInterceptor();
    }
}
```

 ##### 3.3、Token生成

在Utils中新建TokenUtils类

 ```java
package com.example.springboot.utils;

import cn.hutool.core.date.DateUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.Date;

public class TokenUtils {

    /**
     * 生成token
     * @return
     */
    public static String genToken(String userId, String sign){
        return JWT.create().withAudience(userId) // 将 user id 保存到 token 里面
                .withExpiresAt(DateUtil.offsetHour(new Date(), 2)) //两小时后token过期
                .sign(Algorithm.HMAC256(sign));
    }
}

 ```
 ##### 3.4、拦截器拦截token

在common中新建interceptor软件包,新建JwtInterceptor

 ```java
package com.example.springboot.common.interceptor;

import cn.hutool.core.util.StrUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.springboot.common.Constants;
import com.example.springboot.config.AuthAccess;
import com.example.springboot.entity.User;
import com.example.springboot.exception.ServiceException;
import com.example.springboot.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private IUserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader("token");

        // 如果不是映射到方法直接通过
        if(!(handler instanceof HandlerMethod)){
            return true;
        } else {
            HandlerMethod h = (HandlerMethod) handler;
            AuthAccess authAccess = h.getMethodAnnotation(AuthAccess.class);
            if (authAccess != null) {
                return true;
            }
        }
        // 执行认证
        if (StrUtil.isBlank(token)) {
            throw new ServiceException(Constants.CODE_401, "无token，请重新登录");
        }
        // 获取 token 中的 user id
        String userId;
        try {
            userId = JWT.decode(token).getAudience().get(0);
        } catch (JWTDecodeException j) {
            throw new ServiceException(Constants.CODE_401, "token验证失败，请重新登录");
        }
        // 根据token中的userid查询数据库
        User user = userService.getById(userId);
        if (user == null) {
            throw new ServiceException(Constants.CODE_401, "用户不存在，请重新登录");
        }
        // 用户密码加签验证 token
        JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256(user.getPassword())).build();
        try {
            jwtVerifier.verify(token); // 验证token
        } catch (JWTVerificationException e) {
            throw new ServiceException(Constants.CODE_401, "token验证失败，请重新登录");
        }
        return true;
    }
}

 ```
# vue

## 1.安装

1. 安装Node.js

  + 下载

 ```
    http://nodejs.cn/download/
 ```

  + 配置环境变量:

    - 系统变量->添加->(NODE_PATH)(安装目录/node_modules)
    - 系统变量->修改->Path->加上(D:\apps\Node.js\)
    - 用户变量->修改->Path->加上(D:\apps\Node.js\node_global)

2. 安装java1.8

  + 下载
    - 去百度网盘找
  + 配置环境变量(其实不需要, 因为会默认配置到`C:\Program Files (x86)\Common Files\Oracle\Java\javapath`, 默认使用最高版本, 如果想要换版本, 直接把想要的版本对应的三个文件替换过来就可以)
    - 系统变量->添加->(CLASSPATH)(.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;)
    - 系统变量->修改->Path->加上(%JAVA_HOME%\bin)(%JAVA_HOME%\jre\bin)

3. npm配置

   ```shell
   npm config set prefix "${安装目录}\node_global"
   npm config set cache "${安装目录}\node_cache"
   npm config set registry https://registry.npm.taobao.org
   ```

   > 注意:请先把文件夹 右键->属性->安全 改成完全操控才能成功
   > 设置文件再C:/Users/username/.npmrc

4. yarn

  + 下载

    ```shell
    npm i -g yarn
    ```

  + 配置

    - 可以使用yarn config list查看

    - ```shell
      yarn config set global-folder "${Nodejs安装目录}\node_global\yarn_global
      yarn config set cache-folder "${Nodejs安装目录}\node_global\yarn_cache
      ```

5. vue

  + 下载

   ```shell
npm install -g @vue/cli
   ```

  + 配置

6. element

  + 下载

    ```
    https://element.eleme.cn/#/zh-CN/component/installation
    ```

    然后去IDEA的控制台里面

    ```shell
    npm i element-ui -S
    ```

  + 配置

    - 可以在IDEA的控制台里面设置
    - 之后去package.json里面看看有没有一个element-ui的项,有版本号就是安装成功了
    - 引用:去看`https://element.eleme.cn/#/zh-CN/component/quickstart`,按照指示引用包

7. maven

+ 下载

  + `https://maven.apache.org/download.cgi`

+ 配置

  - 下载后解压缩到文件夹(注意要记住文件存放位置)

  - 环境变量配置:

    - 系统变量,新建, MAVEN_HOME 解压地址(apache-maven-...)
    - Path加上%MAVEN_HOME%\bin

  - 仓库配置

    - 找到安装目录->conf,修改settings(用笔记本打开),找到

      `<localRepository>{path}</localRepository>`

      先新建一个名为repository文件夹(再一个比较充足的空间中,{path}是你刚刚新建文件夹的路径.打开cmd,输入mvn -help

    - 配置镜像:找到`<mirror></mirror>`,贴上:

    ```html
    <mirror>
    		<id>aliyunmaven</id>
    		<mirrorOf>*</mirrorOf>
    		<name>阿里云公共仓库</name>
    		<url>https://maven.aliyun.com/repository/public</url>
    	</mirror>
    ```

  - IDEA配置:

    - 在IDEA中打开设置,搜索maven,找到构建工具->maven,将里面的相应选项修改,注意,一定要将"本地仓库"路径修改为创建的repository文件夹,配置文件也要修改,然后删除掉.m2文件夹即可完成配置.

8. 安装axios

+ `npm install axios --save`如果没用,用这个:`npm i axios -S`

9. 安装vuex

+ 他妈了隔壁的vuex一定得装3.6.2的,至少4.0.2的装不上
+ `npm i vuex@3.6.2 --save`

9. 查看

  + java -version
  + vue --version/vue -V
  + npm -v
  + yarn -v
  + mvn -v

##创建第一个项目
在相应文件夹下打开cmd(一定是cmd,不能是powershell!!!)
确保已经创建过git账号(可以不用ssh)

> ssh创建:
> cd ~
> ssh-keygen -t rsa -C "${邮箱}"
> ssh查看:cat ~/.ssh/id_rsa.pub

输入vue create ${项目名}
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
***package.json:前端依赖的配置
public:存放一个index.html静态文件
src:
assets:存放logo
component:组件
router:路由,index.js存放路由设置
views:代码的页面放在views中
app.vue是程序的入口
main.js是全局设置***

创建项目时,npm已经帮我们把这些依赖安装好了,所以只需要在cmd中cd{文件名},然后输入npm run serve等待他跑完显示端口,然后打开端口就能打开页面了
或者直接再Intellij终端输入npm run serve
再或者再上面的有一个运行/调试配置,选择新建一个npm run,参数script输入serve即可.

#### 2.container的初步布置

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
