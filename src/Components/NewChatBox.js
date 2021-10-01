/* eslint-disable */ 
import { useContext, useEffect, useState } from "react";
import userContext from "../context/userContext";
import NewChatCard from "./NewChatCard";
import "./Styles/newchatbox.css";

export default function NewChatBox() {
	const data = useContext(userContext);
	const [newchatArray, setnewchatArray] = useState([]);
	useEffect(() => {
		data.getAllUser();
	}, []);
	useEffect(() => {
		var arr = [];
		var count = 0;
		for (var i in data.allUser.userData) {
			if (data.chatUsers.indexOf(i) == -1 && i !== data.userDetail.username) {
				arr.push(
					<NewChatCard
						user={i}
						name={data.allUser.userData[i].name}
						imgUrl={data.allUser.userData[i].profilePicUrl}
						divNewChat={divNewChat}
						key={i}
					/>
				);
				count++;
			}
			if (count > 14) break;
		}
		setnewchatArray(arr);
	}, [data.allUser, data.chatUsers]);

	const startChat = async (e) => {
		try {
			e.preventDefault();
		} catch (e) { }
		var username = document.getElementById("username").value;
		username = username.trim();
		if (username == "") {
			alert("Enter A valid User");
			return;
		}
		const userData = await fetch(
			"http://localhost:5000/api/auth/getUserWithName",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: username }),
			}
		);
		const parsed = await userData.json();
		if (parsed.error == null) {
			// Adding new chat data to users
			var newUsers = data.users;
			newUsers.set(parsed.username, parsed);
			data.setUsers(newUsers);

			// Adding to unread
			newUsers = data.unread;
			newUsers.set(parsed.username, 0);
			data.setUnread(newUsers);

			// Adding chat data to new chats
			var newChat = data.chats;
			newChat.set(parsed.username, []);
			data.setChats(newChat);

			// Hidding new chat box
			data.setnewChatBox(false);
			data.setChatUsers([parsed.username].concat(data.chatUsers));

			const toSend = {
				token: data.jwtTokken,
				user: parsed.username,
			};

			const newChatData = await fetch(
				"http://localhost:5000/api/people/addPeople",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(toSend),
				}
			);

			const chatData = await newChatData.json();
			data.myFun(username);
		} else {
			alert(parsed.error);
		}
	};

	const cancel = (e) => {
		e.preventDefault();
		data.setnewChatBox(false);
	};

	const divNewChat = (user) => {
		document.getElementById("username").value = user;
		startChat();
	};

	const filterUser = (e) => {
		var arr = [];
		var count = 0;
		for (var i in data.allUser.userData) {
			if (
				data.chatUsers.indexOf(i) == -1 &&
				i !== data.userDetail.username &&
				i.search(e.target.value) != -1
			) {
				arr.push(
					<NewChatCard
						user={i}
						name={data.allUser.userData[i].name}
						imgUrl={data.allUser.userData[i].profilePicUrl}
						divNewChat={divNewChat}
						key={i}
					/>
				);
				count++;
			}
			if (count > 14) break;
		}
		setnewchatArray(arr);
	};

	if (data.newChatBox) {
		return (
			<>
				<div id="overLay">
					<div id="chatForm">
						<input
							type="text"
							className="chat-username"
							id="username"
							disabled={newchatArray.length == 0}
							onChange={filterUser}
						/>
						<button
							onClick={startChat}
							value="Start Chat"
							className="start-chat"
						>
							Start Chat
						</button>
						<button onClick={cancel} value="Start Chat" className="cancel-chat">
							Cancel
						</button>
					</div>
					<div id="chatList">{newchatArray}</div>
				</div>
			</>
		);
	} else {
		return <></>;
	}
}
