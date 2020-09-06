# 1. 制作TicTacToe游戏

- `cell.addEventListener("click", () => move(i,j))`

  这个函数为每一个`cell`引用指向的对象，都设置了一个监听。所以棋盘中其实有9个监听。分别对应了9个`div`元素。

  所以，设置监听的时间点，安排在画棋盘的时候。这时会遍历每一个`div`元素。刚好可以分别为每一个元素设置监听。

- show()函数。目的是刷新棋子界面，为每个div元素设置监听。

- move()函数。目的是实现落子 + 交替落子

- check()函数。目的是在落子后，判断是否获胜。

- clone()函数。克隆一个棋盘pattern，用来模拟落子，防止破坏原本的棋盘。

  ```jsx
  // 利用JSON中字符串与对象来回转换，实现克隆。
  function clone(pattern){
          return JSON.parse(JSON.stringify(pattern));
      }
  ```

- bestChoice()函数。我方落子时，给出一个最佳落子位置，对这个落子结果进行判断：

  - 1 我方胜；0 平局；-1 对方胜。

  - 思路：

    1. 先用willWin()函数，判断是否有落子后，直接胜利的点。如果有返回 `[1, 点]`；否则执行 2。

    2. 主动权交给对方，我方先落子一枚（穷举每一个棋盘空位）。然后让对方落子，判断对方的

       ```
       bestChoice()
       ```

       ：

       1. 先用willWin()函数，判断是否有落子后，直接胜利的点。如果有返回 `[1, 点]`；否则执行 2。
       2. 主动权再次转换，……，一直这样递归下去。

    3. 穷举所有棋盘完毕后，对递归回来的结果进行判断：如果对方有最佳落子位置，bestChoice递归结果返回 “`1`”。则证明对方胜，返回 `-2`。否则执行4.

    4. 说明此时对面也没有获胜的机会，则证明此时是和棋，返回 `[ 0 , null]`。

  - 理解：

    1. 先研究策略：

       1. 我方要先找`willWin()`的点。如果找到了，就返回`我方胜:1`。

       2. 如果找不到这个点，则证明目前我方无法获胜。退而求其次，找对方最差可能性，即对我方最好的情况（

          ```
          我方胜:1/平局:0
          ```

          ）。则尝试下一子，然后执行对方的

          ```
          bestChoice()
          ```

          ，分析返回的结果：

          - 返回`1`，证明我方必输。直接返回`我方败:-1`；
          - 返回`0`，证明平局。直接返回`平局:0`；
          - 返回`-1`，证明我方胜。直接返回`我方胜:1`。

    2. 先定义好

       ```
       bestChoice()
       ```

       的传入参数和返回结果：

       1. 传入参数2：`pattern`当前要分析的棋盘，`color`即将落子的一方。
       2. 返回结果：具体的落子点 +  我方胜/平局/对方胜。

    3. 不用管递归的过程，直接关注结果：

       1. 我方的视角：先判断是否我直接会赢。

       2. 如果赢不了，就穷举下一子，然后利用

          ```
          bestChoice()
          ```

          判断对方的结果，分析对方结果，然后在这堆结果中，找到对方分数最低的，即最对我方有利的结果：

          1. 输出这个结果。
          2. 如果找不到结果，则证明平局，返回一个0。

## 琐碎知识点：

1. 函数加括号，不加括号的区别：
   1. 函数加括号：`doSomething()`，相当于调用函数。`doSomething()`代码执行后，实际上相当于获得来一个函数的返回值(`return`)；如果这个函数没有返回值，则是执行了函数体中的代码。 总结：`doSomething()`，会先执行函数中的代码，然后返回return数值。
   2. 函数不加括号：`doSomething`，代表**引用**，**这个引用保存的值是函数的地址**。是一个指向函数地址的指针。在具体的代码中，使用了`doSomething`，则没有执行这个函数(调用函数)，而是把函数的地址传到了此处。 总结：`doSomething`，会传递函数的地址，是一个传参的过程。函数此时尚未执行，需要被调用。
   3. `doSomeThing()`：让函数先执行。执行点：为了得到函数的结果(return)。
   4. `doSomeThing`：为了传入函数。执行点：要得到函数本体，而不是函数的结果。

## 自己制作时候的问题：

1. 经常把  `===` 和 `=` 搞混。`===` 是比较运算符、`=`是赋值运算符。
2. 关键字、变量、函数名称等，经常写错个别字母，很难发现错误。
3. 驼峰命名：WillWin总是写错成Willwin，找不到出错原因。
4. 参数传递：上一个函数的参数是`[i, j]`，下一个就变成`[j,i]`了。老师反着写，自己最好也跟着反着写，不然就每一次都自己改正过来。

## 对比老师代码发现的问题：

1. 条件判断时，要具体到最小。

   - 在判断是否三个字连成一条直线的时候，没有把条件看的更小。自己分析了所有可能的情况。但是，如果是⭕️落子，那只需要判断⭕️是否会赢即可，不存在❌会赢的情况。这样需要判断的情况，就会少一半。而我自己是把⭕️和❌的成立条件全部判断了。
   - 所以，`check()`函数只需要返回true或false，明确是否获胜即可。当前color表示的就是刚刚落子的一方。如果check()返回true，表明已经有一方获胜。此时只需要判断color是⭕️还是❌，即可判断出获胜的一方。

2. 自己总是和老师不一样的原因：

   1. 驼峰单词，不区分大小写；
      - getElementsByClassName()中，Class的c没有大写。
   2. 对函数方法不熟练；
      - classList()，我写成了document.classList()，函数张冠李戴。
   3. patternClone本身的作用是temp，结果在后面修改数值的时候写成了pattern，修改了原始数据。一直没发现这个错误。

3. 在`5.html`一直敲不对代码的原因：

   应该是第一个代码，结果我写成了第二个。

   `return JSON.parse(JSON.stringify(pattern));`

   `return Object.create(pattern);`

   1. 没有认真听一下老师是怎么讲的：老师在后面的 `6.html` 才换了代码，但是我因为听的有点跳跃，就把后面的代码写到前面了。
   2. 没有认真比对所有代码，不仅要每个单词看清，还要把每一句函数都尝试一下。这样`clone()` 的问题就找到了。
   3. 从逻辑上分析，找到中间的逻辑问题。从而确定哪里出错了（最后就是这么分析出来的）。

## 零碎知识点：

- innerHTML和innerText的区别：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dab22478-8510-4c9a-a817-ec05e05adfe8/1219486-20170817160212381-718115701.gif](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dab22478-8510-4c9a-a817-ec05e05adfe8/1219486-20170817160212381-718115701.gif)

### 坑：

1. 一下克隆方法的区别：

   `return JSON.parse(JSON.stringify(pattern));`

   `return Object.create(pattern);`

```jsx
let obj = Object.create(pattern);
console.log(obj);
console.log('========');
console.log(pattern);

// __proto__ 原形链？
```

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e9263a67-1ef4-43be-8698-77ea9329ab7e/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e9263a67-1ef4-43be-8698-77ea9329ab7e/Untitled.png)

- 第一个发现的区别：
  - `Object.create()`方法仅适用于一维数组。老师讲代码，最开始使用的二维数组，所以只能用`JSON.stringify`实现。后面改成了一维数组，增加了遍历速度，此时可以用`Object.create()`



# 2. 异步编程

# 引子

- Javascript是单线程模型，不支持多线程操作。所以，Js设计出了事件循环机制。可以把不需要CPU处理的，等待IO操作的任务挂起。执行其他任务，等IO操作完毕，再执行挂起的任务。
- 事件循环：一旦主线程上的任务执行完毕，就会周期性检查被挂起的线程是否满足执行条件。如果有满足条件的，会用回调函数重新进入主线程的任务队列中。

### 同步任务 synchronous

没有被引擎挂起、在主线程上排队执行的任务。任务执行需要一前一后的顺序，依次执行。

### 异步任务 asynchronous

不在主线程上排队的任务。该任务被挂起，放在挂起队列中。只有该任务具备条件（如，IO等待完毕）才会重新进入主线程排队。

- 例：Ajax 操作，由开发者决定是同步处理还是异步处理。
  - 如果是同步任务，主线程就等着 Ajax 操作返回结果，再往下执行
  - 如果是异步任务，主线程在发出 Ajax 请求以后，直接往下执行，等 Ajax 操作有了结果，主线程再执行对应的回调函数。

# 课程

利用异步编程，实现红绿灯🚥效果。

要求：绿灯10秒钟，黄灯2秒钟，红灯5秒钟，无限循环。

## 1. callback

- 回调式：层层嵌套，callback-hell嵌套地狱

  ```jsx
  function go(){
          green();
          setTimeout(function(){
              yellow();
              setTimeout(function(){
                  red();
                  setTimeout(function(){
                      go();
                  }, 5000);
              }, 2000);
          }, 10000);
      }
  ```

## 2. Promise

- 链式：利用Promise对象。
- 所有异步任务都返回一个 Promise 实例。Promise 实例有一个then方法，用来指定下一步的回调函数。
- 由层层嵌套的形式，改成了用then的链式

```jsx
// f1函数的异步完成，接下来会执行f2
let pm = new Promise(f1);
p1.then(f2);

// callback方式
f1(function (value1) {
  f2(value1, function(value2) {
    f3(value2, function(value3) {
			//	代码代码代码...
    });
  });
});

// Promise 
(new Promise(f1))
  .then(f2)
  .then(f3);
```

## 2.1 Promise的 then() 方法；

1. `Promise()`的构造函数是固定的：

   `var pm = new Promise( function(resolve, reject) { ... });`

   这里的参数：resolve 和 reject 是Js预设的。

   在函数体中，如果异步操作成功，会返回 `resolve(value)`；如果异步操作失败，会返回 `reject(new Error())`；

2. `pm.then(参数1，参数2);`

   参数：用来接受pm对象的执行结果。

   参数1：如果pm异步操作成功，返回`resolve(这里的内容)`；

   参数2：如果pm异步操作失败，返回`reject(这里的内容)`；

```jsx
var p1 = new Promise(function(resolve, reject) { resolve('成功');} );
var p2 = new Promise(function(resolve, reject) { reject('失败');} );

p1.then(console.log, console.log);  // 成功
p2.then(console.log, console.log);  // 失败
```

## 2.2 补充知识点：

- 箭头函数

  ```jsx
  // 1。基础语法
  	(参数1, 参数2, …, 参数N) => { 函数声明 }
  // 例：
  	var f = (num1, num2) => { return num1*num2 };
  	console.log(f(3, 4)); // 12
  
  // 2。参数只有一个是，括号可以省略
  	(单一参数) => {函数声明}
  	 单一参数 => {函数声明}
  
  // 3。没有参数时，加一个空的圆括号
  	() => {函数声明}
  
  // 4。函数体只有一个return语句时，语句不需要加{方括号}
  	(x) => x * x
  	// 相当于：
  	function(x) { return x * x } 
  ```

# 3. async/await

- 实现异步编程

`async`函数，就是把`generator`的`function*`星号替换成`async`；将`yield`替换成`await`。

`async`就是一个语法上的优化改进。利用`async`可以实现异步编程。

- `yield` 可以把异步任务划分成多个小段，也就是“断点”。这和 `await` 是一样的。
- `await` 这一行的代码会立即执行，然后 await 下面的代码，就放入异步队列中了。
- `async`的返回值`return`是 Promise 对象，可以用`then`方法指定下一步的操作。
- `Generator`的返回值是 Iterator 对象
- `async`函数完全可以看作多个异步操作，包装成的一个`Promise`对象，而`await`命令就是内部`then`命令的语法糖。
- `async` 不需要和`generator`一样，先new一个对象，然后调用`next()`去执行下一步，而是和调用普通函数到方法一样，一旦被调用直接运行到结束。

### 分析 async的执行顺序：

```jsx
// async/await的执行顺序：
function sleep(t) {
        return new Promise(resolve => {
            console.log('sleep start: ' + t);
            setTimeout(resolve, t);
        });
    }

    async function go(){
        console.log('go start');
        await sleep(500);
        console.log('go middle');
        await sleep(100);
        console.log('go end');
    }
```

执行结果：

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/72a88837-9563-4d01-8d1f-453b6091a9da/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/72a88837-9563-4d01-8d1f-453b6091a9da/Untitled.png)

分析：

1. 执行`go()` 函数：输出第一行“go start”
2. 执行第一个await 函数：输出 `sleep start: 500`
3. 执行完await后，函数中剩余的代码会放到异步队列中，函数执行完毕。return返回值：`Promise对象`
4. 主线程队列任务清空后，执行异步队列中的任务：输出“go middle”；
5. 执行第二个await函数：输出`sleep start: 100`
6. 执行完await后，剩余代码会放入异步队列中。
7. 主线程队列任务清空后，执行异步队列中的任务：输出“go end”

### addEventListener()

- `addEventListener('click', 触发事件函数, once{true});`

- 最后一个参数的目的：触发时机。是在捕获阶段还是在冒泡阶段。（先捕获 → 后冒泡）

  ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6d51c9e0-77e2-4de0-923b-745665a0b56e/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6d51c9e0-77e2-4de0-923b-745665a0b56e/Untitled.png)

  - 只有在层层嵌套的元素，都分别设计了监听器，才有区分的意义：

  ```jsx
  <div id="div2">
        <div id="div1">点我</div>
  </div>
  
  <script>
  var div2=document.getElementById('div2');
  var div1=document.getElementById('div1');
  
  div1.addEventListener('click', function(event){console.log("A");}, true);
  div2.addEventListener('click', function(event){console.log("B");});
  div1.addEventListener('click', function(event){console.log("C");}, false);
  div2.addEventListener('click', function(event){console.log("D");}, true);
  </script>
  
  // 输出：DACB
  // div1.addEventListener('click', function(event){console.log("A");}, true);
  // A 捕获触发：div1后触发
  
  // div2.addEventListener('click', function(event){console.log("B");});
  // B 冒泡触发：div2后触发
  
  // div1.addEventListener('click', function(event){console.log("C");}, false);
  // C 冒泡触发：div1先触发
  
  // div2.addEventListener('click', function(event){console.log("D");}, true);
  // D 捕获触发：div2先触发
  ```

- div2 是 div1 的父元素：

  - 在捕获阶段，先捕获到 div2 然后是 div1；在冒泡阶段，先冒泡div1 然后是div2。
  - 如果参数设置为：false(默认)，则冒泡阶段触发事件：先触发div1事件，后触发div2事件。
  - 如果参数设置为：true，则捕获阶段触发事件：先触发div2事件，后触发div1事件。

  ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ca6da2db-7d33-481a-a6f0-ce26b44c9baa/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ca6da2db-7d33-481a-a6f0-ce26b44c9baa/Untitled.png)

# 4. Generator

### review：

- Js是单线程。但是有主进程队列 ( 栈 / 同步队列 ) 和 异步队列 (  在排队中的异步任务 )
- 异步任务：不在目前主进程中的，放在异步队列中的任务。（就绪的异步任务 / 尚未满足条件的异步任务）
- 同步任务：在主线程中的、或者说同步队列中的、或者说栈中的任务。
- 异步任务有一个显著的特点：它在执行的过程中，可以有“断点”把它分割成多个小任务：任务1、任务2、任务3 ... 执行完任务1后，把剩余的代码全部放到异步队列中。等待本轮同步队列执行完毕，再执行后面的任务。
  - 换句话说，可以通过“断点”把任务执行权转交给其他任务，在一轮同步任务结束后。通过“事件循环”，重新争取任务执行权，执行接下来的任务。

### 异步任务：

`generator` 异步编程的解决方案之一。

`generator` 的特点：在`generator`  中，每一个yield都是一个“断点”。在 执行完 `yield` 中的代码（包括`yield`之前的代码）之后，就会转交执行权、或者说把 `yield` 后面的代码全部扔到异步队列中。

```jsx
function* gen() {
  // ...111 其他代码
  yield a();
  // ...222 其他代码，不会被立刻执行，放到异步队列中等待下一轮‘事件循环’。
	yield b();
  // ...333 其他代码，不会被立刻执行，放到异步队列中等待下一轮‘事件循环’。
	yield c();
  // ...444
}

var g = gen();  // 创建一个gen()迭代器对象（iterator指针对象）
g.next();       // 执行：111 和 a();获得a()的返回值;把剩余代码扔到异步队列中
g.next();       // 执行：222 和 b();获得b()的返回值;把剩余代码扔到异步队列中
g.next();       // 执行：333 和 c();获得c()的返回值;把剩余代码扔到异步队列中
g.next();       // 执行：444。done：false。表明后面没有断点了，这是最后一个断点。

❗️❗️三个 yield；四个next()
```

- `next()` 方法：是分阶段执行`Generator`函数。每次调用`next`方法，会返回一个对象，表示当前阶段的信息（`value`属性和`done`属性）。`value`属性是`yield`语句后面表达式的值，表示当前阶段的值；`done`属性是一个布尔值，表示 `Generator` 函数是否执行完毕，即是否还有下一个阶段。
- `next()` 总比 `yield`多一个。每次执行`next()` ，都会执行 `next()` 指向的那个 `yield` 以上的代码（包括 yield）。那么最后一个 `next()` 指向了`functioni*` 的最末尾。执行最末尾的代码。
- Generator函数返回的是遍历器对象。必须要调用`next()`，方法才会遍历下一个内部状态，而`yield`就可以理解为是一个暂停机制。
- 执行`yield` 后的代码，必须有`next()`或 `for-of` 返回，本身不是返回值。本身是返回的是后面那个表达式：eg `yield x = a + b` ，yield返回的是“x = a + b”，在遍历的时候才会执行这一串代码。
- 一次`yield` 可以理解为是一次 `return`。每次返回的是一个`Iterator对象`。
- Generator函数可以设置多个`yield`，也就是有多个`return`。
- `for...of`循环可以自动遍历 Generator 函数时生成的`Iterator对象`，且此时不再需要调用`next`方法。
- 简单来说，`for-of`里返回的数据和`next()`中`value`一样。区别在于`for-of`循环完后不循环`return`后面的表达式。而`next()`则会。

```jsx
// for-of
function *fn(){
    yield 'a';
    yield 'b';
    yield 'c';
    yield 'd';
    return 'end'
}
let a = fn()
for(let v of a){
    console.log(v)  // a   b   c    d   
}
// for-of 不遍历return

// next()
// next()输出return
function *fn(){
    yield 'a';
    yield 'b';
    yield 'c';
    yield 'd';
    return 'end'
}
let a = fn()
console.log(a.next());   // {value: "a", done: false}
console.log(a.next());   // {value: "b", done: false}
console.log(a.next());   // {value: "c", done: false}
console.log(a.next());   // {value: "d", done: false}
console.log(a.next());   // {value: "end", done: true}
console.log(a.next());   // {value: undefined, done: true}
```

- `for-of` + `yield` 的函数执行顺序

  - `for-of` 配合 `yield` 时，执行顺序是这样的：执行一个`yield`，`for-of` 遍历一次（遍历这个yield的结果）；执行下一个`yield`，`for-of` 再遍历一次（遍历这个新的yield的结果）

  ```jsx
  function *fn(){
      yield 'a';
      console.log("aa");
      yield 'b';
      console.log("bb");
      yield 'c';
      console.log("cc");
      yield 'd';
      console.log("dd");
      return 'end'
  }
  
  let x = fn();
  
  for(let v of x){
      console.log(v)  // 此处输出： a   b   c    d   
  }
  
  // 输出结果
  // a aa b bb c cc d dd
  ```

### 用`iterator()` 迭代`generator`

Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果。

调用Generator函数后，`返回迭代器对象（Iterator Object）`，一个指向内部状态的指针对象。

```jsx
function run(iterator) {
    let {value, done} = iterator.next();
    if(done) {
        return;
    }
    if (value instanceof Promise) {
        value.then(() => {
            run(iterator);
        })
    }
}

// 前提： yield后执行的代码，返回的必须是Promise对象 或 Tunck() 函数
// genarator迭代器，利用next()去访问下一个yield
    // 若next()返回值：done = false，指针此时已经指向函数末尾，后面没有其他数值了，结束迭代
    // 若next()：done = true，表明后面还有yield 继续迭代。
        // 若next()：value返回值类型是Promise，则执行value.then()，
        // 在then()方法中，递归下一个run(iterator);
        // 直到next() 指向函数末尾。🔚

// 利用Promise 和 then() 实现了代码同步

// 把一个generator迭代器，传入run()中遍历。
run(go());

//或者用模拟co框架，可以把go()函数包装成一个普通函数的样子，可以直接键入：go()执行
function co(generator){
        return function(){
            return run(generator());
        }
    }

// console键入：go();
```

------

# 👇对上文知识的补充

# 5. Promise对象

- 我的理解：

1. Promise可以把异步编码改成同步编码：

   ```jsx
   new Promise((resolve, reject) => {
   		resolve('我后执行');
   		console.log('我先执行');
   }).then(r => {
   		console.log(r);
   		console.log('我最后执行');
   });
   
   // 执行结果：
   // 我先执行
   // 我后执行
   // 我最后执行
   
   // 这里可以看到，resolve()是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。
   // 所以，Promise中的任务会先执行，然后resolve中的任务后执行。
   ```

## 第一章：引子

### 1. 区分：实例对象和函数对象

函数对象：函数本身就是一个对象。`Fn`是一个函数对象。

构造函数：函数在当成构造函数使用时，是`new Fn()`。此时函数是构造函数。

实例对象：在构造方法new一个新对象时，新对象fn就是实例对象，`const fn = new Fn();`

- ❗️函数对象，在Java中，相当于类class。函数对象 = 类class；
- ❗️构造函数，在Java中，相当于构造方法。构造函数 = 构造方法；
- ❗️实例对象，在Java中，相当于实例对象，对象。

```jsx
function Fn() {      //Fn函数
}
const fn = new Fn()  //Fn是构造函数，fn是实例对象(简称：对象)

console.log(Fn.prototype)  // (括号)的左边是一个函数：console.log()函数
													 // 括号中，'.'的左边是一个对象，这个对象是Fn「函数对象」
													 // 函数本身就是一个对象，但是如果函数后有括号：Fn()是一个函数
																										//函数后没有括号：Fn 是一个对象
Fn.bind({})    //调用Fn函数对象（简称对象）的bind方法
$
```

### 2. 两种类型的回调函数

- 定义：

  起始函数：主进程需要完成特定的功能，调用中间函数。调用的同时，传入一个参数，这个参数就是“回调函数”。

  中间函数：主进程调用了中间函数。中间函数收到了“回调函数”，这个参数。然后在进行一系列的函数执行。这一系列的函数执行中，会调用“回调函数”。即，**回调函数，是中间函数调用的，而不是定义这个函数的起始函数。**

  回调函数：

1. 同步回调函数

   - 立即执行，完全执行完毕后，结束。不会放入回调队列中。（回调队列 = 挂起队列？）

2. 异步回调函数

   - 不会立即执行，会放入回调队列中，等待同步队列（主线程队列）执行完毕后，才执行。

   ```jsx
   /1。同步回调函数
   const arr = [1, 3, 5];
   arr.forEach(item => {   //item => { }，这个函数是我定义的，但是forEach执行。称：遍历的回调函数
   		console.log(item);
   })
   console.log('forEach()之后');
   
   //输出：
   // 1
   // 3
   // 5
   // forEach()之后
   
   / arr.forEach()执行，然后执行回调函数item => {}
   / 待回调函数执行完毕后，才执行log打印输出。
   / 结论：item => {..} 是同步回调函数，立即执行。
   
   /2。异步回调函数
   setTimeout(() => {
   	console.log('timout callback()');
   }, 0);
   colsole.log('setTimeout()之后');
   
   // 输出：
   // setTimeout()之后
   // timout callback()
   
   / 出发事件循环机制：
   / () => {..} 是异步回调函数，会放入队列中，等待主线程队列执行完毕，才会执行挂起队列。
   ```

### 3. Js中的error处理机制

- 看MDN中，关于的Error内容

1. 常见内置错误的类型

   1. Error：所有错误的父类型
   2. ReferenceError：引用的变量不存在
   3. TypeError：数据类型不正确
   4. RangeError：数据值不在其所允许的范围
   5. SyntaxError：语法错误

   ```jsx
   // 1.ReferenceError
   	console.log(a);  // ReferenceError: a is not defined
   
   // 2.TypeError
   	let b;   // b是一个变量，不是一个对象。
   	b.xxx    // Cannot read property 'xxx' of undefined at ... 
   
   	let b = {};
   	b.xxx()  // TypeError:b.xxx is not a function
   
   // 3.RangeError
   	function fn() {   // 死循环的递归调用
   		fn();
   	}
   	fn();      // RangeError:Maximum call stack size exceeded
   
   // 4.SyntaxError
   	const c = """"  // SyntaxError:Unexpected string 这类错误，IDE通常也能发现
   	const c = "''"  // 语法正确。
   ```

2. 错误处理

   - 如果出现错误，不进行处理，程序就无法继续执行。

   1. 捕获错误：`try ... catch`

      ```jsx
      try {
      	let d;
      	console.log(d.xxx);
      } catch (error) {
      	console.log(error);          // 默认输出：stack
      	console.log(error.message);  // 输出：message简短的string
      	console.log(error.stack);    // 输出：TypeError详细错误类型 + 链接出错地址
      }
      ```

   2. 抛出错误：`throw error`

      ```jsx
      function something() {
      	if (Date.now()%2 === 1) {  // 利用date.now方法，令时间分出奇偶
      		console.log('当前时间为奇数，可以执行任务');
      	} else {                   // 如果时间是偶数，抛出异常，由调用者处理
      		throw new Error('当前时间为偶数，不可以执行任务');  //抛出的内容：error.message
      	}
      }
      
      // 调用者需要处理异常，利用tryCatch捕获异常
      try {
      	something()
      } catch (error) {
      	console.log(error.message);
      }
      
      // 反复输出的结果：
      // 当前时间为奇数，可以执行任务
      // 当前时间为偶数，不可以执行任务
      ```

   3. 错误对象：

   4. message属性：错误相关信息

   5. stack属性：函数调用栈记录信息

## 第二章：Promise 的使用

- 思路（WWH）

1. Promise 的定义 —> what ?
2. Promise 解决的痛点 —> why ?
3. Promise 的使用方式 —> how ?

### 1. Promise 的定义

- 抽象表达：

  Promise是JS中进行异步编程的新的解决方案。原有解决方案是纯回调形式，有多层嵌套问题：callback-hell。

- 具体表达：

  - 语法上：Promise是一个构造函数
  - 功能上：Promise对象用来封装一个异步操作，并可以获取这个操作的结果。

1）Promise的状态

- `pending` 未完成
- `fulfilled` 成功
- `rejected` 失败
- `resolved` = `fulfilled` + `rejected` 操作已完成

2）Promise的状态改变：

1. `pending` 变为 `resolved`（传参是resolved，这里就把它代表成功，其实应是fulfilled）

2. ```
   pending
   ```

    变为 

   ```
   rejected
   ```

   - 对象状态只能这样改变，且只能改变一次。不论成功失败，都会返回一个结果**数据。**
   - 成功的结果数据：`**value**`；失败的结果数据：**`reason`**。

3）Promise的基本流程

- Promise( 传入回调函数 )

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/66075849-019d-4c9e-8069-7f6c97d26c17/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/66075849-019d-4c9e-8069-7f6c97d26c17/Untitled.png)

4）Promise的基本使用

```jsx
// 1.创建一个Promise对象 (传入一个回调函数)
const p = new Promise((resolve, reject) => {  //执行器函数，这里面执行异步任务
// 2.执行异步操作任务	
	setTimeout(() => {
		const time = Date.now() // 当前时间是偶数代表成功，奇数代表失败。
		// 3.1如果成功了，调用resolve(value),可以传入一个value
		if(time %2 == 0) {
			resolve('成功的数据,time=' + time);
		} else {
		// 3.2如果失败了，调用reject(reason)，可以传入一个reason	
			reject('失败的数据,time=' + time);
		}
	}, 1000);
})

p.then(   //then指定，成功或失败的回调函数
	value => {  // 接受得到成功的value数据，函数名称：onResolved()
		console.log('成功的回调',value);
	},
	reason => { // 接受得到失败的reason数据，函数名称：onRejected()
		console.log('失败的回调',reason);
	} 
)

// 输出两种结果：
// 成功的回调 成功的数据，time=xxxxxxxxxxx
// 失败的回调 失败的数据，time=xxxxxxxxxxx

纯代码：
const p = new Promise((resolve, reject) => {
        setTimeout(() => {
            const time = Date.now()
            if (time % 2 == 0) {
                resolve('成功的数据,time=' + time);
            } else {
                reject('失败的数据,time=' + time);
            }
        }, 1000);
    })

    p.then(
        value => {
            console.log('成功的回调', value);
        },
        reason => {
            console.log('失败的回调', reason);
        }
    )
```

### 2. Promise解决的痛点

和以前的纯函数回调相比，Promise可以在启动回调任务之后，或者回调任务已经执行完毕之后，再定义回调任务执行的结果应该怎么处理。换句话说，Promise可以在异步操作代码执行之后，再处理和解决 resolve 和 reject 的输出结果。

也就是说，我可以先定义一个Promise，然后执行里面的异步操作。对异步操作的执行结果先放置不管。在后面的时间，我可以用`.then()`方法来处理这个异步操作的结果，成功/失败。

换个角度：Promise执行完异步操作后，处理结果的反馈数据(成功/失败)一直保存在内存中，等待被处理。

- `Promise`内部的代码会立即执行（主同步队列中），然后会返回一个结果`resolve()`。
- 若`Promise`之后会有`.then()` 方法，那么`then()`中的代码会放到异步队列中。
- 总结：
  1. `Promise`中的`then()`方法是异步的，会放在异步队列中排队执行；
  2. `async`中的`await`方法，本身不是异步的，后面是异步的。会跳转到`await`标记调用的函数中去执行。执行完毕后，返回到`async`中，会把`async` 后面的代码，全部放到异步队列中；

# 6. 同步和异步

1. 同步：
   - 每一行代码/每一组代码，都按照顺序一个一个来，不会乱掉。不会出现上面代码没有执行完就执行下面的代码。
   - 缺点：解析的速度没有异步的快；
2. 异步：
   - 是接取一个任务，放到挂起队列中，再接下一个任务。在挂起队列中，哪个任务具备了执行的条件（如IO读取完毕），就转移到就绪队列中。
   - 缺点：没有顺序 ，谁先读取完，谁就可以先执行 。会出现上面的代码还没执行完，下面的就抢先执行了。有时候必须需要上面代码先执行完毕，下面的代码才具备执行的条件。必须有一个特定的顺序，否则无法执行，报错。
3. 异步任务
   - 特点：异步任务有时候，不是一口气就执行完毕，而是会被切割成段。先执行一部分，遇到了执行条件不满足，被动等待的时候（IO问题）。放弃执行权，交给别人执行。满足执行条件，再重新执行。

# 7. 回调函数

```jsx
作者：no.body
链接：[<https://www.zhihu.com/question/19801131/answer/27459821>](<https://www.zhihu.com/question/19801131/answer/27459821>)
```

### **什么是回调函数？**

我们绕点远路来回答这个问题。

编程分为两类：系统编程（system programming）和应用编程（application programming）。所谓系统编程，简单来说，就是编写**库**；而应用编程就是利用写好的各种库来编写具某种功用的程序，也就是**应用**。系统程序员会给自己写的库留下一些接口，即API（application programming interface，应用编程接口），以供应用程序员使用。所以在抽象层的图示里，库位于应用的底下。

当程序跑起来时，一般情况下，应用程序（application program）会时常通过API调用库里所预先备好的函数。但是有些库函数（library function）却要求应用先传给它一个函数，好在合适的时候调用，以完成目标任务。这个被传入的、后又被调用的函数就称为**回调函数**（callback function）。

打个比方，有一家旅馆提供叫醒服务，但是要求旅客自己决定叫醒的方法。可以是打客房电话，也可以是派服务员去敲门，睡得死怕耽误事的，还可以要求往自己头上浇盆水。这里，“叫醒”这个行为是旅馆提供的，相当于库函数，但是叫醒的方式是由旅客决定并告诉旅馆的，也就是回调函数。而旅客告诉旅馆怎么叫醒自己的动作，也就是把回调函数传入库函数的动作，称为**登记回调函数**（to register a callback function）。如下图所示（图片来源：维基百科）：

![https://pic4.zhimg.com/80/0ef3106510e2e1630eb49744362999f8_1440w.jpg?source=1940ef5c](https://pic4.zhimg.com/80/0ef3106510e2e1630eb49744362999f8_1440w.jpg?source=1940ef5c)

可以看到，回调函数通常和应用处于同一抽象层（因为传入什么样的回调函数是在应用级别决定的）。而回调就成了一个高层调用底层，底层再**回**过头来**调**用高层的过程。（我认为）这应该是回调最早的应用之处，也是其得名如此的原因。

### **回调机制的优势**

从上面的例子可以看出，回调机制提供了非常大的灵活性。请注意，从现在开始，我们把图中的库函数改称为**中间函数**了，这是因为回调并不仅仅用在应用和库之间。任何时候，只要想获得类似于上面情况的灵活性，都可以利用回调。

这种灵活性是怎么实现的呢？乍看起来，回调似乎只是函数间的调用，但仔细一琢磨，可以发现两者之间的一个关键的不同：在回调中，我们利用某种方式，把回调函数像参数一样传入中间函数。可以这么理解，在传入一个回调函数之前，中间函数是不完整的。换句话说，程序可以在运行时，通过登记不同的回调函数，来决定、改变中间函数的行为。这就比简单的函数调用要灵活太多了。请看下面这段Python写成的回调的简单示例：

```
even.py
#回调函数1
#生成一个2k形式的偶数
def double(x):
		return x * 2
#回调函数2
#生成一个4k形式的偶数
def quadruple(x): 
		return x * 4
callback_demo.py
from even import *

#中间函数
#接受一个生成偶数的函数作为参数
#返回一个奇数
def getOddNumber(k, getEvenNumber): 
		return 1 + getEvenNumber(k)

#起始函数，这里是程序的主函数
def main(): 
		k = 1 
		#当需要生成一个2k+1形式的奇数时 
		i = getOddNumber(k, double) 
		print(i) 
		#当需要一个4k+1形式的奇数时 
		i = getOddNumber(k, quadruple) 
		print(i) 
		#当需要一个8k+1形式的奇数时 
		i = getOddNumber(k, lambda x: x * 8) 
		print(i)

if __name__ == "__main__": 
		main()
```

运行`callback_demp.py`，输出如下：

```python
3
5
9
```

上面的代码里，给`getOddNumber`传入不同的回调函数，它的表现也不同，这就是回调机制的优势所在。值得一提的是，上面的第三个回调函数是一个匿名函数。

### **易被忽略的第三方**

通过上面的论述可知，中间函数和回调函数是回调的两个必要部分，不过人们往往忽略了回调里的第三位要角，就是中间函数的调用者。绝大多数情况下，这个调用者可以和程序的主函数等同起来，但为了表示区别，我这里把它称为**起始函数**（如上面的代码中注释所示）。

之所以特意强调这个第三方，是因为我在网上读相关文章时得到一种印象，很多人把它简单地理解为两个个体之间的来回调用。譬如，很多中文网页在解释“回调”（callback）时，都会提到这么一句话：“If you call me, I will call you back.”我没有查到这句英文的出处。我个人揣测，很多人把起始函数和回调函数看作为一体，大概有两个原因：第一，可能是“回调”这一名字的误导；第二，给中间函数传入什么样的回调函数，是在起始函数里决定的。实际上，回调并不是“你我”两方的互动，而是ABC的三方联动。有了这个清楚的概念，在自己的代码里实现回调时才不容易混淆出错。

另外，回调实际上有两种：阻塞式回调和延迟式回调。两者的区别在于：阻塞式回调里，回调函数的调用一定发生在起始函数返回之前；而延迟式回调里，回调函数的调用有可能是在起始函数返回之后。这里不打算对这两个概率做更深入的讨论，之所以把它们提出来，也是为了说明强调起始函数的重要性。网上的很多文章，提到这两个概念时，只是笼统地说阻塞式回调发生在主调函数返回之前，却没有明确这个主调函数到底是起始函数还是中间函数，不免让人糊涂，所以这里特意说明一下。另外还请注意，本文中所举的示例均为阻塞式回调。延迟式回调通常牵扯到多线程，我自己还没有完全搞明白，所以这里就不多说了。

# 8. 关于Function()和Function

- `Function()`是一个函数的执行，调用函数。**等式左边得到的是一个return返回值**，同时函数内部的代码得到执行。

- `Function`是一个引用、变量。这个变量保存的值，是`Function()`的地址。所以等式左边得到的是一个函数的地址；**换句话说，等式左边得到了一个函数。**

- 比如：

  ```jsx
  function sleep2(time) {
          return new Promise((resolve, reject) => {
              setTimeout(() => {resolve('Begin!')}, time);
          });
  
  这里面的 setTimeout()函数，有两个参数：setTimeout(函数，毫秒);
  代表的含义是：经过「一段时间」后，再执行「函数」。
  
  那么， setTimeout()中第一个参数位，应该放置一个函数，不能加(括号)。
  如果加了(括号)，就得到了一个函数返回值。
  
  所以，sleep2中，setTimeout()，想传入一个resolve()函数，那么有两种方法：
  
  - 方法一：
  	setTimeout(resolve, time);
  - 方法二：
  	setTimeout(() => {resolve(参数)}, time);
  
  - 方法一，直接在参数为放置了resolve()函数的地址，得到了这个函数。
  			但是方法一有一个缺点，就是只传递了resolve()的地址，无法给rsolve传递参数。
  - 方法二，为了达到给resolve()函数传递参数，利用 => 定义一个匿名函数。
  			然后在匿名函数内部，return一个resolve()函数。
  
  这样，既实现了在setTimeout()中，必须放置函数的要求；又实现了在resolve()中传递参数的要求。
  ```

# 9. Iterator遍历器

## 1. Map和Set

### Map

1. Map 类似于二维数组。
2. Map 是一组**键值对**。key + value
3. 一个 key 对应一个 value，如果多次对一个 key 放入 value，后面的执行会覆盖前面的。

```jsx
// 定义
var m = new Map([['Michael', 95], ['Bob', 75], ['Tracy', 85]]);
m.get('Michael'); // 95

// 方法
var m = new Map(); // 空Map
m.set('Adam', 67); // 添加新的key-value
m.set('Bob', 59);
m.has('Adam'); // 是否存在key 'Adam': true
m.get('Adam'); // 67
m.delete('Adam'); // 删除key 'Adam'
m.get('Adam'); // undefined
```

### Set

1. Set 类似于一位数组。

2. Set 只有key，没有value。同时，key 不能重复。

   ```jsx
   // 定义
   var s1 = new Set(); // 空Set
   var s2 = new Set([1, 2, 3]); // 含1, 2, 3
   
   // 方法
   var s = new Set([1, 2, 3]);
   s; // Set {1, 2, 3}
   s.delete(3);   //删除
   s; // Set {1, 2}
   s.add('L');    //添加
   s; // Set {1, 2, "L"}
   ```

## 2. iterable

Array、Map、Set都是 `iterable` 类型。

`iterable` 类型的目的，主要是为了整合ES6的新类型Set和Map。这两个数据类型无法用通常的数组下标循环的方式去遍历。

- 具有`iterable`类型的集合，可以用`for...of`，而不是`for...in`循环遍历。

  ```jsx
  var a = ['A', 'B', 'C'];
  var s = new Set(['A', 'B', 'C']);
  var m = new Map([[1, 'x'], [2, 'y'], [3, 'z']]);
  for (var x of a) { // 遍历Array
      console.log(x);
  }
  for (var x of s) { // 遍历Set
      console.log(x);
  }
  for (var x of m) { // 遍历Map
      console.log(x[0] + '=' + x[1]);
  }
  ```

1. `for...in`的缺点：

- for in 是古老的数组遍历方法。数组本身就是一个对象，数组中有各种方法、属性。数组中的每一个元素也是一个属性。**用 for in 遍历数组，就是遍历数组这个对象，它自身的全部属性名称。**然后，对象的属性，可以设置不允许遍历。数组中的方法就是默认设置为不允许遍历。那么 for in 就会跳过这些不允许遍历的属性。
- 问题在于，如果对数组添加了新的属性（非数组元素）、方法。有可能设置为可遍历。这样 for  in 就会把这些属性名也识别出来。

1. `for...of`的改进：

- for of 只会循环 iterable 集合本身的元素。不会循环到其他属性、方法。

### forEach

`forEach`是 `iterable`类型内置的遍历/迭代方法。

```jsx
// forEach的使用
// 1。Array
var a = ['A', 'B', 'C'];

// element: 当前元素值
//   index: 当前下标
//   array: Array对象本身
a.forEach(function (element, index, array) {
    console.log(element + ', index = ' + index);
});

// 2。Set
var s = new Set(['A', 'B', 'C']);

// Set只有key ==> element
s.forEach(function (element, set) {
    console.log(element);
});

// 3。Map
var m = new Map([[1, 'x'], [2, 'y'], [3, 'z']]);

m.forEach(function (value, key, map) {
    console.log(value);
});

// 不关心的参数可以省略。比如数组中只要元素，不要下标。
var a = ['A', 'B', 'C'];
a.forEach(function (element) {
    console.log(element);
});
```

## 3. generator

- generator生成器。
- generator的定义：`function*`

### function和function*的区别

- `function`函数：调用一个函数，就是传入参数，函数执行，然后获得返回值（默认返回值：undefined）。如果不执行`return`，则控制权一直在当前函数中，没有交出。
- `function*`generator生成器：调用一个generator，就是传入参数，generator执行，在执行过程中，可以用`yield`多次返回，最后可以用`return`返回。

`function*` 的定义

```jsx
function* foo(x) {
    yield x + 1;
    yield x + 2;
    return x + 3;
}
```

- 🌰：斐波那契数列

```jsx
// function
function fib(max) {
    let
        temp,
        a = 0,
        b = 1,
        arr = [0, 1];
    while (arr.length < max) {
//	       temp = a + b;
//				 a = b;
//				 b = temp;
// 上面三行可以缩减成下面的一行，用一个数组计算。
// 下面的计算过程：系统会先把a和b的值保存为x和y，
// 然后对a = b；b = a + b 做运算，实际上用的值是保存的值：a = x；b = x + y。
				[a, b] = [b, a + b];
        arr.push(b);
    }
    return arr;
}
// 问题：function 只能有一个return结果。所以必须计算好，然后用一个数组把计算的数字全部返回。
// 改进：用 generator 可以在每次计算出一个新结果后，就用yield返回一个数值。不必积攒后一次性返回

// 定义generator
function* fib(max) {
    let
        a = 0,
        b = 1,
        n = 0;
    while (n < max) {
        yield a;
        [a, b] = [b, a + b];
        n++;
    }
    return '执行完毕';
}

// 调用generator

// 方法一：
		// 实例化对象 + next();
		let f1 = fib(5);
		f1.next();   // {value: 0, done: false}
		f1.next();   // {value: 1, done: false}
		f1.next();   // {value: 1, done: false}
		f1.next();   // {value: 2, done: false}
		f1.next();   // {value: 3, done: false}
		f1.next();   // {value: "执行完毕", done: true} 
// 如果done:true,则表示此时generator已经执行完毕。value返回return的值。

// 方法二：
		// 使用for of 迭代generator对象
for (var x of fib(10)) {
    console.log(x);   // 依次输出0, 1, 1, 2, 3, ...
}
```

### iterator遍历器

- 本质：一个指针对象。创建一个指针，指向当前数据结构的起始位置（index = 0）。

- ```
  next()
  ```

   指针指向下一个对象，然后输出它。

  - 返回：value（对象值） + done：(true / false后面是否还有数据)

- 原生具备 Iterator 接口的数据结构如下。

  - Array
  - Map
  - Set
  - String
  - TypedArray
  - 函数的 arguments 对象
  - NodeList 对象

# 10. setTimeout()

- 关于队列任务：
  - 同步队列（主线程）、异步队列（我理解的挂起队列）
  - 同步任务 sknchronous，异步任务 asynchronous [eɪˈsɪŋkrənəs]
    - chronic  a. 慢性的

## 1. **任务队列**

我们把需要执行的代码看成一个个任务。把任务分成两种，同步任务(sknchronous)，异步任务(asynchronous)。

下面是它们的运行机制：

1. 所有同步任务都在主线程上，形成一个执行栈
2. 主线程之外还有一个“任务队列”，只要异步任务有了运行结果 ，就在任务队列中放一个事件
3. 当执行栈中所有的任务执行完了，就去看看任务队列中有没有需要执行的事件 ，如果有的话，就结束它们的等待，进入执行栈 ，开始执行。
4. 主线程不断重复上面三步（这里还是单线程，只是多了一个任务队列）

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aed4e5d4-741a-4c6d-aa62-e7395a2a1b55/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aed4e5d4-741a-4c6d-aa62-e7395a2a1b55/Untitled.png)

```jsx
console.log('111');

setTimeout(()=>{
    console.log('222')
},1000);

console.log('333');

setTimeout(()=>{
    console.log('444')
},0);

console.log(555)

//输出：
111
333
555
444
222
```

### 2. 事件循环 Event Loop

主线程从两个任务队列中，周期性读取的过程，是不断循环的。

- 只要栈中的代码执行完毕（有可能没执行完毕，有一个周期性节点也会有中断的情况，现在还不清楚），主线程就会读取就绪任务队列（具备上主线程执行条件的异步任务）。
- 执行栈中的代码（同步任务），总是在读取"任务队列"（异步任务）之前执行。换句话说，只有同步任务执行完毕，才会去执行异步任务。
- 异步任务划分为：
  - 还没准备好的（OS中的陷入/异常？等待IO？）
  - 已经准备好的（进入就绪队列）

### 3. setTimeout()

`setTimeout()`设置了一个定时时间，相当于“还没准备好的异步任务”

### **过程**

1. ```
   setTimeout()
   ```

   ：执行这段代码时，会立刻进行两个操作：

   - 开始倒计时（传入的第二个时间参数）
   - 把这段代码放到异步任务队列中。

2. 在当前主线程队列中的代码全部执行完毕，把异步任务队列中的就绪任务放到主线程中。

   - 这里需要注意：

   1. 如果倒计时没走完，`setTimeout()` 此时还是“还没准备好的异步任务”，尚尚未进入就绪队列。
   2. 如果倒计时完毕，`setTimeout()` 此时已经进入了就绪队列，等待主线程调用。

3. 当主线程执行`setTimeout()` 时，会执行第一个参数（回调函数）。

### 加入 Promise之后

1. Promise的特性：在new 一个Promise对象之后:`new Promsise((resolve, reject) ⇒ {...})`，会执行其中匿名函数中的代码。这个匿名函数会附带两个参数/两个函数： `resolve()` 和 `reject()` ），代码执行成功，会返回`resolve()`函数。利用`.then()`方法，可以处理`resolve()`传递过来的参数。
2. Promise中的代码 —> then中的代码 —> ... 这样下去是一连串的同步编码
3. `setTimeout()` 本来是异步编码的，如果把`setTimeout()` 放置到`Promise()`匿名函数中的代码中，就会把异步执行的`setTimeout()` 变成了同步执行。

# 收集：异步、同步、setTimeout、Promise、anync

之前翻看别的大佬的博客看到了关于setTimeout，promise还有async执行顺序的文章。观看了几篇之后还是没有怎么看懂，于是自己开始分析代码，并整理了此文章，我相信通过此文章朋友们能对异步同步还有，setTimeout,Promise,async这些内容了然于胸，接下来让我们走入正题：

这是别的大佬博客里面的代码：

```jsx
async function async1() {
   console.log('async1 start')
   await async2()
   console.log('async1 end')
}
async function async2() {
   console.log('async2')
}
console.log('script start')
setTimeout(() => {
    console.log('setTimeout')
},0)
async1()
new Promise((resolve) => {
    console.log('promise1')
    resolve()
}).then(() => {
    console.log('promise2')
})
console.log('script end')

// 结果：
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

执行结果(不同浏览器执行结果可能不同，笔者用的谷歌)：

### **PS:下面的关键点笔者都用加粗给朋友们圈起来了哦，请仔细观看**

笔者这时候开启了双屏模式，看它的这个代码的执行结果去猜它的规律，然后再看MDN文档，结果就一目了然了。我们现在一起来分析代码：

```jsx
async function async1() {
   console.log('async1 start')
   await async2()
   console.log('async1 end')
}
async function async2() {
   console.log('async2')
}
```

这只是定义了俩个异步函数()，并没有调用，所以暂时不用管。

```jsx
console.log('script start')
```

这是同步的内容，所以会直接执行

*1.输出 `script start`*

```jsx
setTimeout(() => {
    console.log('setTimeout')
},0)
```

**setTimeout是一个计时器，异步的，所以被扔到了任务队列里面**，暂时不去管，我们只需要记住异步队列里面有他就可以。

```jsx
async1();
```

调用了async1函数，会走入到这个函数里，我们先再看一下这个函数：**PS:注意点：当调用async函数的时候会返回一个Promise对象。**Promise对象是立即执行的，后面会详细介绍。

```jsx
async function async1() {
   console.log('async1 start')
   await async2()
   console.log('async1 end')
}
```

这时候会

2.输出`async1 start，`

```jsx
async function async2() {
   console.log('async2')
}
```

而后到了await async2()**这里需要注意一下，在async里遇到await它会使async函数暂停执行，执行完async里的await内容后将后续的内容扔入到浏览器的任务队列里面去。**所以这里输出了async1 start后又

3.输出了`async2`

async2执行完毕之后又走回到调用了async1的位置。将async1没有执行的部分扔到了任务队列里面去。（现在任务队列里面有一个setTimeout和一个async1的后续内容）

接下来又走到了Promise：

```jsx
new Promise((resolve) => {
    console.log('promise1')
    resolve()
}).then(() => {
    console.log('promise2')
})
```

**Promise是立即执行的，**所以它会立即

4.输出：`promise1。`

而后是执行了resolve。执行成功，执行成功的话会走入promise的.then方法里，可是它是异步的回调函数，所以会被丢入到任务队列里。（现在任务队列里面有一个setTimeout和一个async1的后续内容在加上promise的.then内容）

最后走到了：

```jsx
console.log('script end')
```

因为它是同步的，所以会直接执行。

5.输出：`script end`

前五个我们都分析完毕了，接下来到关键点了：现在异步队列中有三个任务分别是：

- `setTimeoutasync1`的后续内容`promise`的`.then`内容这三个内容，`setTimeout`会在最后执行。就好比css权重的优先级，大家固定记住就可以。

**`setTimeout`的优先级没有`async`和`promise`级别高（其实`async`和`promise`是一样的，因为调用`async`方法时就是返回一个`promise`对象）**而后`async`和`promise`的`.then`就看谁先进入到的任务队列里面，**任务队列里面有先进先出的概念。**所以结果很明显了，它们三个的输出顺序是：

6.输出：`async1 end`

7.输出：`promise2`

8.输出：`setTimeout`