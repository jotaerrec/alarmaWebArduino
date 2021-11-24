const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const socket = require("./socketapi");
const fs = require("fs");
const client = new Client();
let authWsp;
try {
  client.on("qr", (qr) => {
    // Generate and scan this code with your phone
    authWsp = qr;
    socket.io.emit("qrcodewsp", qr);
  });
  client.on("ready", () => {
    console.log("Client is ready!");
    authWsp = null;
    socket.io.emit("qrcodewsp", authWsp);
  });
  client.initialize();

  socket.io.on("connect", () => {
    socket.io.emit("qrcodewsp", authWsp);
  });
} catch (error) {
  console.log("Error al conectar wsp");
}

module.exports = client;
