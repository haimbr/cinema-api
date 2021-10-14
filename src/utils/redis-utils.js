const redisClient = require('../db/redis');


const getTokenFromRedis = async (token) => {
    try {
        return JSON.parse(await redisClient.getAsync(token));
    } catch (err) {
        console.log(err);
        return null;
    }
}


const saveTokenInRedis = async (token) => {
    try {
        await redisClient.setexAsync(
            token,
            60 * 60,
            "true"
        );
    } catch (err) {
        console.log(err);
    }

}


const deleteTokenInRedis = async (token) => {
    try {
        return await redisClient.delAsync(token);
    } catch (err) {
        console.log(err);
    }
}



module.exports = { getTokenFromRedis, saveTokenInRedis, deleteTokenInRedis }