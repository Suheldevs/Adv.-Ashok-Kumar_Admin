import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { validateImage } from "./imagevalidation";

const ProjectModal = ({ projectData, onClose }) => {
  const api = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    title: "",
    mainImageUrl: "",
    description: "",
    category: "",
    location: "",
    otherImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingOther, setUploadingOther] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (projectData) {
      setFormData({
        title: projectData.title || "",
        mainImageUrl: projectData.mainImageUrl || "",
        description: projectData.description || "",
        category: projectData.category || "",
        location: projectData.location || "",
        otherImages: projectData.otherImages || [],
      });
    }
  }, [projectData]);

  const uploadImage = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (field === "mainImageUrl") {
      setUploadingMain(true);
    } else {
      setUploadingOther(true);
    }

    const validation = validateImage(file);
    if (!validation.valid) {
      Swal.fire("Error", validation.message, "error");
      setUploadingMain(false);
      setUploadingOther(false);
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "ssks-architect");
    uploadData.append("folder", "ssks-architect/project");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/diz0v7rws/image/upload`,
        uploadData
      );
      const imageUrl = response.data.secure_url;

      if (field === "mainImageUrl") {
        setFormData((prev) => ({ ...prev, mainImageUrl: imageUrl }));
      } else {
        setFormData((prev) => ({
          ...prev,
          otherImages: [...prev.otherImages, imageUrl],
        }));
      }
      Swal.fire("Success", "Image Uploaded Successfully!", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire("Error", "Image Upload Failed!", "error");
    } finally {
      setUploadingMain(false);
      setUploadingOther(false);
    }
  };

  const removeOtherImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      otherImages: prev.otherImages.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.mainImageUrl || !formData.description || !formData.category) {
      Swal.fire("Warning", "All fields are required!", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const response = projectData
        ? await axios.put(`${api}/project/update/${projectData._id}`, formData,{withCredentials:true})
        : await axios.post(`${api}/project/save`, formData,{withCredentials:true});

      Swal.fire("Success", response.data.message, "success");
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      Swal.fire("Error", "Failed to save project!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{projectData ? "Update" : "Add"} Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  placeholder="Enter project title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  placeholder="Enter project location"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Institutional">Institutional</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Public">Public</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  placeholder="Enter project description..."
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-3">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Main Image</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingMain ? (
                        <div className="animate-pulse text-blue-500">Uploading...</div>
                      ) : formData.mainImageUrl ? (
                        <img src={formData.mainImageUrl} alt="Main" className="h-24 object-contain" />
                      ) : (
                        <>
                          <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload main image</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => uploadImage(e, "mainImageUrl")} 
                      disabled={uploadingMain}
                    />
                  </label>
                </div>
                {formData.mainImageUrl && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors"
                      onClick={() => setFormData((prev) => ({ ...prev, mainImageUrl: "" }))}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Other Images</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingOther ? (
                        <div className="animate-pulse text-blue-500">Uploading...</div>
                      ) : (
                        <>
                          <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload additional images</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => uploadImage(e, "otherImages")} 
                      disabled={uploadingOther}
                    />
                  </label>
                </div>
                
                {formData.otherImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">Gallery Images ({formData.otherImages.length})</p>
                    <div className="grid grid-cols-4 gap-2">
                      {formData.otherImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Other ${idx}`} className="w-full h-16 object-cover rounded-lg border border-gray-200" />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeOtherImage(idx)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <button 
              type="button" 
              className="bg-gray-100 text-gray-700 py-2.5 px-5 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={uploadingMain || uploadingOther || submitting}
              className={`bg-blue-600 text-white py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors flex items-center ${(uploadingMain || uploadingOther || submitting) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `${projectData ? "Update" : "Save"} Project`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;