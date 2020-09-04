const express = require("express");
const router = new express.Router();
const auth = require("../config/auth");
const upload = require("../config/multer");
const connection = require("../config/database");
const { Upload } = connection.models;
const fs = require("fs");
const { ObjectID } = require("mongodb");

/**
 * -------------- POST ROUTES ----------------
 */

router.post("/upload_:code", auth, upload, async (req, res) => {
  const client = req.params.code;
  // CHECK FILE
  const files = req.files;

  files.forEach((file) => {
    const path = file.path;
    try {
      const newFile = new Upload({
        client: client,
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

  res.redirect("/clients");
});

router.post("/file_:id", async (req, res) => {
  try {
    const localfile = await Upload.findOneAndDelete({
      _id: ObjectID(req.params.id),
      owner: req.user._id,
    });
    const path = process.env.INIT_CWD + "/" + localfile.path;

    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
  res.redirect(req.header("Referer") || "/");
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/upload_:code", auth, upload, async (req, res) => {
  const client = req.params.code;
  res.render("pages/upload-client", { code: client });
});

router.get("/show-upload_:code", auth, async (req, res) => {
  try {
    const clientList = await Upload.find({
      client: req.params.code,
      owner: req.user._id,
    });
    res.render("pages/showUpload", {
      clientList: clientList,
      code: req.params.code,
    });
  } catch (e) {
    console.log(e);
    res.send("User not found");
  }
});

router.get("/file_:id", async (req, res) => {
  const dbFile = await Upload.find({
    _id: ObjectID(req.params.id),
    owner: req.user._id,
  });
  const path = process.env.INIT_CWD;

  const file = path + "/" + dbFile[0].path;
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
});

module.exports = router;
