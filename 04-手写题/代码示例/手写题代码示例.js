/**
 * 手写题代码示例集合
 * 
 * 对应文档：
 * - ../汇总/高频手写题_汇总.md - 93道高频手写题列表
 * - ../汇总/工程化手写题_汇总.md - 100道工程化手写题列表
 * - ../汇总/算法手写题_汇总.md - 100道算法手写题列表
 * - ../手写题索引.md - 手写题文件索引和使用指南
 * 
 * 文件位置：04-手写题/代码示例/手写题代码示例.js
 * 
 * 本文件包含：
 * 1. 框架核心手写题（Vue 响应式、React Hooks）
 * 2. DOM/BOM 实战手写题（图片懒加载）
 * 3. 工程化手写题（Webpack 插件、组件懒加载）
 * 4. 算法排序手写题（快速排序）
 * 
 * 注意：本文件为代码示例，详细原理说明请参考对应的 .md 文档
 */

// ==================== 框架核心手写题 ====================

/**
 * 手写简易版 Vue（核心：响应式+模板编译+挂载渲染）
 * 
 * 对应题目：高频手写题_汇总.md 第85题
 * 核心原理：
 * 1. 数据劫持：使用 Object.defineProperty 监听 data 变化
 * 2. 发布订阅：存储指令与更新函数的映射关系
 * 3. 模板编译：解析 v-model 和 {{}} 语法，绑定视图与数据
 * 
 * 实现功能：
 * - v-model 双向绑定
 * - {{}} 插值表达式
 * - 数据变化自动更新视图
 * - 视图变化自动更新数据
 */
class MyVue {
  constructor(options) {
    this.$data = options.data();
    this.$el = document.querySelector(options.el);
    // 1. 数据劫持：监听 data 变化
    this.observe(this.$data);
    // 2. 模板编译：解析指令，绑定视图与数据
    this.compile(this.$el);
  }
  
  // 数据劫持
  observe(data) {
    Object.keys(data).forEach(key => {
      let value = data[key];
      Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get() { 
          return value; 
        },
        set: (function(newVal) {
          if (newVal === value) return;
          value = newVal;
          // 数据变化，通知订阅者更新视图
          this.notify(key, newVal);
        }).bind(this)
      });
    });
  }
  
  // 发布订阅：存储指令与更新函数
  $watch = new Map();
  
  // 订阅
  watch(key, updateFn) {
    if (!this.$watch.has(key)) this.$watch.set(key, []);
    this.$watch.get(key).push(updateFn);
  }
  
  // 发布
  notify(key, newVal) {
    if (this.$watch.has(key)) {
      this.$watch.get(key).forEach(fn => fn(newVal));
    }
  }
  
  // 模板编译
  compile(el) {
    el.childNodes.forEach(node => {
      // 元素节点：解析 v-model
      if (node.nodeType === 1) {
        const vModel = node.getAttribute('v-model');
        if (vModel) {
          // 视图更新数据
          node.addEventListener('input', (e) => {
            this.$data[vModel] = e.target.value;
          });
          // 数据更新视图
          this.watch(vModel, (newVal) => {
            node.value = newVal;
          });
          // 初始化视图
          node.value = this.$data[vModel];
        }
      }
      // 文本节点：解析 {{}}
      if (node.nodeType === 3 && /\{\{(.+)\}\}/.test(node.textContent)) {
        const key = RegExp.$1.trim();
        this.watch(key, (newVal) => {
          node.textContent = newVal;
        });
        node.textContent = this.$data[key];
      }
    });
  }
}

// 使用示例：
// const app = new MyVue({
//   el: '#app',
//   data() {
//     return {
//       message: 'Hello MyVue'
//     };
//   }
// });

// ==================== DOM/BOM 实战手写题 ====================

/**
 * 手写图片懒加载（基础版）
 * 
 * 对应题目：高频手写题_汇总.md 第32题
 * 核心原理：
 * 1. 使用 getBoundingClientRect() 计算图片位置
 * 2. 判断图片是否进入视口（提前100px加载，优化体验）
 * 3. 使用节流优化 scroll 事件性能
 * 
 * 优化版本：可使用 IntersectionObserver API（更高效）
 */
function lazyLoad() {
  const imgs = document.querySelectorAll('img[data-src]');
  const clientHeight = window.innerHeight; // 视口高度
  
  imgs.forEach(img => {
    // 图片距离视口顶部的距离
    const imgTop = img.getBoundingClientRect().top;
    // 进入视口则加载（提前100px加载，优化体验）
    if (imgTop <= clientHeight + 100) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });
}

// 初始化+监听事件
lazyLoad();
window.addEventListener('scroll', throttle(lazyLoad, 200)); // 节流优化
window.addEventListener('resize', lazyLoad);

// 节流函数（需要配合使用）
function throttle(fn, delay) {
  let timer = null;
  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

// HTML 使用示例：
// <img data-src="image.jpg" alt="懒加载图片" />

// ==================== 框架核心手写题 ====================

/**
 * 手写 React useState 钩子（简易版，支持多状态+函数式更新）
 * 
 * 对应题目：高频手写题_汇总.md 第58题
 * 核心原理：
 * 1. 使用数组存储所有状态（stateArr）
 * 2. 使用索引（index）记录当前 useState 调用位置
 * 3. 每次渲染重置索引，确保状态对应关系正确
 * 4. 支持函数式更新（传入函数作为新值）
 * 
 * 注意：这是简化版实现，真实 React 使用 Fiber 链表存储状态
 */
let stateArr = []; // 存储所有状态
let index = 0;     // 记录当前 useState 调用索引

function useState(initialValue) {
  const currentIndex = index;
  // 初始化状态：首次调用赋值初始值
  stateArr[currentIndex] = stateArr[currentIndex] ?? initialValue;
  
  // 定义更新函数：修改对应索引的状态，触发重渲染
  const setState = (newVal) => {
    // 支持函数式更新
    if (typeof newVal === 'function') {
      stateArr[currentIndex] = newVal(stateArr[currentIndex]);
    } else {
      stateArr[currentIndex] = newVal;
    }
    render(); // 模拟 React 组件重渲染
  };
  
  index++;
  return [stateArr[currentIndex], setState];
}

// 模拟组件重渲染（重置索引，重新执行组件函数）
function render() {
  index = 0;
  // 此处是组件渲染逻辑，如重新挂载组件
  console.log('组件重渲染，当前状态：', stateArr);
}

// 使用示例：
// function Counter() {
//   const [count, setCount] = useState(0);
//   const [name, setName] = useState('React');
//   
//   return {
//     count,
//     name,
//     increment: () => setCount(count + 1),
//     updateName: () => setName('Vue')
//   };
// }

// ==================== 工程化手写题 ====================

/**
 * 手写简易版 Webpack 插件（监听打包生命周期，如打包日志、文件拷贝插件）
 * 
 * 对应题目：工程化手写题_汇总.md 第2题
 * 核心原理：
 * 1. 插件是一个类，必须有 apply 方法
 * 2. apply 方法接收 compiler 实例
 * 3. 通过 compiler.hooks 监听打包生命周期钩子
 * 4. 使用 tap 方法注册回调函数
 * 
 * 常用钩子：
 * - done：打包完成
 * - emit：输出资源到 output 目录前
 * - compilation：编译创建时
 * - afterEmit：输出资源到 output 目录后
 */
class BuildLogPlugin {
  constructor(options = {}) {
    this.name = options.name || 'BuildLogPlugin';
  }
  
  // apply 是插件核心，接收 compiler 实例
  apply(compiler) {
    // 监听 打包完成 钩子（done 钩子）
    compiler.hooks.done.tap(this.name, (stats) => {
      const { startTime, endTime } = stats;
      const buildTime = (endTime - startTime) / 1000 + 's';
      console.log(`✅ 打包成功！插件：${this.name}，打包耗时：${buildTime}`);
    });
  }
}

// 使用：在 webpack.config.js 的 plugins 中 new BuildLogPlugin() 即可
// module.exports = {
//   plugins: [
//     new BuildLogPlugin({ name: 'MyBuildLogPlugin' })
//   ]
// };

// ==================== 扩展：其他常用 Webpack 钩子示例 ====================

/**
 * 文件拷贝插件示例
 */
class CopyFilePlugin {
  constructor(options) {
    this.from = options.from;
    this.to = options.to;
  }
  
  apply(compiler) {
    // 在输出资源前执行
    compiler.hooks.emit.tapAsync('CopyFilePlugin', (compilation, callback) => {
      // 读取源文件
      const source = compilation.assets[this.from];
      if (source) {
        // 复制到新文件
        compilation.assets[this.to] = {
          source: () => source.source(),
          size: () => source.size()
        };
      }
      callback();
    });
  }
}

/**
 * 自定义 Banner 插件示例
 */
class BannerPlugin {
  constructor(options) {
    this.banner = options.banner || '';
  }
  
  apply(compiler) {
    compiler.hooks.compilation.tap('BannerPlugin', (compilation) => {
      compilation.hooks.processAssets.tap({
        name: 'BannerPlugin',
        stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS
      }, (assets) => {
        Object.keys(assets).forEach(filename => {
          if (filename.endsWith('.js')) {
            const asset = assets[filename];
            const source = this.banner + '\n' + asset.source();
            compilation.updateAsset(filename, {
              source: () => source,
              size: () => source.length
            });
          }
        });
      });
    });
  }
}

// ==================== 工程化手写题 ====================

/**
 * 手写 import 动态导入封装（组件懒加载+加载状态+错误兜底，适配路由/大屏组件）
 * 
 * 对应题目：工程化手写题_汇总.md 第19题
 * 核心原理：
 * 1. 使用 React.lazy 实现组件懒加载
 * 2. 封装 Promise 处理加载状态和错误处理
 * 3. 提供错误兜底组件，避免加载失败导致页面崩溃
 * 
 * 实现功能：
 * - 组件懒加载（按需加载）
 * - 加载状态提示
 * - 错误处理和兜底
 * - 适配路由和大屏组件场景
 * 
 * 注意：需要配合 React.Suspense 使用
 */
function lazyLoadComponent(importFn) {
  return React.lazy(() => {
    return new Promise((resolve) => {
      // 加载中：可自定义加载组件
      console.log('组件加载中...');
      importFn().then((module) => {
        resolve(module);
      }).catch((err) => {
        console.error('组件加载失败', err);
        // 错误兜底：返回默认错误组件
        resolve({ default: () => <div>组件加载失败</div> });
      });
    });
  });
}

// 使用示例：
// const Home = lazyLoadComponent(() => import('./Home'));
// 
// // 配合 Suspense 使用
// function App() {
//   return (
//     <Suspense fallback={<div>加载中...</div>}>
//       <Home />
//     </Suspense>
//   );
// }

// ==================== 算法排序手写题 ====================

/**
 * 手写快速排序（分治思想，前端高频排序）
 * 
 * 对应题目：高频手写题_汇总.md 第68题
 * 核心原理：
 * 1. 分治思想：选择一个基准值（pivot），将数组分为三部分
 * 2. 小于基准值的放左边，等于基准值的放中间，大于基准值的放右边
 * 3. 递归处理左右两部分，直到数组长度为1或0
 * 
 * 时间复杂度：
 * - 平均情况：O(n log n)
 * - 最坏情况：O(n²) - 当每次选择的基准值都是最大或最小值时
 * - 最好情况：O(n log n)
 * 
 * 空间复杂度：O(log n) - 递归调用栈
 * 
 * 特点：
 * - 不稳定排序（相同元素可能改变相对位置）
 * - 原地排序（不需要额外空间，但递归需要栈空间）
 * - 适合大数据量排序
 */
function quickSort(arr) {
  // 递归终止条件：数组长度为1或0时，直接返回
  if (arr.length <= 1) return arr;
  
  // 选择中间值作为基准（也可以选择第一个、最后一个或随机值）
  const pivot = arr[Math.floor(arr.length / 2)];
  
  // 将数组分为三部分：小于、等于、大于基准值
  const left = arr.filter(item => item < pivot);
  const mid = arr.filter(item => item === pivot);
  const right = arr.filter(item => item > pivot);
  
  // 递归处理左右两部分，然后合并
  return [...quickSort(left), ...mid, ...quickSort(right)];
}

// 使用示例：
// const arr = [3, 6, 8, 10, 1, 2, 1];
// const sorted = quickSort(arr);
// console.log(sorted); // [1, 1, 2, 3, 6, 8, 10]

// 优化版本（原地排序，减少空间复杂度）：
// function quickSortInPlace(arr, left = 0, right = arr.length - 1) {
//   if (left >= right) return;
//   
//   const pivotIndex = partition(arr, left, right);
//   quickSortInPlace(arr, left, pivotIndex - 1);
//   quickSortInPlace(arr, pivotIndex + 1, right);
//   
//   return arr;
// }
// 
// function partition(arr, left, right) {
//   const pivot = arr[right];
//   let i = left;
//   
//   for (let j = left; j < right; j++) {
//     if (arr[j] < pivot) {
//       [arr[i], arr[j]] = [arr[j], arr[i]];
//       i++;
//     }
//   }
//   
//   [arr[i], arr[right]] = [arr[right], arr[i]];
//   return i;
// }

