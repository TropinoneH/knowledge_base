[项目](file://D:\files\html\react\redux-toolkit-study)

[教程视频](https://www.bilibili.com/video/BV1Y94y1S7QT?p=1)

这个项目尝试全程使用`yarn`作为包管理工具

# 初始化

```shell
yarn add @reduxjs/toolkit react-redux
```

## 创建`store`

```typescript
import {configureStore} from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
    }
})
```

## 创建`reducer`

`model/store.ts`

```typescript
import {store} from "../store";

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch

export interface countState {
    value: number
}
```

`service/countReducer.ts`

```typescript
import { createSlice } from "@reduxjs/toolkit"
import { countState } from "../model/store.ts"

const initialState: countState = {
    value: 0
}

const countSlice = createSlice({
    name: "countReducer",
    initialState,
    reducers: {
        increment: (state: countState) => {
            state.value += 1
        },
        decrement: (state: countState) => {
            state.value -= 1
        }
    }
})

export default countSlice.reducer
export const {increment, decrement} = countSlice.actions
```

## 添加到`store`

在store中`import countReducer from "../service/countReducer.ts"`, 然后在reducer对象体内加上`count: countReducer`

因为在`countReducer`里面用的是默认导出, 所以import的名字无所谓

# 使用

在需要的地方引入:

```tsx
import {useDispatch, useSelector} from "react-redux";
import {RootDispatch, RootState} from "../model/store.ts";
import {decrement, increment} from "../service/countReducer.ts";

const Counter = () => {
    const count = useSelector((state: RootState) => state.counter.value)
    const dispatch = useDispatch<RootDispatch>()
    return <>
        {count}
        <br/>
        <br/>
        <button onClick={() => dispatch(increment())}>+1</button> {/*别忘了要加上括号, 返回值才是Action*/}
        <br/>
        <br/>
        <button onClick={() => dispatch(decrement())}>-1</button>
    </>
}

export default Counter
```

# 异步

```typescript
const countSlice = createSlice({
	...,
    extraReducers (builder) {
        builder.addCase(incrementAsync.fulfilled, (state, { payload }) => {
            state.value += payload
        })
    }
})
export const incrementAsync = createAsyncThunk("incrementAsync", async () => {
    return await new Promise<number>((resolve) => {
        setTimeout(() => {
            resolve(2)
        }, 2000)
    })
})
```

使用与上面的用法一样, 但是这里的`dispatch`必须加上类型约束
