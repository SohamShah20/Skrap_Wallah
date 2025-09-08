import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const DealerList = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [dealers, setDealers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
        if (currentUser && !currentUser.isadmin) {
            navigate(-1);
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        const fetchDealers = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/admin/getdealers/`,
                    {
                        method:"GET",
                        credentials:"include"
                    }
                );
                const data = await res.json();
                setDealers(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching requests:', error);
                setError('Failed to fetch requests.');
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchDealers();
        }
    }, [currentUser]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 p-6 md:p-10 flex flex-col items-center">
               <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 absolute top-20 left-4 z-10"
      >
        Back
      </button>
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mb-8 w-full max-w-3xl text-center border-b-4 border-blue-500">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Dealer List</h1>
                <p className="mt-2 text-gray-600">Manage and view details of all registered dealers</p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg w-full max-w-3xl text-center border border-red-200 mb-6">
                    {error}
                </div>
            )}

            {/* Loading Spinner */}
            {loading && (
                <div className="flex items-center justify-center w-full h-64">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Dealer List */}
            <div className="grid gap-6 max-w-3xl w-full">
                {dealers.length === 0 && !loading ? (
                    <p className="text-gray-600 text-center">No Dealers Created!</p>
                ) : (
                    dealers.map((dealer, index) => {
                        const id = dealer._id;
                        return (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-md border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-xl hover:border-blue-500 duration-300"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-gray-800 font-medium">Dealer Email: {dealer.email}</p>
                                    <Link
                                        to={`/viewdealer/${id}`}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 hover:shadow-md hover:border hover:border-blue-500"
                                    >
                                        View Dealer
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DealerList;
