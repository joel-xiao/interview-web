# 前端 AST 核心解析

> AST（抽象语法树）概念、用途、实战、手写全解析

---

## 📚 目录

- [一、AST 核心基础](#一ast-核心基础)
- [二、AST 应用场景](#二ast-应用场景)
- [三、AST 实战](#三ast-实战)
- [四、面试考点](#四面试考点)

---

## 一、AST 核心基础

### 1.1 什么是 AST

**AST**（Abstract Syntax Tree，抽象语法树）是把**源代码字符串**，按照编程语言的语法规则，解析成的**结构化、可操作的树形抽象数据结构**。

**特点**：
- 树中每个节点对应代码中的一个语法单元（变量、函数、语句、表达式等）
- 无冗余语法细节（如空格、换行）
- 可以方便地进行增删改查操作

**示例**：

```js
// 源代码
const a = 1 + 2;

// AST 结构（简化）
{
  type: 'VariableDeclaration',
  declarations: [{
    id: { type: 'Identifier', name: 'a' },
    init: {
      type: 'BinaryExpression',
      operator: '+',
      left: { type: 'NumericLiteral', value: 1 },
      right: { type: 'NumericLiteral', value: 2 }
    }
  }]
}
```

---

### 1.2 AST 核心执行流程

前端所有基于 AST 的工具（Babel/ESLint），核心都遵循这 3 步流程：

```
源代码 → 解析（Parse） → AST → 转换（Transform） → 新AST → 生成（Generate） → 新代码
```

#### 步骤 1：解析（Parse）

**过程**：
1. **词法分析**：把源代码字符串拆分为 Token（关键字、标识符、运算符等）
2. **语法分析**：把 Token 数组构建成 AST 树

**工具**：
- `acorn`：JavaScript 解析器
- `espree`：ESLint 使用的解析器
- `@babel/parser`：Babel 解析器

#### 步骤 2：转换（Transform）

**过程**：
- 遍历 AST 树
- 对节点进行增删改查
- 生成新的 AST

**核心**：
- 遍历器（Traverser）
- 访问者模式（Visitor Pattern）

#### 步骤 3：生成（Generate）

**过程**：
- 把转换后的新 AST
- 还原为源代码字符串
- 支持格式化、压缩

**工具**：
- `@babel/generator`：Babel 代码生成器

---

### 1.3 为什么学 AST

AST 是前端**工程化进阶、框架底层、代码处理**的必备基础：

| 应用场景 | 工具 | 说明 |
|---------|------|------|
| **语法转换** | Babel | ES6+ 转 ES5、JSX 转 JS |
| **代码校验** | ESLint | 代码规范检查 |
| **代码格式化** | Prettier | 代码格式化 |
| **代码压缩** | Terser | 代码压缩、混淆 |
| **自定义工具** | 自定义插件 | 组件按需加载、代码埋点 |

---

## 二、AST 应用场景

### 2.1 Babel：语法转换

**核心**：基于 AST 做语法转换

**示例**：
```js
// 输入：箭头函数
const fn = () => 1;

// AST 转换
// 输出：普通函数
const fn = function() { return 1; };
```

**实现**：
- 解析箭头函数 AST 节点
- 转换为普通函数节点
- 生成新代码

---

### 2.2 ESLint：代码校验

**核心**：基于 AST 做代码校验

**示例**：
```js
// 规则：禁止使用 console
console.log('test'); // ❌ ESLint 报错

// 实现原理：
// 1. 解析代码为 AST
// 2. 遍历 AST，查找 ConsoleStatement 节点
// 3. 发现 console 调用，抛出错误
```

---

### 2.3 工程化工具

#### 组件按需加载

**场景**：Element Plus 按需加载插件

```js
// 输入
import { Button, Input } from 'element-plus';

// AST 转换
// 输出
import Button from 'element-plus/es/components/button';
import Input from 'element-plus/es/components/input';
```

**实现**：
- 解析 `import` 语句
- 拆分导入的组件
- 生成多个独立的 `import` 语句

#### 代码埋点

**场景**：自动给所有函数添加埋点

```js
// 输入
function fn() {
  return 'test';
}

// AST 转换
// 输出
function fn() {
  track('fn'); // 自动插入埋点
  return 'test';
}
```

**实现**：
- 遍历函数节点
- 在函数体开头插入埋点代码

---

### 2.4 代码优化与重构

**场景**：
- 批量修改代码（`var` → `let/const`）
- 删除无用代码（Tree-Shaking）
- 代码重构

**优势**：
- 比全局替换更精准
- 无遗漏
- 保持代码结构

---

## 三、AST 实战

### 3.1 实战 1：删除所有 console

**目标**：删除代码中的所有 `console` 语句

**工具**：Babel 生态库

#### 安装依赖

```bash
npm install @babel/parser @babel/traverse @babel/generator @babel/types
```

#### 核心代码

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

// 1. 待处理的源代码
const sourceCode = `
const a = 10;
console.log(a);
function fn() {
  console.error('错误信息');
  return a + 20;
}
`;

// 2. 解析：源代码 → AST
const ast = parser.parse(sourceCode, { 
  sourceType: 'module', 
  plugins: ['jsx'] 
});

// 3. 转换：遍历 AST，删除 console 节点
traverse(ast, {
  // 匹配所有调用表达式（console.log/error 都属于 CallExpression）
  CallExpression(path) {
    const node = path.node;
    // 判断是否是 console 相关调用
    if (
      t.isMemberExpression(node.callee) && 
      t.isIdentifier(node.callee.object, { name: 'console' })
    ) {
      path.remove(); // 删除该节点
    }
  }
});

// 4. 生成：新 AST → 处理后的源代码
const { code } = generator(ast, { compact: false });
console.log(code);
// 输出：无任何 console 语句
```

---

### 3.2 实战 2：手写简易 AST 解析器

**目标**：手写简易解析器，解析 `const a = 1 + 2`

#### 步骤 1：词法分析（Tokenizer）

**作用**：把字符串拆分为最小语法单元（Token）

```javascript
function tokenizer(source) {
  let tokens = [];
  let current = 0;
  
  while (current < source.length) {
    let char = source[current];
    
    // 匹配空格：跳过
    if (/\s/.test(char)) { 
      current++; 
      continue; 
    }
    
    // 匹配关键字/变量名（const、a 等）
    if (/[a-zA-Z]/.test(char)) {
      let name = '';
      while (/[a-zA-Z]/.test(char)) { 
        name += char; 
        char = source[++current]; 
      }
      tokens.push({ 
        type: name === 'const' ? 'Keyword' : 'Identifier', 
        value: name 
      });
      continue;
    }
    
    // 匹配赋值符号 =
    if (char === '=') { 
      tokens.push({ type: 'Assign', value: '=' }); 
      current++; 
      continue; 
    }
    
    // 匹配运算符 +
    if (char === '+') { 
      tokens.push({ type: 'Operator', value: '+' }); 
      current++; 
      continue; 
    }
    
    // 匹配数字
    if (/\d/.test(char)) {
      let num = '';
      while (/\d/.test(char)) { 
        num += char; 
        char = source[++current]; 
      }
      tokens.push({ type: 'Number', value: num });
      continue;
    }
    
    current++;
  }
  
  return tokens;
}

// 测试
const tokens = tokenizer('const a = 1 + 2');
console.log(tokens);
// [
//   { type: 'Keyword', value: 'const' },
//   { type: 'Identifier', value: 'a' },
//   { type: 'Assign', value: '=' },
//   { type: 'Number', value: '1' },
//   { type: 'Operator', value: '+' },
//   { type: 'Number', value: '2' }
// ]
```

#### 步骤 2：语法分析（Parser）

**作用**：把 Token 数组构建成 AST

```javascript
function parser(tokens) {
  let current = 0;
  
  function walk() {
    let token = tokens[current];
    
    // 匹配关键字 const
    if (token.type === 'Keyword' && token.value === 'const') {
      current++;
      const node = {
        type: 'VariableDeclaration',
        kind: 'const',
        declarations: [{
          id: { 
            type: 'Identifier', 
            name: tokens[current++].value 
          },
          init: walk() // 赋值表达式：1 + 2
        }]
      };
      return node;
    }
    
    // 匹配数字
    if (token.type === 'Number') {
      current++;
      return { 
        type: 'NumericLiteral', 
        value: Number(token.value) 
      };
    }
    
    // 匹配加法表达式
    if (token.type === 'Operator' && token.value === '+') {
      current++;
      return {
        type: 'BinaryExpression',
        operator: '+',
        left: walk(), // 左值 1
        right: walk() // 右值 2
      };
    }
  }
  
  return { type: 'Program', body: [walk()] };
}

// 组合使用
const source = 'const a = 1 + 2';
const tokens = tokenizer(source);
const ast = parser(tokens);
console.log(JSON.stringify(ast, null, 2));
```

---

## 四、面试考点

### 4.1 高频面试考点

1. **AST 核心定义与执行流程**
   - 解析 → 转换 → 生成

2. **Babel 的工作原理**
   - 基于 AST 的三步骤
   - 插件的作用是转换 AST 节点

3. **ESLint 校验原理**
   - AST 遍历 + 规则匹配

4. **访问者模式**
   - AST 遍历的核心模式
   - `@babel/traverse` 的核心实现

5. **Tree-Shaking 与 AST**
   - 基于 ESM 静态分析 AST
   - 剔除无用代码节点

---

### 4.2 高频手写题

1. **手写简易词法分析/语法分析**
   - 解析简单表达式（如 `const a = 1 + 2`）

2. **Babel 插件：箭头函数转普通函数**
   - AST 核心转换题

3. **Babel 插件：禁止使用 var**
   - ESLint 规则类手写题

4. **实现 import 按需加载转换**
   - 工程化高频手写题

---

## 🎯 核心总结

1. **AST 是前端工程化的底层基石**
   - 所有代码处理类工具都依赖它

2. **核心流程：解析→转换→生成**
   - 核心思想是「树形结构遍历与节点操作」

3. **实战核心**
   - 掌握 Babel 生态工具
   - 能自定义 AST 转换逻辑

4. **面试重点**
   - 原理 + 实战
   - 能说清流程、讲透应用
   - 能手写简易解析器或 Babel 插件

---

## 📖 相关资源

- [AST Explorer](https://astexplorer.net/) - 在线 AST 可视化工具
- [Babel 官方文档](https://babeljs.io/docs/en/)
- [ESLint 官方文档](https://eslint.org/)

---

**相关文件**：
- [前端架构.md](./前端架构.md) - 前端架构设计
