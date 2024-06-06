const express = require("express");
const session = require("express-session");
const formidable = require("formidable");
const fs = require("fs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/assets`));
app.use(express.static(`${__dirname}/scripts`));

app.use(
    session({
        secret: "salty",
        resave: true,
        saveUninitialized: false,
    }),
);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/try", (req, res) => {
    res.render("visual");
});

function check_credentials(username, password) {
    let users = [];
    if (fs.existsSync("users.json")) {
        const users_data = fs.readFileSync("users.json");
        users = JSON.parse(users_data);
    }
    for (const user of users) {
        if (user.username === username && user.password === password) {
            return true;
        }
    }
    return false;
}

app.post("/login", (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        user = check_credentials(fields.username, fields.parola);
        // verificarea datelor de login

        if (user) {
            req.session.username = user;
            // setez userul ca proprietate a sesiunii
            res.redirect("/logged");
        } else {
            res.redirect("/");
            req.session.username = false;
        }
    });
});

app.get("/logged", (req, res) => {
    res.render("components/logged", { name: req.session.username });
});

app.post("/login", (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        user = check_credentials(fields.username, fields.parola);
        // verificarea datelor de login

        if (user) {
            req.session.username = user;
            // setez userul ca proprietate a sesiunii
            res.redirect("/logat");
        } else req.session.username = false;
    });
});

app.get("/logat", (req, res) => {
    res.render("component/logout", { nume: req.session.username });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("index");
});

app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
});

app.listen(8080);
