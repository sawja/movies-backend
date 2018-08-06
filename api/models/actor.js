const mongoose = require('mongoose')

const actorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    movies: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
    ]
})

module.exports = mongoose.model('Actor', actorSchema)