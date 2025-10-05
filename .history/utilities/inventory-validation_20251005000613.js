/* ***************************
 *  Check data and return errors for new inventory
 * ************************** */
validate.checkInventoryData = async (req, res, next) => {
  let { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  let errors = []
  if (!inv_make || !inv_model || !inv_year || !inv_price || !inv_color) {
    errors.push("All fields are required.")
  }

  if (errors.length > 0) {
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      errors,
      classificationSelect,
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
    return
  }
  next()
}

/* ***************************
 *  Check data and return errors for updating inventory
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  let {
    inv_id,                // include this new field
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

  let errors = []
  if (!inv_make || !inv_model || !inv_year || !inv_price || !inv_color) {
    errors.push("All required fields must be filled out.")
  }

  if (errors.length > 0) {
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,   // same as in your editInventoryView controller
      errors,
      classificationSelect,
      inv_id,                // include so it stays in the hidden input
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
    return
  }
  next()
}
