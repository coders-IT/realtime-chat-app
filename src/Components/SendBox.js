import React, { useContext, useEffect } from 'react'
import userContext from '../context/userContext';
import "./Styles/sendBox.css"
const fireBaseApp = require('firebase/app');
const database = require("firebase/database");

export default function SendBox() {
    const data = useContext(userContext);

    //setting up fire base to get changed message

    //connecting to the firebase

    const firebaseConfig = {
        apiKey: "AIzaSyD6NLsiYtcLTLSFMNUUzvgPMK950WFLGZY",
        authDomain: "sampleproject-321915.firebaseapp.com",
        projectId: "sampleproject-321915",
        storageBucket: "sampleproject-321915.appspot.com",
        messagingSenderId: "548884593380",
        appId: "1:548884593380:web:710aae9537f5b0fcea4af1"
    };

    fireBaseApp.initializeApp(firebaseConfig);
    console.log("connected");
    const db = database.getDatabase();

    database.onChildAdded(database.ref(db, "/"), (msg) => {
        console.log(msg);
	})

    const sendMessage = async () => {
        const message = document.getElementById("message");
        const dt = new Date();
        const msgData = {
            "message": message.value,
            "time": dt.getTime(),
            "token": data.jwtTokken,
            "user": data.chatWith,
            "type": "text",
            "reply":null
        }
        message.value = "";
        try {
            const chat = await fetch("http://localhost:5000/api/chat/sendMessage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(msgData)
            });
            const resp = await chat.json();
            console.log(resp);
        } catch (err) {
            console.log(err);
		}
	}
    return (
        <div id="sendMsg">
            {/*<div id="#replyMsg">
                <span id="replyContent">sfdfdfsd</span>
                <span id="cancel">&#10006;</span>
            </div>*/}
            <div id="whole">
                <input type="text" id="message" />
                <i class="material-icons" id="send" onClick={sendMessage}>send</i>
            </div>
        </div>
    )
}
