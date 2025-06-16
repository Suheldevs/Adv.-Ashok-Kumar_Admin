import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { validateImage } from "./imagevalidation";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { FiPlus } from "react-icons/fi";

const GalleryModal = ({ isOpen, onClose, onSubmit, formData, setFormData, uploadImage, loading }) => {
    if (!isOpen) return null;
  
    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-md shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#ebb661] to-[#ebb661] text-white p-6 rounded-t-2xl">
            <h2 className="text-2xl font-bold">
              {formData._id ? "Update Image" : "Add New Image"}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Preview Image */}
            {formData.imageUrl && (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl border-2 border-gray-200">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <button
                  disabled={loading}
                  className="mt-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg w-full font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setFormData({ ...formData, imageUrl: "" })}
                >
                  Remove Image
                </button>
              </div>
            )}
  
            {/* Form Fields */}
            <div className="space-y-4">
              <div className='hidden'>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Posted By
                </label>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ebb661] focus:ring-2 focus:ring-amber-200 transition-all duration-300 outline-none"
                  value={formData.postedBy}
                  onChange={(e) => setFormData({ ...formData, postedBy: e.target.value })}
                />
              </div>
  
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Image
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl focus:border-[#ebb661] focus:ring-2 focus:ring-amber-200 transition-all duration-300 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed" 
                    onChange={uploadImage} 
                    disabled={formData.imageUrl && formData.imageUrl !== ""} 
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 pt-4">
              <button 
                disabled={loading} 
                onClick={onSubmit} 
                className={`${loading ? "cursor-not-allowed opacity-75" : "cursor-pointer hover:shadow-lg"} bg-gradient-to-r from-[#ebb661] to-[#ebb661] hover:from-amber-700 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center space-x-2`}
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                <span>
                  {loading ? 'Uploading...' : formData._id ? "Update Image" : "Add Image"}
                </span>
              </button>
              
              <button 
                onClick={onClose} 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02]"
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

const GalleryDashboard = () => {
  const [gallery, setGallery] = useState([]);
  const [formData, setFormData] = useState({ postedBy: "Redt Judge Ashok Kumar", imageUrl: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${api}/gallery/getall`);
      setGallery(response.data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validation = validateImage(file);
    if (!validation.valid) {
      Swal.fire("Error", validation.message, "error");
      return;
    }
    if (!file.type.startsWith("image/")) {
      Swal.fire("Error", "Please select a valid image file!", "error");
      return;
    }

    setLoading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "ashok_kumar");
    uploadData.append("folder", "ashok_kumar/gallery");

    try {
      setLoading(true)
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/diz0v7rws/image/upload`,
        uploadData
      );
      setFormData((prev) => ({
        ...prev,
        imageUrl: response.data.secure_url,
      }));
      Swal.fire("Success", "Image Uploaded Successfully!", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire("Error", "Image Upload Failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.imageUrl) {
      Swal.fire("Warning", "Image is required!", "warning");
      return;
    }
  
    try {
      if (formData._id) {
        await axios.put(`${api}/gallery/update/${formData._id}`, formData);
        Swal.fire("Success", "Image updated successfully!", "success");
      } else {
        await axios.post(`${api}/gallery/save`, formData);
        Swal.fire("Success", "Image added to gallery!", "success");
      }
      setFormData({ postedBy: "", imageUrl: "" });
      setSelectedImage(null); 
      setShowModal(false);
      fetchGallery();
    } catch (error) {
      console.error("Error saving/updating image:", error);
      Swal.fire("Error", "Failed to save/update image!", "error");
    }
    fetchGallery();
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${api}/gallery/delete/${id}`);
          Swal.fire("Deleted", "Image removed from gallery!", "success");
          fetchGallery();
        } catch (error) {
          console.error("Error deleting image:", error);
          Swal.fire("Error", "Failed to delete image!", "error");
        }
      }
    });
  };

  const handleUpdate = (item) => {
    setFormData({
      postedBy: item.postedBy,
      imageUrl: item.imageUrl,
      _id: item._id, 
    });
    setSelectedImage(item); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setFormData({ postedBy: "", imageUrl: "" });
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-white to-amber-50">

    
    <div className="min-h-screen  ">
      {/* Header Section */}
    <div className="flex justify-between items-center  bg-white border border-gray-100 p-2">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gallery Management</h1>
            {/* <p className="text-gray-600">Total Blogs: {blogs.length}</p> */}
          </div>
          <button
                onClick={() => setShowModal(true)} 
            className="bg-[#ebb661] text-white font-semibold px-4 py-2 rounded hover:bg-[#ebb661] flex items-center gap-2"
          >
            <FiPlus size={24} />
            Add New Images
          </button>
        </div>

      {/* Gallery Grid Section */}
      <div className="max-w-7xl mx-auto  py-8">
        {gallery?.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">📷</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Images Yet!</h3>
            <p className="text-gray-500">Start building your gallery by adding your first image</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gallery.map((item) => (
              <div 
                key={item._id} 
                className="group bg-white rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt="Gallery" 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button 
                      disabled={loading} 
                      onClick={() => handleUpdate(item)} 
                      className="bg-white/90 backdrop-blur-sm hover:bg-white text-[#ebb661] px-3 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 text-sm"
                    >
                      <span><Edit2/></span>
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="bg-white/90 backdrop-blur-sm hover:bg-white text-red-600 px-3 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 text-sm"
                    >
                      <span><Trash2/></span>
                    </button>
                  </div>

                  {/* Image Overlay Info */}
                  <div className="absolute  bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Posted by:</span>
                      </p>
                      <p className="font-bold text-sm text-gray-900 truncate">{item.postedBy}</p>
                    </div>
                  </div>
                </div>

               
              </div>
            ))}
          </div>
        )}
      </div>

      <GalleryModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        uploadImage={uploadImage}
        loading={loading}
      />
    </div>
    </div>
  );
};

export default GalleryDashboard;