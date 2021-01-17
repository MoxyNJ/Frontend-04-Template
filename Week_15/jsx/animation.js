// 定义为 symbol 常量，禁止外部调用，变成私有变量。
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
const PAUSE_START = Symbol("pause-start")   // 暂停开始的时间
const PAUSE_TIME = Symbol("pause-time")     // 暂停结束的时间

export class Timeline {
    constructor(){
        this.state = "Inited";  // 初始化。
        // 动画队列。
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }

    start(){
        // 静默fail，直接return。
        if(this.state !== "Inited")
            return;
        this.state = "Started";
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[TICK] = () => {
            let now = Date.now();
            for(let animation of this[ANIMATIONS]) {
                let t;

                if(this[START_TIME].get(animation) < startTime ) 
                    t = now - startTime - this[PAUSE_TIME] - animation.delay;
                else
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;

                if(animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }
                if( t > 0) {
                    animation.receive(t);
                }
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

    pause(){
        if(this.state !== "Started")
        return;
        this.state = "Paused";
        // 记录暂停的时间
        this[PAUSE_START] = Date.now();
        // 取消时间轴
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume(){
        if(this.state !== "Paused")
        return;
        this.state = "Started";
        // 暂停了多久，暂停的总时间 = 当前时间 - 暂停的时间
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }

    reset(){
        this.pause();
        this.state = "Inited";
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[PAUSE_START] = 0;
        this[TICK_HANDLER] = null;
    }
    
    add(animation, startTime){
        if(arguments.length < 2){
            // 支持手动添加时间，如果不手动添加。赋默认值Date.now()。
            // 此处的startTime表示该动画的开始时间。
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
}

// 属性动画，把一对象的属性值，从A变成B。
export class Animation {
    // 参数：目标对象，属性值，初始值，末尾值，持续时间，开始时间，延迟时间（可选），差值函数（可选），属性值模板（可选）。
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template){
        timingFunction = timingFunction || (v => v);
        template = template || (v => v);
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
        this.template = template;
    }
    // time是虚拟时间，由timeLine构建的，表示该动画已经执行的时间
    // 动画已经执行的时间 + 动画尚未执行的时间 = 动画时间 ===> time + 尚未执行的时间 == duration。
    receive(time){
        let range = this.endValue - this.startValue;
        // 定义一个进度条prosgerss，类似上文中 t 的效果。单位是个百分比（0到1），表示动画进展。
        let progress = this.timingFunction(time / this.duration);

        // 均匀变化：（范围✖️虚拟时间）/ 持续时间
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}