var fs = require('fs');
fs.readFile('ziku_utf8.html', {
    encoding: 'utf-8'
}, function(err, data) {
    if (err) throw err;
    var arr = data.split(";");

    var output = {};
    var l = arr.length - 1;
    for (var i = 0; i < l; i++) {
        var a = arr[i];
        var n = a.substring(3, a.indexOf('[]'));
        var char = a.substr(a.indexOf('//') + 2, 1);
        var code = a.substring(a.indexOf('{') + 1, a.indexOf('}'));
        var codeArr = code.split(',');
        var codeArrs = [];
        var newCodeArrs = [];
        codeArrs[0] = codeArr.slice(0, 8);
        codeArrs[1] = codeArr.slice(8, 16);
        codeArrs[2] = codeArr.slice(16, 24);
        codeArrs[3] = codeArr.slice(24, 32);
        codeArrs.forEach(function(arr,idx) {
            arr.forEach(function(v, i) {
                arr[i] = parseInt(v, 16).toString(2);
            });
            arr.forEach(function(v, i) {
                var len = v.length;
                if (len < 8) {
                    var tmp = new Array(9 - len).join('0');
                    v = tmp + v;
                }
                arr[i] = v.split('');
            });
            newCodeArrs[idx] = new Array([], [], [], [], [], [], [], []);
            arr.forEach(function(v, i) {
                v.forEach(function(u, j) {
                    newCodeArrs[idx][7 - j][i] = u;
                });
            });
            newCodeArrs[idx].forEach(function(v, i) {
                newCodeArrs[idx][i] = v.join('');
            });
            newCodeArrs[idx].forEach(function(v, i) {
                var tmp = parseInt(v, 2).toString(16);
                newCodeArrs[idx][i] = '0x' + tmp;
            });
            newCodeArrs[idx] = newCodeArrs[idx].join(',');
        });
        newCodeArrs = newCodeArrs.join(',');

        output[n] = {
            n: n,
            char: char,
            code: newCodeArrs
        };
    }

    fs.writeFile("ziku.json", JSON.stringify(output), function(e) { //会先清空原先的内容
        if (e) throw e;
    });
});