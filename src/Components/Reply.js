import React, { useContext } from 'react'
import userContext from '../context/userContext'
import "./Styles/reply.css"

export default function Reply() {
    const data = useContext(userContext);
    const removeReply = () => {
        data.setreplyMsg(null);
	}
    if (data.replyMsg) {
        return (
            <div style={{ display: "flex" }}>
                <span id="repMsg">{data.replyMsg}</span><span id="cross" onClick={removeReply}>&#10008;</span>
            </div>
        )
    } else return(<></>)
}
