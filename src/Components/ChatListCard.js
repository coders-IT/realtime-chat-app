import React from 'react'

export default function ChatListCard(props) {
    const squeeze = (str) => {
        let maxChar = 70;
        if (str.length <= maxChar) return str;
        return str.substr(0, maxChar - 2) + "...";
    }
    return (
        <div className="chat-list-card">
            <img className="profile-pic" src={props.imgUrl} alt={props.user} />
            <div className="chat-preview">
                <div className="chat-user">
                    {props.user}
                </div>
                <div className="chat-last-message">
                    {squeeze(props.message)}
                </div>
            </div>
        </div>
    )
}
