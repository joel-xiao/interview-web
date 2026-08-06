
// 继承属性，但引用类型会共享
//
function parent() {
this.name = 'base';
this.arr = [2, 3, 4];
}
parent.prototype.log = function() {
console.log(this.name)
}

function child() {

}

child.prototype = new parent();
child.prototype.constructor = child

const a = new child()
const b = new child()
a.arr.push('w')
b.arr;
b.log()

// 构造函数集成 ： 只能继承属性，且 引用类型不会共享
function Parent2() {
  this.name = 2;
  this.arr = []
}

Parent2.prototype.log = function() {
  console.log(this.arr, 'arr')
}


function Child() {
  Parent2.call(this)
}

// <Child.prototype = new Parent2()

const c = new Child()
const d = new Child();

c.arr.push(2)
d.arr
c.log()


// 组合式集成 会调用两次 父函数

function parent3() {
  this.name = '2'
}

parent3.prototype.say = function () {
  console.log(this.name)
}

function child3() {
  parent3.call(this)
}

child3.prototype = new parent3();
child3.prototype.constructor = child3()

const e = new child3()
const f = new child3()
f.name = 'a'
f.say()
e.name


