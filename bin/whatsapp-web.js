const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

const client = new Client();
client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
});
client.on("ready", () => {
  console.log("Client is ready!");
});
client.initialize();
module.exports = client;
