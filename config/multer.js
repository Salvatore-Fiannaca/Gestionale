const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        const dir = process.env.HOME + '/Desktop/Gestionale/upload/test'
        callback(null, 'upload/file')
    },
    filename: function(req, file, callback) {
        const parts = file.mimetype.split("/");
        callback(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
        //callback(null, file.originalname)
    }
})

const upload = multer({storage: storage}).array('files', 12)

module.exports = upload