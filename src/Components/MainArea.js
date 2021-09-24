import react, { useContext } from 'react'
import userContext from '../context/userContext'
import Chat from './Chat';
import ChatList from './ChatList';
import Login from './Login';
import NewChatBox from './NewChatBox';

export default function MainArea() {
	const data = useContext(userContext);
	if (data.jwtTokken) {
		return (
			<div className="main">
				<ChatList />
				<Chat />
				<NewChatBox/>
			</div>
			
		)
	} else {
		return (<Login/>)
	}
}