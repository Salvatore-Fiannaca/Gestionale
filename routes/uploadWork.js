const router = require("express").Router();

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/work-upload_:code", (req, res) => {
    res.render("pages/upload-work");
});

router.get("/work-show-upload_:code", (req, res) => {
  res.render("pages/show-work-upload", {
  });
});
/*
router.get("/work-file_:id", (req, res) => {
  fs.access(file, fs.constants.F_OK, (err) => {
    console.log(`${file} ${err ? "does not exist" : "exists"}`);
  });
  fs.readFile(file, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-type": "text/html" });
    } else {
      res.writeHead(200, { "Content-type": dbFile[0].mimetype });
      res.end(content);
    }
  });
});
*/
module.exports = router;
