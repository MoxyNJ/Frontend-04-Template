import {Component} from "./framework.js"

export class Carousel extends Component {
    constructor(){
        super();
        this.attributes = Object.create(null);
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    render(){
        // console.log(this.attributes.src);    //  打印一下，看看地址有没有被成功的传递进来
        this.root = document.createElement("div");
        this.root.classList.add("carousel")         // 为这个div添加一个class属性：carousel，为了方便添加CSS属性。
        for(let record of this.attributes.src) {    // 利用let of把照片地址添加到div子元素上 
            let child = document.createElement("div");
            child.style.backgroundImage = `url('${record}')`;    //添加地址到backgroundImage，字符串要转义。
            
            this.root.appendChild(child);
        }

        // 鼠标按下拖动时的相对位置。[0, 1, 2, 3] 是有效位置，没有设置截断值。
        let position = 0;
        // 鼠标拖动功能
        this.root.addEventListener("mousedown", event => {
            let children = this.root.children;
            // 鼠标的初始位置。只看x即可，y不用考虑。
            let startX = event.clientX;

            let move = event => {
                // 鼠标移动的距离。
                let x = event.clientX - startX;

                // 找出当前位置的图片
                let current = position;
                // let current = position - ((x - x % 500) / 500); // 好像 current 和 position 作用相同。                // 把当前位置的图片，前一个和后一个图片，都放到正确的位置。
                for(let offset of [-1,0,1]) {
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = "none";
                    children[pos].style.transform = `translate(${- pos * 500 + offset * 500 + x % 500}px)`;
                }
            }

            let up = event => {
                let x = event.clientX - startX;

                // 如果拖够了一半的位置，就判断为拖到下一张图片；否则就是上一张图片。
                // round取近似值。
                position = position - Math.round( x / 500);
                // console.log(`position=${position}, round=${Math.round(x / 500)}`);
                for(let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;
                    if (offset === 0) {
                        position = pos;
                        }
                    children[pos].style.transition = "";
                    children[pos].style.transform = `translate(${- pos * 500 + offset * 500}px)`;
                }
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            }

            document.addEventListener("mousemove", move); 
            document.addEventListener("mouseup", up); 
        }); 

        return this.root;
    }
    mountTo(parent){
        parent.appendChild(this.render());
    }
}