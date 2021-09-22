var express = require('express');
var router = express.Router();
const firestore = require("firebase/firestore");
const database = require("firebase/database");
const getUserName = require('../middleware/authID');
const { updateDoc } = require('firebase/firestore');


router.post("/addPeople", getUserName, async (req, resp) => {

	try {
		const db = firestore.getFirestore();
		const ref = firestore.doc(db, "users", req.username);
		const userDoc = await firestore.getDoc(ref);
		const userData = userDoc.data();
		var arr = userData.chats;
		if (arr.indexOf(req.body.user) != -1) {
			resp.send("Chat Exist");
			return;
		}
		arr.push(req.body.user);
		console.log(userData);
		updateDoc(ref, {
			chats: userData.chats
		})

		resp.send("chat Added Successfully")
	} catch {
		resp.status(400).send({ error: "Something Wrong! Please try again after some time" });
	}
})

router.get("/getPeople", getUserName, async (req, resp) => {

	try {
		const db = firestore.getFirestore();
		const ref = firestore.doc(db, "users", req.username);
		const userDoc = await firestore.getDoc(ref);
		const userData = userDoc.data();

		resp.send(userData.chats);

	} catch {
		resp.status(400).send({ error: "Something Wrong! Please try again after some time" });
	}
})



module.exports = router;
