
var query = require('./query.js');
var len = 0;
var step = 0;
var originArr = [];
var finalArr = [];
var codeArr = [];
var newCodeArr = [];
var st;
var empty = ['0x0','0x0','0x0','0x0','0x0','0x0','0x0','0x0'];
var exec = require('child_process').exec;
var codeCache = {};

function displayLED(obj) {
    var id = obj.id;
    var text = obj.text;
    len = step = 0;
    originArr = finalArr = codeArr = newCodeArr = [];
    st && clearInterval(st);
    if(codeCache[id]) {
        var codeData = codeCache[id];
        initArr(codeData);
    } else {
        query(text, function(data) {
            initArr(data);
            codeCache[id] = data;
        });
    }
}

function initArr(data) {
    exec("python led.py '" + data + "'");
    originArr = data.slice(0,-1).split(';');
    len = originArr.length;
    originArr.forEach(function(zifu, idx) {
        originArr[idx] = zifu.split(',');
        codeArr[4*idx] = originArr[idx].slice(0,8);
        codeArr[4*idx+1] = originArr[idx].slice(8,16);
        codeArr[4*idx+2] = originArr[idx].slice(16,24);
        codeArr[4*idx+3] = originArr[idx].slice(24,32);
    });
    newCodeArr = codeArr;
    finalArr = originArr;
    st = setInterval(move,350);
}

function display(arr) {
    var str = '';
    arr.forEach(function(arr1,i){
        str += arr1.join(',')+';';
    });
    exec("python led.py '" + str + "'");
}

function move() {
    if(step < len*2) {
        moveCode();
        display(finalArr);
        step++;
    } else {
        clearInterval(st);
    }
}

function moveCode() {
    newCodeArr.forEach(function(v,i) {
        if(i%2===0){
            newCodeArr[i] = (codeArr[i+1] || empty);
        }else {
            newCodeArr[i] = (codeArr[i+3] || empty);
        }
    });
    codeArr = newCodeArr;
    finalArr.forEach(function(v,i) {
        finalArr[i]=codeArr[4*i].concat(codeArr[4*i+1],codeArr[4*i+2],codeArr[4*i+3]);
    });
}

module.exports = displayLED;