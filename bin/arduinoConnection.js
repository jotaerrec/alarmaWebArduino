const five = require("johnny-five");
let board,
  data = "";

async function getPort() {
  var stdin = process.openStdin();
  data = await new Promise((resolve) =>
    stdin.addListener("data", function (d) {
      resolve(d.toString().trim());
    })
  );
  data.includes("/dev/") ? (data = data) : (data = data.toUpperCase());
  return data;
}
async function getBoard(e) {
  if (e)
    console.log(
      "Ese no es un puerto correspondiente, los puertos comienzan con: 'COM' o en linux : '/dev/'"
    );
  if (board) return board;
  let port = await getPort();
  if (port.includes("COM") || port.includes("/dev/")) {
    myBoard = new five.Board({
      port: data,
    });

    return myBoard;
  } else return getBoard("error");
}
module.exports = getBoard;
