var express = require('express');
var router = express.Router();
const getUserName = require('../middleware/authID');
const { getDatabase, ref , child ,get, update  } = require("firebase/database");


router.post("/addPeople", getUserName, async (req, res) => {

	try {
		const db=getDatabase();
        const userSnap=await get(child(ref(db),`users/${req.username}`));
		const userData = userSnap.val();

		var arr = userData.chats;
		if(!arr)	arr=[];
		if (arr.indexOf(req.body.user) != -1) {
			res.send({ error: "Chat Exists" });
			return;
		}
		arr = [req.body.user].concat(arr);

		const userSnap2 = await get(child(ref(db), `users/${req.body.user}`));
		const userData2 = userSnap2.val();
		var user2Chat = userData2.chats;
		if (user2Chat && user2Chat.indexOf(req.username) == -1) user2Chat = [req.username].concat(user2Chat);
		else user2Chat = [req.username];

		const updates = {};

		updates[`users/${req.body.user}/chats`] = user2Chat;
		updates[`users/${req.username}/chats`] = arr;

		console.log(updates, req.body.user, req.username);
        update(ref(getDatabase()),updates);

		res.send({ "success" : "Chat Added Successfully"})
	} catch(error) {
		console.log(error)
		res.status(400).send({ error: "Something Wrong! Please try again after some time" });
	}
})

router.post("/getUser", getUserName, async (req, res) => {

	try {
		const db=getDatabase();
        const userSnap=await get(child(ref(db),`users/${req.body.user}`));
		const userData = userSnap.val();
		res.status(200).json({ 'profilePicUrl': userData.profilePicUrl, 'name': userData.name, 'lastSeen': userData.lastSeen });

	} catch (error) {
		console.log(error);
		res.status(400).send({ error: "Something Wrong! Please try again after some time" });
	}
})

router.get("/alluser", async (req, resp) => {
	try {
		const db = getDatabase();
		const userSnap = await get(child(ref(db), `users`));
		const userData = userSnap.val();
		resp.send({ userData });
	} catch {
		res.status(400).send({ error: "Something Wrong! Please try again after some time" });
	}
})




module.exports = router;
