import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
  setiscust
} from '../redux/user/userSlice';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { iscust, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser]);

  async function logoutHandler() {
    dispatch(signOutUserStart());
    dispatch(setiscust(true));

    try {
      const response = await fetch('http://localhost:3001/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      const res = await response.json();
      if (res.success === false) {
        dispatch(signOutUserFailure(res.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      return;
    }
    navigate('/');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-8 mt-[-30px]">
      <div className="bg-gray-200 rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full text-center mx-auto border-2 border-gray-400 transform hover:scale-105 transition duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Log Out</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={logoutHandler}
            className="bg-red-500 text-white w-full sm:w-auto px-4 py-2 rounded-md hover:bg-red-600 hover:border-red-600 hover:scale-105 transition duration-300 border-2 border-black"
          >
            Yes, Log Out
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-700 w-full sm:w-auto px-4 py-2 rounded-md hover:bg-gray-300 hover:scale-105 transition duration-300 border-2 border-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
