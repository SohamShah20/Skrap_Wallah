import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Scrapdetail from "../components/Scrapdetail";
import { Link,useNavigate } from "react-router-dom";

const RequestHistory = (props) => {
  const { currentUser } = useSelector((state) => state.user);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const setDealer = props.setdealer;

  const navigate = useNavigate();
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/customer/getclosedrequests/${currentUser._id}`,
          {
                        method:"GET",
                        credentials:"include"
                    }
        );
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError("Failed to load requests.");
      } finally {
        setIsLoading(false); // Set loading to false after data fetch
      }
    };

    if (currentUser) {
      fetchRequests();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-white-200 p-8">
      <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-10 tracking-wide shadow-lg p-4 rounded-lg">
        Request History
      </h1>
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 absolute top-20 left-4 z-10"
      >
        Back
      </button>

      {/* Spinner Display */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-700 text-xl">No requests found.</p>
      ) : (
        <div className="grid gap-8 max-w-4xl mx-auto">
          {requests.reverse().map((request, index) => {
            const id = request.dealer_id;
            const req_id = request._id;
            return (
              <div
                key={index}
                className={`bg-white shadow-lg rounded-lg p-8 transform hover:scale-105 transition duration-300 border-t-4 ${
                  request.givenFeedback
                    ? "border-blue-400"
                    : "border-yellow-400"
                }`}
              >
                <p className="text-xl font-bold text-green-800 mb-2">
                  Customer: {request.custname}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Email: {request.email}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Date: {request.date}
                </p>
                <p className="text-sm text-gray-600">Time: {request.time}</p>

                <div className="mt-6">
                  <p className="text-green-600 font-semibold">Scrap Details:</p>
                  <Scrapdetail scrapDetail={request.scrapData} />
                </div>

                <div className="flex space-x-6 mt-8">
                  <Link
                    to={`/viewdealer/${id}`}
                    className="text-blue-500 hover:bg-blue-100 hover:text-blue-600 font-semibold underline px-2 py-1 rounded transition-all"
                  >
                    View Dealer
                  </Link>
                  <Link
                    to={`/viewbill/${req_id}`}
                    className="text-blue-500 hover:bg-blue-100 hover:text-blue-600 font-semibold underline px-2 py-1 rounded transition-all"
                  >
                    View Bill
                  </Link>
                  {!request.givenFeedback && (
                    <Link
                      to={`/givefeedback/${req_id}`}
                      className="text-blue-500 hover:bg-blue-100 hover:text-blue-600 font-semibold underline px-2 py-1 rounded transition-all"
                    >
                      Give Feedback
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {error && (
        <p className="text-center text-red-500 mt-6 font-semibold">{error}</p>
      )}
      {message && (
        <p className="text-center text-green-500 mt-6 font-semibold">
          {message}
        </p>
      )}
    </div>
  );
};

export default RequestHistory;
