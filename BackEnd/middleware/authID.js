const jwt = require("jsonwebtoken");
const firestore = require("firebase/firestore");

const getUserName = async (req, resp, next) => {
	try {
		var decoded = jwt.verify(req.body.token, process.env.JWT_secret);
		console.log(decoded);

		req.username = decoded.user.username;

		// updating last seen
		const ref = firestore.doc(firestore.getFirestore(), "users", req.username);
		firestore.updateDoc(ref, {
			lastSeen: new Date().getTime()
		});

		next();
	} catch {
		resp.status(400).json({ error: "Invaild details" });
	}
	
}

module.exports = getUserName;