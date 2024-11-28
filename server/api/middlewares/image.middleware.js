const multer = require("multer");
const fs = require("fs");

const destinationPath = "public/users/";
let times = 0;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log("3. Destination Path times", times);
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    // console.log("4. File Name times", times);
    try {
      fs.mkdirSync(destinationPath, { recursive: true });
      const filename = `${Date.now()}-${file.originalname}`;

      // console.log("Filename:", filename);
      cb(null, filename);
    } catch (error) {
      // console.error("Error in product image upload", error);
      cb(new Error("Error occurred"));
    }
  },
});

const limits = {
  fileSize: 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  // console.log("2. File Filter times", ++times);
  const allowedFileTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/svg+xml",
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new multer.MulterError("UNSUPPORTED_FILE_TYPE", "avatar");
    error.message = "Only jpg, png & svg file types are supported";
    cb(error);
  }
};

const upload = multer({ storage, limits, fileFilter }).single("avatar");

const uploadImage = (req, res, next) => {
  times = 0;
  // console.log("1. Upload Product Image");
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        // console.log("Error:", error);
        return res.status(400).json({
          status: "FAILED",
          error: { avatar: "Multer: " + error.message },
        });
      } else {
        return res.status(500).json({
          status: "INTERNAL_SERVER_ERROR",
          message: "SORRY: Something went wrong",
        });
      }
    }

    // console.log("File:", req.file);
    // console.log("Avatar Path:", req.file?.path);
    if (req.file) {
      req.body.avatar = req.file.path;
    }

    next();
  });
};

module.exports = { uploadImage };
