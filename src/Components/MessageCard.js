import React, { useContext } from 'react'
import userContext from '../context/userContext';
import "./Styles/MessageCard.css"

export default function MessageCard(props) {
    const data = useContext(userContext);
    var flt,username;
    if (props.message.user1 === data.userDetail.username) {
        flt = "sent";
        username = "You";
        // console.log("orignal name", username);
    } else {
        flt = "recived";
        username = data.chatWith.name;
    }
    const dt = new Date(props.message.time);

    /*replyMsg, setreplyMsg*/

    const addReply = () => {
        console.log("set reply")
        data.setreplyMsg(props.message);
	}

    if (props.message.reply == null) {
        return (
            <div className={`${flt}`} onDoubleClick={addReply} id={props.message.time}>
                <div id="main">
                    <div id="sender">{username}</div>
                    <div id="content">
                        <div id="desc">{props.message.message}</div>
                    </div>
                    <div className="time">
                        {`${dt.getHours() % 12 < 10 ? "0" : ""}${dt.getHours() % 12}:${dt.getMinutes() < 10 ? "0" : ""}${dt.getMinutes()} ${dt.getHours() >=12 ?"PM":"AM"}`}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={`${flt}`} onDoubleClick={addReply} id={props.message.time}>
                <div id="main">
                    <div id="sender">{username}</div>
                    <div id="content">
                        <div id="reply">{props.message.reply}</div>
                        <div id="desc">{props.message.message}</div>
                    </div>
                    <div className="time">
                        {`${dt.getHours() % 12 < 10 ? "0" : ""}${dt.getHours() % 12}:${dt.getMinutes() < 10 ? "0" : ""}${dt.getMinutes()}:${dt.getHours() >= 12 ? "PM" : "AM"}`}
                    </div>
                </div>
            </div>
        )
    }
}
