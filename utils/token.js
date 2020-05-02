// token加密函数
function encrypt(timetoken, random) {
    let numArr = new Array();
    while(timetoken) {
        numArr.push(((timetoken % 10 + 40) ^ random) % 256)
        timetoken = Math.floor(timetoken / 10);
    }
    numArr.reverse();
    let bstr = '';
    for(let i = 0; i < numArr.length; i ++) {
        let tempstr = '';
        let num = 0;
        while(numArr[i]) {
            tempstr = (numArr[i] % 2 ? 0 : 1) + tempstr;
            numArr[i] = parseInt(Math.floor(numArr[i]) / 2);
            num ++;
        }
        while(num < 8) {
            tempstr = '0' + tempstr;
            num ++;
        }
        bstr += tempstr;
    }
    let hexdict = ['F', 'A', 'C', '2', '5', '0', 'D', 'B', 'E', '1', '7', '9', '4', '8', '3', '6'];
    let hexstr = '';
    for(let i = 0; i < bstr.length; i += 4) {
        let base = 1;
        let num = 0;
        for(let j = 0; j < 4; j ++) {
            num += parseInt(bstr[i + j]) * base;
            base *= 2;
        }
        hexstr += (hexdict[num] + hexdict[myrandom() % 16]);
    }
    return hexstr;
}
// 随机数函数，生成一个0~999之间的随机数
function myrandom(maxnum = 999) {
    let numdict = [10, 100, 1000];
    return parseInt(Math.random() * numdict[parseInt(Math.random() * 10) % 3]) % maxnum;
}
// 导出函数
module.exports = {
    'encrypt' : encrypt,
    'random'  : myrandom,
    'base64encrypt' : base64_encode
}

function base64_encode (str) {
    `
        from: https://www.cnblogs.com/Man-Dream-Necessary/p/8400376.html
    `
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var i = 0, len = str.length, strin = '';
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
            strin += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
            strin += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        strin += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return strin
}