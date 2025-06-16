import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BlogModal from "./BlogModal";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { Eye, EyeOff } from "lucide-react";

const BlogDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDescId, setExpandedDescId] = useState(null);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${api}/blog/getall`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blog data:", error);
      Swal.fire("Error!", "Failed to fetch blogs.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4d4f",
      cancelButtonColor: "#1890ff",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.delete(`${api}/blog/delete/${id}`, { withCredentials: true });
      if (res.status == 200 || 201) {
        setBlogs(blogs.filter((b) => b._id !== id));
        Swal.fire("Deleted!", "The blog has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      Swal.fire("Error!", "Failed to delete blog.", "error");
    }
  };

  const handleEdit = (b) => {
    setSelectedBlog(b);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedBlog(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    fetchBlogs();
  };

  const removeHTMLTags = (text) => {
    if (!text) return "";
    return text.replace(/<[^>]*>/g, "");
  };

  const toggleDescription = (id) => {
    setExpandedDescId(expandedDescId === id ? null : id);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.postedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFormOpen) {
    return (
      <div className="p-6">
        <div className="bg-white rounded border p-6">
          <BlogModal blogData={selectedBlog} onClose={handleCloseForm} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 rounded p-2 bg-white">
        <div className="flex justify-between items-center  bg-gray-50 border border-gray-100 p-2">
          <div>
            <h1 className="text-2xl font-bold mb-2">Blog Management</h1>
            {/* <p className="text-gray-600">Total Blogs: {blogs.length}</p> */}
          </div>
          <button
            onClick={handleAdd}
            className="bg-[#ebb661] text-white font-semibold px-4 py-2 rounded hover:bg-[#ebb661] flex items-center gap-2"
          >
            <FiPlus size={24} />
            Add New Blog
          </button>
        </div>

        {/* <div className="mb-4">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              className="border border-gray-200 rounded px-4 py-2 pl-10 w-full"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div> */}
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No blogs found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className=" w-[75rem] border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-center text-white">
                <th className="border border-gray-200 px-4 py-2 bg-[#ebb661]">S.No</th>
                <th className="border border-gray-200 px-4 py-2 bg-[#ebb661]">Image</th>
                <th className="border border-gray-200 px-4 py-2 bg-[#ebb661]">Title</th>
                <th className="border border-gray-200 px-4 py-2 bg-[#ebb661]">Category</th>
                <th className="border border-gray-200 px-4 py-2 bg-[#ebb661]">Description</th>
                <th className="border border-gray-200 px-4 py-2 bg-[#ebb661]">Posted by</th>
                <th className="border border-gray-200 px-4 py-2 text-center bg-[#ebb661]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs
                .slice()
                .reverse()
                .map((blog, index) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-2 font-medium max-w-xs">
                      <div className="truncate" title={blog.title}>
                        {blog.title}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">
                        {blog.category}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2 max-w-md">
                      <div className="relative">
                        <div className={`${expandedDescId === blog._id ? '' : 'line-clamp-3'}`}>
                          {removeHTMLTags(blog.description)}
                        </div>
                        {removeHTMLTags(blog.description).length > 150 && (
                          <button
                            className="mt-1 text-[#ebb661] hover:text-amber-800 text-sm flex items-center gap-1"
                            onClick={() => toggleDescription(blog._id)}
                          >
                            {expandedDescId === blog._id ? (
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
                    <td className="border border-gray-200 px-4 py-2">{blog.postedBy}</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-[#ebb661] hover:text-amber-800 p-1 rounded hover:bg-amber-50"
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogDashboard;