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