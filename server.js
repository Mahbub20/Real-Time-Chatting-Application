
'use strict';

const electron = require('electron');
const { app, BrowserWindow } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700
    });

    mainWindow.setTitle('Chat');
    mainWindow.loadURL('http://localhost:3000');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});



const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');

const socketEvents = require('./utils/socket'); 
const routes = require('./utils/routes'); 
const config = require('./utils/config'); 


class Server{

    constructor(){
        this.port =  process.env.PORT || 3000;
        this.host = 'localhost';
        
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
    }

    appConfig(){        
        this.app.use(
            bodyParser.json()
        );
        new config(this.app);
    }

    
    includeRoutes(){
        new routes(this.app).routesConfig();
        new socketEvents(this.socket).socketConfig();
    }
     

    appExecute(){

        this.appConfig();
        this.includeRoutes();

        this.http.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
    }

}

const app = new Server();
app.appExecute();
