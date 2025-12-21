
JavaScript（简称JS）是一种广泛用于Web开发的脚本语言，它支持多种设计模式。下面是几种常见的JavaScript设计模式及其应用场景：

1. 单例模式（Singleton Pattern）：保证一个类只有一个实例，并提供全局访问点。应用场景包括全局状态管理、日志记录、数据库连接等。
https://refactoringguru.cn/design-patterns/singleton
````javascript
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
````

2. 工厂模式（Factory Pattern）：通过工厂方法创建对象，隐藏创建对象的具体逻辑。应用场景包括创建不同类型的对象，封装复杂的对象创建逻辑。
https://juejin.cn/post/6844903653774458888
````javascript
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
````

3. 观察者模式（Observer Pattern）：定义对象间的一对多依赖关系，当一个对象状态发生变化时，其依赖对象都会收到通知并自动更新。应用场景包括事件处理、异步编程、UI组件交互等。
https://refactoringguru.cn/design-patterns/observer
````javascript
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

// 在这个示例中，NewsPublisher 充当主题（Subject），负责管理订阅者（观察者）列表，并提供订阅和取消订阅的方法。Subscriber 充当观察者，具有一个 notify 方法用于接收并处理发布的新闻。

// 当发布新闻时，主题会遍历订阅者列表并调用每个订阅者的 notify 方法来通知它们有新闻发布。订阅者收到通知后，会执行相应的操作，例如在控制台打印接收到的新闻。

// 这个示例展示了观察者模式的基本概念，可以在实际开发中用于实现发布-订阅系统、事件处理、UI组件更新等场景，从而实现解耦和灵活性。
````

4. 原型模式（Prototype Pattern）：通过复制现有对象来创建新对象，避免了使用类和子类层次结构。应用场景包括对象的动态创建、原型继承等。
````javascript
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
// 在上述示例中，我们定义了一个 Car 类作为原型对象，其中包含了 drive 和 stop 方法。然后，我们通过 new Car("Toyota", "Corolla") 创建了一个原型对象实例 carPrototype。

// 使用 Object.create(carPrototype)，我们可以基于原型对象创建新的对象 car1 和 car2。通过设置特定的属性（例如 brand 和 model），我们可以在新对象中访问原型对象的方法。

// 这样，我们就可以通过复制原型对象来创建多个具有相似行为的新对象，避免了使用类和子类层次结构。原型模式允许我们动态创建对象并实现原型继承，同时还可以方便地修改和扩展原型对象的行为。
````

5. 适配器模式（Adapter Pattern）：将一个类的接口转换成另一个类所期望的接口，使得原本不兼容的类可以合作。应用场景包括封装第三方API、兼容不同版本的接口等。
````javascript
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
// 在上述示例中，我们有一个目标接口 Target，其中定义了一个 request 方法。然后，我们有一个被适配者类 Adaptee，其中定义了一个 specificRequest 方法，该方法与目标接口的方法不兼容。

// 接下来，我们创建了一个适配器类 Adapter，它继承了目标接口 Target。适配器类通过组合一个被适配者对象 adaptee 来实现适配器模式。在适配器类的 request 方法中，我们适配了目标接口的方法，并在其内部调用了被适配者的方法。

// 最后，我们在客户端代码中创建了一个被适配者对象 adaptee 和一个适配器对象 adapter。当调用适配器对象的 request 方法时，它会适配目标接口的方法并调用被适配者的方法。


````

6.策略模式（Strategy Pattern）：定义一系列算法，将它们封装起来，并使它们可以互相替换。应用场景包括根据不同条件选择不同的算法、表单验证等。
````javascript
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

// 在上述示例中，我们定义了一个策略接口 Strategy，其中包含一个 execute 方法。然后，我们创建了几个具体策略类 ConcreteStrategyA、ConcreteStrategyB 和 ConcreteStrategyC，它们分别实现了 execute 方法并提供了不同的实现。

// 接下来，我们有一个上下文类 Context，它接收一个策略对象作为参数，并通过 setStrategy 方法来设置不同的策略。executeStrategy 方法在上下文中执行策略的 execute 方法。

// 在客户端代码中，我们创建了一个上下文对象 context 并最初设置为使用 ConcreteStrategyA 策略。然后，我们可以通过调用 executeStrategy 方法来执行当前策略的操作。通过使用 setStrategy 方法，我们可以在运行时更改上下文使用的策略。
````

7. 装饰者模式（Decorator Pattern）：动态地给对象添加新的职责，同时不改变其结构。应用场景包括动态增加对象的功能、扩展对象的行为等。

迭代器模式（Iterator Pattern）：提供一种顺序访问集合对象元素的方法，而不需要暴露集合对象的内部表示。应用场景包括遍历集合、异步迭代等。