let socket = io();
let alarma = document.getElementById("alarma");
let textAlarma = document.getElementById("text-alarma");
let status;
let btnAlarma = document.getElementById("btnAlarma");
let saveHorary = document.getElementById("saveHorary");
let initialHour = document.getElementById("initialHour");
let initialMinutes = document.getElementById("initialMinutes");
let finishHour = document.getElementById("finishHour");
let finishMinutes = document.getElementById("finishMinutes");
let temperature = document.getElementById("temperatura");
let cardTemp = document.getElementById("cardTemp");
let slide = document.getElementById("slide-led");

function changeSlide(value) {
  socket.emit("changeSlide", value);
}

function myClear() {
  socket.emit("clearDB", true);
  location.reload();
}
const sendString = () => {
  let text1 = document.getElementById("text1");
  let text2 = document.getElementById("text2");
  let text = [text1.value, text2.value];
  socket.emit("sendString", text);
};
socket.on("temp", function (data) {
  if (data > 25) {
    cardTemp.classList =
      "max-w-sm bg-red-800 mx-auto rounded-md text-center my-5 p-5";
  } else {
    if (data > 20) {
      cardTemp.classList =
        "max-w-sm bg-red-500 mx-auto rounded-md text-center my-5 p-5";
    } else {
      cardTemp.classList =
        "max-w-sm bg-blue-600 mx-auto rounded-md text-center my-5 p-5";
    }
  }
  temperature.innerHTML = `${data}°C`;
});

saveHorary.addEventListener("click", function () {
  if (
    initialMinutes.value === "" ||
    initialHour.value === "" ||
    finishHour.value === "" ||
    finishMinutes.value === ""
  ) {
    return alert("Please select!");
  }
  socket.emit("saveHorary", [
    initialHour.value,
    initialMinutes.value,
    finishHour.value,
    finishMinutes.value,
  ]);
});

socket.on("ldr", function (data) {
  status = data;
  if (data) {
    localStorage.setItem("status", data);
    alarma.classList =
      "alarma bg-red-600 rounded-2xl mx-auto py-7  px-2 max-w-md w-4 md:max-w-md justify-items-center  text-center";
    textAlarma.innerHTML = data;
    btnAlarma.style.display = "block";
  } else {
    alarma.classList =
      "alarma bg-green-600 rounded-md mx-auto py-7  px-2 max-w-md md:max-w-md justify-items-center  text-center";
    textAlarma.innerHTML = "Funciona todo correctamente";
    btnAlarma.style.display = "none";
  }
});
function preloadFunc() {
  socket.on("ldr", function (data) {
    status = data;
    if (data) {
      localStorage.setItem("status", data);
      alarma.classList =
        "alarma bg-red-600 rounded-2xl mx-auto py-7  px-2 max-w-md md:max-w-md justify-items-center text-center";
      textAlarma.innerHTML = data;
      btnAlarma.style.display = "block";
    } else {
      alarma.classList =
        "alarma bg-green-600 rounded-md mx-auto py-7  px-2 max-w-md md:max-w-md justify-items-center text-center";
      textAlarma.innerHTML = "Funciona todo correctamente";
      btnAlarma.style.display = "none";
    }
  });
}
function resetAlarma() {
  localStorage.setItem("status", false);
  alarma.classList =
    "alarma bg-green-600 rounded-md mx-auto py-7  px-2 max-w-md  md:max-w-md justify-items-center text-center";
  textAlarma.innerHTML = "Funciona todo correctamente";
  btnAlarma.style.display = "none";
  socket.emit("reset", status);
}
window.onpaint = preloadFunc();
