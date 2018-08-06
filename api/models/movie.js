const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    runtime: { type: Number, required: true },
    actors: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }
    ]
})

module.exports = mongoose.model('Movie', movieSchema)