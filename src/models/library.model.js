const db = require("../config/dbConnection");

const uploadMediaInDB = async (fileUrl, fileType, fileName, duration, fileSizeMB, customer_id) => {
  console.log("File size in MB:", fileSizeMB);

  const query = fileType.startsWith("video/") 
    ? 'INSERT INTO mediafiles (url, type, filename, duration, size, customer_id) VALUES ($1, $2, $3, $4, $5, $6)' 
    : 'INSERT INTO mediafiles (url, type, filename, size, customer_id) VALUES ($1, $2, $3, $4, $5)';

  const values = fileType.startsWith("video/") 
    ? [fileUrl, fileType, fileName, duration, fileSizeMB, customer_id] 
    : [fileUrl, fileType, fileName, fileSizeMB, customer_id];

  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (err) {
    console.error("Error occurred while uploading files to database:", err.message || JSON.stringify(err)); // Improved error message
    throw err;
  }
};


const viewMedia = async () => {
  try {
    const result = await db.query("SELECT * FROM mediafiles WHERE customer_id IS NULL ORDER BY id DESC");
    return result.rows;
  } catch (err) {
    console.error("Error occurred while viewing files from the database:", err);
    throw err;
  }
};


const getPhotoes = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM mediafiles WHERE type LIKE 'image/%' ORDER BY id DESC;"
    );
    return result.rows;
  } catch (err) {
    console.error(
      "error occur viewing  photoes images files from database:",
      err
    );
    throw err;
  }
};

const getVideos = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM mediafiles WHERE type LIKE 'video/%' ORDER BY id DESC;"
    );
    return result.rows;
  } catch (err) {
    console.error("error occur viewing videos from database:", err);
    throw err;
  }
};

const getmediafileCount = async () => {
  try {
    const result = await db.query("SELECT COUNT(*) AS count FROM mediafiles");
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching screen count:", error);
    throw error;
  }
};
const deleteMediaById = async (id) => {
  try {
    const result = await db.query('DELETE FROM mediafiles WHERE id = $1 RETURNING *', [id]);
    return result.rows;
  } catch (err) {
    console.error("Error deleting media file from database:", err);
    throw err;
  }
};



























///   models fun for customer



//view videos in playlisat edit time customer
const EditPlaylistvMedia = async (customer_id) => {
  try {
    const result = await db.query(
      "SELECT * FROM mediafiles WHERE customer_id = $1 ORDER BY id DESC", 
      [customer_id]
    );
    return result.rows;
  } catch (err) {
    console.error("Error occurred while viewing files from the database:", err);
    throw err;
  }
};


// in playlist video  data in models customer 
const getCustomerMedia = async (customer_id) => {
  try {
    // Fetch media files for a specific customer (filter by customer_id)
    const result = await db.query("SELECT * FROM mediafiles WHERE customer_id = $1 ORDER BY id DESC", [customer_id]);
    return result.rows;
  } catch (err) {
    console.error("Error occurred while viewing files from the database:", err);
    throw err;
  }
};

                          

//customer 
// Function in models
const viewMediaByCustomer = async (customer_id) => {                            
  try {
    const result = await db.query("SELECT * FROM mediafiles WHERE customer_id = $1 ORDER BY id DESC", [customer_id]);
    return result.rows;
  } catch (err) {
    console.error("Error occurred while viewing files from database:", err);
    throw err;
  }
};










module.exports = {
  uploadMediaInDB,
  viewMedia,
  viewMediaByCustomer,
  getCustomerMedia,
  EditPlaylistvMedia,
  getPhotoes,
  getVideos,
  getmediafileCount,
  deleteMediaById,
};