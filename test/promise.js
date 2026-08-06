class MyPromise {
  constructor(fn) {
    this.status = 'pending'; // reject   resloove
    this.value = undefined;
    this.reject_info = undefined;
    this.resloves = [];
    this.rejects = [];
    function reslove(res) {
      if (this.status === 'pending') {
        this.status = 'reslove';
        this.value = res;
        this.reslove.forEach(r => r(res))
      }
    }

    function reject(res) {
      if (this.status === 'pending') {
        this.status = 'reject';
        this.reject_info = res;
        this.rejects.forEach(r => r(res))
      }
    }

    try {
      fn(reslove, reject)
    } catch (ret) {
       reject(ret)
    }
  }

  then( resloved, rejected) {
    return new MyPromise ((resolve, reject) => {
      if (resloved) {
        if (this.status === 'pendding') {
          this.resloves.push(() => setTimeout(() => {
            try {
              const x = resloved(this.value);
              resolve(x);
            } catch(err) {
              reject(err)
            }
          }));
        }

        if (this.status === 'reslove') {
          try {
            const x = resloved(this.value);
            resolve(x);
          } catch(err) {
            reject(err)
          }
        }
      }

      if (rejected) {
        if (this.status === 'pendding') {
          this.rejects.push(() => setTimeout(() => {
            try {
              const x = rejected(this.reject_info);
              resolve(x)
            } catch( err) {
                reject(err)
            }
          }));
        }

        if (this.status === 'reject') {
          try {
            const x = rejected(this.reject_info);
            resolve(x)
          } catch( err) {
              reject(err)
          }
        }
      }
    })
  }

  reject(x) {
    return new MyPromise((resolove, reject) => {
      reject(x)
    })
  }

  reject(x) {
    return new MyPromise((resolove, reject) => {
      reject(x)
    })
  }

  all(promises) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      promises.forEach( (r, idx) => {
        r.then((res) => {
          result[idx] = res;
          if (result.length === promises.length) resolve(result);
        }, (err) => {
            reject(err)
          })
      })
    })
  }

  race(promises) {
    return MyPromise((resolve, reject) => {
      const result = [];
      let idx = 0;
      for (let p in promises) {
        p.then((res) => {
          result[idx] = res;  
          resolve(result);
        }, (err) => {
          reject(err)
        })
      }
    })
  }

  allSettled(arrs) {
    return MyPromise((resolve, reject) => {
      const arr = [];
      let count = 0;

      arr.forEach((item, idx) => {
          count++;
        item.then((res) => {
          arr[idx] = res;
          if (count === arrs.length) resolve(arr)
        }, (arr) => {
          arr[idx] = res;
          if (arr.length === arrs.length) resolve(arr)
        })
      })
    })
  }
}
