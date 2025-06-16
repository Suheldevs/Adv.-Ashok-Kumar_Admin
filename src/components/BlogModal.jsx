import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { validateImage } from "./imagevalidation";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const api = import.meta.env.VITE_API_URL;
const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/diz0v7rws/image/upload";

// Reducer to manage form state
const formReducer = (state, action) => {
  return { ...state, [action.field]: action.value };
};

const BlogModal = ({ blogData, onClose }) => {
  const [formData, dispatch] = useReducer(formReducer, {
    title: "",
    postedBy: "",
    category: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blogData) {
      dispatch({ field: "title", value: blogData.title || "" });
      dispatch({ field: "postedBy", value: blogData.postedBy || "" });
      dispatch({ field: "category", value: blogData.category || "" });
      dispatch({ field: "description", value: blogData.description || "" });
      dispatch({ field: "imageUrl", value: blogData.imageUrl || "" });
    }
  }, [blogData]);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      Swal.fire("Error", validation.message, "error");
      return;
    }

    setLoading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "ashok_kumar");
    uploadData.append("folder", "ashok_kumar/blog");

    try {
      const response = await axios.post(cloudinaryUrl, uploadData);
      if (response.data.secure_url) {
        dispatch({ field: "imageUrl", value: response.data.secure_url });
        Swal.fire("Success", "Image Uploaded Successfully!", "success");
      } else {
        throw new Error("Invalid response from Cloudinary");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire("Error", "Image Upload Failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.postedBy.trim() || !formData.category.trim() || !formData.description.trim() || !formData.imageUrl) {
      Swal.fire("Warning", "All fields are required!", "warning");
      return;
    }

    try {
      const response = blogData
        ? await axios.put(`${api}/blog/update/${blogData._id}`, formData, {withCredentials:true})
        : await axios.post(`${api}/blog/save`, formData, {withCredentials:true});

      Swal.fire("Success", response.data.message, "success");
      onClose();
    } catch (error) {
      console.error("Error saving blog:", error);
      Swal.fire("Error", "Failed to save blog!", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-4xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4 uppercase">
          {blogData ? "Update" : "Add"} Blog
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
                <input
                  type="text"
                  placeholder="Enter Blog Title"
                  value={formData.title}
                  onChange={(e) => dispatch({ field: "title", value: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posted By</label>
                <input
                  type="text"
                  placeholder="Posted By"
                  value={formData.postedBy}
                  onChange={(e) => dispatch({ field: "postedBy", value: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => dispatch({ field: "category", value: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                <input
                  type="file"
                  onChange={uploadImage}
                  disabled={loading}
                  className="w-full p-3 border-2 border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                {loading && <p className="text-[#ebb661] text-sm">Uploading...</p>}
                
                {formData.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Preview</p>
                    <img
                      src={formData.imageUrl}
                      alt="Uploaded"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
              <SunEditor
                setContents={formData.description}
                onChange={(value) => dispatch({ field: "description", value })}
                setOptions={{
                  minHeight: "150px",
                  height: "200px",
                  buttonList: [
                    ["undo", "redo"],
                    ["bold", "underline", "italic", "strike"],
                    ["font", "fontSize", "formatBlock"],
                    ["fontColor", "hiliteColor"],
                    ["align", "list", "lineHeight"],
                    ["table"],
                    ["link"],
                    ["image", "video"],
                    ["codeView"],
                  ],
                  linkProtocol: "",
                  addTagsWhitelist: "a[href]",
                  sanitize: false,
                  defaultTag: "div",
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              className="bg-gray-700 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#ebb661] text-white py-2 px-6 rounded-lg hover:bg-amber-700 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {blogData ? "Update" : "Save"} Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;