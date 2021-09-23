import React, { useState } from 'react'
import userContext from './userContext';

const UserState = (props) => {
    const [userDetail, setUserDetail] = useState({ username: "Deepak" });    //user data from getUser endpoint
    const [chats, setChats] = useState(null); // map of user name to their chats
    const [users, setUsers] = useState(new Map());
    //TODO getjwt from local storage
    let jwtTokken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiYmhhbnNhIn0sImlhdCI6MTYzMjM0NzY3NH0.6dlz4uGaws_7cylehL8R95HCvme7L_5g48G7AbEKjXE";
    jwtTokken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiYWRtaW4ifSwiaWF0IjoxNjMyMzA2MDc2fQ.IXNH2WwFTe7YVodRLTG8n7EXbIj0yn47TKbBK4GXCvc";
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
            chatMap[i] = await getChatData(i);
            let userAbout = await getUserData(i);
            userMap.set(i, userAbout);
            console.info("info:", i, userAbout);
        }
        setUsers(userMap);
        setChats(chatMap);
    }

    return (
        <userContext.Provider value={{ userDetail, mapChats, users, chats, jwtTokken }}>
            {props.children}
        </userContext.Provider>
    )
}

export default UserState;
