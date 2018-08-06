// imports
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// connect mongoose
mongoose.connect(
    'mongodb://restapi:' + 
    process.env.MONGO_ATLAS_PW + 
    '@restapi-shard-00-00-9goo5.mongodb.net:27017,restapi-shard-00-01-9goo5.mongodb.net:27017,restapi-shard-00-02-9goo5.mongodb.net:27017/test?ssl=true&replicaSet=restapi-shard-0&authSource=admin',
    {
        
    }
)

mongoose.Promise = global.Promise

// create express app
const app = express()

// create routes
const routesMovies = require('./api/routes/movies')
const routesActors = require('./api/routes/actors')

// logging
app.use(morgan('dev'))

// body parser
app.use(bodyParser.urlencoded({
    extended: true})
)
app.use(bodyParser.json())

// CORS error handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers',
     'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
         'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

// routes
app.use('/movies', routesMovies)
app.use('/actors', routesActors)

// handle errors
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app