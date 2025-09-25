const { body, validationResult } = require("express-validator")

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

    // email
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

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

module.exports = validate
