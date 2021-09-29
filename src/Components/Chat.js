import React, { useContext ,useEffect} from 'react'
import MessageArea from './MessageArea'
import userContext from '../context/userContext';
import './Styles/Chat.css';

export default function Chat() {
    const { myFun, chats, chatWith, chatVisible, setChatVisible}=useContext(userContext)
    useEffect(() => {
        /*myFun();*/
        /* eslint-disable */
    }, [chats]);
    const getTime = (timestamp) => {
        if(chatWith === "") return "";
        const dt = new Date(timestamp);
        const curDt=new Date();
        let hours=dt.getHours();
        hours%=12;
        if(!hours)  hours=12;

        let lastSeen="Last seen at " + hours +":"+ dt.getMinutes() + (dt.getHours()>=12?" PM ":" AM ");
        if(dt.getDate() !== curDt.getDate() || dt.getMonth() !== curDt.getMonth() && dt.getFullYear() !== curDt.getFullYear()){
            lastSeen+= dt.getDate() +"/"+ dt.getMonth() +"/"+ (dt.getFullYear()%100); 
        }
        return lastSeen;
    }
    if ( innerWidth > 600 || chatVisible === true) {
        return (
            <div className="chat">
                {chatWith&&(<div className="header header-chat" id="header">
                    {innerWidth<=600 && (<div className="fas" onClick={()=>{setChatVisible(false)}}>&#xf104;</div>)}
                    <img className="profile-pic" src={chatWith.profilePicUrl} alt={chatWith.name} id="header-img" />
                    <span style={{ marginLeft: "20px", color: "white", fontSize: "20px" }}>
                        <span style={{ fontWeight: "bolder" }}>{chatWith.name}</span><br /><span style={{ fontSize: "16px" }}>{chatWith.online ? "Online" : getTime(chatWith.lastSeen)}</span>
                    </span>
                </div>)}
                <MessageArea />
            </div>
        )
    } else return (<></>)
}
