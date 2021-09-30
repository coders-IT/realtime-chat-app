import React, { useContext } from 'react'
import userContext from '../context/userContext';
// import "./Styles/MessageCard.css"

export default function MessageCard(props) {
    const data = useContext(userContext);
    var flt,username;
    if (props.message.user1 === data.userDetail.username) {
        flt = "sent";
        username = "You";
        // console.log("orignal name", username);
    } else {
        flt = "received";
        username = data.chatWith.name;
    }
    const dt = new Date(props.message.time);
    const squeeze = (str) => {
        let maxChar = 45;
        if (str.length <= maxChar) return str;
        return str.substr(0, maxChar - 2) + "...";
    }
    /*replyMsg, setreplyMsg*/

    const addReply = () => {
        let user=username;
        data.setreplyMsg({message:props.message.message,user:user});
	}

    var reply;
    if(props.message.reply && props.message.reply.user){
        let user=props.message.reply.user;
        if(props.message.reply.user===data.userDetail.username) user='You';
        reply=user+": "+props.message.reply.message;
    }else reply = props.message.reply;

    const getFormatedTime = (dt) => {
        var hour = "";
        if (dt.getHours() % 12 == 0) hour += "12";
        else hour += `${dt.getHours() % 12 < 10 ? "0" : ""}${dt.getHours() % 12}`;
        return `${hour}:${dt.getMinutes() < 10 ? "0" : ""}${dt.getMinutes()} ${dt.getHours() >= 12 ? "PM" : "AM"}`
	}

    return (
        <div className={`${flt}`} onDoubleClick={addReply} id={props.message.time}>
            <div id="main">
                <div className="about">
                    <div id="sender">{username}</div>
                    <div className="time">
                        {getFormatedTime(dt)}
                    </div>
                </div>
                <div id="content">
                    {props.message.reply && <div id="reply">{squeeze(reply)}</div>}
                    <div id="desc">{props.message.message}</div>
                </div>
            </div>
        </div>
    )

}
