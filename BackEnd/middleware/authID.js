const jwt = require("jsonwebtoken");

const getUserName = async (req, resp, next) => {
	try {
		var decoded = jwt.verify(req.body.token, process.env.JWT_secret);
		console.log(decoded);

		req.username = decoded.user.username;
		next();
	} catch {
		resp.status(400).json({ error: "Invaild details" });
	}
	
}

module.exports = getUserName;