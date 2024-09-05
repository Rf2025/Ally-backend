const mysql = require('mysql2/promise');

//create all the tables the team, ensure that they are configured correctly otherwise you cant impirt

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS
})


//this function is used to check for a datbase connection
async function checkConnection() {
  try {
    console.log('Database is CONNECTED');
    return true;
  } catch (error) {
    console.error('ERROR DATABASE CONNECTION FAILED', error.message);
    return false;
  }
}

//check for database connections
checkConnection().then(isConnected => {
  if (isConnected) {
    console.log('Database is connected.');
  } else {
    console.log('ERROR DATABASE IS NOT CONNECTED');
  }
});



module.exports = connection;
