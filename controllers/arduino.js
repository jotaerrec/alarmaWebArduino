const myBoard = require("../bin/arduinoConnection");
const functions = require("./functions");
const five = require("johnny-five");
const socketapi = require("../bin/socketapi");
const message = require("../util/messages");
const chalk = require("chalk");
const scroll = require("lcd-scrolling");
const log = console.log;
/* functions.programLights(""); */
let fecha;
let leds = {};

myBoard.on("ready", async function () {
  log(chalk.blue(message.GENERAL.boardReady));

  leds.ledSlide = new five.Led({ pin: 11 });

  const thermometer = new five.Thermometer({
    controller: "LM35",
    pin: "A1",
    freq: 1500,
  });
  thermometer.on("change", () => {
    const { celsius, fahrenheit, kelvin } = thermometer;
    socketapi.io.emit("temp", celsius);
  });

  leds.alarm = new five.Led({ pin: 7 });
  leds.alarm.off();
  let ldr = new five.Sensor({
    pin: "A0",
    freq: 250,
  });
  let minutes = 0;
  let hours = 0;
  ldr.on("change", async function () {
    if (this.scaleTo(0, 20) > 10) {
      const date = new Date();
      if (date.getMinutes() - minutes >= 1 || hours != date.getHours()) {
        fecha = `La alarma se activo el ${date.getFullYear()}/${date.getMonth()+1}/${date.getDay()} a las ${date.getHours()}:${functions.addZero(
          date.getMinutes()
        )}`;
        minutes = date.getMinutes();
        hours = date.getHours();
        socketapi.io.emit("ldr", fecha);
        alarmaState = true;
        functions.dateSave(
          `${date.getFullYear()}/${date.getMonth()+1}/${date.getDay()}`,
          `${functions.addZero(date.getHours())}:${functions.addZero(
            date.getMinutes()
          )}`
        );
        leds.alarm.on();
        functions.msgSend(fecha, "5491164264193@c.us");
      }
    }
  });
  l = new five.LCD({
    controller: "PCF8574T",
  });
  scroll.setup({
    lcd: l,
    full: true,
  });
  function reloj() {
    if(!fecha){
    let fecha = new Date();
    scroll.line(
      1,
      `F: ${fecha.getDate()}/${fecha.getMonth() + 1} ${functions.addZero(
        fecha.getHours()
      )}:${functions.addZero(fecha.getMinutes())}`
    );
    if (fecha.getDay() == 0) {
      scroll.line(0, "Domingo");
    } else if (fecha.getDay() == 1) {
      scroll.line(0, "Lunes");
    } else if (fecha.getDay() == 2) {
      scroll.line(0, "Martes");
    } else if (fecha.getDay() == 3) {
      scroll.line(0, "Miercoles");
    } else if (fecha.getDay() == 4) {
      scroll.line(0, "Jueves");
    } else if (fecha.getDay() == 5) {
      scroll.line(0, "Viernes");
    } else if (fecha.getDay() == 6) {
      scroll.line(0, "Sabado");
    }
  }else{
    scroll.line(0,"Alarma activa")
  }
  }
  setInterval(() => {
    reloj();
  }, 6000);
});
myBoard.on("error", function (err) {
  console.log(err);
});
socketapi.io.on("connection", async (socket) => {
  socketapi.io.emit("ldr", fecha);
  socket.on("reset", () => {
    fecha = null;
    leds.alarm.off();
    socket.emit("ldr", fecha);
  });
  socket.on("changeSlide", (val) => {
    leds.ledSlide.brightness(val);
    console.log(val);
  });
  socket.on("saveHorary", async (data) => {
    console.log(data);
    functions.saveHoraryLights(data[0], data[1], data[2], data[3]);
    functions.programLights(data[0], data[1], data[2], data[3]);
  });
  socket.on("clearDB", async (data) => {
    functions.deleteWarnings();
  });
});
