const router = require("express").Router();


// GET ROUTES

// ADD NEW LINK
router.get("/new-link", (req, res) => {
  res.render("pages/new-link", {redMsg: false, greenMsg: false});
});

// SHOW ALL LINKS
router.get("/links", (req, res) => {
    res.render("pages/show-links");
  });

module.exports = router;