import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Scrapdetail from '../components/Scrapdetail';
import {useNavigate} from "react-router-dom";

const Acceptedreq = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for spinner
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

    const fetchRequests = async () => {
      setLoading(true); // Start spinner
      try {
        const res = await fetch(
          `http://localhost:3001/api/dealer/getacceptedrequests/${currentUser._id}`,
          {
                        method:"GET",
                        credentials:"include"
                    }
        );
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError("Unable to load accepted requests. Please try again later.");
      }
      setLoading(false); // Stop spinner
    };

 


  useEffect(() => {
 
    if (currentUser) {
      fetchRequests();
    }
  }, [currentUser]);

  const clickHandler = async (event, index) => {
    const req = requests[index];
    const id = req._id;

    try {
      const res = await fetch(`http://localhost:3001/api/dealer/genreceipt/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success !== true) {
        setError(data.message);
        return;
      }
     
      setMessage("Generated");
       const updatedRequests = requests.filter((_, i) => i !== index);
      setRequests(updatedRequests);
     navigate("/getacceptedrequests");
      return;
    } catch (error) {
      setError("Failed to generate receipt. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-green-50 to-green-100 p-6 md:p-10 flex flex-col items-center">
      
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mb-8 w-full max-w-3xl text-center border-b-4 border-green-500">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 absolute top-20 left-4 z-10"
      >
        Back
      </button>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Accepted Scrap Requests</h1>
        <p className="mt-2 text-gray-600">Manage accepted requests and generate receipts</p>
      </div>

      {/* Message and Error Alerts */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg w-full max-w-3xl text-center border border-red-200 mb-6">
          {error}
        </div>
      )}
      {message && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg w-full max-w-3xl text-center border border-green-200 mb-6">
          {message}
        </div>
      )}

      {/* Spinner for Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid gap-4 max-w-3xl w-full">
          {requests.length === 0 ? (
            <p className="text-gray-600">No accepted requests found.</p>
          ) : (
            requests.map((request, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-300 transition transform hover:scale-105 duration-200 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">Request from {request.custname}</h2>
                  <span className="text-sm text-gray-500">{request.date} at {request.time}</span>
                </div>
                <p className="text-gray-600"><strong>Email:</strong> {request.email}</p>
                <p className="text-gray-600 mt-2 mb-2"><strong>Scrap Details:</strong></p>
                <Scrapdetail scrapDetail={request.scrapData} />

                {/* Generate Receipt Button */}
                {request.cangenreceipt && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={(event) => clickHandler(event, index)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition transform hover:scale-105"
                    >
                      Generate Receipt
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Acceptedreq;
