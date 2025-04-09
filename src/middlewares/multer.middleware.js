import multer from "multer";

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
      // Rename the file
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

export const upload = multer({
    storage,
});