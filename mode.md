
## **一、创建型模式（Creational Patterns）**

### 1️⃣ 单例模式（Singleton）

* **目的**：确保类只有一个实例，并提供全局访问点。
* **特点**：

  * 全局唯一实例
  * 延迟创建（Lazy Loading 可选）
* **JavaScript 实现**：

```js
const Singleton = (function() {
  let instance;
  function createInstance() {
    return { name: '唯一实例' };
  }
  return {
    getInstance: function() {
      if (!instance) instance = createInstance();
      return instance;
    }
  };
})();

const a = Singleton.getInstance();
const b = Singleton.getInstance();
console.log(a === b); // true
```

* **前端应用场景**：

  * **全局状态管理**（如 Redux store 单例）
  * **日志管理器**、**全局缓存对象**

---

### 2️⃣ 工厂模式（Factory）

* **目的**：提供创建对象的接口，而无需暴露具体实现。
* **特点**：

  * 封装对象创建
  * 可灵活扩展新类型
* **示例**：

```js
class Car {
  constructor(name) { this.name = name; }
}
class Bike {
  constructor(name) { this.name = name; }
}

function VehicleFactory(type, name) {
  switch(type) {
    case 'car': return new Car(name);
    case 'bike': return new Bike(name);
  }
}

const c = VehicleFactory('car', 'Tesla');
console.log(c);
```

* **前端应用场景**：

  * **UI 组件工厂**：动态生成不同组件
  * **接口适配器**：根据不同 API 生成不同对象

---

## **二、结构型模式（Structural Patterns）**

### 1️⃣ 装饰器模式（Decorator）

* **目的**：在不修改原对象的前提下，动态扩展对象功能。
* **特点**：

  * 对象包装对象
  * 可叠加功能
* **示例**：

```js
function addLogging(fn) {
  return function(...args) {
    console.log('calling', fn.name, 'with', args);
    return fn(...args);
  }
}

function sum(a, b) { return a + b; }

const loggedSum = addLogging(sum);
console.log(loggedSum(2, 3)); // 记录日志 + 返回 5
```

* **前端应用场景**：

  * **Vue 指令 / React 高阶组件 HOC**
  * **函数增强**：权限检查、日志、缓存

---

### 2️⃣ 代理模式（Proxy）

* **目的**：通过代理对象控制对目标对象的访问。
* **特点**：

  * 可添加访问控制、缓存、延迟加载
* **示例**：

```js
const person = { name: 'Alice', age: 18 };
const proxy = new Proxy(person, {
  get(target, prop) {
    console.log(`读取属性 ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`设置属性 ${prop} = ${value}`);
    target[prop] = value;
    return true;
  }
});

proxy.name;       // 触发 get
proxy.age = 20;   // 触发 set
```

* **前端应用场景**：

  * **Vue 3 响应式**（Reactive 原理）
  * **数据验证 / 缓存 / 日志记录**

---

## **三、行为型模式（Behavioral Patterns）**

### 1️⃣ 观察者模式（Observer）

* **目的**：对象状态变化时，通知依赖对象。
* **特点**：

  * 发布-订阅机制
  * 解耦
* **示例**：

```js
class EventEmitter {
  constructor() { this.listeners = {}; }
  on(event, fn) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(fn);
  }
  emit(event, ...args) {
    (this.listeners[event] || []).forEach(fn => fn(...args));
  }
}

const emitter = new EventEmitter();
emitter.on('message', msg => console.log('收到消息:', msg));
emitter.emit('message', 'Hello World');
```

* **前端应用场景**：

  * **EventEmitter / PubSub 系统**
  * **Vue 响应式系统**
  * **Redux / MobX 状态订阅**

---

### 2️⃣ 策略模式（Strategy）

* **目的**：定义一系列算法，把它们封装起来，使得算法可以互换。
* **特点**：

  * 算法可动态替换
  * 避免大量 if/else
* **示例**：

```js
const strategies = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b
};

function calculate(a, b, strategy) {
  return strategies[strategy](a, b);
}

console.log(calculate(2, 3, 'add'));      // 5
console.log(calculate(2, 3, 'multiply')); // 6
```

* **前端应用场景**：

  * **表单校验规则**（不同策略）
  * **不同支付方式、计算策略**

---

### 3️⃣ 职责链模式（Chain of Responsibility）

* **目的**：让多个对象都有机会处理请求，形成链式传递。
* **特点**：

  * 请求沿链传递，直到被处理
* **示例**：

```js
class Handler {
  constructor(fn) { this.fn = fn; this.next = null; }
  setNext(next) { this.next = next; return next; }
  handle(request) {
    if (!this.fn(request) && this.next) this.next.handle(request);
  }
}

const h1 = new Handler(r => r < 10);
const h2 = new Handler(r => r < 20);
h1.setNext(h2);

h1.handle(15); // 交给 h2 处理
```

* **前端应用场景**：

  * **中间件（Koa / Express）**
  * **表单校验链**
  * **事件拦截链**

---

## **四、前端常用设计模式应用场景总结**

| 模式  | 前端典型应用             |
| --- | ------------------ |
| 单例  | 全局状态管理、全局缓存、日志系统   |
| 工厂  | 动态 UI 组件生成、接口适配器   |
| 装饰器 | 高阶组件、函数增强、权限检查     |
| 代理  | Vue3 响应式、数据验证、缓存   |
| 观察者 | PubSub、Redux、响应式系统 |
| 策略  | 表单校验规则、支付/计算策略     |
| 职责链 | Koa 中间件、事件处理链      |

---

如果你愿意，我可以画一张 **前端设计模式关系图**，把 **创建型 → 结构型 → 行为型** 以及 **实际应用场景** 直观可视化，一眼就能看懂每个模式的用途和联系。

你希望我画吗？
