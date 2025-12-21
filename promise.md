
## **1️⃣ 基础手写 Promise**

一个最简单的手写 Promise：

```js
class MyPromise {
  constructor(executor) {
    this.status = 'pending';  // 状态：pending | fulfilled | rejected
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn(value));
      }
    };

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    return new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }

      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }

      if (this.status === 'pending') {
        this.onFulfilledCallbacks.push((value) => {
          setTimeout(() => {
            try {
              const x = onFulfilled(value);
              resolve(x);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              const x = onRejected(reason);
              resolve(x);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });
      }
    });
  }
}
```

✅ 说明：

* 状态管理：`pending` → `fulfilled` / `rejected`
* 回调存储，支持异步执行
* `then` 返回新 Promise，支持链式调用

---

## **2️⃣ 手写 Promise.resolve / Promise.reject**

```js
MyPromise.resolve = function(value) {
  return new MyPromise((resolve) => resolve(value));
};

MyPromise.reject = function(reason) {
  return new MyPromise((_, reject) => reject(reason));
};
```

---

## **3️⃣ 手写 Promise.all**

```js
MyPromise.all = function(promises) {
  return new MyPromise((resolve, reject) => {
    let result = [];
    let count = 0;
    promises.forEach((p, i) => {
      MyPromise.resolve(p).then(
        value => {
          result[i] = value;
          count++;
          if (count === promises.length) resolve(result);
        },
        err => reject(err)
      );
    });
  });
};
```

* 返回顺序与输入数组一致
* 有一个失败就立即 reject

---

## **4️⃣ 手写 Promise.race**

```js
MyPromise.race = function(promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach(p => {
      MyPromise.resolve(p).then(resolve, reject);
    });
  });
};
```

* 谁先完成就返回结果

---

## **5️⃣ 手写 finally**

```js
MyPromise.prototype.finally = function(callback) {
  return this.then(
    value => MyPromise.resolve(callback()).then(() => value),
    reason => MyPromise.resolve(callback()).then(() => { throw reason; })
  );
};
```

* 不论 fulfilled 或 rejected 都执行
* 保持链式返回原值或错误

---

## **6️⃣ 手写 catch**

```js
MyPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};
```

* `catch(fn)` = `then(null, fn)`

---

## **7️⃣ 面试常考点**

1. **手写 Promise 核心**

   * 状态管理 + 异步回调队列 + 链式调用
2. **实现 Promise.all / race / finally / catch**
3. **解决 then 链式调用返回值**

   * 注意返回值可能是 Promise
4. **微任务队列**

   * `then` 内部异步执行需要用 `setTimeout` 或 `queueMicrotask`
5. **错误捕获**

   * executor 中抛出的异常需捕获并 reject

---

💡 小技巧

* 面试时可以用 **三行实现基本 Promise**，再逐步扩展：

```js
const p = new MyPromise((resolve, reject) => { resolve(1); });
p.then(v => console.log(v));
```

* 然后加状态、异步队列、链式调用

---
