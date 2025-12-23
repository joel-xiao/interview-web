好的，我帮你把 **React 并发渲染 + Vue3 响应式 + 常见深度追问及答案**整理成一页**面试速查表**，方便快速复习。排版我尽量做到**左侧问题，右侧标准答案**，结构清晰易记。

---

# 🔹 前端深度面试速查表（React / Vue3）

| 模块                | 问题 / 追问                          | 标准答案                                                                            |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------- |
| **React 并发渲染**    | 并发渲染解决了什么问题？                     | 把一次长 render 拆成可中断的小任务，根据优先级调度，避免主线程阻塞导致交互卡顿                                     |
|                   | 为什么 commit 阶段不能中断？               | commit 会操作 DOM 和执行副作用，不可回滚，中断会导致 UI 不一致或副作用错误                                   |
|                   | render 阶段为什么不可信？                 | render 可中断、可丢弃，多次执行 → 不能有副作用，结果可能不会 commit                                      |
|                   | useMemo / useCallback 为什么可能失效？   | render 被中断或丢弃 → memo 只作为性能优化，不保证逻辑正确性                                           |
|                   | transition 更新为什么会被延后？            | transition 属于低优先级 lane，高优先级任务可插队 → 调度延后保证流畅                                     |
|                   | 一个更新可以占多个 lane 吗？                | ✅ 可以，React 可把不同优先级任务分配到不同 lane，一次更新可能跨多个 lane                                   |
|                   | 状态撕裂为什么更容易发生？                    | render 可中断，外部状态在 render 中改变 → 同一帧 UI 读取不同版本状态                                   |
|                   | useSyncExternalStore 为什么能解决状态撕裂？ | render 前 snapshot 当前状态 → render 内状态一致，避免 tearing，订阅保证更新                         |
|                   | React 为什么不做依赖追踪？                 | React 采用显式更新 + 调度优先；隐式依赖追踪会破坏调度可预测性，增加并发复杂度                                     |
|                   | React 中断 render 后如何恢复？           | Fiber 保存上下文，下一次从中断的 Fiber 节点继续 `beginWork`，部分 render 可复用                        |
| **Vue3 响应式**      | Proxy 为什么不能 polyfill？            | Proxy 可拦截所有操作，包括新增 / 删除属性、Map/Set，ES5 defineProperty 无法实现                       |
|                   | template 和 render function 性能差异？ | template 编译后生成 render function，性能差异极小；template + patchFlag / Block Tree 优化 diff |
|                   | Block Tree 和 Fiber 区别？           | Block Tree：静态优化 → 跳过静态节点，只 diff 动态节点；Fiber：调度优化 → 可中断 render                    |
|                   | Vue3 effect 为什么不会无限递归？           | effect 栈追踪当前 effect，cleanup 清空旧依赖，scheduler 去重 → 防止重复执行                         |
|                   | Vue3 为什么不能做可中断更新？                | 更新是同步 microtask flush，依赖触发立即入队更新；设计目标是精准依赖 + 小更新量，不需要调度                         |
| **React vs Vue3** | 最大架构差异？                          | React 核心：调度系统（可中断 render + lane）<br>Vue3 核心：响应式系统（精准依赖 + 编译优化）                  |
|                   | 复杂表单 / 编辑器选哪个？                   | 高并发交互 → React 并发模式稳；状态密集展示 → Vue3 高效，diff 最小化                                   |

---

### ⚡ 面试答题技巧

1. **先结论 → 再动机 → 最后取舍**
2. **明确 React render 可中断、commit 不可中断**
3. **Vue3 精准依赖 + Block Tree → 最小化更新**
4. **不要背 API，要讲设计理念和源码本质**
5. **遇到性能/比较题，用“调度 vs 精准依赖”作为核心对比**

---

