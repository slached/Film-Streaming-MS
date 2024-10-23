// this multer does not use disk storage
// this can be modified if I want to save multipart/form-data data in my disk
const multer = require("multer");
const storage = multer.memoryStorage();
module.exports = multer({ storage: storage });
