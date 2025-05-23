export const validateImage = (file) => {
    if (!file) return { valid: false, message: "No file selected!" };
  
    // Allowed formats
    const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    
    if (!allowedFormats.includes(file.type)) {
      return { valid: false, message: "Only JPG, JPEG, PNG, and WEBP formats are allowed!" };
    }
  
    // File size limit (1MB = 1024 * 1024 bytes)
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, message: "File size must be under 1MB!" };
    }
  
    return { valid: true};
  };
  