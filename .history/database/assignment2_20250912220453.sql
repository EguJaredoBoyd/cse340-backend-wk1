INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- 2) Update Tony Stark's account_type to 'Admin'
-- Best practice: find his primary key first, then update by id.
-- Example: (run the SELECT first to find account_id)
SELECT account_id
FROM account
WHERE account_email = 'tony@starkent.com';
-- Then (replace <account_id> with the actual id):
UPDATE account
SET account_type = 'Admin'
WHERE account_id = < account_id >;
-- 3) Delete the Tony Stark record
-- Preferred: delete by primary key
DELETE FROM account
WHERE account_id = < account_id >;
-- 4) Replace text inside GM Hummer's description using PostgreSQL replace()
-- First locate the inv_id for the GM Hummer (or use its unique id).
SELECT inv_id,
    inv_description
FROM inventory
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Then run (replace <inv_id> with actual id):
UPDATE inventory
SET inv_description = replace(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = < inv_id >;
-- 5) Use inner join to select make, model, and classification name for classification "Sport"
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM inventory i
    INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- 6) Update all inventory rows to add '/vehicles' to the middle of the image paths
-- This replaces '/images/' with '/images/vehicles/' in both columns:
UPDATE inventory
SET inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');