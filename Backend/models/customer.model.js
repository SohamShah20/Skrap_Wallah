import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isadmin: {
      type: Boolean,
      required: true,
      
    },
    phone: {
      type: String,
      required:true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
  
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
