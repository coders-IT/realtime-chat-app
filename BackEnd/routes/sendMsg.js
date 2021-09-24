var express = require('express');
var router = express.Router();
const firestore = require("firebase/firestore");
const database = require("firebase/database");
const getUserName = require('../middleware/authID');


router.post("/getMessage", getUserName, async (req, resp) => {

	try {
		const db = firestore.getFirestore();
		const ref = firestore.doc(db, "users", req.username);
		const userDoc = await firestore.getDoc(ref);
		const userData = userDoc.data();

		const dbRealTime = database.getDatabase();

		let user = userData.username;

		if (user < req.body.user) {
			user += req.body.user;
		} else user = req.body.user + user;

		const dbRef = database.ref(dbRealTime);
		database.get(database.child(dbRef, `/${user}`)).then((snapshot) => {
			console.log(snapshot.val());
			resp.status(200).send([snapshot.val()]);
		});

	} catch(error) {
		console.log(error);
		resp.status(400).json({ error: "Something Wrong! Please try again after some time" });
	}
})


router.post("/sendMessage", getUserName, async (req, resp) => {
	try {
		const db = firestore.getFirestore();
		const ref = firestore.doc(db, "users", req.username);
		const userDoc = await firestore.getDoc(ref);
		const userData = userDoc.data();

		const dbRealTime = database.getDatabase();

		//getting user name from jwt tokken and getting the collection name 
		let user = userData.username;
		if (user === req.body.user) {
			resp.status(400).json({ 'error': "Can't message yourself" });
			return;
		}
		if (user < req.body.user) {
			user += req.body.user;
		} else user = req.body.user + user;

		//collection name got

		var dt = new Date();

		const msgBody = {
			"user1": userData.username,
			"user2": req.body.user,
			"message": req.body.message,
			"reply": req.body.reply,
			"time": dt.getTime(),
			"type": req.body.type,  // type currently supports - 'text'
		}

		//creating message id
		var msgID = parseInt(dt.getTime() * 1000 + dt.getMilliseconds())
		//created
		database.set(database.ref(dbRealTime, `${user}/${msgID}`), msgBody);

		// dragging chat to top for both users
		let chats = userData.chats;
		const idx = chats.indexOf(req.body.user);
		if (idx >= 0) chats.splice(idx, 1);
		chats.unshift(req.body.user);
		firestore.updateDoc(ref, {
			chats: chats
		})

		const refU2 = firestore.doc(db, "users", req.body.user);
		const userDataU2 = (await firestore.getDoc(refU2)).data();
		let chatsU2 = userDataU2.chats;
		const idxU2 = chatsU2.indexOf(req.username);
		if (idxU2 >= 0) chatsU2.splice(idxU2, 1);
		chatsU2.unshift(req.username);
		firestore.updateDoc(refU2, {
			chats: chatsU2
		})


		resp.status(200).send(msgBody);
	} catch (error) {
		console.log(error);
		resp.status(400).json({ "error": "Something Wrong! Please try again after some time" })
	}

})

module.exports = router;
