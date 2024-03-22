import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import hbs from 'express-hbs';
import mainRoute from './src/routes/mainRoute.js';

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



app.listen(process.env.SERVER_PORT, () => {
    console.log('server is now listening');
});


