const router = require("express").Router();

/**
 * -------------- GET ROUTES ----------------
 */
router.get("/", (req, res) => {
  res.render("pages/index");
});

router.get("/login", (req, res) => {
    res.redirect("/");
});

router.get("/register", (req, res) => {
  res.render("pages/register", {
    redMsg: false,
    greenMsg: false,
  });
});

router.get("/logout",  (req, res) => {
  res.redirect("/login");
});

router.get("/edit-user", (req, res) => {
  res.render("pages/edit-user")
});

router.get("/support", (req, res) => {
  res.render("pages/support");
});

router.get("/404", (req, res) => {
  res.render("pages/404")
})


module.exports = router;

