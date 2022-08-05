const express = require("express");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/skins/", (req, res, next) => {

    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {

        if (err) {
            next(err);
            return;
        }

        // let data = res.json({ fields, files });

        if (!fs.existsSync(path.join(__dirname, "/skins"))) {
            fs.mkdir(path.join(__dirname, "/skins"));
        }

        let filename = path.join(__dirname, `/skins/${fields.username}.png`);
        let image = files.image.filepath;

        fs.copyFile(image, filename, (err) => {
            if (err) {
                res.send(err.message);
                return;
            }

            fs.unlink(image, (err) => {
                if (err) {
                    res.send(err.message);
                    return;
                }

                res.send("<h1>Enviado con exito</h1>");
            });
        })

    });

});

app.get("/skins/:username", (req, res) => {
    let filename = path.join(__dirname, `/skins/${req.params.username}.png`);
    res.sendFile(filename);
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...")

    if (!fs.existsSync(path.join(__dirname, "/skins"))) {
        fs.mkdir(path.join(__dirname, "/skins"));
    }
});