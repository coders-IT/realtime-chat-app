import React, { useContext, useEffect, useState } from 'react'
import userContext from '../context/userContext';
import ChatListCard from './ChatListCard';

export default function ChatList() {
    const { userDetail, chats, mapChats, users, setnewChatBox, newChatBox, chatUsers, setChatUsers } = useContext(userContext);


    useEffect(() => {
        mapChats();
    }, []);
    useEffect(() => {
        setChatUsers([]);
        let arr = [];
        chats.forEach((key,val)=>{
            arr.push(val)
        })

        setChatUsers(arr);
        console.log({arr});
        console.log('chats updated')
    }, [chats]);
    // declare imgleturl before uncommenting line 36 to line 41 


    const setVisible = () => {
        setnewChatBox(true);
        console.log(newChatBox);
	}

    return (
        <div className="chat-list">
            <div className="header header-chat-list chat-list-card header-chat">
                <img className="profile-pic" src={userDetail.profilePicUrl} alt={userDetail.name} />
                <div className="chat-user">
                    {userDetail.name}
                </div>
            </div>
            <div className="list" style={{ overflowY: "scroll" }}>
                {chatUsers.map((user) => {
                    let message = "Say Hello", userName, imgUrl;
                    var last;
                    if (chats.get(user) && chats.get(user)[0]) {
                        for (var i in chats.get(user)[0]) last = i;
                        message = chats.get(user)[0][last].message;
                    }
                    userName = users.get(user).name;
                    imgUrl = users.get(user).profilePicUrl;

                    return <ChatListCard chats={chats} chatUsers={chatUsers} message={message} user={userName} uniqName={user} imgUrl={imgUrl} />
                })}
                {/* <ChatListCard user="Bhannasa" message="Hi there!" imgUrl={imgleturl}/>
                <ChatListCard user="Bhannasa" message="Hi there1!" imgUrl={imgleturl}/>
                <ChatListCard user="Bhannasa" message="Hi there are you like coming tomorrow morning or not?" imgUrl={imgleturl}/>
                <ChatListCard user="Bhannasa" message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur eveniet perspiciatis necessitatibus, sed nulla natus cupiditate neque quos reiciendis recusandae, placeat similique tempora optio ullam veritatis voluptates. Doloribus, nostrum labore veritatis in consequatur rerum?" imgUrl={imgleturl}/>
                <ChatListCard user="Bhannasa" message="Hi there3!" imgUrl={imgleturl}/>
                <ChatListCard user="Bhannasa" message="Hi there4!" imgUrl={imgleturl}/> */}
            </div>
            <div id="newChat" onClick={setVisible}>
                Start New Chat
            </div>
        </div>
    )
}
