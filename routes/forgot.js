const router = require("express").Router();

router.get("/forgot", (req, res) => {
  res.render("pages/forgot", {redMsg: false});
});

module.exports = router;
