const five = require("johnny-five");
let myBoard = new five.Board({ port: "COM4" });
module.exports = myBoard;
