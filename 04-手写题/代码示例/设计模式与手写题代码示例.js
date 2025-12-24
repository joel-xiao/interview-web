/**
 * 设计模式与手写题代码示例集合
 * 
 * 对应文档：
 * - ../../01-JavaScript基础/Design pattern.md - 设计模式原理详解
 * - ../../01-JavaScript基础/继承.md - JavaScript 继承机制详解
 * - ../../01-JavaScript基础/promise.md - Promise 核心原理
 * 
 * 文件位置：04-手写题/代码示例/test.js
 * 
 * 本文件包含：
 * 1. 设计模式实现代码（单例、工厂、观察者、原型、适配器、策略、装饰者）
 * 2. 手写题代码示例（call/apply/bind、防抖节流、深拷贝、继承、new、instanceof）
 * 3. 其他工具函数（两数之和、数组去重等）
 * 
 * 注意：本文件为代码示例，详细原理说明请参考对应的 .md 文档
 */

// ==================== 设计模式 ====================

// 单列模式

const Singleton = (function() {
  let instance;

  function createInstance() {
    // 创建单列对象的逻辑
    return {
      // 单列对象的方法和属性
    }
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    }
  }
})()
const singletonObj1 = Singleton.getInstance();
const singletonObj2 = Singleton.getInstance();

console.log(singletonObj1 === singletonObj2); // 输出: true

// 工厂模式

function Shape(type) {
  this.type = type;
}

Shape.prototype.draw = function () {
  console.log('Drawing a ' + this.type + " shape.");
}

function ShapeFactory() {};

ShapeFactory.prototype.createShape = function (type) {
  switch (type) {
    case 'circle':
      return new Shape("circle");
    default:
      throw new Error("Invalid shape type.")
  }
}

const factory = new ShapeFactory();
const circle = factory.createShape('circle');
circle.draw();

// 观察者模式

// 观察者类
class Observer {
  constructor(name){
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
    const findIdx = this.observers.find( r => r === observer);
    this.observers.splice(findIdx, 1);
  }

  notifyObservers(data) {
    this.observers.forEach( observer => {
      observer.update(data);
    })
  }
}

const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');
const subject = new Subject();
subject.addObserver(observer1);
subject.addObserver(observer2);

subject.notifyObservers('Hello!');

//  原型模式

function Car(brand, model) {
  this.brand = brand;
  this.model = model;
}

Car.prototype.drive = function () {
  console.log('Drive a ' + this.brand + this.model)
}

Car.prototype.stop = function() {
  console.log('Stop the ' + this.brand + ' ' + this.model)
}
const car1 = new Car('Toyota', 'Corolla');
car1.drive();
car1.stop();

const car2 = new Car("Honda", "Civic");
car2.drive();
car2.stop();

// 适配器模式

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

const adptee = new Adaptee();
const adapter = new Adapter(adptee);
adapter.request();

// 策略模式

// 策略接口
class Strategy {
  execute() {
    throw new Error('Strategy')
  }
}
// 具体策略类
class ConcreteStrategyA {
  execute() {
    console.log('Concrete Strategy A');
  }
}

class ConcreteStrategyB {
  execute() {
    console.log('Concrete Strategy B');
  }
}

class ConcreteStrategyC {
  execute() {
    console.log('Concrete Strategy C')
  }
}

// 上下文类

class Context {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  executeStrategy() {
    this.strategy.execute();
  }
}

// 客户端代码

const context = new Context(new ConcreteStrategyA());
context.executeStrategy();
context.setStrategy(new ConcreteStrategyB());
context.executeStrategy();
context.setStrategy(new ConcreteStrategyC());
context.executeStrategy();


// 装饰者模式

//基础组件接口
class Component {
  operation() {
    throw new Error("Component class must have an operation method")
  }
}

class ConcreteComponent extends Component {
  operation() {
    console.log('Executing operation in ConcreteComponent')
  }
}

function printBinaryTree(depth, prefix = '') {
  console.log(prefix + '1');
  if (depth > 0) {
    printBinaryTree(depth - 1, prefix + '1-');
    printBinaryTree(depth - 1, prefix + '2-');
  }
}
printBinaryTree(3)



Array.prototype.myCall = function (context, ...args) {
  const symbol = Symbol();
  context[symbol] = this;
  const result = context[symbol](...args);
  delete context[symbol];
  return result
}

Array.prototype.myApply = function (context, args) {
 const symbol = Symbol();
  context[symbol] = this;
  const result = context[symbol](...args);
  delete context[symbol];
  return result
}

Array.prototype.myBind = function (context, ...args) {
  const self = this;
  return function(...args) {
    const symbol = Symbol();
    context[symbol] = this instanceof self ? this : self;
    context[symbol](...args);
  }
}



function debounce(fn, ts = 0) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, ts)
  }
}


function throttle(fn, ts) {
  let last_ts = 0;

  return function(...args) {
    let now = new Date().getTime();
    if (last_ts + ts < now) {
      fn(...args);
      last_ts = now;
    }
  }
}


function clone(obj) {
  if (typeof obj !== 'object' && obj !== null ) return obj;
  const newObj = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    newObj[key] = obj[key];
  }

  return newObj
}


function deepClone(obj, map = new WeakMap()) {
  if (typeof obj !== 'object' && obj !== null ) return obj;
  if (map.hash(obj)) return map.get(obj);
  const newObj = Array.isArray(obj) ? [] : {};
  map.set(obj, newObj);
  for(let key in obj) {
    newObj[key] = deepClone(obj[key], map);
  }
  return newObj
}



function Parent (){
  this.name = 'parent';
  this.log = function () {
    console.log(this.name)
  }
}

function Child(...args) {
  Parent.call(this, args);
  this.name = 'child';
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
const child = new Child();
child.log();


function myInstanceOf(obj, cls) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === cls.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false
}


function myNew(fn, ...args) {
  const obj = {}
  Object.setPrototypeOf(obj, fn.prototype);
  const result = fn.apply(obj, args);
  return typeof result === 'object' && result !== null ? result : obj
}

const Exmaple = (function() {
  let instance;
   function create() {
    return {}
  }
  return {
    getInstance: function() {
      if (!instance)  instance = create();
      return instance;
    }
  }
})()

Exmaple.getInstance().a = 1;
console.log(Exmaple.getInstance().a);


class Car {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
  }
}

class Bick {
  constructor(name){
    this.name = name
  }
}

function vehicleFactory(type) {
  switch (type) {
    case 'car': return new Car();
    case 'bick': return new Bick();
    default: throw new Error('Unknown vehicle type');
  }
}



const unit = {
  '%': v> v * 100,
  byte: v => v,
  mb: v => v * 1024,
  gb: v => v * 1024
}


class Hande {
  constructor (fn) {
    this.fn = fn;
  }

  setNext(next) {
    this.next = next;
    return next;
  }
  handel(res) {
    if (this.fn(res)&& this.next) this.next.handel(res);
  }
}


const h1 = new Hande(v => v < 100);
const h2 = new Hande(v => v < 1000);
h1.setNext(h2);

h1.handel(100);

function toSum(nums, target)  {
  const map = new Map();
  for (let i =0; i< nums.length; i++) {
    const num = target - nums[i];
    if (map.has(num)) return [map.get(num), i];
    map.set(nums[i], i);
  }
}




function unique(arr){
  const result = [];
  const map = new Map();

  for(let item in arr) {
    if (map.has(item)) continue;
    map.set(item, true);
    result.push(item);
  }
  return result;
}
