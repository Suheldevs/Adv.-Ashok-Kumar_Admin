import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, Eye } from "lucide-react";

const ApplicationDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadCount, setLoadCount] = useState(5);
  const [expandedId, setExpandedId] = useState(null);

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${api}/application/getall`);
        setApplications(response.data.reverse());
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
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
      await axios.delete(`${api}/application/delete/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      Swal.fire("Deleted!", "The application has been removed.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the application.", "error");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Job Applications</h2>

      {loading && <p className="text-center text-lg text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-lg bg-white">
            <thead>
              <tr className="bg-slate-800 text-white text-sm">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Position</th>
                <th className="border border-gray-300 px-4 py-2">Qualification</th>
                <th className="border border-gray-300 px-4 py-2">Experience</th>
                <th className="border border-gray-300 px-4 py-2">Resume</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, loadCount).map((app) => (
                <tr key={app._id} className="hover:bg-gray-100 transition">
                  <td className="border border-gray-300 px-4 py-2 text-center">{app.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{app.phone}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{app.email}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{app.position}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{app.qualification}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{app.experience}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      View Resume
                    </a>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center flex justify-center gap-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow-md transition"
                      onClick={() => handleDelete(app._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                    {/* <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-md transition"
                      onClick={() => toggleExpand(app._id)}
                    >
                      <Eye size={18} />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loadCount < applications.length && (
            <div className="text-center mt-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md font-semibold transition"
                onClick={() => setLoadCount((prev) => Math.min(prev + 5, applications.length))}
              >
                Show More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationDashboard;
