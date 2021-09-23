import React, { useContext, useEffect, useState } from 'react'
import userContext from '../context/userContext';
import ChatListCard from './ChatListCard';

export default function ChatList() {
    const { userDetail, chats, mapChats, users } = useContext(userContext);
    const [chatUsers, setChatUsers] = useState([]);
    useEffect(() => {
        mapChats();
    }, []);
    useEffect(() => {
        setChatUsers([]);
        let arr = [];
        for (let i in chats) arr.push(i)
        setChatUsers(arr);
    }, [chats]);
    // declare imgleturl before uncommenting line 36 to line 41 
    return (
        <div className="chat-list">
            <div className="header header-chat-list chat-list-card">
                <img className="profile-pic" src={userDetail.profilePicUrl} alt={userDetail.name} />
                <div className="chat-user">
                    {userDetail.name}
                </div>
            </div>
            <div className="list">
                {chatUsers.map((user) => {
                    let message, userName, imgUrl;
                    for (let i in chats[user][0]) {
                        message = chats[user][0][i].message;
                        userName = users.get(user).name;
                        imgUrl = users.get(user).profilePicUrl;
                    }
                    return <ChatListCard message={message} user={userName} imgUrl={imgUrl} />
                })}
                {/* <ChatListCard user="Bhannasa" message="Hi there!" imgUrl={imgleturl}/>
                <ChatListCard user="Bhannasa" message="Hi there1!" imgUrl={imgleturl}/>
                <ChatListCard user="Bhannasa" message="Hi there are you like coming tomorrow morning or not?" imgUrl={imgleturl}/>
                <ChatListCard user="Bhannasa" message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur eveniet perspiciatis necessitatibus, sed nulla natus cupiditate neque quos reiciendis recusandae, placeat similique tempora optio ullam veritatis voluptates. Doloribus, nostrum labore veritatis in consequatur rerum?" imgUrl={imgleturl}/>
                <ChatListCard user="Bhannasa" message="Hi there3!" imgUrl={imgleturl}/>
                <ChatListCard user="Bhannasa" message="Hi there4!" imgUrl={imgleturl}/> */}
            </div>
        </div>
    )
}
