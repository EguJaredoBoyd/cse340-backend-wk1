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
      messages: []      // ✅ Fix: prevents "messages.forEach is not a function"
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
      messages: []      // ✅ Fix: prevents "messages.forEach is not a function"
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult && regResult.rowCount > 0) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: []
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      messages: []
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }

