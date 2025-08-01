import Dealer from "../models/dealer.model.js";
import Request from "../models/request.model.js";
import Bill from"../models/bill.model.js";
import Scrap from "../models/scrap.model.js";
import Feedback from "../models/feedback.model.js";
export async function getrequests(req,res,next){
const id=req.user.id;
const dealer= await Dealer.findById(id);
if(!dealer)return res.status(400).json('you are not a dealer');
try
{const requests=await Request.find({status:"PENDING"});
return res.status(200).json(requests);}
catch(error){
    return res.status(404).json(error);
}
}

export async function getacceptedrequests(req,res,next){
    const id=req.user.id;
    const dealer= await Dealer.findById(id);
    if(!dealer)return res.status(400).json('you are not a dealer');
    try
    {const requests=await Request.find({status:"ACCEPTED",dealer_id:id});
    return res.status(200).json(requests);}
    catch(error){
        return res.status(404).json(error);
    }
    }
export async function acceptrequests(req,res,next){
    const id=req.params.id;
    const id1=req.user.id;
   
    const dealer= await Dealer.findById(id1);
    if(!dealer)return res.status(400).json('you are not a dealer');
   
   try{  await Request.findByIdAndUpdate(id,{status:"ACCEPTED",dealer_id:req.user.id});
   console.log("ho gya kaam!!!!")
        return res.status(201).json('ACCEPTED');
}
catch(error){
 
        if(err)return res.status(500).json(err);
        
}
   

}


export async function genreceipt(req, res, next) {
  const id = req.params.id;
  const request = await Request.findById(id);
 const id1=req.user.id;
    
    const d= await Dealer.findById(id1);
    if(!d)return res.status(400).json('you are not a dealer');
    if(id1!=request.dealer_id)return res.status(400).json('please generate receipt of your request only');
  if (!request) {
      return res.status(404).send('Request not found');
  }

  try {
      await Request.findByIdAndUpdate(id, { status: "CLOSED" });
  } catch (err) {
      return res.status(500).send('Status cannot be changed');
  }

  const dealer = await Dealer.findById(request.dealer_id);
  const bill = await Bill.findOne({ req_id: id });
  if (bill) {
      return res.status(409).send('Receipt already made!');
  }

  const data = [];
  const scrapData = request.scrapData;
  let gtotal = 0;

 
  async function findRate(type) {
      const scrap = await Scrap.findOne({ type });
      return scrap ? scrap.price : 0; 
  }


  for (const scrap of scrapData) {
      const rpu = await findRate(scrap.type);
      const quantity = scrap.quantity;
      const rate = rpu * quantity;
      const obj = {
          type: scrap.type,
          quantity,
          rateperunit: rpu,
          total: rate
      };
      data.push(obj);
      gtotal += rate;
  }

  const newBill = new Bill({
      custname: request.custname,
      dealername: dealer.username,
      gtotal,
      scrapdata: data,
      req_id: id
  });

  try {
      await newBill.save();
      return res.status(201).json('Bill created!');
  } catch (err) {
      return res.status(500).json(err.message);
  }
}

export async function getclosedrequests(req,res,next){
  const id=req.user.id;
  const dealer= await Dealer.findById(id);
  if(!dealer)return res.status(400).json('you are not a dealer');
  try
  {const requests=await Request.find({status:"CLOSED",dealer_id:id});
  return res.status(200).json(requests);}
  catch(error){
      return res.status(404).json(error);
  }
  }

export async function getfeedbacks(req,res,next){
    const id = req.user.id;
    const dealer= await Dealer.findById(id);
  if(!dealer)return res.status(400).json('you are not a dealer');
    try{
        const feedbacks=await Feedback.find({dealer:id});
        return res.status(200).json(feedbacks);
    }catch(error){
        return res.status(404).json(error);
    }
}