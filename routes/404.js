const router = require("express").Router();

router.get("/404", (req, res) => {
    res.render("pages/404")
})

// UNDER CONSTRUCTION

module.exports = router