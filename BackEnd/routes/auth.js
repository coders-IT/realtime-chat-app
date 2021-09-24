const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getFirestore, setDoc, doc, serverTimestamp, getDoc, updateDoc } = require('firebase/firestore');
const { route } = require('./sendMsg');
const firestore = require("firebase/firestore");
const getUserName = require('../middleware/authID');


router.post('/createuser', async (req, res) => {
    try {
        const username = req.body.username;
        const name = req.body.name;
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        const phone = req.body.phone;

        const db = getFirestore();
        const usersRef = doc(db, "users", username);
        const userSnap = await getDoc(usersRef);

        if (userSnap.exists()) {
            res.status(400).json({ 'error': 'Try another username' })
            return;
        }
        // console.log(req.body);
        if (username.length < 5 || password.length < 5 || password != cpassword || phone.length != 10) {
            res.status(400).json({ 'error': 'Enter valid credentials' });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        var dt = new Date();
        const noImage = "https://www.pngkey.com/png/full/204-2049354_ic-account-box-48px-profile-picture-icon-square.png";
        await setDoc(doc(db, "users", username), {
            username: username,
            name: name,
            password: secPass,
            phone: phone,
            createdOn: dt.getTime(),
            lastSeen: dt.getTime(),
            profilePicUrl: noImage,
            settings: {},
            chats: [],
            online: true
        });

        const data = {
            user: { username }
        }

        const authToken = jwt.sign(data, process.env.JWT_secret);
        res.status(200).json({ authToken });

    } catch (error) {
        res.status(500).json({ "error": "Some server error occured" });
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const db = getFirestore();
        const usersRef = doc(db, "users", username);
        const userSnap = await getDoc(usersRef);


        if (!userSnap.exists() || !bcrypt.compareSync(password, userSnap.data().password)) {
            res.status(400).json({ 'error': "Please LogIn with valid credentials" });
            return;
        }

        updateDoc(usersRef, {
            lastSeen: new Date().getTime()
        });

        const data = {
            user: { username }
        }
        const authToken = jwt.sign(data, process.env.JWT_secret);
        res.status(200).json({ authToken });

    } catch (error) {
        res.status(500).json({ "error": "Some server error occured" });
        console.log(error);
    }
})

router.post("/getUser", getUserName, async (req, resp) => {
    const ref = firestore.doc(firestore.getFirestore(), "users", req.username);
    const userDoc = await firestore.getDoc(ref);
    const userData = userDoc.data();
    resp.json(userData);
})

router.post("/getUserWithName", async (req, resp) => {
    const ref = firestore.doc(firestore.getFirestore(), "users", req.body.username);
    const userDoc = await firestore.getDoc(ref);
    if (!userDoc.exists()) {
        resp.status(404).send({ error: "User Not Avilable" });
        return;
	}
    const userData = userDoc.data();
    resp.json(userData);
})


router.post("/authanticate", getUserName, async (req, resp) => {
    try {

        const db = getFirestore();
        const usersRef = doc(db, "users", req.username);
        const userSnap = await getDoc(usersRef);

        console.log(userSnap.data());

        if (!userSnap.exists()) {
            res.status(400).json({ 'error': "Please LogIn with valid credentials" });
            return;
        } else {
            resp.send(req.body.token);
        }
    } catch {
        resp.status(404).send({ error: "User not found" });
    }
})

module.exports = router;
