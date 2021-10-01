import React, { useContext } from "react";
import userContext from "../context/userContext";
// import "./Styles/reply.css"

export default function Reply() {
    const data = useContext(userContext);
    const removeReply = () => {
        data.setreplyMsg(null);
    };
    const squeeze = (str) => {
        let maxChar = 30;
        if (str.length <= maxChar) return str;
        return str.substr(0, maxChar - 2) + "...";
    };
    if (data.replyMsg) {
        return (
            <div id="repMsgCont" style={{ display: "flex" }}>
                <span id="repMsg">
                    {data.replyMsg.user}: {squeeze(data.replyMsg.message)}
                </span>
                <span id="cross" onClick={removeReply}>
                    &#10006;
                </span>
            </div>
        );
    } else return <></>;
}
