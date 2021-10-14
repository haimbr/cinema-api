const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { nanoid } = require('nanoid');

const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const bucket = process.env.S3_BUCKET;

const fileStorage = multerS3({
    s3,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "inline",
    bucket,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, callback) => {
        const movieId = nanoid();
        req.body.movieId = movieId;
        const fileName = "images/" + movieId + ".jpg";
        callback(null, fileName);
    }
});

const uploadImageToS3 = multer({ storage: fileStorage }).single("file");

const getFileFromS3 = async (req, res, next) => {
    const Key = req.query.key;
    const owner = Key.split('_')[1];
    if (owner != req.user._id) return res.status(401).send('Please authenticate.');
    try {
        const { Body } = await s3.getObject({
            Key,
            Bucket: bucket
        }).promise();

        req.fileBuffer = Body;
        next();
    } catch (err) {
        res.status(400).send(err)
    }
};

const deleteFileFromS3 = async (req, res, next) => {
    const Key = req.query.key;
    const owner = Key.split('_')[1];
    if (owner != req.user._id) return res.status(401).send('Please authenticate.');
    try {
        await s3.deleteObject({
            Key,
            Bucket: bucket
        }).promise();
        next();
    } catch (err) {
        res.status(404).send({
            message: "File not found"
        });
    }
};


module.exports = {
    uploadImageToS3,
    deleteFileFromS3,
    getFileFromS3
};