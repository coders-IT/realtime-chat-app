import React, { useContext, useEffect } from 'react'
import userContext from '../context/userContext';
import ChatListCard from './ChatListCard';

export default function ChatList() {
    const { userDetail, chats, mapChats, users, setnewChatBox, chatUsers, setChatUsers, myFun, chatVisible, allUser} = useContext(userContext);


    useEffect(() => {
        mapChats();
        /*myFun();*/
        /* eslint-disable */
    }, []);
    useEffect(() => {
        setChatUsers([]);
        let arr = [];
        chats.forEach((key,val)=>{
            arr.push(val)
        })
        setChatUsers(arr);
        /* eslint-disable */
    }, [chats]);

    useEffect(() => {
        chatUsers.forEach((user) => {
            myFun(user);
        });
    }, [chatUsers])

    const setVisible = () => {
        setnewChatBox(true);
    }

    if (window.innerWidth > 1000 || chatVisible == true) {
        return (
            <div className="chat-list">
                <div className="header header-chat-list chat-list-card">
                    <img className="profile-pic" src={userDetail.profilePicUrl} alt={userDetail.name} />
                    <div className="chat-user">
                        {userDetail.name}
                    </div>
                </div>
                <div id="newChat" onClick={setVisible}>
                    Start New Chat
                </div>
                <div className="list" style={{ overflowY: "scroll" }}>
                    {chatUsers.map((user) => {
                        let message = "Say Hello", userName, imgUrl, sentBy;
                        var last;
                        if (chats.get(user) && chats.get(user)[0]) {
                            for (var i in chats.get(user)[0]) last = i;
                            message = chats.get(user)[0][last].message;
                            sentBy=chats.get(user)[0][last].user1;
                        }
                        userName = users.get(user).name;
                        imgUrl = users.get(user).profilePicUrl;
                        console.log(allUser.userData[sentBy],'all there');
                        if(sentBy){
                            if(sentBy===userDetail.username)    sentBy="You";
                            else sentBy=allUser.userData[sentBy].name;
                            sentBy+=": ";
                        }else sentBy="";
                        return <ChatListCard key={userName} chats={chats} chatUsers={chatUsers} message={message} user={userName} uniqName={user} imgUrl={imgUrl} sentBy={sentBy}/>
                    })}
                </div>
            </div>
        )
    } else return (<></>);
}
