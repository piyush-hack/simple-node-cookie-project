const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Movie = new Schema({
    movieName: {
        type: String,
        required: true

    },
    rating: {
        type: Number,
    },
    cast: {
        type: Array,
        "default": []
    },
    genere: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    releaseDate: {
        type: Date,
    }
});

module.exports = mongoose.model("movie", Movie);