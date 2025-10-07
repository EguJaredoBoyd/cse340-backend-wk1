const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/* **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registrationRules = () => {
  return [
    // firstname
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("First name is required.")
      .isLength({ min: 1 })
      .withMessage("First name must be at least 1 character."),

    // lastname
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Last name is required.")
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
    // password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must be at least 12 characters and include an uppercase letter, a number, and a special character."),
  ]
}

/* **********************************
*  Middleware to check validation
* ********************************* */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // Put all errors into flash messages
    errors.array().forEach(err => {
      req.flash("notice", err.msg)
    })
    // Redirect back to register form
    return res.redirect("/account/register")
  }
  next()
}


/* **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address."),
    
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}

/* **********************************
*  Middleware to check login validation
* ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors.array().forEach(err => req.flash("notice", err.msg))
    return res.redirect("/account/login")
  }
  next()
}

/* **********************************
*  Account Update Validation Rules
* ********************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("First name is required.")
      .isLength({ min: 1 })
      .withMessage("First name must be at least 1 character."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Last name is required.")
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const existingEmail = await accountModel.checkExistingEmail(account_email)
        if (existingEmail && existingEmail.account_id != req.body.account_id) {
          throw new Error("That email already exists. Please use a different one.")
        }
      })
  ]
}

/* **********************************
*  Middleware to check Account Update validation
* ********************************* */
validate.checkAccountUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors.array().forEach(err => req.flash("notice", err.msg))
    return res.redirect(`/account/update/${req.body.account_id}`)
  }
  next()
}

/* **********************************
*  Password Update Validation Rules
* ********************************* */
validate.passwordUpdateRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must be at least 12 characters and include an uppercase letter, a number, and a special character.")
  ]
}

/* **********************************
*  Middleware to check Password Update validation
* ********************************* */
validate.checkPasswordUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors.array().forEach(err => req.flash("notice", err.msg))
    return res.redirect(`/account/update/${req.body.account_id}`)
  }
  next()
}




module.exports = validate
