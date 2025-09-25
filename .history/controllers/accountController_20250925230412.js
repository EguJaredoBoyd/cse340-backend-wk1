// controllers/accountController.js
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const { validationResult } = require("express-validator")

/* ****************************************
*  Deliver login view (GET)
* *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null, // initially no errors
      messages: req.flash("notice") || []
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Deliver registration view (GET)
* *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null, // initially no errors
      messages: req.flash("notice") || []
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Process Registration (POST)
* *************************************** */
async function registerAccount(req, res, next) {
  let nav = await utilities.getNav()
  const errors = validationResult(req) // ✅ check validation errors
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  if (!errors.isEmpty()) {
    // if validation failed, re-render the form with errors + old values
    return res.render("account/register", {
      title: "Register",
      nav,
      errors: errors, // pass errors into the view
      messages: req.flash("notice") || [],
      account_firstname,
      account_lastname,
      account_email
    })
  }

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
      res.redirect("/account/login")
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.redirect("/account/register")
    }
  } catch (err) {
    console.error("Registration error:", err)
    req.flash("notice", "An unexpected error occurred.")
    res.redirect("/account/register")
  }
}

/* ****************************************
*  Process Login (POST)
* *************************************** */
async function loginAccount(req, res, next) {
  let nav = await utilities.getNav()
  const errors = validationResult(req)
  const { account_email, account_password } = req.body

  if (!errors.isEmpty()) {
    // if validation failed
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors,
      messages: req.flash("notice") || [],
      account_email // keep email filled in
    })
  }

  try {
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData || accountData.account_password !== account_password) {
      req.flash("notice", "Invalid email or password.")
      return res.redirect("/account/login")
    }

    // ✅ successful login
    req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
    res.redirect("/") // or dashboard page
  } catch (err) {
    console.error("Login error:", err)
    req.flash("notice", "An unexpected error occurred during login.")
    res.redirect("/account/login")
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount }
