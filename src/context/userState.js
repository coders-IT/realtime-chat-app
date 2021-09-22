import React, { useState } from 'react'
import userContext from './userContext';

const UserState = (props) => {
    const [userDetail, setUserDetail] = useState({username:"Deepak"});    //user data from getUser endpoint
    const [chats, setChats] = useState(null); // map of user name to their chats

    //TODO getjwt from local storage
    const jwtTokken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiYmhhbnNhIn0sImlhdCI6MTYzMjM0NzY3NH0.6dlz4uGaws_7cylehL8R95HCvme7L_5g48G7AbEKjXE";

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

        for (var i of chatList) {
            chatMap[i] = getChatData(i);
		}

        console.log(chatMap);
        setChats(chatMap);
	}


    return (
        <userContext.Provider value={{ userDetail, mapChats, chats, jwtTokken }}>
            {props.children}
        </userContext.Provider>
    )
}

export default UserState;
