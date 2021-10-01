/* eslint-disable */ 
import React, { useContext, useEffect } from "react";
import userContext from "../context/userContext";

export default function SendBox() {
    const data = useContext(userContext);

    useEffect(() => {
        if (data.replyMsg) document.getElementById("message").focus();
    }, [data.replyMsg]);
    useEffect(() => {
        document.getElementById("message").focus();
    }, [data.chatWith]);
    const sendMessage = async (e) => {
        e.preventDefault();
        const message = document.getElementById("message");
        const dt = new Date();
        var elemData = message.value;
        elemData = elemData.trim();
        if (elemData == "") return;
        const msgData = {
            message: elemData,
            time: dt.getTime(),
            token: data.jwtTokken,
            user: data.chatWith.username,
            type: "text",
            reply: data.replyMsg,
        };
        message.value = "";
        try {
            fetch("http://localhost:5000/api/chat/sendMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(msgData),
            });
            data.setreplyMsg(null);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div id="sendMsg">
            <form id="whole">
                <input type="text" id="message" placeholder="Type a message" />
                <input type="submit" id="send" value="&#10148;" onClick={sendMessage} />
            </form>
        </div>
    );
}
