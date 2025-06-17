import mongoose, { mongo } from 'mongoose';

const DealerSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required:true,
    },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    isadmin:{
      type: Boolean,
      default: false,
    },
    totalFeedbacks: {
      type: Number,
      default: 0,
    },
    average: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Dealer = mongoose.model('Dealer', DealerSchema);

export default Dealer;
