const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getFirestore,setDoc, doc,serverTimestamp, getDoc } =  require('firebase/firestore');


router.post('/createuser',async (req,res)=>{
    try{
        const username = req.body.username;
        const name = req.body.name;
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        const phone = req.body.phone;

        const db = getFirestore();
        const usersRef = doc(db, "users", username);
        const userSnap = await getDoc(usersRef);

        if(userSnap.exists()){
            res.status(400).json({'error':'Try another username'})
        }
        // console.log(req.body);
        if(username.length < 5|| password.length < 5 || password != cpassword || phone.length != 10){
            res.status(400).json({'error':'Enter valid credentials'});
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password,salt);

		var dt = new Date();
      
        await setDoc(doc(db,"users",username),{
            username: username,
            name: name,
            password: secPass,
            phone: phone,
            createdOn: dt.getTime(),
            lastSeen: dt.getTime(),
            profilePicUrl: "",
            settings: {},
            chats : []
        });

        const data={
            user: {username}
        }
        
        const authToken=jwt.sign(data,process.env.JWT_secret); 
        res.status(200).json({authToken});
        
    }catch(error){
        res.status(500).json({"error": "Some server error occured"});
        console.log(error);
    }
})

router.post('/login',async (req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        
        const db = getFirestore();
        const usersRef = doc(db, "users", username);
        const userSnap = await getDoc(usersRef);
        
        console.log(userSnap.data());

        if (!userSnap.exists() || !bcrypt.compareSync(password, userSnap.data().password)) {
            res.status(400).json({ 'error': "Please LogIn with valid credentials" });
            return;
        }
        
        const data = {
            user:{username}
        }
        const authToken=jwt.sign(data,process.env.JWT_secret); 
        res.status(200).json({authToken});
        
    }catch(error){
        res.status(500).json({"error":"Some server error occured"});
        console.log(error);
    }
})

module.exports=router;
