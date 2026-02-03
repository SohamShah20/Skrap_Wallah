import Dealer from "../models/dealer.model.js";
import Request from "../models/request.model.js";
import Customer from "../models/customer.model.js";
import Bill from"../models/bill.model.js";
import Scrap from "../models/scrap.model.js";
import Feedback from "../models/feedback.model.js";
import bcryptjs from "bcryptjs";

export const updateuser=async(req,res,next)=>{
  const {id}=req.params;
    const { username, email, address,city,avatar,phone,iscust } = req.body;



if(!iscust){
     
  const u=await Dealer.findById(req.user.id);
       const User = await Dealer.findOne({ phone });
   
    if (User && User.phone!=u.phone) return res.status(404).send('phone number exists!');
 
    const User1 = await Dealer.findOne({ email });
   
    if (User1 && User1.email!=u.email) return res.status(404).send('email exists!');
    const User2 = await Dealer.findOne({ username });
  
    if (User2 && User2.username!=u.username ) return res.status(404).send('User exists!');
     
Dealer.findByIdAndUpdate(id, {username, email, address,city,avatar,phone},{ new: true })
                .then(u => { const { password: pass, ...rest } = u._doc;res.status(200).json(rest)})
                .catch(err => res.send({Status: err}))
        
       
   
}

else{
     const u=await Customer.findById(req.user.id);
       const User = await Customer.findOne({ phone });
   
    if (User && User.phone!=u.phone) return res.status(404).send('phone number exists!');
 
    const User1 = await Customer.findOne({ email });
   
    if (User1 && User1.email!=u.email) return res.status(404).send('email exists!');
    const User2 = await Customer.findOne({ username });
  
    if (User2 && User2.username!=u.username ) return res.status(404).send('User exists!');
     
      Customer.findByIdAndUpdate(id,{username, email, address,city,avatar,phone},{ new: true })
        .then(u => { const { password: pass, ...rest } = u._doc;res.status(200).json(rest)})
        .catch(err => res.send({Status: err}))
    }

    

}

export const resetpass=async(req,res,next)=>{
  
    const {id} = req.params
    const {newPassword,iscust} = req.body


if(!iscust){
   
     
bcryptjs.hash(newPassword, 10)
            .then(hash => {
               Dealer.findByIdAndUpdate(id, {password: hash})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
       
   
}

else{
    bcryptjs.hash(newPassword, 10)
    .then(hash => {
      Customer.findByIdAndUpdate(id, {password: hash})
        .then(u => res.send({Status: "Success"}))
        .catch(err => res.send({Status: err}))
    })
    .catch(err => res.send({Status: err}))
}
    
}