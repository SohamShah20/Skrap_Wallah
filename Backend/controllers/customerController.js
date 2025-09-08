import Feedback from '../models/feedback.model.js';
import Request from '../models/request.model.js'
import Customer from '../models/customer.model.js'
import Dealer from '../models/dealer.model.js';
import Bill from '../models/bill.model.js';
import Scrap from '../models/scrap.model.js';
export async function request(req,res,next){
    const {city,custname,date,time,email,scrapData}=req.body;
   const city1=city.toUpperCase();
   const times=time.toString();
    const dates=date.toString();
    const u=Customer.findById(req.user.id);
    if(!u)return res.status(400).json('you are not a customer!');
    const newreq = new Request({city:city1,custname,date:dates,time:times,email,scrapData});
    try {
        await newreq.save();
        res.status(201).json('request made successfully!');
      } catch (error) {
        next(error);
      }
}

export async function updatereq(req,res,next){
  const {city,custname,date,time,email,scrapData}=req.body;
 const times=time.toString();
  const dates=date.toString();
  const id=req.params.id;
  const r=await Request.findById(id);
 const u=await Customer.findById(req.user.id);
  const city1=city.toUpperCase();
 
    if(!u)return res.status(400).json('you are not a customer!');
  if(r.custname!=u.username)res.status(400).json('please update your request only!');
  try {
    const newcust = await Request.findByIdAndUpdate(id,{city:city1,custname,date:dates,time:times,email,scrapData,status:"PENDING"},{new:true});
      res.status(201).json('request updated successfully!');
    } catch (error) {
      next(error);
    }
}
export async function getrequests(req,res,next){
  const id=req.user.id;
  const cust= await Customer.findById(id);
  
    if(!cust)return res.status(400).json('you are not a customer!');
  try
  {const requests=await Request.find({status:"PENDING",email:cust.email});
  return res.status(200).json(requests);}
  catch(error){
      return res.status(404).json(error);
  }
  }
  
  export async function getacceptedrequests(req,res,next){
      const id=req.user.id;
      const cust= await Customer.findById(id);
      if(!cust)return res.status(400).json('you are not a customer!');
      try
      {const requests=await Request.find({status:"ACCEPTED",email:cust.email});
      return res.status(200).json(requests);}
      catch(error){
          return res.status(404).json(error);
      }
      }


      export async function getdealer(req,res,next){
        const id=req.params.id;
       
        
        try
        { const dealer= await Dealer.findById(id);
        return res.status(200).json(dealer);}
        catch(error){
            return res.status(404).json(error);
        }
        }

        export async function getDealerFromRequest(req, res, next){
          const id = req.params.req_id;
          try{
            const request = await Request.findById(id);
            if(!request){
              console.log('No request!');
              return res.status(404).json({error: 'request not found'});
            }
            const dealer = await Dealer.findById(request.dealer_id);
            return res.status(200).json(dealer);
          }catch(error){
            return res.status(404).json(error);
          }
        }


        export async function feedback(req, res, next){
          const {customer, dealer, description} = req.body;
          const rating = Number(req.body.rating);
          const request_id = req.params.id;
          const customer_obj = await Customer.findById(customer);
          const customer_mail = customer_obj.email;
          const valid_id = await Feedback.findOne({ request_id });
          if(valid_id) return res.status(404).send('feedback already provided!');
          await Request.findByIdAndUpdate(request_id, {givenFeedback: true});
          const dealer_obj = await Dealer.findById(dealer);
          await Dealer.findByIdAndUpdate(dealer, {average: (dealer_obj.average * dealer_obj.totalFeedbacks + rating) / (dealer_obj.totalFeedbacks + 1)});
          await Dealer.findByIdAndUpdate(dealer, {totalFeedbacks: dealer_obj.totalFeedbacks + 1});
          const newFeedback = new Feedback({request_id, customer: customer_mail, dealer, rating, description});
          try{
            await newFeedback.save();
            res.status(201).json('feedback submitted successfully!');
          } catch(error){
            next(error);
          }
        };

        export async function payreceived(req,res,next){
          const id=req.params.id;
         const r=await Request.findById(id);
 const u=await Customer.findOne({username:r.custname});
const u1=await Customer.findById(req.user.id);
  if(!u1)return res.status(400).json('you are not a customer!');

  if(u.username!=u1.username)res.status(400).json('please validate your request only!');
          
          try
          { const dealer= await Request.findByIdAndUpdate(id,{cangenreceipt:true});
          return res.status(200).json(dealer);}
          catch(error){
              return res.status(404).json(error);
          }
          }


          export async function getclosedrequests(req,res,next){
            const id=req.user.id;
            const customer= await Customer.findById(id);
            if(!customer)return res.status(400).json('you are not a customer!');
            try
            {const requests=await Request.find({status:"CLOSED",email:customer.email});
            return res.status(200).json(requests);}
            catch(error){
                return res.status(404).json(error);
            }
            }

            export async function getbill(req,res,next){
              const id=req.params.id;
             
              const r=await Request.findById(id);
 const u=await Customer.findOne({username:r.custname});
 
const u1=await Customer.findById(req.user.id);
const d=await Dealer.findById(req.user.id);

  if(u1 && u.username!=u1.username)res.status(400).json('please check your bill only!');
  if(d && d._id!=r.dealer_id)res.status(400).json('please check your bill only!');
              try
              { const dealer= await Bill.findOne({req_id:id});
              return res.status(200).json(dealer);}
              catch(error){
                  return res.status(404).json(error);
              }
              }



              export async function deletereq(req,res,next){
                const id=req.params.id;
               
                 const r=await Request.findById(id);
 const u=await Customer.findOne({username:r.custname});
const u1=await Customer.findById(req.user.id);
if(!u1)return res.status(400).json('you are not a customer!');
  if(u.username!=u1.username)res.status(400).json('please delete your request only!');
                try
                { const request= await Request.findByIdAndDelete(id);
                return res.status(200).json('deleted');}
                catch(error){
                    return res.status(404).json(error);
                }
                }

          export async function getscraps(req,res,next){
            try{
              const scraps=await Scrap.find({});
              return res.status(201).json(scraps);
            }catch(error){
              return res.status(404).json(error);
            }
          }