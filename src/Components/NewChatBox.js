import { useContext } from 'react'
import userContext from '../context/userContext'
import "./Styles/newchatbox.css"

export default function NewChatBox() {
	const data = useContext(userContext);

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
		if (parsed.error == null) {
			var newUsers = data.users;
			newUsers.set(parsed.username, parsed);
			// console.log(newUsers);
			data.setUsers(newUsers);

			var newChat = data.chats;
			newChat.set(parsed.username, []);
			data.setChats(newChat);

			// console.log(data.users);
			// console.log(data.chatUsers);

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

	if (data.newChatBox) {
		return (
			<div id="overLay" onClick={() => { data.setnewChatBox(false);}}>
				<div id="chatForm">
					<input type="text" id="username" />
					<input type="submit" id="submit" value="Start Chat" onClick={startChat}/>
				</div>
			</div>

			//todo some users avilable from the database
		)
	} else {
		return(<></>)
	}

}