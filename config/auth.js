const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.render('pages/login', {msg: true, text: `E' richiesto il login`})
    }
}

module.exports = auth