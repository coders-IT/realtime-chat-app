import react from 'react'

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
		cursor: "pointer"
	}
	const subName = {
		color: "gold"

	}
	const start = () => {
		props.divNewChat(props.user);
	}

	return (
		<div style={divStyle} onClick={start} key={props.user}>
			<p>{props.name}</p>
			<p style={subName}>{props.user}</p>
		</div>
	)
}