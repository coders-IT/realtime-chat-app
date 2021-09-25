import react, { useContext, useEffect, useState } from 'react'
import userContext from '../context/userContext'
import NewChatCard from './NewChatCard';
import "./Styles/newchatbox.css"

export default function NewChatBox() {
	const data = useContext(userContext);
	const [allUser, setallUser] = useState([]);

	useEffect(() => {
		const func = async () => {
			const userData = await fetch("http://localhost:5000/api/people/alluser", {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const parsed = userData.json();
			setallUser(parsed);
		}
		func();
		console.log(allUser);
	}, []);

	const startChat = async (e) => {
		e.preventDefault();
		const username = document.getElementById("username").value;

		const userData = await fetch("http://localhost:5000/api/auth/getUserWithName", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ "username": username })
		});
		const parsed = await userData.json();
		console.log(parsed);
		if (parsed.error == null) {
			//adding new chat data to users
			var newUsers = data.users;
			newUsers.set(parsed.username, parsed);
			console.log(newUsers);
			data.setUsers(newUsers);

			// adding chat data to new chats
			var newChat = data.chats;
			newChat.set(parsed.username, []);
			data.setChats(newChat);

			console.log(data.users);
			console.log(data.chatUsers);

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
	const divNewChat = () => {
		console.log("data");
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
				</div>
				<div>
					{
						allUser.map((user) => {
							return <NewChatCard user={user} divNewChat={divNewChat}/>
						})
					}
				</div>
			</>
			//todo some users avilable from the database
		)
	} else {
		return(<></>)
	}

}