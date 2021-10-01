/* eslint-disable */ 
import React, { useContext } from "react";
import MessageArea from "./MessageArea";
import userContext from "../context/userContext";
import "./Styles/Chat.css";

export default function Chat() {
    const { chatWith, chatVisible, setChatVisible, setchatWith } =
        useContext(userContext);

    const getFormatedTime = (dt) => {
        var hour = "";
        if (dt.getHours() % 12 == 0) hour += "12";
        else hour += `${dt.getHours() % 12 < 10 ? "0" : ""}${dt.getHours() % 12}`;
        return `${hour}:${dt.getMinutes() < 10 ? "0" : ""}${dt.getMinutes()} ${dt.getHours() >= 12 ? "PM" : "AM"
            }`;
    };

    const getTime = (timestamp) => {
        if (chatWith === "") return "";
        const dt = new Date(timestamp);
        const curDt = new Date();
        let lastSeen = "Last seen at " + getFormatedTime(dt) + " ";
        if (
            dt.getDate() !== curDt.getDate() ||
            (dt.getMonth() !== curDt.getMonth() &&
                dt.getFullYear() !== curDt.getFullYear())
        ) {
            lastSeen +=
                dt.getDate() + "/" + dt.getMonth() + "/" + (dt.getFullYear() % 100);
        }
        return lastSeen;
    };
    if (window.innerWidth > 600 || chatVisible === true) {
        return (
            <div className="chat">
                {chatWith && (
                    <div className="header header-chat" id="header">
                        {window.innerWidth <= 600 && (
                            <div
                                className="fas"
                                onClick={() => {
                                    setChatVisible(false);
                                    setchatWith("");
                                }}
                            >
                                &#xf104;
                            </div>
                        )}
                        <img
                            className="profile-pic"
                            src={chatWith.profilePicUrl}
                            alt={chatWith.name}
                            id="header-img"
                        />
                        <span
                            style={{ marginLeft: "20px", color: "white", fontSize: "20px" }}
                        >
                            <span style={{ fontWeight: "bolder" }}>{chatWith.name}</span>
                            <br />
                            <span style={{ fontSize: "16px" }}>
                                {chatWith.online ? "Online" : getTime(chatWith.lastSeen)}
                            </span>
                        </span>
                    </div>
                )}
                <MessageArea />
            </div>
        );
    } else return <></>;
}
