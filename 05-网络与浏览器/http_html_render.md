# 浏览器渲染机制

> 从 URL 输入到页面渲染完成的完整流程

---

## 📚 目录

- [一、完整流程概览](#一完整流程概览)
- [二、网络请求阶段](#二网络请求阶段)
- [三、解析阶段](#三解析阶段)
- [四、渲染阶段](#四渲染阶段)
- [五、性能优化](#五性能优化)

---

## 一、完整流程概览

### 1.1 流程图

```
用户输入 URL / 点击链接
        │
        ▼
DNS 查询 → 获取服务器 IP
        │
        ▼
TCP 三次握手建立连接
        │
        ▼
TLS/SSL 握手（HTTPS）
        │
        ▼
发送 HTTP 请求（GET/POST）
        │
        ▼
服务器返回 HTTP 响应（状态码 + 内容）
        │
        ▼
浏览器接收响应内容（HTML/CSS/JS）
        │
        ▼
┌─────────────────┐
│ HTML 解析        │
│ → DOM 树        │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ CSS 解析        │
│ → CSSOM 树      │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Render Tree      │
│ DOM + CSSOM      │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Layout/Reflow   │ ← 元素几何信息计算
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Paint/Repaint   │ ← 绘制像素到屏幕
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Composite       │ ← 合成图层
└─────────────────┘
        │
        ▼
用户可见页面渲染完成
        │
        ▼
异步 JS / AJAX / Fetch / Promise
┌─────────────────┐
│ Event Loop      │ ← 宏任务 / 微任务调度
└─────────────────┘
        │
        ▼
页面更新 / DOM 操作 / 事件响应
```

---

## 二、网络请求阶段

### 2.1 DNS 查询

**过程**：
1. 浏览器缓存 → 系统缓存 → 路由器缓存
2. DNS 服务器查询
3. 返回 IP 地址

**优化**：DNS 预解析
```html
<link rel="dns-prefetch" href="//example.com">
```

### 2.2 TCP 连接

**三次握手**：
```
客户端 → 服务器：SYN（我要连接）
服务器 → 客户端：SYN-ACK（可以连接）
客户端 → 服务器：ACK（确认连接）
```

**四次挥手**（断开连接）：
```
客户端 → 服务器：FIN（我要断开）
服务器 → 客户端：ACK（收到）
服务器 → 客户端：FIN（我也断开）
客户端 → 服务器：ACK（确认）
```

### 2.3 TLS/SSL 握手（HTTPS）

**过程**：
1. 客户端发送支持的加密算法
2. 服务器选择加密算法并返回证书
3. 客户端验证证书
4. 双方生成会话密钥
5. 开始加密通信

**优化**：TLS 1.3 支持 0-RTT

### 2.4 HTTP 请求

**请求流程**：
```
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0...
```

**响应**：
```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<html>...</html>
```

---

## 三、解析阶段

### 3.1 HTML 解析 → DOM 树

**解析过程**：

```html
<html>
  <head>
    <title>页面标题</title>
  </head>
  <body>
    <div>内容</div>
  </body>
</html>
```

**转换为 DOM 树**：
```
Document
└── html
    ├── head
    │   └── title
    │       └── "页面标题"
    └── body
        └── div
            └── "内容"
```

**解析特点**：
- ✅ **流式解析**：边下载边解析
- ✅ **容错机制**：自动修复错误标签
- ⚠️ **阻塞渲染**：遇到 `<script>` 会阻塞

### 3.2 CSS 解析 → CSSOM 树

**CSS 规则**：
```css
body {
  font-size: 16px;
}
div {
  color: red;
}
```

**转换为 CSSOM 树**：
```
StyleSheet
└── body
    └── font-size: 16px
└── div
    └── color: red
```

**解析特点**：
- ✅ **并行解析**：与 HTML 解析并行
- ⚠️ **阻塞渲染**：CSS 未加载完成会阻塞渲染

### 3.3 构建 Render Tree

**合并 DOM + CSSOM**：
```
Render Tree（只包含可见元素）
├── html
│   └── body
│       └── div (color: red, font-size: 16px)
```

**特点**：
- ✅ 只包含可见元素（排除 `display: none`）
- ✅ 包含样式信息
- ✅ 用于布局和绘制

---

## 四、渲染阶段

### 4.1 Layout（布局/重排）

**作用**：计算元素的几何信息（位置、大小）

**触发时机**：
- 首次渲染
- 窗口大小改变
- 元素尺寸改变
- DOM 结构改变

**性能影响**：**重排（Reflow）非常消耗性能**

**优化**：
```js
// ❌ 不好：触发多次重排
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';

// ✅ 好：只触发一次重排
element.style.cssText = 'width: 100px; height: 100px; margin: 10px;';
```

### 4.2 Paint（绘制）

**作用**：将元素绘制到屏幕上

**过程**：
1. 填充背景色
2. 绘制边框
3. 绘制文本
4. 绘制图片

**性能影响**：**重绘（Repaint）比重排性能好，但仍需优化**

### 4.3 Composite（合成）

**作用**：将多个图层合成最终图像

**图层（Layer）**：
- 每个图层独立绘制
- 只重绘变化的图层
- 使用 GPU 加速

**创建图层的条件**：
- `transform`、`opacity`、`will-change`
- `position: fixed`
- 视频、Canvas

**优化**：
```css
/* 创建新图层，使用 GPU 加速 */
.element {
  transform: translateZ(0);
  /* 或 */
  will-change: transform;
}
```

---

## 五、性能优化

### 5.1 减少重排和重绘

**避免频繁操作 DOM**：
```js
// ❌ 不好
for (let i = 0; i < 1000; i++) {
  element.style.left = i + 'px';
}

// ✅ 好：使用 requestAnimationFrame
function animate() {
  element.style.left = current + 'px';
  current++;
  if (current < 1000) {
    requestAnimationFrame(animate);
  }
}
```

**批量修改 DOM**：
```js
// ❌ 不好
element.appendChild(node1);
element.appendChild(node2);
element.appendChild(node3);

// ✅ 好：使用 DocumentFragment
const fragment = document.createDocumentFragment();
fragment.appendChild(node1);
fragment.appendChild(node2);
fragment.appendChild(node3);
element.appendChild(fragment);
```

### 5.2 优化 CSS

**避免复杂选择器**：
```css
/* ❌ 不好：选择器太复杂 */
div > ul > li > a { }

/* ✅ 好：简单选择器 */
.nav-link { }
```

**使用 `transform` 和 `opacity`**：
```css
/* ✅ 好：使用 GPU 加速 */
.element {
  transform: translateX(100px);
  opacity: 0.5;
}
```

### 5.3 优化 JavaScript

**延迟加载**：
```html
<!-- 延迟执行 -->
<script defer src="script.js"></script>

<!-- 异步执行 -->
<script async src="script.js"></script>
```

**避免阻塞渲染**：
```js
// ✅ 使用 requestIdleCallback
requestIdleCallback(() => {
  // 非关键任务
});
```

### 5.4 关键渲染路径优化

**优化步骤**：
1. **减少关键资源数量**：内联关键 CSS
2. **减少关键资源大小**：压缩、Tree-Shaking
3. **缩短关键路径长度**：减少依赖

**示例**：
```html
<!-- 内联关键 CSS -->
<style>
  /* 首屏关键样式 */
</style>

<!-- 延迟非关键 CSS -->
<link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

---

## 🎯 面试常考点

### 1. 渲染流程

**问题**：从输入 URL 到页面渲染完成，发生了什么？

**答案**：
1. DNS 查询 → TCP 连接 → HTTP 请求
2. HTML 解析 → DOM 树
3. CSS 解析 → CSSOM 树
4. 构建 Render Tree
5. Layout → Paint → Composite

### 2. 重排和重绘

**问题**：什么是重排和重绘？如何优化？

**答案**：
- **重排（Reflow）**：重新计算元素布局
- **重绘（Repaint）**：重新绘制元素
- **优化**：批量操作、使用 `transform`、避免频繁读取布局属性

### 3. 阻塞渲染

**问题**：哪些资源会阻塞渲染？

**答案**：
- `<script>` 标签（除非 `defer` 或 `async`）
- `<link rel="stylesheet">`（CSS）
- 关键 CSS 未加载完成

---

## 📖 相关资源

- [MDN: 渲染性能](https://developer.mozilla.org/zh-CN/docs/Web/Performance/Rendering_performance)
- [Google: 关键渲染路径](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)

---

**相关文件**：
- [http_OSI.md](./http_OSI.md) - OSI 七层模型
- [http_diff.md](./http_diff.md) - HTTP 版本差异
