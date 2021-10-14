const express = require("express");
const Movie = require("../models/movieModel");
const mongoose = require("mongoose");


const router = new express.Router();





router.get("/movie/get-movies", async (req, res) => {
    let searchParameter = req.query.theatersName ? { 'Dates.theatersName': req.query.theatersName } : {};
    try {
        const movies = await Movie.find(searchParameter, 'movieDetails');
        res.send(movies)
    } catch (err) {
        console.log(err);
        res.status(400).send({
            status: 400,
            message: err.message,
        });
    }
});

router.get("/movie/get-movie/:movieName", async (req, res) => {
    const searchParameter = { 'movieDetails.nameInHebrew': req.params.movieName };
    try {
        const movies = await Movie.findOne(searchParameter, 'movieDetails');
        res.send(movies)
    } catch (err) {
        console.log(err);
        res.status(400).send({
            status: 400,
            message: err.message,
        });
    }
});


router.get("/get-theaters", async (req, res) => {
    let searchParameter = req.query.nameInHebrew ? { 'movieDetails.nameInHebrew': req.query.nameInHebrew } : {};
    try {
        const theaters = await Movie.find(searchParameter).distinct('Dates.theatersName');
        res.send(theaters)
    } catch (err) {
        console.log(err);
        res.status(400).send({
            status: 400,
            message: err.message,
        });
    }
});




router.get("/get-dates", async (req, res) => {
    try {
        const dates = await Movie.findOne(
            {
                "movieDetails.nameInHebrew": req.query.nameInHebrew
            },
            {
                Dates: { $filter: { input: "$Dates", as: "date", cond: { $eq: ["$$date.theatersName", req.query.theatersName] } } }
            }
        )
        res.send(dates)
    } catch (err) {
        console.log(err);
        res.status(400).send({
            status: 400,
            message: err.message,
        });
    }
});


router.get("/get-screening-event", async (req, res) => {
    console.log("get-screening-event");
    try {
        const result = await Movie.findOne(
            { "movieDetails.nameInHebrew": req.query.nameInHebrew }, { Dates: { $elemMatch: { EventId: req.query.EventId } } }
        );
        const screeningEvent = result?.Dates?.shift();
        if (screeningEvent) {
            res.send(screeningEvent);
        } else {
            throw new Error("Invalid movieName or eventId");
        };

    } catch (err) {
        console.log(err);
        res.status(400).send({
            status: 400,
            message: err.message,
        });
    }
});


router.post("/order-ticket", async (req, res) => {
    console.log("order-ticket");
    // gets the screening-event in order to check if the seats are available.
    try {
        const screeningEvent = await Movie.findOne(
            { "movieDetails.nameInHebrew": req.body.nameInHebrew }, { Dates: { $elemMatch: { EventId: req.body.EventId } } }
        );

        const seatPlan = screeningEvent?.Dates?.shift().seatPlan;
        const isSeatsSelectedAvailable = req.body.seatsSelected.every(i => !seatPlan.includes(i));
        if (!isSeatsSelectedAvailable) {
            throw new Error("one or more seats selected is not available");
        }

        // create new seat plan array.
        req.body.seatsSelected.forEach((seat) => seatPlan[seat] = seat);

        // update seat plan.
        const result = await Movie.updateOne(
            {
                "movieDetails.nameInHebrew": req.body.nameInHebrew,
                'Dates.EventId': req.body.EventId
            },
            {
                $set: { 'Dates.$.seatPlan': seatPlan }
            }
        );
        // check if the update was successful
        if (result.nModified === 0) {
            throw new Error("Something went wrong");
        }

        res.send("the order has been successfully completed")

    } catch (err) {
        console.log(err);
        res.status(400).send({
            status: 400,
            message: err.message,
        });
    }
});





module.exports = router;


