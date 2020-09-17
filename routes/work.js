const router = require("express").Router();
const express= require("express")
const auth = require("../config/auth");
const connection = require("../config/database");
const { Work, UploadWork, Client } = connection.models;
const { ObjectID } = require("mongodb");
const fs = require("fs");
const { CodePatt, InputPatt, WorkFolderPatt, NumberPatt, CommentPatt, StatusPatt, MongoPatt} = require("../utils/isValidate");

// CSRF PROTECTION
const csrf = require("csurf")
const csrfProtection = csrf({cookie: true})
const parseForm = express.urlencoded(({extended: false}))

/**
 * -------------- POST ROUTES ----------------
 */

// ADD
router.post("/new-work_:code", auth, parseForm, csrfProtection, async (req, res) => {
  const code = req.params.code,
       title = req.body.title,
       folder = req.body.folder, 
       nFolder = req.body.nFolder, 
       comments = req.body.comments,
       wStatus = req.body.status
  
  if (
    CodePatt(code) &
    InputPatt(title) &
    WorkFolderPatt(folder) &
    NumberPatt(nFolder) &
    CommentPatt(comments) &
    StatusPatt(wStatus)
    ){
      const newWork = await new Work({
        client: code,
        "work.title": title,
        "work.folder.title": folder,
        "work.folder.number": nFolder,
        "work.comments": comments,
        "work.status": wStatus,
        owner: req.user._id,
      })
      try {
        await newWork.save();
      } catch (e) {
        console.log(e);
      }

      res.redirect(`/work-upload_${code}`); 
    } else {
      res.redirect(req.header("Referer") || "/") 
    }
})
  
// DELETE WORK + FILE
router.post("/work_:id", parseForm, csrfProtection, async (req, res) => {
  const id = req.params.id
  if (MongoPatt(id)) {
    try {
      const work = await Work.findOneAndDelete({
        _id: ObjectID(id),
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
  }
  res.redirect("/clients");
})
// UPDATE WORK
router.post("/update-work_:code", auth, parseForm, csrfProtection, async (req, res) => {
  const code = req.params.code,
        title = req.body.title,
      folder = req.body.folder,
      nFolder = req.body.nFolder, 
      comments = req.body.comments,
      wStatus = req.body.status
  if (
    CodePatt(code) &
    InputPatt(title) &
    WorkFolderPatt(folder) &
    NumberPatt(nFolder) &
    CommentPatt(comments) &
    StatusPatt(wStatus)
    ) {
      try {
        await Work.findOneAndUpdate(
          { client: code, owner: req.user._id },
          {
            $set: {
              "work.title": title,
              "work.folder.title": folder,
              "work.folder.number": nFolder,
              "work.status": wStatus,
              "work.comments": comments,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }

    }

    res.redirect("/edit-work_" + code);
  
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/_:code", auth, async (req, res) => {
  const code = req.params.code
  if (CodePatt(code)) {
    try {
      const work = await Work.find({
        owner: req.user._id,
        client: code,
      });
      if (!work) {
        res.redirect("/clients");
      } else {
        res.render("pages/show-works", {
          clientList: work,
          code: code,
        });
      }
    } catch (e) {
      console.log(e);
      res.redirect("/404");
    }
  } else {
    res.redirect("/404");
  }
  
});

router.get("/edit-work_:code", auth, csrfProtection, async (req, res) => {
  const code = req.params.code
  if (CodePatt(code)) {
    try {
      const clientList = await Work.find({
        client: code,
        owner: req.user._id,
      });
      if (clientList[0].client) {
        res.render("pages/edit-work", { 
          clientList: clientList,
          csrfToken: req.csrfToken() 
        });
      } else {
        res.redirect("/404")      
      }
    } catch (err) {
    console.log(err);
    res.redirect("/404")      
    } 
  }else {
    res.redirect("/404")      
  }
})

router.get("/new-work_:code", auth, csrfProtection, async (req, res) => {
  const code = req.params.code
  if (CodePatt(code)) {
    try {
      const clientList = await Client.find({
        "profile.fiscalCode": code,
        owner: req.user._id,
      });
      // IF EXIST
      if (clientList[0].profile) {
        res.render("pages/new-work", { 
          fiscalCode: clientList[0].profile.fiscalCode,
          csrfToken: req.csrfToken() 
        })
      } else {
        res.redirect("/404")      
      }
    } catch (e) {
      console.log(e);
      res.redirect("/404")      
    }
  } else {
    res.redirect("404")
  }
});

module.exports = router;
