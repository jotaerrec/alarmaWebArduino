const admin = require("../bin/firebase");
const board = require("../bin/arduinoConnection");
const five = require("johnny-five");
const client = require("../bin/whatsapp-web");
const scroll = require("lcd-scrolling");
var l;
board.on("ready", function () {});

let bool = false;
//functiones globales
const readHorary = async () => {
  let read = admin
    .database()
    .ref("lightsHorary")
    .once("value")
    .then((snapshot) => {
      let snaps = snapshot.val();
      return snaps;
    });
  return read;
};
const programLights = async (
  initHour,
  initMinutes,
  finishHour,
  finishMinutes
) => {
  console.log(initHour, initMinutes, finishHour, finishMinutes);
  if (initHour == "") {
    if (!bool) {
      let hora = await readHorary();
      if (!hora) {
        return console.log("No hay horario de encendido");
      }
      return programLights(
        hora.initHour,
        hora.initMinutes,
        hora.finishHour,
        hora.finishMinutes
      );
    }
  } else {
    const automatic = setInterval(() => {
      showTime();
      if (bool) {
        bool = false;
        return clearInterval(automatic);
      }
    }, 10000);
    let led;
    const showTime = () => {
      led = new five.Led(3);
      date = new Date();
      h = date.getHours();
      m = date.getMinutes();
      console.log(initHour < h && finishHour > h);
      if (initHour < h && finishHour > h) {
        led.on();
      } else {
        console.log(initMinutes < m && finishMinutes > m);
        if (initMinutes < m && finishMinutes > m) {
          led.on();
        } else {
          led.off();
        }
      }
    };
  }
};

module.exports = {
  msgSend: async (msg, number) => {
    const numberws = number;
    const text = msg;
    const chatId = numberws;
    client.sendMessage(chatId, text).catch((err) => {
      console.log(err);
    });
  },
  dateSave: async (date, horary) => {
    var warningsRef = admin.database().ref("registerWarnings");
    var warningsRegisterRef = warningsRef.push();
    warningsRegisterRef.set({
      date: date,
      horary: horary,
    });
  },
  readWarnings: async () => {
    let data = admin
      .database()
      .ref("registerWarnings")
      .once("value")
      .then((snapshot) => {
        let snaps = snapshot.val();
        return snaps;
      });
    return data;
  },
  deleteWarnings: async () => {
    var warningsRef = admin.database().ref("registerWarnings");
    warningsRef.remove();
  },
  saveHoraryLights: async (
    initHour,
    initMinutes,
    finishHour,
    finishMinutes
  ) => {
    bool = true;
    var lightsRef = admin.database().ref("lightsHorary");
    lightsRef.set({
      initHour: initHour === 0 || initHour === undefined ? "0" : initHour,
      initMinutes:
        initMinutes === 0 || initMinutes === undefined ? "0" : initMinutes,
      finishHour:
        finishHour === 0 || finishHour === undefined ? "0" : finishHour,
      finishMinutes:
        finishMinutes === 0 || finishMinutes === undefined
          ? "0"
          : finishMinutes,
    });
  },

  programLights: async (initHour, initMinutes, finishHour, finishMinutes) => {
    programLights(initHour, initMinutes, finishHour, finishMinutes);
  },
  addZero: (hora) => {
    if (hora < 10) {
      hora = `0${hora}`;
      return hora;
    } else {
      return hora;
    }
  },
};
