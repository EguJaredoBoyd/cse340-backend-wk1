const errorController = {}

errorController.triggerError = async function (req, res, next) {
  // Intentionally throw an error
  throw new Error("🚨 Intentional Server Error for testing!")
}

module.exports = errorController
