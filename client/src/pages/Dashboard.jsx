
import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Link,useNavigate  } from 'react-router-dom';
import Adminboard from '../components/Adminboard';
import Cust from '../components/Cust';
import Scrapdealer from '../components/Scrapdealer';
const Dashboard = () => {
  const { currentUser,iscust} = useSelector((state) => state.user);
  const navigate=useNavigate();


  return (
    
    <div>

      {iscust?<Cust/>:<Scrapdealer/>}
       

        
      
        

    </div>
  )
}

export default Dashboard;