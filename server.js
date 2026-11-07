const http = require("http");
const https = require("https");
const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};

app.use(express.json());

let comments = [];

app.get("/api/comments", (req, res) => {
    res.status(200).json(comments);
})

app.post("/api/comments", (req, res) => {
    const { username, body } = req.body;

    if (!username || !body) {
        return res.status(400).json({
            error: "Username and comment are required."
        });
    }

    const comment = {
        username: username,
        body: body
    };

    comments.push(comment);

    res.status(201).json(comment);
})

const httpApp = express();
httpApp.use((req, res) => {
    res.redirect("https://localhost:8443" + req.url);
});

http.createServer(httpApp).listen(8000, () => {
    console.log("HTTP server running on port 8000");
});

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
    res.status(404).type('text').send('Not found!')
});

https.createServer(options, app).listen(8443, () => {
    console.log("HTTPS server running on port 8443");
});