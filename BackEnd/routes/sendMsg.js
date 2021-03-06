var express = require("express");
var router = express.Router();
const getUserName = require("../middleware/authID");
const {
	getDatabase,
	ref,
	set,
	child,
	get,
	update,
} = require("firebase/database");

router.post("/getMessage", getUserName, async (req, res) => {
	try {
		const db = getDatabase();
		const userSnap = await get(child(ref(db), `users/${req.username}`));
		const userData = userSnap.val();

		let user = userData.username;

		if (user < req.body.user) {
			user += req.body.user;
		} else user = req.body.user + user;

		const dbRef = ref(db);
		get(child(dbRef, `chats/${user}`)).then((snapshot) => {
			res.status(200).send([snapshot.val()]);
		});
	} catch (error) {
		console.log(error);
		res
			.status(400)
			.json({ error: "Something Wrong! Please try again after some time" });
	}
});

router.post("/sendMessage", getUserName, async (req, res) => {
	try {
		const db = getDatabase();
		const userSnap = await get(child(ref(db), `users/${req.username}`));
		const userData = userSnap.val();

		// Getting user name from jwt tokken and getting the collection name
		let user = userData.username;
		if (user === req.body.user) {
			res.status(400).json({ error: "Can't message yourself" });
			return;
		}
		if (user < req.body.user) {
			user += req.body.user;
		} else user = req.body.user + user;

		// Collection name created

		var dt = new Date();

		const msgBody = {
			user1: userData.username,
			user2: req.body.user,
			message: req.body.message,
			reply: req.body.reply,
			time: dt.getTime(),
			type: req.body.type, // 'type' currently supports - 'text'
			read: false,
		};

		var msgID = parseInt(dt.getTime());
		set(ref(db, `chats/${user}/${msgID}`), msgBody);

		// Dragging chat to top for both users

		let chats = userData.chats;
		const idx = chats.indexOf(req.body.user);
		if (idx >= 0) chats.splice(idx, 1);
		chats.unshift(req.body.user);
		const updates = {};
		updates[`users/${req.username}/chats`] = chats;

		const userSnapU2 = await get(child(ref(db), `users/${req.body.user}`));

		const userDataU2 = userSnapU2.val();
		let chatsU2 = userDataU2.chats;
		if (chatsU2 == null || chatsU2.indexOf(req.username) == -1) {
			var arr = [];
			if (chatsU2 == null) arr.push(req.username);
			else arr = [req.username].concat(chatsU2);

			updates[`users/${req.body.user}/chats`] = arr;
		} else {
			const idxU2 = chatsU2.indexOf(req.username);
			if (idxU2 >= 0) chatsU2.splice(idxU2, 1);
			chatsU2.unshift(req.username);
			updates[`users/${req.body.user}/chats`] = chatsU2;
		}

		if (userDataU2.unRead === undefined) userDataU2.unRead = {};
		let unreadCount = userDataU2.unRead[req.username] || 0;
		unreadCount++;
		updates[`users/${req.body.user}/unRead/${req.username}`] = unreadCount;

		update(ref(db), updates);

		res.status(200).send(msgBody);
	} catch (error) {
		console.log(error);
		res
			.status(400)
			.json({ error: "Something Wrong! Please try again after some time" });
	}
});

router.post("/updateMsg", async (req, res) => {
	try {
		const db = getDatabase();
		var user1 = req.body.user1;
		var user2 = req.body.user2;

		if (user1 < user2) user1 += user2;
		else user1 = user2 + user1;
		update(ref(db, `chats/${user1}`), req.body.updates);

		res.send({ status: "updated successfully" });
	} catch (error) {
		console.log(error);
		res
			.status(400)
			.json({ error: "Something Wrong! Please try again after some time" });
	}
});

router.post("/readMessage", getUserName, async (req, res) => {
	try {
		const db = getDatabase();
		const updates = {};
		updates[`users/${req.username}/unRead/${req.body.user}`] = 0;
		update(ref(db), updates);
		res.status(200).send("Success");
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ error: "Something Wrong! Please try again after some time" });
	}
});

module.exports = router;
