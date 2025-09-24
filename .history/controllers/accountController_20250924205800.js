// controllers/accountController.js
const utilities = require("../utilities")

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

module.exports = { buildLogin, buildRegister }
