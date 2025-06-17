import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, Search, RefreshCw, EyeOff, Eye } from "lucide-react";

const InquiryData = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
    const [expandedMessageId, setExpandedMessageId] = useState(null);
  const api = import.meta.env.VITE_API_URL;

  // ✅ Fetch inquiries
  const   fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/inquiry/getall`);
      console.log(res)
      setInquiries(res.data.inquiries || []);
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
  const toggleMessage = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 bg-white shadow-sm p-1 ">
          <h1 className="text-2xl font-bold bg-gray-50 text-gray-900 px-4 py-1 m-1 border border-gray-200">Recent Customer Inquiries</h1>
          {/* <p className="text-amber-700">Manage customer messages and requests</p> */}
        </div>

        {/* Search & Refresh */}
        {/* <div className="mb-6 flex gap-4 items-center">
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
        </div> */}

        {/* Table */}
        <div className="bg-white overflow-auto  shadow-lg border-2 border-gray-100">
             <table className="w-[75rem] border-collapse border border-gray-300">
                     <thead>
                       <tr className="bg-gray100 bg-[#ebb661] text-white text-center">
                         <th className="border border-gray-300 px-4 py-2 ">S.No</th>
                         <th className="border border-gray-300 px-4 py-2 ">Name</th>
                         <th className="border border-gray-300 px-4 py-2 ">Email</th>
                         <th className="border border-gray-300 px-4 py-2 ">Phone</th>
                         <th className="border border-gray-300 px-4 py-2 ">Message</th>
                         <th className="border border-gray-300 px-4 py-2 ">Date</th>
                         <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                       </tr>
                     </thead>
                     <tbody>
                       {filteredInquiries.map((inquiry, index) => (
                         <tr key={inquiry._id} className="hover:bg-gray-50">
                           <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                           <td className="border border-gray-300 px-4 py-2 font-medium">{inquiry.name}</td>
                           <td className="border border-gray-300 px-4 py-2">{inquiry.email}</td>
                           <td className="border border-gray-300 px-4 py-2">{inquiry.phone}</td>
                           <td className="border border-gray-300 px-4 py-2 max-w-xs">
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
                           <td className="border border-gray-300 px-4 py-2">
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
        </div>

        {/* Footer */}
        <div className="mt-4  text-amber-600">
          Showing {filteredInquiries.length} inquiries
        </div>
      </div>
    </div>
  );
};

export default InquiryData;
