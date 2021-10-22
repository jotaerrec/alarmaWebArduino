const five = require("johnny-five");
let board;
async function getBoard() {
  if (board) return board;

  var stdin = process.openStdin();
  let data = await new Promise((resolve) =>
    stdin.addListener("data", function (d) {
      resolve(d.toString().trim());
    })
  );
  myBoard = new five.Board({
    port: data,
  });
  return myBoard;
}
module.exports = getBoard;
