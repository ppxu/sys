var fs = require('fs');
var ziku;

function query(queryStr, callback) {
    fs.readFile('ziku.json', {
        encoding: 'utf-8'
    }, function(err, data) {
        if(err) throw err;
        try {
            ziku = JSON.parse(data);
        }catch(e){
            throw e;
        }

        var queryArr = queryStr.split('');
        var output = '';
        queryArr.forEach(function(zifu) {
            for(var zf in ziku) {
                var detail = ziku[zf];
                if(detail.char === zifu) {
                    output += (detail.code + ';');
                }
            }
        });
        callback(output.slice(0,-1));

    });

}

module.exports = query;