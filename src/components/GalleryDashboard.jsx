import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { validateImage } from "./imagevalidation";

const GalleryModal = ({ isOpen, onClose, onSubmit, formData, setFormData, uploadImage ,loading}) => {
    if (!isOpen) return null;
  
    return (
      <div
        className="fixed inset-0 bg-black/50 flex justify-center items-center"
        onClick={onClose} // Close modal when clicking outside
      >
        <div
          className="bg-white p-6 rounded shadow-lg w-full sm:w-96"
          onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal
        >
          <h2 className="text-xl font-bold mb-4">{formData._id ? "Update Image" : "Add Image"}</h2>
          
          {/* Preview Image if exists */}
          {formData.imageUrl && (
            <div className="mb-3">
              <img src={formData.imageUrl} alt="Preview" className="w-full h-40 object-cover rounded" />
              <button
              disabled={loading}
                className="mt-2 bg-red-600 text-white px-4 py-1 rounded w-full"
                onClick={() => setFormData({ ...formData, imageUrl: "" })} // Remove image
              >
                Remove Image
              </button>
            </div>
          )}
  
          <input
            type="text"
            placeholder="Posted By"
            className="border p-2 w-full mb-2"
            value={formData.postedBy}
            onChange={(e) => setFormData({ ...formData, postedBy: e.target.value })}
          />
  
          <input 
            type="file" 
            className="border p-2 w-full mb-2" 
            onChange={uploadImage} 
            disabled={formData.imageUrl && formData.imageUrl !== ""} 
          />
  
          <button disabled={loading} onClick={onSubmit} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            {formData._id ? "Update" : "Add"} Image
          </button>
          
          <button onClick={onClose} className="mt-2 bg-gray-600 text-white px-4 py-2 rounded w-full">
            Cancel
          </button>
        </div>
      </div>
    );
  };
  

const GalleryDashboard = () => {
  const [gallery, setGallery] = useState([]);
  const [formData, setFormData] = useState({ postedBy: "", imageUrl: "" });
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
    if (!formData.postedBy || !formData.imageUrl) {
      Swal.fire("Warning", "Both Posted By and Image are required!", "warning");
      return;
    }
  
    try {
      if (formData._id) {
        await axios.put(`${api}/gallery/update/${formData._id}`, formData);
        Swal.fire("Success", "Image updated successfully!", "success");
      } else {
        // Add new image
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
    <div className="p-6">
      <h1 className="text-3xl font-bold ">Gallery Dashboard</h1>
      <div className="text-right">
      <button onClick={() => setShowModal(true)} className="mb-4  bg-blue-600 text-white px-4 py-2 rounded">
        Add New Image
      </button>
      </div>
      <div className="grid bg-gray-100 p-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {gallery?.length == 0 && (<div className="text-red-500 text-2xl text-center">No Data Yet!</div>)}
        {gallery.map((item) => (
          <div key={item._id} className="bg-white p-4 shadow rounded relative">
            <img src={item.imageUrl} alt="Gallery" className="w-full h-52 object-cover rounded" />
            <p className="text-sm mt-2">Posted by: <strong>{item.postedBy}</strong></p>
            <button onClick={() => handleUpdate(item)} className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-4 py-2 rounded">
              Update
            </button>

            <button onClick={() => handleDelete(item._id)} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-4 py-2 rounded">
              Delete
            </button>
          </div>
        ))}
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
  );
};

export default GalleryDashboard;
