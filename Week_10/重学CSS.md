# 重学CSS

----

# 一、CSS总论

CSS的标准语法：

- CSS 2.1：https://www.w3.org/TR/CSS21/grammar.html#q25.0
- CSS 3：https://www.w3.org/TR/css-syntax-3



## 1. CSS 2.1总体结构

- @charset：企业一般有预知，用的少。
- @import：用的少。
- rules
  - @media
  - @page
  - rule

 

## 2. CSS @规则

At-rules

- @charset ： https://www.w3.org/TR/css-syntax-3/
- @import ：https://www.w3.org/TR/css-cascade-4/
- @media ：https://www.w3.org/TR/css3-conditional/
- @page ： https://www.w3.org/TR/css-page-3/
- @counter-style ：https://www.w3.org/TR/css-counter-styles-3
- @keyframes ：https://www.w3.org/TR/css-animations-1/
- @fontface ：https://www.w3.org/TR/css-fonts-3/
- @supports ：https://www.w3.org/TR/css3-conditional/

- @namespace ：https://www.w3.org/TR/css-namespaces-3/



## 3. CSS 规则

rules

- 选择器 Selector
  - •	https://www.w3.org/TR/selectors-3/
  - •	https://www.w3.org/TR/selectors-4/
- 声明
  - Key
    - Properties
    - Variables：https://www.w3.org/TR/css-variables/
  - Value
    - https://www.w3.org/TR/css-values-4/



## 4. 🧪 实验：收集CSS标准文档的相关信息

通过爬虫的方法，抓取W3C网页的内容，提取有价值信息。

1. 网址：https://www.w3.org/TR

2. 选择 tag：CSS，发现一共1k+的标准文档中，CSS有170+，是客户端过滤，所有文档已经都被加载到本地客户端。

3. 提取：

   ```javascript
   Array.prototype.slice.call(document.querySelector("#container").children)
       .filter(e => e.getAttribute("data-tag").match(/css/))
       .map(e => ({
       		name:e.children[1].innerText,
       		url:e.children[1].children[0].href
   		})
       )
   	
   
   // 第一步：提取1251个 list结果，全部转化为数组。
   // Array.prototype.slice.call()  
   //	 -把抓取的list，转换成数组。
   // document.querySelector("#container")  
   // 	 -获取 id="container" 的节点元素。通过观察DOM结构发现， 所有的list都在 id='container'中。
   // document.querySelector("#container").children
   //   -获取 container的所有子元素（1251个list）
   
   
   // 第二步：筛选出“data-tag”属性值是“css”的结果，一共有139个 list，保存在数组中。
   // array.filter(函数)
   //	 -返回一个新数组。数组中的成员是通过执行（函数）符合筛选条件的成员。array中的成员会依次执行'函数'
   // node.getAttribute("data-tag")
   //   -获取节点中，属性名是“dta-tag”的属性值，以便后面进行正则筛选。返回String。
   // string.match(正则) 
   //	 -在字符串中检索正则匹配的值。返回匹配成功的成员。
   // (/css/)
   //   -这里不能用相等判断，因为可能会有多个CSS标签。
   
   // 第三步：根据DOM结构，提取每个list的：标题文本 + URL。
   // Array.map(回调函数)
   //   -返回一个新数组。Array中，每个成员都会执行回调函数。处理后的成员，会保存在新数组中。
   // 回调函数：根据DOM结构，提取标题文本 + URL
   // 每个成员的返回一个对象，其中保存两个属性：name、url。
   ```

4. 检查结果，成功获取想要的信息后，对结果：JSON.stringify。将JavaScript值，转换为JSON字符串。

    ```jsx
   JSON.stringify(
       Array.prototype.slice.call(document.querySelector("#container").children)
           .filter(e => e.getAttribute("data-tag").match(/css/))
           .map(e => ({
                   name:e.children[1].innerText,
                   url:e.children[1].children[0].href
               })
           )
   )
   
   // 保存提取的字符串，存储在js文件中的standards变量中，留有备用。
   ```

5. 制作爬虫工具，在w3c的任意一个页面中运行，可以遍历到每个需要的标准文档。

   ```javascript
   let standards = [复制的JSON.stringify];
   
   // 把原网页的内容，替换为一个iframe框架。
   let iframe = document.createElement("iframe");
   document.body.innerHTML = "";
   document.body.appendChild(iframe);
   
   
   // handler变量，指向一个匿名函数：作用是执行resolve()，即promise状态为完成，然后清空监听。
   // 具体的使用：
   // 传递的参数为：iframe框架，"load"加载事件。
   // 返回一个Promise对象，该对象执行：
   		// element.addEventListener(event, handler)
   		// 先定义一个监听事件，如果iframe框架，load加载完毕，就执行回调函数 hander
   		// handler中，会先把Promise状态置为“已完成”，然后取消事件监听。
   function happen(element, event) {
       return new Promise(function(resolve){
           let handler = () => {
               resolve();
               element.removeEventListener(event, handler);
           }
           element.addEventListener(event, handler);
       })
   }
   
   // 遍历standards中每个成员，讲每个成员都加载一次，到iframe中。然后尝试打印一下成员的标题
   // 测试是否加载成功。
   // 使用 async/asait的目的，是为了确保每次当前网页加载完成，然后在执行下一次循环
   		// 是为了提供一个断点，提供的方法是用Promise添加一个事件，监听到后再取消这个事件。特别巧妙。
   void async function() {
       for(let standard of standards) {
           iframe.src = standard.url;    // 新建一个 iframe框架，载入 url
           console.log(standard.name);   // 打印url对应的标题
           await happen(iframe, "load");
       }
   }();
   // 这里使用小括号，直接执行了该函数。
   ```

6. 假设：想提取标准文档中的class="propdef"，也就是相关属性的定义信息：

   ```javascript
   // 如果想抓取带有 class="propdef"的内容
   // 在每个标准文档中，看DOM结构发现“属性内容”，在 propdef中。
   // 对 匿名async函数进行修改即可显示。
   void async function() {
       for(let standard of standards) {
           iframe.src = standard.url; 
           console.log(standard.name);   
           await happen(iframe, "load"); 
           console.log(iframe.contentDocument.querySelectorAll(".propdef"));
         //  这里假设想要提取属性相关的定义，直接在DOM中找到该定义的位置，然后提取。
       }
   }();
   ```
- 面对大量信息，运用自动化手段，提取相关文档的信息。



# 二、CSS选择器

HTML的命名空间：HTML、SVG、MathML。有三个命名空间，在CSS选择器中，需要用 ｜ 单竖线进行分割。



## 1. 选择器语法

**1.1 简单选择器**

- `*`： 通用选择器，适配任何元素
- `div`：type selector，类型选择器。根据元素的tagName属性选择。 
- `.cls`：class selector。可以用空白做分隔符，指定多个class，只要匹配一个就可以了。
- `#id`：id selector。严格匹配。
- `[attr=value]`：属性选择器。[属性名字=值]，包含了 class 和 id 选择器。（可匹配多个）
- `:hover`：伪类选择器，表达元素特殊的状态，与HTML没有关系，大部分来自交互/函数。
- `::before`：伪元素选择器，也可用单冒号，只是不好区分。可以选择不存在的元素。

**1.2 复合选择器 combined**  

- <简单选择器><简单选择器><简单选择器>：多个简单选择器相连，选中的元素必须匹配所有简单选择器。
- `*` / `div` ，必须写在最前面。
- 伪类 / 伪元素，必须在写最后面。

**1.3 复杂选择器**
针对元素的结构进行条件选择。

- <复合选择器>`<sp>`<复合选择器>：用空格分割，子孙选择器。左边是元素的祖先（父级以上）
- <复合选择器>`">"`<复合选择器>：子孙选择器。左边必须是元素的父级。
- <复合选择器>`"~"`<复合选择器>：邻居选择器。必须：左边是共同父元素 + 左边后面的 所有元素。
- <复合选择器>`"+"`<复合选择器>：邻居选择器。必须：左边是共同父元素 + 左边紧邻在后面 的那个元素
- <复合选择器>`"||"`<复合选择器>：表格 table时，可以选中某一个列。

<选择器>`,`<选择器>：逗号之前是“或”的关系，两个选择器并列链接。



## 2. 选择器的优先级

**简单选择器计数**

N：进位。

S：specificity 优先级。《精通CSS》中，称之为“特殊性”（P29）

- `[a, b, c, d]`
  - a：如果是行内样式 / @important  = 1
  - b：id选择器的个数
  - c：class选择器、伪类选择器、属性选择器的个数
  - d：type类型选择器、伪元素选择器的个数
  - 其他：`*`， sp空格，>，~，+，| |，等等这种都不会改变优先级，不计入。
- 计算原理：S = a * N^3 + b * N^2 + c * N^1 + d 
  - 现代浏览器，为了保持很大的兼容性，N = 65535。

```css
#id div.a#id { }
优先级：[0, 2, 1, 1]

div#a.b .c[id=x] { }
优先级：[0, 1, 3, 1]

#a:not(#b)
优先级：[0, 2, 0, 0]
// :not()，not本身是不计数的，但是写在它里面的选择器是需要计数的。

*.a
优先级：[0, 0, 1, 0]

div.a
优先级：[0, 0, 1, 1]
```



## 3. 伪类

### 3.1 链接 / 行为（最初设计的伪类）

- `:any-link`：匹配所有类型的超链接。（any-link = link + visited）
- `:link / :visited`：匹配尚未访问的超链接 / 匹配已经访问过的超链接。
  - 使用了 link / visited 之后，就无法再更改该元素颜色之外的属性。出于安全性考虑，防止窃取到用户的访问痕迹。
- `:hover`：鼠标移到元素上。
- `:active`：激活状态。
- `:focus`：焦点。
- `:target`：连接到当前目标，给 a标签的锚点使用。

### 3.2 树结构

- `:empty`：该元素是否有子元素
- `:nth-child()`：是父元素中的特定child（各种函数、单词）
- `:nth-last-child()`：是父元素中的特定child（各种函数、单词），从后往前数。
- `:first-child / :last-child / :only-child`：
  - 倒着来的：nth-last-child, last-child, only-child 尽量少用，破坏了CSS的溯回原则，会影响处理性能。

### 3.3 逻辑型

- `:not`伪类：目前只支持到简单选择器的序列（复合选择器）。
- `:where / :has`：新的伪类，尚未铺开使用。

总结：选择器不要写的过于复杂。复杂的选择器往往表明HTML代码结构不过科学。HTML代码是前端工程师管理的，如果选择器需要复杂实现，不妨多设计几个class解决问题。 



### 3.4 伪元素

伪元素：通过选择器，向界面上添加了一个不存在的元素。

- `::before`：在当前元素的前面插入一个伪元素。
- `::after`：在当前元素的后面插入一个伪元素。
- `::first-line`：选中第一行。
- `::first-letter`：选中第一个字母。

两种伪元素机制：

- 新建一个新元素，这个元素是伪元素
  - ：`::before`、 ::after：添加了一个伪元素后，一旦给这个元素添加 content属性，就可以和正常元素一样，在DOM中调用了，可以参与正常的渲染和排版。
- 对已有的元素，选中特定的部分，用一个伪元素括起来：
  - `::first-line`、::first-letter：已经渲染和排版了之后，才进行操作。新建的伪元素把选中的元素（第一行 / 第一个字母）概括起来，进行修改。

frist-line 和 first-letter 可以使用的属性：

![first-line、first-letter](/Users/moxyninja/GreenTea-Lemon/前端课上的案例/Week-9&10/source/first-line、first-letter.png) 

### 3.5 作业：编写一个match函数

利用 match 函数，判断DOM树中的某个元素，是否可以匹配 选择器。

```jsx
function match(selector, element) {
  return true;
}

match("div #id.class", document.getElementById("id"));


```

# 尾巴：

- 完成课上练习，提交至课程页面底下练习。
- 完成第 9 节思考题作业：为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？（提交至 GitHub）。

# 三、CSS排版

leyout：布局 / 排版。但称之为“排版”更为贴切。

该部分内容，可以参考：Visual formatting model.md

<img src="source/盒.png" alt="盒" style="zoom:50%;" />

## 1. 盒

- 标签 Tag：源代码。在HTML代码中书写的，都是标签。
- 元素 Element：语义。元素：是通过一对起始标签“表示”出来的，人思维的一个概念。
- 盒 Box：表现

填空：

	1. HTML代码中可以书写开始__标签__，结束__标签__ ，和自封闭__标签__ 。
 	2. 一对起止__标签__ ，表示一个__元素__ 。
 	3. DOM树中存储的是__元素__和其它类型的节点（Node）。
      	4. CSS选择器选中的是__元素__，或__伪元素__ 。
        	5. CSS选择器选中的__元素__ ，在排版时可能产生多个__盒__（有一对多的关系） 。
 	6. 排版和渲染的基本单位是__盒__ 。

- 一个元素不一定只产生一个盒，有可能会产生多个盒：
  - in-line 元素，因为分行会产生多个盒。
  - 伪元素选择器选中的元素，也会生成多个盒。

### 盒模型

<img src="source/盒模型.png" alt="盒模型" style="zoom:50%;" />

- margin, border, padding, box-sizing( content-box, border-box )

## 2. 正常流

历史，三代排版技术：

- 第一代：基于正常流
- 第二代：基于 flex 技术
- 第三代：基于 grid 技术
  - 第 3.5 代：CSS Houdini，可用 Js 干预的排版。

 ### 正常流排版：

1. 收集盒和文字，进入“行”中；
2. 计算盒在行中的排布；
3. 计算行与行之间的排布。

- **IFC，inline-level-formatting-context 块级格式化上下文**
  - inline-box：行内级盒
  - line-box：行级盒
- **BFC，block-level-formatting-context 行内级格式化上下文**
  - block-level-box：块级盒

![正常流](source/正常流.png)

## 3. 正常流的行级分布

核心：基线 Baseline。文本 Text。

<img src="source/text.png" alt="text" style="zoom: 50%;" />

<img src="source/行模型.png" alt="行模型" style="zoom:33.3%;" />

```html
<div class="background">
    <div class="baseline">
        <div class="color"></div>
    </div>
    <span>Hello Moxy 👋 你好吗</span>
    <div class="layout"></div>
</div>

<style>
    .background {
        font-size: 50px;
        line-height: 100px;
        background-color: pink;
    }
    .baseline {
        vertical-align: middle;
        overflow: visible;
        display: inline-block;
        width: 1px;
        height: 1px;
    }
    .color {
        width: 1000px;
        height: 1px;
        background-color: red;
    }
    .layout {
        /* vertical-align: text-top; */
        line-height: 70px;
        width: 100px;
        height: 150px;
        background-color: aqua;
        display: inline-block;
    }
    
</style>
```

以下方式，都会改变行内盒layout 与行高之间的关系。日常推荐使用 vertical-align来规范行内盒的基线对齐问题。

- HTML：在 layout盒 中，不添加字母、添加1个字母、添加2个字母。
- CSS：在 layout中，添加 vertical-align：text-middle / text-top / text-bottom。



## 4. 正常流的块级分布

### 4.1 铺垫：float

float元素的思考方式：

1. 先把float元素当成是正常流中的元素，排在正常流中；
2. float哪个方向，就让这个元素块朝哪个方向移动，移到边界。假设float:left，移动到最左边；
3. float盒在最左边，则行盒会相应往右移动，让出一个float盒的空间。

### 4.2 铺垫：clear

float盒，不仅会印象它原本所在的正常流中的那一行，还会影响盒高度都覆盖到的那几行。这就会出现一个问题：如果有多个float盒，会出现重叠现象，行内流会被一直挤压。图中四个蓝色方块为float盒，文字部分中，“float”字样，是HTML代码中，原本定义的float盒在正常流中的位置：

![float重叠](source/float重叠.png)

解决办法：在float盒中，CSS 添加使用 clear 属性。下图中，给第3个float盒，添加：`clear:right;`后，如果遇到float盒影响他向右浮动，它会在纵向向下移动寻找一块空地，浮动到最右边。

<img src="source/clear属性.png" alt="clear属性" style="zoom:50%;" />

### 应用：

1. 图中，7个蓝色块都是float：right，则他们的排布很像一个正常流：从左至右依次排布，遇到边界正常返回。

<img src="source/float1.png" alt="float1" style="zoom:50%;" />

2. 如果想换行，使用：`</br>`，无法达到换行效果。因为 br 是正常流中的换行模式，无法影响到float盒，下图中，在第三个盒子后加`</br>`，只能换正常流的一行无法应用到 float盒中。 

<img src="source/float2.png" alt="float2" style="zoom:50%;" />

3. 使用 clear属性，在全是 float的盒子中，效果相当于正常流的`</br>`，达到了换行效果。下图第四个盒子，添加了 clear属性。

<img src="source/float3.png" alt="float3" style="zoom:50%;" />

该方法是古老技术，现在几乎都在使用 Flexbox，已经不用该方法了。

### 4.3 Margin Collapse 边距折叠：

- 就是两个BFC块级盒，如果出现两个盒子都有 margin外边距，那这两个边距会互相折叠，折叠后最终的margin高度，由margin最高的盒子决定。
  - **注意：IFC、flex、grid都不会发生 Margin Collapse。**因为边距折叠只会发生在一个BFC中，如果创建了新的BFC，就不会发生边距折叠。
  - 注意：只有正常流中的BFC会发生边距折叠。

<img src="source/margin collapse.png" alt="margin collapse" style="zoom:50%;" />



## 5. BFC合并

### 5.1 Block

- Block Container：里面能装BFC的盒子，也就是能容纳正常流的盒子，就能容纳 BFC。
- Block-level Box：能放进BFC里的盒子，也就是这个盒子外面可以有 BFC。
- Block Box = Block Container + Block-level Box  ，换句话说：  
  - 里外都有BFC的盒子 = 里面有BFC的盒子 + 外面有BFC的盒子

### 5.2 Block Container

以下都是 Block Container：

一个重要的判断依据：这些盒子的里面是不是可以有正常流。

- block
- inline-block
- table-cell
- flex item：flex盒的子项目。
- grid cell：grid的子项目。
- table-caption：表格的标题。

以下都不是 Block Container：

- table-row：不是 Block Container，因为它里面是 table-cell，不是正常流。
- display: flex：不是 Block Container，它的子项目是。
- ... 

### 5.3 Block-level Box

这里顺带一提，display通常有两对值，块级 / 行内级 两种都有对应关系。

<img src="source/Block-level Box.png" alt="Block-level Box" style="zoom:33.3%;" />

### 5.4 设立 / 创建 BFC（4类）

什么情况，什么类型的盒，会创建一个 BFC？

- floats：浮动盒会创建，浮动盒里面的是一个正常流。
- absolutely positioned elements：绝对定位的元素，也会创建BFC。
- block containers：能放BFC的盒子都可以。Block-level Box不可以。
- block boxes with 'overflow' other than 'visible'：overflow属性值是：hidden、scroll、auto、inherit。

换一种记忆方式：

- block box   && `overflow:visible`
- 翻译：默认可以容纳正常流的盒都可以创建BFC +  Block Box 里外都是BFC，同时 `overflow:visible`。

### 5.5 BFC合并

- BFC合并与float：如果给文字流创建了新的BFC，文字流就不会再发生流动。
  - 下图中，左图粉色盒`overflow:visible`，右图中粉色盒`overflow:hiddlen`会发生创建BFC，文字流不会流动到float盒。
- BFC合并与边距折叠  
  - 如果创建了BFC，不在同一个BFC中，就不会发生边距折叠。在同一个BFC中，就会发生边距折叠。

## 6. Flex排版

排版的第二代技术，Flex。

排版逻辑：

- 收集**盒**进行(háng)
- 计算**盒**在主轴方向的排布
- 计算**盒**在交叉轴方向的排布

详情：见  Flex.md。



# 四、CSS动画与绘制



## 1. 动画

### 1.1 Animation

-  @keyframes 定义
- animation：使用

下列代码中，会生成一个无限循环的，从黄色变红色的方块。

```html
<style>
    @keyframes mykf {
        from {background: red;}
        to {background: yellow;}
    }
    div {
        animation: mykf 5s infinite;
    }
</style>

<div style="width: 100px; height: 100px;"></div>
```

#### 属性（6）

- animation-name：时间曲线（@keyframes）
- animation-duration：动画的时长
- animation-timing-function：动画的时间曲线
- animation-delay：动画开始前的延迟
- animation-iteration-count：动画的播放次数
- animation-direction：动画的方向（正向/倒向）

#### @keyframes 的定义

```css
/* 可以使用百分比 */
@keyframes mykf {
  0% {top: 0; transition: top ease}
  50% {top: 30px; transition: top ease-in}
  75% {top: 10px; transition: top ease-out}
  100% {top: 0; transition: top linear}
}

/* 可以使用 from..to */
@keyframes mykf {
  from { .. }   /* 相当于 0% */
  to { .. }     /* 相当于 100% */
}
```



### 1.2 Transition

#### 属性（4）

- transition-property：要变换的属性
- transition-duration：变换的时长
- transition-timing-function：时间曲线
  - 来自于三次贝塞尔曲线。https://cubic-bezier.com/
    - ease：缓动曲线
    - ease-in：缓动启动（用于退出动画，某个元素离开屏幕）
    - ease-out：缓动停止（进入动画，某个元素出现在屏幕中）
- transition-delay：延迟

贝塞尔曲线的拟合：

- 直线
- 抛物线
- 近圆（不可以完美拟合圆形，只能分段拟合，不断接近圆形）



## 2. 渲染 & 颜色

RGB：红、绿、蓝。减色模型（相加为白）

CMY：青、品、黄。加色模型（相加为黑）

- CMYK：在印刷中，为了省原料，K 代表黑色的墨，来调节整体的黑色成分（灰度）

<img src="source/image-20201123213223259.png" alt="image-20201123213223259" style="zoom: 50%;" />

HSL：色相、纯度 + Lightness 亮度。

- Lightness（0% 黑色 -- 100% 白色），想要取纯色，可能要在中间找。

HSV：色相、纯度 + Value -> Brightness 明度。

- Value（0% 黑色 -- 100% 纯色 / 非常鲜艳）

<img src="source/image-20201123213256758.png" alt="image-20201123213256758" style="zoom:67%;" />



W3C 最终选择了 HSL。



## 3. 绘制

#### 3.1 几何图形

- border
- box-shadow
- border-radius

#### 3.2 文字

- font
- text-decoration

#### 3.3 位图

- background-image

##### 应用技巧

- data uri + svg
- `data:image/svg+xml,<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"><ellipse cx="300" cy="150" rx="200" ry="80" style="fill:rgb(200,100,50);stroke:rgb(0,0,100);stroke-width:2"/> </svg>`

<img src="source/image-20201124000427024.png" alt="image-20201124000427024" style="zoom:50%;" />





 