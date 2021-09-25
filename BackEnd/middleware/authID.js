const jwt = require("jsonwebtoken");
const { getDatabase, ref, update  } = require("firebase/database");

const getUserName =async (req, resp, next) => {
	try {
		var decoded = jwt.verify(req.body.token, process.env.JWT_secret);
		req.username = decoded.user.username;

		// updating last seen
		// const updates={};
        // updates[`users/${req.username}/lastSeen`]=new Date().getTime();
        // update(ref(getDatabase()),updates);

		next();
	} catch(error) {
		console.log(error)
		resp.status(400).json({ error: "Invaild details" });
	}
	
}

module.exports = getUserName;