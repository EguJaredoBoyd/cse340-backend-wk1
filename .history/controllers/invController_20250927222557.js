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

/* ***************************
 *  Build vehicle detail view
 *  Example URL: /inv/detail/5
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const invId = req.params.inv_id // grab id from URL
    const data = await invModel.getInventoryById(invId)

    // check if no vehicle found
    if (!data || !data.rows || data.rows.length === 0) {
      return next({ status: 404, message: "Vehicle not found." })
    }

    const vehicle = data.rows[0] // one single car
    const vehicleDetailHtml = await utilities.buildVehicleDetail(vehicle)
    const nav = await utilities.getNav()

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleDetail: vehicleDetailHtml,
      classificationId: vehicle.classification_id
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build inventory management view
 *  Example URL: /inv/
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      messages: req.flash("notice")
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Deliver add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      messages: req.flash("notice")
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Deliver add vehicle view
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    // 🔑 We will pass classification select list later
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
      messages: req.flash("notice")
    })
  } catch (err) {
    next(err)
  }
}



module.exports = invCont
