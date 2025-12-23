const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

// Delete image from Cloudinary
module.exports.deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<format>
    // or: https://res.cloudinary.com/<cloud_name>/image/upload/<public_id>.<format>
    const parts = imageUrl.split('/upload/');
    if (parts.length < 2) return;
    
    // Get everything after '/upload/' and remove the file extension
    let publicIdWithExt = parts[1];
    
    // Remove version if exists (v1234567890/)
    publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, '');
    
    // Remove file extension
    const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
    
    if (!publicId) return;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return null;
  }
};