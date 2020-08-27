const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.render('pages/login', {
            msg: true, 
            text: `Devi prima effettuare il login`
        })
    }
}

module.exports = auth