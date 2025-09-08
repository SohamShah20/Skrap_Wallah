import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Createdealer = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { iscust } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);

  const changeHandler = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const imageChangeHandler = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      const res = await fetch('http://localhost:3001/api/admin/createdealer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success === false) {
        setError(result.message);
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-50 via-green-100 to-white p-6 md:p-10">
          <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 absolute top-20 left-4 z-10"
      >
        Back
      </button>

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Create Dealer</h2>
        <form onSubmit={submitHandler} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-gray-600 font-medium">Username</label>
            <input
              type="text"
              name="username"
              maxLength={15}
              minLength={4}
              placeholder="Username"
              onChange={changeHandler}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={changeHandler}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Phone</label>
            <input
              type="number"
              name="phone"
              max={9999999999}
              min={1000000000}
              placeholder="Phone"
              onChange={changeHandler}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={changeHandler}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              maxLength={15}
              minLength={4}
              onChange={changeHandler}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">City</label>
            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={changeHandler}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-200 ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? 'Loading...' : 'Create'}
          </button>
        </form>
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Createdealer;
