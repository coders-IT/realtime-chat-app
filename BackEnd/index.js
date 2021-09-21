const express = require("express");
const app = express();

//dotenv is a module to set environment variables automaticlly from the .env file
const envVar = require("dotenv").config().parsed;

const fireBaseApp = require('firebase/app');

//connecting to the firebase
var config = {
	apiKey: envVar.fireBase_API,
	authDomain: envVar.fireBase_authDomain,
	databaseURL: envVar.fireBase_DatabaseURL,
	storageBucket: envVar.fireBase_StorageBucket
};

fireBaseApp.initializeApp(config);


app.use('/api/auth',require('./routes/auth'));
app.use('/api/chat',require('./routes/sendMsg'));
// some more routes can be added


app.listen(5000, () => {
	console.log("Listning to port 5000")
})