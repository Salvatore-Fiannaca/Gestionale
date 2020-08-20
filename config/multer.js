const multer = require('multer')

const storage = multer.diskStorage({
    destination: 'upload/client',
    filename: function(req, file, callback) {
        //const parts = file.mimetype.split("/");
        //callback(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
        const removeEmpySpace = (str) => {
            // pulisci
            let firstPass = str.replace(' ', '')
            let secondPass = firstPass.replace(' ', '')
            let thirdPass = secondPass.replace(' ', '')
            let fourthPass = thirdPass.replace(' ', '')
            // ritorna stringa pulita
            return fourthPass
        }

        callback(null, removeEmpySpace(file.originalname))
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
        fileSize: 2048 * 2048
    }

}).array('files', 12)

module.exports = upload