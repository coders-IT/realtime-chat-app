import React, { useContext, useEffect } from "react";
import userContext from "../context/userContext";
import MessageCard from "./MessageCard";
import Reply from "./Reply";
import SendBox from "./SendBox";

export default function MessageArea() {
    const data = useContext(userContext);
    let scrollDef;
    useEffect(() => {
        if (data.chatWith !== "") {
            let scroll = document.getElementById("unreadmsg");
            if (scroll) scroll.scrollIntoView(true);
            else if (scrollDef)
                document.getElementById(scrollDef).scrollIntoView(true);
        }
    });

    if (data.chatWith === "") return <></>;
    else {
        return (
            <>
                <div id="msgArea">
                    {data.message.map((elem) => {
                        scrollDef = elem.time;
                        return <MessageCard key={elem.time} message={elem} />;
                    })}
                    {!!data.unreadmessage.length && (
                        <>
                            <div id="unreadmsg" style={{width:"100%",textAlign:"center",backgroundColor:"var(--theme-red)",color:"white",margin:"10px 0",padding:"5px 0",borderRadius:"100px"}}>4 unread messages</div>
                            {data.unreadmessage.map((elem) => {
                                scrollDef = elem.time;
                                return <MessageCard key={elem.time} message={elem} />;
                            })}
                        </>
                    )}
                </div>
                <Reply />
                <SendBox />
            </>
        );
    }
}
