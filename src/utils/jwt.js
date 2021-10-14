const jwt = require("jsonwebtoken");

const generateAuthToken = (user) => {
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET, { expiresIn: "1 day" }
    );
    return token;
}

module.exports = generateAuthToken;