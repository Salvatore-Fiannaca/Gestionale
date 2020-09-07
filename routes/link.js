const express = require("express");
const router = new express.Router();
const auth = require("../config/auth");
const connection = require("../config/database");
const { User } = connection.models;
const { ObjectID } = require("mongodb");


// POST ROUTES



// GET ROUTES

// ADD NEW LINK
router.get("/new-link", auth, async (req, res) => {
  res.redirect("/404")
  //const links = await User.findOne({ _id: ObjectID(req.user._id) });
  //res.render("pages/new-link");
});

// SHOW ALL LINKS
router.get("/links", auth, async (req, res) => {
    const links = await User.findOne({ _id: ObjectID(req.user._id) });
    res.render("pages/show-links", { links: links.links });
  });

module.exports = router;