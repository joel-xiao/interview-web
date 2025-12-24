# React vs Vue3 面试题速查表

> React 并发渲染与 Vue3 响应式深度追问及答案

---

## 📚 目录

- [一、React 并发渲染面试题](#一react-并发渲染面试题)
- [二、Vue3 响应式面试题](#二vue3-响应式面试题)
- [三、React vs Vue3 对比题](#三react-vs-vue3-对比题)
- [四、面试答题技巧](#四面试答题技巧)

---

## 一、React 并发渲染面试题

### 1.1 核心概念

#### Q1：并发渲染解决了什么问题？

**答案**：
- 把一次长 render 拆成可中断的小任务
- 根据优先级调度，避免主线程阻塞导致交互卡顿
- 高优先级任务（用户交互）可以打断低优先级任务（数据更新）

---

#### Q2：为什么 commit 阶段不能中断？

**答案**：
- commit 会操作 DOM 和执行副作用
- 不可回滚，中断会导致 UI 不一致或副作用错误
- 必须保证原子性，要么全部完成，要么不执行

---

#### Q3：render 阶段为什么不可信？

**答案**：
- render 可中断、可丢弃，可能多次执行
- 不能有副作用，结果可能不会 commit
- 必须保证幂等性，多次执行结果一致

---

### 1.2 Hooks 相关问题

#### Q4：useMemo / useCallback 为什么可能失效？

**答案**：
- render 被中断或丢弃时，memo 只作为性能优化
- 不保证逻辑正确性
- 不能依赖 memo 来保证副作用不执行

---

#### Q5：useSyncExternalStore 为什么能解决状态撕裂？

**答案**：
- render 前 snapshot 当前状态
- render 内状态一致，避免 tearing
- 订阅保证更新，确保状态同步

---

### 1.3 调度相关问题

#### Q6：transition 更新为什么会被延后？

**答案**：
- transition 属于低优先级 lane
- 高优先级任务可插队
- 调度延后保证流畅，避免阻塞用户交互

---

#### Q7：一个更新可以占多个 lane 吗？

**答案**：
- ✅ 可以
- React 可把不同优先级任务分配到不同 lane
- 一次更新可能跨多个 lane

---

#### Q8：React 中断 render 后如何恢复？

**答案**：
- Fiber 保存上下文
- 下一次从中断的 Fiber 节点继续 `beginWork`
- 部分 render 可复用，提高效率

---

### 1.4 状态管理问题

#### Q9：状态撕裂为什么更容易发生？

**答案**：
- render 可中断，外部状态在 render 中改变
- 同一帧 UI 读取不同版本状态
- 导致 UI 不一致

---

#### Q10：React 为什么不做依赖追踪？

**答案**：
- React 采用显式更新 + 调度优先
- 隐式依赖追踪会破坏调度可预测性
- 增加并发复杂度

---

## 二、Vue3 响应式面试题

### 2.1 核心原理

#### Q1：Proxy 为什么不能 polyfill？

**答案**：
- Proxy 可拦截所有操作
- 包括新增/删除属性、Map/Set
- ES5 `Object.defineProperty` 无法实现

---

#### Q2：Vue3 effect 为什么不会无限递归？

**答案**：
- effect 栈追踪当前 effect
- cleanup 清空旧依赖
- scheduler 去重，防止重复执行

---

#### Q3：Vue3 为什么不能做可中断更新？

**答案**：
- 更新是同步 microtask flush
- 依赖触发立即入队更新
- 设计目标是精准依赖 + 小更新量，不需要调度

---

### 2.2 性能优化

#### Q4：template 和 render function 性能差异？

**答案**：
- template 编译后生成 render function
- 性能差异极小
- template + patchFlag / Block Tree 优化 diff

---

#### Q5：Block Tree 和 Fiber 区别？

**答案**：
- **Block Tree**：静态优化 → 跳过静态节点，只 diff 动态节点
- **Fiber**：调度优化 → 可中断 render
- 两者解决不同问题，Block Tree 优化 diff，Fiber 优化调度

---

## 三、React vs Vue3 对比题

### 3.1 架构差异

#### Q1：最大架构差异？

**答案**：

| 框架 | 核心 | 特点 |
|------|------|------|
| **React** | 调度系统 | 可中断 render + lane 优先级 |
| **Vue3** | 响应式系统 | 精准依赖 + 编译优化 |

**核心对比**：
- React：调度优先，可中断渲染
- Vue3：依赖精准，最小化更新

---

#### Q2：复杂表单/编辑器选哪个？

**答案**：

**选择 React**：
- 高并发交互场景
- 需要优先级调度
- 复杂状态管理

**选择 Vue3**：
- 状态密集展示
- 需要高效 diff
- 快速开发

---

## 四、面试答题技巧

### 4.1 答题结构

**三步法**：
1. **先结论** → 直接回答核心点
2. **再动机** → 解释为什么这样设计
3. **最后取舍** → 说明优缺点和适用场景

---

### 4.2 核心要点

1. **明确 React render 可中断、commit 不可中断**
2. **Vue3 精准依赖 + Block Tree → 最小化更新**
3. **不要背 API，要讲设计理念和源码本质**
4. **遇到性能/比较题，用"调度 vs 精准依赖"作为核心对比**

---

### 4.3 常见追问

#### 追问1：React 和 Vue 的更新机制有什么区别？

**答案**：
- **React**：显式更新，需要调用 `setState`
- **Vue3**：隐式更新，自动追踪依赖

#### 追问2：为什么 React 需要 Fiber？

**答案**：
- 解决同步渲染阻塞主线程的问题
- 支持可中断渲染和优先级调度
- 提高用户体验

#### 追问3：Vue3 的响应式比 Vue2 好在哪里？

**答案**：
- 使用 Proxy 替代 Object.defineProperty
- 支持数组和对象新增属性
- 性能更好，依赖追踪更精准

---

## 🎯 快速复习要点

### React 核心
- ✅ 可中断渲染
- ✅ 优先级调度
- ✅ commit 不可中断
- ✅ 状态撕裂问题

### Vue3 核心
- ✅ Proxy 响应式
- ✅ 精准依赖追踪
- ✅ Block Tree 优化
- ✅ 编译期优化

### 对比核心
- **React**：调度系统（可中断 + 优先级）
- **Vue3**：响应式系统（精准依赖 + 编译优化）

---

## 📖 相关资源

- [React 官方文档](https://react.dev/)
- [Vue3 官方文档](https://cn.vuejs.org/)
- [React Fiber 架构](https://github.com/acdlite/react-fiber-architecture)

---

**相关文件**：
- [React_VS_Vue.md](./React_VS_Vue.md) - React vs Vue 核心对比
- [React_UseContext_And_UseReducer.md](./React_UseContext_And_UseReducer.md) - React 状态管理
