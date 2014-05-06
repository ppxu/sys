var exec = require('child_process').exec;
var request = require('request');

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
    // request({
    //     uri: 'http://localhost:8338/clean',
    //     method: 'GET',
    //     timeout: 2000
    // }, function(err, res, body) {
    //     if (err) {
    //         console.log('do clean error, retry...');
    //         clean();
    //     } else {
    //         displayDistance();
    //     }
    // });
    exec("ps aux | grep /usr/bin/python | grep server.py | awk - '{print $2}'", function(err, stdout) {
        if(err) {
            console.log('ps err');
            clean();
        } else {
            var pid = parseInt(stdout);
            exec('sudo kill -s SIGINT ' + pid, function(err) {
                if(err) {
                    console.log('kill err');
                    clean();
                } else {
                    // loading.displayLoading();
                    setTimeout(function() {
                        // loading.displayLoading();
                        displayDistance();
                    }, 1000);
                }
            });
        }
    });
}

//wait loading end
setTimeout(function() {
    displayDistance();
}, 5000);