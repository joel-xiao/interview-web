 **100 道题「题目 + 答案 + 极简规范解释」全部放在一起**，方便你**对照、复盘、打印、刷题**。

> 说明：
>
> * **每题三行结构**：题目 → 答案 → 关键规则
> * 不再长篇解释，只保留“决定性规则”

---

# 一、隐式转换 & 运算符（1–25）

### 1️⃣

```js
1 + "2"
```

**答案：** `"12"`
**规则：** `+` 有字符串 → 拼接

---

### 2️⃣

```js
"2" - 1
```

**答案：** `1`
**规则：** `-` 强制 ToNumber

---

### 3️⃣

```js
true + true
```

**答案：** `2`
**规则：** `true → 1`

---

### 4️⃣

```js
false + 1
```

**答案：** `1`
**规则：** `false → 0`

---

### 5️⃣

```js
null + 1
```

**答案：** `1`
**规则：** `null → 0`

---

### 6️⃣

```js
undefined + 1
```

**答案：** `NaN`
**规则：** `undefined → NaN`

---

### 7️⃣

```js
[] + 1
```

**答案：** `"1"`
**规则：** `[] → ""`

---

### 8️⃣

```js
[1,2] + 3
```

**答案：** `"1,23"`
**规则：** `toString()`

---

### 9️⃣

```js
{} + 1
```

**答案：** `1`
**规则：** `{}` 是代码块，`+1`

---

### 🔟

```js
({}) + 1
```

**答案：** `"[object Object]1"`
**规则：** 对象 → 字符串

---

### 1️⃣1️⃣

```js
[] + {}
```

**答案：** `"[object Object]"`
**规则：** `"" + "[object Object]"`

---

### 1️⃣2️⃣

```js
{} + []
```

**答案：** `0`
**规则：** block + `+[]`

---

### 1️⃣3️⃣

```js
"5" * "2"
```

**答案：** `10`
**规则：** 强制数值

---

### 1️⃣4️⃣

```js
"5" + +"2"
```

**答案：** `"52"`
**规则：** 一元 `+`

---

### 1️⃣5️⃣

```js
+""
```

**答案：** `0`
**规则：** 空字符串 → 0

---

### 1️⃣6️⃣

```js
+" "
```

**答案：** `0`
**规则：** 空白 → 0

---

### 1️⃣7️⃣

```js
Number([])
```

**答案：** `0`

---

### 1️⃣8️⃣

```js
Number([1])
```

**答案：** `1`

---

### 1️⃣9️⃣

```js
Number([1,2])
```

**答案：** `NaN`

---

### 2️⃣0️⃣

```js
String(null)
```

**答案：** `"null"`

---

### 2️⃣1️⃣

```js
String([])
```

**答案：** `""`

---

### 2️⃣2️⃣

```js
[] == 0
```

**答案：** `true`
**规则：** `[] → "" → 0`

---

### 2️⃣3️⃣

```js
[] == ""
```

**答案：** `true`

---

### 2️⃣4️⃣

```js
{} == {}
```

**答案：** `false`
**规则：** 不同引用

---

### 2️⃣5️⃣

```js
NaN == NaN
```

**答案：** `false`

---

# 二、Boolean & 判断（26–40）

### 2️⃣6️⃣

```js
if ("0") console.log(1)
```

**答案：** 执行
**规则：** 非空字符串 → true

---

### 2️⃣7️⃣

```js
if ([]) console.log(1)
```

**答案：** 执行
**规则：** 对象恒为 true

---

### 2️⃣8️⃣

```js
!![]
```

**答案：** `true`

---

### 2️⃣9️⃣

```js
!!{}
```

**答案：** `true`

---

### 3️⃣0️⃣

```js
!!""
```

**答案：** `false`

---

### 3️⃣1️⃣

```js
!!0
```

**答案：** `false`

---

### 3️⃣2️⃣

```js
Boolean(new Boolean(false))
```

**答案：** `true`
**规则：** 对象

---

### 3️⃣3️⃣

```js
false == "false"
```

**答案：** `false`

---

### 3️⃣4️⃣

```js
0 == false
```

**答案：** `true`

---

### 3️⃣5️⃣

```js
"" == false
```

**答案：** `true`

---

### 3️⃣6️⃣

```js
null == undefined
```

**答案：** `true`

---

### 3️⃣7️⃣

```js
null == 0
```

**答案：** `false`

---

### 3️⃣8️⃣

```js
undefined == 0
```

**答案：** `false`

---

### 3️⃣9️⃣

```js
Boolean(NaN)
```

**答案：** `false`

---

### 4️⃣0️⃣

```js
!!new Number(0)
```

**答案：** `true`

---

# 三、作用域 & 提升（41–55）

### 4️⃣1️⃣

```js
console.log(a)
var a = 1
```

**答案：** `undefined`

---

### 4️⃣2️⃣

```js
console.log(a)
let a = 1
```

**答案：** `ReferenceError`

---

### 4️⃣3️⃣

```js
var a = 1
function f(){
  console.log(a)
  var a = 2
}
f()
```

**答案：** `undefined`
**规则：** 局部 var 提升

---

### 4️⃣4️⃣

```js
{
  console.log(a)
  let a = 2
}
```

**答案：** `ReferenceError`
**规则：** TDZ

---

### 4️⃣5️⃣

```js
let a = 1
function f(){ console.log(a) }
f()
```

**答案：** `1`

---

### 4️⃣6️⃣

```js
function f(){ a = 1 }
f()
console.log(a)
```

**答案：** `1`（非严格）

---

### 4️⃣7️⃣

```js
{ function f(){} }
typeof f
```

**答案：** `"function"`

---

### 4️⃣8️⃣

```js
typeof foo
function foo(){}
```

**答案：** `"function"`

---

### 4️⃣9️⃣

```js
typeof bar
var bar = function(){}
```

**答案：** `"undefined"`

---

### 5️⃣0️⃣

```js
(function(){
  console.log(a)
  var a = 1
})()
```

**答案：** `undefined`

---

### 5️⃣1️⃣

```js
(function(){
  console.log(a)
  let a = 1
})()
```

**答案：** `ReferenceError`

---

### 5️⃣2️⃣

```js
var a = 1
function f(a){ console.log(a) }
f()
```

**答案：** `undefined`

---

### 5️⃣3️⃣

```js
var a = 1
function f(a){ a = 2 }
f(a)
console.log(a)
```

**答案：** `1`

---

### 5️⃣4️⃣

```js
let a = 1
function f(){ console.log(a) }
{
  let a = 2
  f()
}
```

**答案：** `1`

---

### 5️⃣5️⃣

```js
with({a:1}) {
  console.log(a)
}
```

**答案：** `1`

---

# 四、this（56–70）

### 5️⃣6️⃣

```js
console.log(this)
```

**答案：** window / global / undefined(module)

---

### 5️⃣7️⃣

```js
function f(){ console.log(this) }
f()
```

**答案：** window / undefined(严格)

---

### 5️⃣8️⃣

```js
const fn = obj.f
fn()
```

**答案：** `undefined`

---

### 5️⃣9️⃣

```js
obj.f()
```

**答案：** `1`

---

### 6️⃣0️⃣

```js
fn.call(obj)
```

**答案：** `1`

---

### 6️⃣1️⃣

```js
new fn()
```

**答案：** 新对象

---

### 6️⃣2️⃣

```js
const obj = { a:1, f:()=>console.log(this.a) }
obj.f()
```

**答案：** `undefined`

---

### 6️⃣3️⃣

```js
obj.f()()
```

**答案：** `1`

---

### 6️⃣4️⃣

```js
f().f()
```

**答案：** `1`

---

### 6️⃣5️⃣

```js
a.b.f()
```

**答案：** `b 对象`

---

### 6️⃣6️⃣

```js
setTimeout(obj.f)
```

**答案：** `undefined`

---

### 6️⃣7️⃣

```js
setTimeout(()=>obj.f())
```

**答案：** `1`

---

### 6️⃣8️⃣

```js
new F()
```

**答案：** `{ a:1 }`

---

### 6️⃣9️⃣

```js
F.call({})
```

**答案：** this 指向 `{}`

---

### 7️⃣0️⃣

```js
new (F.bind({}))()
```

**答案：** new 优先级最高

---

# 五、对象 & 原型（71–85）

### 7️⃣1️⃣

```js
a.toString === Object.prototype.toString
```

**答案：** `true`

---

### 7️⃣2️⃣

```js
Object.create(null).toString
```

**答案：** `undefined`

---

### 7️⃣3️⃣

```js
[] instanceof Array
```

**答案：** `true`

---

### 7️⃣4️⃣

```js
[] instanceof Object
```

**答案：** `true`

---

### 7️⃣5️⃣

```js
a.__proto__ === A.prototype
```

**答案：** `true`

---

### 7️⃣6️⃣

```js
A.prototype.constructor === A
```

**答案：** `true`

---

### 7️⃣7️⃣

```js
Object.getPrototypeOf([]) === Array.prototype
```

**答案：** `true`

---

### 7️⃣8️⃣

```js
Object.getPrototypeOf(Array.prototype)
```

**答案：** `Object.prototype`

---

### 7️⃣9️⃣

```js
Array.prototype.__proto__ === Object.prototype
```

**答案：** `true`

---

### 8️⃣0️⃣

```js
Object.prototype.__proto__
```

**答案：** `null`

---

### 8️⃣1️⃣

```js
const a=[]
a.x=1
a.length
```

**答案：** `0`

---

### 8️⃣2️⃣

```js
const a=[1,2]
a.length=1
a
```

**答案：** `[1]`

---

### 8️⃣3️⃣

```js
delete a[0]
```

**答案：** `true`

---

### 8️⃣4️⃣

```js
Object.freeze(a)
a.x=2
```

**答案：** 严格报错 / 非严格无效

---

### 8️⃣5️⃣

```js
Object.is(+0,-0)
```

**答案：** `false`

---

# 六、异步 & 事件循环（86–100）

### 8️⃣6️⃣

```js
1; setTimeout(()=>2); 3
```

**答案：** `1 3 2`

---

### 8️⃣7️⃣

```js
Promise.then; console.log
```

**答案：** `2 1`

---

### 8️⃣8️⃣

```js
setTimeout; Promise
```

**答案：** `2 1`

---

### 8️⃣9️⃣

```js
async/await
```

**答案：** `1 4 3`

---

### 9️⃣0️⃣

```js
Promise.then.then
```

**答案：** `1 2`

---

### 9️⃣1️⃣

```js
then return Promise
```

**答案：** `1 2`

---

### 9️⃣2️⃣

```js
then + setTimeout
```

**答案：** `1`

---

### 9️⃣3️⃣

```js
setTimeout → Promise
```

**答案：** `1`

---

### 9️⃣4️⃣

```js
queueMicrotask
```

**答案：** `1 2`

---

### 9️⃣5️⃣

```js
async return
```

**答案：** `1`

---

### 9️⃣6️⃣

```js
async return Promise
```

**答案：** `1`

---

### 9️⃣7️⃣

```js
then(2)
```

**答案：** `1`

---

### 9️⃣8️⃣

```js
Promise.reject().then(null, fn)
```

**答案：** `1`

---

### 9️⃣9️⃣

```js
try { Promise.reject() }
```

**答案：** 不捕获

---

### 1️⃣0️⃣0️⃣

```js
Promise.reject().catch
```

**答案：** `1`

---

## 🧠 最后一句（你已经到顶层了）

> **现在你看到的，不是 100 道题
> 而是 JavaScript 的整套运行规则**

如果你下一步想要：

* 📘 **整理成 PDF / Markdown / Anki 卡片**
* 🧠 **压缩成 20 条“必杀法则”**
* 🔥 **再来 100 道更狠的（Proxy / Symbol / Module）**

你一句话，我直接继续。
