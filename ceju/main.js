var exec = require('child_process').exec;

var display = require('./display.js');

var worker;
var st;
var str;

var stage1 = [{
    id: '1-1',
    text: '哎哟, 我的小菊花！'
}, {
    id: '1-2',
    text: '555, 我的X部…'
}, {
    id: '1-3',
    text: '哭…我的清白…'
}, {
    id: '1-4',
    text: '你要对人家负责的说…'
}, {
    id: '1-5',
    text: '你又弄疼人家了啦…'
}];
var stage2 = [{
    id: '2-1',
    text: '快闪开，要撞上了啦！'
}, {
    id: '2-2',
    text: '撞上来吧，我正需要钱！'
}, {
    id: '2-3',
    text: '人家还没有准备好呢！'
}, {
    id: '2-4',
    text: '人家怕疼，轻一点好么…'
}, {
    id: '2-5',
    text: '讨厌，人家才不要被亲吻呢'
}];
var stage3 = [{
    id: '3-1',
    text: '菊花一紧，靠的太近了啦！'
}, {
    id: '3-2',
    text: '靠这么近，你是想做什么呢'
}, {
    id: '3-3',
    text: '别离我这么近，丢死人了…'
}, {
    id: '3-4',
    text: '别滴滴，越滴越慢！'
}, {
    id: '3-5',
    text: '别追了，本人已婚！'
}, {
    id: '3-6',
    text: '你先走，我断后！'
}, {
    id: '3-7',
    text: '别这样，我怕修…'
}, {
    id: '3-8',
    text: '别追了，孩子都会打酱油了'
}];
var stage4 = [{
    id: '4-1',
    text: '前方有美女，请保持距离！'
}, {
    id: '4-2',
    text: '警报，前方高能！！！'
}, {
    id: '4-3',
    text: '后面的，是不是美女啊～'
}, {
    id: '4-4',
    text: '保持车距，别逼我变形！'
}, {
    id: '4-5',
    text: '别看我，看路！'
}, {
    id: '4-6',
    text: '后面的，你妈喊你回家吃饭'
}, {
    id: '4-7',
    text: '着急你就飞过去呀！'
}, {
    id: '4-8',
    text: '离我远点，喵了个咪的～'
}];
var stage5 = [{
    id: '5-1',
    text: '淫荡的一天开始了～'
}, {
    id: '5-2',
    text: '新手上路，腾云驾雾～'
}, {
    id: '5-3',
    text: '性感小屁屁，谢绝亲吻～'
}, {
    id: '5-4',
    text: '马路新秀，急刹天后～'
}, {
    id: '5-5',
    text: '大龄剩女，追尾必嫁～'
}];

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
                    txtObj = getRandText(stage1);
                    console.log('当前距离: ' + data + 'cm, ' + txtObj.text);
                    display(txtObj);
                } else if (data < 10) {
                    txtObj = getRandText(stage2);
                    console.log('当前距离: ' + data + 'cm, ' + txtObj.text);
                    display(txtObj);
                } else if (data < 50) {
                    txtObj = getRandText(stage3);
                    console.log('当前距离: ' + data + 'cm, ' + txtObj.text);
                    display(txtObj);
                } else if (data < 100) {
                    txtObj = getRandText(stage4);
                    console.log('当前距离: ' + data + 'cm, ' + txtObj.text);
                    display(txtObj);
                } else {
                    txtObj = getRandText(stage5);
                    console.log('当前距离: ' + data + 'cm, ' + txtObj.text);
                    display(txtObj);
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