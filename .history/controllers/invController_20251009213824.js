// controllers/invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      req.flash("notice", "No vehicles found for this classification.")
      return res.redirect("/inv")
    }

    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build vehicle detail view
 *  Example URL: /inv/detail/5
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
      classificationId: vehicle.classification_id,
      vehicle
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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build Add Classification View
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
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("notice", `The classification "${classification_name}" was successfully added.`)
      res.redirect("/inv")
    } else {
      req.flash("notice", "Sorry, adding classification failed.")
      let nav = await utilities.getNav()
      res.status(501).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        messages: req.flash("notice")
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
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classificationId)
    const invData = await invModel.getInventoryByClassificationId(classification_id)

    if (invData && invData[0] && invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  } catch (err) {
    next(err)
  }
  
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getInventoryById(inv_id)

    // get the first row from the query
    const itemData = data.rows[0]

    if (!itemData) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/inv")
    }

    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()

    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    // ensure inv_id is a number
    const id = parseInt(inv_id, 10)

    const updateResult = await invModel.updateInventory(
      id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
      req.flash("notice", `The ${itemName} was successfully updated.`)
      return res.redirect("/inv/")
    } else {
      // re-render edit view (sticky) on failure
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the update failed.")
      return res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect,
        errors: null,
        inv_id: id,
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
      })
    }
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    if (Number.isNaN(inv_id)) {
      return next({ status: 400, message: "Invalid inventory id" })
    }

    const data = await invModel.getInventoryById(inv_id)
    if (!data || !data.rows || data.rows.length === 0) {
      return next({ status: 404, message: "Vehicle not found." })
    }

    const item = data.rows[0]
    const nav = await utilities.getNav()
    const itemName = `${item.inv_make} ${item.inv_model}`

    res.render("./inventory/delete-confirm", {
      title: `Delete ${itemName}`,
      nav,
      errors: null,
      inv_id: item.inv_id,
      inv_make: item.inv_make,
      inv_model: item.inv_model,
      inv_year: item.inv_year,
      inv_price: item.inv_price,
      classification_id: item.classification_id,
      notice: req.flash("notice")
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Delete Inventory Item (POST)
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    if (Number.isNaN(inv_id)) {
      req.flash("notice", "Invalid inventory id.")
      return res.redirect("/inv/")
    }

    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    // if model returns query result object, check rowCount; if boolean, accept true
    const ok =
      (deleteResult && deleteResult.rowCount && deleteResult.rowCount > 0) ||
      deleteResult === true

    if (ok) {
      req.flash("notice", `Inventory item was successfully deleted.`)
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      return res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (err) {
    next(err)
  }
}



module.exports = invCont
