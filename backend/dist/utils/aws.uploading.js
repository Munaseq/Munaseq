"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerEventLogic = multerEventLogic;
exports.multerUserLogic = multerUserLogic;
exports.multerMaterialtLogic = multerMaterialtLogic;
exports.uploadCertificate = uploadCertificate;
exports.sendEmailSendGrid = sendEmailSendGrid;
const platform_express_1 = require("@nestjs/platform-express");
const multerS3 = require("multer-s3");
const client_s3_1 = require("@aws-sdk/client-s3");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const uuid_1 = require("uuid");
const sgMail = require("@sendgrid/mail");
dotenv.config();
const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const s3Client = new client_s3_1.S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
function multerEventLogic() {
    return (0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: 1 },
    ], {
        storage: multerS3({
            s3: s3Client,
            bucket: bucketName,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const fileExt = file.originalname.split('.').pop();
                const fileName = `${(0, uuid_1.v4)()}.${fileExt}`;
                cb(null, fileName);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type, only images is allowed!'), false);
            }
        },
    });
}
function multerUserLogic() {
    return (0, platform_express_1.FileFieldsInterceptor)([
        { name: 'cv', maxCount: 1 },
        { name: 'profilePicture', maxCount: 1 },
    ], {
        storage: multerS3({
            s3: s3Client,
            bucket: bucketName,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const fileExt = file.originalname.split('.').pop();
                const fileName = `${(0, uuid_1.v4)()}.${fileExt}`;
                cb(null, fileName);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'application/pdf' ||
                file.mimetype.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type, only PDF and images are allowed!'), false);
            }
        },
    });
}
function multerMaterialtLogic() {
    return (0, platform_express_1.FileFieldsInterceptor)([
        { name: 'materials', maxCount: 10 },
    ], {
        storage: multerS3({
            s3: s3Client,
            bucket: bucketName,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const fileExt = file.originalname.split('.').pop();
                const fileName = `${(0, uuid_1.v4)()}.${fileExt}`;
                cb(null, fileName);
            },
        }),
    });
}
function uploadCertificate(pdfBytes, certifId) {
    const s3 = new AWS.S3({
        region: process.env.BUCKET_REGION,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
    });
    const fileName = `certificates/${certifId}.pdf`;
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: pdfBytes,
        ContentType: 'application/pdf',
        ACL: 'public-read',
    };
    let url;
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                reject(new Error('Failed to upload PDF to S3'));
            }
            else {
                const fileUrl = data.Location;
                resolve(fileUrl);
            }
        });
    });
}
async function sendEmailSendGrid(firstName, startEventDate, eventTitle, userEmail, eventCreatorEmail) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return new Promise((resolve, reject) => {
        sgMail
            .send({
            personalizations: [
                {
                    to: [
                        {
                            email: userEmail,
                        },
                    ],
                    dynamicTemplateData: {
                        munaseqWebsite: 'https://munaseq.vercel.app/',
                        eventTitle,
                        firstName,
                        startEventDate,
                        eventCreatorMail: eventCreatorEmail,
                    },
                },
            ],
            from: {
                email: process.env.FROM_EMAIL,
                name: 'فريق منسّق',
            },
            subject: ` ${eventTitle} :تذكير لحضور فعالية`,
            templateId: process.env.TEMPLATE_ID,
        })
            .then(() => {
            resolve('Email sent');
        })
            .catch((error) => {
            reject(error);
        });
    });
}
//# sourceMappingURL=aws.uploading.js.map