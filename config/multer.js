const multer = require("multer");

const storage = multer.diskStorage({
  destination: "upload",
  filename: function (req, file, callback) {
    const nameFile = file.originalname.replace(" ", "-");
    const parts = nameFile.split(".");
    if (!/^[A-Za-z0-9-_]+$/.test(parts[0])) {
      return callback(null, false)
    } else {
      callback(null, `${parts[0]}-${Date.now()}.${parts[1]}`);
    }
  },
});

const upload = multer({
  storage: storage,
  fileFilter(req, file, callback) { 
    if (!file.originalname.match(/\.(doc|docs|pdf|jpg|zip|rar|svg|dwg|png|jpeg|dat|dxf|txt|pdfa|tiff|sdxf|docx|odt|xls|tif|csv)$/)) {
      callback( new Error("File Non Supportato"))
      //return callback(null, false)
    } else {
      callback(null, true);
    }
  },
  limits: {
    fileSize: 100000000, //byte === 100mb
  },
}).array("files", 12);

module.exports = upload;
