/* eslint-disable */ 
import react from "react";

export default function NewChatCard(props) {
	const divStyle = {
		width: "400px",
		height: "50px",
		borderRadius: "5px",
		backgroundColor: "#567",
		color: "white",
		display: "flex",
		justifyContent: "space-evenly",
		textAlign: "center",
		margin: "20px",
		cursor: "pointer",
	};
	const subName = {
		color: "gold",
	};
	const start = () => {
		props.divNewChat(props.user);
	};

	return (
		<div onClick={start} key={props.user} className="new-list-card">
			<div className="chat-list-card">
				<img
					className="profile-pic new-chat-pic"
					src={props.imgUrl}
					alt={props.user}
				/>
				<div className="chat-preview newChat-preview">
					<div className="chat-user">{props.name}</div>
					<div className="chat-last-message">{props.user}</div>
				</div>
			</div>
		</div>
	);
}
