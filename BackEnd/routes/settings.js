const express = require('express');
const router = express.Router();
const getUserName = require('../middleware/authID');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');
const { getStorage, uploadBytesResumable, getDownloadURL } = require('firebase/storage')

const { getDatabase, ref ,set, child ,get, update  } = require("firebase/database");

router.post('/updateinfo', getUserName, async (req, res) => {
    try {
        const imgFile = req.file;
        const name = req.name;

        const path = `profilePics/${req.username}`;
        const newImageRef = ref(getStorage(), path);
        const fileSnapShot = await uploadBytesResumable(newImageRef, imgFile);

        const publicImageUrl = await getDownloadURL(newImageRef);

        const updates={};
        updates[`users/${req.username}/profilePicUrl`]=publicImageUrl;
        updates[`users/${req.username}/name`]=name;
        update(ref(getDatabase()),updates);

        res.status(200).send('Succesfully updated');
    } catch (error) {
        res.status(500).send('Some server error occured');
    }
})


module.exports = router;
