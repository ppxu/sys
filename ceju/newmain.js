var http = require('http');
var exec = require('child_process').exec;
var request = require('request');

var display = require('./display.js').displayDistance;

//show loading
var other = require('./display.js');
other.displayLoading();


var worker;
var st;
var txtObj;
var status;

function getDistance() {
    if(status === 'on') {
        getData(function(data) {
            data = parseFloat(data).toFixed(1);
            (data < 0.1) && (data = 0.1);
            (data > 99.9) && (data = 99.9);
            console.log('当前距离: ' + data + 'cm');
            display(data, getDistance);
        });
    } else if(status === 'off') {
        other.displayRest();
    }
}

function getData(callback) {
    request({
        uri: 'http://localhost:8338/distance',
        method: 'GET',
        timeout: 2000
    }, function(err, res, body) {
        if (err) {
            console.log('distance error.');
        } else {
            callback && callback(body);
        }
    });
}

//wait loading end
setTimeout(function() {
    getDistance();
}, 4000);

http.createServer(function (req, res) {
  if (req.url === '/on') {
    console.log('on');
    status = 'on';
    st && clearTimeout(st);
  } else if (req.url === '/off') {
    console.log('off');
    st = setTimeout(function() {
        status = 'off';
    }, 5000);
  }
}).listen('4377');