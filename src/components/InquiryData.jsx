import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, MessageCircle, ExternalLink, Filter, RefreshCw, Search, AlertTriangle, Calendar, Clock, ArrowDown } from "lucide-react";

const InquiryData = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadCount, setLoadCount] = useState(5);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/inquiry/getall`);
      setInquiries(response.data.inquiries.reverse());
    } catch (err) {
      setError("Error fetching data");
      
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    
    const result = await Swal.fire({
      title: "Delete this inquiry?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F43F5E",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'rounded-md',
        cancelButton: 'rounded-md',
      }
    });
    
    if (!result.isConfirmed) return;
    
    try {
      await axios.delete(`${api}/inquiry/delete/${id}`,{withCredentials:true});
      setInquiries((prev) => prev.filter((inquiry) => inquiry._id !== id));
      Swal.fire({
        title: "Deleted!",
        text: "The inquiry has been removed.",
        icon: "success",
        confirmButtonColor: "#10B981",
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-md',
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the inquiry.",
        icon: "error",
        confirmButtonColor: "#F43F5E",
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'rounded-md',
        }
      });
    }
  };

  const toggleMessage = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  const handleCardClick = (id) => {
    toggleMessage(id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const displayedInquiries = filteredInquiries.slice(0, loadCount);

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="text-indigo-600 mr-2" size={24} />
              Customer Inquiries
            </h1>
            <p className="text-gray-500 mt-1">Manage and respond to customer messages</p>
          </div>
          
          <div className="flex items-center gap-2 self-end">
            <button 
              onClick={fetchInquiries}
              className="flex items-center gap-1 px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white shadow-md rounded-xl p-12 text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 font-medium">Loading inquiries...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <AlertTriangle size={24} className="text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error loading inquiries</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button 
              onClick={fetchInquiries}
              className="mt-4 bg-white text-red-600 border border-red-200 rounded-lg px-4 py-2 shadow-sm hover:bg-red-50 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredInquiries.length === 0 && (
          <div className="bg-white shadow-md rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={40} className="text-indigo-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No inquiries found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm ? 
                "No results match your search criteria. Try using different keywords or clear your search." : 
                "When customers submit inquiries, they will appear here."
              }
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-4 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}
        
        {/* Inquiry Cards */}
        {!loading && !error && filteredInquiries.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {displayedInquiries.map((inquiry) => (
                <div 
                  key={inquiry._id} 
                  className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition hover:shadow-lg ${expandedMessageId === inquiry._id ? 'border-l-4 border-indigo-500' : ''}`}
                  onClick={() => handleCardClick(inquiry._id)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {getInitials(inquiry.name)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">{inquiry.name}</h3>
                          <div className="flex flex-col text-sm text-gray-500 mt-1 space-y-1">
                            <span>{inquiry.email}</span>
                            <span>{inquiry.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => handleDelete(inquiry._id, e)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete inquiry"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className={`prose prose-sm max-w-none text-gray-700 ${expandedMessageId === inquiry._id ? '' : 'line-clamp-2'}`}>
                        {inquiry.message}
                      </div>
                      
                      {inquiry.message && inquiry.message.length > 100 && (
                        <button
                          className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMessage(inquiry._id);
                          }}
                        >
                          {expandedMessageId === inquiry._id ? "Show less" : "Read more"}
                          <ExternalLink size={14} className="ml-1" />
                        </button>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{formatTime(inquiry.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More */}
            {loadCount < filteredInquiries.length && (
              <div className="mt-6 text-center">
                <button
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition-colors"
                  onClick={() => setLoadCount((prev) => Math.min(prev + 5, filteredInquiries.length))}
                >
                  Load More
                  <ArrowDown size={16} className="ml-2" />
                </button>
                <p className="text-gray-500 text-sm mt-2">
                  Showing {displayedInquiries.length} of {filteredInquiries.length} inquiries
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryData;