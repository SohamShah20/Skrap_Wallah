import logo from "./logo.svg";
import "./App.css";
import data from "./data.js";
import { useState } from "react";

import { NavLink, Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EditRequest from "./components/EditRequest.jsx";
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Logout from './pages/Logout';
import { useDispatch, useSelector } from 'react-redux';
import Getrequests from './pages/Getrequests';
import Createdealer from './components/createdealer';
import RequestHistory from './pages/RequestHistory';
import Request from './pages/Request.jsx';
import NotFound from './pages/NotFound.jsx';
import Viewrequests from './pages/Viewrequests.jsx';
import Viewacceptedrequests from './pages/Viewacceptedrequests.jsx';
import Acceptedreq from './pages/Acceptedreq.jsx';
import Viewdealer from './pages/Viewdealer.jsx';
import SetPrice from './components/SetPrice.jsx';
import Viewbill from './pages/Viewbill.jsx';
import History from './pages/History.jsx';

import ForgotPassword from './pages/ForgetPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

import GiveFeedback from './pages/GiveFeedback.jsx';
import DealerFeedbacks from './pages/DealerFeedbacks.jsx';
import Contact from "./pages/Contact.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import DealerList from "./pages/DealerList.jsx";
import CheckRateList from "./pages/CheckRateList.jsx";
import { useEffect } from "react";
import { authcheck, signOutUserSuccess } from "./redux/user/userSlice.js";
function App() {
  const { currentUser, loading, error,iscust} = useSelector((state) => state.user);
  const [scraps, setScraps] = useState(data);
  const [dealer, setdealer] = useState(null);
  const dispatch=useDispatch();
  useEffect(()=>{
    const check=async()=>{
    try {
      const res = await fetch(
       'http://localhost:3001/api/checkauth', {
        method: 'GET',
       
        credentials: 'include',
       
      });
    
 const data= await res.json();
   
      console.log(data.success===true);
  
    if(data.success=== false) {
      dispatch(signOutUserSuccess());
      console.log(currentUser);
      return;
    }
      dispatch(authcheck(data));
     console.log(currentUser);
   } catch (error) {
     console.log("Error in checkAuth:", error);
     dispatch(signOutUserSuccess());
   } 
  };

  check();

 
}
  ,[])
  return (
    <div>

      <Navbar />
      <Routes>
        <Route path = "/" element = {currentUser? <Dashboard /> : <Home />} />
        <Route path = "/about" element = {<About/>} />
        <Route path = "/login" element = {!currentUser?<Login/>:<Dashboard/>} />
        <Route path = "/signup" element = {!currentUser?<Signup/>:<Dashboard/>} />
        <Route path = "/logout" element = {<Logout />} />
        <Route path = "/createdealer" element = {(currentUser && currentUser.isadmin)?<Createdealer />:<Navigate to="/"/>} />
        <Route path = "/getrequests" element = {(currentUser && !iscust  && !currentUser.isadmin)?<Getrequests />:<Navigate to="/"/>} />
        <Route path = "/getacceptedrequests" element = {(currentUser && !iscust  && !currentUser.isadmin)?<Acceptedreq />:<Navigate to="/"/>} />
        <Route path = "/gethistory" element = {(currentUser && !currentUser.isadmin)?<History />:<Home/>} />
        <Route path = "/history" element = {(currentUser && !currentUser.isadmin)?<RequestHistory />:<Home/>} />
        <Route path = "/request" element = {(currentUser && iscust)?<Request />:<Navigate to="/"/>} />
        <Route path = "/viewrequests" element = {(currentUser && iscust)?<Viewrequests />:<Navigate to="/"/>} />
        <Route path = "/viewacceptedrequests" element = {(currentUser && iscust)?<Viewacceptedrequests/>:<Navigate to="/"/>} />
        <Route path = "/viewdealer/:id" element = {(currentUser &&(iscust && currentUser.isadmin))?<Viewdealer />:<Navigate to="/"/>} />
        <Route path = "/viewbill/:req_id" element = {(currentUser && !currentUser.isadmin)?<Viewbill />:<Navigate to="/"/>} />
        <Route path = "/setprice" element = {(currentUser && currentUser.isadmin)?<SetPrice />:<Navigate to="/"/>} />
        <Route path = "/editreq/:id" element = {(currentUser && iscust)?<EditRequest />:<Navigate to="/"/>} />
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/reset_password/:id/:token" element={<ResetPassword />}></Route>

        <Route path = "/givefeedback/:req_id" element = {(currentUser && iscust)?<GiveFeedback />:<Navigate to="/"/>} />
        <Route path = "/viewdealerfeedback" element = {(currentUser && !iscust && !currentUser.isadmin)?<DealerFeedbacks />:<Navigate to="/"/>} />
                  <Route path="/contact" element={<Contact />} />
        <Route path="/profilepage" element={currentUser?<ProfilePage />:<Home/>} />
        <Route path="/dealerlist" element={(currentUser && currentUser.isadmin)?<DealerList />:<Navigate to="/"/>} />
        <Route path = "*" element = {<NotFound />} />
        <Route path = "/ratelist" element = {(currentUser && currentUser.isadmin)?<CheckRateList />:<Navigate to="/"/>} />
      </Routes>
    </div>
  );
}

export default App;
