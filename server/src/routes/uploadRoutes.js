const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadBuffer } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Multer in-memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // Max 15MB
  },
  fileFilter: (req, file, cb) => {
    // Allow images (JPEG, PNG, WEBP) and documents (PDF, DOCX)
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Please upload a JPG, PNG, or PDF file.`));
    }
  },
});

/**
 * @route   POST /api/upload
 * @desc    Upload single document or photo (image or PDF) to Cloudinary
 * @access  Protected (Admin)
 */
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const folder = req.body.folder || 'ssrc_employee_docs';
    const result = await uploadBuffer(
      req.file.buffer,
      req.file.originalname,
      folder,
      req.file.mimetype
    );

    res.json({
      success: true,
      url: result.url,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      fallback: result.fallback || false,
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'File upload failed' });
  }
});

/**
 * @route   POST /api/upload/employee-documents
 * @desc    Upload multiple employee documents simultaneously
 * @access  Protected (Admin)
 */
router.post(
  '/employee-documents',
  protect,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'aadhaarDoc', maxCount: 1 },
    { name: 'panDoc', maxCount: 1 },
    { name: 'licenseDoc', maxCount: 1 },
    { name: 'experienceDoc', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const uploadedDocs = {};
      const files = req.files || {};

      for (const [field, fileArray] of Object.entries(files)) {
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          const result = await uploadBuffer(
            file.buffer,
            file.originalname,
            `ssrc_employee_docs/${field}`,
            file.mimetype
          );
          uploadedDocs[field] = result.url;
        }
      }

      res.json({
        success: true,
        data: uploadedDocs,
      });
    } catch (error) {
      console.error('Batch documents upload error:', error);
      res.status(500).json({ success: false, message: error.message || 'Document upload failed' });
    }
  }
);

module.exports = router;
