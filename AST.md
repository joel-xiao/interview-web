# 前端 AST 核心解析（概念+用途+实战+手写）
AST（Abstract Syntax Tree，抽象语法树）是前端**代码编译、语法校验、代码转换**的核心底层，不管是 Babel、ESLint、Prettier 还是 Webpack，核心都是围绕 AST 做操作，下面从基础到实战全维度梳理，贴合前端开发/面试刚需。
## 一、 先搞懂：AST 核心基础
### 1.  什么是 AST
把**源代码字符串**，按照编程语言的语法规则，解析成的**结构化、可操作的树形抽象数据结构**，树中每个节点都对应代码中的一个语法单元（变量、函数、语句、表达式等），无冗余语法细节（如空格、换行）。
举个简单例子：`const a = 1 + 2` 解析成 AST 后，会拆分为「变量声明节点、变量名节点、加法表达式节点、两个字面量节点」，层级清晰可操作。

### 2.  AST 核心执行流程（三步骤）
前端所有基于 AST 的工具（Babel/ESLint），核心都遵循这 3 步流程，缺一不可：
1.  **解析（Parse）**：把源代码字符串 → 分词（词法分析）→ 建树（语法分析），最终生成 AST（核心工具：acorn、espree）；
2.  **转换（Transform）**：遍历 AST 树，对节点进行增删改查（如箭头函数转普通函数、删除 console），生成新的 AST（核心：遍历器+访问者模式）；
3.  **生成（Generate）**：把转换后的新 AST → 还原为源代码字符串，支持格式化、压缩（核心工具：generate）。

### 3.  前端为什么要学 AST
是前端**工程化进阶、框架底层、代码处理**的必备基础，核心应用场景全是高频刚需：
-  语法转换：Babel 把 ES6+ 转 ES5、JSX 转 JS，核心靠 AST 转换；
-  代码校验：ESLint 校验代码规范（如禁止 console、强制驼峰），靠遍历 AST 节点做规则判断；
-  代码格式化：Prettier 格式化代码，解析 AST 后按规则重新生成代码；
-  代码压缩：Terser 压缩代码（删空格、变量名混淆），基于 AST 做优化；
-  自定义工具：如大屏低代码的 Schema 解析、组件按需加载插件、自定义代码转换工具。

## 二、 AST 高频核心应用场景（前端实用）
### 1.  Babel 核心：基于 AST 做语法转换
Babel 是前端最典型的 AST 应用，比如把 `()=>1` 转成 `function(){return 1}`，核心就是「解析→转换→生成」的 AST 操作，日常开发中自定义 Babel 插件，本质就是写 AST 节点转换逻辑。

### 2.  ESLint 核心：基于 AST 做代码校验
ESLint 校验代码时，先把代码解析为 AST，再遍历节点，对照自定义/内置规则做判断，比如「禁止使用 console」规则，就是遍历 AST 中的 `ConsoleStatement` 节点，若存在则抛出错误。

### 3.  工程化工具：自定义代码处理
-  组件按需加载：如 Element Plus 按需加载插件，通过 AST 解析 `import` 语句，把 `import {Button} from 'element-plus'` 转成 `import Button from 'element-plus/es/components/button'`；
-  代码埋点：自动给所有函数添加埋点代码，无需手动写，通过 AST 遍历函数节点，在函数内部插入埋点语句；
-  大屏低代码：解析 Schema 对应的代码片段，或把可视化配置转换为可执行代码，依赖 AST 做语法解析与生成。

### 4.  代码优化与重构
批量修改项目代码（如把所有 `var` 改为 `let/const`）、删除项目中无用代码（Tree-Shaking 底层依赖 AST 静态分析），都靠 AST 高效完成，比全局替换更精准、无遗漏。

## 三、 前端 AST 实战（2 个核心实战，可直接落地）
### 实战 1： 用 Babel 相关库 手动操作 AST（核心入门）
借助 Babel 生态的核心库（`@babel/parser` 解析、`@babel/traverse` 遍历、`@babel/generator` 生成），实现「删除代码中的所有 console」，手把手落地。
1.  安装依赖
```bash
npm install @babel/parser @babel/traverse @babel/generator @babel/types
```
2.  核心代码（删除所有 console 语句）
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
const ast = parser.parse(sourceCode, { sourceType: 'module', plugins: ['jsx'] });

// 3. 转换：遍历 AST，删除 console 节点
traverse(ast, {
  // 匹配所有 调用表达式（console.log/error 都属于 CallExpression）
  CallExpression(path) {
    const node = path.node;
    // 判断是否是 console 相关调用
    if (t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.object, { name: 'console' })) {
      path.remove(); // 删除该节点
    }
  }
});

// 4. 生成：新 AST → 处理后的源代码
const { code } = generator(ast, { compact: false });
console.log(code);
// 输出结果：无任何 console 语句，代码干净
```

### 实战 2： 手写简易 AST 解析器（理解核心原理，面试高频）
不用第三方库，手写简易解析器，解析 `const a = 1 + 2` 这类简单表达式，吃透「词法分析→语法分析」核心步骤。
####  步骤 1： 词法分析（分词）：把字符串拆分为最小语法单元（Token）
```javascript
// 词法分析：source → tokens 数组
function tokenizer(source) {
  let tokens = [];
  let current = 0;
  while (current < source.length) {
    let char = source[current];
    // 匹配空格：跳过
    if (/\s/.test(char)) { current++; continue; }
    // 匹配关键字/变量名（const、a 等）
    if (/[a-zA-Z]/.test(char)) {
      let name = '';
      while (/[a-zA-Z]/.test(char)) { name += char; char = source[++current]; }
      tokens.push({ type: name === 'const' ? 'Keyword' : 'Identifier', value: name });
      continue;
    }
    // 匹配赋值符号 =
    if (char === '=') { tokens.push({ type: 'Assign', value: '=' }); current++; continue; }
    // 匹配运算符 +
    if (char === '+') { tokens.push({ type: 'Operator', value: '+' }); current++; continue; }
    // 匹配数字
    if (/\d/.test(char)) {
      let num = '';
      while (/\d/.test(char)) { num += char; char = source[++current]; }
      tokens.push({ type: 'Number', value: num });
      continue;
    }
    current++;
  }
  return tokens;
}
// 测试：tokenizer('const a = 1 + 2') → 得到清晰的 Token 数组
```
####  步骤 2： 语法分析（建树）：把 Token 数组 → 简易 AST
```javascript
// 语法分析：tokens → AST
function parser(tokens) {
  let current = 0;
  function walk() {
    let token = tokens[current];
    // 匹配关键字 const
    if (token.type === 'Keyword' && token.value === 'const') {
      current++;
      const node = {
        type: 'VariableDeclaration', // 变量声明节点
        kind: 'const',
        declarations: [{
          id: { type: 'Identifier', name: tokens[current++].value }, // 变量名 a
          init: walk() // 赋值表达式：1 + 2
        }]
      };
      return node;
    }
    // 匹配数字
    if (token.type === 'Number') {
      current++;
      return { type: 'NumericLiteral', value: Number(token.value) };
    }
    // 匹配加法表达式
    if (token.type === 'Operator' && token.value === '+') {
      current++;
      return {
        type: 'BinaryExpression', // 二元表达式节点
        operator: '+',
        left: walk(), // 左值 1
        right: walk() // 右值 2
      };
    }
  }
  return { type: 'Program', body: [walk()] };
}
// 组合使用：source → tokens → AST
const source = 'const a = 1 + 2';
const tokens = tokenizer(source);
const ast = parser(tokens);
console.log(JSON.stringify(ast, null, 2)); // 得到标准结构的 AST
```

## 四、 AST 高频面试考点+手写题
### 1.  高频面试考点（必背）
1.  AST 核心定义与执行流程（解析→转换→生成）；
2.  Babel 的工作原理（基于 AST 的三步骤，插件的作用是转换 AST 节点）；
3.  ESLint 校验原理（AST 遍历+规则匹配）；
4.  什么是访问者模式（AST 遍历的核心模式，`@babel/traverse` 的核心实现）；
5.  Tree-Shaking 与 AST 的关系（基于 ESM 静态分析 AST，剔除无用代码节点）。

### 2.  AST 高频手写题（面试常考）
1.  手写简易词法分析/语法分析（解析简单表达式，如上文实战 2）；
2.  用 Babel 插件实现「箭头函数转普通函数」（AST 核心转换题）；
3.  用 Babel 插件实现「禁止使用 var 声明变量」（ESLint 规则类手写题）；
4.  实现「import 按需加载转换」（工程化高频手写题）。

## 五、 核心总结
1.  AST 是前端工程化的**底层基石**，所有代码处理类工具都依赖它；
2.  核心流程是**解析→转换→生成**，核心思想是「树形结构遍历与节点操作」；
3.  实战核心是掌握 Babel 生态工具，能自定义 AST 转换逻辑（如删 console、转语法）；
4.  面试重点是原理+实战，能说清流程、讲透应用，能手写简易解析器或 Babel 插件。

需要我帮你手写一个**Babel 插件（箭头函数转普通函数）**，带详细注释和测试案例吗？
