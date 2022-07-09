const express = require('express');
var path = require('path')
const router = express.Router();
const Movie = require('../models/Movies');
const uuid = require('uuid');

const { body, validationResult } = require('express-validator');


class Session {
    constructor(movieName, expiresAt) {
        this.username = movieName
        this.expiresAt = expiresAt
    }

    // we'll use this method later to determine if the session has expired
    isExpired() {
        this.expiresAt < (new Date())
    }
}

const fetchToken = (req, res, next) => {

    if (!req.cookies) {
        res.status(401).end()
        return
    }
    const sessionToken = req.cookies['movie-' + req.params.id];
    movieSession = sessions[sessionToken];
    // console.log(movieSession , sessionToken , req.params.id , req.cookies , sessions);
    if (!movieSession) {
        // If the session token is not present in session map, return an unauthorized error
        res.status(401).end()
        return
    }

    if (movieSession.isExpired()) {
        delete sessions[sessionToken]
        res.status(401).end()
        return
    }

    if (!sessionToken) {
        // If the cookie is not set, return an unauthorized status
        res.status(401).end()
        return
    }
    next();
}

//Can Also USe A Db To Save Session Tokens
const sessions = {}

router.post('/add', [
    body('movieName', ' Movie Name must be of 3 characters').isLength({ min: 3 }),
    body('rating', 'Rating must be atleast 1').isLength({ min: 1 }),], async (req, res) => {
        try {

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const movie = new Movie({
                ...req.body
            })
            let newMovie = await movie.save();
            const sessionToken = uuid.v4()
            const now = new Date()
            const expiresAt = new Date(+now + 3600 * 1000 )
            const session = new Session(req.body.movieName, expiresAt)
            // add the session information to the sessions map
            sessions[sessionToken] = session

            // In the response, set a cookie on the client with the name "session_cookie"
            // and the value as the UUID we generated. We also set the expiry time
            res.cookie("movie-" + newMovie._id, sessionToken, { expires: expiresAt })
            res.json(newMovie);
        } catch (error) {
            console.error(error.message);
            res.status(500).send({ errors: "Internal Server Error" });
        }
    })

router.put('/update/:id', fetchToken, async (req, res) => {
    try {

        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.json({ updatedMovie });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


router.delete('/delete/:id', fetchToken, async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Movie has been deleted", deletedMovie: deletedMovie });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})



module.exports = router
