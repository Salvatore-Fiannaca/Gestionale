const router = require("express").Router();
const auth = require("../config/auth");
const upload = require("../config/multer");
const connection = require("../config/database");
const { UploadWork } = connection.models;
const fs = require("fs");
const { ObjectID } = require("mongodb");
const { CodePatt, MongoPatt } = require("../utils/isValidate");

// CSRF PROTECTION
const csrf = require("csurf")
const csrfProtection = csrf({cookie: true})
const parseForm = express.urlencoded(({extended: false}))

/**
 * -------------- POST ROUTES ----------------
 */

// ADD NEW
router.post("/work-upload_:code", auth, upload, async (req, res) => {
  const code = req.params.code
  const files = req.files;
  if (CodePatt(code)) {  
    if (files) {
      files.forEach((file) => {
        const path = file.path;
        try {
          const newFile = new UploadWork({
            client: code,
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            destination: file.destination,
            filename: file.filename,
            path: path,
            size: file.size,
            owner: req.user._id,
          });
          newFile.save();
        } catch (e) {
          console.log(e);
        }
      });
    }
    res.redirect('/work-show-upload_' + code);;
  } else {
    req.redirect("/404")
  }
});

//          DELETE WORK UPLOAD
router.post("/work-file_:id",  auth, async (req, res) => {
  const id = req.params.id
  if (MongoPatt(id)) {
    const localfile = await UploadWork.findOneAndDelete({
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
    res.redirect(req.header("Referer") || "/");
  }else {
    res.redirect("/404")
  }
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/work-upload_:code", auth, upload, async (req, res) => {
  const code = req.params.code
  if (CodePatt(code)) {
    res.render("pages/upload-work", { 
      code: code,
      redMsg: false 
    });
  } else {
    res.redirect("/404")
  }
});

router.get("/work-show-upload_:code", auth, async (req, res) => {
  const code = req.params.code
  if (CodePatt(code)) {
    const clientList = await UploadWork.find({
      client: code,
      owner: req.user._id,
    });
    if (clientList) {
      res.render("pages/show-work-upload", {
        clientList: clientList,
        code: code,
      });
    } else {
      res.redirect(req.header("Referer") || "/");
    }
  } else {
    res.redirect("/404")
  }
});

router.get("/work-file_:id",  auth, async (req, res) => {
  const id = req.params.id 
  if (MongoPatt(id)) {
    const dbFile = await UploadWork.find({
      _id: ObjectID(req.params.id),
      owner: req.user._id,
    });
    const env = process.env.PWD || process.env.INIT_CWD
    if (dbFile) {
      const file = env + "/" + dbFile[0].path;
      fs.access(file, fs.constants.F_OK, (err) => {
        console.log(`${file} ${err ? "does not exist" : "exists"}`);
      });
      fs.readFile(file, (err, content) => {
        if (err) {
          res.writeHead(404, { "Content-type": "text/html" });
        } else {
          res.writeHead(200, { "Content-type": dbFile[0].mimetype });
          res.end(content);
        }
      });
    } else {
      res.redirect(req.header("Referer") || "/");
    }
  } else {
    res.redirect("/404")
  }
});

module.exports = router;
