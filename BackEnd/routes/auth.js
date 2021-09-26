const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getFirestore, setDoc, doc, serverTimestamp, getDoc, updateDoc } = require('firebase/firestore');
const { route } = require('./sendMsg');
const firestore = require("firebase/firestore");
const getUserName = require('../middleware/authID');


const { getDatabase, ref ,set, child ,get, update  } = require("firebase/database");


router.post('/createuser', async (req, res) => {
    try {
        const username = req.body.username;
        const name = req.body.name;
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        const phone = req.body.phone;

        const db=getDatabase();
        const userSnap=await get(child(ref(db),`users/${username}`))

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

        set(ref(db,'users/'+username),{
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
        })

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

        const db=getDatabase();
        const userSnap=await get(child(ref(db),`users/${username}`))


        if (!userSnap.exists() || !bcrypt.compareSync(password, userSnap.val().password)) {
            res.status(400).json({ 'error': "Please LogIn with valid credentials" });
            return;
        }

        const updates={};
        updates[`users/${username}/lastSeen`]=new Date().getTime();
        update(ref(db),updates);

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

router.post("/getUser", getUserName, async (req, res) => {
    const db=getDatabase();
    const userSnap=await get(child(ref(db),`users/${req.username}`));
    res.status(200).json(userSnap.val());
})

router.post("/getUserWithName", async (req, res) => {
    const db=getDatabase();
    const userSnap=await get(child(ref(db),`users/${req.body.username}`));
    if(!userSnap.exists()){
        res.status(404).send({ error: "User Not Avilable" });
        return;
    }
    res.status(200).json(userSnap.val());
})


router.post("/authenticate", getUserName, async (req, resp) => {
    try {

        const db=getDatabase();
        const userSnap=await get(child(ref(db),`users/${req.username}`));

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


router.post("/offline", getUserName, async (req, res) => {

    try {
        const db = getDatabase();
        var updates = {};
        updates["/users/" + req.username + "/online"] = false;
        var dt = new Date();
        updates["/users/" + req.username + "/lastSeen"] = dt.getTime();
        update(ref(db), updates);
        res.send({ "status": "updated Successfully" })

    } catch (error) {
        console.log(error)
        res.status(400).send({ error: "Something Wrong! Please try again after some time" });
    }
})


router.post("/online", getUserName, async (req, res) => {

    try {
        const db = getDatabase();
        var updates = {};
        updates["/users/" + req.username + "/online"] = true;
        update(ref(db), updates);
        res.send({ "status": "updated Successfully" })
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: "Something Wrong! Please try again after some time" });
    }
})

module.exports = router;
