import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiX, FiTrash2, FiMapPin, FiInfo } from "react-icons/fi";

const ProjectDetailModal = ({ projectId, onClose }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/project/get/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
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
      await axios.delete(`${api}/project/delete/${projectId}`,{withCredentials:true});
      Swal.fire("Deleted!", "The project has been deleted.", "success");
      onClose(); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting project:", error);
      Swal.fire("Error!", "Failed to delete project.", "error");
    }
  };

  // Background overlay with blur effect
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {loading ? (
        <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center w-full max-w-md">
          <div className="animate-pulse w-12 h-12 border-t-4 border-blue-500 rounded-full mb-4"></div>
          <p className="text-gray-700 font-medium">Loading project details...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDelete} 
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete project"
              >
                <FiTrash2 size={20} />
              </button>
              <button 
                onClick={onClose} 
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Content area with scrolling */}
          <div className="overflow-y-auto p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main image column */}
              <div className="flex-1">
                <div className="relative rounded-lg overflow-hidden shadow-md mb-4 bg-gray-100">
                  <img 
                    src={project.mainImageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover aspect-video"
                  />
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FiMapPin className="text-blue-500" />
                  <span className="font-medium">{project.location}</span>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-gray-800 mb-2">
                    <FiInfo className="text-blue-500" />
                    <h3 className="font-semibold text-lg">Description</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </div>
              </div>

              {/* Gallery column */}
              <div className="lg:w-2/5">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Gallery</h3>
                <div className="grid grid-cols-2 gap-3">
                  {project.otherImages?.map((img, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <img 
                        src={img} 
                        alt={`Project view ${index + 1}`} 
                        className="w-full h-full object-cover aspect-square"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailModal;