const whitelist = [
  'image/png',
]

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {cb(null, "public/");},
  filename: (req, file, cb) => {cb(null, req.body.nombreArchivo);},
});

const subirArchivo = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      req.fileValidationError = 'Error';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true);
  }
});

module.exports = { 
    subirArchivo,
 };
