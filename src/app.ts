import express from 'express'
import * as bodyParser from 'body-parser';
import * as path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
let momentZone = require('moment-timezone');
const busboy = require('connect-busboy');

// Index de rutas
import { routes } from './routes';

export const app = express();
console.log('app');


app.set('views', path.join(__dirname, 'pug'));
app.set('view engine', 'pug');

app.use(cors());

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(busboy())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', routes);

let updateDate = momentZone().tz('America/Guatemala').format();

app.use('/', function(req:any, res:any) {
    // console.log('bueno');
    
    res.status(200).send({
        message: 'Ultima actualización: '+ updateDate,
    });
});

// Captura de error 404
app.use(function (req, res, next) {
    console.log('malo');
    
    var err = new Error('Not Found');
    err.message = 'Error 404';
    next(err);
});

// Handler para errores
app.use(function (err:any, req:any, res:any, next:any) {
    // Entorno de desarrollo
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});
