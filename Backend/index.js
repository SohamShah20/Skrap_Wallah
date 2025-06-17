import express from 'express';
import dbconnect  from './database/config.js';
 import customerRouter from './routers/customerRouter.js';
 import dealerRouter from './routers/dealerRouter.js';
import adminRouter from './routers/adminRouter.js';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import jwt from 'jsonwebtoken';
import { errorHandler } from './utils/error.js';
import Customer from './models/customer.model.js';
import Dealer from './models/dealer.model.js';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import Contact from './models/contact.model.js';
dbconnect();


const app=express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, 
  };
  app.use(cors(corsOptions));
app.use((req, res, next) => { res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, credentials'); 
    next(); });

    
app.use('/api/auth',authRouter);
app.use('/api/customer',customerRouter);
 app.use('/api/dealer',dealerRouter);
app.use('/api/admin',adminRouter);
app.use('/api',userRouter);
app.post('/forgot-password',async (req, res) => {
    const {email} = req.body;
    const d= await Dealer.findOne({email});
  
   
    if(d){
        Dealer.findOne({email: email})
        .then(user => {
            if(!user) {
                return res.send({Status: "User not existed"})
            } 
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.USER,
                  pass: process.env.PASS
                }
              });
              
              var mailOptions = {
                from: process.env.USER,
                to: email,
                subject: 'Reset Password Link',
                text: `http://localhost:3000/reset_password/${user._id}/${token}`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  return res.send({Status: "Success"})
                }
              });
        })
    }
    else {
        Customer.findOne({email: email})
        .then(user => {
            if(!user) {
                return res.send({Status: "User not existed"})
            } 
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'scrapdealer31@gmail.com',
                  pass: process.env.PASS
                }
              });
              
              var mailOptions = {
                from: 'scrapdealer31@gmail.com',
                to: email,
                subject: 'Reset Password Link',
                text: `http://localhost:3000/reset_password/${user._id}/${token}`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  return res.send({Status: "Success"})
                }
              });
        })
    }
   
})

app.post('/reset-password/:id/:token',async (req, res) => {
    const {id, token} = req.params
    const {password} = req.body
const d=await Dealer.findById(id);

if(d){
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"})
        } else {
            bcryptjs.hash(password, 10)
            .then(hash => {
               Dealer.findByIdAndUpdate(id, {password: hash})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
        }
    })
}

else{
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"})
        } else {
            bcryptjs.hash(password, 10)
            .then(hash => {
                Customer.findByIdAndUpdate(id, {password: hash})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
        }
    })
}
})

app.post('/api/contact', async (req, res) => {
  const { message, name, email, phone } = req.body;
  const contact = new Contact({ message, name, email, phone });

  try {

    await contact.save();


    const adminEmails = await Dealer.find({ isadmin: true }).distinct('email');
    console.log("Admin Emails: ", adminEmails);
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER, 
        pass: process.env.PASS  
      }
    });

    // **Mail Options for Admins**
    var mailOptionsAdmin = {
      from: process.env.USER,
      to: adminEmails.join(','), // Multiple Admin Emails (comma separated)
      subject: 'New Contact Form Submission',
      text: `New contact form submission received!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };

    // **Send Email to Admins**
    transporter.sendMail(mailOptionsAdmin, function (error, info) {
      if (error) {
        console.log('Error sending email to admins:', error);
      } else {
        console.log('Email sent to admins:', info.response);
      }
    });

    // **Email to User (Confirmation)**
    var mailOptionsUser = {
      from: process.env.USER,
      to: email, // User's email
      subject: 'We Received Your Message',
      text: `Hello ${name},\n\nThank you for reaching out. We received your message:\n"${message}"\n\nOur team will get back to you shortly.\n\nBest regards,\nTeam`
    };

    // **Send Confirmation Email to User**
    transporter.sendMail(mailOptionsUser, function (error, info) {
      if (error) {
        console.log('Error sending email to user:', error);
      } else {
        console.log('Confirmation email sent to user:', info.response);
      }
    });

    return res.status(200).json('Message received & emails sent!');
  } catch (err) {
    console.log('Error:', err);
    return res.status(500).json('Error saving contact form');
  }
});


app.get('/api/checkauth',async(req,res)=>{
   const token = req.cookies.access_token;
  
    if (!token) return res.status(401).send('Unauthorized');
  var data=null;
    jwt.verify(token, process.env.JWT_SECRET, async(err, user) => {
      if (err) return res.status(403).send('Forbidden');
    
      const c=await Customer.findById(user.id).select('-password');
      const d=await Dealer.findById(user.id).select('-password');
     
      if(c){
        console.log(c);
        return res.status(200).json(c);
      }
      else if(d){
        return res.status(200).json(d);
      }
      
      else{
        return res.json(errorHandler(404, 'Unauthorized'));
      }
    
     
    });
    
   
    
})
app.listen(process.env.PORT,()=>{
   
    console.log("server is running");
})



