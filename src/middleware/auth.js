const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const { getTokenFromRedis } = require("../utils/redis-utils");


const auth = async (req, res, next) => {
    try { 
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ _id: decoded._id });
        const isTokenExist = await getTokenFromRedis(token);
        if (!admin || !isTokenExist) {
            throw new Error();
        }
        req.token = token;
        req.admin = admin;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).send({ error: "Please authenticate." });
    }
};


module.exports = auth;
