/* eslint-disable */ 
import { useContext } from "react";
import userContext from "../context/userContext";
import MessageCard from "./MessageCard";

export default function UnreadMessage(props) {
    const data = useContext(userContext);
    if (data.unreadmessage.length) {
        props.setSroll(true);
        return (
            <>
                <hr id="unreadmsg" style={{ color: "white" }} />
                {data.unreadmessage.map((elem) => {
                    props.setScrollDef(elem.time);
                    return <MessageCard key={elem.time} message={elem} />;
                })}
            </>
        );
    } else return <></>;
}
