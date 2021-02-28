export const mysql = require("mysql2");
import {dbHost, dbLogin, dbPassword} from '../config/config';

class Connector {
    private connection : any;

    constructor(){
        this.connection = mysql.createConnection({
            host: dbHost,
            user: dbLogin,
            database: "doctorApp",
            password: dbPassword,
            dateStrings: true
          });
    }

    connect(){
        this.connection.connect(function(err : any){
            if (err) {
              return console.error("Ошибка: " + err.message);
            }
            else{
              console.log("Подключение к серверу MySQL успешно установлено");
            }
         });
    }

    getConnect(){
        return this.connection;
    }

    disconnect(){
        this.connection.end(function(err : any) {
            if (err) {
              return console.log("Ошибка: " + err.message);
            }
            console.log("Подключение закрыто");
          });
    }
}

export const connector : Connector = new Connector();

module.exports = {connector, mysql};