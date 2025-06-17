import Dealer from "../models/dealer.model.js";
import Request from "../models/request.model.js";
import Customer from "../models/customer.model.js";
import Bill from"../models/bill.model.js";
import Scrap from "../models/scrap.model.js";
import Feedback from "../models/feedback.model.js";
import bcryptjs from "bcryptjs";

export const updateuser=async(req,res,next)=>{
  const {id}=req.params;
    const { username, email, address,city,avatar,phone } = req.body;

const d=await Dealer.findById(id);

if(d){
   
     
Dealer.findByIdAndUpdate(id, {username, email, address,city,avatar,phone},{ new: true })
                .then(u => { const { password: pass, ...rest } = u._doc;res.status(200).json(rest)})
                .catch(err => res.send({Status: err}))
        
       
   
}

else{
  
      Customer.findByIdAndUpdate(id,{username, email, address,city,avatar,phone},{ new: true })
        .then(u => { const { password: pass, ...rest } = u._doc;res.status(200).json(rest)})
        .catch(err => res.send({Status: err}))
    }

    

}

export const resetpass=async(req,res,next)=>{
  
    const {id} = req.params
    const {newPassword} = req.body
const d=await Dealer.findById(id);

if(d){
   
     
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