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

/* TODO Add Your Routes Here */
app.post("api/user/register", (req, res) =>{
    userService.registerUser(req.body)
    .then(res =>{
        res.json({message: res})
    })
    .catch(err =>{
        res.status(422).json({message: err})
    })
})


app.post("api/user/login", (req, res) =>{
    userService.checkUser(req.body)
    .then(user =>{
        var payload = {
            _id: user._id,
            userName: user.userName
        }
        var token = jwt.sign(payload, jwtOptions.secretOrKey)
        res.json({message: "Successfully Logged In!", token: token})
    })
    .catch(err =>{
        res.status(422).json({message: err})
    })
})

app.get("api/user/favourites", passport.authenticate("jwt"), {session: false}), (req, res) =>{
    userService.getFavourites(req.user._id)
    .then(item =>{
        res.json(item)
    })
    .catch(err =>{
        res.status(402).json({message: err})
    })
}

app.put("api/user/favourites/:id", passport.authenticate("jwt"), {session: false}), (req, res) =>{
    userService.addFavourite(req.user._id, req.params.id)
    .then(item =>{
        res.json(item)
    })
    .catch(err =>{
        res.status(402).json({message: err})
    })
}

app.delete("api/user/favourites/:id", passport.authenticate("jwt"), {session: false}), (req, res) =>{
    userService.removeFavourite(req.user._id, req.params.id)
    .then(item =>{
        res.json(item)
    })
    .catch(err =>{
        res.status(402).json({message: err})
    })
}


userService.connect()
.then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
})
.catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
});