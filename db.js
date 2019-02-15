const pg = require('pg');
const cfenv = require("cfenv");
const url= require("url");


const appEnv = cfenv.getAppEnv();
 
const config = {
  user: appEnv.services.postgresql[0].credentials.username,
  database: appEnv.services.postgresql[0].credentials.dbname,
  password: appEnv.services.postgresql[0].credentials.password,
  host: appEnv.services.postgresql[0].credentials.hostname,
  port: appEnv.services.postgresql[0].credentials.port,
  max: 10,
  idleTimeoutMillis: 30000
}; 


const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log("Connected to the database");
});

function createTable() {

  const chatsTable = "CREATE TABLE IF NOT EXISTS chats(msgId SERIAL PRIMARY KEY,"+
              "userId integer DEFAULT NULL,"+"msg varchar(1000) DEFAULT NULL,"+
              "create_at timeStamptz NOT NULL DEFAULT now())";
  
  const userInfoTable = "CREATE TABLE IF NOT EXISTS userInfo(id SERIAL PRIMARY KEY,"+
                    "name varchar(20) DEFAULT NULL,mail varchar(1000) DEFAULT NULL)";

  pool.query(chatsTable)
    .then(res => {
      console.log(res);
    })
    .then(pool.query(userInfoTable))
    .then(res =>{
      console.log(res);
    })
    .catch(err => {
      console.log("Error in catch ", err)
      pool.end();
    })
}

createTable();

module.exports = {
  createTable
}
 