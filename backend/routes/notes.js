const express=require('express')
const Users = require("./models/Users");
const Notes = require("./models/Notes");
const router=express.Router();

router.post('/',(req,res)=>{
     //get fetchallnotes user details using:get method
app.get(
    "/api/auth/fetchallnotes",fetchuser,
    async (req, res) => {
  try {
      const notes=await Notes.find({user:req.user.id})
      res.json(notes)
  }  catch (error) {
    console.error(error);
    res.status(400).send("error cannot find notes ");
  }
    })
  
     //get Add notes user details using:post method 
  app.post(
    "/api/auth/addnotes",fetchuser,[
      body("title", "Enter a valid title").isLength({ min: 2 }),
      body("description", "Description must be atleast 5 characters").isLength({min: 5,}),
    ],
    async (req, res) => {
  try {
      const {title,description,tag}=req.body;
      const errors = validationResult(req);
      
      //if errors is not equal to empty then show the error
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const notes= new Notes({title,description,tag,user:req.user.id})
      const savenotes=await notes.save()
      res.json(savenotes)
  
  }  catch (error) {
    console.error(error);
    res.status(500).send("Internal server error ");
  }
    })
  
     //update notes user details using:put method 
    app.put(
      "/api/auth/updatenotes/:id",fetchuser,
      async (req, res) => {
        const{title,description,tag}=req.body
       
        //create a new note object
        const newnote={}
        if(title){newnote.title=title};
        if(description){newnote.description=description};
        if(tag){newnote.tag=tag};
  
        //find a note to update and update it
        let note=await Notes.findById(req.params.id)
        if(!note){
          return res.status(404).send("Not Found")
        }
        if(note.user.toString()!==req.user.id){
          return res.status(401).send("Not Allowed")
        }
  
         note=await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
        res.json({note})
      })
  
})
module.exports=router