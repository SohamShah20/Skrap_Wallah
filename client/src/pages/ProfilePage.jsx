import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
const ProfilePage = () => {
  const dispatch=useDispatch();

  const navigate=useNavigate();
  const [view, setView] = useState("profile"); 
  const { currentUser,iscust} = useSelector((state) => state.user);
  const [file,setFile]=useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [error,seterror]=useState(null);

const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({

    username: currentUser.username,
    address: currentUser.address,
    phone: currentUser.phone,
    email: currentUser.email,
    avatar: currentUser.avatar, 
   

    city:currentUser.city

  });
const [passwordform,setpasswordform]=useState({});
useEffect(() => {
  if (file) {
    handleFileUpload(file);
  }
}, [file]);

const handleFileUpload = (file) => {
  const storage = getStorage(app);
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed', 
    (snapshot) => {
      const progress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },
    (error) => {
      setFileUploadError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
        setFormData({ ...formData, avatar: downloadURL })
      );
    }
  );
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handlepasswordChange = (e) => {
    const { name, value } = e.target;
    setpasswordform({
      ...passwordform,
      [name]: value,
    });
  };
  const handleFormSubmit = async(e) => {
    e.preventDefault();
    formData.iscust=iscust;
    console.log(formData.iscust);
    try{
      const res = await fetch(`http://localhost:3001/api/updateuser/${currentUser._id}`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
        
       },
       credentials: 'include', 
       body: JSON.stringify(formData),
     });
     const data = await res.json();
     console.log(data);
     if (data.success === false) {
       seterror(data.message);
       return;
     }
     dispatch(updateUserSuccess(data));
   setView("profile");
     navigate('/profilepage');
   } catch (error) {
    seterror(error.message);
   }
  };

  const handlePasswordSubmit =async (e) => {
    e.preventDefault();
    console.log(passwordform);
    passwordform.iscust=iscust;
    if(passwordform.newPassword!==passwordform.confirmPassword){
      seterror("password not match");
      return;
    }
   try{
     const res = await fetch(`http://localhost:3001/api/resetpass/${currentUser._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       
      },
      credentials: 'include', 
      body: JSON.stringify(passwordform),
    });
    const data = await res.json();
    console.log(data);
    if (data.success === false) {
      seterror(data.message);
      return;
    }
    
    setView("profile");
    navigate('/profilepage');
  } catch (error) {
   seterror(error.message);
  }
  };

  return (
    <div className="flex flex-col  items-center w-full max-w-2xl mx-auto p-8 bg-blue-50 rounded-lg shadow-lg mt-12">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 absolute top-20 left-4 z-10"
      >
        Back
      </button>
      {view === "profile" && (
        <>
          <div className="relative w-40 h-40">
            <img
              src={currentUser.avatar }// replace with actual image URL or source
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-blue-500"
            />
            <button
              onClick={() => setView("editProfile")}
              className="absolute bottom-2 right-0 bg-blue-500 text-white rounded-full px-4 py-2 text-xs font-semibold shadow-md hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>


          <div className="mt-6 text-center">
         


          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            {currentUser.username}
          </h2>
          <p className="text-gray-600 mb-2">Address: {currentUser.address}</p>
          <p className="text-gray-600 mb-4">City: {currentUser.city}</p>
          <p className="text-gray-600 mb-4">Phone: {currentUser.phone}</p>
          <button
            onClick={() => setView("changePassword")}
            className="bg-blue-500 text-white font-bold rounded px-4 py-2 mt-4 hover:bg-blue-600"
          >
            Change Password
          </button></div>

        </>
      )}

      {view === "editProfile" && (
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                name="username"
                required
                maxLength={15}
                minLength={4}
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
              <input
                type="number"
                name="phone"
                max={9999999999}
                min={1000000000}
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border rounded-md bg-gray-200 cursor-not-allowed focus:outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed.</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Profile Image</label>
              <input
                type="file"
                name="avatar"
                accept='image/*'
                
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
                      <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-green-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
            </div>

           <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
              
            >
              Save Changes
            </button>
          </form>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setView("profile")}
              className="text-blue-500 hover:underline"
            >
              Back to Profile
            </button>
          </div>
        </div>
      )}

      {view === "changePassword" && (
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                required
                maxLength={15}
                minLength={4}
                onChange={handlepasswordChange}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                maxLength={15}
                minLength={4}
                onChange={handlepasswordChange}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
            >
              Update Password
            </button>
          </form>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setView("profile")}
              className="text-blue-500 hover:underline"
            >
              Back to Profile
            </button>
            {error?<>{error}</>:<></>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
