// Create a new file for Cloudinary utilities

// Configure Cloudinary
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Upload PDF to Cloudinary
export const uploadPDFToCloudinary = async (pdfBlob, documentType, requestId) => {
  try {
    const formData = new FormData();
    formData.append('file', pdfBlob, `${documentType}_${requestId}.pdf`);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `documents/${documentType}`);
    formData.append('public_id', `${documentType}_${requestId}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    
    if (data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id
      };
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Get PDF URL
export const getPDFUrl = (publicId) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}`;
};