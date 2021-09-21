var express = require('express');
var router = express.Router();
const firestore = require("firebase/firestore");
const database = require("firebase/database");
const getUserName = require('../middleware/authID');


router.get("/getMessage", getUserName, async (req, resp) => {

	const db = firestore.getFirestore();
	const ref = firestore.doc(db, "users", req.username);
	const userDoc = await firestore.getDoc(ref);
	const userData = userDoc.data();

	const dbRealTime = database.getDatabase();

	let user = userData.username;

	if (user < req.body.user) {
		user += req.body.user;
	} else user = req.body.user + user;


	const baseRef = database.ref(dbRealTime, `/${user}`)

	database.onValue(baseRef, (snapshot) => {
		var data = [snapshot.val()];
		resp.send(data);
	});
})


router.post("/sendMessage", getUserName, async (req, resp) => {

	const db = firestore.getFirestore();
	const ref = firestore.doc(db, "users", req.username);
	const userDoc = await firestore.getDoc(ref);
	const userData = userDoc.data();

	const dbRealTime = database.getDatabase();

	//getting user name from jwt tokken and getting the collection name 
	let user = userData.username;

	if (user < req.body.user) {
		user += req.body.user;
	} else user = req.body.user + user;

	//collection name got

	const msgBody = {
		"user1": userData.username,
		"user2": req.body.user,
		"message": req.body.message,
		"reply": req.body.reply,
		"time": new Date(),
		"type":req.body.type
	}

	//creating message id
	var dt = new Date();
	var msgID = parseInt(dt.getTime() * 10 * Math.random())
	//created
	console.log(`${user}/${msgID}`);

	database.set(database.ref(dbRealTime, `${user}/${msgID}`), msgBody);
	resp.send("Message Send");

})

module.exports=router;
