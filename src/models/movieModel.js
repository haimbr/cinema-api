const mongoose = require("mongoose");


const movieSchema = new mongoose.Schema(
    {
        movieDetails: {
            movieId: {
                type: "string",
            },
            nameInHebrew: {
                type: "string",
                trim: true,
            },
            nameInEnglish: {
                type: "string",
            },
            trailerLink: {
                type: "string",
            },
            description: {
                type: "string",
            },
            targetAudience: {
                type: "string",
            },
            movieLength: {
                type: "string",
            },
            premiereDate: {
                type: "string",
            },
            ageRestriction: {
                type: "string",
            },
        },
        Dates: [{
            Date: "string",
            Day: "string",
            Hour: "string",
            EventId: "string",
            TheaterId: "string",
            theatersName: "string",
            FormattedDate: "string",
            DubbedLanguage: "string",
            SubtitledLanguage: "string",
            Emlang: "string",
            Is3D: "string",
            IsAtmos2D: "string",
            IsAtmos3D: "string",
            seatPlan: []
        }]
    },
    {
        timestamps: true,
    }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;