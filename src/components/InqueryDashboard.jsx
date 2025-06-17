import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, Eye, EyeOff } from "lucide-react";

const InquiryDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadCount, setLoadCount] = useState(10);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(`${api}/inquiry/getall`);
        setInquiries(response.data.inquiries);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${api}/inquiry/delete/${id}`, { withCredentials: true });
      setInquiries((prev) => prev.filter((inquiry) => inquiry._id !== id));
      Swal.fire("Deleted!", "The inquiry has been removed.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the inquiry.", "error");
    }
  };

  const toggleMessage = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading inquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="bg-white p-2">

        <h1 className="text-2xl border border-gray-200 bg-gray-50 px-4 py-1 font-bold ">Inquiry Management</h1>
        </div>
        {/* <p className="text-gray-600">Total Inquiries: {inquiries.length}</p> */}
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No inquiries found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w w-[75rem] border-collapse border border-gray-300">
            <thead>
              <tr className=" bg-[#ebb661] text-white">
                <th className="border  border-gray-300 px-4 py-2 text-center">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Phone</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Message</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.slice(0, loadCount).map((inquiry, index) => (
                <tr key={inquiry._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border w-44  border-gray-300 px-4 py-2 font-medium">{inquiry.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{inquiry.email}</td>
                  <td className="border w-44 border-gray-300 px-4 py-2">{inquiry.phone}</td>
                  <td className="border w-52 border-gray-300 px-4 py-2 max-w-xs">
                    <div className="relative">
                      <div className={`${expandedMessageId === inquiry._id ? '' : 'line-clamp-2'}`}>
                        {inquiry.message}
                      </div>
                      {inquiry.message.length > 100 && (
                        <button
                          className="mt-1 text-amber-600 hover:text-amber-800 text-sm flex items-center gap-1"
                          onClick={() => toggleMessage(inquiry._id)}
                        >
                          {expandedMessageId === inquiry._id ? (
                            <>
                              <EyeOff size={14} />
                              Show less
                            </>
                          ) : (
                            <>
                              <Eye size={14} />
                              Read more
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="border w-44 border-gray-300 px-4 py-2">
                    {inquiry.createdAt ? formatDate(inquiry.createdAt) : 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(inquiry._id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Delete inquiry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loadCount < inquiries.length && (
            <div className="mt-4 text-center">
              <button
                className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                onClick={() => setLoadCount((prev) => Math.min(prev + 10, inquiries.length))}
              >
                Load More ({inquiries.length - loadCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InquiryDashboard;