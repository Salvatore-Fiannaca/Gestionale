const multer = require("multer");

const storage = multer.diskStorage({
  destination: "upload",
  filename: function (req, file, callback) {
    const nameFile = file.originalname;
    const parts = nameFile.split(".");
    callback(null, `${parts[0]}-${Date.now()}.${parts[1]}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter(req, file, callback) {
     if (!/^[a-z0-9-]+$/.test(file.originalname)) {
      return callback(new Error ('Invalid File Name'))
    }
    callback(null, true);
  },
  limits: {
    fileSize: 100000000, //byte === 100mb
  },
}).array("files", 12);

module.exports = upload;
