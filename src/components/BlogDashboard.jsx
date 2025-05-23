import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BlogModal from "./BlogModal";
import { FiEdit, FiTrash2, FiPlus, FiFileText, FiSearch } from "react-icons/fi";

const BlogDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      console.log('cha rha hai bhai', document?.cookie)
      const res = await axios.delete(`${api}/blog/delete/${id}` ,{withCredentials:true} );
      if(res.status == 200 || 201){
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

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.postedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isFormOpen ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <BlogModal blogData={selectedBlog} onClose={handleCloseForm} />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
                <p className="mt-1 text-sm text-gray-500">Manage your blog posts, create new content and organize your publications</p>
              </div>
              
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition duration-300 font-medium"
              >
                <FiPlus size={18} />
                <span>Create New Post</span>
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-5 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiFileText size={20} className="text-indigo-500" />
                    <span className="font-medium">All Blog Posts</span>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
                      {blogs.length}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="bg-gray-50 border  border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                      placeholder="Search by title, category or author"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-700 text-base">
                      <th className="px-6 py-3 font-medium">Post</th>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium">Description</th>
                      <th className="px-6 py-3 font-medium">Author</th>
                      <th className="px-6 py-3 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <FiFileText size={40} className="text-gray-300 mb-2" />
                            <p className="text-gray-500 font-medium">No blog posts found</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {searchTerm ? "Try adjusting your search criteria" : "Create your first blog post"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBlogs
                        .slice()
                        .reverse()
                        .map((blog) => (
                          <tr key={blog._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-14 w-14 flex-shrink-0 rounded-md overflow-hidden">
                                  <img
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{blog.title}</p>
                                  <p className="text-xs text-gray-500 mt-1">ID: {blog._id.substring(0, 8)}...</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-sm font-medium">
                                {blog.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs overflow-hidden">
                                <p className="text-sm text-gray-600 truncate">
                                  {removeHTMLTags(blog.description).substring(0, 100)}
                                  {blog.description.length > 100 ? '...' : ''}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-700">{blog.postedBy}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(blog)}
                                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(blog._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                  title="Delete"
                                >
                                  <FiTrash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogDashboard;