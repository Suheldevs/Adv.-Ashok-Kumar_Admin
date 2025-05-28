import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, Search, RefreshCw } from "lucide-react";

const InquiryData = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const api = import.meta.env.VITE_API_URL;

  // ✅ Fetch inquiries
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/inquiry/all`, { withCredentials: true });
      setInquiries(res.data || []);
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // ✅ Delete handler
  const handleDelete = async (id) => {
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
      await axios.delete(`${api}/inquiry/delete/${id}`, { withCredentials: true });
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
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
    } catch (err) {
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredInquiries = inquiries.filter(inquiry =>
    [inquiry.name, inquiry.email, inquiry.phone, inquiry.message]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Customer Inquiries</h1>
          <p className="text-amber-700">Manage customer messages and requests</p>
        </div>

        {/* Search & Refresh */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" size={20} />
            <input
              type="text"
              placeholder="Search inquiries..."
              className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="flex items-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            onClick={fetchInquiries}
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-100">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-400 to-yellow-500">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Phone</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Message</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                <th className="px-6 py-4 text-center text-white font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
                      <span className="ml-3 text-amber-700">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-amber-600">
                    {searchTerm ? "No inquiries found matching your search." : "No inquiries available."}
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry, index) => (
                  <tr key={inquiry._id} className={`border-b border-amber-100 hover:bg-amber-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-amber-25'}`}>
                    <td className="px-6 py-4 font-medium text-amber-900">{inquiry.name}</td>
                    <td className="px-6 py-4 text-amber-700">{inquiry.email}</td>
                    <td className="px-6 py-4 text-amber-700">{inquiry.phone}</td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-amber-800 truncate" title={inquiry.message}>
                        {inquiry.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-amber-700">{formatDate(inquiry.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(inquiry._id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-amber-600">
          Showing {filteredInquiries.length} inquiries
        </div>
      </div>
    </div>
  );
};

export default InquiryData;
