var wolfram = require('wolfram').createClient('E78UUY-5K72877XYY');

var q = process.argv[2];

if(!q) {
	console.log('need a query!');
	process.exit(0);
}

wolfram.query(q, function(err, result) {
	if (err) throw err;
	console.log("Result: %j", result);
});