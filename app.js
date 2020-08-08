//  Node.js     (localhost:3000)
const path = require('path')
const express = require('express')
const ejs = require('ejs')

const app = express()

// Setup handlebars engine and views location
app.set('view engine', 'ejs')
app.set('views', 'views')

// Static route
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('pages/index', {
        name: 'Salvatore'
    })
})

app.get('/login', (req, res) => {
    res.render('pages/login', {
        title: ''
    })
})

app.get('/register', (req, res) => {
    res.render('pages/register', {
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


app.listen(3000, () => console.log('Server is up on :3000'))