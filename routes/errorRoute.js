const express = require("express")
const router = express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Intentional error route
router.get("/trigger-error", utilities.handleErrors(errorController.triggerError))

module.exports = router
