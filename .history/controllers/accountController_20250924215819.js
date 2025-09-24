// controllers/accountController.js
const utilities = require("../utilities")
const accountModel = require("../models/account-model")  // ✅ new require

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,              // ✅ Fix: ensures nav is available in the view
      errors: null,
      messages: req.flash("notice") // ✅ properly show flash messages
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,              // ✅ Fix: ensures nav is available in the view
      errors: null,
      messages: req.flash("notice") // ✅ properly show flash messages
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
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
      res.redirect("/account/login") // ✅ redirect instead of render
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