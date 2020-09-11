const router = require("express").Router();

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/upload", (req, res) => {
    res.render("pages/upload-client");
});

router.get("/show-upload", (req, res) => {
  res.render("pages/showUpload")
});

/*
router.get("/file_:id", (req, res) => {
  fs.access(file, fs.constants.F_OK, (err) => { console.log(err); });
  fs.readFile(file, (err, content) => {
    if (err) {
      res.redirect(req.header("Referer") || "/")
    } else {
      res.writeHead(200, { "Content-type": dbFile[0].mimetype });
      res.end(content);
    }
  })
});
*/
module.exports = router;
