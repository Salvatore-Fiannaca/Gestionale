// DEMO VERSION
const connection = require("../config/database");
const { Upload } = connection.models;
const { ObjectID } = require("mongodb");

const limitUp = async ( req, res, next ) => {
    const fileOnDisk =  await Upload.find({ owner: ObjectID(req.user._id) })
    if (fileOnDisk.length < 2  | !fileOnDisk) { 
        next()
    } else {
        res.redirect("/support");
    }   

} 
module.exports = limitUp