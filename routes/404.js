const express = require("express");
const router = new express.Router();

router.get("/404", (req, res) => {
  res.render("pages/404");
});
router.get("/clients/*", (req, res) => {
  res.render("pages/404");
});
router.get("/edit-client/*", (req, res) => {
  res.render("pages/404");
});
router.get("/forgot/*", (req, res) => {
  res.render("pages/404");
});
router.get("/login/*", (req, res) => {
  res.render("pages/404");
});
router.get("/register/*", (req, res) => {
  res.render("pages/404");
});
router.get("/logout/*", (req, res) => {
  res.render("pages/404");
});
router.get("/forgot/*", (req, res) => {
  res.render("pages/404");
});
router.get("/client/*", (req, res) => {
  res.render("pages/404");
});
router.get("/practice/*", (req, res) => {
  res.render("pages/404");
});
router.get("/_:code/*", (req, res) => {
  res.render("pages/404");
});
router.get("/new-work_:code/*", (req, res) => {
  res.render("pages/404");
});
router.get("/upload_:code/*", (req, res) => {
  res.render("pages/404");
});
router.get("/show-upload_:code/*", (req, res) => {
  res.render("pages/404");
});
router.get("/file_:id/*", (req, res) => {
  res.render("pages/404");
});
router.get("/links/*", (req, res) => {
  res.render("pages/404");
});

module.exports = router;
