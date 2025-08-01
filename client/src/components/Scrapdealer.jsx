
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { resetFirstLogin } from "../redux/user/userSlice";
import "react-toastify/dist/ReactToastify.css";
import Adminboard from "./Adminboard";



const Scrapdealer = () => {
  const { currentUser} = useSelector((state) => state.user);
  useEffect(() => {
    const showToastAfterLogin = localStorage.getItem("showToastAfterLogin");

    if (showToastAfterLogin && currentUser) {
      toast.success(`Welcome back, ${currentUser.username}!`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        className: "toast-custom",
      });

      // Remove flag after showing the toast
      localStorage.removeItem("showToastAfterLogin");
    }
  }, [currentUser]);

  return (
    
    <div>
    <ToastContainer/>
    
    <div className="min-h-screen bg-gradient-to-bl from-green-50 via-green-100 to-white p-6 md:p-10 flex flex-col items-center">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mb-8 md:mb-10 w-full max-w-3xl text-center border-b-4 border-green-500">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-850">
          Welcome, <span className="text-green-600">{currentUser.username}</span>!
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your scrap dealer requests and feedback with ease.
        </p>
      </div>

      {/* Links Section */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 max-w-3xl w-full">
        {/* Card Template for Links */}
        {[
          {
            to: "/getrequests",
            title: "See Requests",
            description: "View all new requests from customers",
            icon: "📜",
          },
          {
            to: "/getacceptedrequests",
            title: "See Accepted Requests",
            description: "Track requests you’ve accepted",
            icon: "✅",
          },
          {
            to: "/gethistory",
            title: "Request History",
            description: "Review your past request interactions",
            icon: "📂",
          },
          {
            to: "/viewdealerfeedback",
            title: "View All Feedback",
            description: "Check feedback from customers",
            icon: "💬",
          },
        ].map((card, index) => (
          <Link
            key={index}
            to={card.to}
            className="flex items-center bg-white p-6 rounded-lg shadow-md transition transform hover:scale-105 duration-200 border border-gray-300 hover:border-green-600 hover:shadow-lg"
          >
            <div className="text-3xl md:text-4xl mr-4 text-green-600">{card.icon}</div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 hover:text-black">
                {card.title}
              </h2>
              <p className="text-gray-600 mt-1 hover:text-gray-800">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
   {currentUser.isadmin? <Adminboard/>:<></>}
    </div>
</div>
  );
};

export default Scrapdealer;
