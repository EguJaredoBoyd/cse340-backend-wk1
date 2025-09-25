const utilities = require("../utilities")
const accountModel = require("../models/account-model")

/* Deliver login view */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash("notice")
    })
  } catch (err) {
    next(err)
  }
}

/* Deliver registration view */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      messages: req.flash("notice")
    })
  } catch (err) {
    next(err)
  }
}

/* Process registration */
async function registerAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

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

module.exports = { buildLogin, buildRegister, registerAccount }
