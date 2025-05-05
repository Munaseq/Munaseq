import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import {
  SchedulerClient,
  CreateScheduleCommand,
} from '@aws-sdk/client-scheduler';

dotenv.config();
const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
export function multerEventLogic() {
  return FileFieldsInterceptor(
    [
      { name: 'image', maxCount: 1 }, // The field name for the image file
    ],
    {
      storage: multerS3({
        s3: s3Client,
        bucket: bucketName,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,

        key: (req, file, cb) => {
          const fileExt = file.originalname.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          cb(null, fileName); // The file name in the S3 bucket
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type, only images is allowed!'), false);
        }
      },
    },
  );
}

export function multerUserLogic() {
  return FileFieldsInterceptor(
    [
      { name: 'cv', maxCount: 1 }, // Field for the PDF
      { name: 'profilePicture', maxCount: 1 }, // Field for the profile image
    ],
    {
      storage: multerS3({
        s3: s3Client,
        bucket: bucketName,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,

        key: (req, file, cb) => {
          const fileExt = file.originalname.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          cb(null, fileName); // The file name in the S3 bucket
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'application/pdf' ||
          file.mimetype.startsWith('image/')
        ) {
          cb(null, true);
        } else {
          cb(
            new Error('Invalid file type, only PDF and images are allowed!'),
            false,
          );
        }
      },
    },
  );
}
export function multerMaterialtLogic() {
  return FileFieldsInterceptor(
    [
      { name: 'materials', maxCount: 10 }, // The field name for the material file
    ],
    {
      storage: multerS3({
        s3: s3Client,
        bucket: bucketName,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,

        key: (req, file, cb) => {
          const fileExt = file.originalname.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          cb(null, fileName); // The file name in the S3 bucket
        },
      }),
    },
  );
}
export function uploadCertificate(
  pdfBytes: Uint8Array,
  certifId: string,
): Promise<string> {
  // Configure AWS S3
  const s3 = new AWS.S3({
    region: process.env.BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });

  const fileName = `certificates/${certifId}.pdf`;
  // Upload to S3
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: pdfBytes, // The actual PDF data as Uint8Array
    ContentType: 'application/pdf',
    ACL: 'public-read', // You can adjust the ACL based on your requirements
  }; // Perform the upload
  let url;
  // S3 ManagedUpload with callbacks is not supported in AWS SDK for JavaScript (v3).
  // Please convert to 'await client.upload(params, options).promise()', and re-run aws-sdk-js-codemod.
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(new Error('Failed to upload PDF to S3'));
      } else {
        // Extract the URL from the response
        const fileUrl = data.Location;
        console.log('File uploaded successfully. URL:', fileUrl);
        resolve(fileUrl); // Resolve the promise with the file URL
      }
    });
  });
}

export async function sendEmailSendGrid(
  firstName: string,
  startEventDate: string,
  eventTitle: string,
  eventCreatorEmail: string,
): Promise<string> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  return new Promise((resolve, reject) => {
    sgMail
      .send({
        personalizations: [
          {
            to: [
              // {
              //   email: eventCreatorEmail, // Recipient email
              // },
              { email: '443100831@student.ksu.edu.sa' },
              { email: '443101240@student.ksu.edu.sa' },
              { email: '443105662@student.ksu.edu.sa' },
              { email: '443100662@student.ksu.edu.sa' },
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
          email: process.env.FROM_EMAIL, // Verified sender email
          name: 'فريق منسّق', // Optional sender name
        },
        subject: ` ${eventTitle} :تذكير لحضور فعالية`, // Subject line
        templateId: process.env.TEMPLATE_ID, // Dynamic template ID
      })
      .then(() => {
        resolve('Email sent');
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// FileFieldsInterceptor(
//   [
//     { name: 'image', maxCount: 1 }, // The field name for the image file
//   ],
//   {
//     storage: multerS3({
//       s3: new S3Client({
//         region,
//         credentials: {
//           accessKeyId,
//           secretAccessKey,
//         },
//       }),
//       bucket: bucketName,
//       acl: 'public-read',
//       contentType: multerS3.AUTO_CONTENT_TYPE,

//       key: (req, file, cb) => {
//         const fileExt = file.originalname.split('.').pop();
//         const fileName = `${file.fieldname}-${uuidv4()}.${fileExt}`;
//         cb(null, fileName); // The file name in the S3 bucket
//       },
//     }),
//     fileFilter: (req, file, cb) => {
//       if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//       } else {
//         cb(
//           new Error('Invalid file type, only PDF and images are allowed!'),
//           false,
//         );
//       }
//     },
//   },
// );
