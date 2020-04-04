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
    'random'  : myrandom
}
