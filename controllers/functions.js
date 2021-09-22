const admin = require("../bin/firebase");
const board = require("../bin/arduinoConnection");
const five = require("johnny-five");
const client = require("../bin/whatsapp-web");
const scroll = require("lcd-scrolling");
var l;
board.on("ready", function () {
  l = new five.LCD({
    controller: "PCF8574T",
  });
  l.clear();
  l.home();
});

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
      console.log(hora, "finished");
      return programLights(
        hora.initHour,
        hora.initMinutes,
        hora.finishHour,
        hora.finishMinutes
      );
    }
  } else {
    const javito = setInterval(() => {
      showTime();
      if (bool) {
        bool = false;
        console.log("finish");
        return clearInterval(javito);
      }
    }, 10000);
    let led;
    const showTime = () => {
      led = new five.Led(3);
      date = new Date();
      h = date.getHours();
      m = date.getMinutes();
      console.log(h + " jaja " + m + `\n ${initHour + " " + finishHour}`);
      console.log(initHour < h && finishHour > h);
      if (initHour < h && finishHour > h) {
        led.on();
      } else {
        console.log(initMinutes < m && finishMinutes > m);
        if (initMinutes < m && finishMinutes > m) {
          led.on();
        } else {
          led.off();
          console.log("se apago");
        }
      }
      console.log("finished");
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
  stringLCD: async (text1, text2) => {
    scroll.setup({
      lcd: l,
      full: true,
    });
    if (!text2 || text2 === undefined) {
      console.log("aki");
      text1.length < 16 ? scroll.line(0, text1) : l.cursor(0, 0).print(text1);
      l.cursor(0, 49);
      scroll.line(1, "");
    } else {
      console.log("akisi" + text1 + " " + text2);
      l.cursor(0, 0);
      l.cursor(1, 0);
      text1.length < 16 ? l.print(text1) : await scroll.line(0, text1);
      text2.length < 16 ? l.print(text2) : await scroll.line(1, text2);
    }
  },
};
