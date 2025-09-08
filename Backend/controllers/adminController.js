import Dealer from '../models/dealer.model.js'
import Scrap from '../models/scrap.model.js';
import bcryptjs from 'bcryptjs';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Customer from '../models/customer.model.js';
dotenv.config();
export async function createdealer(req,res,next){
   const id = req.user.id;
     const u=await Dealer.findById(id);
  if(!u|| !u.isadmin)return res.status(400).json('you are not admin');
    const {username, email, password,address,city,phone} =req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const validUser = await Dealer.findOne({ email });
   const city1=  city.toUpperCase();
    if (validUser) return res.status(404).send('Dealer exists!');
    const validUser1 = await Dealer.findOne({ username });
    
    if (validUser1 ) return res.status(404).send('Dealer exists!');
   
    const validUser2= await Dealer.findOne({ phone });
    if (validUser2 ) return res.status(404).send('phone number exists!');
     const newdealer = new Dealer({ username, email, password: hashedPassword,address,city:city1 ,phone});
  try {
    await newdealer.save();
    res.status(201).json('Dealer created successfully!');
  } catch (error) {
    next(error);
  }
  
}

export async function getdealers(req,res,next){
  const id = req.user.id;
  const u=await Dealer.findById(id);
  if(!u|| !u.isadmin)return res.status(400).json('you are not admin');
  try{
    const dealers = await Dealer.find({});
    return res.status(201).json(dealers);
  }catch(error){
    return res.status(404).json(error);
  }
}

export async function dealeradmin(req,res,next){
  const id = req.params.id;
   
  const u=await Dealer.findById(req.user.id);
  if(!u|| !u.isadmin)return res.status(400).json('you are not admin');
  try{
    const dealer = await Dealer.findByIdAndUpdate(id, {isadmin: true});
    return res.status(201).json('created dealer!');
  }catch(error){
    return res.status(404).json(error);
  }
}

export async function setPrice(req, res, next){
   const id = req.user.id;
  const u=await Dealer.findById(id);
  if(!u|| !u.isadmin)return res.status(400).json('you are not admin');
  const {type, price} = req.body;
  const typeExists = await Scrap.findOne({ type });
  if (typeExists){
    const id = typeExists._id;
    await Scrap.findByIdAndUpdate(id, {price: price});
    return res.status(201).json('Scrap price updated');
  }
  const newScrap = new Scrap({ type, price });
  try{
    await newScrap.save();
    res.status(201).json('New scrap created');
  } catch(error){
    next(error);
  }
}