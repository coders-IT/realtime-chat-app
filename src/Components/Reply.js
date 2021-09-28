import React, { useContext } from 'react'
import userContext from '../context/userContext'
// import "./Styles/reply.css"

export default function Reply() {
    const data = useContext(userContext);
    const removeReply = () => {
        data.setreplyMsg(null);
	}
    if (data.replyMsg) {
        return (
            <div id="repMsgCont" style={{ display: "flex" }}>
                <span id="repMsg">{data.replyMsg.user}: {data.replyMsg.message}</span><span id="cross" onClick={removeReply}>&#10006;</span>
            </div>
        )
    } else return(<></>)
}
