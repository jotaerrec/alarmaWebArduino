# Sistema De Alarmas web

Este proyecto se basa en un sistema de alarmas controlado por un Arduino UNO que se puede visualizar mediante una aplicación web creada con HTML y JavaScript. El arduino se controla con las tecnologias NodeJS y Johnny Five

## Installation

Para poder correr el proyecto, se debe ejecutar una PowerShell (Administrador) y ir a la ruta del proyecto y ejecutar:

Asi mismo el arduino debe estar cargado el Sketchbook StandardFirmata, se puede ver mas a detalle en el siguiente [LINK](http://diegorys.es/2019/11/18/primeros-pasos-con-johnny-five-y-arduino/)

```shell
npm run compile
```

### Diagrama de conexión

![Diagrama](https://i.imgur.com/6MvNOKN.jpg)

## Usage

Luego ejecutar el codigo con:

```bash
npm start
```

El servidor se estará ejecutando en el puerto 3000, para cambiar esto debe cambiar la variable de entorno llamada PORT

## License

[MIT](https://choosealicense.com/licenses/mit/)
