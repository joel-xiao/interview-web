# React useContext + useReducer 详解（用法+原理+实战，对比Redux）
你说的 `use` 大概率是笔误，结合上下文核心是 **React 自带的 `useContext` + `useReducer` 组合**——这是 React 原生方案，无需第三方库，就能实现轻量级状态管理，完美替代小型项目中的 Redux，下面从 用法、原理、实战、对比 全维度拆解。
## 一、 先明确核心：两个 Hook 的各自作用
### 1.  useContext：跨组件传递数据（解决「props 层层透传」）
-  核心作用：**全局共享数据**，让组件树任意层级的组件，直接获取顶层提供的数据，无需手动通过 props 传递（解决「props 钻取」问题）。
-  底层原理：基于 React 的「上下文（Context）」机制，本质是一个**全局数据容器**，分为「创建上下文、提供上下文、消费上下文」三步，`useContext` 是「消费上下文」的 Hooks 写法（替代传统的 `Context.Consumer` 包裹）。
-  核心特点：上下文数据变更时，所有消费该上下文的组件都会**重新渲染**，自带响应式联动。

### 2.  useReducer：管理复杂状态（解决「useState 多状态/复杂逻辑」）
-  核心作用：**替代 useState 管理复杂状态**，适合状态多、状态变更逻辑复杂（如多条件修改、联动修改）的场景，核心是「纯函数 Reducer 驱动状态变更」。
-  底层原理：和 Redux 的 Reducer 思想完全一致——接收「初始状态」和「纯函数 Reducer」，返回「当前状态」和「dispatch 方法」；通过 `dispatch(action)` 触发 Reducer 计算，返回新状态，实现状态变更。
-  核心特点：状态变更逻辑集中在 Reducer 中，可预测、可追溯，比 useState 更适合复杂场景。

### 3.  组合核心：`useContext + useReducer` = 轻量级状态管理
-  分工明确：`useReducer` 负责**状态存储与变更逻辑**，`useContext` 负责**状态全局共享**，二者结合，无需第三方库，就能实现「全局状态统一管理+跨组件访问」，完全满足中小型 React 项目的状态管理需求。

## 二、  基础用法：单独使用（先吃透单个 Hook）
### 1.  useContext 单独使用（全局共享静态/简单状态）
####  步骤1：创建上下文（src/contexts/ThemeContext.js）
```javascript
import { createContext } from 'react';
// 创建上下文，可传入默认值（不传则为 undefined）
const ThemeContext = createContext('light'); // 默认主题：浅色
export default ThemeContext;
```
####  步骤2：顶层提供上下文（src/App.js，包裹需要共享的组件树）
```javascript
import { useState } from 'react';
import ThemeContext from './contexts/ThemeContext';
import Son from './components/Son';

function App() {
  const [theme, setTheme] = useState('light');
  return (
    // 用 Context.Provider 提供上下文，value 是要共享的数据（可传任意类型：基本类型/对象/方法）
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="App">
        <Son />
      </div>
    </ThemeContext.Provider>
  );
}
export default App;
```
####  步骤3：任意组件消费上下文（src/components/Son.js，深层组件直接用）
```javascript
import { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';

function Son() {
  // 用 useContext 消费上下文，直接获取顶层传入的 value
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div>
      当前主题：{theme}
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </div>
  );
}
export default Son;
```

### 2.  useReducer 单独使用（组件内复杂状态管理）
```javascript
import { useReducer } from 'react';

// 1. 定义初始状态
const initialState = { count: 0, isDisabled: false };

// 2. 定义 Reducer：纯函数（state：当前状态，action：动作对象），返回新状态
function countReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, count: state.count + 1 };
    case 'MINUS':
      return { ...state, count: state.count - 1 };
    case 'SET_DISABLE':
      return { ...state, isDisabled: action.payload };
    default:
      return state; // 未知 action，返回原状态
  }
}

function Count() {
  // 3. 调用 useReducer，返回 [当前状态, dispatch方法]
  const [state, dispatch] = useReducer(countReducer, initialState);

  return (
    <div>
      计数：{state.count}
      {/* 4. 调用 dispatch，传入 action（必须有 type 字段，payload 可选：传递参数） */}
      <button onClick={() => dispatch({ type: 'ADD' })} disabled={state.isDisabled}>+1</button>
      <button onClick={() => dispatch({ type: 'MINUS' })} disabled={state.isDisabled}>-1</button>
      <button onClick={() => dispatch({ type: 'SET_DISABLE', payload: !state.isDisabled })}>
        切换禁用状态
      </button>
    </div>
  );
}
export default Count;
```

## 三、  核心实战：useContext + useReducer 组合（全局状态管理）
实现「全局用户状态管理」（登录/退出/存储用户信息），完全替代 Redux 基础功能，无第三方依赖，步骤清晰可直接落地。
###  步骤1：创建上下文 + 定义 Reducer（src/contexts/UserContext.js）
```javascript
import { createContext, useReducer } from 'react';

// 1. 创建上下文（默认值可设为 null，后续由 Provider 传入真实值）
export const UserContext = createContext(null);

// 2. 初始状态
const initialUserState = { token: '', userInfo: {}, isLogin: false };

// 3. 核心 Reducer：统一管理用户状态变更逻辑
export function userReducer(state, action) {
  switch (action.type) {
    // 登录：存储 token + 用户信息
    case 'LOGIN':
      return { 
        ...state, 
        token: action.payload.token, 
        userInfo: action.payload.userInfo, 
        isLogin: true 
      };
    // 退出：重置为初始状态
    case 'LOGOUT':
      return initialUserState;
    // 更新用户信息
    case 'UPDATE_USERINFO':
      return { ...state, userInfo: action.payload };
    default:
      return state;
  }
}

// 4. 封装全局 Provider 组件（简化顶层使用，推荐写法）
export function UserProvider({ children }) {
  const [userState, dispatch] = useReducer(userReducer, initialUserState);
  // 把 状态 + dispatch 一起传入上下文，让组件既能读状态，又能改状态
  return (
    <UserContext.Provider value={{ userState, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}
```
###  步骤2：顶层全局挂载（src/index.js，包裹根组件）
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from './contexts/UserContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 挂载用户全局状态 Provider，所有子组件均可访问
  <UserProvider>
    <App />
  </UserProvider>
);
```
###  步骤3：任意组件使用（读取状态+修改状态，跨层级无压力）
####  场景1：登录组件（修改全局状态）
```javascript
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';

function Login() {
  const { dispatch } = useContext(UserContext); // 只取 dispatch 用于修改状态

  const handleLogin = async (username, pwd) => {
    // 异步请求登录接口
    const res = await axios.post('/api/login', { username, pwd });
    // 触发 dispatch，修改全局用户状态
    dispatch({
      type: 'LOGIN',
      payload: { token: res.data.token, userInfo: res.data.userInfo }
    });
  };

  return (
    <div>
      <input placeholder="用户名" />
      <input placeholder="密码" type="password" />
      <button onClick={() => handleLogin('test', '123456')}>登录</button>
    </div>
  );
}
export default Login;
```
####  场景2：头部组件（读取状态+修改状态）
```javascript
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

function Header() {
  // 读取全局用户状态 + dispatch 方法
  const { userState, dispatch } = useContext(UserContext);

  return (
    <div className="header">
      {userState.isLogin ? (
        <div>
          欢迎 {userState.userInfo.nickname}
          <button onClick={() => dispatch({ type: 'LOGOUT' })}>退出登录</button>
        </div>
      ) : (
        <a href="/login">去登录</a>
      )}
    </div>
  );
}
export default Header;
```

## 四、  核心原理（极简拆解）
### 1.  useContext 原理
1.  调用 `createContext` 会创建一个「上下文对象」，包含 `Provider`（生产者）和 `Consumer`（消费者）两个属性；
2.  `Provider` 组件接收 `value` 属性，会将 `value` 存储在 React 内部的「上下文栈」中，其所有子组件都能访问该 `value`；
3.  组件调用 `useContext(Context)` 时，React 会向上遍历组件树，找到最近的对应 `Provider`，取出其 `value` 并返回；
4.  当 `Provider` 的 `value` 发生变化时，所有调用 `useContext` 消费该上下文的组件，都会触发**重新渲染**，实现响应式。

### 2.  useReducer 原理
1.  初始化时，React 会缓存「初始状态」和「Reducer 函数」，返回当前状态和一个 `dispatch` 方法；
2.  调用 `dispatch(action)` 时，React 会将「当前状态」和「传入的 action」传入 Reducer，执行纯函数计算，得到**新状态**；
3.  React 对比新状态与旧状态，若不一致，则触发组件重新渲染，更新视图；
4.  核心保障：Reducer 是纯函数，无副作用，确保状态变更可预测，和 Redux Reducer 原理完全一致，只是作用域不同（useReducer 是组件级，Redux 是全局级）。

### 3.  组合原理
-  本质是「**组件级状态管理（useReducer）+ 全局数据共享（useContext）**」的结合；
-  useReducer 把复杂状态逻辑封装，dispatch 负责触发变更；useContext 把「状态+dispatch」全局暴露，让所有组件都能读写，最终实现「全局状态统一管理」。

## 五、  关键对比：useContext+useReducer vs Redux
###  1.  相同点
-  核心思想一致：**单向数据流**，靠「Reducer 纯函数」管理状态变更，状态可追溯；
-  核心能力一致：都能实现全局状态共享、跨组件状态修改。

###  2.  不同点（核心选型依据）
| 对比维度         | useContext + useReducer       | Redux                          |
|------------------|--------------------------------|--------------------------------|
| 依赖             | 无第三方依赖，React 原生自带   | 需依赖 redux + react-redux，可选中间件 |
| 体积             | 零体积增加，轻量化             | 引入多个依赖，体积更大         |
| 适用场景         | 中小型 React 项目（90% 常规项目） | 大型/超大型 React 项目，复杂异步场景 |
| 异步处理         | 直接在组件内写异步，再 dispatch | 需依赖中间件（redux-thunk/saga） |
| 扩展能力         | 无扩展，仅满足基础状态管理     | 支持中间件、DevTools、持久化等丰富扩展 |
| 上手成本         | 极低，无需学习新API            | 较高，需学习 Action、Reducer、中间件等 |

###  3.  选型建议
-  中小型项目、快速迭代项目：优先用 **useContext + useReducer**，零依赖、上手快、足够用；
-  大型项目、复杂异步（如并发请求、请求拦截）、需状态持久化/日志调试：选 **Redux**，生态完善，扩展能力强；
-  补充：大型项目也可选择 **Redux Toolkit**（Redux 官方简化版），简化繁琐写法，兼顾扩展性与简洁性。

## 六、  避坑指南（实战必看）
1.  避免 Context 过度封装：一个 Context 对应一个业务模块（如用户、主题），不要把所有状态都放进一个全局 Context，否则会导致「一处变更，全量组件重渲染」，性能浪费；
2.  useContext 接收的是「上下文对象」，不是 `Provider`，别传错参数（如 `useContext(UserProvider)` 是错误写法）；
3.  useReducer 的 Reducer 必须是纯函数：不要在 Reducer 中写异步（如接口请求）、直接修改 state（必须返回新对象）；
4.  优化重渲染：若上下文 value 是对象，建议用 `useMemo` 缓存，避免组件无关更新（如 `value={useMemo(()=>({state,dispatch}),[state])}`）。

需要我帮你手写一个**带持久化（localStorage）的 useContext+useReducer 状态管理**吗？实现页面刷新后状态不丢失。
