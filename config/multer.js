const multer = require("multer");

const storage = multer.diskStorage({
  destination: "upload",
  filename: function (req, file, callback) {
    const nameFile = file.originalname.replace(" ", "-");
    const parts = nameFile.split(".");
    if (!/^[A-Za-z0-9-_]+$/.test(parts[0])) {
      return callback(new Error ('Invalid File Name'))
    }
    callback(null, `${parts[0]}-${Date.now()}.${parts[1]}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter(req, file, callback) { 
    console.log(file);
   // if (file.filename.split('.').pop() !== '.pdf') {
     // return callback(new Error('Only pdfs are allowed'))
    //}
    callback(null, true);
  },
  limits: {
    fileSize: 100000000, //byte === 100mb
  },
}).array("files", 12);

module.exports = upload;
