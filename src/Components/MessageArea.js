import React, {useContext, useEffect} from 'react'
import userContext from '../context/userContext';
import MessageCard from './MessageCard';
import Reply from './Reply';
import SendBox from './SendBox';
// import "./Styles/MessageArea.css"

export default function MessageArea() {
    const data = useContext(userContext)
    // const message = [];
    useEffect(() => {
        if (data.chatWith !== "") {
            let div = document.getElementById('msgArea');
            div.scrollTop = div.scrollHeight - div.clientHeight;
        }
    })


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
                <Reply/>
                <SendBox />
            </>
        )
    }
}
