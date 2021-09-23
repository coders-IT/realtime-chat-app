import React, { useContext } from 'react'
import userContext from '../context/userContext';
import "./Styles/MessageCard.css"

export default function MessageCard(props) {
    const data = useContext(userContext);
    var flt,username;
    if (props.message.user1 === data.userDetail.username) {
        flt = "sent";

    } else flt = "recived";

    if (props.message.reply == null) {
        return (
            <div className={`${flt}`}>
                <div id="main">
                    <div id="sender">{data.userDetail.username}</div>
                    <div id="content">
                        <div id="desc">{props.message.message}</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={`${flt}`}>
                <div id="main">
                    <div id="sender">{data.userDetail.username}</div>
                    <div id="content">
                        <div id="reply">{props.message.reply}</div>
                        <div id="desc">{props.message.message}</div>
                    </div>
                </div>
            </div>
        )
    }
}
