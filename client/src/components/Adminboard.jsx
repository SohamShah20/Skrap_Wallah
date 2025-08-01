import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setiscust } from '../redux/user/userSlice';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Scrapdealer from './Scrapdealer';
const Adminboard = () => {
  const { currentUser, iscust } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Ensuring we set 'iscust' to false if it's true (admin context)
  if (iscust) dispatch(setiscust(false));

  return (
    <div>
      <ToastContainer />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white p-6 md:p-10 flex flex-col items-center">
        {/* Header */}
       
       
        {/* Admin Features Section */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 max-w-3xl w-full">
          {/* Card Template for Admin Features */}
          {[
            {
              to: "/createdealer",
              title: "Create Scrap Dealer",
              description: "Add a new scrap dealer to the system",
              icon: "➕",
            },
            {
              to: "/setprice",
              title: "Set Scrap Prices",
              description: "Set the price for various scrap types",
              icon: "💲",
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

        {/* "View Dealers" Card (Centered below the other two cards) */}
        <div className="flex justify-center w-full mt-4">
          <Link
            to="/dealerlist"
            className="flex items-center justify-center bg-white p-3 rounded-lg shadow-md transition transform hover:scale-105 duration-200 border border-gray-300 hover:border-green-600 hover:shadow-lg w-full max-w-3xl"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-3xl md:text-4xl mb-4 text-green-600">👥</div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 hover:text-black">
                View Dealers
              </h2>
              <p className="text-gray-600 mt-2 hover:text-gray-800">
                View all registered scrap dealers
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Adminboard;
