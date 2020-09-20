学习笔记

# 一、Js语言通识

# 1. 泛用语言分类方法

------

1. 语言按语法分类

   1. 非形式语言

      - 中文，英文

   2. 形式语言（

      乔姆斯基谱系

      ）

      - [乔姆斯基谱系](https://zh.wikipedia.org/wiki/乔姆斯基谱系)：是计算机科学中刻画形式文法表达能力的一个分类谱系，是由诺姆·乔姆斯基于 1956 年提出的。它包括四个层次：
      - 0- 型文法（无限制文法或短语结构文法）包括所有的文法。
      - 1- 型文法（上下文相关文法）生成上下文相关语言。
      - 2- 型文法（上下文无关文法）生成上下文无关语言。
      - 3- 型文法（正规文法）生成正则语言。

# 2-3. 产生式（BNF）

------

有一套语法结构：

- <语法结构名>

  - 基础结构：终结符
  - 复合结构：非终结符

- 引号+中间的字符，表示终结符

- 可以有括号

- - 表示重复多次；｜表示或；+表示至少一次

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e35ff2d4-e80e-4394-b78e-02a17bf282bc/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e35ff2d4-e80e-4394-b78e-02a17bf282bc/Untitled.png)

## 参考名词：

- 产生式： 在计算机中指 Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（Backus-Naur Form，BNF）的语句
- [巴科斯诺尔范式](https://zh.wikipedia.org/wiki/巴科斯范式)：即巴科斯范式（英语：Backus Normal Form，缩写为 BNF）是一种用于表示上下文无关文法的语言，上下文无关文法描述了一类形式语言。它是由约翰·巴科斯（John Backus）和彼得·诺尔（Peter Naur）首先引入的用来描述计算机语言语法的符号集。
- 终结符： 最终在代码中出现的字符（ https://zh.wikipedia.org/wiki/ 終結符與非終結符)

# 4. 现代语言的分类

------

语言的分类：

- 按语法分类：乔姆斯基分类
- 按用途分类：
  - 数据描述语言：JSON、HTML、XAML、SQL、CSS
  - 编程语言：C、C++、Java、C#、Python、Ruby、Perl、Lisp、T-SQL、Clojure、Haskell、JavaScript
- 按表达方式分类
  - 声明式语言：JSON、HTML、XAML、SQL、CSS、Lisp、Clojure、Haskell
  - 命令型语言：C、C++、Java、C#、Python、Ruby、Perl、JavaScript

# 5. 编程语言的性质

------

### 1. 图灵完备性

- 命令式——图灵机
  - goto
  - if 和 while
- 声明式——lambda
  - 递归

### 2. 动态和静态

- 动态：
  - 在用户的设备上，或在线服务器上
  - 产品实际运行的时候（运行时）
  - Runtime
- 静态：
  - 在程序员的设备上
  - 产品开发的时候（开发时）
  - 静态类型检查，在编写代码的时候就可以获得检查。
  - Compiletime

Js是解释型语言，实际上是没有Compiletime的。

### 3. 类型系统

- 动态类型系统：在用户的机器上，用户的内存上可以找到的类型。
- 静态类型系统：只在程序员编写代码的时候，保留的类型信息。

区分：类型保存在谁的机器上：

- JavaScript动态类型系统。
- C++是静态类型系统。

Java的反射机制：半动态半静态的系统。静态类型，在运行时，可以通过反射获取到。

- 强类型：不会默认发生类型转换
- 弱类型：会默认发生类型转换。
  - String + Number，会自动把Number转换成String，然后字符串相加。
  - String == Boolean，会自动把Boolean转换成Number，再和String比较。

区分：类型转换是否会自动发生。

复合类型

- 结构体
- 函数签名：参数类型 + 返回值类型

子类型：C++

泛型：Java中就有。

- 泛型类
- 泛型函数
- 逆变/协变

在Java中复习。

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/effe389a-5c63-47ef-876a-23ee0162db28/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/effe389a-5c63-47ef-876a-23ee0162db28/Untitled.png)

# 6. 一般命令式编程语言

------

1. Atom 原子：
   - Identifier 标识符/变量
   - Literal 数字字面量/字符串字面量
2. Expression 表达式：
   - Atom 原子
   - Operator 逻辑运算：四则运算、按位与、比较运算、与或非、
   - Punctuator 标点符号
3. Statement 语句：if、while、for
   - Expression 表达式
   - KeyWord 关键字
   - Punctuator 标点符号
4. Structure 结构化：
   - Function 函数
   - Class 类
   - Process 进程
   - Namespace 命名空间
   - ....
5. Program 模块化：
   - Program
   - Module
   - Package
   - Library

JavaScript中有program实际执行的代码、module准备好被复用的模块。

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7e6bd55b-be8a-4100-a755-1c0e45112415/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7e6bd55b-be8a-4100-a755-1c0e45112415/Untitled.png)

## **参考名词：**

- [图灵完备性](https://zh.wikipedia.org/wiki/圖靈完備性)：在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟单带图灵机，那么它是图灵完全的。这个词源于引入图灵机概念的数学家艾伦·图灵。虽然图灵机会受到储存能力的物理限制，图灵完全性通常指“具有无限存储能力的通用物理机器或编程语言”。
- [图灵机（Turing machine）](https://zh.wikipedia.org/wiki/图灵机)：又称确定型图灵机，是英国数学家艾伦·图灵于 1936 年提出的一种将人的计算行为抽象掉的数学逻辑机，其更抽象的意义为一种计算模型，可以看作等价于任何有限逻辑数学过程的终极强大逻辑机器。
- 静态和动态语言： https://www.cnblogs.com/raind/p/8551791.html
- 强类型： 无隐式转换
- 弱类型： 有隐式转换
- 协变与逆变： https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html



# 二、Js类型

# 综述

JavaScript的最小单位：Atom原子

- Grammer 语法
  - Literal 直接量
  - Variable
  - Keywords
  - Whitespace
  - Line Terminator
- Runtime 运行时
  - Types
  - Execution Context
- Types(7)
  - 常见：Number、String、Boolean、Object、Null
  - 少用：Undefined、Symbol

# Number

IEEE 754 定义：Double Float 双精度浮点类型。

浮点数：有效位数是浮动的。范围越大，精度越差，范围越小，精度越好；换句话说：浮点数越大，则可以表示的数越稀疏。

- Sign(1)：正负号。
- Exponent(11)：指数，浮点数表示的范围。
- Fraction(52)：有效位数。决定浮点数表示的精度。

### 语法：

十进制表示：

- 0

- 1. 

- .2

- 1e3 == 1 * 10^3 === 1000

- ```
  0.toString()
  ```

   会出现问题：. 点会被判定为小数点，导致toString()执行失败；

  - 改正为： `0 .toString();` 多一个空格. 点被识别为运算符

二进制表示：`0b111`

八进制表示：`0o10`

十六进制表示：`0xFF`

# String

- Character 字符
- Code Point
- Encoding

运行时：Encoding

- UTF-8：兼容ASCII，一个字节默认8bit。

- UTF-16：一个字节默认16bit。ASCII字节，会在前面补8bit的0。

  ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2cb2d55f-223a-4db2-815d-57b8769732a5/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2cb2d55f-223a-4db2-815d-57b8769732a5/Untitled.png)

- 汉字“一”的UTF-8，占用3个8bit，第一个前四控制位：有几个bit组合，就有几个1；图中有3个bit组合，则有3个1；后面两个都有两位控制位：10 固定表示跟在1110后面的子字节段。

语法：Grammer

反引号字符串：`abc` 可以在字符串任意添加内容。回车都可以

# Null & Undefined

undefined 是一个全局变量，不安全。所以用`void 0`。利用void 进行一次运算，得到`undefined`

- void + 任何字符，都得到 undefined，只是 void 0 是通识。

null 是一个关键字。

# 三、Js对象

# 对象的基础知识

任何对象都是唯一的，这和它本身的状态无关。

即使完全一致的两个对象，也并不相等。

- 用状态来描述对象，状态的改变就是行为。

对象的组成要素：

- identifier：唯一性表示
- state：状态
- behavior：行为

在设计对象的时候，不应该收到语言描述的干扰。

在设计对象的状态和行为时，应遵循“行为改变状态”的原则。

举例：狗咬人，设计一个这样的动作类。

- 不应该设计一个狗类，然后添加一个方法：咬人。因为咬人这个行为，改变状态的物体是人，而不是狗。
- 应该设计成人类，然后添加一个“受伤”方法。视角不应该关注是谁咬的，而是应该关注这个咬的结果是谁的状态发生改变。

JavaScript运行时，原生对象的描述方式非常简单，只需要关注

- 原型：[[ Prototype ]]
- 属性：Property

原型链：获取属性的行为，沿着原型链一路向上找。先在自己的属性中找，找不到然后去原型对象中找；再找不到，就去原型对象的原型对象中找，直到原型指向null对象。

Javascript是一个`key/value` 对：

- key：String 或 Symbol。
  - String 定义属性，只要被认别，一定会有方法访问（字符串相同就能访问）。
  - Symbol定义属性，内存创建后，只能通过这个Symbol变量去引用，没办法构造两个一模一样的Symbol，保证了数据的安全性。两个 Symbol即使名字一样（只是代号一样），实质确实完全不一样的。只要不把编写的Symbol传给别人，就无法访问。
- value：
  - Data Property 数据属性：用于描述状态。（也可以设置一个函数，表示行为）
  - Accessor Property 访问器属性：用于描述行为。

### Object API / Grammer

- 基本对象机制：{} [] Object.defineProperty
  - 通过语法创建对象、访问属性、定义新的属性、改变属性特征值
- 基于原型的对象方法：Object.create / Object.setPrototypeOf() / Object.getPrototypeOf
  - 通过Object.create()，在指定原型下创建对象。修改、获取对象原型
- 基于类的对象方法：new / class / extends
  - 在访问时会转换成基于原型。
- 历史包袱：new / function / prototype
  - ES3以前，现在几乎不会这样用了。用前三种。

`[[带双方括号]]` 在JavaScript中无法调用，但是在JavaScript引擎的C++ / C 是可以任意调用的。

`[[带双方括号]]` 在JavaScript语言里面访问不到，但是在运行时确实存在。

## 特殊对象

JavaScript标准里面具有特殊行为的对象：

- 用属性 + 原型 无法描述对象的行为。

### Function Object 函数对象

区分：带`[[call]]` 方法的对象。

我们用类型f()这样的语法，把对象当作函数调用，会访问`[[call]]` 这个行为。如果对应的对象没有`[[call]]`行为，就会报错。说明他在定义时，不是一个Function Object。

### Array Object

```
[[length]]
```

### Host Object

根据宿主环境定义的对象