// DEMO VERSION
const connection = require("../config/database");
const { Upload, UploadWork } = connection.models;
const { ObjectID } = require("mongodb");

const limitUp = async ( req, res, next ) => {
    const upFileForClient =  await Upload.find({ owner: ObjectID(req.user._id) })
    const upFileForWork =  await UploadWork.find({ owner: ObjectID(req.user._id) })
    const demo = 3  // MAX UPLOAD (2 + 2)  
    if (
        ( upFileForClient.length < demo  | !upFileForClient) & 
        ( upFileForWork.length < demo    | !upFileForWork ) 
        ) { 
        next()
    } else {
        res.redirect("/support");
    }   

} 
module.exports = limitUp