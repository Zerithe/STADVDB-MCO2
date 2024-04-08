import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import hbs from 'express-hbs';
import mainRoute from './routes/mainRoute.js'
import { Appointments, CentralNodeAppointments } from './DBConn.js';
//comment out which node you dont need
import { localConnection } from './DBConn.js';
import { centralNodeConnection } from './DBConn.js';
import { luzonNodeConnection } from './DBConn.js';
import { visMinNodeConnection } from './DBConn.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

//enables JSON parsing
app.use(express.json());
//enables URL encoded format parsing
app.use(express.urlencoded({extended: true}));

app.use('/static', express.static(path.join(__dirname, 'public')));

//connect to handlebars
app.engine('hbs', hbs.express4({partialsDir: path.join(__dirname, 'views', 'partials')}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(mainRoute);

//initialize database
async function initializeDB(){

    async function testConnection(sequelizeInstance, nodeName) {
        try {
          await sequelizeInstance.authenticate();
          console.log(`Connection has been established successfully to ${nodeName}.`);
        } catch (error) {
          console.error(`Unable to connect to the ${nodeName}:`, error);
        }
    }
    
    //comment out the connection to which node you dont need
    testConnection(localConnection, 'Local Node');
    testConnection(centralNodeConnection, 'Central Node');
    testConnection(luzonNodeConnection, 'Luzon Node');
    testConnection(visMinNodeConnection, 'VisMin Node');


    //comment out the connection to which node you dont need
    await localConnection.sync();
    await centralNodeConnection.sync();
    await luzonNodeConnection.sync();
    await visMinNodeConnection.sync();
}

initializeDB();

app.listen(process.env.SERVER_PORT, () => {
    console.log('server is now listening');
});

