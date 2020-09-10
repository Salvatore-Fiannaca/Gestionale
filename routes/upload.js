const router = require("express").Router();
const auth = require("../config/auth");
const upload = require("../config/multer");
const connection = require("../config/database");
const { Upload } = connection.models;
const fs = require("fs");
const { ObjectID } = require("mongodb");
const { CodePatt, MongoPatt } = require("../utils/isValidate");
const  limitUp  = require("../config/demo")

/**
 * -------------- POST ROUTES ----------------
 */
// ADD 
router.post("/upload_:code", auth, limitUp, upload, async (req, res) => {
  const code = req.params.code;
  // VALIDATE INPUT 
  if ( CodePatt(code) ) {
    const file = req.file;
      try {
        const newFile = new Upload({
          client: code,
          fieldname: file.fieldname,
          originalname: file.originalname,
          mimetype: file.mimetype,
          destination: file.destination,
          filename: file.filename,
          path: file.path,
          size: file.size,
          owner: req.user._id,
        });
        newFile.save();
      } catch (e) {
        console.log(e);
      }
      res.redirect("/clients");
    } else {
      res.redirect("/404")
    }
});

// DELETE 
router.post("/file_:id", auth, async (req, res) => {
  const id = req.params.id
  if (MongoPatt(id)) {
    try {
      const localfile = await Upload.findOneAndDelete({
        _id: ObjectID(id),
        owner: req.user._id,
        })
        if (localfile) {
          const env = process.env.PWD || process.env.INIT_CWD
          const path = env + "/" + localfile.path;
      
          fs.unlink(path, (err) => {
            if (err) {
              console.log(err);
            }
          });
        } 
    } catch (err) {
      console.log(err)
    }
    
    res.redirect(req.header("Referer") || "/");
  } else {
    res.redirect("/404");
  }
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/upload_:code", auth, upload, async (req, res) => {
  const code = req.params.code;
  if (CodePatt(code)) {
    res.render("pages/upload-client", { code: code });
  } else {
    res.redirect("/404")
  }
});
router.get("/show-upload_:code", auth, async (req, res) => {
  const code = req.params.code;
  if (CodePatt(code)) {
    try {
      const clientList = await Upload.find({
        client: code,
        owner: req.user._id,
      })
      if (clientList) {
        res.render("pages/showUpload", {
          clientList: clientList,
          code: code,
        });
      } else {
        res.redirect(req.header("Referer") || "/")
      }
    } catch (err) {
      console.log(err)
      res.redirect("/404")
    }
  } else {
    res.redirect("/404")
  }
})

router.get("/file_:id", auth, async (req, res) => {
  const id = req.params.id
  if (MongoPatt(id)) {
    try {
      const dbFile = await Upload.find({
        _id: ObjectID(id),
        owner: req.user._id,
      });
      const env = process.env.PWD || process.env.INIT_CWD
      const file = env + "/" + dbFile[0].path;
      fs.access(file, fs.constants.F_OK, (err) => { console.log(err); });
      fs.readFile(file, (err, content) => {
        if (err) {
          res.redirect(req.header("Referer") || "/")
        } else {
          res.writeHead(200, { "Content-type": dbFile[0].mimetype });
          res.end(content);
        }
      })
    } catch (err) {
      console.log(err);
      res.redirect(req.header("Referer") || "/")
    }
  } else {
    res.redirect("/404")
  }
});

module.exports = router;
