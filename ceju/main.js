var exec = require('child_process').exec;
var request = require('request');
var path = require('path');
var fs = require('fs');

var display = require('./display.js').displayDistance;

//show loading
var loading = require('./display.js');
loading.displayLoading();

//display distance
function displayDistance() {
    getData(function(data) {
        data = parseFloat(data).toFixed(1);

        if (isNaN(data)) {
            console.log('data invalid, clean...');
            clean();
        } else {
            (data < 0.1) && (data = 0.1);
            (data > 99.9) && (data = 99.9);
            // console.log('当前距离: ' + data + 'cm');
            display(data, displayDistance);
        }
    });
}

//get distance
function getData(callback) {
    request({
        uri: 'http://localhost:8338/distance',
        method: 'GET',
        timeout: 2000
    }, function(err, res, body) {
        if (err) {
            console.log('get distance error, clean...');
            clean();
        } else {
            callback && callback(body);
        }
    });
}

//clean
function clean() {
    console.log('do clean');
    var pidFilePath = path.resolve(__dirname, './tmp/server.pid');
    fs.readFile(pidFilePath, function(err, pid){
        console.log('start to kill pid ' + pid);
        exec('sudo kill -9 ' + pid, function(err, stdout){
            if(!err){
                exec('sudo nohup python ' + path.resolve(__dirname, './server.py') + ' > /dev/null & echo $! > ' + pidFilePath, function(err2, stdout2){
                    if(!err2){
                        setTimeout(function() {
                            // loading.displayLoading();
                            displayDistance();
                        }, 1000);
                    }else{
                        console.log('start error.');
                    }
                });
            }else{
                console.log('kill error.');
            }
        });
    });
}

//wait loading end
setTimeout(function() {
    displayDistance();
}, 5000);