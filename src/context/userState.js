import React, { useEffect, useState } from 'react'
import userContext from './userContext';

import { initializeApp } from "firebase/app";
// import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { getDatabase, ref, onValue, onChildAdded, onChildChanged} from "firebase/database";
import Chat from '../Components/Chat';

const UserState = (props) => {
    const [userDetail, setUserDetail] = useState({ username: "Deepak" });    //user data from getUser endpoint
    const [chats, setChats] = useState(new Map()); // map of user name to their chats
    const [users, setUsers] = useState(new Map());
    const [message, setmessage] = useState([])
    const [chatWith, setchatWith] = useState("");
    const [newChatBox, setnewChatBox] = useState(false);
    const [chatUsers, setChatUsers] = useState([]);
    const [allUser, setallUser] = useState([]);
    const [newMsg, setnewMsg] = useState({});
    const [replyMsg, setreplyMsg] = useState(null);
    const [UserStateChg, setUserStateChg] = useState({});
    //TODO getjwt from local storage
    const [jwtTokken, setjwtTokken] = useState(localStorage.getItem("jwtTokken"))

    useEffect(() => {
        if (newMsg.sender === chatWith.username) {
            setmessage(message.concat(newMsg));
		}
    }, [newMsg]);

    useEffect(() => {
        if (UserStateChg.username && UserStateChg.username === chatWith.username) {
            setchatWith(UserStateChg);
        }
    }, [UserStateChg])

    //set online 
    const setOnline = async () => {
        const online = await fetch("http://localhost:5000/api/auth/online", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "token": jwtTokken })
        });
        const parsed = await online.json();
        console.log(parsed);
    }
    //setoffline
    const setOffline = async () => {
        const offline = await fetch("http://localhost:5000/api/auth/offline", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "token": jwtTokken })
        });
        const parsed = await offline.json();
        console.log(parsed);
    }

    const handleUserStateChg = (user) => {
        const firebaseApp = initializeApp({
            apiKey: "AIzaSyCuw7Z7cnh2XpKkkzd8m_nFBL4KZ8GJ2hk",
            authDomain: "bhannasa-realtime-chat-app.firebaseapp.com",
            databaseURL: "https://bhannasa-realtime-chat-app-default-rtdb.firebaseio.com",
            projectId: "bhannasa-realtime-chat-app",
            storageBucket: "bhannasa-realtime-chat-app.appspot.com",
            messagingSenderId: "40408807989",
            appId: "1:40408807989:web:b2538339e5d7d2edd3cf7c"
        });
        const db = getDatabase();

        const chatRef = ref(db, 'users');
        var curChat = [{}];
        onChildChanged(chatRef, (data) => {
            var curData = data.val();
            console.log(curData);
            setUserStateChg(curData);
        })
    }

    //updating user online status automatically

    const myFun = (user) => {
        const firebaseApp = initializeApp({
            apiKey: "AIzaSyCuw7Z7cnh2XpKkkzd8m_nFBL4KZ8GJ2hk",
            authDomain: "bhannasa-realtime-chat-app.firebaseapp.com",
            databaseURL: "https://bhannasa-realtime-chat-app-default-rtdb.firebaseio.com",
            projectId: "bhannasa-realtime-chat-app",
            storageBucket: "bhannasa-realtime-chat-app.appspot.com",
            messagingSenderId: "40408807989",
            appId: "1:40408807989:web:b2538339e5d7d2edd3cf7c"
        });
        const db = getDatabase();
        var dbName = "";
        if (user < userDetail.username) dbName = user + userDetail.username;
        else dbName = userDetail.username + user;

        const chatRef = ref(db, 'chats/' + dbName);
        var curChat = [{}];
        onChildAdded(chatRef, (data) => {
            var curData = data.val();
            curChat[0][data.key] = curData;
            const dt = new Date();
            curData["time"] = parseInt(dt.getTime());
            curData["sender"] = user;
            var mp = chats;
            mp.set(user, curChat);


            setnewMsg(curData);
            setChats(mp);
        })
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

        console.log(parsed);
        var chatList = parsed.chats;
        if (chatList == null) chatList = [];
        var chatMap = new Map();
        let userMap = new Map();
        for (var i of chatList) {
            const data = await getChatData(i);
            chatMap.set(i, data);
            let userAbout = await getUserData(i);
            userMap.set(i, userAbout);
            // console.info("info:", i, userAbout);
        }
        // console.log(chatMap);
        setUsers(userMap);
        setChats(chatMap);
        console.log("my all users", users);
        console.log("my all chats", chats)
    }

    const getAllUser = async () => {
        const userData = await fetch("http://localhost:5000/api/people/alluser", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const parsed = await userData.json();

        setallUser(parsed);
        console.log("alluserdata",parsed);
    }

    return (
        <userContext.Provider value={{ userDetail, myFun, setOffline, setOnline, handleUserStateChg, getAllUser, mapChats, users, chats, setChats, jwtTokken, message, setmessage, chatWith, setUsers, setchatWith, setjwtTokken, newChatBox, setnewChatBox, myFun, chatUsers, setChatUsers, allUser, setallUser, replyMsg, setreplyMsg}}>
            {props.children}
        </userContext.Provider>
    )
}

export default UserState;
