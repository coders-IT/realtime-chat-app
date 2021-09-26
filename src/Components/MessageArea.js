import React, {useContext, useEffect} from 'react'
import userContext from '../context/userContext';
import MessageCard from './MessageCard';
import SendBox from './SendBox';
import "./Styles/MessageArea.css"

export default function MessageArea() {
    const data = useContext(userContext)
    // const message = [];
    useEffect(() => {
        if (data.chatWith !== "") {
            let div = document.getElementById('msgArea');
            div.scrollTop = div.scrollHeight - div.clientHeight;
        }
    })
    const btm = `${window.innerHeight*0.98 - Math.max(window.innerHeight * 0.1, 70) - Math.max(60, window.innerHeight * 0.1)}px`;

    if (data.chatWith === "") return (<></>)
    else {
        return (
            <>
                <div id="msgArea" >
                    {
                        data.message.map((elem) => {
                            return <MessageCard key={elem.time} message={elem} />
                        })
                    }
                </div>
                <SendBox />
            </>
        )
    }
}
