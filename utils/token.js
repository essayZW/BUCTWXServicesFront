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
    'base64encrypt' : base64_encode,
    'base64decrypt' : base64_decode,
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
function base64_decode (input) {
    `
        from: https://www.cnblogs.com/Man-Dream-Necessary/p/8400376.html
    `
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = base64EncodeChars.indexOf(input.charAt(i++));
        enc2 = base64EncodeChars.indexOf(input.charAt(i++));
        enc3 = base64EncodeChars.indexOf(input.charAt(i++));
        enc4 = base64EncodeChars.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    return utf8_decode(output);
}
function utf8_decode (utftext) {
    `
        from: https://www.cnblogs.com/Man-Dream-Necessary/p/8400376.html
    `
    var string = '';
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c1 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
            i += 2;
        } else {
            c1 = utftext.charCodeAt(i + 1);
            c2 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
            i += 3;
        }
    }
    return string;
}