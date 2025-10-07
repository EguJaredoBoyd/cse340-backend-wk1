const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* Deliver login view */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      // ❌ remove messages: req.flash("notice")
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
      // ❌ remove messages: req.flash("notice")
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
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
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

/* Process login request */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  try {
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    const validPassword = await bcrypt.compare(account_password, accountData.account_password)
    if (!validPassword) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    const payload = {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type,
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600 * 1000,
    })

    req.flash("notice", "You are logged in.")
    res.redirect("/account/")
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "An error occurred. Please try again.")
    res.redirect("/account/login")
  }
}

/* Deliver account management view */
async function buildAccountManagement(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const accountData = res.locals.accountData

    // Extract key info from the JWT payload
    const name = accountData.account_firstname
    const accountId = accountData.account_id
    const accountType = accountData.account_type

    // Show inventory link only for Employee or Admin
    const showInventoryLink = accountType === "Employee" || accountType === "Admin"

    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      name,
      accountId,
      showInventoryLink,
      accountType,
    })
  } catch (err) {
    next(err)
  }
}

/* Build Update Account view */
async function buildUpdateAccount(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const accountData = res.locals.accountData

    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id,
    })
  } catch (err) {
    next(err)
  }
}

/* Process Account Info Update */
async function updateAccountInfo(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body

    const updateResult = await accountModel.updateAccountInfo(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

    if (updateResult) {
      req.flash("notice", "Account information updated successfully.")
      res.redirect("/account/")
    } else {
      req.flash("notice", "Update failed. Try again.")
      res.redirect(`/account/update/${account_id}`)
    }
  } catch (err) {
    next(err)
  }
}

/* Process Password Update */
async function updatePassword(req, res, next) {
  try {
    const { account_password, account_id } = req.body
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      res.redirect("/account/")
    } else {
      req.flash("notice", "Password update failed. Try again.")
      res.redirect(`/account/update/${account_id}`)
    }
  } catch (err) {
    next(err)
  }
}

/* Process Account Update */
async function updateAccount(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const result = await accountModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id)

    if (result) {
      req.flash("notice", "Account information updated successfully.")
      return res.redirect("/account/management")
    } else {
      req.flash("notice", "Account update failed. Please try again.")
      res.redirect(`/account/update/${account_id}`)
    }
  } catch (error) {
    next(error)
  }
}




module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccount, updateAccountInfo, updatePassword, updateAccount }
