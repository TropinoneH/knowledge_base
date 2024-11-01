# 一.引入

## 语言 

### OpenGL

提供的shader语言是GLSL

SL是shader language的意思

一般在移动平台应用多,可跨平台使用

### DX

也叫DirectX

提供的shader语言是HLSL

一般在PC平台应用比较多

### CG

跨平台的语言,英伟达出的(NVIDIA),

## shader

unity中使用`ShaderLab`来进行对CG的编写.

因为unity是一个游戏引擎,于是unity对很多的东西进行了重新的封装,就比如说`ShaderLab`是对CG语言的再封装.

### 分类

1.表面着色器 surface shader

2.顶点/片元着色器 vertex/fragment shader

3.固定函数着色器 fixed function shader(已弃用)(只有在很老的显卡上使用这种,就是不支持上述两种的着色器的显卡上才会使用)

而**表面着色器**其实是对**顶点/片元着色器**的封装,实际调用的时候还是会处理成**顶点/片元着色器**来使用

当光源多($\geq4$)时可以考虑使用**表面着色器**,因为**表面着色器**确实对于多光源的支持比较好.

## ShaderLab代码结构

```shader
Shader "test shader/myShader"{ // 这里指定shader的名字,但是不要求与文件名保持一致
    //这里的文件名会在unity的监视器面板上直接显示(就是在选择shader的下拉框里面,于是可以直接用'/'来表示子菜单
    //Shader是一个基本的shader结构,所有的shader代码实现都是在这里面写的
    //如果什么都没写,那么游戏的物体会显示紫色,因为当unity不知道这个物体怎么渲染的时候就会直接显示紫色
    Properties{
        //这里是用来写属性的,类似C#的public,可以在监视器面板直接调节的属性
        //颜色
        //最外面的_Color是属性名,第一个字符串是要显示在unity面板上的内容,然后第二个值Color是类型,后面的是初始值,rgba,0-1之间
        _Color("_Color",Color)=(1,1,1,1)
        //向量 四个值 相当于xyzw(?)
        _Vector("_Vector",Vector)=(0,0,0,0)
        //整数类型
        _Int("Int",Int)=123
        //小数类型,没有double和float之分,同一称作Float
        _Float("Flaot",Float)=4.5
        //范围变量 在一定范围中进行取值 可以是小数 范围是闭区间
        _Range("Range",Range(1.2,10.5))=6
        //图片 在双引号字符串中指定颜色 直接输入英文即可 后面的花括号应该是指定Texture的,但是要在unity中指定(应该)
        //不指定图片还是用这个_Texture的时候会直接让纯色渲染这个物体 只是一个默认值
        _2D("Texture",2D)="red"{}
        //立方体纹理 用于天空盒子的渲染 也是一种图片渲染
        _Cube("Cube",Cube) = "white"{}
        //3D纹理 好像暂时用不到
        _3D("Texture3D",3D)=""{}
    }
    
    //子渲染器,可以有多个.
    //显卡从第一个SubShader开始执行,如果能执行那么就执行第一个.
    //如果第一个SubShader有的代码显卡不能执行,那么就会自动执行第二个SubShader
    SubShader{//多个SubShader可以渲染不同效果,可以在不同的显卡上运行.有时不同显卡的渲染能力不同,分开做渲染
        //一般而言第一个SubShader是渲染效果最好的,越往后的SubShader渲染效果越差
        pass{//SubShader里面至少有一个Pass块,可以有多个,一个Pass块相当于一个方法
            //在这里编写代码
            //如果用的是CG那就是CGPROGRAM,如果是HLSL那就是HLSLPROGRAM,GLSL是GLSLPROGRAM
            //不要忘了写ENDCG等等
            CGPROGRAM
            //在这里写CG代码
            //但是实际上这里什么都没有写,因此在unity中显示是因为调用了Fallback的VertexLit
            //如果想要在这里调用上面的Properties的话 一定要重新声明,不用加默认值,默认值会按照上面Properties的值来走
            //还有一点,在SubShader中不能使用Properties中定义过的类型,比如说Color是一个四个数的向量,那么就要用float4来代替
            float4 _Color;
            float4 _Vector;
            //float直接用float代替就行
            float _Float;
            //int和range也要用float代替
            float _Int;
            float _Range;
            //图片用sampler2D代替
            sampler2D _2D;
            sampler3D _3D;
            //Cube是samplerCUBE
            samplerCUBE _Cube;
            ENDCG
        }
    }
    
    //Fallback指定一个已经存在的Shader,然后如果上面的所有SubShader都不能执行的话,那么就会调用Fallback的Shader
    Fallback "VertexLit" 
}
```