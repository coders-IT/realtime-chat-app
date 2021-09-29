import React, { useContext, useEffect } from 'react'
import userContext from '../context/userContext';
import ChatListCard from './ChatListCard';
import {
    Link
} from "react-router-dom";

export default function ChatList() {
    const { userDetail, chats, mapChats, users, setnewChatBox, jwtTokken, chatUsers, setChatUsers, myFun, chatVisible, allUser, setOffline, setjwtTokken} = useContext(userContext);


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
        const callFunc = async () => {

            const userData = await fetch("http://localhost:5000/api/auth/getUser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "token": jwtTokken })
            });
            const parsed = await userData.json();
            console.log("callfunc", parsed);
            var arr = parsed["chats"];
            if (arr) {
                arr.forEach((user) => {
                    myFun(user);
                });
            }

        }
        callFunc();
    }, [userDetail])

    const setVisible = () => {
        setnewChatBox(true);
    }
    const logOut=()=>{
        localStorage.clear();
        setjwtTokken(localStorage.getItem("jwtTokken"));
        setOffline();
    };
    if (window.innerWidth > 1000 || chatVisible == true) {
        return (
            <div className="chat-list">
                <Link className="header header-chat-list chat-list-card" onClick={logOut} to="/">
                    <img className="profile-pic" src={userDetail.profilePicUrl} alt={userDetail.name} />
                    <div className="chat-user">
                        {userDetail.name}
                    </div>
                    <div className="header-chat-list-hover">
                        Click to log out
                    </div>
                </Link>
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
