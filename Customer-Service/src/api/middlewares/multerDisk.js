const { v4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Create storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../../../Files/movies");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = v4();
    cb(null, file.fieldname + "-" + uniqueSuffix + `.${file.mimetype.split("/")[1]}`);
  },
});
module.exports = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 },
});
