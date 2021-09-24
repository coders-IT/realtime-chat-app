import React, { useState } from 'react'
import userContext from './userContext';

import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { getDatabase, ref, onValue} from "firebase/database";

const UserState = (props) => {
    const [userDetail, setUserDetail] = useState({ username: "Deepak" });    //user data from getUser endpoint
    const [chats, setChats] = useState(new Map()); // map of user name to their chats
    const [users, setUsers] = useState(new Map());
    const [message, setmessage] = useState([])
    const [chatWith, setchatWith] = useState("");
    const [newChatBox, setnewChatBox] = useState(false);
    const [chatUsers, setChatUsers] = useState([]);
    //TODO getjwt from local storage
    const [jwtTokken, setjwtTokken] = useState(localStorage.getItem("jwtTokken"))
    
    const myFun=()=>{
        const firebaseApp = initializeApp({
            apiKey: "AIzaSyD6NLsiYtcLTLSFMNUUzvgPMK950WFLGZY",
            authDomain: "sampleproject-321915.firebaseapp.com",
            databaseURL: "https://sampleproject-321915-default-rtdb.firebaseio.com",
            projectId: "sampleproject-321915",
            storageBucket: "sampleproject-321915.appspot.com",
            messagingSenderId: "652578540292",
            appId: "1:652578540292:web:99c9bb6692cb52ecbcde51",
            measurementId: "G-97CERWH4KW"
        });
        const db = getDatabase();
        const chatRef = ref(db, '/');
        onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            console.log("changed",data);
            // mapChats();
        });
    }

    const getChatData = async (user) => {

        const bodyData = {
            "token": jwtTokken,
            "user": user
        }
        const chat = await fetch("http://localhost:5000/api/chat/getMessage", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        const data = await chat.json();
        return data;
    }
    const getUserData = async (user) => {
        const bodyData = {
            'token': jwtTokken,
            'user': user
        }
        const res = await fetch('http://localhost:5000/api/people/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        const data = await res.json();
        return data;
    }

    const mapChats = async () => {

        const userData = await fetch("http://localhost:5000/api/auth/getUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "token": jwtTokken })
        });
        const parsed = await userData.json();
        setUserDetail(parsed);

        var chatList = parsed.chats;
        var chatMap = new Map();
        let userMap = new Map();
        for (var i of chatList) {
            const data = await getChatData(i);
            chatMap.set(i, data);
            let userAbout = await getUserData(i);
            userMap.set(i, userAbout);
            console.info("info:", i, userAbout);
        }
        console.log(chatMap);
        setUsers(userMap);
        setChats(chatMap);
        myFun();
    }

    return (
        <userContext.Provider value={{ userDetail, mapChats, users, chats, setChats, jwtTokken, message, setmessage, chatWith, setUsers, setchatWith, setjwtTokken, newChatBox, setnewChatBox, chatUsers, setChatUsers }}>
            {props.children}
        </userContext.Provider>
    )
}

export default UserState;
