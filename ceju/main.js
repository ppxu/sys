// var exec = require('child_process').exec;
var request = require('request');

var display = require('./display.js').displayDistance;

//show loading
console.log('show loading...');
require('./display.js').displayLoading();

var worker;
var st;
var txtObj;

//display distance
function getDistance() {
    getData(function(data) {
        data = parseFloat(data).toFixed(1);

        if (isNaN(data)) {
            console.log('data invalid, retry...');
            clean();
            return;
        }

        (data < 0.1) && (data = 0.1);
        (data > 99.9) && (data = 99.9);
        console.log('当前距离: ' + data + 'cm');
        display(data, getDistance);
    });
}

//get distance
function getData(callback) {
    console.log('begin get distance');
    request({
        uri: 'http://localhost:8338/distance',
        method: 'GET',
        timeout: 2000
    }, function(err, res, body) {
        if (err) {
            console.log('get distance error...');
            clean();
        } else {
            console.log('get distance success...');
            callback && callback(body);
        }
    });
}

//clean
function clean() {
    console.log('do clean');
    request({
        uri: 'http://localhost:8338/clean',
        method: 'GET',
        timeout: 2000
    }, function(err, res, body) {
        if (err) {
            console.log('do clean error...');
            getDistance();
        } else {
            console.log('do clean success...');
            getDistance();
        }
    });
}

//wait loading end
setTimeout(function() {
    console.log('begin program...');
    getDistance();
}, 4000);