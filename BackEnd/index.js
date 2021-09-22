const express = require("express");
const cors=require('cors');

//dotenv is a module to set environment variables automaticlly from the .env file
const envVar = require("dotenv").config().parsed;

const fireBaseApp = require('firebase/app');

//connecting to the firebase
const firebaseConfig = {
	apiKey: envVar.fireBase_API,
	authDomain: envVar.fireBase_authDomain,
	projectId: envVar.fireBase_projectid,
	storageBucket: envVar.fireBase_StorageBucket,
	messagingSenderId: envVar.fireBase_messagingSenderId,
	appId: envVar.fireBase_appId,
};

fireBaseApp.initializeApp(firebaseConfig);

const app = express();

app.use(cors());
app.use(express.json())

app.use('/api/auth',require('./routes/auth'));
app.use('/api/chat', require('./routes/sendMsg'));
app.use('/api/people', require('./routes/people'));
app.use('/api/settings', require('./routes/settings'));

// some more routes can be added


app.listen(5000, () => {
	console.log("Listening to port 5000")
})