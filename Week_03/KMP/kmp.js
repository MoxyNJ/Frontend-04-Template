/*
 * @Description: KMP
 * @Date: 2020-09-08 18:39:15
 */

// source串：较长的串，原字符串
// pattern串：较短的串，要匹配的字符串。
function kmp(source, pattern) {
    // 计算table 跳转表格
    let table = new Array(pattern.length).fill(0);

    // i 出现重复串的开始位置 
    // j 已重复的字数

    // i 遍历到的当前元素
    // j 从上一元素开始，已出现重复的个数
    // 从字符串的第一个字符开始匹配，匹配成功的个数为 j
    // 若上一个字符已成功匹配，那么本字符应该接着上一个匹配成功的位置，接着匹配
    // 若上一个字符匹配失败，那么本字符应该从0位置重新开始匹配
    let i = 1,
        j = 0;

    while (i < pattern.length) {
        // 匹配上的情况
        if (pattern[i] === pattern[j]) {
            ++j, ++i;
            table[i] = j;
        } // 没匹配上
        else {
            // 没匹配上，但上一个字符匹配上？
            if (j > 0)
                j = table[j];
            else {
                // 没匹配上，上一个字符也没匹配上？
                // i往前走一个，遍历下一个字符。
                ++i;
            }
        }
    }
    // console.log(table);  // 检测用

    // 匹配
    {
        // i 是 source的位置下标
        // j 是 pattern的位置下标
        let i = 0,
            j = 0;
        while (i < source.length) {
            // 匹配上的情况
            if (pattern[j] === source[i]) {
                ++i, ++j;
            } else {
                // 没匹配上，pattern的位置回退到table致使的位置去。
                if (j > 0)
                    j = table[j];
                else {
                    // 没匹配上，上一个字符也没匹配上？
                    // i往前走一个，遍历下一个字符。
                    ++i;
                }
            }
            // 如果pattern串到头了，证明匹配成功。
            if (j === pattern.length)
                return true;
        }
        // 如果source串到头了，证明匹配失败
        return false;
    }
}

let x = kmp("hello", "ll");
console.log(x);

//      i: 0 1 2 3 4 5 6
//      j: 0 0    
// source: a a b a a a c
// table : 0 0 1 0 1 2 2

// a b c d a b c e
// 0 0 0 0 0 1 2 3

// b a a b a a a c
// 0 0 0 0 1 2 3 0

// b b a a b a a a c
// 0 0 1 0 0 1 0 0 0

// a b a a b b a b a a b
// 0 0 0 1 1 2 0 1 2 3 4 5

// c a b a a b b a b a a b
// 0 0 0 0 0 0 0 0 0 0 0 0 0