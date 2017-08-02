var express = require("express");
var app = express();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/methPass");
var bodyParser = require("body-parser");

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var server = app.listen(3000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log("MethPass is running at http://%s:%s", host, port);
});

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

app.use(expressSession({
    secret: "rfirevtre",
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

var PassSchema = new mongoose.Schema({
    Customer: String,
    PaidDate: Date,
    DaysPaid: Number,
    Seller: String,
    Note: String,
    Blacklisted: Boolean,
    HoursLeft: Number
});

var MethPass = mongoose.model('MethPass', PassSchema);

app.use("/common", express.static("./common"));
app.use("/login", express.static("./login"));
app.use("/admin", [isAuthenticated, express.static("./client")]);

require('./controller/passController')(app, null, MethPass, isAuthenticated);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var UserSchema = mongoose.Schema;
var UserDetail = new UserSchema({
    username: String,
    password: String
}, {
    collection: 'userInfo'
});
var UserDetails = mongoose.model('userInfo', UserDetail);

passport.use(new LocalStrategy(function(username, password, done) {
    process.nextTick(function() {
        UserDetails.findOne({
            'username': username,
        }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            bcrypt.compare(password, user.password, function(err, res) {
                if (res === true) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    });
}));

// Recreate admin login
UserDetails.remove({},
    function(err, results) {
        var admin = new UserDetails({
            username: "prime",
            password: "aimbot"
        });

        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) console.log(err);

            bcrypt.hash(admin.password, salt, function(err, hash) {
                if (err) console.log(err);
                admin.password = hash;
                admin.save(function(error, data) {
                    if (error) console.log(error);
                    else console.log('Admin login created succesfully');
                });
            });
        });
    });

app.get("/", function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/admin")
    } else {
        res.redirect("/login");
    }
});

app.post("/login",
    passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/login"
    })
);