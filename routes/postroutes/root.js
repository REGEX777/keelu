const config = require('../../config');
const Post = require('../../models/upload');
const mongoose = require('mongoose');

const root = (app, upload) => {
    app.post('/', upload.array('uploadFile', 10), async (req, res) => {
        console.log("success")
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            console.log(req.body); // Check the received body data
            console.log(req.files); // Check the uploaded files data

            const files = req.files;

            // Loop through each uploaded file
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                const post = new Post({
                    filename: file.originalname, // Using originalname for the filename
                    fileSize: (file.size / (1024 * 1024)).toFixed(3),
                    time: new Date()
                });

                // Save each file's information as a separate document in MongoDB
                await post.save();
                console.log(`[DEBUG]> File ${file.originalname} data was successfully saved in the database without any errors.`.green);
            }

            res.send('File(s) uploaded successfully!');
        } catch (err) {
            console.error('Error occurred during file upload:', err);
            res.status(500).send('File upload failed!');
        }
    });
};

module.exports = root;
