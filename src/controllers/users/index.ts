import { Request, Response } from 'express';
import { createConnection } from '../../bdConfig';
import { UserModel } from '../../models/Usuario.model';
import AuthService from '../../services/AuthService';
import * as jwt from 'jsonwebtoken';
import {secret} from '../../globals'

const auth = new AuthService();
// Procedimiento de usuarios
const SP_USUARIOS = 'CALL CRUD_USUARIOS(?, ?, ?, ?, ?, ?, ?, ?)'

export const getAllUsers = async (req: Request, res: Response) => {
    const connection = await createConnection();
    try {
        let sql = SP_USUARIOS;
        const [rows, fields] = await connection.execute(
            sql,
            [
                0, // p_id
                null, // p_nombres
                null, // p_apellidos
                null, // p_nick_name
                null, // p_password
                null, // p_status
                null, // p_fecha_nacimiento
                1    // p_opcion
            ]
        );
        const usuarios:any = rows
        // console.log(usuarios[0]);

        if(usuarios.length < 1) throw new Error("No hay usuarios registrados en el sistema.")
        

        return res.status(200).json(usuarios[0]); // Envía los resultados de la consulta como respuesta JSON

    } catch (error) {
        console.error(error);
        return res.status(500).send('Error al obtener los usuarios');
    } finally {
        await connection.end();
    }
};

export const createUser = async (req: Request, res: Response) => {
    const connection = await createConnection();
    try {
        let { id, nombres, apellidos, nick_name, fecha_nacimiento, password }: UserModel = req.body;

        console.log(req.body);

        if (!nick_name) {
            nick_name = `${nombres}_${apellidos}`;
        }

        if (!fecha_nacimiento) {
            fecha_nacimiento = new Date() // Asegúrate de que la fecha esté en formato YYYY-MM-DD
        } else {
            // Convertir la fecha al formato YYYY-MM-DD
            const dateParts = fecha_nacimiento.toString().split('/');
            fecha_nacimiento = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        }

        let pass_sha = await auth.encryptPassword(password);

        const [rows, fields] = await connection.execute(
            SP_USUARIOS,
            [
                0, nombres, apellidos, nick_name, pass_sha,
                'A', fecha_nacimiento, 3
            ]
        );



        return res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    } finally {
        await connection.end();
    }
};

export const login = async (req:Request, res:Response) => {
    
    const connection = await createConnection()
    try {
        let {password, nick_name}:UserModel = req.body

        
        
        const [rows, fields] = await connection.execute(
            SP_USUARIOS,
            [
                0, // p_id
                null, // p_nombres
                null, // p_apellidos
                nick_name, // p_nick_name
                null, // p_password
                null, // p_status
                null, // p_fecha_nacimiento
                6    // p_opcion
            ]
        ) 
        
        let resultados:any = rows
        // Revisar si trae resultados
        if(resultados[0].length < 1) throw new Error("No existe este usuario en el sistema.")
        
        
        // Utilizar resultado de usuario
        let usuario = resultados[0]        
        let passwordCorrecto = await auth.comparePassword(password, usuario[0].password)
        
        if(!passwordCorrecto) throw new Error("Credenciales incorrectas.")
        
        let user:UserModel = usuario[0]
        let tokenData = {
            id: user.id,
            nombres: user.nombres,
            apellidos: user.apellidos,
            nick_name: user.nick_name,
            telefono: 'x0000',
            correo: 'talvez@agrega',
            hash: '',
            activada: 'A',            
            Rol: {id:1, tipo:'admin'},
            invitado: false
        }    

        let duracionTokenDias = 300
        let rol = 'admin'
        const token = auth.generateToken(tokenData, duracionTokenDias);
        return res.status(201).send({
            error: false,
            message: 'login',
            token, user, rol

        })
    } catch (error) {
        return res.status(500).send('Error al obtener los usuarios');
    } finally {
        await connection.end()
    }
}

export const refreshLogin = async (req:Request, res:Response) => {
    const connection = await createConnection()
    try {
        let data:any = req.body
        let token:any = data.token
        
        if(!token) throw new Error("Recarcar e iniciar nuevamente sesion.")

        let tokenParseado:any = jwt.verify(token, secret, {
            ignoreExpiration: false
        });

        // Verificar si el token ya expiró
        let tiempoTranscurrido = Date.now().valueOf() / 1000;
        if (tokenParseado.exp < tiempoTranscurrido) throw new Error("Error al recargar, inicie sesión nuevamente por favor.");

        const [rows, fields] = await connection.execute(SP_USUARIOS,
            [
                tokenParseado.id,
                null, // p_nombres
                null, // p_apellidos
                null, // p_nick_name
                null, // p_password
                null, // p_status
                null, // p_fecha_nacimiento
                2    // p_opcion
            ]
        )

        let resultados:any = rows
        if(resultados[0].length < 1) throw new Error("No existe este usuario en el sistema.")
        let usuario = resultados[0]

        let user:UserModel = usuario[0]

        let tokenData = {
            id: user.id,
            nombres: user.nombres,
            apellidos: user.apellidos,
            nick_name: user.nick_name,
            telefono: 'x0000',
            correo: 'talvez@agrega',
            hash: '',
            activada: 'A',            
            Rol: {id:1, tipo:'admin'},
            invitado: false
        }            

        // Se genera el nuevo token
        const newToken = auth.generateToken(tokenData, 1);
        let rol = 'admin';

        // Se valida la clase del rol
        return res.status(201).send({ error: false, 
            message: "Usuario logueado correctamente", 
            token: newToken, 
            user: user, rol: rol })        

    } catch (error) {
        return res.status(500).send({
            error: true,
            message: 'Error en refresh login'
        });
    } finally {
        await connection.end()
    }
}