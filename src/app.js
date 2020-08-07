//  Node.js     (localhost:3000)
const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Salvatore'
    })
})

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
  

/*
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
   */

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: "404",
        name: "Salvatore",
        errorMessage: "Help article not found."
    })
})


app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        name: "Salvatore",
        errorMessage: "Page not found."
    })
  })


app.listen(3000, () => console.log('Server is up on :3000'))