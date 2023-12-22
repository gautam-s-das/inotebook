const connectTomongo = require("./db");
const express = require("express");
const Users = require("./models/Users");
const Notes = require("./models/Notes");
const { body, validationResult } = require("express-validator");
const bcrypt=require("bcryptjs")
var jwt = require('jsonwebtoken');
var fetchuser=require('./middleware/fetchuser')
var cors = require('cors')

connectTomongo();
const app = express();
const port = 5000;
const JWT_SECRET='Gautamisagoodboy'
app.use(express.json());


app.use(cors())
//Available Routes
//this is used to login the user
app.post(
  "/api/auth/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 2,
    }),
    body("email", "Enter a valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    
    //if errors is not equal to empty then show the error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    //if the email is already exists then show the bad connection
    try {
      let users = await Users.findOne({ email: req.body.email });
      if (users) {
        return res
        .status(400)
        .json({ error: "Sorry the user with email already exists" });
      }
      const salt =await bcrypt.genSalt(10);
      const secPass=await bcrypt.hash(req.body.password,salt)
      

      //or else send the data
      const user=await Users.create({
        name:req.body.name,
        email:req.body.email,
        password:secPass
      });
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken=jwt.sign(data,JWT_SECRET)
      // res.json(user);
      res.json({authtoken})
      // const user = Users(req.body);
      // user.save(); 
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error ");
    }
  }
);
//this is used for Authenticate the user
app.post(
  "/api/auth/Login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Please enter your password").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    
    //if errors is not equal to empty then show the error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
      let user=await Users.findOne({email})
      if(!user){
        res.status(400).json({error:"enter a valid credentials"})
      }
      const passwordcompare=await bcrypt.compare(password,user.password);
      if(!passwordcompare){
        res.status(400).json({error:"enter a valid credentials"})
      }
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken=jwt.sign(data,JWT_SECRET)
      // res.json(user);
      res.json({authtoken})
    } catch (error) {
      res.status(500).send("Internal server error ");
    }
  })

//get logedin user details 
app.post(
  "/api/auth/getuser",fetchuser,
  async (req, res) => {
try {
  const userID=req.user.id;
  const user=await Users.findById(userID).select("-password")
  res.send(user);
}  catch (error) {
  console.error(error);
  res.status(500).send("Internal server error ");
}
  })

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
      try {
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
      
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error ");
      }
      
    })

     //delete notes user details using:delete method 
  app.delete(
    "/api/auth/deletenote/:id",fetchuser,
    async (req, res) => {
      // const{title,description,tag}=req.body
     
      try {
         //find a note to update and update it
      let note=await Notes.findById(req.params.id)
      if(!note){
        return res.status(404).send("Not Found")
      }
      if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not Allowed")
      }

       note=await Notes.findByIdAndDelete(req.params.id)
      res.json({Success:"note has been deleted",note:note})
   } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error ");
      }
    })
     
    // app.use('api/auth',require('./routes/auth'))
// app.use('api/notes',require('./routes/notes'))
// app.get('/', (req, res) => {
//   res.send('Hello Gautam!')
// })
app.listen(port, () => {
  console.log(`iNotebook listening on port http://localhost:${port}`);
});
