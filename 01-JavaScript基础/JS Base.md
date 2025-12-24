# JavaScript 基础

> JavaScript 语言基础、历史、核心概念

---

## 📚 目录

- [一、JavaScript 历史](#一javascript-历史)
- [二、浏览器与引擎](#二浏览器与引擎)
- [三、语言特性](#三语言特性)
- [四、ECMAScript 规范](#四ecmascript-规范)

---

## 一、JavaScript 历史

### 1.1 发展时间线

#### 1990 年
- **蒂姆·伯纳斯·李**（Tim Berners-Lee）创建 World Wide Web
- 将超文本分享资讯系统移植到 C 语言库（libwww/nexus）
- 允许他人浏览器访问编写的网站

#### 1993 年
- 美国伊利诺大学 NCSA 组织（马克·安德森）
- 开发 **MOSAIC 浏览器**，首次支持显示图片
- 图形化浏览器诞生

#### 1994 年
- 马克·安德森和吉姆·克拉克（硅图 SGI 公司）创建
- **MOSAIC Communication Corporation**
- 后更名为 **Netscape Communication Corporation**（网景公司）
- 发布 **Netscape Navigator** 浏览器

#### 1996 年
- 微软收购 Spy Glass → 发布 **IE 1.0**（Internet Explorer）
- IE3 引入 **JScript**（JavaScript 的微软实现）

#### 1996 年 2 月
- 网景公司 **布兰登·艾奇**（Brendan Eich）开发
- 为 Netscape Navigator 2 开发 **LiveScript**
- 后因 Java 热度，与 SUN 公司合作推广
- **LiveScript → JavaScript**

#### 2001 年
- **IE6** 随 Windows XP 发布
- JavaScript 引擎发展

#### 2003 年
- Mozilla 公司发布 **Firefox**（基于 Netscape Navigator）

#### 2008 年
- Google 基于 **WebKit Blink** 引擎
- 发布 **Chrome** 浏览器
- 引入 **V8 引擎**（JavaScript 引擎）
  - 直接翻译机器码
  - 独立于浏览器运行

#### 2009 年
- 甲骨文（Oracle）收购 SUN 公司
- JavaScript 所有权归属甲骨文
- **PWA**（Progressive Web App）概念提出

---

## 二、浏览器与引擎

### 2.1 五大主流浏览器内核

| 浏览器 | 内核 | 说明 |
|--------|------|------|
| **IE** | Trident | 微软开发，已停止维护 |
| **Chrome** | WebKit Blink | Google 基于 WebKit 开发 |
| **Safari** | WebKit | Apple 开发 |
| **Firefox** | Gecko | Mozilla 开发 |
| **Opera** | Presto Blink | 早期 Presto，后改用 Blink |

### 2.2 JavaScript 引擎

#### V8 引擎特点
1. **直接翻译机器码**：不经过中间字节码
2. **独立于浏览器运行**：可在 Node.js 等环境运行

#### 引擎发展
- **早期**：解释执行，性能较差
- **V8**：JIT（Just-In-Time）编译，性能大幅提升
- **现代引擎**：优化编译、内联缓存、垃圾回收优化

---

## 三、语言特性

### 3.1 编程语言分类

#### 编译型语言
```
源码 → 编译器 → 机器语言 → 可执行文件
```
- **特点**：需要编译，执行速度快
- **示例**：C、C++、Go

#### 解释型语言
```
源码 → 解释器 → 解释一行执行一行
```
- **特点**：无需编译，跨平台性好
- **示例**：JavaScript、Python、Ruby

#### JavaScript 特性
- **解释型语言**：不需要根据不同系统平台进行移植
- **动态类型**：变量类型在运行时确定
- **弱类型**：类型转换相对宽松

### 3.2 高级语言 vs 低级语言

- **高级语言**：接近人类语言，如 JavaScript、Python
- **低级语言**：接近机器语言（0 和 1），如汇编语言

---

## 四、ECMAScript 规范

### 4.1 ECMA 组织

**ECMA**（European Computer Manufactures Association）
- 欧洲计算机制造联合会
- 评估、开发、认可电信、计算机标准

### 4.2 ECMAScript

- **ECMA-262**：脚本语言的规范标准
- **ECMAScript**：JavaScript 的标准化名称
- **ES5、ES6（ES2015）**：不同版本的规范

### 4.3 版本演进

| 版本 | 年份 | 主要特性 |
|------|------|---------|
| ES5 | 2009 | 严格模式、JSON、数组方法 |
| ES6 (ES2015) | 2015 | let/const、箭头函数、类、模块化 |
| ES2016 | 2016 | Array.includes、指数运算符 |
| ES2017 | 2017 | async/await、Object.entries |
| ES2018 | 2018 | 展开运算符、异步迭代 |
| ES2019+ | 2019+ | 可选链、空值合并等 |

---

## 📖 相关资源

- [JavaScript 历史详细文章](https://juejin.cn/post/7038580466454118437)

---

## 🎯 学习建议

1. **理解历史**：了解 JavaScript 的诞生背景和发展历程
2. **掌握引擎**：理解 V8 引擎的工作原理
3. **熟悉规范**：了解 ECMAScript 标准演进
4. **实践应用**：结合实际项目理解语言特性

---

**下一章**：[继承.md](./继承.md) - JavaScript 继承机制
