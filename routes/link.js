const router = require("express").Router();
const auth = require("../config/auth");
const connection = require("../config/database");
const { User } = connection.models;
const { ObjectID } = require("mongodb");
const { InputPatt, MongoPatt } = require('../utils/isValidate')
const validator = require('validator')

// CSRF PROTECTION
const csrf = require("csurf")
const csrfProtection = csrf({cookie: true})
const parseForm = express.urlencoded(({extended: false}))


// POST ROUTES
// ADD
router.post("/new-link", auth, async (req, res) => {
  const title = req.body.title
  const link = req.body.link
  if (
    (InputPatt(title)) & 
    validator.isURL(link, { protocols: ['http','https','ftp']}) &
    link.length < 200
    ) 
  { 
    try {
      await User.updateOne({ 
        _id: ObjectID(req.user._id) 
      }, {
        $push: {
          links : {
          "title": title,
          "link": link,
          }
        }
      })
      res.render("pages/new-link", {greenMsg: true, redMsg: false, text: 'Inserito correttamente'});
    } catch (err) {
      console.log(err);
      res.redirect("/404")
    }
  } else {
    res.render("pages/new-link", {redMsg: true, greenMsg: false, text: 'Caratteri invalidi, riprova'});
  }
  //res.redirect("/404")
});

// DELETE
router.post("/unlink-:id", auth, async (req, res) => {
  const user = req.user._id
  const idUrl = req.params.id
  if ( MongoPatt(idUrl) ) 
    {
      try {
        await User.updateOne({ 
          _id: ObjectID(user) 
          },{ $pull: {links : {
            _id : idUrl
          }}})
          res.redirect("/links")
      } catch (err) {
        console.log(err)
        res.redirect("/404")
      }
  } else {
    res.redirect("/404")
  } 
})



// GET ROUTES

// ADD NEW LINK
router.get("/new-link", auth, async (req, res) => {
  //res.redirect("/404")
  res.render("pages/new-link", {redMsg: false, greenMsg: false});
});

// SHOW ALL LINKS
router.get("/links", auth, async (req, res) => {
    const links = await User.findOne({ _id: ObjectID(req.user._id) });
    res.render("pages/show-links", { links: links.links });
  });

module.exports = router;