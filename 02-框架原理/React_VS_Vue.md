# React vs Vue 核心对比

> React 并发渲染与 Vue3 响应式原理深度解析

---

## 📚 目录

- [一、React 并发渲染](#一react-并发渲染)
- [二、Vue3 响应式](#二vue3-响应式)
- [三、核心对比总结](#三核心对比总结)
- [四、选型建议](#四选型建议)

---

## 一、React 并发渲染

### 1.1 核心思想

```
Fiber + Scheduler + 可中断 render + commit 不可中断
```

**核心特性**：
- ✅ **可中断渲染**：高优先级任务可以打断低优先级任务
- ✅ **时间切片**：将渲染任务分割成小片段
- ✅ **并发更新**：多个更新可以并发执行

---

### 1.2 Fiber 架构

#### Fiber 节点结构

```js
{
  type: 'div',              // 节点类型
  key: 'unique-key',        // 唯一标识
  stateNode: DOM节点,       // 真实 DOM
  child: 子节点,            // 第一个子节点
  sibling: 兄弟节点,        // 下一个兄弟节点
  return: 父节点,           // 父节点
  alternate: 对应节点       // 用于双缓冲
}
```

#### Fiber 工作流程

```
Diff → beginWork → reconcileChildren
```

**过程**：
1. **Diff**：对比新旧虚拟 DOM
2. **beginWork**：处理当前 Fiber 节点
3. **reconcileChildren**：协调子节点

**特点**：
- Fiber 是最小执行单元
- 可以暂停和恢复
- 支持优先级调度

---

### 1.3 Scheduler 调度器

#### 核心功能

```
lane 优先级 + 时间切片 + shouldYieldToHost
```

**优先级（Lane）**：
- 高优先级：用户交互（点击、输入）
- 中优先级：数据更新
- 低优先级：后台任务

**时间切片**：
- 将渲染任务分割成 5ms 的小片段
- 每完成一个片段，检查是否有高优先级任务

**shouldYieldToHost**：
- 判断是否应该暂停当前渲染
- 让出主线程给高优先级任务

---

### 1.4 Hooks 原理

#### useState / useReducer

**状态存储**：
- 状态存储在 Fiber 链表中
- 每个 Hook 对应一个链表节点

**更新机制**：
```js
setState → dispatchSetState → scheduleUpdateOnFiber → Scheduler → Fiber render
```

#### useEffect / useLayoutEffect

**执行时机**：
- **useEffect**：在 commit 阶段异步执行
- **useLayoutEffect**：在 commit 阶段同步执行

**区别**：
- `useEffect` 不会阻塞浏览器绘制
- `useLayoutEffect` 会阻塞浏览器绘制

#### useMemo / useCallback

**作用**：
- **useMemo**：缓存计算结果
- **useCallback**：缓存函数引用

**依赖**：
- 依赖项变化时重新计算/创建

#### useSyncExternalStore

**作用**：防止状态撕裂（tearing）

**场景**：在并发渲染中，确保外部状态的一致性

---

### 1.5 并发渲染的坑

#### 1. render 可能多次执行

**问题**：高优先级任务可能打断低优先级渲染

**解决**：
- 使用 `useMemo`、`useCallback` 优化
- 避免在 render 中执行副作用

#### 2. 状态撕裂（Tearing）

**问题**：并发更新可能导致状态不一致

**解决**：
- 使用 `useSyncExternalStore`
- 确保状态更新的原子性

#### 3. effect 重跑或丢弃

**问题**：渲染被中断时，effect 可能被丢弃

**解决**：
- 使用 cleanup 函数清理副作用
- 避免在 effect 中执行不可逆操作

#### 4. useMemo / useCallback 可能失效

**问题**：依赖项判断可能不准确

**解决**：
- 确保依赖项完整
- 使用 ESLint 规则检查

---

### 1.6 核心流程

```
setState 
  → dispatchSetState 
  → scheduleUpdateOnFiber 
  → Scheduler 
  → Fiber render 
  → commit DOM & effects
```

---

## 二、Vue3 响应式

### 2.1 核心思想

```
Proxy + 精准依赖收集 + 响应式更新
```

**核心特性**：
- ✅ **精准依赖**：只更新依赖变化的组件
- ✅ **编译期优化**：静态分析，减少运行时开销
- ✅ **最小化更新**：只更新变化的节点

---

### 2.2 响应式系统

#### reactive

**实现**：
```js
const obj = reactive({ count: 0 });
// 内部使用 Proxy 代理对象
```

**原理**：
- 使用 `Proxy` 拦截对象操作
- `get` 时收集依赖
- `set` 时触发更新

#### effect

**作用**：收集依赖，执行副作用

**使用**：
```js
effect(() => {
  console.log(obj.count); // 访问时收集依赖
});
```

#### track / trigger

**track（收集依赖）**：
```js
track(target, key);
// 将当前 effect 添加到依赖集合
```

**trigger（触发更新）**：
```js
trigger(target, key);
// 通知所有依赖该属性的 effect 执行
```

---

### 2.3 虚拟 DOM

#### vnode 结构

```js
{
  type: 'div',        // 节点类型
  props: {},          // 属性
  children: [],        // 子节点
  key: 'unique-key'   // 唯一标识
}
```

**作用**：用于 diff 算法，减少 DOM 操作

---

### 2.4 Diff 算法

#### 核心策略

```
双端比较 + patchFlag + Block Tree
```

**双端比较**：
- 从两端向中间比较
- 减少比较次数

**patchFlag**：
- 标记动态节点
- 只 diff 标记的节点

**Block Tree**：
- 将静态节点提升为 Block
- 只 diff Block 内的动态节点

**数组节点优化**：
- 使用 LIS（最长递增子序列）算法
- 最小化节点移动

---

### 2.5 模板编译

#### 编译流程

```
模板字符串 → AST → transform → codegen
```

**步骤**：
1. **解析**：模板字符串 → AST
2. **转换**：AST 优化（静态提升、patchFlag）
3. **生成**：AST → 渲染函数

#### 静态提升

**优化**：
- 静态节点提升到渲染函数外部
- 只创建一次，不参与 diff

**示例**：
```vue
<template>
  <div>
    <p>静态文本</p>  <!-- 静态提升 -->
    <p>{{ dynamic }}</p>  <!-- 动态节点 -->
  </div>
</template>
```

#### patchFlag

**作用**：标记动态节点类型

**类型**：
- `1`：文本动态
- `2`：class 动态
- `4`：style 动态
- `8`：props 动态

**优化**：只 diff 标记的节点，跳过静态节点

---

### 2.6 更新流程

```
reactive 状态变化 
  → effect 执行 
  → vnode patch 
  → DOM 更新
```

**特点**：
- 精准依赖，只更新相关组件
- 编译期优化，减少运行时开销
- 最小化 DOM 操作

---

### 2.7 优化点

1. **精准依赖** → 最小化更新
2. **编译期静态分析** → 减少运行时 diff
3. **patchFlag + Block Tree** → 批量更新动态节点

---

## 三、核心对比总结

### 3.1 架构对比

| 特性 | React | Vue3 |
|------|-------|------|
| **渲染方式** | 可中断渲染 | 同步渲染 |
| **更新机制** | 调度器优先级 | 精准依赖追踪 |
| **优化策略** | 运行时优化 | 编译期 + 运行时 |
| **虚拟 DOM** | 全量 diff | 精准 diff（patchFlag） |

### 3.2 核心优势

#### React

- ✅ **渲染可中断**：高优先级任务可以插队
- ✅ **高并发 UI**：适合复杂交互场景
- ✅ **commit 保证一致性**：最终状态一致
- ✅ **生态丰富**：大量第三方库

#### Vue3

- ✅ **响应式依赖精准**：只更新变化的组件
- ✅ **更新粒度最小化**：只更新变化的节点
- ✅ **编译期优化**：静态分析，减少运行时开销
- ✅ **开发体验好**：模板语法，易于上手

---

## 四、选型建议

### 4.1 选择 React 的场景

1. **复杂交互**：需要高优先级任务插队
2. **大型应用**：需要精细的性能控制
3. **团队熟悉**：团队更熟悉 React 生态
4. **第三方库**：需要丰富的第三方库支持

### 4.2 选择 Vue3 的场景

1. **快速开发**：需要快速构建应用
2. **状态驱动**：状态变化驱动的 UI
3. **性能优先**：需要最小化更新
4. **团队规模**：中小型团队，降低学习成本

### 4.3 性能对比

**React**：
- 适合：复杂交互、高并发场景
- 优势：可中断渲染、优先级调度

**Vue3**：
- 适合：状态驱动、高性能渲染
- 优势：精准依赖、编译期优化

---

## 🎯 面试常考点

### 1. React Fiber 架构

**问题**：React Fiber 解决了什么问题？

**答案**：
- 解决同步渲染阻塞主线程的问题
- 支持可中断渲染和优先级调度
- 提高用户体验和性能

### 2. Vue3 响应式原理

**问题**：Vue3 的响应式原理是什么？

**答案**：
- 使用 `Proxy` 代理对象
- `track` 收集依赖，`trigger` 触发更新
- 精准依赖，只更新变化的组件

### 3. Diff 算法差异

**问题**：React 和 Vue 的 Diff 算法有什么区别？

**答案**：
- **React**：全量 diff，使用 Fiber 链表
- **Vue3**：精准 diff，使用 patchFlag 标记动态节点

---

## 📖 相关资源

- [React 官方文档](https://react.dev/)
- [Vue3 官方文档](https://cn.vuejs.org/)
- [React Fiber 架构详解](https://github.com/acdlite/react-fiber-architecture)

---

**相关文件**：
- [React_UseContext_And_UseReducer.md](./React_UseContext_And_UseReducer.md) - React 状态管理
- [Redux_VS_Vuex.md](./Redux_VS_Vuex.md) - 状态管理库对比
