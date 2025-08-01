import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CheckRateList = () => {
    const { currentUser } = useSelector((state) => state.user);
  const [scraps, setScraps] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState([]);
  const [adminButton, setAdminButton] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

    useEffect(()=>{
        const fetchScraps = async () => {
          try{
            const res = await fetch(`http://localhost:3001/api/customer/getscraps`,
              {
                        method:"GET",
                        credentials:"include"
                    }
            );
            const data = await res.json();
            setScraps(data);
          }catch(error){
            setError('Error fetching scraps: ', error);
            console.log(error);
          }
        };
    
        if(currentUser){
          fetchScraps();
        }
      }, [currentUser])

      useEffect(()=>{
        if(currentUser.isadmin){
            setAdminButton(true);
        }
        else{
            setAdminButton(false);
        }
      })

      function editHandler(event){
        setIsEditable(true);
      }

      function changeHandler(event,index){
        
      }

      const saveHandler = async(event)=>{
        
      }

  return (
    <div>
        <h1>Rate List</h1>
        {adminButton ? (<button onClick={editHandler}>Edit</button>) : <></>}
        {isEditable ? (<button onClick={saveHandler}>Save</button>) : <></>}
        {scraps.map((scrap, index)=>(
                    <div key={index}>
                        <p>Scrap: {scrap.type}</p>
                        {isEditable ? <input type="number" name={index} value={index} defaultValue={scrap.price} onChange={(event)=>changeHandler(event,index)}/> : <p>Price (per kg): {scrap.price}</p>}
                    </div>
        ))}
    </div>
  )
}

export default CheckRateList;