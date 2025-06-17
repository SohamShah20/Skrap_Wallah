import mongoose, { mongo } from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      
      
    },
    email: {
      type: String,
     
    },
   
    phone: {
      type: String,
      
    },
    message:{
      type: String,
      
    },
  
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;
