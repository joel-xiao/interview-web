──────────────────────────────
        React 并发渲染
──────────────────────────────
核心思想
  └ Fiber + Scheduler + 可中断 render + commit 不可中断
Fiber
  ├ type / key / stateNode / child / sibling / return / alternate
  ├ 最小执行单元
  └ Diff → beginWork → reconcileChildren
Scheduler
  ├ lane 优先级
  ├ 时间切片
  └ shouldYieldToHost → 可暂停 render
Hooks
  ├ useState / useReducer → 状态存 Fiber 链表
  ├ useEffect / useLayoutEffect → commit 执行副作用
  ├ useMemo / useCallback → 缓存值或函数引用
  └ useSyncExternalStore → 防止状态撕裂
并发业务坑
  ├ render 可能多次执行
  ├ 状态撕裂（tearing）
  ├ effect 重跑或丢弃
  └ useMemo / useCallback 可能失效
核心流程
  setState → dispatchSetState → scheduleUpdateOnFiber → Scheduler → Fiber render → commit DOM & effects
──────────────────────────────
        Vue3 响应式
──────────────────────────────
核心思想
  └ Proxy + 精准依赖收集 + 响应式更新
响应式
  ├ reactive(obj) → Proxy
  ├ effect(fn) → 收集依赖
  ├ track(target, key) → 收集依赖
  └ trigger(target, key) → 通知更新
虚拟 DOM
  ├ vnode = { type, props, children, key }
  └ 用于 diff
Diff 算法
  ├ 双端比较 + patchFlag + Block Tree
  └ 数组节点 → LIS → 最小化移动
模板编译
  ├ 模板字符串 → AST → transform → codegen
  ├ 静态提升 → 静态节点不 diff
  └ patchFlag → 标记动态节点 → 优化运行时 diff
更新流程
  reactive 状态变化 → effect 执行 → vnode patch → DOM 更新
优化点
  ├ 精准依赖 → 最小化更新
  ├ 编译期静态分析 → 减少运行时 diff
  └ patchFlag + Block Tree → 批量更新动态节点
──────────────────────────────
对比总结
──────────────────────────────
React
  ├ 渲染可中断
  ├ 高优先级任务插队
  ├ commit 保证最终一致性
  └ 适合复杂交互和高并发 UI
Vue3
  ├ 响应式依赖精准
  ├ 更新粒度最小化
  ├ 编译期优化静态节点
  └ 适合高性能渲染和状态驱动 UI
