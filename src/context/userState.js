import React, { useEffect, useState } from 'react'
import userContext from './userContext';

import { initializeApp } from "firebase/app";
// import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { getDatabase, ref, onValue, onChildAdded, onChildChanged, update } from "firebase/database";
import Chat from '../Components/Chat';

const UserState = (props) => {
    const [userDetail, setUserDetail] = useState({ username: "Deepak" });    //user data from getUser endpoint
    const [chats, setChats] = useState(new Map()); // map of user name to their chats
    const [users, setUsers] = useState(new Map());
    const [unread, setUnread] = useState(new Map());
    const [message, setmessage] = useState([]);
    const [unreadmessage, unreadsetmessage] = useState([]);
    const [chatWith, setchatWith] = useState("");
    const [newChatBox, setnewChatBox] = useState(false);
    const [chatUsers, setChatUsers] = useState([]);
    const [allUser, setallUser] = useState([]);
    const [newMsg, setnewMsg] = useState({});
    const [replyMsg, setreplyMsg] = useState(null);
    const [UserStateChg, setUserStateChg] = useState({});
    //TODO getjwt from local storage
    const [jwtTokken, setjwtTokken] = useState(localStorage.getItem("jwtTokken"))
    const [chatVisible, setChatVisible] = useState(false);

    useEffect(() => {
        console.log("new msg");
        console.log(newMsg);
        if (newMsg.sender === chatWith.username) {
            var updates = {};
            if (userDetail.username != newMsg.user1) {
                updates[`${newMsg.time}/read`] = true;
                updateMsg(newMsg.user1, newMsg.user2, updates);
            } else {
                var ch = chats.get(newMsg.user2)[0];
                var msg = newMsg;
                msg["read"] = true;
                ch[newMsg["key"]] = msg;
                var mp = chats;
                chats.set(newMsg.user2, [ch]);
            }
            var all = message;
            all = all.concat(unreadmessage);
            all = all.concat(newMsg);
            unreadsetmessage([]);
            setmessage(all);
        } else {
            if (newMsg["read"] == false && newMsg.user1 != userDetail.username) {
                var mp = unread;
                if (!mp.get(newMsg.user1)) createNotif(newMsg.user1)
                if (mp.get(newMsg.user1)) mp.set(newMsg.user1, mp.get(newMsg.user1) + 1);
                else mp.set(newMsg.user1, 1);
                setUnread(mp);
                console.log(mp);
            }
		}
    }, [newMsg]);


    useEffect(() => {
        console.log(unread);
    }, [unread]);

    useEffect(() => {

        if (UserStateChg.username && UserStateChg.username === chatWith.username) {
            setchatWith(UserStateChg);
        }

        const func = async () => {
            if (UserStateChg.username && UserStateChg.username === userDetail.username) {
                if (chatUsers === UserStateChg.chats) {
                } else {

                    if (UserStateChg.chats.length != chatUsers.length) {
                        var newUser = UserStateChg.chats[0];

                        var mp = users;
                        var newUserData = await getUserData(newUser);
                        mp.set(newUser, newUserData);
                        setUsers(mp);

                        mp = chats;
                        mp.set(newUser, []);
                        setChats(mp);

                        mp = unread;
                        mp.set(newUser, 0);
                        setUnread(mp);

                        myFun(newUser);
                    }

                    setChatUsers(UserStateChg.chats);
                }
            }
        }
        func();

    }, [UserStateChg])

    //set online 
    const setOnline = async () => {
        const online = await fetch("http://localhost:5000/api/auth/online", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "token": localStorage.getItem('jwtTokken')})
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
        console.log('running 321');
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
        onChildChanged(chatRef, (data) => {
            var curData = data.val();
            console.log(curData);
            setUserStateChg(curData);
        })
        // const chatRef = ref(db, 'users');
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
        console.log(user, "called the chager");
        const chatRef = ref(db, 'chats/' + dbName);
        console.log('chats/' + dbName, userDetail);
        var curChat = [{}];
        onChildAdded(chatRef, (data) => {
            var curData = data.val();
            curChat[0][data.key] = curData;
            curData["time"] = parseInt(data.key);
            curData["sender"] = user;
            curData["key"] = data.key;
            var mp = chats;
            mp.set(user, curChat);

            console.log("dsfdsfasdfa  ", curData, data.key);

            setnewMsg(curData);
            setChats(mp);
        })
/*        const userRef = ref(db, 'users/'+userDetail.username);
        onChildChanged(userRef, async (data) => {
            const userData = await fetch("http://localhost:5000/api/auth/getUser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "token": jwtTokken })
            });
            const parsed = await userData.json();
            setUserDetail(parsed);
            console.log('changed123')
        })*/
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

        // console.log(parsed);
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
        console.log(chatMap, userMap);
        setUsers(userMap);
        setChats(chatMap);
        // console.log("my all users", users);
        // console.log("my all chats", chats)
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
        // console.log("alluserdata",parsed);
    }

    const updateMsg = async (user1, user2, updates) => {
        const bodyData = {
            "user1": user1,
            "user2": user2,
            "updates": updates
        }
        const res = await fetch('http://localhost:5000/api/chat/updateMsg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
	}
    const readMessage = async (user)=>{
        const bodyData = {
            "token": jwtTokken,
            "user": user
        }
        const res = await fetch('http://localhost:5000/api/chat/readMessage',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
    }
    const createNotif = (user) => {
        if (Notification.permission == "default") {
            Notification.requestPermission().then(() => {
                var not = new Notification("New Message from user", {
                    body: user,
                    icon: "https://www.pngkey.com/png/full/204-2049354_ic-account-box-48px-profile-picture-icon-square.png"
                })
                not.addEventListener("click", () => window.focus());
            })
        } else if (Notification.permission == "granted") {
            var not = new Notification("New Message from user", {
                body: user,
                icon: "https://www.pngkey.com/png/full/204-2049354_ic-account-box-48px-profile-picture-icon-square.png"
            })
            not.addEventListener("click", () => window.focus());
		}
	}


    return (
        <userContext.Provider value={{ userDetail, setUserDetail, unreadmessage, unreadsetmessage, myFun, updateMsg, setOffline, chatVisible, unread, setUnread, setChatVisible, setOnline, handleUserStateChg, getAllUser, mapChats, users, chats, setChats, jwtTokken, message, setmessage, chatWith, setUsers, setchatWith, setjwtTokken, newChatBox, setnewChatBox, myFun, chatUsers, setChatUsers, allUser, setallUser, replyMsg, setreplyMsg, readMessage }}>
            {props.children}
        </userContext.Provider>
    )
}

export default UserState;