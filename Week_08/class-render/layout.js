function getStyle(element){
    if(!element.style)
        element.style = {};
    
        
    for(let prop in element.computedStyle){
        element.style[prop] = element.computedStyle[prop].value;

        if(element.style[prop].toString().match(/px$/))
            element.style[prop] = parseInt(element.style[prop]);
        if(element.style[prop].toString().match(/^[0-9\.]+$/))
            element.style[prop] = parseInt(element.style[prop]);
    }
    return element.style;
}
function layout(element){
    if (!element.computedStyle)
        return;
    
    // 对style进行预处理：属性、类似px的属性，变成纯数字；转换字符串到数字类型等等。
    let elementStyle = getStyle(element);
     
    if(elementStyle.display !== 'flex')
        return;
    
    var items =element.children.filter(e => e.type === 'element');

    //items.sort 是为了支持order属性
    items.sort((a,b) => {return (a.order || 0) -(b.order || 0)});

    var style = elementStyle;

    // 下面是主轴和交叉轴的处理
    ['width', 'height'].forEach(size =>{
        if(style[size] === 'auto' || style[size] === ''){
            style[size] = null;
        }
    })

    // 设置默认值
    if(!style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row';
    if(!style.alignItems || style.alignItems === 'auto')
        style.alignItems = 'stretch';
    if(!style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = 'flex-start';
    if(!style.flexWrap || style.flexWrap === 'auto')
        style.flexWrap = 'nowrap';
    if(!style.alignContent || style.alignContent === 'auto')
        style.alignContent = 'stretch';

    // main 主轴
    // mainSize 主轴尺寸
    // mainStart， mainEnd 主轴的边界（包含了方向问题）
    // mainSign 正负1
    // mainBase 从左/从右开始
    var mainSize, mainStart, mainEnd, mainSign, mainBase, 
        crossSize, crossStart, crossEnd, crossSign, crossBase;
    
    if(style.flexDirection === 'row'){
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if(style.flexDirection === 'row-reverse'){
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if(style.flexDirection === 'column'){
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexDirection === 'column-reverse'){
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexWrap === 'wrap-reverse'){
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    }else{
        crossBase = 0;
        crossSign = 1;
    }


    // 处理特殊情况：
    // 如果父元素没有设置主轴尺寸 那么那就进入AtuoMainSize模式 
    var isAutoMainSize = false;
    if(!style[mainSize]){ //Auto sizing
        elementStyle[mainSize] = 0;
        for(let i = 0 ;i<items.length; i++){
            let item = items[i];
            if(itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0))
                elementStyle[mainSize] = elementStyle[mainSize]+itemStyle[mainSize];
        }
        isAutoMainSize = true; 
        // style.flexWrap =  'nowrap';
    }

    var flexLine = [];
    var flexLines = [flexLine];

    var mainSpace = elementStyle[mainSize]; 
    var crossSpace = 0; 

    for(var i = 0; i < items.length; i++){
        var item = items[i];
        var itemStyle = getStyle(item);
    
        if(itemStyle[mainSize] === null){
            itemStyle[mainSize] = 0;
        }
    
        if(itemStyle.flex){
            flexLine.push(item); 
        }else if(style.flexWrap === "nowrap" || isAutoMainSize){

            mainSpace -= itemStyle[mainSize];
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]); 
            flexLine.push(item);
        }else{
            if(itemStyle[mainSize] > style[mainSize]){

                itemStyle[mainSize] = style[mainSize];
            }
            if(mainSpace < itemStyle[mainSize]){

                flexLine.mainSpace = mainSize;
                flexline.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            }else{
                flexLine.push(item);
            }
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
    
            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

  
    // 主轴方向的计算
    if(style.flexWrap === 'nowrap' || isAutoMainSize){
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    }else{
        flexLine.crossSpace = crossSpace;
    }

    if(mainSpace  < 0){
        //overflow单行 所有元素进行等比压缩
        var scale = style[mainSize] / (style[mainSize] - mainSpace);
        var currentMain = mainBase;
        for(var i = 0; i < items.length; i++){
            var item = items[i];
            var itemStyle = getStyle(item);

            if(itemStyle.flex){
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign*itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }

    }else{
        // process each flex line
        flexLines.forEach(function (items) {

            var mainSpace = items.mainSpace;
            var flexTotal = 0;
            for(let i=0; i<items.length; i++){
                let item =items[i];
                let itemStyle = getStyle(item);

                if((!itemStyle.flex !== null) && (itemStyle.flex !== (void 0))){
                    flexTotal += itemStyle.flex; 
                  
                }
            }

            if(flexTotal > 0){
                // There id flexible flex items
                let currentMain = mainBase;
                for(let i = 0; i<items.length; i++){
                    let item =items[i];
                    let itemStyle = getStyle(item);

                    if(itemStyle.flex){
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }

                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign*itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            }else{
                // there is *NO* flexible flex item, which means justifyContent should work ..
                if(style.justifyContent === 'flex-start'){
                    var currentMain = mainBase;
                    var step = 0;
                }

                if(style.justifyContent === 'flex-end'){
                    var currentMain =mainSpace * mainSign + mainBase;
                    var step = 0;
                }

                if(style.justifyContent === 'center'){
                    var currentMain =mainSpace / 2 * mainSign + mainBase;
                    var step = 0;
                }

                if(style.justifyContent === 'space-between'){
                    var step = mainSpace / (items.length - 1) * mainSign;
                    var currentMain = mainSpace;
                }

                if(style.justifyContent === 'space-around'){
                    var step = mainSpace / items.length * mainSign;
                    var currentMain = step / 2 + mainBase;
                }
                if(style.justifyContent === "space-evenly"){
                    var step = mainSpace / (items.length + 1) * mainSign;
                    var currentMain = step + mainBase;
                }

                for(let i=0; i<items.length; i++){
                    let item = items[i];
                    let itemStyle = getStyle(item);

                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;

                }
            }


        })

    }

        // 交叉轴的计算：
    // 容器的交叉轴剩余尺寸
   var crossSpace;

    // 照顾特殊情况：如果容器元素没写交叉轴尺寸
   if(!style[crossSpace]){ //auto sizing
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for(let i= 0 ; i < flexLines.length; i++){
            // 容器的交叉轴尺寸 == 各行交叉轴尺寸之和
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
        }
   }else{
       crossSpace = style[crossSize];
       for(let i = 0;i < flexLines.length ; i++){
           crossSpace -= flexLines[i].crossSpace;
       }
   }

 // 处理flex-wrap，如果是wrap-reverse，交叉轴起点是容器的交叉轴尺寸
   if(style.flexWrap === 'wrap-reverse'){
       crossBase = style[crossSize];
   }else {
       crossBase = 0;
   }
// align-content 确定每行的位置
   var lineSize = style[crossSize] / flexLines.length;
   var step;

   if(style.alignContent === 'flex-start'){
       crossBase += 0;
       step = 0;
   }

   if(style.alignContent === 'flex-end'){
        crossBase += crossSign * crossSpace;
        step = 0;
    }

    if(style.alignContent === 'center'){
        crossBase += crossSign * crossSpace /2;
        step = 0;
    }
    
    if(style.alignContent === 'space-betwwen'){
        crossBase +=0; 
        step = crossSpace / (flexLines.length -1);
    }

    if(style.alignContent === 'space-around'){

        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }

    if(style.alignContent === 'stretch'){
        crossBase +=0;
        step = 0;
    }
    // 处理 algin-items 和 align-self，确定每个元素在每行里的位置
    flexLines.forEach((items) => {
        var lineCrossSize = style.alignContent === "stretch" ? 
        items.crossSpace + crossSpace / flexLines.length :
        items.crossSpace;

        for(let i = 0; i <items.length; i++){
            let item = items[i];
            let itemStyle = getStyle(item);

            let align = itemStyle.alignSelf || style.alignItems;

            if(itemStyle[crossSize] === null)
                itemStyle[crossSize] = (align === 'stretch') ?
                lineCrossSize : 0;
            
         if(align === "flex-start"){
            itemStyle[crossStart] = crossBase;
            itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }
        if(align === "flex-end"){
            itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
            itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
        }

        if(align === "center"){
            itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
            itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }


            if(align === 'stretch'){
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))? itemStyle[crossSize] : lineCrossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    })
    // console.log(items+'cross')

}

module.exports = layout;