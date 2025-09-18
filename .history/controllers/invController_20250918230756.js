const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// 🚗 NEW controller for vehicle details
async function buildByInvId(req, res, next) {
  try {
    const invId = req.params.inv_id // grab id from URL
    const data = await invModel.getInventoryById(invId)

    if (!data || !data.rows || data.rows.length === 0) {
      return next({ status: 404, message: "Vehicle not found." })
    }

    const vehicle = data.rows[0] // just one car
    const vehicleDetailHtml = await utilities.buildVehicleDetail(vehicle)

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav: await utilities.getNav(),
      vehicleDetail: vehicleDetailHtml,
    })
  } catch (err) {
    next(err)
  }
}


  module.exports = invCont
