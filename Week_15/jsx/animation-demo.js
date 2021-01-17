import {Timeline, Animation} from './animation.js'
import {linear, ease, easeIn, easeInOut, easeOut} from './ease.js'

let tl = new Timeline();
tl.start();

// transform需要一个px作为属性的单位，用一个函数传入
tl.add(new Animation(document.querySelector("#el").style, "transform", 0, 500, 2000, 0, linear, v => `translateX(${v}px)`));

let el2 = document.querySelector("#el2").style;
el2.transition = "transform linear 2s";
el2.transform = "translateX(500px)";

document.querySelector("#pause-btn").addEventListener("click", ()=> tl.pause());
document.querySelector("#resume-btn").addEventListener("click", ()=> tl.resume());