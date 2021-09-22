let express = require("express");
let router = express.Router();
const socketapi = require("../bin/socketapi");
const five = require("johnny-five");
const { myBoard } = require("../controllers/arduino");
const componentModel = require("../models/componentModel");
const functions = require("../controllers/functions");
const fs = require("fs");

router.get("/", async function (req, res, next) {
  let date = await functions.readWarnings();
  console.log(date);
  err = req.flash("error");
  componente = await componentModel.find();
  res.render("index.ejs", {
    date: date,
    component: componente,
    error: err,
  });
});

router.post("/led", async function (req, res, next) {
  try {
    if (req.body.contador > 1) {
      for (let i = 0; i < req.body.contador; i++) {
        let validate = await componentModel.find({ pin: req.body.pin[i] });
        if (validate == null) {
          if (req.body.type[i] == "input") {
            let component = new componentModel({
              signal: "input",
              nameComponent: req.body.signal[i],
              state: req.body.state[i],
              pin: req.body.pin[i],
            });
            let componentSave = await component.save();
          } else if (req.body.type[i] == "output") {
            let component = new componentModel({
              signal: "output",
              nameComponent: req.body.signal[i],
              pin: req.body.pin[i],
            });
            let componentSave = await component.save();
            console.log("guardado" + componentSave);
          }
        } else
          req.flash(
            "error",
            "Ya existe un componente conectado al pin:" + req.body.pin[i]
          );
      }
    } else {
      if (req.body.type == "input") {
        let component = new componentModel({
          signal: "input",
          nameComponent: req.body.signal,
          state: req.body.state,
          pin: req.body.pin,
        });
        let componentSave = await component.save();
      } else if (req.body.type == "output") {
        let signal = new componentModel({
          signal: "output",
          nameComponent: req.body.signal,
          pin: req.body.pin,
        });
        let signalSave = await signal.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
});

module.exports = router;

//COMENTARIOS
/*
const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('authenticated', (session) => {
  console.log(session)
});
client.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize(); */

/*   if (!req.body.led) {
    myLed = await new five.Led(2);
    myLed.off()// console.log(myLed)
  }else{
    myLed = await new five.Led(2);
    myLed.on()// console.log(myLed.io.HIGH)

  } */
/* client.sendMessage("5491156578776@s.whatsapp.net", "Alarma encendida")
     const msgResponse = await twilioClient.messages.create({
      body: 'Alarma encendida',
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+5491156578776'
    })
      .then(message => console.log(message.sid))
      .done(); */
