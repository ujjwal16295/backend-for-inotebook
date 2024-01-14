const express= require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User   = require('../models/Users')
const { body, matchedData,validationResult } = require('express-validator');
const fetchuser = require('../middleware/middleware');
const MY_sECRET="ujjwalisagoodboy"

const router = express.Router()
//to create user here with validators
router.post("/createuser",[body("name","enter valid name").isLength({min:3}),body("email","enter valid email").isEmail(),body("password","enter long password").isLength({min:5})],async (req,res)=>{
  var success=false
const result = validationResult(req);
if (result.isEmpty()) {
  console.log("matched")
  const data = matchedData(req);
  const salt = await bcrypt.genSalt(10)
  const secPass= await bcrypt.hash(data.password,salt)
 const user = User.create({
    name : data.name,
    password : secPass,
    email : data.email
  }).then(user=>{ const userdatafortoken={
    person:{
     id: user.id
    }
  }
const authtoken= jwt.sign(userdatafortoken,MY_sECRET)
success=true
res.json({success,authtoken})})
  .catch(err=>res.send({error:"please enter unique email "}))

 
  

}else{
  success=false
  res.send({ errors: result.array() });

}


   
})

router.post("/login",[body("email","enter valid email").isEmail(),body("password","enter long password").exists()],async (req,res)=>{
  const result = validationResult(req);
  var success=false
  if (result.isEmpty()) {
    console.log("matched")
    const data = matchedData(req);
    const {email,password}= data
    try{
      const user= await User.findOne({email})
      if(!user){
        return res.json({error:"please login with correct credentials"})
        success=false
      }
      const passforcheck=await bcrypt.compare(password,user.password)
      if(!passforcheck){
        return res.status(400).json({error:"please login with correct credentials"})
        success=false
      }
      const userdatafortoken={
        person:{
         id: user.id
        }
      }
    const authtoken= jwt.sign(userdatafortoken,MY_sECRET)
    success=true
    res.json({success,authtoken})
      

    }
    catch(error){
      console.error(error.message)
      res.status(500).json({error:"problem in server"})

    }

  }else{
    res.send({ errors: result.array() });
  
  }


})

router.post('/getuser',fetchuser,async(req,res)=>{

    try{
      const userid=req.user.id
      const user= await User.findById(userid).select("-password")
      res.send(user)

    }catch(error){
       console.error(error)
       res.status(500).json({error:"server error"})
    }
})


module.exports=router