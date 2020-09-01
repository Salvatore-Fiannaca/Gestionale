const express = require("express");
const router = new express.Router();

router.get("/send-email", (req, res) => {
  res.send("");
});

module.exports = router;
