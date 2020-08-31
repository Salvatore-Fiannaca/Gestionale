const multer = require('multer')

const storage = multer.diskStorage({
    destination: 'upload',
    filename: function(req, file, callback) {
        
        const removeEmptySpace = (str) => {
            let firstPass = str.replace(' ', '-')
            let secondPass = firstPass.replace(' ', '-')
            let thirdPass = secondPass.replace(' ', '-')
            let fourthPass = thirdPass.replace(' ', '-')
            return fourthPass
        }
        const nameFile = removeEmptySpace(file.originalname)
        const parts = nameFile.split(".")
        callback(null, `${parts[0]}-${Date.now()}.${parts[1]}`)
    }
})

const upload = multer({
    storage: storage,
    fileFilter(req, file, callback) {
        if (file.originalname.match(/\.(doc|docx)$/)) {
            //return callback(new Error ('Please upload a Word document'))
        }
        if (file.originalname.match(/\.(pdf|jpg|jpeg|png)$/)) {
            //return callback(new Error ('Please upload a Word document'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 100000000 //byte === 100mb
    }
}).array('files', 12)

module.exports = upload