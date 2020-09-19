const router = require("express").Router();

/*
 * -------------- GET ROUTES ----------------
 */

 // NEW CLIENT
router.get("/client", (req, res) => {
  res.render("pages/new-client");
});

router.get("/edit-client",  (req, res) => {
    res.render("pages/edit-client");
});
// SHOW CLIENT
router.get("/clients", (req, res) => {
  res.render("pages/show-clients");
});

router.get("/old-clients", (req, res) => {
  res.render("pages/show-old-clients");
});

module.exports = router;
