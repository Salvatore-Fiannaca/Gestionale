const express = require("express");
const router = new express.Router();
const auth = require("../config/auth");
const connection = require("../config/database");
const { Work, UploadWork } = connection.models;
const { ObjectID } = require("mongodb");
const fs = require("fs");
const { log } = require("console");

/**
 * -------------- POST ROUTES ----------------
 */

// ADD
router.post("/new-work_:code", auth, async (req, res) => {
  const newWork = await new Work({
    client: req.params.code,
    "work.title": req.body.title,
    "work.folder.title": req.body.folder,
    "work.folder.number": req.body.nFolder,
    "work.comments": req.body.comments,
    "work.file.title": req.body.titleFile,
    "work.file.link": req.body.linkFile,
    "work.status": req.body.status,
    completed: req.body.status,
    owner: req.user._id,
  });
  try {
    await newWork.save();
  } catch (e) {
    return res.redirect(`/_${req.params.code}`), console.log(e);
  }
  res.redirect(`/work-upload_${req.params.code}`);
});
// DELETE WORK + FILE
router.post("/work_:id", async (req, res) => {
  try {
    const work = await Work.findOneAndDelete({
      _id: ObjectID(req.params.id),
      owner: req.user._id,
    });
    const find = await UploadWork.find({
      client: work.client,
      owner: req.user._id,
    });
    await UploadWork.deleteMany({ client: work.client, owner: req.user._id });

    find.forEach((file) => {
      let path = file.path;
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
          res.redirect("/clients");
        }
      });
    });
  } catch (err) {
    console.log(err);
  }

  res.redirect("/clients");
});
// UPDATE
router.post("/update-work_:client", auth, async (req, res) => {
  const client = req.params.client;
  try {
    await Work.findOneAndUpdate(
      { client: client, owner: req.user._id },
      {
        $set: {
          "work.title": req.body.title,
          "work.folder.title": req.body.folder,
          "work.folder.number": req.body.nFolder,
          "work.status": req.body.status,
          "work.comments": req.body.comments,
        },
      }
    );

    res.redirect(req.header("Referer") || "/");
  } catch (err) {
    console.log(err);
    res.redirect(req.header("Referer") || "/");
  }
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/_:code", auth, async (req, res) => {
  try {
    const clientList = await Work.find({
      owner: req.user._id,
      client: req.params.code,
    });
    res.render("pages/show-works", {
      clientList: clientList,
      code: req.params.code,
    });
  } catch (e) {
    res.redirect("/clients");
  }
});

router.get("/edit-work_:code", auth, async (req, res) => {
  const clientList = await Work.find({
    client: req.params.code,
    owner: req.user._id,
  });
  res.render("pages/edit-work", { clientList: clientList });
});

router.get("/new-work_:code", auth, async (req, res) => {
  res.render("pages/new-work", { fiscalCode: req.params.code });
});

module.exports = router;
