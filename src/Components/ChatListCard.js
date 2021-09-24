import React, { useContext } from 'react'
import userContext from '../context/userContext';

export default function ChatListCard(props) {
    const data = useContext(userContext);
    const squeeze = (str) => {
        let maxChar = 70;
        if (str.length <= maxChar) return str;
        return str.substr(0, maxChar - 2) + "...";
    }
    const getUserMessage = async () => {
        console.log(props.user);
        var arr = [];
        const jsonData = data.chats.get(props.uniqName)[0];
        for (var i in jsonData) {
            arr.push(jsonData[i]);
            console.log(jsonData[i], i);
        }
        data.setmessage(arr);
        document.getElementById(props.uniqName).style.backgroundColor = "#d8d8d8";

        if (data.chatWith!="") document.getElementById(data.chatWith.username).style.backgroundColor = "#999";

        const userData = await fetch("http://localhost:5000/api/auth/getUserWithName", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "username": props.uniqName })
        });
        const parsed = await userData.json();

        data.setchatWith(parsed);
	}
    return (
        <div className="chat-list-card" onClick={getUserMessage} id={props.uniqName}>
            <img className="profile-pic" src={props.imgUrl} alt={props.user} />
            <div className="chat-preview">
                <div className="chat-user">
                    {props.user}
                </div>
                <div className="chat-last-message">
                    {squeeze(props.message)}
                </div>
            </div>
        </div>
    )
}
