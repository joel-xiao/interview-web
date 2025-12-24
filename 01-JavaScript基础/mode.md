# JavaScript 模块化

> JavaScript 模块化发展历程与实现方式

---

## 📚 目录

- [一、模块化发展历程](#一模块化发展历程)
- [二、CommonJS](#二commonjs)
- [三、AMD / CMD](#三amd--cmd)
- [四、ES Module (ESM)](#四es-module-esm)
- [五、模块化对比](#五模块化对比)
- [六、实际应用](#六实际应用)

---

## 一、模块化发展历程

### 1.1 为什么需要模块化？

**问题**：
- 全局变量污染
- 命名冲突
- 依赖关系混乱
- 代码难以维护

**解决方案**：模块化

---

### 1.2 发展时间线

```
2009 年：CommonJS（Node.js）
    ↓
2011 年：AMD（RequireJS）
    ↓
2011 年：CMD（SeaJS）
    ↓
2015 年：ES Module（ES6）
    ↓
现在：ES Module 成为标准
```

---

## 二、CommonJS

### 2.1 特点

- **同步加载**：适合服务端（Node.js）
- **运行时加载**：模块在运行时确定
- **缓存机制**：模块只执行一次

### 2.2 语法

**导出模块**：

```js
// math.js
module.exports.add = (a, b) => a + b;
module.exports.subtract = (a, b) => a - b;

// 或者
exports.multiply = (a, b) => a * b;

// 或者（覆盖整个导出）
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
```

**导入模块**：

```js
// index.js
const math = require('./math');
console.log(math.add(1, 2)); // 3

// 或者解构
const { add, subtract } = require('./math');
console.log(add(1, 2)); // 3
```

### 2.3 实现原理

```js
// 简化的 require 实现
function require(modulePath) {
  // 1. 解析模块路径
  const id = resolveModule(modulePath);
  
  // 2. 检查缓存
  if (cache[id]) {
    return cache[id].exports;
  }
  
  // 3. 创建模块对象
  const module = {
    exports: {},
    id,
    loaded: false
  };
  
  // 4. 缓存模块
  cache[id] = module;
  
  // 5. 执行模块代码
  const code = readFile(id);
  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', code);
  fn(module.exports, require, module, __filename, __dirname);
  
  // 6. 标记为已加载
  module.loaded = true;
  
  // 7. 返回 exports
  return module.exports;
}
```

### 2.4 应用场景

- **Node.js 后端开发**
- **构建工具**（Webpack、Rollup）
- **服务端渲染**（SSR）

---

## 三、AMD / CMD

### 3.1 AMD（Asynchronous Module Definition）

**特点**：
- **异步加载**：适合浏览器环境
- **提前执行**：依赖模块提前执行

**语法（RequireJS）**：

```js
// 定义模块
define(['dependency1', 'dependency2'], function(dep1, dep2) {
  return {
    method: function() {
      return dep1.method() + dep2.method();
    }
  };
});

// 使用模块
require(['module'], function(module) {
  module.method();
});
```

### 3.2 CMD（Common Module Definition）

**特点**：
- **异步加载**：适合浏览器环境
- **延迟执行**：按需执行依赖模块

**语法（SeaJS）**：

```js
// 定义模块
define(function(require, exports, module) {
  // 按需加载
  const dep1 = require('./dependency1');
  const dep2 = require('./dependency2');
  
  exports.method = function() {
    return dep1.method() + dep2.method();
  };
});
```

### 3.3 AMD vs CMD

| 特性 | AMD | CMD |
|------|-----|-----|
| 加载方式 | 提前加载所有依赖 | 按需加载依赖 |
| 执行时机 | 提前执行 | 延迟执行 |
| 代表库 | RequireJS | SeaJS |

---

## 四、ES Module (ESM)

### 4.1 特点

- **静态分析**：编译时确定依赖关系
- **Tree-Shaking**：支持无用代码消除
- **官方标准**：ES6 原生支持
- **异步加载**：支持动态导入

### 4.2 语法

**导出模块**：

```js
// math.js

// 命名导出
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;

// 默认导出
export default function subtract(a, b) {
  return a - b;
}

// 或者统一导出
export { add, PI };
export default subtract;
```

**导入模块**：

```js
// index.js

// 命名导入
import { add, PI } from './math.js';
console.log(add(1, 2)); // 3

// 默认导入
import subtract from './math.js';
console.log(subtract(5, 2)); // 3

// 全部导入
import * as math from './math.js';
console.log(math.add(1, 2));

// 混合导入
import subtract, { add, PI } from './math.js';

// 重命名导入
import { add as sum } from './math.js';
```

### 4.3 动态导入

```js
// 动态导入（返回 Promise）
import('./math.js').then(module => {
  console.log(module.add(1, 2));
});

// 或者使用 async/await
async function loadModule() {
  const module = await import('./math.js');
  console.log(module.add(1, 2));
}
```

### 4.4 应用场景

- **现代前端项目**（Vue、React、Angular）
- **浏览器原生支持**
- **构建工具支持**（Webpack、Vite、Rollup）

---

## 五、模块化对比

| 特性 | CommonJS | AMD | CMD | ES Module |
|------|----------|-----|-----|-----------|
| **加载方式** | 同步 | 异步 | 异步 | 异步 |
| **执行时机** | 运行时 | 提前执行 | 延迟执行 | 编译时 |
| **适用环境** | Node.js | 浏览器 | 浏览器 | 浏览器/Node.js |
| **Tree-Shaking** | ❌ | ❌ | ❌ | ✅ |
| **静态分析** | ❌ | ❌ | ❌ | ✅ |
| **官方标准** | ❌ | ❌ | ❌ | ✅ |

---

## 六、实际应用

### 6.1 模块转换

**ESM 转 CommonJS**：

```js
// ESM
export function add(a, b) { return a + b; }

// 转换为 CommonJS
function add(a, b) { return a + b; }
module.exports = { add };
```

**CommonJS 转 ESM**：

```js
// CommonJS
module.exports.add = (a, b) => a + b;

// 转换为 ESM
export function add(a, b) { return a + b; }
```

### 6.2 构建工具支持

- **Webpack**：支持 CommonJS、AMD、ESM
- **Rollup**：主要支持 ESM
- **Vite**：原生支持 ESM
- **Babel**：ESM 转 CommonJS

### 6.3 最佳实践

1. **新项目**：优先使用 ES Module
2. **Node.js**：使用 CommonJS 或 ESM（Node 12+）
3. **浏览器**：使用 ES Module（现代浏览器）
4. **兼容性**：使用构建工具转换

---

## 🎯 学习建议

1. **理解差异**：掌握不同模块化方案的优缺点
2. **实践应用**：在项目中实际使用模块化
3. **关注标准**：ES Module 是未来趋势
4. **工具使用**：掌握构建工具的模块化处理

---

## 📖 参考资源

- [MDN: ES Modules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)
- [Node.js: ES Modules](https://nodejs.org/api/esm.html)

---

**相关文件**：
- [Design pattern.md](./Design%20pattern.md) - 设计模式
- [继承.md](./继承.md) - JavaScript 继承机制
