const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Movie = require('../models/movie')
const Actor = require('../models/actor')

// ==================== GET =============================
router.get('/', (req, res, next) => {
    Movie.find()
    .select('-__v')
    .exec()
    .then(docs => {
        res.status(200).json(docs)
        })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.get('/populated', (req, res, next) => {
    Movie.find()
    .select('-__v')
    .populate('actors', '_id firstName lastName')
    .exec()
    .then(docs => {
        res.status(200).json(docs)
        })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.get('/:movieId', (req, res, next) => {
    const id = req.params.movieId;
    Movie.findById(id)
        .select('-__v')
        .populate('actors', '_id firstName lastName')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc)
            } else {
                res.status(404).json({
                    message: 'No valid entry for this id'
                })
            }
            
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(
                {error: err}
            )
        })
})

// ==================== POST =============================
router.post('/', (req, res, next) => {
    const movie = new Movie({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        releaseDate: new Date(req.body.releaseDate),
        runtime: req.body.runtime,
        actors: []
    })

    movie.save()
    .then(result => console.log(result))
    .catch(error => console.log(error))

    res.status(200).json({
        createdMovie: movie
    })
})


// ==================== PATCH =============================
router.patch("/update/:movieId", (req, res, next) => {
    const id = req.params.movieId;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.property] = ops.value
    }

    //updateOps['name'] = spiderman;

    Movie.update({
        _id: id
    }, 
    {
        $set: updateOps
    })
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({result})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


router.patch("/append/", (req, res, next) => {
    const movieId = req.body.movieId
    const actorId = req.body.actorId

    Movie.update({
        _id: movieId
    },
    {
        $push: {
            "actors": mongoose.Types.ObjectId(actorId)
        }
    })
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({result})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.patch("/detach/", (req, res, next) => {
    const movieId = req.body.movieId
    const actorId = req.body.actorId

    Movie.update({
        _id: movieId
    },
    {
        $pull: {
            "actors": mongoose.Types.ObjectId(actorId)
        }
    })
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({result})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

// ==================== DELETE =============================
router.delete('/:movieId', (req, res, next) => {
    const id = req.params.movieId;
    Movie.remove({
        _id: id
    })
    .exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router