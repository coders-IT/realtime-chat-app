const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    updateDoc,
    doc,
    getDoc,
    serverTimestamp,
} from 'firebase/firestore';


router.post('/createuser',async (req,res)=>{
    try{
        const username = req.body.username;
        const name = req.body.name;
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        const phone = req.body.phone;

        const usersRef=collection(db,"users");
        const userSnap=await getDoc(usersRef);

        if(userSnap.exists()||username.length<5||password.length<5||password!=cpassword||phone.length!=10){
            res.status(400).send('error','Enter valid credentials');
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password,salt);
        
        const curTime=new Date();
        await setDoc(doc(usersRef,username),{
            username:username,
            name:name,
            password:secPass,
            phone:phone,
            createdOn:serverTimestamp,
            lastSeen:serverTimestamp,
            profilePic:"",
            settings:{},
        })

    }catch(error){
        res.status(500).json("Some server error occured:",error);
    }
})