// DEMO VERSION
const connection = require("../config/database");
const { Upload } = connection.models;
const { ObjectID } = require("mongodb");

const limitUp = ( req, res, next ) => {
    const fileOnDisk =  Upload.find({ owner: ObjectID(req.user._id) })
    console.log(!fileOnDisk);
    if (fileOnDisk.length < 2  | fileOnDisk === undefined) { 
        console.log("pass");
        next()
    } else {
        res.redirect("/support");
        }   

      } 
module.exports = limitUp