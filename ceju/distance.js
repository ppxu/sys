/**
 *
 * @author: 橘子<daxingplay@gmail.com>
 * @time: 4/11/14 16:19
 * @description:
 */

var UltrasonicSensor = require('r-pi-usonic').UltrasonicSensor;

var sensor = new UltrasonicSensor(4, 25);

console.log(sensor.measureDistance());