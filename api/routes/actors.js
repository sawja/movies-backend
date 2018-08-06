const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Movie = require('../models/movie')
const Actor = require('../models/actor')

// ==================== GET =============================
router.get('/', (req, res, next) => {
    Actor.find()
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
    Actor.find()
    .select('-__v')
    .populate('movies', '_id name')
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

router.get('/:actorId', (req, res, next) => {
    const id = req.params.actorId;
    Actor.findById(id)
        .select('-__v')
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
    const actor = new Actor({
        _id: mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: new Date(req.body.birthDate),
        movies: []
    })

    actor.save()
    .then(result => console.log(result))
    .catch(error => console.log(error))

    res.status(200).json({
        createdActor: actor
    })
})

// ==================== PATCH =============================
router.patch("/update/:actorId", (req, res, next) => {
    const id = req.params.actorId;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.property] = ops.value
    }

    //updateOps['name'] = spiderman;

    Actor.update({
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
    const actorId = req.body.actorId
    const movieId = req.body.movieId

    Actor.update({
        _id: actorId
    },
    {
        $push: {
            "movies": mongoose.Types.ObjectId(movieId)
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
    const actorId = req.body.actorId   
    const movieId = req.body.movieId

    Actor.update({
        _id: actorId
    },
    {
        $pull: {
            "movies": mongoose.Types.ObjectId(movieId)
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
router.delete('/:actorId', (req, res, next) => {
    const id = req.params.actorId;
    Actor.remove({
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