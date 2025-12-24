# JavaScript 设计模式

> 前端常用设计模式详解，按创建型、结构型、行为型分类

---

## 📚 目录

- [一、创建型模式](#一创建型模式)
- [二、结构型模式](#二结构型模式)
- [三、行为型模式](#三行为型模式)
- [四、前端应用场景总结](#四前端应用场景总结)

---

## 一、创建型模式

> 关注对象创建的方式，提供创建对象的灵活机制

### 1.1 单例模式（Singleton）

**目的**：确保类只有一个实例，并提供全局访问点。

**特点**：
- 全局唯一实例
- 延迟创建（Lazy Loading 可选）

**JavaScript 实现**：

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

**前端应用场景**：
- **全局状态管理**（如 Redux store 单例）
- **日志管理器**、**全局缓存对象**
- **数据库连接池**

**参考资源**：[单例模式详解](https://refactoringguru.cn/design-patterns/singleton)

---

### 1.2 工厂模式（Factory）

**目的**：提供创建对象的接口，而无需暴露具体实现。

**特点**：
- 封装对象创建
- 可灵活扩展新类型

**示例**：

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
    default: throw new Error('Unknown vehicle type');
  }
}

const c = VehicleFactory('car', 'Tesla');
console.log(c);
```

**前端应用场景**：
- **UI 组件工厂**：动态生成不同组件
- **接口适配器**：根据不同 API 生成不同对象
- **表单元素工厂**：根据类型创建不同表单控件

**参考资源**：[工厂模式详解](https://juejin.cn/post/6844903653774458888)

---

## 二、结构型模式

> 关注对象之间的组合，形成更大的结构

### 2.1 装饰器模式（Decorator）

**目的**：在不修改原对象的前提下，动态扩展对象功能。

**特点**：
- 对象包装对象
- 可叠加功能

**示例**：

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

**前端应用场景**：
- **Vue 指令 / React 高阶组件 HOC**
- **函数增强**：权限检查、日志、缓存
- **装饰器语法**：`@decorator`（ES7+）

---

### 2.2 代理模式（Proxy）

**目的**：通过代理对象控制对目标对象的访问。

**特点**：
- 可添加访问控制、缓存、延迟加载

**示例**：

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

**前端应用场景**：
- **Vue 3 响应式**（Reactive 原理）
- **数据验证 / 缓存 / 日志记录**
- **API 请求拦截**

---

### 2.3 适配器模式（Adapter）

**目的**：将一个类的接口转换成另一个类所期望的接口，使得原本不兼容的类可以合作。

**示例**：

```js
class Target {
  request() {
    console.log('Target: Request')
  }
}

class Adaptee {
  specificRequest() {
    console.log('Adaptee: SpecificRequest')
  }
}

class Adapter extends Target {
  constructor(adaptee) {
    super();
    this.adaptee = adaptee;
  }
  request() {
    console.log('Adapter: Request')
    this.adaptee.specificRequest();
  }
}

const adaptee = new Adaptee();
const adapter = new Adapter(adaptee);
adapter.request();
```

**前端应用场景**：
- **封装第三方 API**：统一接口格式
- **兼容不同版本的接口**
- **数据格式转换**

---

## 三、行为型模式

> 关注对象之间的通信和职责分配

### 3.1 观察者模式（Observer）

**目的**：对象状态变化时，通知依赖对象。

**特点**：
- 发布-订阅机制
- 解耦

**示例**：

```js
// 观察者类
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(data) {
    console.log(this.name, ':', data);
  }
}

// 主题
class Subject {
  constructor() {
    this.observers = [];
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  removeObserver(observer) {
    const index = this.observers.findIndex(r => r === observer);
    if (index > -1) this.observers.splice(index, 1);
  }
  notifyObservers(data) {
    this.observers.forEach(observer => {
      observer.update(data);
    });
  }
}

const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');
const subject = new Subject();
subject.addObserver(observer1);
subject.addObserver(observer2);
subject.notifyObservers('Hello!');
```

**前端应用场景**：
- **EventEmitter / PubSub 系统**
- **Vue 响应式系统**
- **Redux / MobX 状态订阅**
- **DOM 事件系统**

**参考资源**：[观察者模式详解](https://refactoringguru.cn/design-patterns/observer)

---

### 3.2 策略模式（Strategy）

**目的**：定义一系列算法，把它们封装起来，使得算法可以互换。

**特点**：
- 算法可动态替换
- 避免大量 if/else

**示例**：

```js
const strategies = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
  subtract: (a, b) => a - b
};

function calculate(a, b, strategy) {
  return strategies[strategy](a, b);
}

console.log(calculate(2, 3, 'add'));      // 5
console.log(calculate(2, 3, 'multiply')); // 6
```

**前端应用场景**：
- **表单校验规则**（不同策略）
- **不同支付方式、计算策略**
- **排序算法选择**

---

### 3.3 职责链模式（Chain of Responsibility）

**目的**：让多个对象都有机会处理请求，形成链式传递。

**特点**：
- 请求沿链传递，直到被处理

**示例**：

```js
class Handler {
  constructor(fn) {
    this.fn = fn;
    this.next = null;
  }
  setNext(next) {
    this.next = next;
    return next;
  }
  handle(request) {
    if (!this.fn(request) && this.next) {
      this.next.handle(request);
    }
  }
}

const h1 = new Handler(r => r < 10);
const h2 = new Handler(r => r < 20);
h1.setNext(h2);

h1.handle(15); // 交给 h2 处理
```

**前端应用场景**：
- **中间件（Koa / Express）**
- **表单校验链**
- **事件拦截链**

---

## 四、前端应用场景总结

| 模式 | 前端典型应用 | 使用频率 |
|------|------------|---------|
| **单例** | 全局状态管理、全局缓存、日志系统 | ⭐⭐⭐⭐⭐ |
| **工厂** | 动态 UI 组件生成、接口适配器 | ⭐⭐⭐⭐ |
| **装饰器** | 高阶组件、函数增强、权限检查 | ⭐⭐⭐⭐⭐ |
| **代理** | Vue3 响应式、数据验证、缓存 | ⭐⭐⭐⭐⭐ |
| **适配器** | API 封装、数据格式转换 | ⭐⭐⭐ |
| **观察者** | PubSub、Redux、响应式系统 | ⭐⭐⭐⭐⭐ |
| **策略** | 表单校验规则、支付/计算策略 | ⭐⭐⭐⭐ |
| **职责链** | Koa 中间件、事件处理链 | ⭐⭐⭐ |

---

## 🎯 学习建议

1. **理解分类**：掌握创建型、结构型、行为型三大分类
2. **实践应用**：在项目中尝试应用设计模式
3. **避免过度设计**：根据实际需求选择合适模式
4. **结合框架**：理解框架中使用的设计模式

---

## 📖 参考资源

- [设计模式详解](https://refactoringguru.cn/design-patterns)
- [JavaScript 设计模式实践](https://juejin.cn/post/6844903653774458888)

---

**相关文件**：
- [设计模式与手写题代码示例.js](../04-手写题/代码示例/设计模式与手写题代码示例.js) - 设计模式代码示例
- [继承.md](./继承.md) - JavaScript 继承机制
