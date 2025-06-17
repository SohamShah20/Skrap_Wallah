import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Scrapdetail from '../components/Scrapdetail';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Viewrequests = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();
    const fetchRequests = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/customer/getrequests/${currentUser._id}`);
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to fetch requests.');
        }
    };

    useEffect(() => {

        const fetchRequests = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`http://localhost:3001/api/customer/getrequests/${currentUser._id}`);
                const data = await res.json();
                setRequests(data);
            } catch (error) {
                console.error('Error fetching requests:', error);
                setError('Failed to fetch requests.');
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser) {
            fetchRequests();
        } else {
            setIsLoading(false);
        }
    }, []);

    async function handleDelete(event, index) {
        const id = requests[index]._id;
        setRequests((prevRequests) => prevRequests.filter((_, i) => i !== index));
            toast.success("Request deleted successfully", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                className: "toast-custom",
              });
        setIsDeleting(true);
        try {
            const res = await fetch(`http://localhost:3001/api/customer/deletereq/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();
            if (!data.success) {
                setError(data.message);
                window.location.reload();
                return;
            }
            setRequests((prevRequests) => prevRequests.filter((_, i) => i !== index));

            setMessage(data.message);
          
            
        } catch (error) {
            setError(error.message);
            toast.error("Error Occured", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                className: "toast-custom",
              });
            window.location.reload();
        } finally {
            setIsDeleting(false);
        }

    }

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-screen p-8 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-8">Scrap Pickup Requests</h1>
            <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 absolute top-20 left-4 z-10"
      >
        Back
      </button>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center p-6 bg-white rounded-lg shadow-lg border-l-4 border-yellow-400 max-w-md mt-10 transform transition-all duration-300 hover:scale-105">
                    <p className="text-2xl font-medium text-gray-700 mb-2">No Requests Yet!</p>
                    <p className="text-gray-600">
                        It looks like there are no scrap pickup requests at the moment. Once customers make requests, you’ll see them here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.reverse().map((request, index) => {
                        const id = request._id;

                        return (
                            <div
                                key={index}
                                className="bg-white shadow-xl rounded-lg p-6 border-l-4 border-green-500 hover:border-green-700 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <p className="text-lg font-semibold text-gray-700">
                                    Customer Name: <span className="font-bold text-green-700">{request.custname}</span>
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Customer Email: <span className="text-gray-800">{request.email}</span>
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Pickup Date: <span className="text-gray-800">{request.date}</span>
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Pickup Time: <span className="text-gray-800">{request.time}</span>
                                </p>
                                <div className="mt-4">
                                    <h3 className="text-md font-semibold text-gray-700 mb-2">Scrap Details:</h3>
                                    <Scrapdetail scrapDetail={request.scrapData} />
                                </div>
                                <button
                                    onClick={(event) => handleDelete(event, index)}
                                    className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600 transform hover:scale-105 transition duration-200 w-full"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Request'}
                                </button>
                                <Link
                                    to={`/editreq/${id}`}
                                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded inline-block text-center hover:bg-blue-600 transform hover:scale-105 transition duration-200 w-full"
                                >
                                    Update Request
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}

            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
            {message && <p className="text-green-600 text-center mt-4">{message}</p>}
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
};

export default Viewrequests;
