const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public/upload/"));
  },
  filename: (req, file, cb) => {
    if (path.extname(file.originalname)) {
      cb(null, Date.now() + path.extname(file.originalname));
    } else {
      cb(null, Date.now() + "." + file.mimetype.split("/")[1]);
    }
  },
});
// if need filter
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
//   }
// };

// DEFINING UPLOAD FRAME
const upload = multer({ storage: storage });

// EXPORT UPLOAD FRAME
module.exports = upload;
