import React, {useContext, useEffect} from 'react'
import userContext from '../context/userContext';
import MessageCard from './MessageCard';
import SendBox from './SendBox';
import "./Styles/MessageArea.css"

export default function MessageArea() {
    const data = useContext(userContext)
    const message = [];
    useEffect(()=>{
        let div=document.getElementById('msgArea');
        console.log('scrolled');
        div.scrollTop = div.scrollHeight - div.clientHeight;
    })
    return (
        <>
            <div id="msgArea">
                {
                    data.message.map((elem) => {
                        return <MessageCard message={elem}/>
                    })
                }
            </div>
            {/* <SendBox/> */}
        </>
    )
}
