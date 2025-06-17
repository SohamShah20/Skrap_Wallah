import Feedback from '../models/feedback.model.js';
import Request from '../models/request.model.js'
import Customer from '../models/customer.model.js'
import Dealer from '../models/dealer.model.js';
import Bill from '../models/bill.model.js';
import Scrap from '../models/scrap.model.js';
export async function request(req,res,next){
    const {city,custname,date,time,email,scrapData}=req.body;
    
   const times=time.toString();
    const dates=date.toString();
    const newcust = new Request({city,custname,date:dates,time:times,email,scrapData});
    try {
        await newcust.save();
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
 
  try {
    const newcust = await Request.findByIdAndUpdate(id,{city,custname,date:dates,time:times,email,scrapData,status:"PENDING"},{new:true});
      res.status(201).json('request updated successfully!');
    } catch (error) {
      next(error);
    }
}
export async function getrequests(req,res,next){
  const id=req.params.id;
  const dealer= await Customer.findById(id);
  
  try
  {const requests=await Request.find({status:"PENDING",email:dealer.email});
  return res.status(200).json(requests);}
  catch(error){
      return res.status(404).json(error);
  }
  }
  
  export async function getacceptedrequests(req,res,next){
      const id=req.params.id;
      const dealer= await Customer.findById(id);
      
      try
      {const requests=await Request.find({status:"ACCEPTED",email:dealer.email});
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
         
          
          try
          { const dealer= await Request.findByIdAndUpdate(id,{cangenreceipt:true});
          return res.status(200).json(dealer);}
          catch(error){
              return res.status(404).json(error);
          }
          }


          export async function getclosedrequests(req,res,next){
            const id=req.params.id;
            const customer= await Customer.findById(id);
            
            try
            {const requests=await Request.find({status:"CLOSED",email:customer.email});
            return res.status(200).json(requests);}
            catch(error){
                return res.status(404).json(error);
            }
            }

            export async function getbill(req,res,next){
              const id=req.params.id;
             
              
              try
              { const dealer= await Bill.findOne({req_id:id});
              return res.status(200).json(dealer);}
              catch(error){
                  return res.status(404).json(error);
              }
              }



              export async function deletereq(req,res,next){
                const id=req.params.id;
               
                
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