const express = require("express");
const session = require("express-session");
const favicon = require("serve-favicon");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.static(`${__dirname}/views`));
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
	if (req.session.loggedin === undefined) {
		req.session.loggedin = false;
	}
	res.render("index", { loggedin: req.session.loggedin });
});

app.get("/login", (req, res) => {
	if (req.session.loggedin === true) {
		res.redirect("/");
		return;
	}
	res.render("login", { loggedin: req.session.loggedin });
});

app.post("/login-action", (req, res) => {
	const form = new formidable.IncomingForm();
	form.parse(req, (_, fields, __) => {
		const user = check_credentials(fields.username[0], fields.password[0]);

		if (user) {
			req.session.loggedin = true;
			res.redirect("/");
		} else {
			res.redirect("/login");
		}
	});
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

app.get("/register", (req, res) => {
	if (req.session.loggedin === true) {
		res.redirect("/");
		return;
	}

	res.render("register", { loggedin: req.session.loggedin });
});

app.post("/register-action", (req, res) => {
	const form = new formidable.IncomingForm();
	form.parse(req, (_, fields, __) => {
		const added = add_user(fields.username[0], fields.password[0]);

		if (added) {
			req.session.loggedin = true;
			res.redirect("/login");
		} else {
			res.redirect("/register");
		}
	});
});

function exists_user(users, username) {
	for (const user in users) {
		if (user.username === username) {
			return true;
		}
	}
	return false;
}

/// Returns true if a user was added successfully
// A user is added successfully if:
// 1. There is no other user with the same username
// 2. fs.writeFile succeeded!
// 3. The password is as specified on the register page
function add_user(username, password) {
	let users = [];
	if (fs.existsSync("users.json")) {
		const users_data = fs.readFileSync("users.json");
		users = JSON.parse(users_data);
	}

	if (exists_user(users, username)) {
		return false;
	}

	const pass_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
	if (!pass_regex.test(password)) {
		return false;
	}

	users.push({
		username: username,
		password: password,
	});

	const data = JSON.stringify(users, null, 4);
	fs.writeFile("users.json", data, (err) => {
		if (err) {
			console.log(err);
			return false;
		}
		console.log("File written successfully\n");
	});
	return true;
}

app.get("/try", (req, res) => {
	if (!req.session.loggedin) {
		res.redirect("/404");
		return;
	}
	res.render("visual", { loggedin: req.session.loggedin });
});

app.get("/logout", (req, res) => {
	req.session.loggedin = false;
	res.redirect("/");
});

/// Paths that are not handled explicity
// should go to 404 page
app.get("*", (req, res) => {
	res.status(404);
	res.render("404");
});

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Listening at:  http://localhost:${PORT}`);
});
