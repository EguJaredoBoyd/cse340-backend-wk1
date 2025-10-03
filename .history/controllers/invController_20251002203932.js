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
    const classificationSelect = await utilities.buildClassificationList()
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

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  try {
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("notice", `The classification ${classification_name} was successfully added.`)
      res.redirect("/inv")
    } else {
      req.flash("notice", "Sorry, adding classification failed.")
      res.status(501).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null
      })
    }
  } catch (err) {
    next(err)
  }
}


/* ***************************
 *  Build Add Vehicle view
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    // get classifications for dropdown
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

/* ***************************
 *  Process Add Vehicle form
 * ************************** */
invCont.addVehicle = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    } = req.body

    const addResult = await invModel.addVehicle(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )

    if (addResult) {
      req.flash("notice", `${inv_make} ${inv_model} was successfully added.`)
      res.redirect("/inv/")
    } else {
      let nav = await utilities.getNav()
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      req.flash("notice", "Sorry, the vehicle could not be added.")
      res.status(501).render("./inventory/add-vehicle", {
        title: "Add New Vehicle",
        nav,
        classificationSelect,
        errors: null,
        messages: req.flash("notice")
      })
    }
  } catch (err) {
    next(err)
  }
}

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
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const invId = req.params.inv_id
    const data = await invModel.getInventoryById(invId)

    if (!data || !data.rows || data.rows.length === 0) {
      return next({ status: 404, message: "Vehicle not found." })
    }

    const vehicle = data.rows[0]
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
 *  Build Add Vehicle view (GET)
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classifications = await invModel.getClassifications()

    res.render("./inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      classifications: classifications.rows, // pass classifications to dropdown
      errors: null,
      messages: req.flash("notice")
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Process Add Vehicle (POST)
 * ************************** */
invCont.addVehicle = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    } = req.body

    const result = await invModel.addVehicle(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )

    if (result) {
      req.flash("notice", `Successfully added ${inv_year} ${inv_make} ${inv_model}`)
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, adding the vehicle failed.")
      res.redirect("/inv/add-vehicle")
    }
  } catch (err) {
    next(err)
  }
}




module.exports = invCont
