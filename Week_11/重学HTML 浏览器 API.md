# 1. HTML的定义：XML与SGML

## 1.1 DTD 与 XML namespace

http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd

http://www.w3.org/1999/xhtml

### 1.1.1 DTD

#### nbsp转义符

-  no-break space。不要在HTML中，使用 nbsp 达到体现空格的效果。因为 nbsp 本质的含义是：两个单词之间没有空间，直接链接。所以如果使用了 nbsp，两个单词看似是空开了，但是在语义上，这两个单词是连在一起的。会影响排版。
- 解决：如果要体现空格。要从 CSS 入手：white-space 属性，显示空格。

#### 记忆，在HTML要使用转义符，不能直接在HTML敲出：

- &quot：双引号（quotation mark）

- &amp ： & 符（ampersand）

- &lt ：< 号（less-than sign）

- &gt ：> 号（greater-than sign）

  ```html
  <!-- 举例：假设下列代码需要HTML-->
  <p> Hello World! </p>
  <p> Happy Code Every Day! </p>
  
  <!-- 写入网页中 -->
  <code>
    &lt;p> Hello World! &lt;/p>
  	&lt;p> Happy Code Every Day! &lt;/p>
  <code>
  ```

  

# 2. HTML 标签语义

语义化 wiki 某页时，看到的技巧：

- HTML在编写时，要从大到小到排布标签。同时暂时不要考虑任何非结构的东西（css的部分不要管）。甚至空格，回车这些也用不着去理会。只专注HTML结构、语义的问题。

- 当没有一个确切的标签去处理语义的时候，用 class="xxx" 补充说明。
  - ​	`<p class="note">注记：一段斜体注释，没有合适的标签表示</p>



# 3. HTML 语法

**合法元素**

- Element：`<tagname> ... </tagname>`
- Text:` Text`
- Comment: `<!-- comments -->`
- DocumentType: `<!Doctype html>`
- ProcessingInstruction: `<?a 1?>`    预处理
- CDATA: `<![CDATA[]]>`



# 1. 事件 API ｜ 浏览器 API

参考：[MDN:事件](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

`EventTarget.addEventListener()`

### 1.1 语法：

- ` target.addEventListener(type, listener [, options]);`
- `target.addEventListener(type, listener [, useCapture]);`
- `target.addEventListener(type, listener [, useCapture, wantsUntrusted]);`

参数：

- type
  - 监听事件的类型
- listener
  - 回调函数。当监听事件被触发时，会调用该函数 / Event接口的对象。
- options 可选
  - capture：Boolean，在捕获阶段 (true) / 冒泡阶段 (false 默认) 触发该事件。
  - once：Boolean，只触发一次 (true) / 触发多次 (false 默认) 。true 触发一次后，会移除该事件监听。
  - passive：Boolean，`listener`永远不会调用`preventDefault()` (true)，会调用 (false 默认)。
    - true，定义一个不会产生副作用的事件， 当使用 onScroll 滚动，这样高频次触发的事件，会提升性能。
    - false，可以设置阻止事件的默认行为。

### 1.2 冒泡和捕获

任何一个事件，在冒泡和捕获两个阶段，都会被监听。

 先捕获、后冒泡。从外到内，从内而外。先捕获，就是让浏览器从外到内去计算，找到用户鼠标点击的那个元素，到底是哪一层的。默认是得到冒泡的事件监听，更符合人的直觉，点到里面的元素，一层层传递到外部 。



# 2. DOM API ｜ 浏览器 API

browser API 浏览器 API

DOM的四类 API

- traversal API：废弃不用。
- Node API：最重要、常用的。
- 事件 API：常用。
- Range API：应用性差，过于专业。

<img src="source/image-20201129165411667.png" alt="image-20201129165411667" style="zoom:70%;" />



### 2.1 导航类操作

节点类：

- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling
- previousSibling

元素类，会忽略文本节点：

- prentElement：和 parentNode 完全相同，有子节点的节点，一定是 element。
- children
- firstElementChild
- lastElementChild
- nextElementSibling
- previousElementSibling

### 2.2 修改类操作

- appendChild
- insertBefore
- removeChild
- replaceChild

### 2.3 高级操作

- compareDocumentPosition：一个用于比较两个节点中关系的函数，得到一个前后的关系。

- contains：检查一个节点是否包含另一个节点的函数。
- isEqualNode：检查两个节点是否完全相同。
- isSameNode：废用。检查两个节点是不是同一个节点(地址相同)，实际上在 JavaScript 中可以用 "==="。
- cloneNode：复制一个节点，如果传入参数 true，则会连同子元素做深拷贝。



# 3. Range API ｜ 浏览器 API

对 DOM操作的万能 API。

掌握 Range API，就是 DOM API 掌握程度的一个最高标志。能灵活的运用 fragment 和 Range API 可以实现任何对 DOM 树的精确操作，像一把细致的手术刀。

### 3.1 一个问题

把一个元素的所有的子元素逆序。

```jsx
element 1						element 5
element 2						element 4
element 3		 =>			element 3
element 4						element 2
element 5						element 1
```

- 方法0：原生态的糙方法

- 方法1：普通 DOM API
  - 考点1：
    - DOM Collection 是动态的。
    - insert 操作。对一个元素改变位置的时候，只需要一个insert操作即可，不需要先remove下来。insert会先对该元素执行remove，把它从原位置摘下来，然后执行append，追加到新位置。
- 方法2：使用 Range API，进行高效操作。
  - 考点2：只使用两次 DOM 操作就可以完成任务，减少了网页重排次数，提高性能。

```html
<!-- HTML 结构 -->
<div id="a">
    <span>1</span>
    <p>2</p>
    <a>3</a>
    <div>4</div>
</div>


<!-- 方法一, DOM API 也不会用 -->
<script>
let element = document.getElementById("a");

function reverseChildren(element) {
    // 把 childNodes 变成普通的数组。这样，它不会再随着 insert remove 这些操作，去改变自己。
    // 因为Array不是一个 living collection，不是动态集合。
    let children = Array.prototype.slice.call(element.childNodes);


    for (let child of children) {
        element.removeChild(child);
        // element.innerHTML = "";
    }
    children.reverse();
    for (let child of children) {
        element.appendChild(child);
    }
}
  
reverseChildren(element);
</script>


<!-- 方法二, 使用 DOM API -->
<!-- 进行了3次DOM操作(3次插入)，有3次网页重排 -->
<script>
    let element = document.getElementById("a");

    function reverseChildren(element) {
        // 记录长度，ChildrenNodes 是一个 living collection
        var l = element.childNodes.length;
        // l 自减，第一次循环前，就会减1，变成 "childrenNodes.length - 1"
        // 因为是一个 living collection，每次循环，把最末的元素移到最前即可。
        while(l --> 0) {
            element.appendChild(element.childNodes[l])
        }
    }

    reverseChildren(element);
</script>

<!--
 * 使用 Range API
 * 最终答案
 * 两次DOM操作：把节点拿下来（第一次），反转后，把节点放上去（第二次）
 * 反转元素：在 fragment对象 中进行三次插入，提高性能。
 * 因为直接在DOM树中进行插入操作，每次DOM操作，都会进行一次重排，对性能造成影响。
-->
<script>
    let element = document.getElementById("a");

    function reverseChildren(element) {
        let range = new Range();
        range.selectNodeContents(element);

        let fragment = range.extractContents();
        var l = fragment.childNodes.length;
        while(l --> 0) {
            fragment.appendChild(fragment.childNodes[l]);
        }
        element.appendChild(fragment);
    }

    reverseChildren(element);
</script>
```

#### 综上：

`range` 和 `fragment`，是一对好基友。 range 负责从DOM树中摘取节点、franment负责对节点进行操作，然后再 append到DOM树中。该方法相比直接在 DOM树中操作，极大的提高了网页性能。



### 3.2 Range API

#### 1 创建

Range 是一个范围，在DOM树中，代表了一个范围内的元素。所以需要起点（setStart）和终点（setEnd），都通过一个element + 相应偏移值（文字个数）确定。因为是文字节点代表偏移值，所以它有可能只包含了半个节点。

```jsx
ver range = new Range();
range.setStart(element, 9);
range.setEnd(element, 4);
var range = document.getSelection().getRangeAt(0);
```

#### 2 常用选择方法

```jsx
range.setStartBefore
range.setEndBefore
range.setStartAfter
range.setEndAfter
range.selectNode          // 选中一个元素
range.selectNodeContents  // 选中一个元素的所有内容
```

#### 3 操作元素的方法

删除 / 添加

```jsx
// 1. 删除 extractContexts()
// 把range选中的内容，从DOM树中摘下，保存到fragment对象中。
// fragment对象，可以保存一系列元素（有父子关系），可以直接把它append到DOM树中，对象自身不会添加到DOM树，而是会把其全部子节点放入其中。
var fragment = range.extractContexts() 

// 2. 添加 createTextNode()
// 在range位置，插入新节点。
range.insertNode(document.createTextNode("aaaa"))  
```



#### 4 举例1：

利用 Range API，删除了123456789 和 012。

- 确定选中的内容，就用 光标 + 偏移量 的概念来看。不要用 "第几个文本，是否包含该文本" 这样的思路。

```html
<div id="a">123<span style="background-color: pink;">456789</span>0123456789
</div>
<script>
    let range = new Range();
  	// 从第一个子节点（123文本节点）的 3后面 开始（偏移3位）。
    range.setStart(document.getElementById("a").childNodes[0], 3);
  	// 从第三个子节点（0123456789文本节点）的 2,3 之间截止（偏移3位）。
    range.setEnd(document.getElementById("a").childNodes[2], 3);
</script>
```

Console执行：

- `range.extractContents();`

- 返回了一个 fragment 对象，里面保存着选中后，摘取的DOM节点：

```jsx
#document-fragment
	"123"
	<span style="background-color: pink;">456789</span>
	"012"
```

#### 5 举例2:

利用 Range API，删除结构中 span标签内的一部分内容，而不删除 span 标签本身。

- 如果删除了 span 元素的借鼠标签，没关系，浏览器会默认补上一个结束标签。

```html
<div id="a">123<span style="background-color: pink;">456789</span>0123456789
</div>
<script>
	let range = new Range();
  // 开始：span中的6,7之间。
  // 结束：span标签后面的 2,3 之间。
  range.setStart(document.getElementById("a").childNodes[1].childNodes[0], 3);
  range.setEnd(document.getElementById("a").childNodes[2], 3);
</script>
```

Console执行：

- `range.extractContents();`
- 返回了一个 fragment 对象，里面保存着选中后，摘取的DOM节点：

```jsx
#document-fragment
	<span style="background-color: pink;">456789</span>
	"012"
```

在浏览器中，此时的DOM树：

- 注意 span 结束标签添加的位置。

```html
<div id="a">
  123
  <span style="background-color: pink;">456</span>
  3456789
</div>
```



# 4. CSSOM ｜ 浏览器 API

浏览器 API，不是 DOM API。

DOM API，可以理解为一个 HTML 语言的对象化，和 HTML 中元素经常是对等的概念。所以，DOM 是对一个 HTML所描述的文档的一个抽象。

CSSOM，就是一个对 CSS 文档的一个抽象。

### 4.1 document.styleSheets

严格来说，CSSOM也是需要 DOM API 去进行访问的。CSS 代码是嵌在 HTML 代码中的。document.styleSheets，就是 CSSOM一切的起点。

styleSheets 就代表一个样式表，它对应着一个 CSS 的 link 标签，或者一个 style 标签。

#### 举例

主要有两类 CSS 标签：一个是网页中`<style>`元素包裹的CSS；一个是`<link>`元素链接的地址中的CSS。

- 这里的 link 标签中，为了方便使用了data uri，直接把文本转义为地址，所以{大括号}需要转移字符：`%7B` 和 `%7D`

```html
<style title="Hello">
  a::before {
    color: red;
    content: "Hello";
  }
</style>

<link rel="stylesheet" title="x" href="data:text/css,p%7Bcolor:blue%7D">
<a> world</a>

<!-- 键入：document.styleSheets -->
StyleSheetList {0: CSSStyleSheet, 1: CSSStyleSheet, length: 2}
0: CSSStyleSheet {ownerRule: null, cssRules: CSSRuleList, rules: CSSRuleList, type: "text/css", href: null, …}
1: CSSStyleSheet {ownerRule: null, cssRules: CSSRuleList, rules: CSSRuleList, type: "text/css", href: "data:text/css,p%7Bcolor:blue .......
```

### 4.2 Rules

Rules 是 styleSheets 的一个子类。styleSheets里面有 CSSRules 是一个类数组的 collection，取出所有 CSS 相关代码。

- styleSheets ：代表一个样式表，它对应着一个 CSS 的 link 标签，或者一个 style 标签。
- Rule ：一个样式表有若干条 rule，每个 rule 就是一个 CSS 规则。
  - insertRule、removeRule 可以控制样式表中的规则。

```jsx
// 显示所有 rule
document.styleSheet[0].cssRules

// 插入一段CSS代码
// 参数1:string，代码。参数2:位置
document.styleSheet[0].insertRule("p {color:pink;}", 0) 

// 删除一段CSS代码
// 参数：位置
doucment.styleSheet[0].removeRule(0)    
```

#### 4.2.1 回顾：Rule 的分类

- CSSStyleRule（普通 rule）

- at-rule

通常可以这样记忆：CSS里的语法有什么，CSSCOM就有什么，基本是一一对应的。

- CSSStyleRule：重点。
- CSSCharsetRule
- CSSImportRule
- CSSMediaRule
- CSSFontFaceRule
- CSSPageRule
- CSSNamespaceRule
- CSSKeyframesRule
- CSSKeyframeRule
- CSSSupportsRule
- ...

#### 4.2.2 回顾：Rule 的结构 

- CSSStyleRule
  - selectorText String
  - style K-V 结构



**举例**：改变元素的颜色。

- 伪元素是无法通过 DOM API访问的，最开始的举例中，红色的 Hello就是一个伪元素，必须通过 CSSOM来改变：

```jsx
document.styleSheets[0].cssRules[0].style.color = "lightgreen";
// 颜色就会改为亮绿色。
```



### 4.3 getComputedStyle

ComputedStyle是无法通过 DOM API 获取的。这是在 浏览器对CSS做了计算之后，最终显示的样式。通过  getComputedStyle就可以获取。也可以获取伪元素。

- window.getComputedStyle(elt, pseudoElt);
  - elt 想要获取的元素
  - pseudoElt 可选，伪元素

```jsx
// 键入：
getComputedStyle(document.querySelector("a"))
// 获取了所有对 a 元素应用的属性(计算出来的属性)
CSSStyleDeclaration { ... ... }

// 键入：
getComputedStyle(document.querySelector("a"),"::before")
// 获取了所有对 a 元素的伪类应用的属性(计算出来的属性)
CSSStyleDeclaration { ... ... }

// 键入：
getComputedStyle(document.querySelector("a"),"::before").color
// 返回之前设置的 a::before 的颜色，是lightgreen。
"rgb(144, 238, 144)"
```



# 5. CSSOM View ｜ 浏览器 API

CSSOM View 与浏览器最终画在页面到视图相关。

浏览器在完成了 layout排版、Range修改之后，渲染出来的CSS图形，也会加入一些其他属性。利用 CSSOM View 可以获取到最终的视图信息。

### 5.1 window API

- window.innerHeight, window.innerWidth
  - ViewPort。HTML 内容，实际上渲染所用的区域。宽度和高度。
- window.outerWidth, window.outerHeight
  - 是浏览器窗口总共所占的尺寸。包含了浏览器自带的工具栏、inspector占的空间，用处不大。
- window.devicePixelRatio
  - DPR。屏幕上的物理像素，和CSS代码中的逻辑像素px之间比值。正常是 1:1，Retina屏上是1:2，有些安卓机是1:3。
- window.screen 不常用。
  - window.screen.width
  - window.screen.height
    - 实际上屏幕的宽和高，包括了刘海屏的内容。
  - window.screen.availWidth
  - window.screen.availHeight
    - 程序可以使用的宽和高，不是浏览器可以使用的。有些刘海平安卓机，顶端的屏幕是不允许程序使用的。



总结：常用的API

```jsx
window.innerHeight
window.innerWidth
window.devicePixelRatio
```



### 5.2 window API

当需要开一个新的浏览器窗口时，使用的API。

- window.open("about:blank", "_blank","width=100,height=100.left=100,right=100" )
- moveTo(x, y)
- moveBy(x, y)
- resizeTo(x, y)
- resizeBy(x, y)
  - move 改变位置
  - resize 改变尺寸

**举例：**定义三个按钮🔘

- open window：打开一个100x100px的窗口
- resize：增加窗口尺寸
- move：移动窗口位置

```html
<button id="open" onclick="window.w = window.open('about:blank', '_blank' ,'width=100,height=100,left=100,right=100')">open window</button>
<button onclick="w.resizeBy(30, 30)">resize</button>
<button onclick="w.moveBy(30, 30)">move</button>
```



### 5.3 scroll API

在有滚动条的时候，这些API会生效。

- scrollTop
- scrollLeft
  - top、left：获取当前滚动到的位置。
- scrollWidth
- scrollHeight
  - width、height：获取可滚动内容的最大宽度和高度。
- scroll(x, y)            
  - 令画面滚动到特定的位置，别名“scrollTo”
- scrollBy(x, y)
  - 滚动一个差值？
- scrollIntoView()
  - 强制滚动到屏幕的可见区域



Window：由于历史原因，相同类型的功能：scrollX 和 scrollY 明明不同，不是 top、left注意区分。

- scrollX
- scrollY
- scroll(x, y)
- scrollBy(x, y)



### 5.4 layout API

- getClientRects()
  - 在 element 上，可以用该方法，获取它所生成的 boxes 的具体尺寸和位置。
- getBoundingClientRect()
  - 如果不想获得多个盒，只是想要一个整体，包含了该 element 生成的全部内容，可以用此方法在 element上，用该方法，获取它所生成的 boxes 包含的区域，是一个整体。

```html
<style>
    .x::before {
        content:"额外 额外 额外 额外 额外 额外 额外 额外";
        background-color: pink;
    }
</style>
<div style="width: 100px;height: 400px;overflow: scroll;">
    文字 <span class="x" style="background-color: lightblue;">文字 文字 文字 文字 文字 文字 文字</span>
</div>
<script>
    var x = document.getElementsByClassName("x")[0];
</script>
```

下图中，左侧是代码显示的HTML效果。可以看到，有颜色的部分，每一行都会生成一个盒子：粉色背景的“额外”，是span元素的伪元素区域，是 x::before 伪元素；蓝色背景是 span 元素的content区域。

- 键入：`x.getClientRects()`，可以获得这个 span 元素生成的所有盒。一共有 8 个盒子，因为是 inline-level elements，所以遵循 IFS 每一行是一个 line box，一共 8 行，8 个 line box。

- 伪元素也参与到盒生成的计算中，因为伪元素虽然在页面中无法被选中，但是肯定是被 CSS 渲染出来的。
- 键入：`x.getBoundingClientRect()`，显示的区域就是生成盒子的全部区域。

![image-20201130175054859](source/image-20201130175054859.png)



## 6 其他 API ｜ 浏览器 

浏览器 API 的来历，主要是 W3C 和 ECMA 两个组织。但是还有其他方向也有，四大标准化组织：

- khronos
  - WebGL
- ECMA
  - ECMAScript
- WHATWG
  - HTML
- W3C
  - webaudio
  - Community Group 社区组 / Working Group 工作组

### 6.1 🧪：全部的 API 的分类和整理

见：myapis.html

```html
<script>
    // 获取 window 上所有的属性名。
    // names一共有981个属性，其中有很多JavaScript中的对象，需要过滤掉。
    let names = Object.getOwnPropertyNames(window);
    
    function filterOut(names, props) {
        let set = new Set();
        props.forEach(o => set.add(o));
        return names.filter(e => !set.has(e));
    }
    
    // ECMA 262
    // 首先过滤掉Javascript中的对象，剩余876个属性。
    {
        let js = new Set();
        let objects = ["globalThis", "console", "BigInt", "BigInt64Array", "BigUint64Array", "Infinity", "NaN", "undefined", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Array", "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet", "Function", "Boolean", "String", "Number", "Symbol", "Object", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "ArrayBuffer", "SharedArrayBuffer", "DataView", "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint16Array", "Uint32Array", "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect", "escape", "unescape"];
        objects.forEach(o => js.add(o));
        // 过滤掉js集合中包含的成员。
        names = names.filter(e => !js.has(e));
    }
    
    
    // 过滤出DOM API中，Node 相关 API，这些都是已知的。
    names = names.filter( e => {
        try { 
            return !(window[e].prototype instanceof Node)
        } catch(err) {
            return true;
        }
    }).filter( e => e != "Node");
    
    // events 事件都是以 on 开头的，全部过滤掉。
    names = names.filter( e => !e.match(/^on/))
    
    // webkit private，webkit的都是私有属性，以开头方式过滤掉。
    names = names.filter( e => !e.match(/^webkit/))
    
    // HTML window，来自 whatwg 的相关属性。在HTML规范中已经有的，按照关键字直接过滤掉。
    //https://html.spec.whatwg.org/#window
    {
        let names = Object.getOwnPropertyNames(window)
        let js = new Set();
        let objects = ["BigInt", "BigInt64Array", "BigUint64Array", "Infinity", "NaN", "undefined", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Array", "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet", "Function", "Boolean", "String", "Number", "Symbol", "Object", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "ArrayBuffer", "SharedArrayBuffer", "DataView", "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint16Array", "Uint32Array", "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect", "escape", "unescape"];
        objects.forEach(o => js.add(o));
        names = names.filter(e => !js.has(e));
    
        names = names.filter( e => {
            try { 
                return !(window[e].prototype instanceof Node)
            } catch(err) {
                return true;
            }
        }).filter( e => e != "Node")
    
        let windowprops = new Set();
        objects = ["window", "self", "document", "name", "location", "history", "customElements", "locationbar", "menubar", " personalbar", "scrollbars", "statusbar", "toolbar", "status", "close", "closed", "stop", "focus", " blur", "frames", "length", "top", "opener", "parent", "frameElement", "open", "navigator", "applicationCache", "alert", "confirm", "prompt", "print", "postMessage", "console"];
        objects.forEach(o => windowprops.add(o));
        names = names.filter(e => !windowprops.has(e));
    }
    
    //https://html.spec.whatwg.org/
    {
        let interfaces = new Set();
        objects = ["ApplicationCache", "AudioTrack", "AudioTrackList", "BarProp", "BeforeUnloadEvent", "BroadcastChannel", "CanvasGradient", "CanvasPattern", "CanvasRenderingContext2D", "CloseEvent", "CustomElementRegistry", "DOMStringList", "DOMStringMap", "DataTransfer", "DataTransferItem", "DataTransferItemList", "DedicatedWorkerGlobalScope", "Document", "DragEvent", "ErrorEvent", "EventSource", "External", "FormDataEvent", "HTMLAllCollection", "HashChangeEvent", "History", "ImageBitmap", "ImageBitmapRenderingContext", "ImageData", "Location", "MediaError", "MessageChannel", "MessageEvent", "MessagePort", "MimeType", "MimeTypeArray", "Navigator", "OffscreenCanvas", "OffscreenCanvasRenderingContext2D", "PageTransitionEvent", "Path2D", "Plugin", "PluginArray", "PopStateEvent", "PromiseRejectionEvent", "RadioNodeList", "SharedWorker", "SharedWorkerGlobalScope", "Storage", "StorageEvent", "TextMetrics", "TextTrack", "TextTrackCue", "TextTrackCueList", "TextTrackList", "TimeRanges", "TrackEvent", "ValidityState", "VideoTrack", "VideoTrackList", "WebSocket", "Window", "Worker", "WorkerGlobalScope", "WorkerLocation", "WorkerNavigator"];
        objects.forEach(o => interfaces.add(o));
    
        names = names.filter(e => !interfaces.has(e));
    }
    
    /////////////////此时，剩余542个属性。////////////////////
    
    // ECMA 402，International API相关标准。Intl过滤掉。
    //http://www.ecma-international.org/ecma-402/5.0/index.html#Title
    names = names.filter(e => e != "Intl")
    
    // khronos组织的 WebGL API 标准。从文档中查阅出关键字，全部过滤掉。
    //https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15
    names = filterOut(names, ["WebGLVertexArrayObject","WebGLTransformFeedback","WebGLSync","WebGLSampler","WebGLQuery","WebGL2RenderingContext","WebGLContextEvent","WebGLObject", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLTexture", "WebGLUniformLocation", "WebGLActiveInfo", "WebGLShaderPrecisionFormat", "WebGLRenderingContext"]);
    
    // 此时检索，发现剩余524个属性，看其中开头的几个属性，发现有声音相关，经过查阅，发现是：
    // W3C的 webaudio标准，按照标准文档中的属性，过滤掉。
    //https://www.w3.org/TR/webaudio/
    names = filterOut(names, ["AudioContext", "AudioNode", "AnalyserNode", "AudioBuffer", "AudioBufferSourceNode", "AudioDestinationNode", "AudioParam", "AudioListener", "AudioWorklet", "AudioWorkletGlobalScope", "AudioWorkletNode", "AudioWorkletProcessor", "BiquadFilterNode", "ChannelMergerNode", "ChannelSplitterNode", "ConstantSourceNode", "ConvolverNode", "DelayNode", "DynamicsCompressorNode", "GainNode", "IIRFilterNode", "MediaElementAudioSourceNode", "MediaStreamAudioSourceNode", "MediaStreamTrackAudioSourceNode", "MediaStreamAudioDestinationNode", "PannerNode", "PeriodicWave", "OscillatorNode", "StereoPannerNode", "WaveShaperNode", "ScriptProcessorNode", "AudioProcessingEvent"]);
    
    // 此时检索，发现剩余495个属性，看其中开头的几个属性，发现有“textEncoderStream”，经过查阅，发现是：
    // whatwg 的标准，按照标准文档过滤掉。
    //https://encoding.spec.whatwg.org/#dom-textencoder
    names = filterOut(names, ["TextDecoder", "TextEncoder", "TextDecoderStream", "TextEncoderStream"]);
    
    // whatwg streams
    //https://streams.spec.whatwg.org/#blqs-class
    names = filterOut(names, ["ReadableStream", "ReadableStreamDefaultReader", "ReadableStreamBYOBReader", "ReadableStreamDefaultController", "ReadableByteStreamController", "ReadableStreamBYOBRequest", "WritableStream", "WritableStreamDefaultWriter", "WritableStreamDefaultController", "TransformStream", "TransformStreamDefaultController", "ByteLengthQueuingStrategy", "CountQueuingStrategy"]);
    
    
    // W3C Community Group 的标准 sync manager API
    //https://wicg.github.io/BackgroundSync/spec/#sync-manager-interface
    names = filterOut(names, ["SyncManager", "Request", "Response"]);
    
    // whatwg Fetch
    // https://fetch.spec.whatwg.org/#headers-class    
    names = filterOut(names, ["Headers"]);

    // whatwg storage
    // https://storage.spec.whatwg.org/#api
    names = filterOut(names, ["StorageManager"]);

    // whatwg XMLHttpRequest
    // https://xhr.spec.whatwg.org/
    names = filterOut(names, ["XMLHttpRequest", "FormData", "ProgressEvent", ""]);


    console.log(names.length);
    console.log(names);
    </script>
```





























