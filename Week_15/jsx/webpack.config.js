/*
 * @Description: 
 * @Date: 2020-12-01 09:20:44
 */
module.exports = {
    entry: "./main.js",
    module: {
        rules: [
            {
                test:/\.js$/,   // 正则表达式
                // babel 相关的包
                use:{
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],   
                        plugins: [["@babel/plugin-transform-react-jsx",{pragma:"createElement"}]], 
                    }
                }
            }
        ]
    },
    mode: "development" 
}