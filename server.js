const express = require('express');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const dotenv = require("dotenv");

dotenv.config();

const userService = require("./user-service.js");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

jwtOptions.secretOrKey = process.env.JWT_SECRET ;

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    if (jwt_payload) {
        next(null, { _id: jwt_payload._id, 
            userName: jwt_payload.userName}); 
    } else {
        next(null, false);
    }
});

/* TODO Add Your Routes Here */
app.post("/api/user/register", (req, res) => {
    userService.registerUser(req.body)
    .then((msg) => {
        res.json({"User registered": msg})
    }).catch((msg)=> {
        res.status(422).json({"User failed to register": msg})
    })
})


app.post("/api/user/login", (req, res) => {
    userService.checkUser(req.body)
        .then((user) => {
            var payload = { 
                _id: user._id,
                userName: user.userName
            };
            var token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({ "message": "Login successful!", "token": token });
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

app.get("/api/user/favourites", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.getFavourites(req.user._id)
        .then((msg) => {
            res.json({ data });
        }).catch((msg) => {
            res.status(422).json({ "error": msg });
        });
});

app.put("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.addFavourite(req.user._id, id.route)
        .then((item) => {
            res.json(item);
        }).catch((msg) => {
            res.status(422).json({ "error": msg });
        });
});

app.delete("/api/user/favourites/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.removeFavourite(req.body, id.route)
        .then((msg) => {
            res.json({ data });
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

userService.connect()
.then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
})
.catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
});