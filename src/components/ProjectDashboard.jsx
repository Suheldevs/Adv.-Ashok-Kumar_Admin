import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import ProjectModal from "./ProjectModal";
import ProjectDetailModal from "./ProjectDetailModal";

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${api}/project/getall`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${api}/project/delete/${id}`,{withCredentials:true});
      setProjects(projects.filter((p) => p._id !== id));
      Swal.fire("Deleted!", "The project has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting project:", error);
      Swal.fire("Error!", "Failed to delete project.", "error");
    }
  };

  const handleAdd = () => {
    setIsFormOpen(true);
    setSelectedProject(null);
  };
  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleView = (projectId) => {
    setSelectedProject(projectId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProject(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    fetchProjects();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Project Dashboard</h2>
        <button
          onClick={handleAdd}
          className="bg-amber-600 hover:bg-yellow-500 text-white px-5 py-2 rounded-lg shadow-md font-semibold transition-all"
        >
          + Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="text-red-400 text-2xl text-center col-span-full py-6">No Projects Yet!</div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <img
                src={project.mainImageUrl}
                alt={project.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">{project.title}</h3>
                <div className="mt-4 flex justify-between gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                    onClick={() => handleView(project._id)}
                  >
                    <FiEye /> View
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                    onClick={() => handleEdit(project)}
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                    onClick={() => handleDelete(project._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && <ProjectModal projectData={selectedProject} onClose={handleCloseForm} />}
      {isDetailModalOpen && <ProjectDetailModal projectId={selectedProject} onClose={handleCloseDetailModal} />}
    </div>
  );
};

export default ProjectDashboard;
