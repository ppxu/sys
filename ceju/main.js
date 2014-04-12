var exec = require('child_process').exec;

var display = require('./display.js');

var worker;
var st;
var str;

var stage1 = [
    '哎哟, 我的小菊花！',
    '555, 我的X部…',
    '哭…我的清白…',
    '你要对人家负责的说…',
    '你又弄疼人家了啦…'
];
var stage2 = [
    '快闪开，要撞上了啦！',
    '撞上来吧，我正需要钱！',
    '人家还没有准备好呢！',
    '我怕疼，轻一点好么…',
    '讨厌，人家才不要被亲吻呢'
];
var stage3 = [
    '菊花一紧，靠的太近了啦！',
    '靠这么近，你是想做什么呢',
    '别离我这么近，丢死人了…',
    '别滴滴，越滴越慢！',
    '别追了，本人已婚！',
    '你先走，我断后！',
    '别这样，我怕修…',
    '别追了，孩子都会打酱油了'
];
var stage4 = [
    '前方有美女，请保持距离！',
    '警报，前方高能！！！',
    '后面的，是不是美女啊～',
    '保持车距，别逼我变形！',
    '别看我，看路！',
    '后面的，你妈喊你回家吃饭',
    '着急你就飞过去呀！',
    '离我远点，喵了个咪的～'
];
var stage5 = [
    '淫荡的一天开始了～',
    '新手上路，腾云驾雾～',
    '性感小屁屁，谢绝亲吻～',
    '马路新秀，急刹天后～',
    '大龄剩女，追尾必嫁～'
];

function getDistance() {
    worker = exec('sudo python distance.py', function(err, stdout, stderr) {
        if (err) {
            console.log('error found, restart program...');
            worker.kill();
            st && clearInterval(st);
            st = setInterval(getDistance, 10000);
        } else {
            var result = stdout;
            if (!result || result.indexOf(':') === -1) {
                console.log('unknown error, restart program...');
                worker.kill();
                st && clearInterval(st);
                st = setInterval(getDistance, 10000);
            } else {
                var distance = result.split(':')[1];
                var data = parseFloat(distance, 10).toFixed(1);
                if (data < 5) {
                    str = getRandText(stage1);
                    console.log('当前距离: ' + data + 'cm, ' + str);
                    display(str);
                } else if (data < 10) {
                    str = getRandText(stage2);
                    console.log('当前距离: ' + data + 'cm, ' + str);
                    display(str);
                } else if (data < 50) {
                    str = getRandText(stage3);
                    console.log('当前距离: ' + data + 'cm, ' + str);
                    display(str);
                } else if (data < 100) {
                    str = getRandText(stage4);
                    console.log('当前距离: ' + data + 'cm, ' + str);
                    display(str);
                } else {
                    str = getRandText(stage5);
                    console.log('当前距离: ' + data + 'cm, ' + str);
                    display(str);
                }
            }
        }
    });
}

function getRandText(arr) {
    var length = arr.length;
    var ran = Math.floor(Math.random() * length);
    return arr[ran];
}

st = setInterval(getDistance, 10000);
// getDistance();