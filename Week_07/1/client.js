const net = require("net");
const parser = require("./parser.js");

class Request {
    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host,
        this.port = options.port || 80,
        this.path = options.path || '/',
        this.body = options.body || {},
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if(this.headers["Content-Type"] === "application/json")
            this.bodyText =JSON.stringify(this.body);
        else if((this.headers["Content-Type"] === "application/x-www-form-urlencoded"))
            this.bodyText =Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');

        this.headers["Content-Length"] = this.bodyText.length;
    };

    send(connection){
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if(connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }
            connection.on('data', (data) => {
                // console.log(data.toString());
                parser.receive(data.toString());
                if(parser.isFinished) {
                    resolve(parser.response);
                    connection.end();
                }
            });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        });
    };

    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
    }
    
}

/**
 * ResponseParser 产生Response
 * 利用状态机处理response
 * 
 */
class ResponseParser{
    constructor(){
        // status line 有 \r 和 \n 两个状态。
        this.WATTING_STATUS_LINE = 0;
        this.WATTING_STATUS_LINE_END = 1;
        // header name输入状态，name冒号后等待空格，value，header line end 四个状态
        this.WATTING_HEADER_NAME = 2;
        this.WATTING_HEADER_SPACE = 3;
        this.WATTING_HEADER_VALUE = 4;
        this.WATTING_HEADER_LINE_END = 5;
        // header之后，还要等一个空行。
        this.WATTING_HEADER_BLOCK_END = 6;  
        // body 格式不固定，所以这里不判断。
        this.WATTING_BODY=7;

        this.current = this.WATTING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {}
        this.headName = "";
        this.headValue = "";
        this.bodyParser = null ;  
    }

    get isFinished(){
      return this.bodyParser && this.bodyParser.isFinished;
    }
    get response(){
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            StatusCode:RegExp.$1,
            StatusText: RegExp.$2,
            headers:this.headers,
            body:this.bodyParser.content.join('')
        }
    }

    receive(string){
        for (let i=0; i<string.length;i++){
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char){
        if(this.current ===  this.WATTING_STATUS_LINE){
            if(char === '\r')
                this.current = this.WATTING_STATUS_LINE_END;
            else
                this.statusLine += char;
        }else if(this.current ===  this.WATTING_STATUS_LINE_END){
            // console.log(string.charAt(i))
            // this.statusLine.push(char);
            if(char === '\n'){
                this.current = this.WATTING_HEADER_NAME;
           }
        }else if(this.current === this.WATTING_HEADER_NAME){
            // console.log(char);
            if(char === ':'){ 
                this.current = this.WATTING_HEADER_SPACE;
                // console.log("break 1");
            }else if(char === '\r'){
                this.current = this.WATTING_HEADER_BLOCK_END;
                // console.log("break 2");
                if(this.headers['Transfer-Encoding'] === 'chunked')
                    this.bodyParser = new TrunkedBodyParser();
            }else{
                this.headName += char;
            }
        }else if(this.current === this.WATTING_HEADER_SPACE){
            if(char === ' '){
                this.current = this.WATTING_HEADER_VALUE;
            }else{
                this.statusLine += char;
            }
        }else if(this.current === this.WATTING_HEADER_VALUE){
            if(char === '\r'){
                this.current = this.WATTING_HEADER_LINE_END;
                this.headers[this.headName] = this.headValue;
                this.headName = ''
                this.headValue = ''
            }else{
                this.headValue += char;
            }
        }else if(this.current === this.WATTING_HEADER_LINE_END){
            if(char === '\n'){
                this.current = this.WATTING_HEADER_NAME;
            }
        } else if(this.current === this.WATTING_HEADER_BLOCK_END){
            if(char === '\n'){
                this.current = this.WATTING_BODY;
            }
        }else if(this.current === this.WATTING_BODY){
            this.bodyParser.receiveChar(char); 
            // if(this.current === )
          
        } 
    }
}
class TrunkedBodyParser{
    constructor(){
        this.WATTING_LENGTH = 0;
        this.WATTING_LENGTH_LINE_END = 1;
        this.REANING_TRUNK = 2;
        this.WATTING_NEW_LINE =3;
        this.WATTING_NEW_LINE_END = 4;
        
        this.length = 0;
        this.content =[];
        this.isFinished = false;
        this.current = this.WATTING_LENGTH;
    }
    receiveChar(char){
        // console.log(JSON.stringify(char)) //可打印 \n \r 字符
        if(this.current === this.WATTING_LENGTH){
            if(char === '\r'){
                if(this.length === 0){
                    this.isFinished =true;
                }
                this.current = this.WATTING_LENGTH_LINE_END;
            }else{
                this.length *=16;  //chunked 的 length 是十六进制
                this.length += parseInt(char, 16);
            }
        }else if(this.current === this.WATTING_LENGTH_LINE_END) {
            // console.log("WATTING_LENGTH_LINE_END");
            if(char === '\n'){
                this.current = this.REANING_TRUNK;
            }
        }else if(this.current === this.REANING_TRUNK){

            // // 这里不一样
            // this.content.push(char);
            // this.length--;

            if(this.length != 0){  //去掉最后边的\r\n
                this.content.push(char);
                this.length --;
            }
           
            if(this.length === 0){
                this.current = this.WATTING_NEW_LINE;
            }
        }else if(this.current === this.WATTING_NEW_LINE){
            if(char === '\r'){
                this.current = this.WATTING_NEW_LINE_END;
            }
        }else if(this.current === this.WATTING_NEW_LINE_END){
            if(char === '\n'){
                this.current = this.WATTING_LENGTH;
                //console.log('WATTING_LENGTH')
            }
        }
    }
}

void async function (){
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["X-Foo2"]: "customed"
        },
        body: {
            name: "Moxy"
        }
    });

    let response = await request.send();

    let dom = parser.parseHTML(response.body);
}();