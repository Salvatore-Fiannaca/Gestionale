const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.render('pages/login', {
            redMsg: true, 
            greenMsg: false, 
            text: `Devi prima effettuare il login`
        })
    }
}

module.exports = auth