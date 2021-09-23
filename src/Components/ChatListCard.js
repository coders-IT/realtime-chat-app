import React, { useContext } from 'react'
import userContext from '../context/userContext';

export default function ChatListCard(props) {
    const data = useContext(userContext);
    const squeeze = (str) => {
        let maxChar = 70;
        if (str.length <= maxChar) return str;
        return str.substr(0, maxChar - 2) + "...";
    }
    const getUserMessage = () => {
        console.log(props.user);
        var arr = [];
        const jsonData = data.chats.get(props.uniqName)[0];
        for (var i in jsonData) {
            arr.push(jsonData[i]);
            console.log(jsonData[i], i);
        }
        data.setmessage(arr);
        data.setchatWith(props.uniqName);
        console.log("adfsfsd",data.chatWith);
	}
    return (
        <div className="chat-list-card" onClick={ getUserMessage }>
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
