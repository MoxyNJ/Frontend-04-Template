# 1. 寻路

# 01. 实现一个地图编辑器

1. 二维数组转一维数组：[x, y] —> x * 二维数组总长 + y

   eg：一个 [3, 3] 的二维数组：[2, 1] —> [ 2 * 3 + 1] —> [ 7 ]

- 循环时，先用y，再用x，是为了和坐标一致。

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/41bfe3d0-586b-4c7e-89ad-538da1f776f4/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/41bfe3d0-586b-4c7e-89ad-538da1f776f4/Untitled.png)

## addEventListener()

```jsx
for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
				....
		}
}

// 利用 x，y 两个参数来遍历一维数组。
```

- ```
  addEventListener("mousemove",() => {...});
  ```

  - 鼠标在事件触发区域「移动」即可触发事件。

- ```
  addEventListener("mousedown", () => {...});
  ```

  - 鼠标在事件触发区域「点击」即可触发事件。

[鼠标事件](https://www.notion.so/60fd7838791e4142ac8c2b3fde5708d5)

[键盘事件](https://www.notion.so/cbc01784627e40d4a5a08d92e10d30a1)

### jQuery mousedown() 方法

button 只读，数字，鼠标按键值。

- 用于 click 时：0－左键。
- 用于 mousedown、mouseup 时：0－左键，1－中间键（滚轮），2－右键。

which 只读，数字，键盘 / 鼠标按键值。

- **用于 mousedown、mouseup 时：1－左键，2－中间键（滚轮），3－右键，与 button 区别。**
- 用于 keypress 时：等同于 charCode + 回退键 + 回车键；
- 用于 keydown、keyup 时：返回任意键值；
- 用于 click 时：1－左键，与 button 的值略有区别。

```jsx
addEventListener("mousedown", e => {...});
concle.log(e.which);   // 1, 2, 3
contextmenu
```

- 单机右键，会调出菜单

  ```jsx
  document.addEventListener("contextmenu", e => e.preventDefault());
  
  // 可以在document取消右键单机，回调出菜单。
  // document 就是文档的根节点
  ```

### Window localStorage 属性

localStorage 和 sessionStorage 属性允许在浏览器中存储 key/value 对的数据。

localStorage 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去删除。

localStorage 属性是只读的。

### **JSON.parse() 和 JSON.stringify()**

- JSON.parse()

  从一个字符串中解析出json对象

  字符串 —> json对象

  ```jsx
  // 字符串
  var data='{"name":"goatling"}'
  
  // 解析对象
  JSON.parse(data)
  // 结果
  // name:"goatling"
  ```

- JSON.stringify()

  json对象 —> 字符串

  ```jsx
  var data={name:'goatling'}
  
  JSON.stringify(data)
  // 结果
  // '{"name":"goatling"}'
  ```

### 数组操作

1. 添加、删除、头部、尾部

   - `push()`：【压栈】尾部 + 添加 + 返回新数组长度(number)。  添加一个或多个元素。
   - `pop()`：【弹栈】  尾部 + 删除 + 返回删除的元素值。  删除一个元素。
   - `unshift()`：头部 + 添加 + 返回新数组长度(number)。  添加一个或多个元素。
   - `shift()`：头部 + 删除 + 返回删除的元素值。  删除一个元素。

   总结：

   - 添加：`push()` + `unshift()`添加比以前数组更多，所以更长(`unshift`比`shift`长)
   - 删除：`pop()` + `shift()`，删除代码更短。

2. 删除数组：`splice(起点,长度);`

   - 起点：被删除的元素下标；
   - 长度：被删除的元素长度。

3. 添加数组：`splice(起点,0,数值1,数值2,数值3,...)`

   - 起点：要插入的元素下标；
   - 0   ：（要删除的元素个数，填0表示不删除，而是添加）
   - 数值1，数值2...：要添加的数值，添加多个则可多选。

4. 数组连接 `concat(string1,string2,string3...)`

   - 返回连接好的新字符串，不删除旧字符串。

5. 数组分隔`join(原数组中添加分隔符)`

   - 所有元素放入一个字符串：

     ```jsx
     var a = [1, 2, 3, 4, 5, 6];
     a,join('-');
     a; 
     // 1-2-3-4-5-6
     ```

深度优先搜索

递归

广度优先搜索

------

# 02. Path(map, start, end);

- 路径函数，使用队列的方法，先进后出。
- 先进：`push()`
- 后出：`shift()`

### 思路

1. 创建一个数组，用来当队列。

2. `function insert()` 往队列中插入新元素（执行往前走一步）。

   1. 判断：是否遇到边界，遇到了则直接return，执行失败。没遇到继续执行；
   2. 判断：是否遇到墙，如果遇到则直接return，执行失败。没遇到继续执行；
   3. 判断：是否已经走过了，如果走过则直接return，执行失败。没遇到继续执行。
      - **2和3 两步可以合二为一。一起判断，只要是有障碍物，就执行失败。**
   4. 执行到这里，说明可以往前走，则标记该位置坐标数值为“已走这一步” / = 2；
   5. 把这个坐标添加到队列中，执行成功。

3. `while` 判断是否走到end终点🏁，没有走到就往前走一步（四个方向）。

   当队列不为0当时候，说明有数据尚未判断，一直执行以下代码。如果队列中没有数据了，此时还没返回true，则说明没有一个可以实现的路径，循环结束。

   1. 从队列中取出一个元素 [ 坐标 ]，打印出来以供查看。
   2. 判断：如果这个坐标已经是在 [end坐标] 的位置，则证明已经达到目的地，返回true；
   3. 如果没有达到end，则证明还在路上：
   4. `insert()` 插入新坐标，继续往前走：上下左右四个方向
   5. 返回false，表明这一步没走到end。

每次判断是否达到终点，都从队列中取出一个坐标来判断。没达到终点，就插入周围的新坐标，然后继续返回头执行判断是否达到终点。当队列中所有坐标都判断完，还没找到终点，那么说明这个路径不存在，返回false，失败。

队列：先进后出。

- 先进：增加可以步行达到的、需要判断的点。
- 后出：提取一个用来点，判断它是否达到了终点，没有达到就继续增加新点，相当于继续往前走。

------

# 03. 实现异步编程可视化寻路算法

- 思想：

  利用`async / await` 实现异步编程。加入sleep(30)，把输出步行变色的速度放慢。

  需要实现同步的用`await` 。

- `async/await` 这两个方法，在week1中有讲解。

------

# 04. 实现寻找路径显示

- 思想：

  在一个一个节点，探寻路径之前，先复制一个尚未标记“已走过的路“的地图table。然后，在寻路的过程中，假设：已经走到**点a** (坐标是[2, 3])，判断后尚未达到终点，需要继续向下走，那么从 a点走的、下一步的那几个点（可能是[2, 4], [3, 3], [3, 4]等等）。这些点在原来的地图上，会被标记为“2”，但是在table复制地图上，标记为“前一个坐标a的位置”。这样一步步标记下去。当有坐标达到终点时，利用复制table，每一个当前节点中，都保存的之前走过来的上一个节点，就像一步踩一个石头一样，可以追溯到最开头的节点。

- `findPath(map, start, end)` 寻找路径

- `path()` 成功路径

1. 在`findPath()`中，先初始化一个table，记录地图的原始信息。方便为每一个新节点，添加回溯节点。
2. 每走一步，对该节点执行：背景色调整为绿色的同时，在table地图上的该节点保存上一个节点的位置信息pre。然后把新节点推入待检查队列中。
3. 在待检查队列中，一旦发现新节点就是目的地。则证明已经达到目的地。
4. 达到目的地，此时执行回溯。
   1. while循环判断：被判断的节点x，y，是否是源头节点？是则路径描绘结束，不是则继续循环，回溯源头；
   2. 循环语句中：取最开头的节点信息（坐标信息），放到`path`中，path是一个数组。
   3. 提取table复制地图中，最开头的节点信息（走过到这里的、上一个节点的坐标信息），分别保存在`[x, y]`中。
   4. 把提取的，上一个节点位置，颜色修改为紫色。
   5. 继续循环，直到找到源头节点结束。

------

# 06. 实现启发式寻路

- Sorted类的结构：

  - ```
    constructor(data, compare)
    ```

    - `data`：一维数组，每一个元素中存放一个坐标信息：`[x, y]`
    - `compare` :一个比较器。在调用构造方法的时候传入。如果没传入，就用简单的 `a-b`

  - ```
    take()
    ```

     ：从data中，取出一个最小的值（用

    ```
    compare()
    ```

    比较器比较）。

    - 1. 找到最小值并读取；
    - 2.把最后一个元素放到最小值的位置；
    - 1. 删除最后一个元素，取出最小值

  - `give()`：放入一个新值，在data的末尾。

### 如何传入比较器 compare()

```jsx
let queue = new Sorted([start], (a, b) => distance(a) - distance(b));

function distance(point) {
            return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2;
        }
```

- 在执行new Sorted时，第二个参数传入了一个箭头函数：

  `return distance(a) - distance(b)`

  这里面应该涉及到作用域的问题。即，把`distance()`函数的作用域，扩展到`Sorted对象`中了。

- 这里传入的第二个参数：箭头函数，并没有被执行。而是把这个匿名函数的地址，传到了Sorted对象中。此时，Sorted中的结构应该是这样的：

  ```jsx
  class Sorted { 
  	constructor(data, (a,b) => distance(a) - distance(b)) {
  		this.data = data;
  		this.compare = (a,b) => distance(a) - distance(b);
  	}
  	... ...
  }
  
  换句话说，此时this.compare 应该看成是一个引用，它接受到构造函数传递过来的compare引用，
  	这个compare引用，指向了那个箭头函数： (a,b) => distance(a) - distance(b)
  
  this.compare指向一个匿名函数：function(a,b) { return distance(a) - distance(b); }
  所以，在take()中，比较两个data大小的时候，调用this.compare() 方法，应放入两个data元素。	
  ```

理解：事实上，完全没有必要这样绕一下，直接把 `distance()` 函数，和`compare比较器`全部放入`Sorted`类中就算了。

解答：完全不可以！start和end两个数值传递会变得很麻烦，这里面涉及到作用域的问题，先不研究了。老师的思路应该是最简洁易懂的了。

------

## 敲代码遇到的问题

1. `<script></script>` 我少写了一个结尾`</script>` 导致script一直无法输出。



# 2. LL算法构建AST｜四则运算

编译原理。 新手上路，有点迷糊。

# 四则运算

1. 词法定义：

   ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e2de5dc8-19ad-4780-883d-e6d5a5dd1254/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e2de5dc8-19ad-4780-883d-e6d5a5dd1254/Untitled.png)

2. 语法定义：

   ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c759cc67-583b-4e94-bfed-1efb98f2702e/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c759cc67-583b-4e94-bfed-1efb98f2702e/Untitled.png)

   绿色：终结符 TerminalSymbol

   没有绿色：非终结符 NoneTerminalSymbol

3. LL语法分析

   ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/68b2fa44-f75d-4248-ac2b-9fbd4f7f9d2a/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/68b2fa44-f75d-4248-ac2b-9fbd4f7f9d2a/Untitled.png)

   ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3d8f785f-f07d-4218-adc9-c1f77d90b82c/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3d8f785f-f07d-4218-adc9-c1f77d90b82c/Untitled.png)

## 使用LL算法构建AST｜正则表达式

- `regexp.exec(string)`：扫描原字符串中的内容，匹配正则表达式。如果匹配到返回匹配数组，否则返回 null。

  - 此数组的第 0 个元素是与正则表达式相匹配的文本，第 1 个元素是与 RegExpObject 的第 1 个子表达式相匹配的文本（如果有的话），第 2 个元素是与 RegExpObject 的第 2 个子表达式相匹配的文本（如果有的话），以此类推。
  - exec()返回的字符串数组中：length属性表示匹配到多少种类型。index 属性声明的是匹配文本的第一个字符的位置。input 属性则存放的是被检索的字符串 string。
  - 当 RegExpObject 是一个全局正则表达式时，exec() 的行为就稍微复杂一些。它会在 RegExpObject 的 lastIndex 属性指定的字符处开始检索字符串 string。当 exec() 找到了与表达式相匹配的文本时，在匹配后，它将把 RegExpObject 的 lastIndex 属性设置为匹配文本的最后一个字符的下一个位置。这就是说，您可以通过反复调用 exec() 方法来遍历字符串中的所有匹配文本。当 exec() 再也找不到匹配的文本时，它将返回 null，并把 lastIndex 属性重置为 0。

- for循环扫描`result` 中的值，如果在对应位置找到`result`有值，则log 出内容。

  ```jsx
  var regexp = /([0-9\\.]+)|([ \\t]+)|([\\r\\n]+)|(\\*)|(\\/)|(\\+)|(\\-)/g
  var dictionary = ["Number", "Whitespace", "LineTerminator", "*", "/", "+", "-"];
  
  function tokenize(source) {
      var result = null;
      while(true) {
          result = regexp.exec(source);
          if(!result) break;
  				// 遍历，输出result中的值。
          for(var i = 1; i<= dictionary.length; i++) {
              if(result[i])
                  console.log(dictionary[i-1]);
          }
  				// 输出整个result中的值。
          console.log(result);
      }
  }
  // 执行：
  tokenize("1024 + 10 * 25");
  </script>
  
  // 运行时的某一时刻下，regexp中的属性：
  dotAll: (...)
  flags: (...)
  global: (...)
  ignoreCase: (...)
  lastIndex: 5
  multiline: (...)
  source: (...)
  sticky: (...)
  unicode: (...)
  
  // 运行时的同一时刻下，result(exec()返回的数组)中的属性：
  0: " "
  1: undefined
  2: " "
  3: undefined
  4: undefined
  5: undefined
  6: undefined
  7: undefined
  groups: undefined
  index: 4
  input: "1024 + 10 * 25"
  length: 8
  ```

- `RegExpObject.lastIndex`

  该属性存放一个整数，它声明的是上一次匹配文本之后的第一个字符的位置（下一个待匹配待字符）。