const multer = require('multer')

const storage = multer.diskStorage({
    destination: 'upload/client',
    filename: function(req, file, callback) {
        //const parts = file.mimetype.split("/");
        //callback(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
        callback(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    fileFilter(req, file, callback) {
        if (file.originalname.match(/\.(doc|docx)$/)) {
            //return callback(new Error ('Please upload a Word document'))
            console.log("You are upload a Word document");
        }
        if (file.originalname.match(/\.(pdf|jpg|jpeg|png)$/)) {
            //return callback(new Error ('Please upload a Word document'))
            console.log("You are upload an Image");

        }

        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024
    }

}).array('files', 12)

module.exports = upload