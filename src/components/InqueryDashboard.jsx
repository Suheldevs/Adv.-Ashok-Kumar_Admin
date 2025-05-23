import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, Mail, Phone, User, MessageSquare, Inbox, ArrowDown, Eye, EyeOff, Calendar, Clock } from "lucide-react";

const InquiryDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadCount, setLoadCount] = useState(5);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(`${api}/inquiry/getall`);
        setInquiries(response.data.inquiries.reverse());
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
      await axios.delete(`${api}/inquiry/delete/${id}`,{withCredentials:true});
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

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inquiry Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and respond to customer inquiries</p>
          </div>
          
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg">
            <Inbox size={20} />
            <span className="font-medium">{inquiries.length} Total Inquiries</span>
          </div>
        </div>

        {loading && (
          <div className="bg-white shadow rounded-lg p-12 flex flex-col items-center">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 font-medium">Loading inquiries...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && inquiries.length === 0 && (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No inquiries yet</h3>
            <p className="mt-2 text-gray-500">New inquiries will appear here when customers contact you.</p>
          </div>
        )}

        {!loading && !error && inquiries.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Information
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.slice(0, loadCount).map((inquiry) => (
                    <tr key={inquiry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <User size={16} className="text-gray-400 mr-2" />
                            <span className="font-medium text-gray-900">{inquiry.name}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Mail size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">{inquiry.email}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Phone size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">{inquiry.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative max-w-md">
                          <div className={`text-sm text-gray-700 ${expandedMessageId === inquiry._id ? '' : 'line-clamp-2'}`}>
                            {inquiry.message}
                          </div>
                          {inquiry.message.length > 100 && (
                            <button
                              className="mt-1 flex items-center text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                              onClick={() => toggleMessage(inquiry._id)}
                            >
                              {expandedMessageId === inquiry._id ? (
                                <>
                                  <EyeOff size={14} className="mr-1" />
                                  Show less
                                </>
                              ) : (
                                <>
                                  <Eye size={14} className="mr-1" />
                                  Read more
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <span>{inquiry.createdAt ? formatDate(inquiry.createdAt) : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(inquiry._id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          title="Delete inquiry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {loadCount < inquiries.length && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  onClick={() => setLoadCount((prev) => Math.min(prev + 5, inquiries.length))}
                >
                  <ArrowDown size={16} className="mr-2" />
                  Show {Math.min(5, inquiries.length - loadCount)} More
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryDashboard;