import Dealer from '../models/dealer.model.js'
import Scrap from '../models/scrap.model.js';
import bcryptjs from 'bcryptjs';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Customer from '../models/customer.model.js';
dotenv.config();
export async function createdealer(req,res,next){
    
    const {username, email, password,address,city,phone} =req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const validUser = await Dealer.findOne({ email });
    const validUser2 = await Customer.findOne({ email });
    if (validUser || validUser2) return res.status(404).send('Dealer exists!');
    const validUser1 = await Dealer.findOne({ username });
    const validUser3 = await Customer.findOne({ username }); 
    if (validUser1 || validUser3) return res.status(404).send('Dealer exists!');
    const newcust = new Dealer({ username, email, password: hashedPassword,address,city ,phone});
  try {
    await newcust.save();
    res.status(201).json('Dealer created successfully!');
  } catch (error) {
    next(error);
  }
  
}

export async function getdealers(req,res,next){
  const id = req.params.id;
  try{
    const dealers = await Dealer.find({});
    return res.status(201).json(dealers);
  }catch(error){
    return res.status(404).json(error);
  }
}

export async function dealeradmin(req,res,next){
  const id = req.params.id;
  try{
    const dealer = await Dealer.findByIdAndUpdate(id, {isadmin: true});
    return res.status(201).json('created dealer!');
  }catch(error){
    return res.status(404).json(error);
  }
}

export async function setPrice(req, res, next){
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