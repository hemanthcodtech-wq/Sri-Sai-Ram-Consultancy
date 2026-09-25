const cloudinary = require('cloudinary').v2;

// Configure Cloudinary if environment variables are provided
const isCloudinaryConfigured = !!(
  (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME) &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) || !!process.env.CLOUDINARY_URL;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Uploads a buffer to Cloudinary or falls back to data URI if Cloudinary is not configured
 * @param {Buffer} fileBuffer
 * @param {String} originalName
 * @param {String} folder
 * @param {String} mimeType
 */
const uploadBuffer = (fileBuffer, originalName = 'document', folder = 'ssrc_employee_docs', mimeType = 'image/jpeg') => {
  return new Promise((resolve, reject) => {
    if (isCloudinaryConfigured) {
      // Cloudinary serves PDFs publicly as image resources in this account;
      // raw PDF delivery returns 401 even when the upload itself succeeds.
      const isPdf = mimeType === 'application/pdf';
      const isImage = mimeType.startsWith('image/') || isPdf;
      const resourceType = isImage ? 'image' : 'raw';
      const safeName = originalName.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const publicId = `${Date.now()}-${safeName.replace(/\.[^/.]+$/, '')}${isImage ? '' : safeName.match(/\.[^/.]+$/)?.[0] || ''}`;
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: publicId,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          const deliveryUrl = isPdf
            ? cloudinary.url(result.public_id, {
              resource_type: 'image',
              type: 'upload',
              secure: true,
              sign_url: true,
              version: result.version,
              format: 'pdf',
            })
            : result.secure_url;
          resolve({
            success: true,
            url: deliveryUrl,
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes,
            resource_type: result.resource_type,
          });
        }
      );
      uploadStream.end(fileBuffer);
    } else {
      // Fallback to data URI when Cloudinary credentials are not in .env
      const base64 = fileBuffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64}`;
      resolve({
        success: true,
        url: dataUri,
        fallback: true,
        message: 'Saved as base64 data URI. To use live Cloudinary, add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to server/.env',
      });
    }
  });
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadBuffer,
};
