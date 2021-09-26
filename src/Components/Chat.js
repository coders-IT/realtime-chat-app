import React, { useContext ,useEffect} from 'react'
import MessageArea from './MessageArea'
import userContext from '../context/userContext';

export default function Chat() {
    const { myFun, chats, chatWith}=useContext(userContext)
    useEffect(() => {
        /*myFun();*/
        /* eslint-disable */
    }, [chats]);
    const timepass = () => {
        console.log(chatWith);
    }
    const getTime = (timestamp) => {
        var dt = new Date(timestamp);
        if (chatWith !== "") return `${dt.getHours() % 12 < 10 ? "0" : ""}${dt.getHours() % 12}:${dt.getMinutes() < 10 ? "0" : ""}${dt.getMinutes()}:${dt.getSeconds() < 10 ? "0" : ""}${dt.getSeconds()} ${dt.getHours() >= 12 ? "PM" : "AM"}`
        else return "";
	}
    return (
        <div className="chat">
            <div className="header" id="header" onClick={ timepass}>
                <img className="profile-pic" src={chatWith.profilePicUrl} alt={chatWith.name} id="header-img" />
                <span style={{ marginLeft: "20px", color: "white", fontSize: "20px" }}>
                    <span style={{ fontWeight: "bolder" }}>{chatWith.name}</span><br /><span style={{ fontSize:"16px" }}>{chatWith.online ? "Online" : getTime(chatWith.lastSeen)}</span>
                </span>
            </div>
            <MessageArea/>
        </div>
    )
}
