import mysql from 'mysql2/promise';

// Crear una conexión única a la base de datos
const createConnection = async () => {
    return await mysql.createConnection({
        host: '127.0.0.1',        
        port: 3306,
        user: 'root',
        // rowsAsArray: true,
        password: '',
        database: 'Inventarios',
    });
};

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    // rowsAsArray: true,
    database: 'Inventarios',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export { createConnection, pool };
