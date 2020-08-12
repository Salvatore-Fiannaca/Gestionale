// Frontend     (localhost:3001)
const path = require('path')
const express = require('express')
const session = require('express-session')
const ejs = require('ejs')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

// Static route
app.use(express.static('public'))

app.use(session({secret: 'Sssshhhhhh',saveUninitialized: true,resave: true}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

var sess; // global session (just for test)

app.get('/', (req, res) => {
    sess= req.session;
    if(sess.email) {
        return res.redirect('/dashboard')
    }

    res.render('pages/login')
})

app.get('/dashboard', (req, res) => {
    res.render('pages/index', {
        title: ''
    })
})

app.post('/login', (req, res) => {
    sess = req.session;
    sess.email = req.body.email;
    res.render('pages/index', {
        title: ''
    })
})

app.get('/register', (req, res) => {
    res.render('pages/register', {
        title: ''
    })
})

app.get('/forgot', (req, res) => {
    res.render('pages/forgot', {
        title: ''
    })
})

app.get('/clients', (req, res) => {
    res.render('pages/clients', {
        title: ''
    })
})

app.get('/practices', (req, res) => {
    res.render('pages/practices', {
        title: ''
    })
})

/*

    app.get('/about', (req, res) => {
        res.render('about', {
            title: 'About Me',
            name: 'Salvatore'
        })
    })

    app.get('/help', (req, res) => {
        res.render('help', {
            title: 'Help page',
            helpText: '...',
            name: 'Salvatore'
        })
    })
    


    app.get('/products', (req, res) =>{
        if (!req.query.search) {
            return res.send({
                error: 'You must provide a search term'
            })
        } 
        console.log(req.query.search);
        res.send({
            products: []
        })
        
    })
    

    app.get('/help/*', (req, res) => {
        res.render('404', {
            title: "404",
            name: "Salvatore",
            errorMessage: "Help article not found."
        })
    })

*/

app.get('*', (req, res) => {
    res.render('pages/404', {
        title: "404",
        name: "Salvatore",
        errorMessage: "Page not found."
    })
  })


app.listen(3001, () => console.log('Server is up on :3001'))
