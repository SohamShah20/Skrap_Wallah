import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GiveFeedback = () => {
  const { req_id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [dealer, setDealer] = useState({});
  const [formData, setFormData] = useState({
    dealer: "",
    customer: "",
    rating: 1,
    description: ""
  });

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/customer/getDealerFromRequest/${req_id}`,
          {
                        method:"GET",
                        credentials:"include"
                    }
        );
        const data = await res.json();
        setDealer(data);
      } catch (error) {
        console.error('Error fetching dealer:', error);
      }
    };

    if (currentUser) {
      fetchDealer();
    }
  }, [currentUser, req_id]);

  useEffect(() => {
    if (dealer._id && currentUser._id) {
      setFormData((prev) => ({
        ...prev,
        dealer: dealer._id,
        customer: currentUser._id
      }));
    }
  }, [dealer, currentUser]);

  const changeHandler = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/customer/feedback/${req_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      await res.json();
      navigate('/');
    } catch (error) {
      console.log(error);
      navigate('/');
    }
  };

  if (!dealer._id || !currentUser._id) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-green-50 via-green-100 to-white p-6 md:p-10 flex flex-col items-center">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mb-8 w-full max-w-3xl text-center border-b-4 border-green-500">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 hover:text-green-600 transition duration-200">Feedback for Dealer</h1>
        <p className="mt-2 text-gray-600 hover:text-gray-800 transition duration-200">Help us improve our service by sharing your experience.</p>
      </div>

      {/* Feedback Form */}
      <div className="w-full max-w-3xl bg-white p-8 md:p-10 rounded-lg shadow-lg space-y-6">
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 hover:text-green-600 transition duration-200">Rating (1-10)</label>
            <input 
              type="number" 
              name="rating" 
              min="1" 
              max="10" 
              required 
              value={formData.rating} 
              onChange={changeHandler} 
              className="block w-full p-3 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Rate the dealer from 1 to 10"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 hover:text-green-600 transition duration-200">Your Feedback</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={changeHandler} 
              rows="5" 
              className="block w-full p-3 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Enter your feedback here..."
            />
          </div>
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 hover:scale-105 transition duration-200 transform"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GiveFeedback;
