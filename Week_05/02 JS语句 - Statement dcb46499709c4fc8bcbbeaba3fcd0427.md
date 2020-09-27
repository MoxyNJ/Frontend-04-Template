# 02. JS语句 - Statement

# Grammer

- 简单语句
- 组合语句
- 声明

# Runtime

- Completion Record 完成记录
- Lexical Environment

# 一、Completion Record

---

[[type]]：normal, break, continue, return, or throw 

[[value]]：基本类型

[[target]]：label（break和continue 会有）

# 二、简单语句

---

- ExpressionStatement 表达式语句
- EmptyStatement 空语句，用处不大。
- DebuggerStatement 触发Debugger断点。
- ThrowStatement 控制语句之一：抛出异常
- ContinueStatement 控制语句之一：Continue结束循环
- BreakStatement 控制语句之一：Break结束循环
- ReturnStatement 控制语句之一：Return函数中的返回值

# 三、组合语句

---

多用于控制简单语句的执行顺序。

- BlockStatement { 花括号中的语句 }
- IfStatement If分支结构，条件语句
- SwitchStatement 多分支结构，不建议使用，不如If...else
- IterationStatement 循环系列(while, do-while, for, For await)
- WithStatement 不常用，通过with打开一个对象到当前作用域。
- LabelledStatement 配合IterationStatement语句使用，令break, continue 跳出循环到指定位置。
- TryStatement 三段结构：try，catch，Finally

## 1. block

![02%20JS%E8%AF%AD%E5%8F%A5%20-%20Statement%20dcb46499709c4fc8bcbbeaba3fcd0427/Untitled.png](02%20JS%E8%AF%AD%E5%8F%A5%20-%20Statement%20dcb46499709c4fc8bcbbeaba3fcd0427/Untitled.png)

### 2. Iteration

![02%20JS%E8%AF%AD%E5%8F%A5%20-%20Statement%20dcb46499709c4fc8bcbbeaba3fcd0427/Untitled%201.png](02%20JS%E8%AF%AD%E5%8F%A5%20-%20Statement%20dcb46499709c4fc8bcbbeaba3fcd0427/Untitled%201.png)

### 3. break continue

![02%20JS%E8%AF%AD%E5%8F%A5%20-%20Statement%20dcb46499709c4fc8bcbbeaba3fcd0427/Untitled%202.png](02%20JS%E8%AF%AD%E5%8F%A5%20-%20Statement%20dcb46499709c4fc8bcbbeaba3fcd0427/Untitled%202.png)

### 4. try

![02%20JS%E8%AF%AD%E5%8F%A5%20-%20Statement%20dcb46499709c4fc8bcbbeaba3fcd0427/Untitled%203.png](02%20JS%E8%AF%AD%E5%8F%A5%20-%20Statement%20dcb46499709c4fc8bcbbeaba3fcd0427/Untitled%203.png)

- 即使在try中执行了return，那finally中的代码也依然会执行。
- Java中，如果`return` 和 `finally` 对同一个变量操作，那么结果以`return` 为准。Js中不清楚。

    ```jsx
    try {
    	...
    	return x = 1;
    } catch(x){
    	...
    } finally {
    	...
    	x++;
    }

    // 最终 x=1
    ```

# 四、声明

---

- FunctionDeclaration：func 普通函数，函数声明的四种形态之一。
- GeneratorDeclaration：func* 产生器，函数声明的四种形态之一。
- AsyncFunctionDeclaration：async func异步函数，函数声明的四种形态之一。
- AsyncGeneratorDeclaration：async func* 异步产生器，函数声明的四种形态之一。
- VariableStatement：变量声明（可以声明+计算）
- ClassDeclaration：class
- LexicalDeclaration：const，let

### 老声明

- function
- function *
- async function
- async function *
- var

### ES6+ 声明

- class
- const
- let

增加了预处理能力，尽量使用新声明。

## 预处理（pre-process）

- 所有的声明都会有预处理机制。
- const声明，在声明前使用，会报错。

预处理：会把声明语句提前处理掉，本例中，a变量声明，在return语句之后。但是因为有预处理，会提前执行a变量的声明。最终，变量a在函数内作用域中声明，对全局变量a没有赋值，最终输出2。

```jsx
var a = 2;
void function (){
	a = 1;
	return;
	var a;
}();
console.log(a);  // 2
```

- const也是有预处理机制的。此处 const a，报报错（因为const在初始化时，必须赋值）。如果用try-catch捕获错误后，会发现最终的打印结构也是2，表明在函数内部，`const` 被预处理了，也声明了一个局部变量。

```jsx
var a = 2;
void function (){
	a = 1;
	return;
	const a;  // var 换成 const a
}();
console.log(a);  // 2

```

## 作用域

- 作用域链：ES3时代的老概念，需要更新。