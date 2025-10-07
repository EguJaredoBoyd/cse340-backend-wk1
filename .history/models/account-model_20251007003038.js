const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING *`
    
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])

    return data.rows[0]  // ✅ return just the inserted account
  } catch (error) {
    console.error("Database error:", error)
    return null // ✅ return null instead of error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* Update account info */
async function updateAccountInfo(firstname, lastname, email, id) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `
    const data = await pool.query(sql, [firstname, lastname, email, id])
    return data.rowCount
  } catch (error) {
    console.error("Error updating account info:", error)
    return null
  }
}

/* Update password */
async function updatePassword(password, id) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;
    `
    const data = await pool.query(sql, [password, id])
    return data.rowCount
  } catch (error) {
    console.error("Error updating password:", error)
    return null
  }
}

/* Get account by ID (needed to prefill update form) */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_id = $1",
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById error: " + error)
  }
}

/* Update account password (hashed) */
async function updateAccountPassword(hashedPassword, account_id) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;
    `
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("updateAccountPassword error: " + error)
  }
}



module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, updateAccountInfo, updatePassword, getAccountById, updateAccountPassword }
