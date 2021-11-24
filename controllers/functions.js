const admin = require("../bin/firebase");
const board = require("../bin/arduinoConnection");
const five = require("johnny-five");
const client = require("../bin/whatsapp-web");
var fs = require("fs");
var logger = fs.createWriteStream("log.txt", {
  flags: "a",
});
let bool = false;
//Functiones globales
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
const readNumber = async () => {
  let read = admin
    .database()
    .ref("numberWsp")
    .once("value")
    .then((snapshot) => {
      let snaps = snapshot.val();
      console.log(snaps);
      return snaps.number;
    });
  return read;
};

//Funcion en desarrollo

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
  msgSend: async (msg) => {
    const numberws = await readNumber();
    const text = msg;
    const chatId = numberws + "@c.us";
    console.log(chatId);
    client
      .sendMessage(chatId, text)
      .then((text) => {
        console.log(text + "ok");
      })
      .catch((err) => {
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
    logger.write(`Alarma activa el ${date} a las ${horary}\n`); // Guarda el registro en el log.txt
  },

  saveNumber: async (number) => {
    number = number.replace(/[^\d]/g, "");
    var numberRef = admin.database().ref("numberWsp");
    numberRef.set({ number: number }).then((h) => console.log(h));
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

  //Reset base de datos

  deleteWarnings: async () => {
    var warningsRef = admin.database().ref("registerWarnings");
    warningsRef.remove();
  },

  //Funcion en desarollo

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

  //Funcion en desarollo

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
