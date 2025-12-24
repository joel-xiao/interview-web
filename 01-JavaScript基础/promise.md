# Promise 核心原理与手写

> Promise 实现原理、手写实现、静态方法详解

---

## 📚 目录

- [一、Promise 基础](#一promise-基础)
- [二、手写 Promise 核心](#二手写-promise-核心)
- [三、Promise 静态方法](#三promise-静态方法)
- [四、Promise 实例方法](#四promise-实例方法)
- [五、面试常考点](#五面试常考点)
- [六、最佳实践](#六最佳实践)

---

## 一、Promise 基础

### 1.1 Promise 是什么？

**Promise** 是 JavaScript 中处理异步操作的对象，表示一个异步操作的最终完成（或失败）及其结果值。

### 1.2 Promise 的三种状态

```js
pending   // 初始状态，既不是成功也不是失败
fulfilled // 操作成功完成
rejected  // 操作失败
```

**状态转换**：
- `pending` → `fulfilled`（调用 `resolve`）
- `pending` → `rejected`（调用 `reject`）
- **状态一旦改变，不可逆转**

### 1.3 Promise 基本用法

```js
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功');
    } else {
      reject('操作失败');
    }
  }, 1000);
});

promise
  .then(value => console.log(value))  // '操作成功'
  .catch(error => console.log(error)) // '操作失败'
  .finally(() => console.log('完成')); // '完成'
```

---

## 二、手写 Promise 核心

### 2.1 基础版 Promise

```js
class MyPromise {
  constructor(executor) {
    // 状态：pending | fulfilled | rejected
    this.status = 'pending';
    this.value = undefined;  // 成功时的值
    this.reason = undefined; // 失败时的原因
    
    // 存储回调函数（支持异步）
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        // 执行所有成功回调
        this.onFulfilledCallbacks.forEach(fn => fn(value));
      }
    };

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        // 执行所有失败回调
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
    // 参数默认处理
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    // 返回新 Promise，支持链式调用
    return new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        // 异步执行（模拟微任务）
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
        // 存储回调，等待状态改变后执行
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

### 2.2 核心要点

1. **状态管理**：`pending` → `fulfilled` / `rejected`
2. **回调存储**：支持异步操作，状态改变后执行回调
3. **链式调用**：`then` 返回新 Promise
4. **错误处理**：`try/catch` 捕获 executor 中的错误

---

## 三、Promise 静态方法

### 3.1 Promise.resolve

**作用**：返回一个已解决的 Promise

```js
MyPromise.resolve = function(value) {
  return new MyPromise((resolve) => resolve(value));
};

// 使用
MyPromise.resolve(1).then(console.log); // 1
```

### 3.2 Promise.reject

**作用**：返回一个已拒绝的 Promise

```js
MyPromise.reject = function(reason) {
  return new MyPromise((_, reject) => reject(reason));
};

// 使用
MyPromise.reject('error').catch(console.log); // 'error'
```

### 3.3 Promise.all

**作用**：所有 Promise 都成功才返回，有一个失败就立即失败

```js
MyPromise.all = function(promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('参数必须是数组'));
    }
    
    if (promises.length === 0) {
      return resolve([]);
    }

    let result = [];
    let count = 0;

    promises.forEach((p, i) => {
      // 处理非 Promise 值
      MyPromise.resolve(p).then(
        value => {
          result[i] = value;
          count++;
          // 全部完成
          if (count === promises.length) {
            resolve(result);
          }
        },
        err => {
          // 有一个失败就立即 reject
          reject(err);
        }
      );
    });
  });
};

// 使用
MyPromise.all([
  MyPromise.resolve(1),
  MyPromise.resolve(2),
  MyPromise.resolve(3)
]).then(console.log); // [1, 2, 3]

MyPromise.all([
  MyPromise.resolve(1),
  MyPromise.reject('error'),
  MyPromise.resolve(3)
]).catch(console.log); // 'error'
```

**特点**：
- ✅ 返回顺序与输入数组一致
- ✅ 有一个失败就立即 reject
- ✅ 支持非 Promise 值

### 3.4 Promise.race

**作用**：谁先完成就返回谁的结果（无论成功失败）

```js
MyPromise.race = function(promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('参数必须是数组'));
    }

    promises.forEach(p => {
      MyPromise.resolve(p).then(resolve, reject);
    });
  });
};

// 使用
MyPromise.race([
  new MyPromise(resolve => setTimeout(() => resolve(1), 1000)),
  new MyPromise(resolve => setTimeout(() => resolve(2), 500))
]).then(console.log); // 2（先完成）
```

**特点**：
- ✅ 谁先完成就返回谁
- ✅ 无论成功失败都返回

### 3.5 Promise.allSettled

**作用**：所有 Promise 都完成（无论成功失败）才返回

```js
MyPromise.allSettled = function(promises) {
  return new MyPromise((resolve) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('参数必须是数组'));
    }

    let result = [];
    let count = 0;

    promises.forEach((p, i) => {
      MyPromise.resolve(p).then(
        value => {
          result[i] = { status: 'fulfilled', value };
          count++;
          if (count === promises.length) resolve(result);
        },
        reason => {
          result[i] = { status: 'rejected', reason };
          count++;
          if (count === promises.length) resolve(result);
        }
      );
    });
  });
};

// 使用
MyPromise.allSettled([
  MyPromise.resolve(1),
  MyPromise.reject('error'),
  MyPromise.resolve(3)
]).then(console.log);
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'error' },
//   { status: 'fulfilled', value: 3 }
// ]
```

### 3.6 Promise.any

**作用**：只要有一个成功就返回，全部失败才 reject

```js
MyPromise.any = function(promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('参数必须是数组'));
    }

    let errors = [];
    let count = 0;

    promises.forEach((p, i) => {
      MyPromise.resolve(p).then(
        value => resolve(value), // 有一个成功就返回
        reason => {
          errors[i] = reason;
          count++;
          // 全部失败
          if (count === promises.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        }
      );
    });
  });
};
```

---

## 四、Promise 实例方法

### 4.1 catch

**作用**：捕获 Promise 链中的错误

```js
MyPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};

// 使用
MyPromise.reject('error')
  .catch(err => console.log(err)); // 'error'
```

**等价关系**：`catch(fn)` = `then(null, fn)`

### 4.2 finally

**作用**：无论成功失败都执行

```js
MyPromise.prototype.finally = function(callback) {
  return this.then(
    value => MyPromise.resolve(callback()).then(() => value),
    reason => MyPromise.resolve(callback()).then(() => { throw reason; })
  );
};

// 使用
MyPromise.resolve(1)
  .finally(() => console.log('完成'))
  .then(console.log); // '完成' -> 1
```

**特点**：
- ✅ 无论 fulfilled 或 rejected 都执行
- ✅ 保持链式返回原值或错误

---

## 五、面试常考点

### 5.1 核心考点

1. **手写 Promise 核心**
   - 状态管理 + 异步回调队列 + 链式调用

2. **实现 Promise.all / race / finally / catch**
   - 理解各方法的用途和实现

3. **解决 then 链式调用返回值**
   - 注意返回值可能是 Promise，需要递归处理

4. **微任务队列**
   - `then` 内部异步执行需要用 `setTimeout` 或 `queueMicrotask`
   - 实际 Promise 使用微任务队列

5. **错误捕获**
   - executor 中抛出的异常需捕获并 reject

### 5.2 手写技巧

**面试时可以用三行实现基本 Promise，再逐步扩展**：

```js
const p = new MyPromise((resolve, reject) => { resolve(1); });
p.then(v => console.log(v));
```

**然后逐步添加**：
1. 状态管理
2. 异步回调队列
3. 链式调用
4. 错误处理
5. 静态方法

---

## 六、最佳实践

### 6.1 错误处理

```js
// ✅ 推荐：使用 catch
promise
  .then(handleSuccess)
  .catch(handleError);

// ❌ 不推荐：在 then 中处理错误
promise
  .then(handleSuccess, handleError);
```

### 6.2 链式调用

```js
// ✅ 推荐：清晰的链式调用
fetch('/api/data')
  .then(response => response.json())
  .then(data => processData(data))
  .catch(error => handleError(error))
  .finally(() => cleanup());

// ❌ 不推荐：嵌套 Promise
fetch('/api/data').then(response => {
  response.json().then(data => {
    processData(data);
  });
});
```

### 6.3 Promise.all vs Promise.allSettled

```js
// 需要全部成功 → 使用 Promise.all
Promise.all([p1, p2, p3])
  .then(results => {
    // 全部成功
  })
  .catch(error => {
    // 有一个失败
  });

// 需要全部完成（无论成功失败）→ 使用 Promise.allSettled
Promise.allSettled([p1, p2, p3])
  .then(results => {
    // 全部完成，包含成功和失败
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        // 成功
      } else {
        // 失败
      }
    });
  });
```

---

## 🎯 学习建议

1. **理解原理**：掌握 Promise 的状态机制和链式调用原理
2. **手写实现**：能够手写 Promise 核心和常用方法
3. **实际应用**：在项目中熟练使用 Promise 处理异步
4. **面试准备**：重点掌握 Promise.all、race、链式调用

---

## 📖 相关资源

- [MDN: Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Promise A+ 规范](https://promisesaplus.com/)

---

**相关文件**：
- [JavaScript常见坑点.md](./JavaScript常见坑点.md) - JavaScript 常见坑点（异步相关）
- [JavaScript模块化.md](./JavaScript模块化.md) - JavaScript 模块化
