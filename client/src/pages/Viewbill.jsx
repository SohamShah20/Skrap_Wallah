import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; // Step 1: Import jsPDF
import "jspdf-autotable";

const Viewbill = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [details, setDetails] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [bill, setBill] = useState({});
  const { req_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/customer/getbill/${req_id}`,
          {
                        method:"GET",
                        credentials:"include"
                    }
        );
        const data = await res.json();
        setDetails(data.scrapdata);
        setBill(data);
      } catch (error) {
        setError("Failed to fetch bill details");
        console.error("Error fetching bill details:", error);
      }
    };

    if (currentUser) {
      fetchBillDetails();
    }
  }, [currentUser, req_id]);

  // Step 2: Define the download function
  const downloadBillAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bill Details", 14, 20);

    doc.setFontSize(12);
    doc.text(`Customer Name: ${bill.custname}`, 14, 30);
    doc.text(`Dealer Name: ${bill.dealername}`, 14, 40);
    doc.text(`Grand Total: ${bill.gtotal}`, 14, 50);

    doc.autoTable({
      startY: 60,
      head: [["Type", "Quantity", "Price per kg", "Total"]],
      body: details.map((detail) => [
        detail.type,
        detail.quantity,
        detail.rateperunit,
        detail.total,
      ]),
    });

    doc.save("Bill_Details.pdf");
  };

  // Step 3: Define the print function
  const printBill = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#e1f5d1] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-xl space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
          Bill Details
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {message && (
          <p className="text-green-600 text-center mb-4">{message}</p>
        )}

        {/* Bill Header Section */}
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-800">
            <strong>Customer Name:</strong> {bill.custname}
          </p>
          <p className="text-lg font-medium text-gray-800">
            <strong>Dealer Name:</strong> {bill.dealername}
          </p>
        </div>

        {/* Bill Table Section */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <div className="flex justify-between text-lg font-semibold text-gray-600 p-4 bg-green-100 rounded-t-lg">
            <p>Type</p>
            <p>Quantity</p>
            <p>Price per kg</p>
            <p>Total</p>
          </div>

          {details.map((detail, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 hover:bg-blue-100 transition duration-200 ease-in-out"
            >
              <p className="text-gray-800">{detail.type}</p>
              <p className="text-gray-800">{detail.quantity}</p>
              <p className="text-gray-800">{detail.rateperunit}</p>
              <p className="text-gray-800">{detail.total}</p>
            </div>
          ))}
        </div>

        {/* Grand Total */}
        <div className="mt-4 flex justify-end text-xl font-bold text-gray-900">
          <p className="p-4 bg-[#4CAF50] text-white rounded-lg shadow-md">
            Grand Total: {bill.gtotal}
          </p>
        </div>

        {/* Download and Print Buttons */}
        <div className="mt-8 text-center space-x-4">
          <button
            onClick={downloadBillAsPDF}
            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            Download as PDF
          </button>
          <button
            onClick={printBill}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Print
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Viewbill;
