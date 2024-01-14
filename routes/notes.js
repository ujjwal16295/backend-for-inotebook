const express= require('express')
const fetchuser = require('../middleware/middleware')
const { Note } = require('../models/Notes')
const { body, matchedData,validationResult } = require('express-validator');

const router = express.Router()

router.get("/fetchallnotes",fetchuser,async(req,res)=>{
try{
const userid=req.user.id
console.log(userid)
const notes= await Note.find({user:userid})
console.log(notes)
res.json(notes)
}catch(error){
    console.error(error)
    res.status(500).json({error:"internal server error"})

}
})
router.post("/addnote",fetchuser,[body("title","enter 3 words").isLength({min:3}),body("description","enter 5 words").isLength({min:3}),body("tag","enter 5 words").isLength({min:5})],async(req,res)=>{
    
    const result = validationResult(req);
if (result.isEmpty()) {
    const data = matchedData(req);

    try{
        const userid=req.user.id

        const note = new Note({
            user: userid,
            title : data.title,
            description : data.description,
            tag : data.tag
          })
          const savednote=note.save()
          res.json(note)

        
        }catch(error){
            res.status(500).json({error:"internal server error"})
        
        }
  }
else{
  res.send({ errors: result.array() });

}
   
    

})

router.put("/updatenote/:id",fetchuser,async(req,res)=>{
try{
  const newnote={}
if(req.body.title){
  newnote.title=req.body.title
}
if(req.body.description){
  newnote.description=req.body.description
}
if(req.body.tag){
  newnote.tag=req.body.tag
}
const noteidcheck= await Note.findById(req.params.id)
const userid =noteidcheck.user
if(noteidcheck){
  if(req.user.id===userid.toString()){
     noteupdate=await Note.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
     res.json(noteupdate)

  }
  else{
    res.status(500).json({error:"note not found"})

  }
}
else{

  res.status(500).json({error:"note not found"})

}
}catch(error){
  console.error(error)
  res.status(500).json({error:"internal server error"})

}

  

})


router.delete("/deletenote/:id",fetchuser,async(req,res)=>{
  try{
  
  const noteidcheck= await Note.findById(req.params.id)
  const userid =noteidcheck.user
  if(noteidcheck){
    if(req.user.id===userid.toString()){
       noteupdate=await Note.findByIdAndDelete(req.params.id).then(messgae=>res.json({messgae:"deleted"}))
    }
    else{
      res.status(500).json({error:"note not found"})
  
    }
  }
  else{
  
    res.status(500).json({error:"note not found"})
  
  }
  }catch(error){
    console.error(error)
    res.status(500).json({error:"internal server error"})
  
  }
  
    
  
  })

module.exports=router