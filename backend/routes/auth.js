const express=require('express')
const router=express.Router();
const Users=require('../models/Users')
// router.post('/',(req,res)=>{
//         console.log(req.body);
//         const user=Users(req.body);
//         user.save()
//         res.send(req.body);
//       })
module.exports=router