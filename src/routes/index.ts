import { Router } from 'express';

// Rutas
import { UserRouter } from './users';
export const routes = Router();

routes.use('/usuario', UserRouter)


// Validación de funcionamiento
routes.get('/', function(req, res) {
    res.status(200).send({
        message: 'API INC',
    });
});