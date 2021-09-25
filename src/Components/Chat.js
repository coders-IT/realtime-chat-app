import React, { useContext ,useEffect} from 'react'
import MessageArea from './MessageArea'
import userContext from '../context/userContext';

export default function Chat() {
    const {myFun,chats}=useContext(userContext)
    useEffect(() => {
        myFun();
        /* eslint-disable */
    }, [chats]);
    return (
        <div className="chat">
            <div className="header"></div>
            <MessageArea/>
        </div>
    )
}
