export default function NewChatCard(props) {
	const divStyle = {
		width: "200px",
		height: "40px",
		borderRadius: "5px",
		background: "black",
		color: "white",
		lineHeight: "40px",
		textAlign:"center"
	}

	return (
		<div style={divStyle} onClick={ props.divNewChat}>
			props.user
		</div>
	)
}