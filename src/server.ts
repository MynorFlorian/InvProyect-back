import { createServer } from 'http';
import { app } from './app';
import debug from 'debug';

// Normalizacion de puertos
const normalizePort = (val: any) => {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // Si es mayor regresar el puerto
        return port;
    }

    return false;
}

let port = normalizePort(process.env.PORT || '4160');
app.set('port', port);

const server = createServer(app);

server.listen(port);
server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
        console.log('error');
        
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    console.log('hola');
    let addr:any = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log(`Server listening on port ${port}`);
});
