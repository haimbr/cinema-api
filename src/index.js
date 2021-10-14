const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const moviesRouter = require("./routers/moviesRouter");
const adminRouter = require("./routers/adminRouter");


   
require("./db/mongoose");

const port = process.env.PORT;
const app = express();
app.use(cors({origin : ["http://localhost:3000", "http://localhost:3001"], credentials: true}));          

app.use(express.json()); 
app.use(cookieParser());

app.use(moviesRouter);
app.use(adminRouter);
 

app.get("/test", (req, res) => {
    res.send("OK");
});


app.listen(port, () => console.log("Server is connected, Port:", port));


// const getData = require("./data/scrapeData");
// getData("https://hotcinema.co.il/tickets/TheaterEvents")