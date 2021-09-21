const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
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
const envVar = require("dotenv").config().parsed;

router.post('/createuser',async (req,res)=>{
    try{
        const username = req.body.username;
        const name = req.body.name;
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        const phone = req.body.phone;

        const usersRef=collection(db,"users",username);
        const userSnap=await getDoc(usersRef);

        if(userSnap.exists()||username.length<5||password.length<5||password!=cpassword||phone.length!=10){
            res.status(400).send('error','Enter valid credentials');
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password,salt);
        
        await setDoc(doc(usersRef,username),{
            username:username,
            name:name,
            password:secPass,
            phone:phone,
            createdOn:serverTimestamp,
            lastSeen:serverTimestamp,
            profilePicUrl:"",
            settings:{},
        })

        const data={
            user:{username}
        }

        const authToken=jwt.sign(data,envVar.fireBase_API); 
        res.json({authToken});

    }catch(error){
        res.status(500).json("Some server error occured:",error);
    }
})

router.get('/login',async (req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;

        const usersRef=collection(db,"users",username);
        const userSnap=await getDoc(usersRef);

        if(!userSnap.exists())   return res.status(400).json({'error':'Please register with us first'});
        if(!bcrypt.compareSync(password,userSnap.data().password)) res.status(400).json({'error':"incorrect password"});

        const data={
            user:{username}
        }
        const authToken=jwt.sign(data,envVar.fireBase_API); 
        res.json({authToken});

    }catch(error){
        res.status(500).json("Some server error occured:",error);
    }
})