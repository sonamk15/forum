const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
require('dotenv').config()
const moment = require('moment');

const routerMap = require('./router')
const db = require('./src/db')
const folder = "../api-log";


let app = express();
// database credencials
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;
const DB_URL = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

initialSetup = () => {
    app.use(bodyparser.json())
    app.use(bodyparser.urlencoded({extended:true}))
    app.use(express.json())
    app.use(express.urlencoded({extended:false}))
    app.use(cors({origin:'*'}))

    // setup the logger
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
        fs.writeFileSync(`${folder}/log.json` ,JSON.stringify([]));
    }
    
    app.use(morgan( (tokens, req, res) => {
        let rawdata = fs.readFileSync(`${folder}/log.json`);
        let jsonData = JSON.parse(rawdata)
        const data = { "METHOD:": tokens.method(req, res),
        "URI:": tokens.url(req, res),
        "STATUS_CODE:": tokens.status(req, res),
        "BODY:": JSON.stringify(req.body),
        "PARAMS": JSON.stringify(req.params),
        "QUERY_PARAMS": JSON.stringify(req.query),
        "HEADER:": JSON.stringify(req.headers),
        "API_RES": req.apiRes ? JSON.stringify(req.apiRes): null,
        "RESPONCE_TIME:": `${tokens['response-time'](req, res)}ms`,
        "TOTAL_RES_TIME:": `${tokens['total-time'](req, res)}ms`,
        "REQ_DATE_TIME:": moment(tokens.date()).format("DD-MM-YYYY hh:mm:ss A")
        }
        jsonData.push(data)
        fs.writeFileSync(`${folder}/log.json`, JSON.stringify(jsonData, null, 2));
        return;
    }))   
}

//  route setup
routesSetups = ()=>{
    for (const iterator of routerMap) {
      console.log(`Initializing ${iterator.fileName} --> /api${iterator.path}`);
      const router = require(iterator.fileName);
        app.use(`/api/${iterator.path}`, (req, res, next)=>{
          next()
        }, ...[router])
      app.use(`/api${iterator.path}`, router);
      console.log(`👍`);
    }
}
  

databaseConnection = () => {
    db.connect(DB_URL)
}

initialSetup()
routesSetups()
databaseConnection()

app.listen(9000, ()=>{
    console.log("server is running at port no 9000")
})