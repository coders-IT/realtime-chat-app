const jwt = require("jsonwebtoken");
const firestore = require("firebase/firestore");

const getUserName = async (req, resp, next) => {
	try {
		var decoded = jwt.verify(req.body.token, process.env.JWT_secret);
		console.log(decoded);

		req.username = decoded.user.username;

		// updating last seen
		const db = firestore.getFirestore();
		const ref = firestore.doc(db, "users", req.username);
		const userData = (await firestore.getDoc(ref)).data();

		var dt = new Date();
		firestore.updateDoc(ref, {
			lastSeen:dt.getTime()
		});

		next();
	} catch {
		resp.status(400).json({ error: "Invaild details" });
	}
	
}

module.exports = getUserName;