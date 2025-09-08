import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Request = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [scrapData, setScrapData] = useState([{ type: "", quantity: "" }]);
  const [scraps, setScraps] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

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
  }, [])

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
 
  };

  const handleScrapChange = (event, index) => {
    const data = [...scrapData];
    data[index][event.target.name] = event.target.value;
    if(!data[index]["type"]){
      data[index]["type"]="Newspaper";
    }
    setScrapData(data);
  };

  const addScrapItem = () => {
    if (scrapData.length >= 5) {
      setAlert('No more than 5 items can be added');
    } else {
      setScrapData([...scrapData, { type: "", quantity: "" }]);
    }
  };

  const removeScrapItem = (index) => {
    const data = scrapData.filter((_, i) => i !== index);
    setScrapData(data);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    formData.scrapData = scrapData;
    formData.city = currentUser.city;
    formData.custname = currentUser.username;
    formData.email = currentUser.email;

    


const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
const now = new Date();

if (selectedDateTime <= now) {
  setMessage("Please select a future date and time.");
  setIsLoading(false);
  return;
}

    try {
      const res = await fetch('http://localhost:3001/api/customer/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      /*if (!data.success) {
        setError(data.message);
        console.log(data.success);
        setIsLoading(false);
        return;
      }*/
      setMessage(data.message);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center py-12 px-6">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 absolute top-20 left-4 z-10"
      >
        Back
      </button>
      <div className="bg-white p-10 rounded-xl shadow-xl max-w-3xl w-full text-center mb-12 transition duration-300 transform hover:scale-105">
        <h1 className="text-4xl font-bold text-black-600 mb-4">Request Scrap Pickup</h1>
        <p className="text-gray-1000">Provide your scrap details to schedule a pickup.</p>
      </div>

      <form onSubmit={submitHandler} className="bg-white p-10 rounded-xl shadow-lg max-w-3xl w-full transition duration-300 transform hover:scale-105">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-2 animate-pulse">Scrap Details</h2>
          {scrapData.map((scrap, index) => (
            <div key={index} className="flex items-center space-x-4 mt-4">
              <select
                name="type"
                value={scrap.type}
                required
                onChange={(event) => handleScrapChange(event, index)}
                placeholder="Type of Scrap"
                className="border rounded-lg p-3 flex-1 focus:ring-2 focus:ring-blue-300 shadow-sm hover:shadow-md transition duration-200"
              >
                {scraps.map((item, item_index)=>(
                    <option key={item_index} name="type" value={item.type}>{item.type}</option>
                ))}
              </select>
              <input
                type="number"
                name="quantity"
                value={scrap.quantity}
                required
                max={100}
                min={1}
                onChange={(event) => handleScrapChange(event, index)}
                placeholder="Quantity"
                className="border rounded-lg p-3 flex-1 focus:ring-2 focus:ring-blue-300 shadow-sm hover:shadow-md transition duration-200"
              />
              <button
                type="button"
                onClick={() => removeScrapItem(index)}
                className="text-red-500 font-semibold hover:text-red-700 transition duration-200"
              >
                Remove
              </button>
            </div>
          ))}
          {alert && <p className="text-red-500 mt-3">{alert}</p>}
          <button
            type="button"
            onClick={addScrapItem}
            className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-6 rounded-lg hover:from-blue-500 hover:to-green-500 transition duration-200"
          >
            Add Scrap Item
          </button>
        </div>


        <div className="mt-8">
          <label className="block text-green-700 text-lg font-medium mb-2">Date to Sell</label>

          <input
            type="date"
            name="date"
            required
            onChange={handleChange}
            className="border rounded-lg p-3 w-full mt-2 focus:ring-2 focus:ring-blue-300 shadow-sm hover:shadow-md transition duration-200"
          />
        </div>


        <div className="mt-8">
          <label className="block text-green-700 text-lg font-medium mb-2">Time</label>

          <input
            type="time"
            name="time"
            required
           
            onChange={handleChange}
            className="border rounded-lg p-3 w-full mt-2 focus:ring-2 focus:ring-blue-300 shadow-sm hover:shadow-md transition duration-200"
          />
        </div>


        <div className="mt-10 text-center">

          {isLoading ? (
            <p className="text-blue-500 font-semibold">Submitting...</p>
          ) : (
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-10 rounded-lg hover:from-green-500 hover:to-blue-500 transition duration-300 transform hover:scale-105"
            >
              Submit Request
            </button>
          )}

        </div>
      </form>

      {error && <p className="mt-6 text-red-500 font-medium">{error}</p>}
      {message && <p className="mt-6 text-green-500 font-medium">{message}</p>}
    </div>
  );
};

export default Request;
