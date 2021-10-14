const axios = require('axios');
const cheerio = require('cheerio');


const theatersNames = {
    1: "br cinema אשדוד",
    2: "br cinema תל אביב",
    5: "br cinema רמת גן",
    6: "br cinema רחובות",
    8: "br cinema קרית גת",
    9: "br cinema גלילות",
    14: "br cinema ירושלים",
    15: "br cinema שדרות",
    16: "br cinema חולון",
    17: "br cinema באר שבע",
    18: "br cinema כפר סבא",
}

const Movie = require('../models/movieModel');

const getData = async (url) => {
    console.log("a");
    try {
        const res = await axios.get(url);
        res.data.forEach((movie, index) => {

            movie.Dates.forEach((date) => {
                date.seatPlan = new Array(135);
                date.theatersName = theatersNames[date.TheaterId];
            });
            asyncFunc();
            async function asyncFunc() {
                const movieDetails = await scrapeDate(movie.MovieId);
                const newMovie = new Movie({
                    movieDetails: { ...movieDetails, movieId: movie.MovieId, },
                    Dates: movie.Dates
                });
                // console.log(newMovie);
                let result = await newMovie.save();
                console.log(result);
            }
        });
        // console.log(res);
    } catch (e) {
        console.log(e);
    }
}

const paths = {
    nameInHebrew: ".col.left-side > div.d-flex.justify-content-between > div:nth-child(1) > h1",
    nameInEnglish: ".col.left-side > div.d-flex.justify-content-between > div:nth-child(2) > h2",
    trailerLink: "#fullpagevideo",
    description: ".row.movie-details.mt-4 > div.col.left-side > div.row > div.col.desc > div.desc1.pb-2",
    targetAudience: ".col.left-side > div.row > div.col.desc > div.desc3.pb-4 > div:nth-child(1) > div.col-5 > span",
    movieLength: ".col.left-side > div.row > div.col.desc > div.desc3.pb-4 > div:nth-child(1) > div.col > span",
    premiereDate: ".col.left-side > div.row > div.col.desc > div.desc3.pb-4 > div:nth-child(2) > div.col-5 > span",
    ageRestriction: ".col.left-side > div.row > div.col.desc > div.desc3.pb-4 > div:nth-child(2) > div.col > span"
}


const scrapeDate = async (MovieId) => {
    const URL = `https://hotcinema.co.il/movie/${MovieId}/jungle-beat`
    try {
        const res = await axios.get(URL);
        const $ = cheerio.load(res.data);
        const nameInHebrew = $(paths.nameInHebrew).html();
        const nameInEnglish = $(paths.nameInEnglish).html();
        const trailerLink = $(paths.trailerLink).attr('src');
        const description = $(paths.description).html();
        const targetAudience = $(paths.targetAudience).html().trim();
        const movieLength = $(paths.movieLength).html().replace("דקות", "");
        const premiereDate = $(paths.premiereDate).html().replace("בכורה:", "");
        const ageRestriction = $(paths.ageRestriction).html().replace("הגבלת גיל:", "");


        const result = {
            nameInHebrew,
            nameInEnglish,
            trailerLink,
            description,
            targetAudience,
            movieLength,
            premiereDate,
            ageRestriction,
        }
        // console.log(result);
        return result;

    } catch (err) {
        console.log(err);//*
    }
}


module.exports = getData;

// getData("https://hotcinema.co.il/tickets/TheaterEvents")