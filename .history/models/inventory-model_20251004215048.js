const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}




//module.exports = {getClassifications}

/* ***************************
 *  Get inventory items by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT 
        inv_id, 
        inv_make, 
        inv_model, 
        inv_year, 
        inv_price, 
        inv_miles, 
        inv_color, 
        inv_image, 
        inv_thumbnail, 
        i.classification_id, 
        c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
      ORDER BY inv_make, inv_model;
    `

    const data = await pool.query(sql, [classification_id])
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error)
    throw error
  }
}


// 🚗 NEW: Get a single vehicle by id
async function getInventoryById(inv_id) {
  return await pool.query(
    "SELECT * FROM public.inventory WHERE inv_id = $1",
    [inv_id]
  )
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}


/* *****************************
*  Add New Vehicle
* *************************** */
async function addVehicle(
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
) {
  try {
    const sql = `
      INSERT INTO inventory (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `

    const data = await pool.query(sql, [
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
    ])

    return data.rows[0] // return the inserted vehicle
  } catch (error) {
    console.error("addVehicle error:", error)
    return null
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addVehicle};