const config = require('../../config');
const Post = require('../../models/upload');
const fs = require('fs');
const path = require('path');
const {
    isValidObjectId
} = require('mongoose');

const root = (app) => {
    app.get('/delete/:id', async (req, res) => {
        const documentId = req.params.id;
        if (!isValidObjectId(documentId)) {
            res.status(400).send("Invalid ID")
        }
        try {
            const post = await Post.findById(documentId);

            if (!post) {
                return res.status(404).send("Post Not Found");
            }
            const filename = post.filename;
            const publicPath = path.join(__dirname, '..', '..', 'public', 'uploads', filename);
            if (fs.existsSync(publicPath)) {
                try {
                    fs.unlinkSync(publicPath);
                    if (config.debug) {
                        console.log(`[-] ${filename} was deleted successfully.`.red);
                    }
                } catch (unlinkErr) {
                    console.error(`[-] Error occurred while deleting file: ${unlinkErr}`);
                }
            }

            await Post.deleteOne({
                _id: documentId
            });

            if (config.debug) {
                console.log(`[-] ${documentId} was deleted successfully.`.red);
            }

            return res.redirect("/");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Error occurred while deleting");
        }
    });

    if (config.debug) {
        console.log(`[+] Received a get request on delete route. (/delete)`);
    }
};

module.exports = root;