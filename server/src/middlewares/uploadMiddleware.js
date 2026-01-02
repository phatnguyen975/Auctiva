import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for processing

const fileFilter = (req, file, cb) => {
  // Accept images only
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: fileFilter,
});

// For payment submission (1 file: paymentProof)
export const uploadPaymentProof = upload.single("paymentProof");

// For shipping confirmation (1 file: shippingReceipt)
export const uploadShippingReceipt = upload.single("shippingReceipt");
