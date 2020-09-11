const router = require("express").Router();

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/_:code", (req, res) => {
  res.render("pages/show-works");
});

router.get("/edit-work_:code", (req, res) => {
  res.render("pages/edit-work");
})

router.get("/new-work_:code", (req, res) => {
  res.render("pages/new-work")
});

module.exports = router;
