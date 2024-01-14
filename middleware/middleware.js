const jwt = require('jsonwebtoken')
const MY_sECRET="ujjwalisagoodboy"

const fetchuser=(req,res,next)=>{
const authtoken=req.header('auth-token')
if(!authtoken){
    res.status(401).send({error:"please send valid credentials"})
}
try{
    const data= jwt.verify(authtoken,MY_sECRET)
    req.user=data.person
    console.log(req.user)
    next()

}catch(error){
    res.status(400).send({error:"please send valid credentials"})

}
}

module.exports=fetchuser