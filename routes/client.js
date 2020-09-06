const router = require("express").Router();
const connection = require("../config/database");
const { Client, Work, Upload, UploadWork, Count } = connection.models;
const auth = require("../config/auth");
const fs = require("fs");
const { MongoPatt, ZipPatt, MailPatt, CodePatt, InputPatt, StatePatt, NumberPatt } = require('../utils/isValidate')

/**
 * -------------- POST ROUTES ----------------
 */

//      ADD NEW CLIENT
router.post("/client", auth, async (req, res) => {
  const code = req.body.fiscalCode, 
   firstName = req.body.firstName, 
   lastName = req.body.lastName, 
   address = req.body.address, 
   city = req.body.city,
   state = req.body.state,
   zipCode = req.body.zipCode,
   email = req.body.email,
   phone = req.body.phone

  if (
    CodePatt(code) &
    InputPatt(firstName) &
    InputPatt(lastName) &
    InputPatt(address) &
    InputPatt(city) &
    StatePatt(state) &
    ZipPatt(zipCode) &
    MailPatt(email) &
    NumberPatt(phone) 
  ) 
  {
    const check = await Client.find({
      owner: req.user._id,
      "profile.fiscalCode": code,
    });

    // IF NOT EXIST
    if (!check[0]) {
      const counter = await Count.findOneAndUpdate(
        { owner: req.user._id },
        { $inc: { count: +1 } }
      );
      try {
        const newClient = await new Client({
          "profile.firstName": firstName,
          "profile.lastName": lastName,
          "profile.fiscalCode": code,
          "address.street": address,
          "address.city": city,
          "address.zipCode": state,
          "address.zipCode": zipCode,
          "contacts.email": email,
          "contacts.phone": phone,
          owner: req.user._id,
          count: counter.count,
        });
        await newClient.save();
      } catch (e) {
        console.log(e);
      }
      res.redirect(`/upload_${code}`);
    } else {
      res.render(`pages/new-client`, {
        redMsg: true,
        text: "Codice Fiscale già registrato",
      });
    }
  } else {
    res.render('pages/new-client', {
      redMsg: true,
      text: 'Dati inseriti non validi'
    })
  }
 

 
});

//      UPDATE CLIENT
router.post("/update_:id", auth, async (req, res) => {
  const id = req.params.id,
  firstName = req.body.firstName, 
   lastName = req.body.lastName, 
   address = req.body.address, 
   city = req.body.city,
   state = req.body.state,
   zipCode = req.body.zipCode,
   email = req.body.email,
   phone = req.body.phone,
   archive = req.body.archive
  if (
    MongoPatt(id) %
    InputPatt(firstName) &
    InputPatt(lastName) &
    InputPatt(address) &
    InputPatt(city) &
    StatePatt(state) &
    ZipPatt(zipCode) &
    MailPatt(email) &
    NumberPatt(phone) &
    archive === false | true 
    ) {
    try {
      await Client.findOneAndUpdate(
        { _id: id, owner: req.user._id },
        {
          $set: {
            "profile.firstName": firstName,
            "profile.lastName": lastName,
            "address.street": address,
            "address.city": city,
            "address.state": state,
            "address.zipCode": zipCode,
            "contacts.email": email,
            "contacts.phone": phone,
            archive: archive,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  res.redirect("/clients") 
 
});

// DELETE CLIENT
router.post("/client_:code", auth, async (req, res) => {
  owner = req.session.passport.user;
  const code = req.params.code
  
  if (CodePatt(code)) {
    try {
      await Client.findOneAndDelete({
        "profile.fiscalCode": code,
        owner: owner,
      });
      await Work.deleteMany({ client: code, owner: owner });
      const findWork = await UploadWork.find({
        client: code,
        owner: owner,
      });
      const findUpload = await Upload.find({
        client: code,
        owner: owner,
      });

      // DELETE UPLOAD CLIENT
      await Upload.deleteMany({ client: code, owner: owner });
      findUpload.forEach((file) => {
        let path = file.path;
        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      // DELETE UPLOAD WORK CLIENT
      await UploadWork.deleteMany({ client: code, owner: owner });
      findWork.forEach((file) => {
        let path = file.path;
        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
  } catch (err) {
    console.log(err);
  }
  }
  res.redirect("/clients");
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/client", auth, (req, res) => {
  res.render("pages/new-client", { redMsg: false });
});

router.get("/edit-client_:id", auth, async (req, res) => {
  owner = req.session.passport.user;
  const client = await Client.find({ owner: owner, _id: req.params.id });
  res.render("pages/edit-client", { clientList: client, n: 1 });
});

router.get("/clients", auth, async (req, res) => {
  owner = req.session.passport.user;
  const filter = await Client.find({ owner: owner, archive: false });
  const counter = await Count.find({ owner: req.user._id });
  res.render("pages/show-clients", {
    clientList: filter,
    count: counter[0].count,
  });
});

router.get("/old-clients", auth, async (req, res) => {
  owner = req.session.passport.user;
  const filter = await Client.find({ owner: owner, archive: true });
  res.render("pages/show-old-clients", { clientList: filter, n: 1 });
});

module.exports = router;
