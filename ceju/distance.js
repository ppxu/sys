/**
 *
 * @author: 橘子<daxingplay@gmail.com>
 * @time: 4/11/14 16:19
 * @description:
 */
/**
 *
 * @author: 橘子<daxingplay@gmail.com>
 * @time: 4/2/14 19:58
 * @description:
 */
var sleep = require('sleep');
var Gpio = require('onoff').Gpio,
    trigger = new Gpio(25, 'out'),
    echo = new Gpio(4, 'in', 'both');

trigger.writeSync(false);

function exit() {
    echo.unexport();
    trigger.unexport();
    process.exit();
}

function measure(callback){

    var start = +new Date();
    var stop = +new Date();

    echo.watch(function(err, value) {
        if(err){
            console.log('err');
        }else{
            if(value == 0){
                start = +new Date();
            }else if(value == 1){
                stop = +new Date();
                var past = stop - start;
                callback && callback(err, (past * 34300) / 2);
            }
            console.log('cur value: ' + value);
        }
    });

    trigger.writeSync(true);
    sleep.usleep(100);
    trigger.writeSync(false);

}

process.on('SIGINT', exit);

measure(function(err, value){
    console.log('distance: ' + value);
});