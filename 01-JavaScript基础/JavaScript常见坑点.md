# JavaScript 常见坑点与陷阱

> 100 道 JavaScript 易错题，按知识点分类整理

---

## 📚 目录

- [一、隐式类型转换](#一隐式类型转换)
- [二、Boolean 与判断](#二boolean-与判断)
- [三、作用域与提升](#三作用域与提升)
- [四、this 指向](#四this-指向)
- [五、对象与原型](#五对象与原型)
- [六、异步与事件循环](#六异步与事件循环)

---

## 一、隐式类型转换

### 1.1 运算符转换规则

#### 题目 1-10：基本类型转换

**1. `1 + "2"`**
```js
1 + "2"  // "12"
```
**规则**：`+` 运算符遇到字符串时，进行字符串拼接

---

**2. `"2" - 1`**
```js
"2" - 1  // 1
```
**规则**：`-` 运算符强制转换为数字（ToNumber）

---

**3. `true + true`**
```js
true + true  // 2
```
**规则**：`true` 转换为数字 `1`

---

**4. `false + 1`**
```js
false + 1  // 1
```
**规则**：`false` 转换为数字 `0`

---

**5. `null + 1`**
```js
null + 1  // 1
```
**规则**：`null` 转换为数字 `0`

---

**6. `undefined + 1`**
```js
undefined + 1  // NaN
```
**规则**：`undefined` 转换为数字 `NaN`

---

**7. `[] + 1`**
```js
[] + 1  // "1"
```
**规则**：空数组 `[]` 转换为空字符串 `""`

---

**8. `[1,2] + 3`**
```js
[1,2] + 3  // "1,23"
```
**规则**：数组调用 `toString()` 方法

---

**9. `{} + 1`**
```js
{} + 1  // 1
```
**规则**：`{}` 被解析为代码块，实际执行 `+1`

---

**10. `({}) + 1`**
```js
({}) + 1  // "[object Object]1"
```
**规则**：对象转换为字符串 `"[object Object]"`

---

#### 题目 11-15：对象与数组转换

**11. `[] + {}`**
```js
[] + {}  // "[object Object]"
```
**规则**：`"" + "[object Object]"`

---

**12. `{} + []`**
```js
{} + []  // 0
```
**规则**：代码块 `{}` + `+[]`（空数组转数字为 0）

---

**13. `"5" * "2"`**
```js
"5" * "2"  // 10
```
**规则**：`*` 运算符强制转换为数字

---

**14. `"5" + +"2"`**
```js
"5" + +"2"  // "52"
```
**规则**：一元 `+` 将 `"2"` 转为数字 `2`，然后字符串拼接

---

**15. `+""`**
```js
+""  // 0
```
**规则**：空字符串转换为数字 `0`

---

#### 题目 16-25：Number 与 String 转换

**16. `+" "`**
```js
+" "  // 0
```
**规则**：空白字符串转换为数字 `0`

---

**17. `Number([])`**
```js
Number([])  // 0
```

---

**18. `Number([1])`**
```js
Number([1])  // 1
```

---

**19. `Number([1,2])`**
```js
Number([1,2])  // NaN
```

---

**20. `String(null)`**
```js
String(null)  // "null"
```

---

**21. `String([])`**
```js
String([])  // ""
```

---

**22. `[] == 0`**
```js
[] == 0  // true
```
**规则**：`[] → "" → 0`

---

**23. `[] == ""`**
```js
[] == ""  // true
```

---

**24. `{} == {}`**
```js
{} == {}  // false
```
**规则**：对象比较引用，不同对象返回 `false`

---

**25. `NaN == NaN`**
```js
NaN == NaN  // false
```
**规则**：`NaN` 不等于任何值，包括自身

---

## 二、Boolean 与判断

### 2.1 真值（Truthy）与假值（Falsy）

#### 题目 26-35：Boolean 转换

**26. `if ("0")`**
```js
if ("0") console.log(1)  // 执行
```
**规则**：非空字符串为 `true`

---

**27. `if ([])`**
```js
if ([]) console.log(1)  // 执行
```
**规则**：对象（包括数组）恒为 `true`

---

**28. `!![]`**
```js
!![]  // true
```

---

**29. `!!{}`**
```js
!!{}  // true
```

---

**30. `!!""`**
```js
!!""  // false
```

---

**31. `!!0`**
```js
!!0  // false
```

---

**32. `Boolean(new Boolean(false))`**
```js
Boolean(new Boolean(false))  // true
```
**规则**：对象始终为 `true`，即使包装的是 `false`

---

**33. `false == "false"`**
```js
false == "false"  // false
```

---

**34. `0 == false`**
```js
0 == false  // true
```

---

**35. `"" == false`**
```js
"" == false  // true
```

---

#### 题目 36-40：特殊值判断

**36. `null == undefined`**
```js
null == undefined  // true
```

---

**37. `null == 0`**
```js
null == 0  // false
```

---

**38. `undefined == 0`**
```js
undefined == 0  // false
```

---

**39. `Boolean(NaN)`**
```js
Boolean(NaN)  // false
```

---

**40. `!!new Number(0)`**
```js
!!new Number(0)  // true
```
**规则**：对象始终为 `true`

---

## 三、作用域与提升

### 3.1 变量提升（Hoisting）

#### 题目 41-50：var vs let/const

**41. `var` 提升**
```js
console.log(a)  // undefined
var a = 1
```

---

**42. `let` 不提升**
```js
console.log(a)  // ReferenceError
let a = 1
```

---

**43. 局部 `var` 提升**
```js
var a = 1
function f(){
  console.log(a)  // undefined
  var a = 2
}
f()
```
**规则**：局部 `var` 提升，覆盖外部变量

---

**44. `let` 暂时性死区（TDZ）**
```js
{
  console.log(a)  // ReferenceError
  let a = 2
}
```

---

**45. 函数作用域**
```js
let a = 1
function f(){ console.log(a) }  // 1
f()
```

---

**46. 全局变量污染**
```js
function f(){ a = 1 }  // 非严格模式
f()
console.log(a)  // 1
```

---

**47. 块级函数声明**
```js
{ function f(){} }
typeof f  // "function"
```

---

**48. 函数声明提升**
```js
typeof foo  // "function"
function foo(){}
```

---

**49. 函数表达式不提升**
```js
typeof bar  // "undefined"
var bar = function(){}
```

---

**50. IIFE 中的 `var`**
```js
(function(){
  console.log(a)  // undefined
  var a = 1
})()
```

---

#### 题目 51-55：作用域链

**51. IIFE 中的 `let`**
```js
(function(){
  console.log(a)  // ReferenceError
  let a = 1
})()
```

---

**52. 参数作用域**
```js
var a = 1
function f(a){ console.log(a) }  // undefined
f()
```

---

**53. 参数传递**
```js
var a = 1
function f(a){ a = 2 }
f(a)
console.log(a)  // 1
```

---

**54. 词法作用域**
```js
let a = 1
function f(){ console.log(a) }
{
  let a = 2
  f()  // 1
}
```

---

**55. `with` 语句**
```js
with({a:1}) {
  console.log(a)  // 1
}
```

---

## 四、this 指向

### 4.1 this 绑定规则

#### 题目 56-65：this 基础

**56. 全局 this**
```js
console.log(this)  // window / global / undefined(module)
```

---

**57. 函数调用**
```js
function f(){ console.log(this) }
f()  // window / undefined(严格模式)
```

---

**58. 方法丢失 this**
```js
const fn = obj.f
fn()  // undefined
```

---

**59. 方法调用**
```js
obj.f()  // obj
```

---

**60. `call` 绑定**
```js
fn.call(obj)  // obj
```

---

**61. `new` 绑定**
```js
new fn()  // 新对象
```

---

**62. 箭头函数 this**
```js
const obj = { a:1, f:()=>console.log(this.a) }
obj.f()  // undefined
```

---

**63. 嵌套函数**
```js
obj.f()()  // 取决于 f 的返回值
```

---

**64. 链式调用**
```js
f().f()  // 取决于第一个 f 的返回值
```

---

**65. 多层对象**
```js
a.b.f()  // b 对象
```

---

#### 题目 66-70：this 特殊情况

**66. 回调函数丢失 this**
```js
setTimeout(obj.f)  // undefined
```

---

**67. 箭头函数保持 this**
```js
setTimeout(()=>obj.f())  // obj
```

---

**68. `new` 优先级**
```js
new F()  // { a:1 }
```

---

**69. `call` 与构造函数**
```js
F.call({})  // this 指向 {}
```

---

**70. `bind` 与 `new`**
```js
new (F.bind({}))()  // new 优先级最高
```

---

## 五、对象与原型

### 5.1 原型链

#### 题目 71-85：原型相关

**71. 原型方法**
```js
a.toString === Object.prototype.toString  // true
```

---

**72. `Object.create(null)`**
```js
Object.create(null).toString  // undefined
```

---

**73. `instanceof` 数组**
```js
[] instanceof Array  // true
```

---

**74. `instanceof` 对象**
```js
[] instanceof Object  // true
```

---

**75. `__proto__`**
```js
a.__proto__ === A.prototype  // true
```

---

**76. `constructor`**
```js
A.prototype.constructor === A  // true
```

---

**77. `Object.getPrototypeOf`**
```js
Object.getPrototypeOf([]) === Array.prototype  // true
```

---

**78. 原型链**
```js
Object.getPrototypeOf(Array.prototype)  // Object.prototype
```

---

**79. 原型继承**
```js
Array.prototype.__proto__ === Object.prototype  // true
```

---

**80. 原型链终点**
```js
Object.prototype.__proto__  // null
```

---

**81. 数组长度**
```js
const a=[]
a.x=1
a.length  // 0
```

---

**82. 修改长度**
```js
const a=[1,2]
a.length=1
a  // [1]
```

---

**83. `delete` 数组元素**
```js
delete a[0]  // true
```

---

**84. `Object.freeze`**
```js
Object.freeze(a)
a.x=2  // 严格模式报错 / 非严格模式无效
```

---

**85. `Object.is`**
```js
Object.is(+0,-0)  // false
```

---

## 六、异步与事件循环

### 6.1 事件循环机制

#### 题目 86-100：异步执行顺序

**86. `setTimeout` 异步**
```js
1; setTimeout(()=>2); 3
// 输出：1 3 2
```

---

**87. Promise 微任务**
```js
Promise.resolve().then(()=>console.log(2))
console.log(1)
// 输出：1 2
```

---

**88. 微任务优先**
```js
setTimeout(()=>console.log(2), 0)
Promise.resolve().then(()=>console.log(1))
// 输出：1 2
```

---

**89. `async/await`**
```js
async function f() {
  console.log(1)
  await Promise.resolve()
  console.log(3)
}
f()
console.log(4)
// 输出：1 4 3
```

---

**90. Promise 链式调用**
```js
Promise.resolve().then(()=>1).then(()=>2)
// 输出：1 2
```

---

**91. `then` 返回 Promise**
```js
Promise.resolve().then(()=>Promise.resolve(2))
// 输出：1 2
```

---

**92. `then` + `setTimeout`**
```js
Promise.resolve().then(()=>setTimeout(()=>2))
// 输出：1
```

---

**93. `setTimeout` → Promise**
```js
setTimeout(()=>Promise.resolve().then(()=>2))
// 输出：1
```

---

**94. `queueMicrotask`**
```js
queueMicrotask(()=>console.log(2))
console.log(1)
// 输出：1 2
```

---

**95. `async` 返回值**
```js
async function f() { return 1 }
f().then(console.log)  // 1
```

---

**96. `async` 返回 Promise**
```js
async function f() { return Promise.resolve(1) }
f().then(console.log)  // 1
```

---

**97. `then` 非函数参数**
```js
Promise.resolve(1).then(2)  // 1
```

---

**98. `Promise.reject` 处理**
```js
Promise.reject().then(null, fn)  // 1
```

---

**99. `try/catch` 不捕获 Promise**
```js
try { Promise.reject() }  // 不捕获
```

---

**100. `catch` 处理**
```js
Promise.reject().catch(()=>1)  // 1
```

---

## 🎯 核心规则总结

### 类型转换规则
1. **`+` 运算符**：有字符串则拼接，否则转数字
2. **`-`、`*`、`/`**：强制转数字
3. **对象转字符串**：`"[object Object]"`
4. **数组转字符串**：调用 `toString()`，空数组转 `""`

### Boolean 转换
- **假值（Falsy）**：`false`、`0`、`""`、`null`、`undefined`、`NaN`
- **真值（Truthy）**：其他所有值，包括对象、数组

### 作用域规则
1. **`var`**：函数作用域，会提升
2. **`let/const`**：块作用域，不提升，有 TDZ
3. **函数声明**：会提升
4. **函数表达式**：不提升

### this 绑定规则
1. **默认绑定**：函数调用 → `window`/`undefined`
2. **隐式绑定**：方法调用 → 调用对象
3. **显式绑定**：`call/apply/bind` → 指定对象
4. **new 绑定**：构造函数 → 新对象
5. **箭头函数**：词法 this，继承外层

### 事件循环
1. **同步代码** → 执行完毕
2. **微任务**（Promise、queueMicrotask）→ 全部执行
3. **宏任务**（setTimeout、setInterval）→ 执行一个
4. 重复步骤 2-3

---

## 📖 学习建议

1. **理解规则**：掌握类型转换、作用域、this 的核心规则
2. **实践练习**：在控制台运行代码，观察结果
3. **总结归纳**：将相似题目归类，找出规律
4. **避免陷阱**：在实际开发中注意这些常见坑点

---

**下一章**：[继承.md](./继承.md) - JavaScript 继承机制
