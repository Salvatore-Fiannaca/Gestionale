/*
function invalidCsrfToken(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    res.status(403).send("Session has expired or form tampered with")
}
*/

/*
app.get('/csrf', csrfProtection, (req, res, next) => {
  res.json({ csrfToken: req.csrfToken() })
})
*/