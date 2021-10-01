/* eslint-disable */ 
import React, { useContext, useState } from "react";
import userContext from "../context/userContext";

export default function ChatListCard(props) {
    const data = useContext(userContext);
    const [unReadCount, setUnReadCount] = useState(props.unreadCount);
    const squeeze = (str) => {
        let maxChar = 30;
        if (str.length <= maxChar) return str;
        return str.substr(0, maxChar - 2) + "...";
    };
    const getFormatedTime = (time) => {
        let dt = new Date(time);
        var hour = "";
        if (dt.getHours() % 12 == 0) hour += "12";
        else hour += `${dt.getHours() % 12 < 10 ? "0" : ""}${dt.getHours() % 12}`;
        const dtc = new Date();
        if (
            dt.getDate() !== dtc.getDate() ||
            dt.getMonth() !== dtc.getMonth() ||
            dt.getFullYear() !== dtc.getFullYear()
        ) {
            return `${dt.getDate()}/${dt.getMonth()}/${dt.getFullYear()}`;
        }
        return `${hour}:${dt.getMinutes() < 10 ? "0" : ""}${dt.getMinutes()} ${dt.getHours() >= 12 ? "PM" : "AM"
            }`;
    };
    const getUserMessage = async () => {
        setUnReadCount(0);
        if (data.chatWith) data.readMessage(data.chatWith.username);
        data.setreplyMsg(null);
        var arr = [];
        var unreadarr = [];
        var updates = {};
        const jsonData = data.chats.get(props.uniqName)[0];
        var uread = false;
        for (var i in jsonData) {
            if (jsonData[i]["read"] == false) {
                updates[`${i}/read`] = true;
                uread = true;
                jsonData[i]["read"] = true;
                unreadarr.push(jsonData[i]);
            } else arr.push(jsonData[i]);
        }

        // Updating read chats
        var mp = data.chats;
        mp.set(props.uniqName, [jsonData]);
        data.setChats(mp);

        if (uread) {
            data.updateMsg(data.userDetail.username, props.uniqName, updates);
        }

        var mp = data.unread;
        mp.set(props.uniqName, 0);
        data.setUnread(mp);

        data.setmessage(arr);
        data.unreadsetmessage(unreadarr);

        if (data.chatWith !== "")
            document.getElementById(data.chatWith.username).style.backgroundColor =
                "transparent";
        document.getElementById(props.uniqName).style.backgroundColor =
            "var(--theme-red)";

        const userData = await fetch(
            "http://localhost:5000/api/auth/getUserWithName",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: props.uniqName }),
            }
        );
        const parsed = await userData.json();
        data.setchatWith(parsed);
        data.setChatVisible(true);
    };
    return (
        <div
            className="chat-list-card"
            onClick={getUserMessage}
            id={props.uniqName}
        >
            <img className="profile-pic" src={props.imgUrl} alt={props.user} />
            <div className="chat-preview">
                <div className="chat-user">{props.user}</div>
                <div className="chat-last-message">
                    {props.sentBy}
                    {squeeze(props.message)}
                </div>
            </div>
            {props.unreadCont > 0 && (
                <div className="unReadCountCont">
                    <div className="unReadCount">{props.unreadCont}</div>
                </div>
            )}
        </div>
    );
}
