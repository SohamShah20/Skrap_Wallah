import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { setiscust } from '../redux/user/userSlice';
const SignupForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { iscust, currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});

  useEffect(()=>{
    if(currentUser){
      navigate('/');
    }
  }, [currentUser]);

  function changeHandler(event) {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    
    if(formData.password!==formData.cnfpassword){
      setError("Password do not match");
      return;
    }
    formData.isadmin = false;

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success===false) {
        setLoading(false);
        setError(data.message);
        return;
      }
 
      setLoading(false);
      setError(null);
      console.log("lol");
        navigate('/login');
     
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100">
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-105 hover:border-black transition-transform duration-200 ease-in-out">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          Create an Account
        </h2>
        

        <form onSubmit={submitHandler} className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              required
            minLength={4}
            maxLength={15}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-150"
              onChange={changeHandler}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-150"
              onChange={changeHandler}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              required
              placeholder="Enter your address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-150"
              onChange={changeHandler}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              minLength={4}
              maxLength={15}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-150"
              onChange={changeHandler}
            />
          </div>
          <div className="mb-4">
          <label htmlFor="cnfpassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
          <input
            type="password"
            name="cnfpassword"
            id="cnfpassword"
            required
            minLength={4}
            placeholder="Enter your password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={changeHandler}
          />
        </div>

        <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Contact No.</label>
            <input
              type="text"
              name="phone"
              id="phone"
              maxLength={10}
              minLength={10}
              required
              placeholder="Enter your contact no."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-150"
              onChange={changeHandler}
            />
          </div>


          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              id="city"
              required
              placeholder="Enter your city"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-150"
              onChange={changeHandler}
            />
          </div>

          <div className="col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-3/5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 focus:outline-none transition duration-150"
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?{' '}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      </div>
    </div>
  );
};

export default SignupForm;
