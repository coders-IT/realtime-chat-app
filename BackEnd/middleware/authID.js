const jwt = require("jsonwebtoken");

const getUserName = async (req, resp, next) => {
	try {
		var decoded = jwt.verify(req.body.token, process.env.JWT_secret);
		req.username = decoded.user.username;
		next();
	} catch (error) {
		console.log(error);
		resp.status(400).json({ error: "Invaild details" });
	}
};

module.exports = getUserName;
