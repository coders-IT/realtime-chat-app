import react, { useContext, useEffect, useState } from 'react'
import userContext from '../context/userContext'
import NewChatCard from './NewChatCard';
import "./Styles/newchatbox.css"

export default function NewChatBox() {
	const data = useContext(userContext);
	const [newchatArray, setnewchatArray] = useState([]);
	useEffect(() => {
		data.getAllUser();
	}, []);
	useEffect(() => {
		console.log(data.allUser);
		var arr = [];
		for (var i in data.allUser.userData) {
			arr.push(<NewChatCard user={i} name={data.allUser.userData[i].name} divNewChat={divNewChat} />);
		}
		setnewchatArray(arr);
	}, [data.allUser]);


	const startChat = async (e) => {
		try {
			e.preventDefault();
		} catch {
			console.log("error");
		}
		const username = document.getElementById("username").value;

		const userData = await fetch("http://localhost:5000/api/auth/getUserWithName", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ "username": username })
		});
		const parsed = await userData.json();
		console.log("new chat parsed data",parsed);
		if (parsed.error == null) {
			//adding new chat data to users
			var newUsers = data.users;
			console.log("nelrlwekjr before", newUsers, data.users);
			newUsers.set(parsed.username, parsed);
			console.log("nelrlwekjr after", newUsers);
			data.setUsers(newUsers);

			// adding chat data to new chats
			var newChat = data.chats;
			newChat.set(parsed.username, []);
			data.setChats(newChat);

			console.log("afldsfjlaksjfsd",data.chatUsers);

			//hidding new chat box
			data.setnewChatBox(false);
			data.setChatUsers(data.chatUsers.concat(parsed.username));

			const toSend = {
				"token": data.jwtTokken,
				"user": parsed.username
			}

			const newChatData = await fetch("http://localhost:5000/api/people/addPeople", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(toSend)
			});

			const chatData = await newChatData.json();
			console.log(chatData);

		} else {
			alert(parsed.error);
		}


	}
	const cancel = (e) => {
		e.preventDefault();
		data.setnewChatBox(false);

	}
	const divNewChat = (user) => {
		document.getElementById("username").value = user;
		startChat();
	}



	if (data.newChatBox) {
		return (
			<>
				<div id="overLay">
					<div id="chatForm">
						<input type="text" id="username" />
						<button onClick={startChat} value="Start Chat" id="submit">Start Chat</button>
						<button onClick={cancel} value="Start Chat" id="submit">Cancel</button>
					</div>
					<div id="chatList">
						{newchatArray}
					</div>
				</div>
			</>
			//todo some users avilable from the database
		)
	} else {
		return (<></>)
	}

}