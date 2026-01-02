const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");

const userController = require("../controllers/users.js");

router
    .route("/signup")
    //Render Signup Form
    .get(userController.renderSignupForm)
    //Signup
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    //Render Login Form
    .get(userController.renderLoginForm)
    //Login
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;